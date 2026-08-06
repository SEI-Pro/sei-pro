(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

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
    const root3 = getSeiPro();
    root3.linkState = function(name) {
      if (Object.prototype.hasOwnProperty.call(root3.state, name)) {
        return;
      }
      try {
        Object.defineProperty(root3.state, name, {
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
        root3.state[name] = globalRef[name];
      }
    };
    return root3;
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
  function getParamsUrlPro2(url) {
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
        }
        params[key] = value;
      }
      return params;
    }
    return false;
  }
  function removeAcentos2(str) {
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
  function capitalizeFirstLetter2(string) {
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
  function randomString2(length) {
    let result = "";
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
  function uniqPro2(a) {
    return a.sort().filter(function(item, pos, ary) {
      return !pos || item !== ary[pos - 1];
    });
  }
  function installUtil() {
    const util = {
      compareVersionNumbers,
      getParamsUrlPro: getParamsUrlPro2,
      removeAcentos: removeAcentos2,
      romanToInt,
      capitalizeFirstLetter: capitalizeFirstLetter2,
      randomString: randomString2,
      uniqPro: uniqPro2
    };
    getSeiPro().core.util = util;
    aliasGlobal("compareVersionNumbers", compareVersionNumbers);
    aliasGlobal("getParamsUrlPro", getParamsUrlPro2);
    aliasGlobal("removeAcentos", removeAcentos2);
    aliasGlobal("romanToInt", romanToInt);
    aliasGlobal("capitalizeFirstLetter", capitalizeFirstLetter2);
    aliasGlobal("randomString", randomString2);
    aliasGlobal("uniqPro", uniqPro2);
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
      const $2 = globalRef.jQuery || globalRef.$;
      if ($2 && $2('script[data-config="config-seipro"]').length > 0) {
        return;
      }
      const pathExtensionSEIPro = getSeiPro().core.runtime.pathExtensionSEIPro;
      const getManifestExtension = getSeiPro().core.runtime.getManifestExtension;
      const URL_SPRO2 = pathExtensionSEIPro();
      const manifest = getManifestExtension();
      setSessionNameSpace({
        URL_SPRO: URL_SPRO2,
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

  // src/shared/config-defaults.js
  var DEFAULT_ENABLED_CONFIG_OPTIONS = [
    "filtrarpaginapelapesquisarapida",
    "gerenciarmonitorados",
    "marcar_naolido",
    "uploaddocsexternos",
    "infoarvore",
    "mostraranotacaocontrole",
    "autopreenchersenha"
  ];
  function isDefaultEnabledConfigOption(name) {
    return DEFAULT_ENABLED_CONFIG_OPTIONS.indexOf(String(name || "")) !== -1;
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
    function verifyConfigValue2(name) {
      return queryConfigValue(name) === true;
    }
    function getConfigValue2(name) {
      return queryConfigValue(name);
    }
    function isDefaultEnabledConfigValue(name) {
      return isDefaultEnabledConfigOption(name);
    }
    function checkConfigValue2(name) {
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
      verifyConfigValue: verifyConfigValue2,
      getConfigValue: getConfigValue2,
      isDefaultEnabledConfigValue,
      checkConfigValue: checkConfigValue2
    };
    getSeiPro().core.config = config;
    aliasGlobal("verifyConfigValue", verifyConfigValue2);
    aliasGlobal("getConfigValue", getConfigValue2);
    aliasGlobal("isDefaultEnabledConfigValue", isDefaultEnabledConfigValue);
    aliasGlobal("checkConfigValue", checkConfigValue2);
    return config;
  }

  // src/core/validacao.js
  function extractCPFs2(text) {
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
  function isValidHttpUrl2(string) {
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
      extractCPFs: extractCPFs2,
      validaCPF,
      maskCNPJ,
      maskCPF,
      maskPEN,
      validateEmail,
      escapeHtml,
      isValidHttpUrl: isValidHttpUrl2
    };
    getSeiPro().core.validacao = validacao;
    aliasGlobal("extractCPFs", extractCPFs2);
    aliasGlobal("validaCPF", validaCPF);
    aliasGlobal("maskCNPJ", maskCNPJ);
    aliasGlobal("maskCPF", maskCPF);
    aliasGlobal("maskPEN", maskPEN);
    aliasGlobal("validateEmail", validateEmail);
    aliasGlobal("escapeHtml", escapeHtml);
    aliasGlobal("isValidHttpUrl", isValidHttpUrl2);
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
  function extractEmails2(text) {
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
  function getHashTagsPro2(inputText) {
    const regex = /(?:^|\s)(?:#)([a-zA-Z+-§\d]+)/gm;
    const matches = [];
    let match;
    while (match = regex.exec(inputText)) {
      matches.push(match[1].trim().replace(/\.|\,|\:|\//g, ""));
    }
    return matches;
  }
  function normalizeNameTag(tag) {
    return removeAcentos2(tag).replace(/\ /g, "").toLowerCase().replace(/[^a-z0-9]/gi, "").replace(/[\u200B-\u200D\uFEFF]/g, "");
  }
  function encodeURI_toHex(str) {
    let hex, i;
    let result = "";
    for (i = 0; i < str.length; i++) {
      const test = removeAcentos2(str.charAt(i));
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
      const test = removeAcentos2(str.charAt(i));
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
      extractEmails: extractEmails2,
      extractAllTextBetweenQuotes,
      extractOnlyAlphaNum,
      joinAnd,
      is_html,
      normalizeHTML,
      getHashTagsPro: getHashTagsPro2,
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
    aliasGlobal("extractEmails", extractEmails2);
    aliasGlobal("extractAllTextBetweenQuotes", extractAllTextBetweenQuotes);
    aliasGlobal("extractOnlyAlphaNum", extractOnlyAlphaNum);
    aliasGlobal("joinAnd", joinAnd);
    aliasGlobal("is_html", is_html);
    aliasGlobal("normalizeHTML", normalizeHTML);
    aliasGlobal("getHashTagsPro", getHashTagsPro2);
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
  function rgbToHexString2(string) {
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
  function getBrightnessColor2(value) {
    const rgb = hexToRgb(value);
    return Math.round((parseInt(rgb.r) * 299 + parseInt(rgb.g) * 587 + parseInt(rgb.b) * 114) / 1e3);
  }
  function installCor() {
    const cor = { componentToHex, rgbToHex, rgbToHexString: rgbToHexString2, hexToRgb, addAlpha, getBrightnessColor: getBrightnessColor2 };
    getSeiPro().core.cor = cor;
    aliasGlobal("componentToHex", componentToHex);
    aliasGlobal("rgbToHex", rgbToHex);
    aliasGlobal("rgbToHexString", rgbToHexString2);
    aliasGlobal("hexToRgb", hexToRgb);
    aliasGlobal("addAlpha", addAlpha);
    aliasGlobal("getBrightnessColor", getBrightnessColor2);
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
    const $2 = globalRef.jQuery || globalRef.$;
    const dateStart = moment(date, "YYYY-MM-DD");
    const dateEnd = moment(dateTo, "YYYY-MM-DD");
    const datesHoliday = [];
    while (dateEnd > dateStart || dateStart.format("Y") === dateEnd.format("Y")) {
      $2.merge(datesHoliday, getHolidaysBr(parseInt(dateStart.format("YYYY"))));
      if (addHolidays) {
        const addHoliday = $2.map(addHolidays, function(v) {
          if (v.recorrente) {
            const feriado_data = moment(v.feriado_data + "/" + dateStart.format("YYYY"), "DD/MM/YYYY");
            return { m: feriado_data, dia: v.nome_feriado, d: feriado_data.format("DD/MM/YYYY"), d_: feriado_data.format("YYYY-MM-DD"), meio_periodo: v.meio_periodo };
          } else if (!v.recorrente && dateStart.format("Y") == moment(v.feriado_data, "DD/MM/YYYY").format("Y")) {
            const feriado_data = moment(v.feriado_data, "DD/MM/YYYY");
            return { m: feriado_data, dia: v.nome_feriado, d: feriado_data.format("DD/MM/YYYY"), d_: feriado_data.format("YYYY-MM-DD"), meio_periodo: v.meio_periodo };
          }
        });
        $2.merge(datesHoliday, addHoliday);
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
  function buildDataRecebimentoRecord(listAndamento, unidadeAtual, options = {}) {
    const andamento = listAndamento && Array.isArray(listAndamento.andamento) ? listAndamento.andamento : [];
    const { datetime = "", observacoes = "", acompanhamentoesp = "" } = options;
    let datesend = "", descricaosend = "", unidadesend = "", unidadesendfull = "";
    let datageracao = "", descricaodatageracao = "";
    const geracao = andamento.find((item) => item.descricao && (item.descricao.indexOf("Processo p\xFAblico gerado") !== -1 || item.descricao.indexOf("Processo restrito gerado") !== -1));
    if (geracao) {
      datageracao = geracao.datahora;
      descricaodatageracao = geracao.descricao;
    }
    const remessa = andamento.find((item) => item.unidade === unidadeAtual && item.descricao && item.descricao.indexOf("Processo remetido pela unidade") !== -1);
    if (remessa) {
      datesend = remessa.datahora;
      descricaosend = remessa.descricao;
      unidadesend = remessa.descricao.replace("Processo remetido pela unidade", "").trim();
      unidadesendfull = remessa.descricao_alt !== "" ? remessa.descricao_alt + " - " + unidadesend : "";
    }
    const recebimento = andamento.find((item) => {
      if (item.unidade !== unidadeAtual || !item.descricao) return false;
      return item.descricao === "Processo recebido na unidade" || item.descricao === "Reabertura do processo na unidade" || item.descricao === "Processo p\xFAblico gerado" || item.descricao.indexOf("Processo restrito gerado") !== -1;
    });
    if (!recebimento) return null;
    return {
      id_procedimento: listAndamento.id_procedimento,
      processo: listAndamento.processo,
      datahora: recebimento.datahora,
      unidade: recebimento.unidade,
      descricao: recebimento.descricao,
      datetime,
      datesend,
      descricaosend,
      unidadesend,
      unidadesendfull,
      datageracao,
      descricaodatageracao,
      observacoes,
      acompanhamentoesp
    };
  }
  function persistDataRecebimentoRecord(record, dependencies = {}) {
    const { restore, store, isEmptyObject = (value) => value && typeof value === "object" && Object.keys(value).length === 0 } = dependencies;
    if (!record || typeof restore !== "function" || typeof store !== "function") return [];
    const saved = restore("configDataRecebimentoPro");
    const records = typeof saved !== "undefined" && saved !== null && !isEmptyObject(saved) ? saved : [];
    const next = Array.isArray(records) ? records.slice() : [];
    const index = next.findIndex((item) => item && item.id_procedimento == record.id_procedimento);
    if (index === -1) next.push(record);
    else next[index] = record;
    store("configDataRecebimentoPro", next);
    return next;
  }
  function getDateSemantic(config) {
    const moment = globalRef.moment;
    const jmespath2 = globalRef.jmespath;
    var formatDate = "YYYY-MM-DD HH:mm:ss";
    var displayFormat = config.displayformat ? config.displayformat : "DD/MM/YYYY";
    var duration = config.countdays ? moment(config.dateTo, formatDate).diff(moment(config.date, formatDate), "days") : moment(config.date, formatDate).diff(moment(config.dateTo, formatDate), "days");
    var listaFeriados = config.workday && config.countdays ? getHolidayBetweenDates(moment(config.date, formatDate).format("Y") + "-01-01", moment(config.dateTo, formatDate).format("Y") + "-01-01") : [];
    var arrayFeriados = config.workday && config.countdays ? jmespath2.search(listaFeriados, "[*].d_") : [];
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
      buildDataRecebimentoRecord,
      persistDataRecebimentoRecord,
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
  function randomNumber2(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function hasNumber2(str) {
    return /\d/.test(str);
  }
  function onlyNumber2(str) {
    return hasNumber2(str) ? str.match(/\d+/g).join("") : str;
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
      randomNumber: randomNumber2,
      hasNumber: hasNumber2,
      onlyNumber: onlyNumber2,
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
    aliasGlobal("randomNumber", randomNumber2);
    aliasGlobal("hasNumber", hasNumber2);
    aliasGlobal("onlyNumber", onlyNumber2);
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
  function isBase642(str) {
    try {
      return btoa(atob(str)) == str;
    } catch (err) {
      return false;
    }
  }
  function installSerial() {
    const serial = { isJson, tryParseJsonObject, convertJsonBools, isBase64: isBase642 };
    getSeiPro().core.serial = serial;
    aliasGlobal("isJson", isJson);
    aliasGlobal("tryParseJsonObject", tryParseJsonObject);
    aliasGlobal("convertJsonBools", convertJsonBools);
    aliasGlobal("isBase64", isBase642);
    return serial;
  }

  // src/core/prazos.js
  function getRecalculaPrazo(data_ref, hora_format, prazo, config_unidade) {
    const moment = globalRef.moment;
    const jmespath2 = globalRef.jmespath;
    var workday = config_unidade.count_dias_uteis;
    var config_feriados = typeof config_unidade.feriados !== "undefined" && config_unidade.feriados !== null ? config_unidade.feriados : false;
    var arrayFeriados = workday ? jmespath2.search(getHolidayBetweenDates(moment(data_ref, hora_format).format("Y") + "-01-01", moment(data_ref, hora_format).add(1, "Y").format("Y") + "-01-01", config_feriados), "[*].d_") : [];
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
    var normalized = removeAcentos2(content).toLowerCase();
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
    var dateTo = content && removeAcentos2(content).toLowerCase().indexOf("ate") !== -1 ? true : false;
    var dateContent = content ? content.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img) : null;
    var timeContent = content ? content.match(/(\d{1,2}:\d{2})/img) : null;
    var dateTag = dateContent !== null ? dateContent[0] + " " + (timeContent !== null ? timeContent[0] : "23:59") : false;
    return { content, dateTo, dateTag };
  }
  function parsePrazoTooltip(textTag) {
    const moment = globalRef.moment;
    textTag = typeof textTag !== "undefined" && textTag !== null ? textTag : "";
    var regexDue = /(ate )(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
    var checkDateDue = regexDue.exec(removeAcentos2(textTag.trim()).toLowerCase().replaceAll("  ", " "));
    var datePrazoDue = checkDateDue !== null ? moment(checkDateDue[0], "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss") : false;
    var regex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
    var checkDate = regex.exec(removeAcentos2(textTag.trim()));
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
    text = removeAcentos2(text.toLowerCase());
    return text.replace(/\s+/g, " ").trim();
  }
  function getFilterTokens(text) {
    var query2 = normalizeFilterText(text);
    return query2 === "" ? [] : uniqPro2(query2.split(" ").filter(function(token) {
      return token !== "";
    }));
  }
  function getNormalizedIndexMap(text) {
    var normalized = "";
    var map2 = [];
    for (var i = 0; i < text.length; i++) {
      var normalizedChar = removeAcentos2(text.charAt(i).toLowerCase());
      if (typeof normalizedChar !== "string") normalizedChar = text.charAt(i).toLowerCase();
      for (var j = 0; j < normalizedChar.length; j++) {
        normalized += normalizedChar.charAt(j);
        map2.push(i);
      }
    }
    return { normalized, map: map2 };
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
    var root3 = scope || doc.body;
    if (!root3 || typeof root3.querySelectorAll !== "function") return;
    var spans = root3.querySelectorAll("." + HIGHLIGHT_CLASS);
    for (var i = 0; i < spans.length; i++) {
      var span = spans[i];
      if (span.parentNode) {
        span.parentNode.replaceChild(doc.createTextNode(span.textContent), span);
      }
    }
    if (typeof root3.normalize === "function") root3.normalize();
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
    var map2 = getDocsLoteNormalChars(encoding);
    var regex = new RegExp(Object.keys(map2).join("|"));
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
    return docslote;
  }

  // src/core/docslote-legacy-api.js
  function installDocsLoteLegacyApi() {
    aliasGlobal("docsLote_specialChars", docsLoteSpecialChars);
    aliasGlobal("docsLote_normalChars_utf8", docsLoteNormalCharsUtf8);
    aliasGlobal("docsLote_normalChars_iso", docsLoteNormalCharsIso);
  }

  // src/core/ui.js
  function installUi() {
    function resolveTarget(elementTo, target) {
      const $2 = globalRef.jQuery || globalRef.$;
      if (!$2) {
        return null;
      }
      target = target || $2("html");
      if (target && target.find && typeof elementTo === "string") {
        return target.find(elementTo);
      }
      if (target && target.jquery) {
        return target;
      }
      return $2(elementTo);
    }
    function buildFontFaceStyles(pathExtension) {
      let html = '<style type="text/css" data-style="seipro-fonticon">    @font-face {\n       font-family: "Font Awesome 5 Pro";\n       font-style: normal;\n       font-weight: 900;\n       font-display: block;\n       src: url(' + pathExtension + 'webfonts/pro/fa-solid-900.woff2) format("woff2") !important;\n   }\n   @font-face {\n       font-family: "Font Awesome 5 Pro";\n       font-style: normal;\n       font-weight: 400;\n       font-display: block;\n       src: url(' + pathExtension + 'webfonts/pro/fa-regular-400.woff2) format("woff2") !important;\n   }\n';
      html += '   @font-face {\n       font-family: "Font Awesome 5 Duotone";\n       font-style: normal;\n       font-weight: 900;\n       font-display: block;\n       src: url(' + pathExtension + 'webfonts/pro/fa-duotone-900.woff2) format("woff2") !important;\n   }\n';
      html += "</style>";
      return html;
    }
    function loadFontIcons(elementTo, target) {
      const $2 = globalRef.jQuery || globalRef.$;
      if (!$2) return;
      target = target || $2("html");
      const pathExtension = getSeiPro().core.runtime.pathExtensionSEIPro();
      const appendTarget = resolveTarget(elementTo, target);
      if (target.find('link[data-style="seipro-fonticon"]').length === 0 && target.find('style[data-style="seipro-fonticon"]').length === 0) {
        $2("<link/>", {
          rel: "stylesheet",
          type: "text/css",
          "data-style": "seipro-fonticon",
          href: getSeiPro().core.runtime.getUrlExtension("css/fontawesome.pro.min.css")
        }).appendTo(appendTarget);
        const htmlStyleFont = buildFontFaceStyles(pathExtension);
        target.find("head").append(htmlStyleFont);
      }
    }
    function loadStylePro(url, elementTo, iframeTo) {
      const $2 = globalRef.jQuery || globalRef.$;
      if (!$2 || !url) return;
      const appendTarget = elementTo ? elementTo.jquery ? elementTo : $2(elementTo) : $2("head");
      const inspectTarget = iframeTo ? iframeTo.jquery ? iframeTo : $2(iframeTo) : appendTarget;
      const links = inspectTarget && typeof inspectTarget.find === "function" ? inspectTarget.find('link[data-style="seipro-style"]') : $2();
      const alreadyLoaded = links.toArray().some(
        (link) => link.getAttribute("href") === url || link.href === url
      );
      if (!alreadyLoaded) {
        $2("<link/>", {
          rel: "stylesheet",
          type: "text/css",
          "data-style": "seipro-style",
          href: url
        }).appendTo(appendTarget);
      }
    }
    function loadFilesUI() {
      const $2 = globalRef.jQuery || globalRef.$;
      if (!$2) return;
      if (typeof globalRef.jQuery.ui === "undefined") {
        $2.getScript(getSeiPro().core.runtime.getUrlExtension("js/lib/jquery-ui.min.js"));
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
      const $2 = globalRef.jQuery || globalRef.$;
      const slimEnabled = !!globalRef.localStorage.getItem("seiSlim");
      const darkEnabled = !!globalRef.localStorage.getItem("darkModePro");
      const parentNewSEI = !!(options.checkParentNewSEI && globalRef.parent && globalRef.parent.isNewSEI);
      if ($2 && body && typeof body.addClass === "function") {
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
    getSeiPro().core.storage = storage;
    return storage;
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
      let compact2 = logs.map((e) => String(e || "").trim()).filter((e) => e !== "");
      if (compact2.length > LOG_MAX_ENTRIES) compact2 = compact2.slice(compact2.length - LOG_MAX_ENTRIES);
      let totalChars = 0;
      const trimmed = [];
      for (let i = compact2.length - 1; i >= 0; i--) {
        let entry = compact2[i];
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
    function setAutoReportState(state2) {
      try {
        win.sessionStorage.setItem(AUTO_REPORT_STATE_KEY, JSON.stringify(state2));
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
      const state2 = getAutoReportState();
      if (state2.sent[signature]) return;
      if (state2.count >= AUTO_REPORT_MAX_PER_SESSION) return;
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
    function sessionStorageRestorePro2(item) {
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
    function sessionStorageRemovePro2(item) {
      session().removeItem(item);
    }
    function hybridStorageRestorePro(item) {
      if (localStorageRestorePro(item) !== null) return localStorageRestorePro(item);
      if (sessionStorageRestorePro2(item) !== null) return sessionStorageRestorePro2(item);
      return false;
    }
    function hybridStorageRemovePro(item) {
      if (localStorageRemovePro(item) !== null) return localStorageRemovePro(item);
      if (sessionStorageRemovePro2(item) !== null) return sessionStorageRemovePro2(item);
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
      sessionStorageRestorePro: sessionStorageRestorePro2,
      sessionStorageStorePro,
      sessionStorageRemovePro: sessionStorageRemovePro2,
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
    aliasGlobal("sessionStorageRestorePro", sessionStorageRestorePro2);
    aliasGlobal("sessionStorageStorePro", sessionStorageStorePro);
    aliasGlobal("sessionStorageStoreBoundedPro", sessionStorageStoreBoundedPro);
    aliasGlobal("sessionStorageRemovePro", sessionStorageRemovePro2);
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
    function getOptionsPro2(item) {
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
    function removeOptionsPro2(item) {
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
    const options = { verifyOptionsPro, getOptionsPro: getOptionsPro2, setOptionsPro, removeOptionsPro: removeOptionsPro2, updateOptionsPro };
    getSeiPro().core.options = options;
    aliasGlobal("verifyOptionsPro", verifyOptionsPro);
    aliasGlobal("getOptionsPro", getOptionsPro2);
    aliasGlobal("setOptionsPro", setOptionsPro);
    aliasGlobal("removeOptionsPro", removeOptionsPro2);
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
  function infraFormatarTamanhoBytes2(numBytes) {
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
      infraFormatarTamanhoBytes: infraFormatarTamanhoBytes2,
      prepCSVRow,
      removeDuplicatesArray,
      trycatch,
      zeroWidthTrim,
      checkBrowser
    };
    getSeiPro().core.helpers = helpers;
    aliasGlobal("checkObjHasProperty", checkObjHasProperty);
    aliasGlobal("fixedEncodeURIComponent", fixedEncodeURIComponent);
    aliasGlobal("infraFormatarTamanhoBytes", infraFormatarTamanhoBytes2);
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
      const $2 = globalRef.jQuery || globalRef.$;
      if (!$2) return false;
      return $2("#divInfraSidebarMenu ul#infraMenu").length > 0;
    }
    function getSeiVersionPro() {
      return globalRef.sessionStorage.getItem("versaoSei") || false;
    }
    function setSeiVersionPro() {
      const $2 = globalRef.jQuery || globalRef.$;
      if (!$2) return false;
      let version = $2('img[title*="Sistema Eletr\xF4nico de Informa\xE7\xF5es - Vers\xE3o"]').attr("title");
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
      const query2 = buildQuery(params);
      if (!query2) return baseUrl;
      return baseUrl + (baseUrl.indexOf("?") === -1 ? "?" : "&") + query2;
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
      return extractOnlyAlphaNum(removeAcentos2(decoded));
    }
    function extractTooltipToArray(elem) {
      let e = decodeHtmlText(elem);
      e = e.replace(/<[^>]*>?/gm, "");
      e = removeAcentos2(e);
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
    const moment = globalRef.moment, $2 = globalRef.$, getDateSemantic2 = globalRef.getDateSemantic, getDateBoxState2 = globalRef.getDateBoxState, getProgressPercent2 = globalRef.getProgressPercent, getConfigDatesMonitorado = globalRef.getConfigDatesMonitorado, configDatesSetUpdate = globalRef.configDatesSetUpdate;
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
    const moment = globalRef.moment, $2 = globalRef.$, getDateSemantic2 = globalRef.getDateSemantic, getDateBoxState2 = globalRef.getDateBoxState, getProgressPercent2 = globalRef.getProgressPercent, getConfigDatesMonitorado = globalRef.getConfigDatesMonitorado, configDatesSetUpdate = globalRef.configDatesSetUpdate;
    var config = getConfigDatesMonitorado();
    if (config.selectdoc) {
      configDatesSetUpdate();
    }
    config.dateTo = moment().format("YYYY-MM-DD");
    var htmlDatePreview = getDatesPreview(config, true);
    $2("#dateboxPreview").show().html(htmlDatePreview);
  }
  function getProgressPreview(config) {
    const moment = globalRef.moment, $2 = globalRef.$, getDateSemantic2 = globalRef.getDateSemantic, getDateBoxState2 = globalRef.getDateBoxState, getProgressPercent2 = globalRef.getProgressPercent, getConfigDatesMonitorado = globalRef.getConfigDatesMonitorado, configDatesSetUpdate = globalRef.configDatesSetUpdate;
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
  function installNoopStubListeners(win) {
    if (!win || win.__SEI_PRO_MAIN_INLINE_STUBS__) return;
    win.__SEI_PRO_MAIN_INLINE_STUBS__ = true;
    const doc = win.document;
    if (!doc || typeof doc.addEventListener !== "function") return;
    HANDLER_ATTRS.forEach(function(attr) {
      const type = eventTypeForAttr(attr);
      doc.addEventListener(type, function(event) {
        const el = findHandlerTarget(event.target, attr);
        if (!el) return;
        const val = el.getAttribute(attr) || "";
        const m = CALL_RE.exec(val);
        if (!m) return;
        const fnName = m[1];
        if (/^infra/i.test(fnName)) return;
        if (typeof win[fnName] === "function") return;
        win[fnName] = function() {
        };
      }, true);
    });
  }
  function injectMainWorldNoopStubs(doc, win) {
    if (!doc || !doc.documentElement) return;
    if (doc.documentElement.getAttribute("data-seipro-inline-stubs") === "1") return;
    var getURL = null;
    try {
      if (win && win.chrome && win.chrome.runtime && typeof win.chrome.runtime.getURL === "function") {
        getURL = win.chrome.runtime.getURL.bind(win.chrome.runtime);
      } else if (typeof chrome !== "undefined" && chrome.runtime && typeof chrome.runtime.getURL === "function") {
        getURL = chrome.runtime.getURL.bind(chrome.runtime);
      }
    } catch (e) {
    }
    if (!getURL) return;
    doc.documentElement.setAttribute("data-seipro-inline-stubs", "1");
    const script = doc.createElement("script");
    script.src = getURL("js/inline-stubs-main.js");
    script.async = false;
    script.onload = function() {
      script.remove();
    };
    script.onerror = function() {
      doc.documentElement.removeAttribute("data-seipro-inline-stubs");
      script.remove();
    };
    doc.documentElement.appendChild(script);
  }
  function installLegacyInlineBridge(win) {
    const w = win || globalRef;
    if (!w.document || typeof w.document.addEventListener !== "function") return;
    if (w.__SEI_PRO_LEGACY_INLINE_BRIDGE__) return;
    w.__SEI_PRO_LEGACY_INLINE_BRIDGE__ = true;
    installNoopStubListeners(w);
    try {
      injectMainWorldNoopStubs(w.document, w);
    } catch (e) {
    }
    HANDLER_ATTRS.forEach(function(attr) {
      const type = eventTypeForAttr(attr);
      w.document.addEventListener(type, function(event) {
        const el = findHandlerTarget(event.target, attr);
        if (!el) return;
        const attrValue = el.getAttribute(attr);
        const parsed = parseStrictCall(attrValue, el);
        if (!parsed) return;
        if (/^infra/i.test(parsed.fnName)) return;
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
    installDocsLoteLegacyApi();
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

  // src/features/editor/lib/domq.js
  var dataStore = /* @__PURE__ */ new WeakMap();
  var eventStore = /* @__PURE__ */ new WeakMap();
  function isHtml(s) {
    return typeof s === "string" && /^\s*<[\w!]/.test(s);
  }
  function parseHtml(html) {
    const tpl = document.createElement("template");
    tpl.innerHTML = html;
    return Array.from(tpl.content.childNodes);
  }
  function parseHtmlElements(html) {
    const tpl = document.createElement("template");
    tpl.innerHTML = html;
    return Array.from(tpl.content.children);
  }
  function toNodes(input) {
    if (input == null) return [];
    if (input instanceof Q) return input.elements.slice();
    if (input instanceof Node) return [input];
    if (typeof input === "string") return isHtml(input) ? parseHtml(input) : [document.createTextNode(input)];
    if (input.nodeType) return [input];
    return Array.from(input);
  }
  function query(sel, root3) {
    if (!sel) return [];
    const m = sel.match(/^(\w+|)\:contains\((['"])(.*?)\2\)(.*)$/);
    if (!m) {
      try {
        return Array.from((root3 || document).querySelectorAll(sel));
      } catch {
        return [];
      }
    }
    const [, tag, , text, rest] = m;
    const base = tag ? (root3 || document).querySelectorAll(tag) : [root3];
    const hits = Array.from(base).filter((el) => (el.textContent || "").includes(text));
    if (!rest.trim()) return hits;
    return hits.flatMap((el) => query(rest.trim(), el));
  }
  function queryIn(roots, sel) {
    const list = Array.isArray(roots) ? roots : [roots];
    return list.flatMap((root3) => root3 ? query(sel, root3) : []);
  }
  function isVisible(el) {
    if (!el || el.nodeType !== 1) return false;
    const st = getComputedStyle(el);
    return st.display !== "none" && st.visibility !== "hidden" && el.getClientRects().length > 0;
  }
  function matchPseudo(el, pseudo) {
    if (pseudo === ":visible") return isVisible(el);
    if (pseudo === ":hidden") return !isVisible(el);
    if (pseudo === ":checked") return "checked" in el && !!el.checked;
    return false;
  }
  var Q = class _Q {
    /** @param {Node[]} elements @param {Q|null} [prev] */
    constructor(elements, prev) {
      this.elements = elements.filter(Boolean);
      this._prev = prev || null;
      this.length = this.elements.length;
      for (let i = 0; i < this.length; i++) this[i] = this.elements[i];
    }
    [Symbol.iterator]() {
      return this.elements[Symbol.iterator]();
    }
    _push(next) {
      return new _Q(next, this);
    }
    find(sel) {
      if (sel instanceof _Q) {
        const targets = sel.elements;
        return this._push(this.elements.flatMap((r) => targets.filter((el) => r.contains?.(el))));
      }
      if (sel instanceof Element) {
        return this._push(this.elements.flatMap((r) => r.contains?.(sel) ? [sel] : []));
      }
      return this._push(this.elements.flatMap((r) => queryIn(r, sel)));
    }
    closest(sel) {
      return this._push(this.elements.map((el) => el.nodeType === 1 ? el.closest(sel) : null).filter(Boolean));
    }
    parent() {
      return this._push(this.elements.map((el) => el.parentElement).filter(Boolean));
    }
    children(sel) {
      const kids = this.elements.flatMap((el) => Array.from(el.children || []));
      return this._push(sel ? kids.filter((el) => el.matches(sel)) : kids);
    }
    contents() {
      const out = [];
      for (const el of this.elements) {
        if (el.tagName === "IFRAME") {
          const doc = el.contentDocument;
          if (doc) out.push(doc);
        } else if (el.nodeType === 9) out.push(...el.childNodes);
        else out.push(...el.childNodes);
      }
      return this._push(out);
    }
    eq(i) {
      return this._push(i < 0 ? [this.elements[this.length + i]] : [this.elements[i]].filter(Boolean));
    }
    get(i) {
      return i == null ? this.elements.slice() : this.elements[i];
    }
    end() {
      return this._prev || q();
    }
    filter(arg) {
      if (typeof arg === "function") return this._push(this.elements.filter((el, i) => arg.call(el, i, el)));
      if (arg.startsWith(":")) return this._push(this.elements.filter((el) => matchPseudo(el, arg)));
      return this._push(this.elements.filter((el) => el.matches && el.matches(arg)));
    }
    not(sel) {
      return this._push(this.elements.filter((el) => !el.matches || !el.matches(sel)));
    }
    map(fn) {
      const out = [];
      this.elements.forEach((el, i) => {
        const v = fn.call(el, i, el);
        if (v != null) out.push(v);
      });
      return this._push(out.flat());
    }
    each(fn) {
      this.elements.forEach((el, i) => fn.call(el, i, el));
      return this;
    }
    add(input) {
      return this._push(this.elements.concat(q(input).elements));
    }
    is(arg) {
      if (typeof arg === "string" && arg.startsWith(":")) return this.elements.some((el) => matchPseudo(el, arg));
      return this.elements.some((el) => el.matches && el.matches(arg));
    }
    attr(name, val) {
      if (val === void 0 && this.elements.length <= 1) return this.elements[0]?.getAttribute(name);
      this.elements.forEach((el) => {
        if (el.nodeType === 1) val == null ? el.removeAttribute(name) : el.setAttribute(name, val);
      });
      return this;
    }
    removeAttr(name) {
      this.elements.forEach((el) => el.removeAttribute?.(name));
      return this;
    }
    prop(name, val) {
      if (val === void 0 && this.elements.length <= 1) return this.elements[0]?.[name];
      this.elements.forEach((el) => {
        el[name] = val;
      });
      return this;
    }
    val(v) {
      if (v === void 0 && this.elements.length <= 1) return this.elements[0]?.value;
      this.elements.forEach((el) => {
        if ("value" in el) el.value = v;
      });
      return this;
    }
    html(v) {
      if (v === void 0 && this.elements.length <= 1) return this.elements[0]?.innerHTML;
      this.elements.forEach((el) => {
        if (el.nodeType === 1) el.innerHTML = v;
      });
      return this;
    }
    text(v) {
      if (v === void 0 && this.elements.length <= 1) return this.elements[0]?.textContent;
      this.elements.forEach((el) => {
        el.textContent = v;
      });
      return this;
    }
    css(name, val) {
      if (typeof name === "object") {
        this.elements.forEach((el) => {
          if (el.style) Object.assign(el.style, name);
        });
        return this;
      }
      if (val === void 0 && this.elements.length <= 1) {
        const el = this.elements[0];
        if (!el || el.nodeType !== 1) return void 0;
        return getComputedStyle(el).getPropertyValue(name.replace(/([A-Z])/g, "-$1").toLowerCase()) || el.style[name];
      }
      this.elements.forEach((el) => {
        if (el.style) el.style[name] = val;
      });
      return this;
    }
    data(key, val) {
      if (val === void 0 && this.elements.length <= 1) {
        const el = this.elements[0];
        if (!el) return void 0;
        const bag = dataStore.get(el);
        if (bag && key in bag) return bag[key];
        const dk = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        return el.dataset?.[dk];
      }
      this.elements.forEach((el) => {
        const bag = dataStore.get(el) || {};
        bag[key] = val;
        dataStore.set(el, bag);
      });
      return this;
    }
    addClass(...names) {
      this.elements.forEach((el) => el.classList?.add(...names.join(" ").split(/\s+/).filter(Boolean)));
      return this;
    }
    removeClass(...names) {
      this.elements.forEach((el) => el.classList?.remove(...names.join(" ").split(/\s+/).filter(Boolean)));
      return this;
    }
    hasClass(name) {
      return this.elements.some((el) => el.classList?.contains(name));
    }
    toggleClass(name, force) {
      this.elements.forEach((el) => el.classList?.toggle(name, force));
      return this;
    }
    show() {
      this.elements.forEach((el) => {
        if (el.style) el.style.display = "";
      });
      return this;
    }
    hide() {
      this.elements.forEach((el) => {
        if (el.style) el.style.display = "none";
      });
      return this;
    }
    fadeOut(ms, cb) {
      const delay = typeof ms === "number" ? ms : 0;
      const done = typeof ms === "function" ? ms : cb;
      setTimeout(() => {
        this.hide();
        done?.();
      }, delay);
      return this;
    }
    fadeIn(ms, cb) {
      const delay = typeof ms === "number" ? ms : 0;
      const done = typeof ms === "function" ? ms : cb;
      setTimeout(() => {
        this.show();
        done?.();
      }, delay);
      return this;
    }
    slideUp(_speed, cb) {
      this.hide();
      cb?.();
      return this;
    }
    focus() {
      this.elements[0]?.focus?.();
      return this;
    }
    width(v) {
      if (v !== void 0) return this.css("width", typeof v === "number" ? `${v}px` : v);
      const el = this.elements[0];
      if (!el) return void 0;
      if (el === window) return document.documentElement.clientWidth;
      return el.getBoundingClientRect?.().width ?? el.offsetWidth;
    }
    height(v) {
      if (v !== void 0) return this.css("height", typeof v === "number" ? `${v}px` : v);
      const el = this.elements[0];
      if (!el) return void 0;
      if (el === window) return document.documentElement.clientHeight;
      return el.getBoundingClientRect?.().height ?? el.offsetHeight;
    }
    _bind(type, sel, fn, add) {
      const types = type.split(/\s+/);
      const realSel = sel && typeof sel !== "function" ? sel : null;
      const realFn = sel && typeof sel === "function" ? sel : fn;
      this.elements.forEach((el) => {
        if (el.nodeType !== 1 && el.nodeType !== 9) return;
        types.forEach((t) => {
          const h = realSel ? (e) => {
            const m = e.target?.closest?.(realSel);
            if (m && el.contains(m)) realFn.call(m, e);
          } : (e) => realFn.call(el, e);
          if (add) {
            el.addEventListener(t, h);
            const list = eventStore.get(el) || [];
            list.push({ type: t, handler: h, sel: realSel });
            eventStore.set(el, list);
          } else {
            const list = eventStore.get(el) || [];
            eventStore.set(el, list.filter((item) => {
              const drop = item.type === t && (!realSel || item.sel === realSel) && (!realFn || item.handler === realFn);
              if (drop) el.removeEventListener(item.type, item.handler);
              return !drop;
            }));
          }
        });
      });
      return this;
    }
    on(type, sel, fn) {
      if (typeof sel === "function") {
        fn = sel;
        sel = null;
      }
      return this._bind(type, sel, fn, true);
    }
    off(type, sel, fn) {
      if (type == null) {
        this.elements.forEach((el) => {
          (eventStore.get(el) || []).forEach(({ type: t, handler: h }) => el.removeEventListener(t, h));
          eventStore.delete(el);
        });
        return this;
      }
      if (typeof sel === "function") {
        fn = sel;
        sel = null;
      }
      return this._bind(type, sel, fn, false);
    }
    unbind(type, sel, fn) {
      return this.off(type, sel, fn);
    }
    trigger(type) {
      type.split(/\s+/).forEach((t) => {
        this.elements.forEach((el) => el.dispatchEvent?.(new CustomEvent(t, { bubbles: true, cancelable: true })));
      });
      return this;
    }
    append(content) {
      this.elements.forEach((el) => toNodes(content).forEach((n) => el.appendChild(n)));
      return this;
    }
    prepend(content) {
      this.elements.forEach((el) => toNodes(content).reverse().forEach((n) => el.insertBefore(n, el.firstChild)));
      return this;
    }
    prependTo(target) {
      q(target).prepend(this.elements);
      return this;
    }
    after(content) {
      this.elements.forEach((el) => toNodes(content).forEach((n) => el.parentNode?.insertBefore(n, el.nextSibling)));
      return this;
    }
    before(content) {
      this.elements.forEach((el) => toNodes(content).forEach((n) => el.parentNode?.insertBefore(n, el)));
      return this;
    }
    remove() {
      this.elements.forEach((el) => el.remove?.());
      return this;
    }
    empty() {
      this.elements.forEach((el) => {
        while (el.firstChild) el.removeChild(el.firstChild);
      });
      return this;
    }
    offset() {
      const el = this.elements[0];
      if (!el || !el.getBoundingClientRect) return { top: 0, left: 0 };
      const r = el.getBoundingClientRect();
      return { top: r.top + window.scrollY, left: r.left + window.scrollX };
    }
    /**
     * jQuery-UI-compatible dialog → shared/ui/modal.
     * Options: title, width, height, open, buttons: [{ text, class, click }]
     */
    dialog(options = {}) {
      const el = this.elements[0];
      if (!el) return this;
      const content = el.innerHTML || el;
      if (typeof content === "string") el.replaceChildren();
      if (typeof q._openModal !== "function") {
        throw new Error("domq.dialog: call installDomqDialog(openModal) first");
      }
      const buttons = (options.buttons || []).map((b) => ({
        text: b.text,
        class: b.class,
        onClick: (ref2) => {
          if (typeof b.click === "function") b.click.call(el, { data: ref2 });
        }
      }));
      const ref = q._openModal({
        title: options.title || "",
        content: typeof content === "string" ? content : el,
        width: options.width || 600,
        buttons: buttons.length ? buttons : void 0,
        onOpen: (r) => {
          if (typeof options.open === "function") options.open.call(el, r);
        },
        className: "seipro-editor-modal"
      });
      this._modalRef = ref;
      q._lastModal = ref;
      return this;
    }
    /** Minimal jQuery UI tabs for #tabDialog-style markup (ul>li>a[href] + panels). */
    tabs() {
      this.elements.forEach((root3) => {
        const links = Array.from(root3.querySelectorAll('ul.ui-tabs-nav a, ul li a[href^="#"]'));
        const panels = [];
        links.forEach((a, i) => {
          const id = (a.getAttribute("href") || "").replace(/^#/, "");
          const panel = id ? document.getElementById(id) : null;
          if (panel) panels.push(panel);
          a.addEventListener("click", (ev) => {
            ev.preventDefault();
            panels.forEach((p) => {
              p.style.display = "none";
            });
            links.forEach((l) => l.parentElement && l.parentElement.classList.remove("ui-tabs-active", "ui-state-active"));
            if (panel) panel.style.display = "";
            if (a.parentElement) a.parentElement.classList.add("ui-tabs-active", "ui-state-active");
          });
          if (panel) panel.style.display = i === 0 ? "" : "none";
          if (i === 0 && a.parentElement) a.parentElement.classList.add("ui-tabs-active", "ui-state-active");
        });
      });
      return this;
    }
    /**
     * Render a QR code into the first element (lazy-loads vendor/qrcode).
     * Compatible with jquery-qrcode options: text, width, height, ...
     */
    qrcode(options = {}) {
      const el = this.elements[0];
      if (!el) return this;
      const text = options.text || options.ecLevel || "";
      const size = options.width || options.height || 128;
      const run = () => {
        el.innerHTML = "";
        new QRCode(el, {
          text: options.text || String(text),
          width: size,
          height: options.height || size,
          colorDark: options.colorDark || "#000000",
          colorLight: options.colorLight || "#ffffff",
          correctLevel: typeof QRCode !== "undefined" && QRCode.CorrectLevel ? QRCode.CorrectLevel[options.correctLevel] || QRCode.CorrectLevel.M : void 0
        });
      };
      if (typeof QRCode === "undefined") {
        const base = typeof URL_SPRO !== "undefined" && URL_SPRO || "";
        qLoadScript(base + "js/lib/qrcode.min.js").then(run).catch(() => {
          el.textContent = options.text || "";
        });
      } else {
        run();
      }
      return this;
    }
  };
  function installDomqDialog(openModal2) {
    q._openModal = openModal2;
  }
  function q(input, ctx) {
    if (typeof input === "function") {
      if (typeof document === "undefined") {
        input();
        return q();
      }
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", input, { once: true });
      else setTimeout(input, 0);
      return q();
    }
    if (input instanceof Q) return input;
    if (input instanceof Node || input?.nodeType || input === window) return new Q([input]);
    if (Array.isArray(input) || input && typeof input.length === "number" && input.item) {
      return new Q(Array.from(input));
    }
    if (typeof input === "string") {
      if (isHtml(input)) return new Q(parseHtmlElements(input));
      const root3 = ctx instanceof Q ? ctx.elements[0] : ctx || document;
      return new Q(query(input, root3));
    }
    return new Q([]);
  }
  function qLoadScript(url) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = url;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      (document.head || document.documentElement).appendChild(s);
    });
  }
  q.isArray = Array.isArray;
  q.each = function each(obj, fn) {
    if (obj == null) return obj;
    if (typeof obj.length === "number" && typeof obj !== "function") {
      for (let i = 0; i < obj.length; i++) {
        if (fn.call(obj[i], i, obj[i]) === false) break;
      }
    } else {
      Object.keys(obj).forEach((k) => fn.call(obj[k], k, obj[k]));
    }
    return obj;
  };
  q.map = function map(arr, fn) {
    const out = [];
    q.each(arr, function(i, v) {
      const r = fn.call(v, v, i);
      if (r != null) out.push(r);
    });
    return out;
  };

  // src/features/editor/page-runtime.js
  function ensureGlobal(name, value) {
    if (typeof globalRef[name] === "undefined") {
      globalRef[name] = value;
    }
  }
  function extensionBaseFromDataset() {
    try {
      const root3 = globalRef.document && globalRef.document.documentElement;
      return root3 && root3.dataset && root3.dataset.seiproExtensionUrl || "";
    } catch (e) {
      return "";
    }
  }
  function hasRealChromeRuntime() {
    try {
      return !!(globalRef.chrome && globalRef.chrome.runtime && typeof globalRef.chrome.runtime.getURL === "function" && globalRef.chrome.runtime.id && globalRef.chrome.runtime.id !== "seipro-page-inject");
    } catch (e) {
      return false;
    }
  }
  function installPageChromeShim() {
    const base = extensionBaseFromDataset();
    if (!base || hasRealChromeRuntime()) return !!hasRealChromeRuntime();
    const root3 = globalRef.document.documentElement;
    const version = root3 && root3.dataset && root3.dataset.seiproVersion || "0";
    const shortName = root3 && root3.dataset && root3.dataset.seiproShortName || "SPro";
    globalRef.chrome = {
      runtime: {
        id: "seipro-page-inject",
        getURL(path) {
          return base.replace(/\/?$/, "/") + String(path || "").replace(/^\//, "");
        },
        getManifest() {
          return { version, short_name: shortName, icons: {} };
        },
        sendMessage(_message, callback) {
          if (typeof callback === "function") {
            callback({ ok: false, error: "Runtime indispon\xEDvel no mundo MAIN" });
          }
        },
        lastError: null
      }
    };
    return true;
  }
  function insertFontIconNative(elementTo, target) {
    const base = typeof globalRef.URL_SPRO !== "undefined" && globalRef.URL_SPRO || extensionBaseFromDataset() || "";
    if (!base) return;
    let $target = target;
    if (!$target || typeof $target.find !== "function") {
      $target = q("html");
    }
    if ($target.find('link[data-style="seipro-fonticon"]').length || $target.find('style[data-style="seipro-fonticon"]').length) {
      return;
    }
    const head = $target.find(elementTo || "head");
    if (!head.length) return;
    const link = globalRef.document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.setAttribute("data-style", "seipro-fonticon");
    link.href = base.replace(/\/?$/, "/") + "css/fontawesome.pro.min.css";
    head.get(0).appendChild(link);
    const style = globalRef.document.createElement("style");
    style.type = "text/css";
    style.setAttribute("data-style", "seipro-fonticon");
    style.setAttribute("data-index", "1");
    style.textContent = [
      '@font-face{font-family:"Font Awesome 5 Pro";font-style:normal;font-weight:900;font-display:block;',
      "src:url(" + base + 'webfonts/pro/fa-solid-900.woff2) format("woff2")}',
      '@font-face{font-family:"Font Awesome 5 Pro";font-style:normal;font-weight:400;font-display:block;',
      "src:url(" + base + 'webfonts/pro/fa-regular-400.woff2) format("woff2")}'
    ].join("");
    const headEl = $target.find("head").get(0);
    if (headEl) headEl.appendChild(style);
    if (globalRef.localStorage.getItem("seiSlim_editor")) {
      q("body").addClass("seiSlim seiSlim_parent seiSlim_view");
    }
  }
  function updateDialogDefinitionPro2() {
    const CKE = globalRef.CKEDITOR;
    if (!CKE || typeof CKE.on !== "function") return;
    CKE.on("dialogDefinition", function(ev) {
      const dialogName = ev.data.name;
      const dialogDefinition = ev.data.definition;
      if (dialogName === "linkseiDialog") {
        dialogDefinition.onShow = function() {
          const idEditor2 = this.getParentEditor().name;
          q("#idEditor").val(idEditor2);
          if (typeof globalRef.insertProtocoloOnBox === "function") {
            globalRef.insertProtocoloOnBox(idEditor2);
          }
        };
      }
      if (dialogName === "simpleLinkDialog") {
        dialogDefinition.onShow = function() {
          const idEditor2 = this.getParentEditor().name;
          q("#idEditor").val(idEditor2);
          if (typeof globalRef.insertTextTotLink === "function") {
            globalRef.insertTextTotLink(idEditor2);
          }
        };
        dialogDefinition.onOk = function() {
          const a = this.getParentEditor();
          const b = {};
          const c = a.document.createElement("a");
          this.commitContent(b);
          c.setAttribute("href", b.url);
          if (b.newPage) c.setAttribute("target", "_blank");
          switch (b.style) {
            case "b":
              c.setStyle("font-weight", "bold");
              break;
            case "u":
              c.setStyle("text-decoration", "underline");
              break;
            case "i":
              c.setStyle("font-style", "italic");
              break;
            default:
              break;
          }
          c.setHtml(b.contents);
          a.insertElement(c);
          setTimeout(function() {
            if (typeof globalRef.initDropImages === "function") globalRef.initDropImages();
          }, 1e3);
        };
      }
    });
  }
  function restoreProcessSessionFromStorage() {
    try {
      const storage = globalRef.sessionStorage;
      const raw = storage && typeof storage.getItem === "function" ? storage.getItem("dadosSessionProcessoPro") : null;
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  function resolveDocumentId() {
    const candidates = [];
    try {
      const params = new URL(globalRef.location.href).searchParams;
      candidates.push(params.get("id_documento"));
    } catch (_) {
    }
    try {
      const hidden = globalRef.document?.querySelector?.(
        '[name="id_documento"], #id_documento, #hdnIdDocumento'
      );
      if (hidden?.value) candidates.push(hidden.value);
    } catch (_) {
    }
    return candidates.map((value) => String(value || "").trim()).find((value) => /^\d+$/.test(value)) || "";
  }
  function resolveProcessId() {
    const urls = [];
    try {
      urls.push(globalRef.location.href);
    } catch (_) {
    }
    try {
      if (globalRef.document?.referrer) urls.push(globalRef.document.referrer);
    } catch (_) {
    }
    try {
      if (globalRef.opener && !globalRef.opener.closed) {
        urls.push(globalRef.opener.location?.href || "");
        const openerFrame = globalRef.opener.document?.querySelector?.('#ifrArvore, iframe[id*="Arvore"]');
        if (openerFrame?.src) urls.push(openerFrame.src);
      }
    } catch (_) {
    }
    const candidates = [];
    try {
      const processData = globalRef.dadosProcessoPro?.propProcesso;
      if (processData?.hdnIdProcedimento) candidates.push(processData.hdnIdProcedimento);
    } catch (_) {
    }
    try {
      const hidden = globalRef.document?.querySelector?.(
        '[name="id_procedimento"], #id_procedimento, #hdnIdProcedimento, [name="id_protocolo"], #id_protocolo, #hdnIdProtocolo'
      );
      if (hidden?.value) candidates.push(hidden.value);
      const dataId = globalRef.document?.querySelector?.("[data-id-procedimento], [data-id_procedimento]");
      if (dataId?.dataset?.idProcedimento) candidates.push(dataId.dataset.idProcedimento);
      if (dataId?.dataset?.id_procedimento) candidates.push(dataId.dataset.id_procedimento);
    } catch (_) {
    }
    urls.forEach((url) => {
      if (!url) return;
      try {
        if (typeof globalRef.getParamsUrlPro === "function") {
          const parsed = globalRef.getParamsUrlPro(url);
          if (parsed) candidates.push(parsed.id_procedimento, parsed.id_protocolo);
        }
      } catch (_) {
      }
      try {
        const params = new URL(url, globalRef.location.href).searchParams;
        candidates.push(params.get("id_procedimento"), params.get("id_protocolo"));
      } catch (_) {
      }
    });
    return candidates.map((value) => String(value || "").trim()).find((value) => /^\d+$/.test(value)) || "";
  }
  function parseHtml2(html) {
    if (typeof globalRef.DOMParser !== "function") return null;
    return new globalRef.DOMParser().parseFromString(String(html || ""), "text/html");
  }
  function parseProcessTreeUrl(html, baseHref) {
    const document2 = parseHtml2(html);
    const frame = document2 && (document2.querySelector("#ifrArvore") || document2.querySelector('iframe[id*="Arvore"]'));
    const src = frame && frame.getAttribute("src");
    if (!src) return "";
    try {
      return new URL(src, baseHref).href;
    } catch (e) {
      return String(src);
    }
  }
  function extractProcessDocuments(html) {
    const document2 = parseHtml2(html);
    if (!document2) return [];
    const byId = /* @__PURE__ */ new Map();
    Array.from(document2.querySelectorAll('a[id^="anchor"]')).forEach((anchor) => {
      const id = String(anchor.id || "").replace(/^anchor/, "");
      if (!/^\d+$/.test(id)) return;
      const text = String(anchor.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) return;
      const match = text.match(/\(([^()]*)\)\s*$/);
      const documento = (match ? text.slice(0, match.index) : text).trim();
      const nrSei = match ? match[1].trim() : "";
      if (!documento) return;
      let src = "";
      try {
        const href = anchor.getAttribute("href") || "";
        const url = new URL(href, globalRef.location.href);
        if (url.searchParams.has("id_documento")) src = url.href;
      } catch (_) {
      }
      byId.set(id, {
        id_protocolo: id,
        documento,
        nr_sei: nrSei,
        src
      });
    });
    return [...byId.values()];
  }
  async function loadEditorProcessDocuments2() {
    if (globalRef.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__ === "ready") {
      const data = globalRef.dadosProcessoPro || {};
      return data.listDocumentos || data.treeModel?.documents || [];
    }
    if (globalRef.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__ === "loading") return [];
    const existing = globalRef.dadosProcessoPro || {};
    const existingDocuments = Array.isArray(existing.listDocumentos) ? existing.listDocumentos : Array.isArray(existing.treeModel?.documents) ? existing.treeModel.documents : [];
    if (existingDocuments.length) {
      globalRef.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__ = "ready";
      markProcessDataStatus(`ready-${existingDocuments.length}`);
      return existingDocuments;
    }
    const id = resolveProcessId();
    const fetchImpl = globalRef.fetch;
    if (!/^\d+$/.test(id) || typeof fetchImpl !== "function") {
      markProcessDataStatus("unavailable");
      return [];
    }
    globalRef.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__ = "loading";
    markProcessDataStatus("loading");
    try {
      const current = new URL(globalRef.location.href);
      current.searchParams.set("acao", "procedimento_trabalhar");
      current.searchParams.set("id_procedimento", id);
      current.searchParams.delete("id_documento");
      current.searchParams.delete("acao_origem");
      current.searchParams.delete("acao_retorno");
      const processResponse = await fetchImpl.call(globalRef, current.href, { credentials: "same-origin" });
      if (!processResponse || processResponse.ok === false) throw new Error("process page unavailable");
      const processHtml = await processResponse.text();
      const treeUrl = parseProcessTreeUrl(processHtml, current.href);
      if (!treeUrl) throw new Error("process tree unavailable");
      const treeResponse = await fetchImpl.call(globalRef, treeUrl, { credentials: "same-origin" });
      if (!treeResponse || treeResponse.ok === false) throw new Error("process tree unavailable");
      const documents = extractProcessDocuments(await treeResponse.text());
      if (!documents.length) throw new Error("process tree has no documents");
      const next = { ...existing, listDocumentos: documents };
      next.treeModel = { ...existing.treeModel || {}, documents };
      globalRef.dadosProcessoPro = next;
      globalRef.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__ = "ready";
      markProcessDataStatus(`ready-${documents.length}`);
      if (typeof globalRef.dispatchEvent === "function" && typeof globalRef.CustomEvent === "function") {
        globalRef.dispatchEvent(new globalRef.CustomEvent("seipro-processo-dados-ready"));
      }
      return documents;
    } catch (e) {
      globalRef.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__ = "error";
      markProcessDataStatus("error");
      try {
        globalRef.console?.warn?.("SEI Pro: process documents unavailable", e);
      } catch (_) {
      }
      return [];
    }
  }
  function markProcessDataStatus(status) {
    try {
      globalRef.document?.documentElement?.setAttribute("data-seipro-editor-process-data", String(status));
    } catch (_) {
    }
  }
  function syncDadosProcessoPro() {
    try {
      const id = resolveProcessId();
      const documentId = resolveDocumentId();
      const restored = typeof globalRef.sessionStorageRestorePro === "function" ? globalRef.sessionStorageRestorePro("dadosSessionProcessoPro") : null;
      const all = Array.isArray(restored) ? restored : restoreProcessSessionFromStorage();
      if (!Array.isArray(all)) return false;
      let found = null;
      for (let i = 0; i < all.length; i++) {
        const d = all[i];
        if (!d) continue;
        const hid = d.propProcesso && d.propProcesso.hdnIdProcedimento;
        const lid = d.listAndamento && d.listAndamento.id_procedimento;
        const documents = [
          ...Array.isArray(d.listDocumentos) ? d.listDocumentos : [],
          ...Array.isArray(d.treeModel?.documents) ? d.treeModel.documents : []
        ];
        const matchesDocument = documentId && documents.some(
          (document2) => String(document2?.id_documento || document2?.id_protocolo || document2?.id || "") === documentId
        );
        if (id && (String(hid) === String(id) || String(lid) === String(id)) || matchesDocument) {
          found = d;
          break;
        }
      }
      if (found) {
        globalRef.dadosProcessoPro = found;
        return true;
      }
    } catch (e) {
    }
    return false;
  }
  function runEditorProcessoCallbacks() {
    if (globalRef.__SEI_PRO_EDITOR_PROCESSO_CB__) return;
    const dados = globalRef.dadosProcessoPro;
    if (!dados || !dados.listDocumentos && !dados.propProcesso) return;
    globalRef.__SEI_PRO_EDITOR_PROCESSO_CB__ = true;
    try {
      if (typeof globalRef.getDialogDadosEditor === "function") {
        globalRef.getDialogDadosEditor();
      }
    } catch (e) {
    }
    try {
      if (typeof globalRef.insertAutomaticMinutaWatermark === "function") {
        globalRef.insertAutomaticMinutaWatermark();
      }
    } catch (e2) {
    }
  }
  function installEditorPageState() {
    ensureGlobal("delayCrash", false);
    ensureGlobal("dialogBoxPro", false);
    ensureGlobal("dialogIsDraggable", false);
    ensureGlobal("alertBoxPro", false);
    ensureGlobal("configBoxPro", false);
    ensureGlobal("iframeBoxPro", false);
    ensureGlobal("editorBoxPro", false);
    ensureGlobal("dadosProcessoPro", {});
    ensureGlobal("url_host", String(globalRef.location.href.split("?")[0] || ""));
    ensureGlobal(
      "invisibleCharacters",
      /[\0-\x1F\x7F-\x9F\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g
    );
    if (globalRef.URL_SPRO) {
      globalRef.iconSeiPro = globalRef.URL_SPRO + "icons/menu/seipro.png";
    } else {
      ensureGlobal("iconSeiPro", "");
    }
    if (typeof globalRef.siglaUnidadeAtual === "undefined") {
      try {
        const lnk = globalRef.document.querySelector("#lnkInfraUnidade");
        const sel = globalRef.document.querySelector("#selInfraUnidades");
        const opt = sel && sel.options && sel.selectedIndex >= 0 ? sel.options[sel.selectedIndex] : null;
        globalRef.siglaUnidadeAtual = (lnk && (lnk.textContent || lnk.innerText) || opt && opt.textContent || "").trim();
      } catch (e) {
        globalRef.siglaUnidadeAtual = "";
      }
    }
    if (typeof globalRef.frmEditor === "undefined") {
      try {
        globalRef.frmEditor = globalRef.document.querySelector("#frmEditor") || globalRef.document.querySelector(".infra-editor__editor-completo") || null;
      } catch (e2) {
        globalRef.frmEditor = null;
      }
    }
  }
  function installSoftPageGlobals() {
    installEditorPageState();
    ensureGlobal("insertFontIcon", function(elementTo, target) {
      if (typeof globalRef.loadFontIcons === "function" && (globalRef.jQuery || globalRef.$)) {
        try {
          return globalRef.loadFontIcons(elementTo, target);
        } catch (e) {
        }
      }
      return insertFontIconNative(elementTo, target);
    });
    ensureGlobal("updateDialogDefinitionPro", updateDialogDefinitionPro2);
    ensureGlobal("reloadModalLink", function() {
    });
    ensureGlobal("getStylesOnEditor", function() {
    });
    ensureGlobal("checkLoadJqueryUI", function(cb) {
      if (typeof cb === "function") cb();
    });
    ensureGlobal("checkHostLimit", function() {
      return false;
    });
    ensureGlobal("restrictConfigValue", function(name) {
      return typeof globalRef.checkConfigValue === "function" ? globalRef.checkConfigValue(name) : true;
    });
    ensureGlobal("sanitizeHTML", function(html) {
      return html;
    });
    ensureGlobal("alertaBoxPro", function(status, icon, text) {
      try {
        console.warn("SEI Pro:", text);
      } catch (e) {
      }
    });
    ensureGlobal("initChosenReplace", function() {
    });
    ensureGlobal("enableButtonSavePro", function() {
    });
    ensureGlobal("resetDialogBoxPro", function() {
    });
    ensureGlobal("checkProcessoSigiloso", function() {
      return false;
    });
    ensureGlobal("getCitacaoDoc", function() {
      return "";
    });
    ensureGlobal("setMomentPtBr", function() {
    });
    ensureGlobal("centralizeDialogBoxEditor", function() {
    });
    ensureGlobal("resizeHeigthDialogBox", function() {
    });
    ensureGlobal("initResizeImg", function() {
    });
    ensureGlobal("loadCSSResize", function() {
    });
    ensureGlobal("loadGoogleDocs", function() {
    });
    ensureGlobal("getBase64Image", function() {
      return "";
    });
    ensureGlobal("getQRProcesso", function() {
      return "";
    });
    ensureGlobal("sumTagValue", function(v) {
      return v;
    });
    ensureGlobal("camposDinamicosProcesso", function(tags) {
      return tags || {};
    });
    ensureGlobal("getInteressadosProcesso", function(_text, cb) {
      if (typeof cb === "function") cb([]);
    });
    ensureGlobal("copyToClipboard", function(text) {
      try {
        const ta = globalRef.document.createElement("textarea");
        ta.value = text == null ? "" : String(text);
        globalRef.document.body.appendChild(ta);
        ta.select();
        globalRef.document.execCommand("copy");
        ta.remove();
      } catch (e) {
      }
    });
    ensureGlobal("waitLoadPro", function(_obj, _root, _elem, func) {
      if (typeof func === "function") setTimeout(func, 50);
    });
    ensureGlobal("getDadosIframeProcessoPro", function() {
    });
    ensureGlobal("getDadosProcessoSession", function() {
      syncDadosProcessoPro();
      return globalRef.dadosProcessoPro || false;
    });
    ensureGlobal("pullDadosProcessoSession", function() {
      syncDadosProcessoPro();
      return globalRef.dadosProcessoPro || {};
    });
    ensureGlobal("loadEditorProcessDocuments", loadEditorProcessDocuments2);
    if (typeof globalRef.dadosProcessoPro === "undefined") {
      globalRef.dadosProcessoPro = {};
    }
    syncDadosProcessoPro();
    loadEditorProcessDocuments2();
    runEditorProcessoCallbacks();
    const processDataTimer = setInterval(function() {
      if (globalRef.__SEI_PRO_EDITOR_PROCESSO_CB__) {
        clearInterval(processDataTimer);
        return;
      }
      if (syncDadosProcessoPro()) {
        runEditorProcessoCallbacks();
        if (globalRef.__SEI_PRO_EDITOR_PROCESSO_CB__) clearInterval(processDataTimer);
      }
    }, 1500);
    try {
      globalRef.addEventListener("seipro-processo-dados-ready", function() {
        syncDadosProcessoPro();
        runEditorProcessoCallbacks();
      });
      globalRef.addEventListener("sei-pro-process-session-updated", function() {
        syncDadosProcessoPro();
        runEditorProcessoCallbacks();
      });
    } catch (e3) {
    }
  }
  function installEditorPageRuntime() {
    if (globalRef.__SEI_PRO_EDITOR_PAGE_RUNTIME__) {
      return globalRef.__SEI_PRO_EDITOR_PAGE_RUNTIME__;
    }
    const pageInjected = !!extensionBaseFromDataset() && !hasRealChromeRuntime();
    if (pageInjected) {
      installPageChromeShim();
    }
    if (!globalRef.SeiPro || !globalRef.SeiPro.core || !globalRef.SeiPro.core.runtime) {
      installCoreStack();
    }
    if (typeof globalRef.getPathExtensionPro === "function") {
      try {
        globalRef.getPathExtensionPro();
      } catch (e) {
      }
    }
    try {
      const ns = typeof globalRef._P === "function" ? globalRef._P() : null;
      if (ns) {
        if (ns.URL_SPRO) globalRef.URL_SPRO = ns.URL_SPRO;
        if (ns.NAMESPACE_SPRO) globalRef.NAMESPACE_SPRO = ns.NAMESPACE_SPRO;
        if (ns.VERSION_SPRO) globalRef.VERSION_SPRO = ns.VERSION_SPRO;
      }
    } catch (e) {
    }
    if (!globalRef.URL_SPRO) {
      const base = extensionBaseFromDataset();
      if (base) globalRef.URL_SPRO = base;
    }
    if (!globalRef.NAMESPACE_SPRO) {
      try {
        globalRef.NAMESPACE_SPRO = globalRef.document.documentElement.dataset.seiproShortName || "SPro";
      } catch (e2) {
        globalRef.NAMESPACE_SPRO = "SPro";
      }
    }
    installSoftPageGlobals();
    const result = { pageInjected };
    globalRef.__SEI_PRO_EDITOR_PAGE_RUNTIME__ = result;
    return result;
  }
  installEditorPageRuntime();

  // src/features/legis/domain.js
  var domain_exports = {};
  __export(domain_exports, {
    formatRepeatedCitation: () => formatRepeatedCitation,
    getATTags: () => getATTags,
    getHashTags: () => getHashTags,
    romanizeNum: () => romanizeNum,
    uniq: () => uniq
  });
  function uniq(values) {
    return values.slice().sort().filter((item, position, array) => {
      return !position || item !== array[position - 1];
    });
  }
  function getATTags(inputText) {
    const regex = /(?:^|\s)@([a-zA-Z./#§\d]+)/gm;
    const matches = [];
    let match;
    while (match = regex.exec(inputText)) matches.push(match[1]);
    return matches;
  }
  function getHashTags(inputText) {
    const regex = /(?:^|\s)#([a-zA-Z§\d]+)/gm;
    const matches = [];
    let match;
    while (match = regex.exec(inputText)) matches.push(match[1]);
    return matches;
  }
  function romanizeNum(num) {
    if (isNaN(num)) return NaN;
    const digits = String(+num).split("");
    const key = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX"
    ];
    let roman = "";
    let index = 3;
    while (index--) roman = (key[+digits.pop() + index * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  }
  function formatRepeatedCitation(text) {
    if (typeof text !== "string") return text;
    const separator = text.indexOf(",");
    if (separator < 0) return text;
    const title = text.slice(0, separator).trim();
    const date = text.slice(separator + 1).trim();
    const yearMatch = date.match(/\b(\d{4})\b(?!.*\b\d{4}\b)/);
    return title && yearMatch ? `${title}, de ${yearMatch[1]}` : text;
  }

  // src/features/legis/io.js
  var io_exports = {};
  __export(io_exports, {
    DEFAULT_TIMEOUT_MS: () => DEFAULT_TIMEOUT_MS,
    LEGIS_SEARCH_URL: () => LEGIS_SEARCH_URL,
    searchLegislation: () => searchLegislation
  });

  // src/shared/legislation-search.js
  var LEGIS_SEARCH_URL = "https://seipro.app/legis/search.php";
  var DEFAULT_TIMEOUT_MS = 1e4;
  function ioError(error, message) {
    return { error, message, data: [] };
  }
  async function searchLegislation(norms, {
    fetchImpl = globalThis.fetch,
    navigatorRef = globalThis.navigator,
    timeoutMs = DEFAULT_TIMEOUT_MS
  } = {}) {
    const requestedNorms = Array.isArray(norms) ? norms.filter(Boolean) : [];
    if (requestedNorms.length === 0) return [];
    if (navigatorRef?.onLine === false) {
      return ioError("offline", "Legislation search is unavailable while offline.");
    }
    if (typeof fetchImpl !== "function") {
      return ioError("unavailable", "Fetch is not available in this context.");
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const body = new URLSearchParams();
    requestedNorms.forEach((norm) => body.append("norma[]", norm));
    try {
      const response = await fetchImpl(LEGIS_SEARCH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body,
        signal: controller.signal
      });
      if (!response.ok) {
        return ioError("http", `Legislation search failed with HTTP ${response.status}.`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : ioError("invalid-response", "Legislation search returned an invalid response.");
    } catch (error) {
      if (error?.name === "AbortError") {
        return ioError("timeout", `Legislation search timed out after ${timeoutMs} ms.`);
      }
      return ioError("network", error?.message || "Legislation search failed.");
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // src/features/legis/view.js
  var view_exports = {};
  __export(view_exports, {
    checkText: () => checkText,
    cleanLegis: () => cleanLegis,
    configureLegisView: () => configureLegisView,
    disableAllLegis: () => disableAllLegis,
    getAnexoUnico: () => getAnexoUnico,
    getCodTip: () => getCodTip,
    getDadosNormas: () => getDadosNormas,
    getDeclaraLegis: () => getDeclaraLegis,
    getLegis: () => getLegis,
    getNameRef: () => getNameRef,
    getNotComment: () => getNotComment,
    getParUnico: () => getParUnico,
    getRefsLegis: () => getRefsLegis,
    getRefsTags: () => getRefsTags,
    hideTooltips: () => hideTooltips,
    iframeLegis: () => iframeLegis,
    ignoreTooltips: () => ignoreTooltips,
    initLegis: () => initLegis,
    letteringNumAlin: () => letteringNumAlin,
    observeKey: () => observeKey,
    removeAllLegis: () => removeAllLegis,
    removeEnum: () => removeEnum,
    showTooltips: () => showTooltips,
    undoRemoveEnum: () => undoRemoveEnum,
    updateLegis: () => updateLegis,
    updateRefsLegis: () => updateRefsLegis,
    updateRefsTags: () => updateRefsTags
  });
  var searchLegislation2 = async () => ({
    error: "unavailable",
    message: "Pesquisa de legisla\xE7\xE3o n\xE3o configurada.",
    data: []
  });
  function configureLegisView({ search } = {}) {
    if (typeof search === "function") searchLegislation2 = search;
  }
  var getRefLegis = [];
  var alertText = {
    0: "Artigos e par\xE1grafos dever ser terminados com ponto final (.) ou dois pontos (:), sem espa\xE7o antes da pontua\xE7\xE3o. ",
    1: "Artigos e par\xE1grafos dever ser iniciados com letra mai\xFAscula. ",
    2: "Incisos ou Al\xEDneas dever ser terminados com ponto final (.), dois pontos (:) ou ponto e v\xEDrgula (;), sem espa\xE7o antes da pontua\xE7\xE3o. ",
    3: "Incisos ou Al\xEDneas dever ser iniciados com letra min\xFAscula. ",
    4: "Itens dever ser terminadas com ponto final (.), dois pontos (:) ou ponto e v\xEDrgula (;), sem espa\xE7o antes da pontua\xE7\xE3o. ",
    5: "Itens dever ser iniciados com letra min\xFAscula.  "
  };
  var iAnex = 0;
  var iTit = 0;
  var iCap = 0;
  var iSec = 0;
  var iSub = 0;
  var iArt = 0;
  var iPar = 0;
  var iInc = 0;
  var iAlin = 0;
  var iItem = 0;
  var letterAlin = "";
  var alertDisp = "";
  var ordTit = "";
  var ordCap = "";
  var ordSec = "";
  var ordInc = "";
  function letteringNumAlin(number) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let charIndex = number % alphabet.length;
    let quotient = number / alphabet.length;
    if (charIndex - 1 === -1) {
      charIndex = alphabet.length;
      quotient--;
    }
    letterAlin = alphabet.charAt(charIndex - 1) + letterAlin;
    if (quotient >= 1) letteringNumAlin(parseInt(quotient));
  }
  function removeEnum(iframe) {
    iframe.find("p").not('[data-comment="true"]').each(function() {
      if ($(this).find(".legis").length) return;
      const randRef = randomString2(16);
      $(this).html($(this).html().replace(/&nbsp;/g, " "));
      $(this).html($(this).html().replace(/\u200B/g, " "));
      let text = $(this).html();
      const textSearch = $(this).text().trim().split(" ");
      if (textSearch.length <= 1) return;
      const textNormalize = removeAcentos2(textSearch[0] + " " + textSearch[1]).toLowerCase().replace(/[^a-z ]/g, "");
      const textNormalize1 = removeAcentos2(textSearch[0]).toLowerCase().replace(/[^a-z ]/g, "");
      const replaceWithMarker = (textReplace, markerClass, markerText) => {
        text = text.replace(
          textReplace,
          `<span contenteditable="false" class="legis auto ${markerClass}" data-ref="${randRef}">${markerText}</span>`
        );
        $(this).html(text);
      };
      if (textNormalize1 === "anexo") {
        replaceWithMarker(
          typeof textSearch[1] !== "undefined" ? textSearch[0] + " " + textSearch[1] : textSearch[0],
          "anexo",
          "anexo."
        );
      }
      if (textNormalize1 === "titulo" && romanToInt(textSearch[1].toString()) > 0) {
        replaceWithMarker(textSearch[0] + " " + textSearch[1], "tit", "TIT.");
      }
      if (textNormalize1 === "capitulo" && romanToInt(textSearch[1].toString()) > 0) {
        replaceWithMarker(textSearch[0] + " " + textSearch[1], "cap", "CAP.");
      }
      if (textNormalize1 === "secao" && romanToInt(textSearch[1].toString()) > 0) {
        replaceWithMarker(textSearch[0] + " " + textSearch[1], "sec", "Sec.");
      }
      if (textNormalize1 === "subsecao" && romanToInt(textSearch[1].toString()) > 0) {
        replaceWithMarker(textSearch[0] + " " + textSearch[1], "sub", "Sub.");
      }
      if (textSearch[0].toLowerCase().includes("art") && textSearch[1].match(/\d+/g) != null) {
        replaceWithMarker(textSearch[0] + " " + textSearch[1], "art", "Art.");
      }
      if (textSearch[0].toLowerCase().includes("\xA7") && textSearch[1].match(/\d+/g) != null) {
        replaceWithMarker(textSearch[0] + " " + textSearch[1], "par", "\xA7");
      }
      if (textSearch[0].toLowerCase().includes("\xA7") && textSearch[0].match(/\d+/g) != null) {
        replaceWithMarker(textSearch[0], "par", "\xA7");
      }
      if (textNormalize === "paragrafo unico" || textNormalize === "par unico") {
        replaceWithMarker(textSearch[0] + " " + textSearch[1], "par", "\xA7");
      }
      if (romanToInt(textSearch[0].toString()) > 0 && (textSearch[1].toString() === "-" || textSearch[1].toString() === "\u2014")) {
        replaceWithMarker(textSearch[0] + " " + textSearch[1], "inc", "Inc.");
      }
      if (textSearch[0].toString().slice(-1) === ")" && textSearch[0].toString().charAt(0) !== "(") {
        replaceWithMarker(textSearch[0], "alin", "Alin.");
      }
      if (textSearch[0].toString().slice(-1) === "." && $.isNumeric(textSearch[0].toString().charAt(0))) {
        replaceWithMarker(textSearch[0], "item", "Item.");
      }
    });
  }
  function undoRemoveEnum(iframe) {
    iframe.find(".legis.auto").each(function() {
      const textOld = $(this).attr("data-old-text").hexEncode().hexDecode();
      $(this).after(textOld);
      $(this).remove();
    });
  }
  function legisButton(button2) {
    return button2 ? $(button2) : $(".getLegisButtom").last();
  }
  function legisIframes(button2) {
    const editor = legisButton(button2).closest("div.cke");
    return editor.length ? editor.find("iframe.cke_wysiwyg_frame") : $("iframe.cke_wysiwyg_frame");
  }
  function disableAllLegis(button2) {
    legisIframes(button2).each(function() {
      $(this).contents().find(".legis").attr("contenteditable", "true");
    });
  }
  function removeAllLegis() {
    $("iframe").each(function() {
      $(this).contents().find(".legis").each(function() {
        $(this).after($(this).text());
        $(this).remove();
      });
    });
  }
  function cleanLegis(iframe) {
    iframe.find("p").not('[data-comment="true"]').each(function() {
      $(this).find(".legis.anexo").html("anexo.");
      $(this).find(".legis.tit").html("tit.");
      $(this).find(".legis.cap").html("cap.");
      $(this).find(".legis.sec").html("sec.");
      $(this).find(".legis.sub").html("sub.");
      $(this).find(".legis.art").html("art.");
      $(this).find(".legis.par").html("\xA7");
      $(this).find(".legis.inc").html("inc.");
      $(this).find(".legis.alin").html("alin.");
      $(this).find(".legis.item").html("item.");
    });
  }
  function getAnexoUnico(iframe) {
    const anexo = iframe.find(".legis.anexo");
    if (anexo.length === 1) anexo.html(anexo.html().replace("ANEXO I", "ANEXO \xDANICO"));
  }
  function getParUnico(iframe) {
    iframe.find(".legis.par").each(function() {
      let text = $(this).html();
      const art = $(this).find("a").attr("data-art");
      if (!iframe.find(`a[name=art${art}\xA72]`).length) {
        text = text.replace("\xA7 1\xBA", "Par\xE1grafo \xFAnico.");
        $(this).html(text);
        $(this).find("a").attr("data-parunico", "true");
      }
    });
  }
  function getDeclaraLegis(iframe) {
    const references = [];
    iframe.find(".legis.refext.refok").each(function() {
      const refext = $(this).attr("data-refext");
      if ($(`.legis[data-refext="${refext}"]`, iframe).length > 1) {
        if (references.includes(refext)) {
          $(this).find("a").text(formatRepeatedCitation($(this).text()));
        }
        references.push(refext);
      }
    });
  }
  function checkText(this_, resultText, disp) {
    const alerts = [];
    const text = $(this_).text().trim();
    const textDispositivo = text.replace(disp + ".", "").trim();
    const firstChar = textDispositivo.charAt(0);
    const lastChar = textDispositivo.slice(-1);
    const lastWord = textDispositivo.split(" ").pop();
    $("<div>" + resultText + "</div>").text();
    if (disp === "art" || disp === "par") {
      if (lastChar !== "." && lastChar !== ":") alerts.push(0);
      if (firstChar !== firstChar.toUpperCase()) alerts.push(1);
    } else if (disp === "inc" || disp === "alin") {
      if (![".", ":", ";"].includes(lastChar) && lastWord !== "e" && lastWord !== "ou") alerts.push(2);
      if (firstChar !== firstChar.toLowerCase()) alerts.push(3);
    } else if (disp === "item") {
      if (lastChar !== "." && lastChar !== ";" && lastWord !== "e" && lastWord !== "ou") alerts.push(4);
      if (firstChar !== firstChar.toLowerCase()) alerts.push(5);
    }
    return alerts.length > 0 ? alerts.join(",") : false;
  }
  function updateLegis(iframe) {
    iAnex = 0;
    iTit = 0;
    iCap = 0;
    iSec = 0;
    iSub = 0;
    iArt = 0;
    iPar = 0;
    iInc = 0;
    iAlin = 0;
    iItem = 0;
    letterAlin = "";
    iframe.find("p").not('[data-comment="true"]').each(function() {
      const this_ = $(this);
      alertDisp = "";
      this_.html(this_.html().replace(/&nbsp;/g, " "));
      this_.html(this_.html().replace(/\u200B/g, " "));
      let text = this_.html();
      const textSearch = this_.text().trim().split(" ")[0];
      const textSearchFull = this_.text().trim();
      const thisClassParag = this_.attr("class");
      let classParag;
      let linkAnchor;
      let result;
      let spaceBlank;
      if (textSearchFull.includes("@")) {
        getATTags(textSearchFull).forEach((tag) => {
          let dataValue = tag.toString();
          dataValue = dataValue.includes("#") ? dataValue.split("#")[0] : dataValue;
          dataValue = dataValue.includes("/") ? dataValue.split("/")[0] : dataValue;
          dataValue = dataValue.replace(/[\W_]+/g, "").toLowerCase();
          getRefLegis.push(dataValue);
          const value = tag.toString().slice(-1) === "." ? tag.toString().slice(0, -1) : tag;
          const resultRef = this_.find(`.legis.refext:contains("${value}")`).length ? "@" + value : `<span class="legis refext">@${value}</span>`;
          text = text.replace("@" + value, resultRef);
          this_.html(text);
        });
      }
      if (textSearch.toLowerCase().includes("anexo.")) {
        classParag = verifyConfigValue("estilolegistica") ? thisClassParag : "Texto_Centralizado";
        const indexAnex = iAnex + 1;
        const randRef = randomString2(16);
        const ordAnex = romanizeNum(indexAnex);
        linkAnchor = `<a name="anexo${ordAnex.toLowerCase()}" data-anexo="${ordAnex.toLowerCase()}"></a>`;
        result = this_.find(".legis.anexo").length ? linkAnchor + "ANEXO " + ordAnex : `<span contenteditable="false" class="legis anexo" data-ref="${randRef}">${linkAnchor}ANEXO ${ordAnex}</span>`;
        text = text.replace(textSearch, result);
        this_.html(text).attr("class", classParag);
        iAnex++;
        iTit = 0;
        iCap = 0;
        iSec = 0;
        iSub = 0;
        iArt = 0;
        iPar = 0;
        iInc = 0;
        iAlin = 0;
        letterAlin = "";
      }
      if (textSearch.toLowerCase().includes("tit.")) {
        classParag = verifyConfigValue("estilolegistica") ? thisClassParag : "Texto_Centralizado";
        const indexTit = iTit + 1;
        const randRef = randomString2(16);
        ordTit = romanizeNum(indexTit);
        linkAnchor = `<a name="titulo${ordTit.toLowerCase()}" data-tit="${ordTit.toLowerCase()}"></a>`;
        result = this_.find(".legis.tit").length ? linkAnchor + "T\xCDTULO " + ordTit : `<span contenteditable="false" class="legis tit" data-ref="${randRef}">${linkAnchor}T\xCDTULO ${ordTit}</span>`;
        text = text.replace(textSearch, result);
        this_.html(text).attr("class", classParag);
        iTit++;
        iCap = 0;
        iSec = 0;
        iSub = 0;
      }
      if (textSearch.toLowerCase().includes("cap.")) {
        classParag = verifyConfigValue("estilolegistica") ? thisClassParag : "Texto_Centralizado";
        const indexCap = iCap + 1;
        const randRef = randomString2(16);
        ordCap = romanizeNum(indexCap);
        linkAnchor = iTit > 0 ? `<a name="titulo${ordTit.toLowerCase()}capitulo${ordCap.toLowerCase()}" data-tit="${ordTit.toLowerCase()}" data-cap="${ordCap.toLowerCase()}"></a>` : `<a name="capitulo${ordCap.toLowerCase()}" data-cap="${ordCap.toLowerCase()}"></a>`;
        result = this_.find(".legis.cap").length ? linkAnchor + "CAP\xCDTULO " + ordCap : `<span contenteditable="false" class="legis cap" data-ref="${randRef}">${linkAnchor}CAP\xCDTULO ${ordCap}</span>`;
        text = text.replace(textSearch, result);
        this_.html(text).attr("class", classParag);
        iCap++;
        iSec = 0;
        iSub = 0;
      }
      if (textSearch.toLowerCase().includes("sec.")) {
        classParag = verifyConfigValue("estilolegistica") ? thisClassParag : "Texto_Centralizado";
        const indexSec = iSec + 1;
        const randRef = randomString2(16);
        ordSec = romanizeNum(indexSec);
        linkAnchor = iTit > 0 ? `<a name="titulo${ordTit.toLowerCase()}capitulo${ordCap.toLowerCase()}secao${ordSec.toLowerCase()}" data-tit="${ordTit.toLowerCase()}" data-cap="${ordCap.toLowerCase()}" data-sec="${ordSec.toLowerCase()}"></a>` : `<a name="capitulo${ordCap.toLowerCase()}secao${ordSec.toLowerCase()}" data-cap="${ordCap.toLowerCase()}" data-sec="${ordSec.toLowerCase()}"></a>`;
        result = this_.find(".legis.sec").length ? linkAnchor + "Se\xE7\xE3o " + ordSec : `<span contenteditable="false" class="legis sec" data-ref="${randRef}">${linkAnchor}Se\xE7\xE3o ${ordSec}</span>`;
        if (!this_.find("strong").length) result = "<strong>" + result + "<strong>";
        text = text.replace(textSearch, result);
        this_.html(text).attr("class", classParag);
        iSec++;
      }
      if (textSearch.toLowerCase().includes("sub.")) {
        classParag = verifyConfigValue("estilolegistica") ? thisClassParag : "Texto_Centralizado";
        const indexSub = iSub + 1;
        const randRef = randomString2(16);
        const ordSub = romanizeNum(indexSub);
        linkAnchor = iTit > 0 ? `<a name="titulo${ordTit.toLowerCase()}capitulo${ordCap.toLowerCase()}secao${ordSec.toLowerCase()}subsecao${ordSub.toLowerCase()}" data-tit="${ordTit.toLowerCase()}" data-cap="${ordCap.toLowerCase()}" data-sec="${ordSec.toLowerCase()}" data-sub="${ordSub.toLowerCase()}"></a>` : `<a name="capitulo${ordCap.toLowerCase()}secao${ordSec.toLowerCase()}subsecao${ordSub.toLowerCase()}" data-cap="${ordCap.toLowerCase()}" data-sec="${ordSec.toLowerCase()}" data-sub="${ordSub.toLowerCase()}"></a>`;
        result = this_.find(".legis.sub").length ? linkAnchor + "Subse\xE7\xE3o " + ordSub : `<span contenteditable="false" class="legis sub" data-ref="${randRef}">${linkAnchor}Subse\xE7\xE3o ${ordSub}</span>`;
        if (!this_.find("strong").length) result = "<strong>" + result + "<strong>";
        text = text.replace(textSearch, result);
        this_.html(text).attr("class", classParag);
        iSub++;
      }
      if (textSearch.toLowerCase().includes("art.")) {
        classParag = verifyConfigValue("estilolegistica") ? thisClassParag : "Texto_Justificado_Recuo_Primeira_Linha";
        const indexArt = iArt + 1;
        const randRef = randomString2(16);
        const ordArt = indexArt < 10 ? indexArt + "\xBA" : indexArt + ".";
        const enumDisp = "Art. " + ordArt;
        linkAnchor = `<a name="art${indexArt}" data-art="${indexArt}"></a>`;
        result = this_.find(".legis.art").length ? linkAnchor + enumDisp : `<span contenteditable="false" class="legis art" data-ref="${randRef}">${linkAnchor}${enumDisp}</span>`;
        alertDisp = checkText(this, result, "art");
        spaceBlank = this_.text().replace("art.", "").trim() === "" ? "&nbsp;" : "";
        text = text.replace(textSearch, result);
        this_.html(text + spaceBlank).attr("class", classParag);
        iArt++;
        iPar = 0;
        iInc = 0;
        iAlin = 0;
        letterAlin = "";
      }
      if (textSearch.toLowerCase().includes("\xA7")) {
        classParag = verifyConfigValue("estilolegistica") ? thisClassParag : "Texto_Justificado_Recuo_Primeira_Linha";
        const indexPar = iPar + 1;
        const randRef = randomString2(16);
        const ordPar = indexPar < 10 ? indexPar + "\xBA" : indexPar + ".";
        const enumDisp = "\xA7 " + ordPar;
        linkAnchor = `<a name="art${iArt}\xA7${indexPar}" data-art="${iArt}" data-par="${indexPar}"></a>`;
        result = this_.find(".legis.par").length ? linkAnchor + enumDisp : `<span contenteditable="false" class="legis par" data-ref="${randRef}">${linkAnchor}${enumDisp}</span>`;
        alertDisp = checkText(this, result, "par");
        spaceBlank = this_.text().replace("\xA7", "").trim() === "" ? "&nbsp;" : "";
        text = text.replace(textSearch, result);
        this_.html(text + spaceBlank).attr("class", classParag);
        iPar++;
        iInc = 0;
        iAlin = 0;
        letterAlin = "";
      }
      if (textSearch.toLowerCase().includes("inc.")) {
        classParag = verifyConfigValue("estilolegistica") ? thisClassParag : "Texto_Justificado_Recuo_Primeira_Linha";
        const indexInc = iInc + 1;
        const randRef = randomString2(16);
        ordInc = romanizeNum(indexInc);
        const enumDisp = ordInc + " -";
        linkAnchor = iPar > 0 ? `<a name="art${iArt}\xA7${iPar}${ordInc.toLowerCase()}" data-art="${iArt}" data-par="${iPar}" data-inc="${ordInc.toLowerCase()}"></a>` : `<a name="art${iArt}${ordInc.toLowerCase()}" data-art="${iArt}" data-inc="${ordInc.toLowerCase()}"></a>`;
        result = this_.find(".legis.inc").length ? linkAnchor + enumDisp : `<span contenteditable="false" class="legis inc" data-ref="${randRef}">${linkAnchor}${enumDisp}</span> `;
        alertDisp = checkText(this, result, "inc");
        spaceBlank = this_.text().replace("inc.", "").trim() === "" ? "&nbsp;" : "";
        text = text.replace(textSearch, result);
        this_.html(text + spaceBlank).attr("class", classParag);
        iInc++;
        iAlin = 0;
        letterAlin = "";
      }
      if (textSearch.toLowerCase().includes("alin.")) {
        classParag = verifyConfigValue("estilolegistica") ? thisClassParag : "Texto_Justificado_Recuo_Primeira_Linha";
        const indexAlin = iAlin + 1;
        const randRef = randomString2(16);
        letteringNumAlin(indexAlin);
        const enumDisp = letterAlin + ")";
        linkAnchor = iPar > 0 ? `<a name="art${iArt}\xA7${iPar}${ordInc.toLowerCase()}" data-art="${iArt}" data-par="${iPar}" data-inc="${ordInc.toLowerCase()}" data-alin="${letterAlin}"></a>` : `<a name="art${iArt}${ordInc.toLowerCase()}${letterAlin}" data-art="${iArt}" data-inc="${ordInc.toLowerCase()}" data-alin="${letterAlin}"></a>`;
        result = this_.find(".legis.alin").length ? linkAnchor + enumDisp : `<span contenteditable="false" class="legis alin" data-ref="${randRef}">${linkAnchor}${enumDisp}</span> `;
        alertDisp = checkText(this, result, "alin");
        spaceBlank = this_.text().replace("alin.", "").trim() === "" ? "&nbsp;" : "";
        text = text.replace(textSearch, result);
        this_.html(text + spaceBlank).attr("class", classParag);
        iAlin++;
        iItem = 0;
        letterAlin = "";
      }
      if (textSearch.toLowerCase().includes("item.")) {
        classParag = verifyConfigValue("estilolegistica") ? thisClassParag : "Texto_Justificado_Recuo_Primeira_Linha";
        const indexItem = iItem + 1;
        const randRef = randomString2(16);
        const enumDisp = indexItem + ".";
        linkAnchor = iPar > 0 ? `<a name="art${iArt}\xA7${iPar}${ordInc.toLowerCase()}" data-art="${iArt}" data-par="${iPar}" data-inc="${ordInc.toLowerCase()}" data-alin="${letterAlin}" data-item="${indexItem}"></a>` : `<a name="art${iArt}${ordInc.toLowerCase()}${letterAlin}${indexItem}" data-art="${iArt}" data-inc="${ordInc.toLowerCase()}" data-alin="${letterAlin}" data-item="${indexItem}"></a>`;
        result = this_.find(".legis.item").length ? linkAnchor + enumDisp : `<span contenteditable="false" class="legis item" data-ref="${randRef}">${linkAnchor}${enumDisp}</span> `;
        alertDisp = checkText(this, result, "item");
        spaceBlank = this_.text().replace("item.", "").trim() === "" ? "&nbsp;" : "";
        text = text.replace(textSearch, result);
        this_.html(text + spaceBlank).attr("class", classParag);
        iItem++;
      }
      const htmlAlert = `<span contenteditable="false" class="tooltips" style="display:none" data-text-tip="${alertDisp}"></span>`;
      if (alertDisp !== "" && this_.find("span.ignoretip").length === 0) {
        this_.find("span.legis").attr("contenteditable", "false").find("span.tooltips").remove();
        this_.find("span.legis").eq(0).addClass("alert").prepend(htmlAlert).off("mouseover mouseout dblclick").on("dblclick", function() {
          ignoreTooltips($(this));
        }).on("mouseover", function() {
          showTooltips($(this));
        }).on("mouseout", function() {
          hideTooltips($(this));
        });
      } else {
        this_.find("span.legis").attr("contenteditable", "false");
        this_.find("span.legis").eq(0).removeClass("alert").off("mouseover mouseout dblclick").find("span.tooltips").remove();
      }
    });
    getRefLegis = uniq(getRefLegis);
  }
  function getCodTip(codtip) {
    if (codtip.includes(",")) {
      return codtip.split(",").map((value) => alertText[parseInt(value)]).join("");
    }
    return alertText[parseInt(codtip)];
  }
  function ignoreTooltips(this_) {
    $(this_).addClass("ignoretip").removeClass("alert").find("span.tooltips").remove();
  }
  function showTooltips(this_) {
    const ignoretip = '<span class="ignoretext">dois cliques para ignorar alerta</span>';
    const tip = $(this_).find("span.tooltips").attr("data-text-tip");
    $(this_).find("span.tooltips").html(getCodTip(tip) + ignoretip).show();
  }
  function hideTooltips(this_) {
    $(this_).find("span.tooltips").html("").hide();
  }
  function getNameRef(anchor, iframe, this_) {
    const result = [];
    let refinc = "";
    let refselfart = "";
    if (typeof anchor.attr("data-inc") !== "undefined" && typeof anchor.attr("data-par") === "undefined" && typeof anchor.attr("data-art") !== "undefined") {
      const refart = anchor.attr("data-art");
      iframe.find(`a[name*=art${refart}\xA7]`).each(function() {
        if (typeof $(this).attr("data-inc") !== "undefined") refinc = " do <strong>caput</strong>";
      });
    }
    if (this_ !== null && typeof anchor.attr("data-art") !== "undefined" && (typeof anchor.attr("data-inc") !== "undefined" || typeof anchor.attr("data-par") !== "undefined")) {
      const refart = this_.closest("p").find("span.legis").eq(0).find("a");
      if (parseInt(refart.attr("data-art")) === parseInt(anchor.attr("data-art"))) refselfart = " ";
    }
    const anexoValue = anchor.attr("data-anexo");
    const anexo = typeof anexoValue !== "undefined" && anexoValue !== "" ? "Anexo " + anexoValue.toUpperCase() : "";
    if (anexo) result.push(anexo);
    const titValue = anchor.attr("data-tit");
    const tit = typeof titValue !== "undefined" && titValue !== "" ? "T\xEDtulo " + titValue.toUpperCase() : "";
    if (tit) result.push(tit);
    const capValue = anchor.attr("data-cap");
    const cap = typeof capValue !== "undefined" && capValue !== "" ? "Cap\xEDtulo " + capValue.toUpperCase() : "";
    if (cap) result.push(cap);
    const secValue = anchor.attr("data-sec");
    const sec = typeof secValue !== "undefined" && secValue !== "" ? "Se\xE7\xE3o " + secValue.toUpperCase() : "";
    if (sec) result.push(sec);
    const subValue = anchor.attr("data-sub");
    const sub = typeof subValue !== "undefined" && subValue !== "" ? "Subse\xE7\xE3o " + subValue.toUpperCase() : "";
    if (sub) result.push(sub);
    const artValue = anchor.attr("data-art");
    const ordArt = parseInt(artValue) < 10 ? artValue + "\xBA" : artValue || "";
    const art = typeof artValue !== "undefined" && artValue !== "" && refselfart === "" ? "art. " + ordArt : "";
    if (art) result.push(art);
    const parValue = anchor.attr("data-par");
    const ordPar = parseInt(parValue) < 10 ? parValue + "\xBA" : ".";
    let par = typeof parValue !== "undefined" && parValue !== "" ? "\xA7 " + ordPar : "";
    if (anchor.attr("data-parunico") === "true") par = "par\xE1grafo \xFAnico";
    if (par) result.push(par);
    const incValue = anchor.attr("data-inc");
    const inc = typeof incValue !== "undefined" && incValue !== "" ? "inciso " + incValue.toUpperCase() + refinc : "";
    if (inc) result.push(inc);
    const alinValue = anchor.attr("data-alin");
    const alin = typeof alinValue !== "undefined" && alinValue !== "" ? `al\xEDnea "${alinValue}"` : "";
    if (alin) result.push(alin);
    const itemValue = anchor.attr("data-item");
    const item = typeof itemValue !== "undefined" && itemValue !== "" ? `item "${itemValue}"` : "";
    if (item) result.push(item);
    const textRef = result.join(", ");
    return refselfart !== "" ? textRef + refselfart : textRef;
  }
  function getRefsTags(iframe) {
    iframe.find(".legis.error").each(function() {
      $(this).after($(this).text());
      $(this).remove();
    });
    iframe.find("p").not('[data-comment="true"]').each(function() {
      const this_ = $(this);
      let text = this_.html();
      const textSearch = this_.text();
      if (!textSearch.includes("#")) return;
      getHashTags(textSearch).forEach((value) => {
        const refTag = value.toLowerCase();
        if (iframe.find(`a[name=${refTag}]`).length) {
          const anchor = iframe.find(`a[name=${refTag}]`);
          const textRef = getNameRef(anchor, iframe, null).trim();
          const refArt = anchor.closest("span.legis").attr("data-ref");
          const resultRef = `<a href="#${refTag}"><span contenteditable="false" class="legis ref" data-anchor="${refArt}">${textRef}</span></a>`;
          text = text.replace("#" + value, resultRef);
        } else {
          text = text.replace(
            "#" + value,
            `<span contenteditable="true" class="legis ref error">#${value}</span>`
          );
        }
        this_.html(text);
      });
    });
  }
  async function getDadosNormas(iframe, arrayLegis) {
    const data = await searchLegislation2(arrayLegis);
    if (!Array.isArray(data)) return data;
    updateRefsLegis(iframe, data);
    getRefLegis = [];
    getDeclaraLegis(iframe);
    return data;
  }
  function getRefsLegis(iframe) {
    if (getRefLegis.length > 0) return getDadosNormas(iframe, getRefLegis);
    return Promise.resolve([]);
  }
  function updateRefsLegis(iframe, data) {
    iframe.find(".legis.refext").each(function() {
      if ($(this).hasClass("refok")) return;
      const this_ = $(this);
      const text = this_.html();
      const dataLegis = this_.text();
      let dataValue = dataLegis.toString().replace("@", "");
      dataValue = dataValue.includes("#") ? dataValue.split("#")[0] : dataValue;
      dataValue = dataValue.includes("/") ? dataValue.split("/")[0] : dataValue;
      dataValue = dataValue.replace(/[\W_]+/g, "").toLowerCase();
      const normalizedValue = capitalizeFirstLetter2(dataValue);
      const legisData = jmespath.search(data, `[?SiglaNorma=='${normalizedValue}']`);
      const nomeLegis = legisData.length > 0 && legisData[0].NomeNorma ? " (" + legisData[0].NomeNorma + ")" : "";
      const htmlLegis = legisData.length > 0 ? `<a href="${legisData[0].Link}" target="_blank">${legisData[0].DescNormaFull}${nomeLegis.trim()}</a>` : text;
      this_.html(htmlLegis);
      if (legisData.length > 0) {
        this_.attr("data-refext", dataValue).removeClass("error").addClass("refok");
      } else {
        this_.addClass("error").removeAttr("data-refext");
      }
    });
  }
  function updateRefsTags(iframe) {
    iframe.find(".legis.ref").each(function() {
      const this_ = $(this);
      const dataRef = this_.attr("data-anchor");
      const anchor = iframe.find(`.legis[data-ref="${dataRef}"] a`);
      const textRef = getNameRef(anchor, iframe, this_).trim();
      if (typeof textRef !== "undefined" && textRef !== "") {
        this_.html(textRef).removeClass("error");
        this_.closest("a").attr("href", "#" + anchor.attr("name")).attr("data-cke-saved-href", "#" + anchor.attr("name"));
      } else {
        this_.addClass("error");
      }
    });
  }
  function observeKey(iframe, button2) {
    iframe.find("body").off("keydown.seiproLegis").on("keydown.seiproLegis", function(event) {
      if (event.keyCode === 13 && legisButton(button2).hasClass("cke_button_on")) getLegis(iframe);
    });
  }
  function getNotComment(iframe) {
    iframe.find("table").each(function() {
      $(this).find("p").attr("data-comment", "true");
    });
  }
  function getLegis(iframe) {
    getNotComment(iframe);
    removeEnum(iframe);
    cleanLegis(iframe);
    updateLegis(iframe);
    getParUnico(iframe);
    getRefsTags(iframe);
    updateRefsTags(iframe);
    return getRefsLegis(iframe);
  }
  function iframeLegis(button2) {
    legisIframes(button2).each(function() {
      const iframe = $(this).contents();
      getLegis(iframe);
      observeKey(iframe, button2);
    });
  }
  function initLegis(button2) {
    const btn = legisButton(button2);
    if (btn.hasClass("cke_button_off")) {
      btn.addClass("cke_button_on").removeClass("cke_button_off").attr("aria-label", "Desativar formata\xE7\xE3o normativa").attr("onmouseover", "return infraTooltipMostrar('Desativar formata\xE7\xE3o normativa')");
      btn.find(".cke_button_label").text("Desativar formata\xE7\xE3o normativa");
      iframeLegis(button2);
    } else {
      btn.addClass("cke_button_off").removeClass("cke_button_on").attr("aria-label", "Formatar e numerar texto normativo").attr("onmouseover", "return infraTooltipMostrar('Formatar e numerar texto normativo')");
      btn.find(".cke_button_label").text("Formatar e numerar texto normativo");
      disableAllLegis(button2);
    }
  }

  // src/features/legis/legacy-api.js
  function installLegisLegacyApi() {
    [domain_exports, io_exports, view_exports].forEach((mod) => {
      Object.keys(mod).forEach((name) => {
        if (name === "configureLegisView") return;
        if (typeof mod[name] === "function") aliasGlobal(name, mod[name]);
      });
    });
  }

  // src/features/legis/index.js
  var root = getSeiPro();
  root.features.legis = {
    ...domain_exports,
    searchLegislation
  };
  configureLegisView({ search: searchLegislation });
  installLegisLegacyApi();

  // src/dom/index.js
  function ready(fn) {
    if (typeof document === "undefined") {
      fn();
      return;
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      setTimeout(fn, 0);
    }
  }

  // src/features/editor/domain.js
  var domain_exports2 = {};
  __export(domain_exports2, {
    extractTextWithNumbering: () => extractTextWithNumbering
  });
  function extractTextWithNumbering(paragraphs = []) {
    const resultado = [];
    const counters = {
      "item-n1": 0,
      "item-n2": 0,
      "item-n3": 0,
      "item-n4": 0,
      "paragrafo-n1": 0,
      "paragrafo-n2": 0,
      "paragrafo-n3": 0,
      "paragrafo-n4": 0,
      romano_maiusculo: 0,
      letra_minuscula: 0
    };
    const toRoman = (num) => {
      const romans = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
      const values = [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
      let result = "";
      let i = 0;
      while (num > 0) {
        while (num >= values[i]) {
          result += romans[i];
          num -= values[i];
        }
        i++;
      }
      return result;
    };
    const toLetter = (num) => {
      let result = "";
      let n = num;
      while (n > 0) {
        n--;
        result = String.fromCharCode(97 + n % 26) + result;
        n = Math.floor(n / 26);
      }
      return result;
    };
    paragraphs.forEach(({ className = "", textContent = "" }) => {
      let prefixo = "";
      if (className.includes("Item_Nivel1")) {
        counters["item-n1"]++;
        counters["item-n2"] = counters["item-n3"] = counters["item-n4"] = 0;
        prefixo = `${counters["item-n1"]}.`;
      } else if (className.includes("Item_Nivel2")) {
        counters["item-n2"]++;
        counters["item-n3"] = counters["item-n4"] = 0;
        prefixo = `${counters["item-n1"]}.${counters["item-n2"]}.`;
      } else if (className.includes("Item_Nivel3")) {
        counters["item-n3"]++;
        counters["item-n4"] = 0;
        prefixo = `${counters["item-n1"]}.${counters["item-n2"]}.${counters["item-n3"]}.`;
      } else if (className.includes("Item_Nivel4")) {
        counters["item-n4"]++;
        prefixo = `${counters["item-n1"]}.${counters["item-n2"]}.${counters["item-n3"]}.${counters["item-n4"]}.`;
      } else if (className.includes("Paragrafo_Numerado_Nivel1")) {
        counters["paragrafo-n1"]++;
        counters["paragrafo-n2"] = counters["paragrafo-n3"] = counters["paragrafo-n4"] = 0;
        prefixo = `${counters["paragrafo-n1"]}.`;
      } else if (className.includes("Paragrafo_Numerado_Nivel2")) {
        counters["paragrafo-n2"]++;
        counters["paragrafo-n3"] = counters["paragrafo-n4"] = 0;
        prefixo = `${counters["paragrafo-n1"]}.${counters["paragrafo-n2"]}.`;
      } else if (className.includes("Paragrafo_Numerado_Nivel3")) {
        counters["paragrafo-n3"]++;
        counters["paragrafo-n4"] = 0;
        prefixo = `${counters["paragrafo-n1"]}.${counters["paragrafo-n2"]}.${counters["paragrafo-n3"]}.`;
      } else if (className.includes("Paragrafo_Numerado_Nivel4")) {
        counters["paragrafo-n4"]++;
        prefixo = `${counters["paragrafo-n1"]}.${counters["paragrafo-n2"]}.${counters["paragrafo-n3"]}.${counters["paragrafo-n4"]}.`;
      } else if (className.includes("Item_Inciso_Romano")) {
        counters.romano_maiusculo++;
        counters.letra_minuscula = 0;
        prefixo = `${toRoman(counters.romano_maiusculo)} -`;
      } else if (className.includes("Item_Alinea_Letra")) {
        counters.letra_minuscula++;
        prefixo = `${toLetter(counters.letra_minuscula)})`;
      }
      const texto = String(textContent).trim();
      resultado.push(prefixo ? `${prefixo} ${texto}` : texto);
    });
    return resultado.join("\n");
  }

  // src/features/editor/domain/html-text.js
  function extractTextFromHtml(html, {
    parseHtml: parseHtml3,
    extract = extractTextWithNumbering
  } = {}) {
    if (typeof parseHtml3 !== "function") {
      throw new TypeError("extractTextFromHtml requer parseHtml");
    }
    const document2 = parseHtml3(String(html ?? ""));
    const paragraphs = Array.from(document2.querySelectorAll("p"), (paragraph) => ({
      className: paragraph.className,
      textContent: paragraph.textContent
    }));
    return extract(paragraphs);
  }

  // src/features/editor/view.js
  var view_exports2 = {};
  __export(view_exports2, {
    bindEditorFocus: () => bindEditorFocus,
    collectEditorText: () => collectEditorText
  });
  function collectEditorText(instances = {}, {
    extractNumber = false,
    readHtml = (instance) => instance.getData(),
    readText = (html) => String(html).replace(/<[^>]*>/g, ""),
    extractNumbered = (html) => html
  } = {}) {
    let text = "";
    for (const id in instances) {
      const html = readHtml(instances[id], id);
      text += extractNumber ? extractNumbered(html, id) : readText(html, id);
    }
    return text;
  }
  function bindEditorFocus(instances = {}, onFocus = () => {
  }) {
    for (const id in instances) {
      instances[id].on("focus", onFocus);
    }
    return Object.keys(instances).length;
  }

  // src/features/editor/state.js
  var initialFrm = typeof document !== "undefined" ? q("#frmEditor") : { length: 0 };
  var state = {
    frmEditor: initialFrm,
    idEditor: void 0,
    oEditor: void 0,
    imgEditor: void 0,
    bookmark: void 0,
    txaEditor: initialFrm.length ? "div[id^=cke_txaEditor_]" : "div#cke_txaConteudo",
    editorTitle: initialFrm.length ? "div[id^=cke_txaEditor_] iframe" : "div#cke_txaConteudo iframe",
    iframeEditor: void 0,
    langs: void 0,
    wsDialogHtml: void 0,
    indexDisplayPro: 0,
    lastTextTip: false,
    resultTextTip: false,
    CKWebSpeechHandler: void 0,
    loadOnKeyEditor: false,
    CKWebSpeech: false,
    isSeiSlim: typeof localStorage !== "undefined" && Boolean(localStorage.getItem("seiSlim")),
    isDarkMode: typeof localStorage !== "undefined" && Boolean(localStorage.getItem("darkModePro")),
    qualidadeImagens: (() => {
      try {
        let v = typeof checkConfigValue === "function" && checkConfigValue("qualidadeimagens") ? getConfigValue("qualidadeimagens") : 60;
        return Math.min(100, Math.max(0, Number(v) || 60));
      } catch {
        return 60;
      }
    })()
  };
  function installEditorStateBridge() {
    const bindings = {
      frmEditor: [() => state.frmEditor, (value) => {
        state.frmEditor = value;
      }],
      idEditor: [() => state.idEditor, (value) => {
        state.idEditor = value;
      }],
      oEditor: [() => state.oEditor, (value) => {
        state.oEditor = value;
      }],
      iframeEditor: [() => state.iframeEditor, (value) => {
        state.iframeEditor = value;
      }]
    };
    Object.entries(bindings).forEach(([name, [get, set]]) => {
      Object.defineProperty(globalThis, name, { configurable: true, enumerable: true, get, set });
    });
  }
  function setParamEditor(this_) {
    state.idEditor = q(this_).closest("div.cke").attr("id").replace("cke_", "");
    state.oEditor = CKEDITOR.instances[state.idEditor];
    state.iframeEditor = findEditorIframe(state.idEditor);
    q("#idEditor").val(state.idEditor);
  }
  function findEditorIframe(editorId) {
    var editorFrame = q("#cke_" + editorId).find("iframe").eq(0);
    if (editorFrame.length) return editorFrame.contents();
    var legacyFrame = q('iframe[title*="' + editorId + '"]').eq(0);
    if (legacyFrame.length) return legacyFrame.contents();
    return q();
  }

  // src/features/editor/api.js
  var api = {};

  // src/shared/ui/modal.js
  function openModal({ title = "", content = "", width = 600, buttons, onOpen, onClose, className = "" } = {}) {
    document.querySelectorAll(".seipro-modal").forEach((m) => m.remove());
    const previouslyFocused = document.activeElement;
    const overlay = document.createElement("div");
    overlay.className = "seipro-modal " + className;
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:100000;display:flex;align-items:center;justify-content:center;";
    const box = document.createElement("div");
    box.className = "dialogBoxDiv seipro-modal-box";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.style.cssText = "background:#fff;border-radius:6px;box-shadow:0 8px 30px rgba(0,0,0,.3);max-width:95vw;max-height:95vh;overflow:auto;width:" + width + "px;";
    const head = document.createElement("div");
    head.className = "seipro-modal-head";
    head.style.cssText = "display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #eee;font-weight:bold;";
    const titleElement = document.createElement("span");
    titleElement.className = "seipro-modal-title";
    titleElement.id = `seipro-modal-title-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    titleElement.textContent = title;
    box.setAttribute("aria-labelledby", titleElement.id);
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "seipro-modal-close";
    closeButton.setAttribute("data-modal-close", "");
    closeButton.setAttribute("aria-label", "Fechar");
    closeButton.style.cssText = "cursor:pointer;color:#888;border:0;background:transparent;padding:4px;";
    closeButton.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
    head.append(titleElement, closeButton);
    const body = document.createElement("div");
    body.className = "seipro-modal-body";
    body.style.cssText = "padding:14px;";
    const btnRow = document.createElement("div");
    btnRow.className = "seipro-modal-buttons";
    btnRow.style.cssText = "display:flex;gap:8px;justify-content:flex-end;padding:10px 14px;border-top:1px solid #eee;";
    box.append(head, body, btnRow);
    overlay.appendChild(box);
    if (typeof content === "string") body.innerHTML = content;
    else if (content instanceof Node) body.appendChild(content);
    const ref = { el: overlay, body, close };
    let onKey;
    let closed = false;
    function close() {
      if (closed) return;
      closed = true;
      document.removeEventListener("keydown", onKey, true);
      if (typeof onClose === "function") {
        try {
          onClose(ref);
        } catch (e) {
        }
      }
      overlay.remove();
      if (previouslyFocused && typeof previouslyFocused.focus === "function" && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    }
    function focusableElements() {
      return Array.from(box.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
    }
    onKey = (ev) => {
      if (ev.key === "Escape") {
        ev.stopPropagation();
        close();
        return;
      }
      if (ev.key !== "Tab") return;
      const focusable = focusableElements();
      if (!focusable.length) {
        ev.preventDefault();
        box.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (ev.shiftKey && document.activeElement === first) {
        ev.preventDefault();
        last.focus();
      } else if (!ev.shiftKey && document.activeElement === last) {
        ev.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay || ev.target.closest("[data-modal-close]")) close();
    });
    (buttons || [{ text: "Fechar", onClick: (r) => r.close() }]).forEach((b) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "newLink " + (b.class || "");
      btn.textContent = b.text;
      btn.style.cssText = "cursor:pointer;padding:4px 12px;";
      btn.addEventListener("click", () => b.onClick(ref));
      btnRow.appendChild(btn);
    });
    document.body.appendChild(overlay);
    if (typeof onOpen === "function") onOpen(ref);
    const initialFocus = body.querySelector(
      "[autofocus], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href]"
    ) || focusableElements()[0];
    if (document.activeElement === previouslyFocused) {
      if (initialFocus) initialFocus.focus();
      else {
        box.tabIndex = -1;
        box.focus();
      }
    }
    return ref;
  }

  // src/features/editor/ckeditor-access.js
  function getPageCkeditor() {
    if (globalThis.CKEDITOR && globalThis.CKEDITOR.dialog) {
      return globalThis.CKEDITOR;
    }
    try {
      if (typeof window !== "undefined" && window.CKEDITOR && window.CKEDITOR.dialog) {
        globalThis.CKEDITOR = window.CKEDITOR;
        return window.CKEDITOR;
      }
    } catch (e) {
    }
    return null;
  }
  function waitForPageCkeditor({ timeoutMs = 15e3, intervalMs = 100 } = {}) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      function tick() {
        const cke = getPageCkeditor();
        if (cke && cke.dialog) {
          resolve(cke);
          return;
        }
        if (Date.now() - start >= timeoutMs) {
          reject(new Error("CKEDITOR not available on page within timeout"));
          return;
        }
        setTimeout(tick, intervalMs);
      }
      tick();
    });
  }
  function bindCkeditorGlobal(cke) {
    if (!cke) return;
    globalThis.CKEDITOR = cke;
    try {
      if (typeof window !== "undefined") window.CKEDITOR = cke;
    } catch (e) {
    }
  }

  // src/features/editor/io/load-ai.js
  var load_ai_exports = {};
  __export(load_ai_exports, {
    loadEditorAiBundle: () => loadEditorAiBundle,
    loadPlataformAI: () => loadPlataformAI
  });

  // src/features/editor/ai-bridge.js
  var BRIDGE_ID = "seipro-editor-ai-bridge";
  var REQUEST_EVENT = "seipro-editor-ai-request";
  var RESPONSE_EVENT = "seipro-editor-ai-response";
  var OPEN_EVENT = "seipro-editor-ai-open";
  var INLINE_EVENT = "seipro-editor-ai-inline";
  function bridgeElement() {
    let element = document.getElementById(BRIDGE_ID);
    if (!element) {
      element = document.createElement("span");
      element.id = BRIDGE_ID;
      element.hidden = true;
      element.setAttribute("aria-hidden", "true");
      (document.documentElement || document.body).appendChild(element);
    }
    return element;
  }
  function currentEditor(editorId) {
    const instances = globalThis.CKEDITOR?.instances || {};
    if (editorId && instances[editorId]) return instances[editorId];
    if (state.oEditor && typeof state.oEditor.getData === "function") return state.oEditor;
    return Object.values(instances).find(
      (editor) => editor?.focusManager?.hasFocus
    ) || Object.values(instances)[0] || null;
  }
  function currentAccessMetadata() {
    const props = globalThis.dadosProcessoPro?.propProcesso || {};
    const checked = document.querySelector(
      '[name="rdoNivelAcesso"]:checked, [name="nivel_acesso"]:checked'
    );
    const raw = props.rdoNivelAcesso ?? props.nivel_acesso ?? checked?.value ?? null;
    const accessKnown = raw !== null && raw !== void 0 && String(raw).trim() !== "";
    return {
      nivelAcesso: accessKnown ? raw : null,
      accessKnown,
      hipoteseLegal: props.selHipoteseLegal || props.hdnNomeHipoteseLegal || props.hipotese_legal || ""
    };
  }
  function processSnapshot() {
    const data = globalThis.dadosProcessoPro || {};
    const props = data.propProcesso || {};
    const links = [
      ...data.treeModel?.linksAll || [],
      ...data.listLinksAll || [],
      ...data.treeModel?.links || [],
      ...data.listLinks || []
    ];
    const sourceDocuments = data.treeModel?.documents || data.listDocumentos || data.listDocumentosAssinados || [];
    const documents = sourceDocuments.map((item, index) => {
      const id = String(item.id_documento || item.id_protocolo || item.id || index);
      const src = item.src || links.find((link) => String(link).includes(`id_documento=${id}`)) || "";
      const accessFields = ["nivelAcesso", "nivel_acesso", "sigilo"];
      const accessKnown = item.accessKnown !== false && accessFields.some(
        (field) => Object.prototype.hasOwnProperty.call(item, field)
      );
      return {
        id,
        numeroSEI: String(item.numeroSEI || item.nr_sei || item.numero || ""),
        tipo: item.tipo || item.nome_documento || item.documento || item.nome || "Documento",
        data: item.data || item.data_documento || item.data_assinatura || "",
        unidade: item.unidade || "",
        nivelAcesso: item.nivelAcesso ?? item.nivel_acesso ?? item.sigilo ?? null,
        accessKnown,
        hipoteseLegal: item.hipoteseLegal || item.hipotese_legal || "",
        src: absolutize(src)
      };
    });
    return {
      process: compact({
        processNumber: props.hdnProtocoloFormatado || props.txtProtocoloExibir,
        processType: props.hdnNomeTipoProcedimento || props.selTipoProcedimento,
        specification: props.txtDescricao,
        interestedParties: props.selInteressados_select || props.selInteressadosProcedimento || props.interessados,
        subjects: props.selAssuntos_select || props.assuntos,
        notes: props.txaObservacoes,
        openedAt: props.hdnDtaGeracao || props.txtDtaGeracaoExibir || props.data_geracao,
        accessLevel: props.rdoNivelAcesso ?? props.nivel_acesso
      }),
      documents,
      history: Array.isArray(data.listAndamento) ? data.listAndamento : []
    };
  }
  function absolutize(value) {
    if (!value) return "";
    try {
      return new URL(value, location.href).href;
    } catch (_) {
      return String(value);
    }
  }
  function compact(value) {
    return Object.fromEntries(Object.entries(value).filter(
      ([, item]) => item !== void 0 && item !== null && item !== ""
    ));
  }
  function snapshot(payload = {}) {
    const editor = currentEditor(payload.editorId);
    if (!editor) throw new Error("Nenhum editor CKEditor ativo foi encontrado");
    const selection = editor.getSelection?.();
    return {
      editorId: editor.name || payload.editorId || "",
      html: String(editor.getData?.() || ""),
      selectedText: String(selection?.getSelectedText?.() || ""),
      title: document.title || "",
      documentId: new URLSearchParams(location.search).get("id_documento") || "",
      ...currentAccessMetadata(),
      ...processSnapshot()
    };
  }
  function insertHtml(payload = {}) {
    const editor = currentEditor(payload.editorId);
    if (!editor) throw new Error("Nenhum editor CKEditor ativo foi encontrado");
    const html = String(payload.html || "");
    editor.focus?.();
    editor.fire?.("saveSnapshot");
    if (payload.inlineMarker) {
      const editable = editor.editable?.();
      const root3 = editable?.$;
      const paragraphs = root3 ? Array.from(root3.querySelectorAll("p")) : [];
      const marker = String(payload.inlineMarker);
      const target = paragraphs.find(
        (paragraph) => String(paragraph.textContent || "").includes(marker)
      );
      if (target) {
        target.insertAdjacentHTML("afterend", html);
        target.remove();
      } else {
        editor.insertHtml?.(html);
      }
    } else {
      editor.insertHtml?.(html);
    }
    editor.fire?.("saveSnapshot");
    return { inserted: true, editorId: editor.name || "" };
  }
  function handleOperation(operation, payload) {
    if (operation === "snapshot") return snapshot(payload);
    if (operation === "insertHtml") return insertHtml(payload);
    throw new Error(`Opera\xE7\xE3o de editor n\xE3o permitida: ${operation}`);
  }
  function installEditorAiBridge() {
    const element = bridgeElement();
    if (element.dataset.mainInstalled === "true") return element;
    element.dataset.mainInstalled = "true";
    element.addEventListener(REQUEST_EVENT, () => {
      let request = {};
      try {
        request = JSON.parse(element.dataset.request || "{}");
        const result = handleOperation(request.operation, request.payload || {});
        element.dataset.response = JSON.stringify({
          id: request.id,
          ok: true,
          result
        });
      } catch (error) {
        element.dataset.response = JSON.stringify({
          id: request.id,
          ok: false,
          error: String(error?.message || error)
        });
      }
      element.dispatchEvent(new CustomEvent(RESPONSE_EVENT));
    });
    return element;
  }
  function requestAiOpen(editorId = "") {
    const element = bridgeElement();
    element.dataset.open = JSON.stringify({ editorId });
    element.dispatchEvent(new CustomEvent(OPEN_EVENT));
  }
  function requestAiInline({ editorId = "", prompt = "", marker = "" } = {}) {
    const element = bridgeElement();
    element.dataset.inline = JSON.stringify({ editorId, prompt, marker });
    element.dispatchEvent(new CustomEvent(INLINE_EVENT));
  }
  function readAiEditorConfig() {
    const element = bridgeElement();
    try {
      const config = JSON.parse(element.dataset.config || "{}");
      return {
        inlineEnabled: config.inlineEnabled === true,
        keyword: String(config.keyword || "+gpt")
      };
    } catch (_) {
      return { inlineEnabled: false, keyword: "+gpt" };
    }
  }
  var EDITOR_AI_BRIDGE = Object.freeze({
    id: BRIDGE_ID,
    requestEvent: REQUEST_EVENT,
    responseEvent: RESPONSE_EVENT,
    openEvent: OPEN_EVENT,
    inlineEvent: INLINE_EVENT
  });

  // src/features/editor/io/load-ai.js
  function loadEditorAiBundle() {
    return Promise.resolve(true);
  }
  function loadPlataformAI(this_) {
    let editorId = "";
    try {
      editorId = String(this_?.closest?.(".cke")?.id || "").replace(/^cke_/, "");
    } catch {
    }
    requestAiOpen(editorId);
  }
  api.loadEditorAiBundle = loadEditorAiBundle;
  api.loadPlataformAI = loadPlataformAI;

  // src/features/editor/view/toolbar.js
  var toolbar_exports = {};
  __export(toolbar_exports, {
    addButton: () => addButton,
    setClickButtons: () => setClickButtons
  });
  function addButton(TimeOut = 9e3) {
    if (TimeOut <= 0) return;
    setTimeout(function() {
      if (typeof api.getPageCkeditor === "function") {
        const cke = api.getPageCkeditor();
        if (cke && typeof api.bindCkeditorGlobal === "function") api.bindCkeditorGlobal(cke);
      }
      if (typeof globalThis.CKEDITOR === "undefined" || !globalThis.CKEDITOR.dialog) {
        api.addButton(TimeOut - 100);
        return;
      }
      if (q(state.txaEditor).length && !q(".cke_buttonPro").length) {
        if (!q("#idEditor").length) q("#divComandos").append('<input style="display:none" type="hidden" id="idEditor">');
        q(state.txaEditor).each(function() {
          var currentEditorId = q(this).attr("id").replace("cke_", "");
          var editorInstance = globalThis.CKEDITOR.instances[currentEditorId];
          var editable = editorInstance ? editorInstance.readOnly === false : q('iframe[title*="' + currentEditorId + '"]').contents().find("body").attr("contenteditable") == "true";
          var status = editable ? "" : "disable";
          q(this).find("span.cke_toolbox").append(api.htmlButton(status).default);
          q(this).find("span.cke_toolgroup .cke_button__table").before(api.htmlButton(status).tables);
          q(this).find("span.cke_toolgroup .cke_button__minuscula").after(api.htmlButton(status).afterletters);
          q(this).find("span.cke_toolgroup .cke_button__cut").before(api.htmlButton(status).beforeCut);
          q(this).find("span.cke_toolgroup .cke_button__numberedlist").before(api.htmlButton(status).beforeList);
          q(this).find("span.cke_toolgroup .cke_button__base64image").after(api.htmlButton(status).afterImage);
          q(this).find("span.cke_toolbox").append(api.htmlButton(status).newBlock);
          if (editable && typeof insertFontIcon === "function") {
            insertFontIcon("head", q('iframe[title*="' + currentEditorId + '"]').contents());
          }
        });
        api.setClickButtons();
        api.initFunctions();
        api.addStyleIframes();
      } else {
        api.addButton(TimeOut - 100);
        console.log("addButton Reload => " + TimeOut);
      }
    }, 500);
  }
  var setClickButtons = () => {
    return true;
  };
  api.addButton = addButton;
  api.setClickButtons = setClickButtons;

  // src/features/editor/adapter.js
  installDomqDialog(openModal);
  function ensureEditorDialogHost(id = "dialogBoxPro", root3 = document) {
    const existing = root3?.getElementById?.(id);
    if (existing) return existing;
    const parent = root3?.body || root3?.documentElement;
    if (!parent || typeof root3?.createElement !== "function") return null;
    const host = root3.createElement("div");
    host.id = id;
    host.style.display = "none";
    parent.appendChild(host);
    return host;
  }
  (function patchResetDialogBox() {
    const prev = typeof globalThis.resetDialogBoxPro === "function" ? globalThis.resetDialogBoxPro : null;
    globalThis.resetDialogBoxPro = function resetDialogBoxProPatched(id) {
      if (q._lastModal && typeof q._lastModal.close === "function") {
        try {
          q._lastModal.close();
        } catch (e) {
        }
        q._lastModal = null;
      }
      let result;
      if (prev) result = prev(id);
      ensureEditorDialogHost(id);
      return result;
    };
    ensureEditorDialogHost();
  })();
  function bootEditor() {
    state.frmEditor = q("#frmEditor");
    state.txaEditor = state.frmEditor.length ? "div[id^=cke_txaEditor_]" : "div#cke_txaConteudo";
    state.editorTitle = state.frmEditor.length ? "div[id^=cke_txaEditor_] iframe" : "div#cke_txaConteudo iframe";
    const bodyText = document.body && (document.body.innerText || document.body.textContent) || "";
    if (/documento\s+n[aã]o\s+encontrado/i.test(bodyText) || /erro\s+documento/i.test(bodyText)) {
      console.warn("SEI Pro editor: SEI document error page \u2014 skip boot");
      return;
    }
    q("body").addClass("seiEditor");
    waitForPageCkeditor().then((cke) => {
      bindCkeditorGlobal(cke);
      addButton();
    }).catch((err) => {
      console.error("SEI Pro editor: CKEDITOR unavailable", err);
    });
  }
  api.bootEditor = bootEditor;
  api.installEditorStateBridge = installEditorStateBridge;
  api.setParamEditor = setParamEditor;
  api.getPageCkeditor = getPageCkeditor;
  api.waitForPageCkeditor = waitForPageCkeditor;
  api.bindCkeditorGlobal = bindCkeditorGlobal;

  // src/features/editor/templates/toolbar.js
  var toolbar_exports2 = {};
  __export(toolbar_exports2, {
    htmlButton: () => htmlButton,
    htmlButtonPro: () => htmlButtonPro
  });
  function htmlButton(status) {
    var classStatus = status == "disable" ? "cke_button_disabled" : "";
    var icon16baseImport = URL_SPRO + "icons/menu/import.png";
    var icon16baseTable = URL_SPRO + "icons/menu/table.png";
    var icon16baseLegis = URL_SPRO + "icons/menu/legis.png";
    var icon16baseCapLetter = URL_SPRO + "icons/menu/capletter.png";
    var icon16baseCitaDocumento = URL_SPRO + "icons/menu/citacao.png";
    var icon16baseNotaRodape = URL_SPRO + "icons/menu/notarodape.png";
    var icon16baseSumario = URL_SPRO + "icons/menu/sumario.png";
    var icon16baseDadosProcesso = URL_SPRO + "icons/menu/dadosprocesso.png";
    var icon16baseQrCode = URL_SPRO + "icons/menu/qrcode.png";
    var icon16basePageBreak = URL_SPRO + "icons/menu/pagebreak.png";
    var icon16baseSessionBreak = URL_SPRO + "icons/menu/sessionbreak.png";
    var icon16baseQuickTable = URL_SPRO + "icons/menu/quicktable.png";
    var icon16baseFonteSizeUp = URL_SPRO + "icons/menu/fontsizeup.png";
    var icon16baseFonteSizeDown = URL_SPRO + "icons/menu/fontsizedown.png";
    var icon16baseCopyStyle = URL_SPRO + "icons/menu/copystyle.png";
    var icon16baseAlignCenter = URL_SPRO + "icons/menu/aligncenter.png";
    var icon16baseAlignRight = URL_SPRO + "icons/menu/alignright.png";
    var icon16baseAlignLeft = URL_SPRO + "icons/menu/alignleft.png";
    var icon16baseAlignJustify = URL_SPRO + "icons/menu/alignjustify.png";
    var icon16baseDocPublico = URL_SPRO + "icons/menu/docpublico.png";
    var icon16baseWatermark = URL_SPRO + "icons/menu/watermark.png";
    var icon16baseImagePage = URL_SPRO + "icons/menu/imagepage.png";
    var icon16baseMarkSigilo = URL_SPRO + "icons/menu/marksigilo.png";
    var icon16baseBoxSigilo = URL_SPRO + "icons/menu/boxsigilo.png";
    var icon16baseSEILegis = URL_SPRO + "icons/menu/seilegis.png";
    var icon16baseBatchImgQuality = URL_SPRO + "icons/menu/batchimgquality.png";
    var icon16baseInsertCheckboxQuality = URL_SPRO + "icons/menu/insertcheckbox.png";
    var icon16baseOpenAI = URL_SPRO + "icons/menu/openai.png";
    var icon16baseRefInterna = URL_SPRO + "icons/menu/refinterna.png";
    var icon16baseReview = URL_SPRO + "icons/menu/review.png";
    var icon16baseCtrReview = URL_SPRO + "icons/menu/ctrreview.png";
    var icon16baseNewStyle = URL_SPRO + "icons/menu/newstyle.png";
    const htmlButtonTable = '<div class="seipro-editor-quick-table" style="display:none;"></div>' + api.htmlButtonPro(
      "getQuickTableButtom",
      "quicktable",
      "Tabela R\xE1pida",
      icon16baseQuickTable
    ) + api.htmlButtonPro(
      "getTablestylesButtom",
      "tablestyles",
      "Adicionar estilo \xE0 tabela",
      icon16baseTable
    );
    const htmlButtonAfterImage = api.htmlButtonPro(
      "getBatchImgQualityButtom",
      "batch_quality_pro",
      "Reduzir qualidade das imagens",
      icon16baseBatchImgQuality
    ) + api.htmlButtonPro(
      "getInsertCheckboxButtom",
      "insert_checkbox_pro",
      "Inserir caixa de sele\xE7\xE3o",
      icon16baseInsertCheckboxQuality
    );
    const htmlButtonBeforeCut = api.htmlButtonPro(
      "getCopyStyleButtom",
      "copy_style_pro",
      "Copiar formata\xE7\xE3o",
      icon16baseCopyStyle
    );
    const htmlButtonBeforeList = '<div class="seipro-editor-align-menu" style="display:none;">' + api.htmlButtonPro(
      "getAlignLeftButtom",
      "align_left_pro",
      "Alinhar texto \xE0 esquerda",
      icon16baseAlignLeft
    ) + api.htmlButtonPro(
      "getAlignCenterButtom",
      "align_center_pro",
      "Alinhar texto ao centro",
      icon16baseAlignCenter
    ) + api.htmlButtonPro(
      "getAlignRightButtom",
      "align_right_pro",
      "Alinhar texto \xE0 direita",
      icon16baseAlignRight
    ) + api.htmlButtonPro(
      "getAlignJustifyButtom",
      "align_justify_pro",
      "Alinhar texto justificadamente",
      icon16baseAlignJustify
    ) + "</div>" + api.htmlButtonPro(
      "getAlignButtom",
      "align_pro",
      "Alinhar texto roxoColor",
      icon16baseAlignCenter
    );
    const htmlButtonAfterLetters = api.htmlButtonPro(
      "getCapLetterButtom",
      "capletter_pro",
      "Primeira Letra Mai\xFAscula (Exceto artigos e preposi\xE7\xF5es)",
      icon16baseCapLetter
    ) + api.htmlButtonPro(
      "getFontSizeUpButtom",
      "fontsize_up_pro",
      "Aumentar tamanho da fonte",
      icon16baseFonteSizeUp
    ) + api.htmlButtonPro(
      "getFontSizeDownButtom",
      "fontsize_down_pro",
      "Diminuir tamanho da fonte cianoColor",
      icon16baseFonteSizeDown
    );
    const htmlButton2 = (restrictConfigValue("ferramentasia") ? api.htmlButtonPro(
      "getPlataformAIButtom seipro-ai-toolbar-button",
      "openai",
      "Abrir Assistente IA",
      icon16baseOpenAI,
      "",
      "",
      "Assistente IA"
    ) : "") + api.htmlButtonPro(
      "importDocButtom",
      "externalfile",
      "Inserir texto de conte\xFAdo externo (Word, HTML ou Google)",
      icon16baseImport
    ) + api.htmlButtonPro(
      "getLinkLegisButtom",
      "linklegis",
      "Adicionar link de legisla\xE7\xE3o",
      icon16baseLegis
    ) + (state.frmEditor.length ? api.htmlButtonPro(
      "getCitacaoDocumentoButtom",
      "citacaodoc",
      "Inserir refer\xEAncia de documento do processo",
      icon16baseCitaDocumento
    ) : "") + api.htmlButtonPro(
      "getNotaRodapeButtom",
      "notarodape",
      "Inserir nota de rodap\xE9",
      icon16baseNotaRodape
    ) + api.htmlButtonPro(
      "getRefInternaButtom",
      "refinterna",
      "Inserir refer\xEAncia interna",
      icon16baseRefInterna
    ) + api.htmlButtonPro(
      "getSumarioButtom",
      "sumario",
      "Inserir sum\xE1rio",
      icon16baseSumario
    ) + (state.frmEditor.length == 0 ? "" : api.htmlButtonPro(
      "getDadosProcessoButtom",
      "dadosprocesso",
      "Inserir dados do processo",
      icon16baseDadosProcesso
    )) + api.htmlButtonPro(
      "getQrCodeButtom",
      "qrcode",
      "Gerar C\xF3digo QR",
      icon16baseQrCode
    ) + api.htmlButtonPro(
      "getPageBreakButtom",
      "pagebreak",
      "Inserir Quebra de P\xE1gina",
      icon16basePageBreak,
      "",
      state.isSeiSlim ? "" : "!important"
    ) + api.htmlButtonPro(
      "getSessionBreakButtom",
      "sessionbreak",
      "Inserir Quebra de Se\xE7\xE3o",
      icon16baseSessionBreak
    ) + api.htmlButtonPro(
      "getProcessoPublicoButton",
      "processopublico",
      "Adicionar Link de Documento P\xFAblico",
      icon16baseDocPublico
    ) + api.htmlButtonPro(
      "getMinutaWatermarkButton",
      "watermark",
      "Adicionar Marca D'\xE1gua de MINUTA/MODELO",
      icon16baseWatermark
    ) + api.htmlButtonPro(
      "pageImageBackgroundButtom",
      "pageimagebackground",
      "Adicionar Image de Fundo e Configura\xE7\xF5es de P\xE1gina para Impress\xE3o",
      icon16baseImagePage
    );
    const htmlButtonReview = checkConfigValue("revisaotexto") ? api.htmlButtonPro(
      "getReviewButton",
      "review",
      "Ativar revis\xE3o de texto",
      icon16baseReview
    ) + api.htmlButtonPro(
      "getCtrReviewButton",
      "ctr_review",
      "Gerenciar revis\xF5es de texto",
      icon16baseCtrReview
    ) : "";
    const htmlButtonDitado = checkConfigValue("ditado") ? api.htmlButtonPro(
      "getDitadoButton",
      "ditado",
      "Ativar ditado de texto (reconhecimento de fala do Chrome)",
      URL_SPRO + "icons/editor/webspeech.png"
    ) + api.htmlButtonPro(
      "getCtrDitadoButton",
      "ctr_ditado",
      "Gerenciar configura\xE7\xF5es do ditado",
      URL_SPRO + "icons/editor/webspeech-settings.png"
    ) : "";
    const htmlButtonNewStyle = SeiPro.sei.adapter.isNewSEI() ? api.htmlButtonPro(
      "getNewStyleButton",
      "newstyle",
      "Ativar estilo avan\xE7ado",
      icon16baseNewStyle,
      "",
      localStorage.getItem("seiSlim_editor") ? "cke_button_on" : "cke_button_off"
    ) : "";
    const htmlButtonSigilo = api.htmlButtonPro(
      "getMarkSigiloButton",
      "mark_sigilo_pro",
      "Adicionar / Remover marca de sigilo no texto",
      icon16baseMarkSigilo
    ) + api.htmlButtonPro(
      "getBoxSigiloButton",
      "boxsigilo",
      "Gerenciar marcas de sigilo do documento",
      icon16baseBoxSigilo
    );
    const htmlButtonLegis = api.htmlButtonPro(
      "getLegisButtom",
      "legis",
      "Formatar e numerar texto normativo",
      icon16baseSEILegis
    );
    const blockHtmlButton = `<span class="cke_iconPro cke_toolgroup ${classStatus}" role="presentation">${htmlButton2}</span>`;
    const htmlNewBlock = `
            <span class="cke_iconPro cke_toolgroup ${classStatus}" role="presentation">
            ${htmlButtonSigilo}
            ${htmlButtonReview}
            ${htmlButtonLegis}
            ${htmlButtonDitado}
            ${htmlButtonNewStyle}
            </span>
        `;
    return {
      default: blockHtmlButton,
      tables: htmlButtonTable,
      beforeCut: htmlButtonBeforeCut,
      afterletters: htmlButtonAfterLetters,
      beforeList: htmlButtonBeforeList,
      newBlock: htmlNewBlock,
      afterImage: htmlButtonAfterImage
    };
  }
  var htmlButtonPro = (classClick, cke_class, title, icon, extraStyle = "", important = "", label = title) => `
    <a class="${classClick} cke_iconPro cke_button cke_buttonPro cke_button_off" href="#" title="${title}" aria-label="${title}" role="button" hidefocus="true">
        <span class="cke_button_icon cke_button__${cke_class}_icon" style="background: url('${icon}') ${extraStyle} ${important}">&nbsp;</span>
        <span class="cke_button_label" aria-hidden="false">${label}</span>
    </a>`;
  api.htmlButton = htmlButton;
  api.htmlButtonPro = htmlButtonPro;

  // src/features/editor/view/styles.js
  var styles_exports = {};
  __export(styles_exports, {
    addStyleIframes: () => addStyleIframes,
    getInsertCheckboxButtom: () => getInsertCheckboxButtom,
    initCKEDITOR_SEIPRO: () => initCKEDITOR_SEIPRO,
    removeDataCkeSavedImg: () => removeDataCkeSavedImg,
    repairBugChrome116: () => repairBugChrome116,
    setActionCheckbox: () => setActionCheckbox,
    setDarkModeCkePanel: () => setDarkModeCkePanel,
    setOnBodyActs: () => setOnBodyActs
  });
  function removeDataCkeSavedImg() {
    q(state.editorTitle).each(function() {
      var iframe = q(this).contents();
      if (iframe.find("body").attr("contenteditable") == "true") {
        iframe.find("img").removeAttr("data-cke-saved-src");
      }
    });
  }
  function addStyleIframes(TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    setTimeout(function() {
      q('div[id*="cke_txaEditor_"] a.cke_button').each(function() {
        var title = q(this).attr("title");
        title = typeof title !== "undefined" ? title.replace(/["']/g, "") : "";
        if (typeof title !== "undefined" && title != "") {
          q(this).attr("onmouseover", "return infraTooltipMostrar('" + title + "')").attr("onmouseout", "return infraTooltipOcultar()").removeAttr("title");
        }
      });
      if (q(state.editorTitle).eq(0).contents().find("head").find('style[data-style="seipro"]').length == 0) {
        q(state.editorTitle).each(function() {
          var iframe = q(this).contents();
          if (iframe.find("head").find('style[data-style="seipro"]').length == 0) {
            iframe.find("head").append(('<style type="text/css" data-style="seipro">\n' + (localStorage.getItem("darkModePro") ? "   * { color: #fbfbfe; }\n" : "") + '   span.checkboxSEI {cursor: pointer;}\n   p .ancoraSei { background: #e4e4e4; }\n   html.dark-mode body[contenteditable="false"],\n   html.dark-mode p.Texto_Fundo_Cinza_Maiusculas_Negrito,\n   html.dark-mode p.Texto_Fundo_Cinza_Negrito,\n   html.dark-mode p .ancoraSei,\n   html.dark-mode p.Item_Nivel1 {\n       background-color: #e5e5e566 !important;\n   }\n   html.dark-mode .dark-mode-color-black,\n   html.dark-mode .dark-mode-color-black * {\n       color: #000 !important;\n   }\n   html.dark-mode .dark-mode-color-white,\n   html.dark-mode .dark-mode-color-white * {\n       color: #fff !important;\n   }\n   .dot-flashing,.dot-flashing::after,.dot-flashing::before{width:7px;height:7px;background-color:#4285f4;color:#4285f4}.dot-flashing{position:relative;border-radius:50%;animation:1s linear .5s infinite alternate dot-flashing}.dot-flashing::after,.dot-flashing::before{content:"";display:inline-block;position:absolute;top:0}.dot-flashing::before{left:-13px;border-radius:5px;animation:1s infinite alternate dot-flashing}.dot-flashing::after{left:13px;border-radius:50%;animation:1s 1s infinite alternate dot-flashing}@keyframes dot-flashing{0%{background-color:#4285f4}100%,50%{background-color:rgba(152,128,255,.2)}}\n   p[contenteditable="false"] { background-color: #f3f3f3; position: relative; }\n   p[contenteditable="false"]::after { content: "\\f023"; font-family: "Font Awesome 5 Pro"; right: 0; position: absolute; color: #747474; opacity: 0.5;}\n   a.anchorRefInternaPro { cursor: pointer; }\n   p .legis { background: #f1f1f1; }\n   p .error { background-color: #ffd2d2; }\n   p .alert { cursor: pointer; background: #fffbc9; border-left: 3px solid #ffe52a; padding-left: 4px; }    span.tooltips { position: absolute; text-align: left; background: #fffbc9; text-indent: 0; border-left: 3px solid #ffe52a; margin: -46px 0px 0px -7px; width: 500px; font-size: 10pt; padding: 5px; color: #636363; height: 36px; }   span.tooltips .ignoretext { background: #ecdc89; padding: 3px 5px; margin: 3px; font-size: 8pt; text-transform: uppercase; border-radius: 5px; float: right; }   span.sigiloSEI { background-color: #ececec; border-bottom: 2px solid #d79d23; }\n   span.sigiloSEI::before { content: "\\f023"; font-family: "Font Awesome 5 ' + (state.isSeiSlim ? "Pro" : "Free") + `"; color: #d79d23; margin: 0 5px; font-size: 80%; font-weight: 600; }
   html.dark-mode .pageBreakPro, html.dark-mode .sessionBreakPro { background: #6f7071; height: 15px; }
   .pageBreakPro, .sessionBreakPro { background: #f1f1f1; height: 15px; }
   .pageBreakPro::before, .sessionBreakPro::before { border-bottom: 2px dashed #bfbfbf; display: block; content: ''; height: 7px; }
   .pageBreakPro::after, .sessionBreakPro::after { content: '\u21B3 Quebra de p\xE1gina'; font-family: Calibri; text-align: center; display: block; margin-top: -10px; color: #585858; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff; font-size: 10pt; font-style: italic; }
   .sessionBreakPro::after { content: '\u21B3 Quebra de se\xE7\xE3o' !important; }
   .linkDisplayPro, .reviewDisplayPro { max-width: 90% !important; user-select: none; position: absolute; display: inline-block; padding: 8px; box-shadow: 0 1px 3px 1px rgba(60,64,67,.35); background: #fff; border-color: #dadce0; border-radius: 8px; margin-top: 16px; text-align: left; text-indent: initial; font-size: 12pt; text-transform: initial; font-weight: initial; letter-spacing: initial; text-decoration: initial; white-space: nowrap; }
   .linkDisplayPro a, .reviewDisplayPro a { padding: 0 8px; cursor: pointer; text-decoration: underline; color:#1155cc; }
   .linkDisplayPro strong.title-linktip { width: calc(100% - 160px); display: inline-flex; overflow: hidden; }
   .linkDisplayPro ul { margin: 0;padding: 0;max-height: 207px;overflow-y: scroll; }
   .linkDisplayPro li { padding: 5px; cursor:pointer; }
   .linkDisplayPro li.highlighted, .linkDisplayPro li:hover { background-color: #3875d7; background-image: linear-gradient(#3875d7 20%, #2a62bc 90%); color: #ffffff; }
   html.dark-mode .linkDisplayPro, html.dark-mode .reviewDisplayPro { background-color:#3D3D3D !important; }
   html.dark-mode .linkDisplayPro a, html.dark-mode .reviewDisplayPro a { color:#fbfbfe !important; }
   span.reviewSeiPro[data-comment][data-review="delete"]:before { content: "\\f075";font-family: 'Font Awesome 5 ` + (state.isSeiSlim ? "Pro" : "Free") + `';color: #e9af68;font-size: 80%;font-weight: bold;margin: -8px 0px 0 -13px;position: absolute;transform: scale(-1, 1);}
   span.reviewSeiPro[data-comment][data-review="add"]:before { content: "\\f075";font-family: 'Font Awesome 5 ` + (state.isSeiSlim ? "Pro" : "Free") + `';color: #e9af68;font-size: 80%;font-weight: bold;margin: -8px 0px 0 -13px;position: absolute;transform: scale(-1, 1);}
   html.dark-mode .cke_copyformatting_active { cursor: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIiA/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgd2lkdGg9IjEzLjY0MDMyODc0MzE5OTIzNCIgaGVpZ2h0PSIxNi4xMjAwMDAwMDAwMDAwMDUiIHZpZXdCb3g9IjMxNC42Njk2NzEyNTY4MDA3NyAzMTEuOTQgMTMuNjQwMzI4NzQzMTk5MjM0IDE2LjEyMDAwMDAwMDAwMDAwNSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxkZXNjPkNyZWF0ZWQgd2l0aCBGYWJyaWMuanMgNC42LjA8L2Rlc2M+CjxkZWZzPgo8L2RlZnM+CjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuMDYgMCAwIDAuMDYgMzI0LjU3IDMyMCkiIGlkPSJ3MGQwNHhBNjhSaG1qYldBZWQyTmgiICA+CjxwYXRoIHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1kYXNob2Zmc2V0OiAwOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgZmlsbDogcmdiKDI1NSwyNTUsMjU1KTsgZmlsbC1ydWxlOiBldmVub2RkOyBvcGFjaXR5OiAxOyIgdmVjdG9yLWVmZmVjdD0ibm9uLXNjYWxpbmctc3Ryb2tlIiAgdHJhbnNmb3JtPSIgdHJhbnNsYXRlKC0xNTEsIC0xMjYpIiBkPSJNIDE3MCAxNCBMIDIwMC4wMDc1MzcgMTQgQyAyMDIuNzY5MDU3IDE0IDIwNSAxMS43NjM2NDkzIDIwNSA5LjAwNDk3MDkyIEwgMjA1IDQuOTk1MDI5MDggQyAyMDUgMi4yMzM4MjIxMiAyMDIuNzY0Nzk4IDAgMjAwLjAwNzUzNyAwIEwgMTAxLjk5MjQ2MyAwIEMgOTkuMjMwOTQzMSAwIDk3IDIuMjM2MzUwNjkgOTcgNC45OTUwMjkwOCBMIDk3IDkuMDA0OTcwOTIgQyA5NyAxMS43NjYxNzc5IDk5LjIzNTIwMTcgMTQgMTAxLjk5MjQ2MyAxNCBMIDEzMyAxNCBMIDEzMyAyMzggTCAxMDEuOTkyNDYzIDIzOCBDIDk5LjIzMDk0MzEgMjM4IDk3IDI0MC4yMzYzNTEgOTcgMjQyLjk5NTAyOSBMIDk3IDI0Ny4wMDQ5NzEgQyA5NyAyNDkuNzY2MTc4IDk5LjIzNTIwMTcgMjUyIDEwMS45OTI0NjMgMjUyIEwgMjAwLjAwNzUzNyAyNTIgQyAyMDIuNzY5MDU3IDI1MiAyMDUgMjQ5Ljc2MzY0OSAyMDUgMjQ3LjAwNDk3MSBMIDIwNSAyNDIuOTk1MDI5IEMgMjA1IDI0MC4yMzM4MjIgMjAyLjc2NDc5OCAyMzggMjAwLjAwNzUzNyAyMzggTCAxNzAgMjM4IEwgMTcwIDE0IFoiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz4KPC9nPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjA2IDAgMCAwLjA2IDMxOCAzMTkuNDgpIiBpZD0iNjlfbUZlWUc0MzlsTGM2X3FqUHlhIiAgPgo8cGF0aCBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDE7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtZGFzaG9mZnNldDogMDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDQ7IGZpbGw6IHJnYigyNTUsMjU1LDI1NSk7IGZpbGwtcnVsZTogZXZlbm9kZDsgb3BhY2l0eTogMTsiIHZlY3Rvci1lZmZlY3Q9Im5vbi1zY2FsaW5nLXN0cm9rZSIgIHRyYW5zZm9ybT0iIHRyYW5zbGF0ZSgtNDcuNTcsIC0xMTcuNzgpIiBkPSJNIDY1IDIyMi4yODA4MjkgQyA2MC42MTMxMTc2IDIyMi4yODA4MjkgNTYuMzc0MjE2MiAyMjIuMjgwODI4IDUyLjk5OTk5OTUgMjIyLjI4MDgyOCBMIDUzIDE3MCBMIDQyIDE3MCBMIDQyIDIyMi41NjA1OTMgQyAzOC42MTMwMjQ2IDIyMi41NjA1OTMgMzQuMzc2MzMwOCAyMjIuNTYwNTkzIDMwLjAwMDAwMDUgMjIyLjU2MDU5NCBMIDMwIDE3MCBMIDE5IDE3MCBMIDE5IDIyMi41NjA1OTUgQyAxNi4zMjQ4NjUgMjIyLjU2MDU5NSAxMy44NDYzMzY5IDIyMi41NjA1OTUgMTEuNzYxMjcyNSAyMjIuNTYwNTk2IEMgLTAuMzY5NTg2NDM4IDIyMi41NjA1OTkgMS4yODM4MTc0NiAyMTEuNTA5MzEzIDEuMjgzODE3NDYgMjExLjUwOTMxMyBDIDEuMjgzODE3NDYgMjExLjUwOTMxMyAwLjM4OTY4OTk0NCAxNzcuNzU2IDAuMzk2NTcxMjc3IDE1OCBMIDk0Ljc0MDgyMzIgMTU4IEMgOTQuNzM5MjczNiAxNzcuNzkzMDg5IDkzLjg1MzUzOTYgMjExLjIyOTU0OCA5My44NTM1Mzk2IDIxMS4yMjk1NDggQyA5My44NTM1Mzk2IDIxMS4yMjk1NDggOTUuNTA2OTQzNSAyMjIuMjgwODM0IDgzLjM3NjA4NDUgMjIyLjI4MDgzMSBDIDgxLjI1NTM3ODIgMjIyLjI4MDgzIDc4LjcyNzY0MTUgMjIyLjI4MDgzIDc2LjAwMDAwMDIgMjIyLjI4MDgzIEwgNzYgMTcwIEwgNjUgMTcwIEwgNjUgMjIyLjI4MDgyOSBaIE0gMC41NzQ1MzQwMzYgMTQ3IEMgMC41Nzk3NjgzODcgMTQ2Ljg5NjE0OSAwLjU4NTEzMTYzOCAxNDYuNzk0NzU1IDAuNTkwNjI1NTE0IDE0Ni42OTU4NjYgQyAxLjI4MzgxNzQ4IDEzNC4yMTg0MDkgLTAuNzk3MTEyMjg2IDEyMi40MzQxNDYgMTYuODc5MjgxNiAxMTYuMTk1NDIyIEMgMzQuNTU1Njc1NSAxMDkuOTU2Njk4IDI4LjY2NjI1MzYgMTA3LjUzMDUyMiAzMC4zOTc4NzkyIDk1Ljc0NjI1NzYgQyAzMi4xMjk1MDQ4IDgzLjk2MTk5MyAyNS44OTIxMjk4IDc4LjA2OTg2MyAyNS44OTIxMzE1IDQ0Ljc5NjY0OTYgQyAyNS44OTIxMzMgMTcuOTYwNzIwNiAzOC41MTY5NDY3IDEzLjkyMjAxNzMgNDUuNTIyMDkzOSAxMy4zNjM3NjE3IEMgNDUuNjA4OTgxNCAxMy4xMzQwNzI3IDQ1LjcwMDI1MDYgMTMuMDE2NDM5MSA0NS43OTYwNjMxIDEzLjAxNjQzOTEgQyA0OS44MzcyMDU2IDEzLjAxNjQzODkgNjkuMjQ1MjIzNyAxMS4yNDM2NzEzIDY5LjI0NTIyNTUgNDQuNTE2ODg0NyBDIDY5LjI0NTIyNzMgNzcuNzkwMDk4MiA2My4wMDc4NTIzIDgzLjY4MjIyODEgNjQuNzM5NDc3OCA5NS40NjY0OTI4IEMgNjYuNDcxMTAzNCAxMDcuMjUwNzU3IDYwLjU4MTY4MTUgMTA5LjY3NjkzMyA3OC4yNTgwNzU0IDExNS45MTU2NTcgQyA5NS45MzQ0NjkzIDEyMi4xNTQzODEgOTMuODUzNTM5NSAxMzMuOTM4NjQ0IDk0LjU0NjczMTUgMTQ2LjQxNjEwMSBDIDk0LjU1NzA1ODYgMTQ2LjYwMTk4OSA5NC41NjY5MjQyIDE0Ni43OTY3MjQgOTQuNTc2MzM5NyAxNDcgTCAwLjU3NDUzNDAzNiAxNDcgWiBNIDQ3LjUgNDEgQyA1Mi4xOTQ0MjA0IDQxIDU2IDM3LjE5NDQyMDQgNTYgMzIuNSBDIDU2IDI3LjgwNTU3OTYgNTIuMTk0NDIwNCAyNCA0Ny41IDI0IEMgNDIuODA1NTc5NiAyNCAzOSAyNy44MDU1Nzk2IDM5IDMyLjUgQyAzOSAzNy4xOTQ0MjA0IDQyLjgwNTU3OTYgNDEgNDcuNSA0MSBaIiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+CjwvZz4KPC9zdmc+") 12 1, auto !important; }
   .cke_copyformatting_active { cursor: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDIwNSAyNTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+Y3Vyc29yPC90aXRsZT4KICAgIDxkZXNjPjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZC0xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDkuMDAwMDAwLCAtMi4wMDAwMDApIiBmaWxsPSIjMDAwMDAwIj4KICAgICAgICAgICAgPGcgaWQ9ImN1cnNvciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDkuMDAwMDAwLCAyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE3MCwxNCBMMjAwLjAwNzUzNywxNCBDMjAyLjc2OTA1NywxNCAyMDUsMTEuNzYzNjQ5MyAyMDUsOS4wMDQ5NzA5MiBMMjA1LDQuOTk1MDI5MDggQzIwNSwyLjIzMzgyMjEyIDIwMi43NjQ3OTgsMCAyMDAuMDA3NTM3LDAgTDEwMS45OTI0NjMsMCBDOTkuMjMwOTQzMSwwIDk3LDIuMjM2MzUwNjkgOTcsNC45OTUwMjkwOCBMOTcsOS4wMDQ5NzA5MiBDOTcsMTEuNzY2MTc3OSA5OS4yMzUyMDE3LDE0IDEwMS45OTI0NjMsMTQgTDEzMywxNCBMMTMzLDIzOCBMMTAxLjk5MjQ2MywyMzggQzk5LjIzMDk0MzEsMjM4IDk3LDI0MC4yMzYzNTEgOTcsMjQyLjk5NTAyOSBMOTcsMjQ3LjAwNDk3MSBDOTcsMjQ5Ljc2NjE3OCA5OS4yMzUyMDE3LDI1MiAxMDEuOTkyNDYzLDI1MiBMMjAwLjAwNzUzNywyNTIgQzIwMi43NjkwNTcsMjUyIDIwNSwyNDkuNzYzNjQ5IDIwNSwyNDcuMDA0OTcxIEwyMDUsMjQyLjk5NTAyOSBDMjA1LDI0MC4yMzM4MjIgMjAyLjc2NDc5OCwyMzggMjAwLjAwNzUzNywyMzggTDE3MCwyMzggTDE3MCwxNCBaIiBpZD0iQ29tYmluZWQtU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02NSwyMjIuMjgwODI5IEM2MC42MTMxMTc2LDIyMi4yODA4MjkgNTYuMzc0MjE2MiwyMjIuMjgwODI4IDUyLjk5OTk5OTUsMjIyLjI4MDgyOCBMNTMsMTcwIEw0MiwxNzAgTDQyLDIyMi41NjA1OTMgQzM4LjYxMzAyNDYsMjIyLjU2MDU5MyAzNC4zNzYzMzA4LDIyMi41NjA1OTMgMzAuMDAwMDAwNSwyMjIuNTYwNTk0IEwzMCwxNzAgTDE5LDE3MCBMMTksMjIyLjU2MDU5NSBDMTYuMzI0ODY1LDIyMi41NjA1OTUgMTMuODQ2MzM2OSwyMjIuNTYwNTk1IDExLjc2MTI3MjUsMjIyLjU2MDU5NiBDLTAuMzY5NTg2NDM4LDIyMi41NjA1OTkgMS4yODM4MTc0NiwyMTEuNTA5MzEzIDEuMjgzODE3NDYsMjExLjUwOTMxMyBDMS4yODM4MTc0NiwyMTEuNTA5MzEzIDAuMzg5Njg5OTQ0LDE3Ny43NTYgMC4zOTY1NzEyNzcsMTU4IEw5NC43NDA4MjMyLDE1OCBDOTQuNzM5MjczNiwxNzcuNzkzMDg5IDkzLjg1MzUzOTYsMjExLjIyOTU0OCA5My44NTM1Mzk2LDIxMS4yMjk1NDggQzkzLjg1MzUzOTYsMjExLjIyOTU0OCA5NS41MDY5NDM1LDIyMi4yODA4MzQgODMuMzc2MDg0NSwyMjIuMjgwODMxIEM4MS4yNTUzNzgyLDIyMi4yODA4MyA3OC43Mjc2NDE1LDIyMi4yODA4MyA3Ni4wMDAwMDAyLDIyMi4yODA4MyBMNzYsMTcwIEw2NSwxNzAgTDY1LDIyMi4yODA4MjkgWiBNMC41NzQ1MzQwMzYsMTQ3IEMwLjU3OTc2ODM4NywxNDYuODk2MTQ5IDAuNTg1MTMxNjM4LDE0Ni43OTQ3NTUgMC41OTA2MjU1MTQsMTQ2LjY5NTg2NiBDMS4yODM4MTc0OCwxMzQuMjE4NDA5IC0wLjc5NzExMjI4NiwxMjIuNDM0MTQ2IDE2Ljg3OTI4MTYsMTE2LjE5NTQyMiBDMzQuNTU1Njc1NSwxMDkuOTU2Njk4IDI4LjY2NjI1MzYsMTA3LjUzMDUyMiAzMC4zOTc4NzkyLDk1Ljc0NjI1NzYgQzMyLjEyOTUwNDgsODMuOTYxOTkzIDI1Ljg5MjEyOTgsNzguMDY5ODYzIDI1Ljg5MjEzMTUsNDQuNzk2NjQ5NiBDMjUuODkyMTMzLDE3Ljk2MDcyMDYgMzguNTE2OTQ2NywxMy45MjIwMTczIDQ1LjUyMjA5MzksMTMuMzYzNzYxNyBDNDUuNjA4OTgxNCwxMy4xMzQwNzI3IDQ1LjcwMDI1MDYsMTMuMDE2NDM5MSA0NS43OTYwNjMxLDEzLjAxNjQzOTEgQzQ5LjgzNzIwNTYsMTMuMDE2NDM4OSA2OS4yNDUyMjM3LDExLjI0MzY3MTMgNjkuMjQ1MjI1NSw0NC41MTY4ODQ3IEM2OS4yNDUyMjczLDc3Ljc5MDA5ODIgNjMuMDA3ODUyMyw4My42ODIyMjgxIDY0LjczOTQ3NzgsOTUuNDY2NDkyOCBDNjYuNDcxMTAzNCwxMDcuMjUwNzU3IDYwLjU4MTY4MTUsMTA5LjY3NjkzMyA3OC4yNTgwNzU0LDExNS45MTU2NTcgQzk1LjkzNDQ2OTMsMTIyLjE1NDM4MSA5My44NTM1Mzk1LDEzMy45Mzg2NDQgOTQuNTQ2NzMxNSwxNDYuNDE2MTAxIEM5NC41NTcwNTg2LDE0Ni42MDE5ODkgOTQuNTY2OTI0MiwxNDYuNzk2NzI0IDk0LjU3NjMzOTcsMTQ3IEwwLjU3NDUzNDAzNiwxNDcgWiBNNDcuNSw0MSBDNTIuMTk0NDIwNCw0MSA1NiwzNy4xOTQ0MjA0IDU2LDMyLjUgQzU2LDI3LjgwNTU3OTYgNTIuMTk0NDIwNCwyNCA0Ny41LDI0IEM0Mi44MDU1Nzk2LDI0IDM5LDI3LjgwNTU3OTYgMzksMzIuNSBDMzksMzcuMTk0NDIwNCA0Mi44MDU1Nzk2LDQxIDQ3LjUsNDEgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=") 12 1, auto !important; }
</style>
`).replace(/[ \t]+\n/g, "\n"));
            if (localStorage.getItem("darkModePro")) iframe.find("html").addClass("dark-mode");
            api.repareBgTableColor(iframe);
            api.repairBugChrome116(iframe);
            api.setActionCheckbox(iframe);
          }
          api.setOnBodyActs(iframe);
        });
        api.setCKEDITOR_instances();
        q("head").append("<style type='text/css' data-style='seipro'>   .seipro-editor-align-menu { display:none; background-image: -webkit-linear-gradient(top,#fff,#e4e4e4); position: absolute; display: initial; margin-top: 25px; box-shadow: 0 0 3px rgba(0,0,0,.15); border-radius: 3px; border: 1px solid #b6b6b6; }  .seipro-editor-quick-table { display:none; position: absolute; background: #f1f1f1; display: initial; margin-top: 25px; box-shadow: 0 0 3px rgba(0,0,0,.15); border-radius: 3px; border: 1px solid #b6b6b6; }  .seipro-editor-quick-table td { height: 15px; width: 15px; border: 1px solid #ccc; background: #fff; }  .seipro-editor-quick-table .seipro-editor-quick-table-info { text-align: center; padding: 5px; color: #777; }  .seipro-editor-quick-table .seipro-editor-quick-table-hover { background: #72bae2; }</style>");
      } else {
        api.addStyleIframes(TimeOut - 100);
        console.log("addStyleIframes Reload => " + TimeOut);
      }
    }, 500);
  }
  function setActionCheckbox(iframe) {
    iframe.find(".checkboxSEI").on("click", function() {
      if (!delayCrash) {
        delayCrash = true;
        setTimeout(function() {
          delayCrash = false;
        }, 300);
        state.oEditor.fire("saveSnapshot");
        if (q(this).hasClass("checked")) {
          q(this).html("&#9744;").removeClass("checked");
        } else {
          q(this).html("&#9745;").addClass("checked");
        }
        state.oEditor.fire("saveSnapshot");
        console.log("click", delayCrash);
      }
    });
  }
  function getInsertCheckboxButtom() {
    state.oEditor.focus();
    state.oEditor.fire("saveSnapshot");
    state.oEditor.insertHtml('<span class="ancoraSei checkboxSEI" data-id="' + randomString(16) + '" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>');
    state.oEditor.fire("saveSnapshot");
  }
  function repairBugChrome116(iframe) {
    if (!!window.chrome) {
      iframe.find("p").each(function() {
        var className = q(this).attr("class");
        if (typeof className !== "undefined") {
          q(this).attr("class", "_" + className);
          q(this).attr("class", className);
        }
      });
    }
  }
  function setOnBodyActs(iframe) {
    iframe.find("body").on("mousedown", function(e) {
      if (typeof e.target.href !== "undefined" && e.target.href.indexOf("http") !== -1 && checkConfigValue("editarlinks")) {
        api.showLinkTips(e.target, iframe);
      } else if (q(e.target).closest("span").hasClass("reviewSeiPro") && checkConfigValue("revisaotexto")) {
        api.showReviewTips(e.target, iframe);
      } else {
        api.hideLinkTips(iframe);
        api.hideReviewTips(iframe);
      }
      api.removeDataCkeSavedImg();
      api.hideQuickTable();
      api.setActionCheckbox(iframe);
      setTimeout(() => {
        api.setOnKeyEditor();
      }, 1e3);
    }).on("mouseup", function(e) {
      api.initCKEDITOR_SEIPRO(e);
    }).on("blur", function(e) {
      api.hideLinkTips(iframe);
      api.hideReviewTips(iframe);
      api.hideQuickTable();
      api.removeCopyStyle();
      api.closeAlignText();
    });
  }
  function initCKEDITOR_SEIPRO(e, TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    if (typeof oEditor !== "undefined") {
      api.applyCopyStyle();
      api.activeIconsSelectedText();
      api.closeAlignText();
    } else {
      if (TimeOut == 9e3) {
        var force = CKEDITOR.instances[q(e.currentTarget).attr("data-editor")];
        api.setCKEDITOR_instances(force || false);
      }
      setTimeout(function() {
        api.initCKEDITOR_SEIPRO(e, TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initCKEDITOR_SEIPRO");
      }, 500);
    }
  }
  function setDarkModeCkePanel() {
    var iframeCkePanel = q("iframe.cke_panel_frame").contents();
    if (localStorage.getItem("darkModePro") && iframeCkePanel.find('style[data-style="seipro"]').length == 0) {
      iframeCkePanel.find("head").append('<style type="text/css" data-style="seipro">\n  body { background-color: #202123 !important; }\n  .cke_panel_block * { background: #202123; border: none !important; color: #fff; box-shadow: none !important; text-shadow: none !important;}\n  .cke_panel_block a[onclick*="Fundo"] p { background-color: #6f7071; }\n  .cke_panel_block a:hover, .cke_panel_block a:hover p { background-color: #017fff !important; }\n  .cke_panel_block .cke_selected *  { background: transparent; color: #202123 !important; }\n</style>');
    }
  }
  api.removeDataCkeSavedImg = removeDataCkeSavedImg;
  api.addStyleIframes = addStyleIframes;
  api.setActionCheckbox = setActionCheckbox;
  api.getInsertCheckboxButtom = getInsertCheckboxButtom;
  api.repairBugChrome116 = repairBugChrome116;
  api.setOnBodyActs = setOnBodyActs;
  api.initCKEDITOR_SEIPRO = initCKEDITOR_SEIPRO;
  api.setDarkModeCkePanel = setDarkModeCkePanel;

  // src/features/editor/view/editor-text.js
  var editor_text_exports = {};
  __export(editor_text_exports, {
    checkHostLimitIcons: () => checkHostLimitIcons,
    extrairTextoComNumeracao: () => extrairTextoComNumeracao,
    getAllTextEditor: () => getAllTextEditor,
    getSelectedHtmlFromCKEditor: () => getSelectedHtmlFromCKEditor,
    repareBgTableColor: () => repareBgTableColor,
    setBgTableColor: () => setBgTableColor,
    setCKEDITOR_SEIPRO: () => setCKEDITOR_SEIPRO,
    setCKEDITOR_instances: () => setCKEDITOR_instances
  });
  function repareBgTableColor(iframe) {
    iframe.find('span[style*="background-color"],tr[style*="background-color"],td[style*="background-color"]').each(function() {
      api.setBgTableColor(this);
    });
  }
  function setBgTableColor(this_) {
    var bgColor = q(this_).css("background-color");
    if (typeof bgColor !== "undefined" && bgColor !== null) {
      var brightness = getBrightnessColor(rgbToHexString(bgColor));
      var textColour = brightness > 125 ? "black" : "white";
      q(this_).addClass("dark-mode-color-" + textColour);
    }
  }
  function extrairTextoComNumeracao(html) {
    return extractTextFromHtml(html, {
      parseHtml: (source) => new DOMParser().parseFromString(source, "text/html"),
      extract: extractTextWithNumbering
    });
  }
  function getAllTextEditor(extract_number = false) {
    return collectEditorText(CKEDITOR.instances, {
      extractNumber: extract_number,
      extractNumbered: api.extrairTextoComNumeracao,
      readHtml: (instance) => instance.getData(),
      readText: (html) => q("<div>").html(html).text()
    });
  }
  function getSelectedHtmlFromCKEditor() {
    const selection = state.oEditor.getSelection();
    const range = selection && selection.getRanges()[0];
    if (range) {
      const fragment = range.clone().cloneContents();
      const container = new CKEDITOR.dom.element("div");
      container.append(fragment);
      return container.getHtml();
    }
    return "";
  }
  function setCKEDITOR_instances(force = false) {
    bindEditorFocus(CKEDITOR.instances, function(e) {
      api.setCKEDITOR_SEIPRO(e);
    });
    for (var id in CKEDITOR.instances) {
      CKEDITOR.instances[id].setKeystroke(CKEDITOR.ALT + 48, false);
    }
    if (force) {
      api.setCKEDITOR_SEIPRO({ editor: force });
    }
  }
  function setCKEDITOR_SEIPRO(e) {
    state.idEditor = e.editor.name;
    state.oEditor = CKEDITOR.instances[state.idEditor];
    state.iframeEditor = q("#cke_" + state.idEditor).find("iframe").eq(0).contents();
    q("#state.idEditor").val(state.idEditor);
    if (state.iframeEditor.find("body").attr("contenteditable") == "true" || state.frmEditor.length == 0) {
      q("#cke_" + state.idEditor).find(".cke_iconPro").removeClass("cke_button_disabled");
    }
    if (checkConfigValue("editarimagens")) api.editImgPro(oEditor);
    api.loadResizeImg();
    if (typeof insertFontIcon === "function") {
      insertFontIcon("head", q('iframe[title*="' + state.idEditor + '"]').contents());
    }
    if (checkConfigValue("teclasatalho")) api.stylesEditorKeystroke();
    api.instanceDitadoPro(state.oEditor);
    api.checkHostLimitIcons();
  }
  function checkHostLimitIcons() {
    if (checkHostLimit()) {
      var elemEditor = q("#cke_" + state.idEditor);
      elemEditor.find(".getCitacaoDocumentoButtom").addClass("cke_button_disabled");
      elemEditor.find(".getDadosProcessoButtom").addClass("cke_button_disabled");
    }
  }
  api.repareBgTableColor = repareBgTableColor;
  api.setBgTableColor = setBgTableColor;
  api.extrairTextoComNumeracao = extrairTextoComNumeracao;
  api.getAllTextEditor = getAllTextEditor;
  api.getSelectedHtmlFromCKEditor = getSelectedHtmlFromCKEditor;
  api.setCKEDITOR_instances = setCKEDITOR_instances;
  api.setCKEDITOR_SEIPRO = setCKEDITOR_SEIPRO;
  api.checkHostLimitIcons = checkHostLimitIcons;

  // src/features/editor/commands/formatting.js
  var formatting_exports = {};
  __export(formatting_exports, {
    changeFontSize: () => changeFontSize,
    closeAlignText: () => closeAlignText,
    getPageBreak: () => getPageBreak,
    getSessionBreak: () => getSessionBreak,
    openAlignText: () => openAlignText,
    setAlignText: () => setAlignText,
    setNextElemEditor: () => setNextElemEditor
  });
  function getPageBreak(this_) {
    api.setParamEditor(this_);
    var htmlBreakPage = '<div class="pageBreakPro" style="page-break-after: always"></div>';
    var select = state.oEditor.getSelection().getStartElement();
    var pElement = q(select.$).closest("p");
    if (pElement.length) {
      state.oEditor.focus();
      state.oEditor.fire("saveSnapshot");
      if (state.frmEditor.length) {
        state.iframeEditor.find(pElement).before(htmlBreakPage);
      } else {
        pElement.before(htmlBreakPage);
      }
      state.oEditor.fire("saveSnapshot");
    }
  }
  function getSessionBreak(this_) {
    api.setParamEditor(this_);
    var htmlSessionPage = '<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>';
    var select = state.oEditor.getSelection().getStartElement();
    var pElement = q(select.$).closest("p");
    if (pElement.length) {
      state.oEditor.focus();
      state.oEditor.fire("saveSnapshot");
      if (state.frmEditor.length) {
        state.iframeEditor.find(pElement).before(htmlSessionPage);
      } else {
        pElement.before(htmlSessionPage);
      }
      oEditor.fire("saveSnapshot");
    }
  }
  function setNextElemEditor(element, callback = false) {
    var editorIfm = q('iframe[title*="' + state.idEditor + '"]');
    var selWin = editorIfm[0].contentWindow.getSelection();
    var selEnd = q(selWin.anchorNode.parentNode);
    if (typeof callback === "function") callback(element);
    if (selEnd[0] != element[0]) api.setNextElemEditor(element.next(), callback);
  }
  function setAlignText(this_, mode) {
    api.setParamEditor(this_);
    var select = state.oEditor.getSelection().getStartElement();
    var elementInit = q(select.$);
    api.setNextElemEditor(elementInit, function(element) {
      var p = element.closest("p").attr("class");
      var newClass = "";
      if (p == "Texto_Alinhado_Esquerda" || p == "Texto_Centralizado" || p == "Texto_Alinhado_Direita" || p == "Texto_Justificado") {
        if (mode == "left") {
          newClass = "Texto_Alinhado_Esquerda";
        }
        if (mode == "center") {
          newClass = "Texto_Centralizado";
        }
        if (mode == "right") {
          newClass = "Texto_Alinhado_Direita";
        }
        if (mode == "justify") {
          newClass = "Texto_Justificado";
        }
      } else if (p == "Tabela_Texto_Alinhado_Esquerda" || p == "Tabela_Texto_Centralizado" || p == "Tabela_Texto_Alinhado_Direita" || p == "Tabela_Texto_Justificado") {
        if (mode == "left") {
          newClass = "Tabela_Texto_Alinhado_Esquerda";
        }
        if (mode == "center") {
          newClass = "Tabela_Texto_Centralizado";
        }
        if (mode == "right") {
          newClass = "Tabela_Texto_Alinhado_Direita";
        }
        if (mode == "justify") {
          newClass = "Tabela_Texto_Justificado";
        }
      } else if (p == "Texto_Alinhado_Esquerda_Maiusc" || p == "Texto_Centralizado_Maiusculas" || p == "Texto_Alinhado_Direita_Maiusc" || p == "Texto_Justificado_Maiusculas") {
        if (mode == "left") {
          newClass = "Texto_Alinhado_Esquerda_Maiusc";
        }
        if (mode == "center") {
          newClass = "Texto_Centralizado_Maiusculas";
        }
        if (mode == "right") {
          newClass = "Texto_Alinhado_Direita_Maiusc";
        }
        if (mode == "justify") {
          newClass = "Texto_Justificado_Maiusculas";
        }
      }
      state.oEditor.focus();
      state.oEditor.fire("saveSnapshot");
      if (newClass != "") {
        element.closest("p").removeAttr("style").attr("class", newClass);
      } else {
        element.closest("p").removeAttr("style").css("text-align", mode);
      }
      state.oEditor.fire("saveSnapshot");
      console.log(">> api.setAlignText ");
    });
  }
  function openAlignText(this_) {
    if (q(this_).hasClass("cke_button_on")) {
      q(this_).addClass("cke_button_off").removeClass("cke_button_on").closest(".cke_top").find(".seipro-editor-align-menu").hide();
    } else {
      q(this_).addClass("cke_button_on").removeClass("cke_button_off").closest(".cke_top").find(".seipro-editor-align-menu").show();
    }
  }
  function closeAlignText() {
    q("#cke_" + idEditor).find(".getAlignButtom").addClass("cke_button_off").removeClass("cke_button_on").closest(".cke_top").find(".seipro-editor-align-menu").hide();
  }
  function changeFontSize(this_, mode) {
    api.setParamEditor(this_);
    var select = state.oEditor.getSelection().getStartElement();
    var fontSize = parseFloat(q(select.$).css("font-size"));
    var newFontSize = mode == "up" ? fontSize + 2 : fontSize - 2;
    var style = new CKEDITOR.style({
      element: "span",
      attributes: {
        "style": "font-size: " + newFontSize + "px"
      }
    });
    if (newFontSize > 7 && newFontSize < 70 && api.hasSelection(state.oEditor)) {
      state.oEditor.focus();
      state.oEditor.fire("saveSnapshot");
      state.oEditor.applyStyle(style);
      state.oEditor.fire("saveSnapshot");
    }
  }
  api.getPageBreak = getPageBreak;
  api.getSessionBreak = getSessionBreak;
  api.setNextElemEditor = setNextElemEditor;
  api.setAlignText = setAlignText;
  api.openAlignText = openAlignText;
  api.closeAlignText = closeAlignText;
  api.changeFontSize = changeFontSize;

  // src/features/editor/view/dialogs/sigilo.js
  var sigilo_exports = {};
  __export(sigilo_exports, {
    actionsMarkSigilo: () => actionsMarkSigilo,
    getBoxSigilo: () => getBoxSigilo,
    getDialogSigilo: () => getDialogSigilo,
    getMarkSigilo: () => getMarkSigilo,
    getTarjaSigilo: () => getTarjaSigilo,
    htmlTabSigiloResult: () => htmlTabSigiloResult,
    rodapeSigiloMark: () => rodapeSigiloMark
  });
  function getMarkSigilo(this_) {
    api.setParamEditor(this_);
    var select = state.oEditor.getSelection().getStartElement();
    var checkClass = q(select.$).closest("span").hasClass("sigiloSEI");
    var style = new CKEDITOR.style({
      element: "span",
      attributes: {
        "class": "sigiloSEI"
      }
    });
    if (api.hasSelection(state.oEditor) && !checkClass) {
      state.oEditor.focus();
      state.oEditor.fire("saveSnapshot");
      state.oEditor.applyStyle(style);
      state.oEditor.fire("saveSnapshot");
    } else if (checkClass) {
      var element = q(select.$).closest(".sigiloSEI");
      element.after(element.html()).remove();
      console.log(element.html());
    }
  }
  function getTarjaSigilo(this_) {
    api.setParamEditor(this_);
    var style = new CKEDITOR.style({
      element: "span",
      attributes: {
        "class": "sigiloSEI"
      }
    });
    if (api.hasSelection(state.oEditor)) {
      state.oEditor.focus();
      state.oEditor.fire("saveSnapshot");
      state.oEditor.applyStyle(style);
      api.actionsMarkSigilo(void 0, "apply");
      state.oEditor.fire("saveSnapshot");
    }
  }
  function getBoxSigilo(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog("SigiloSEI");
  }
  function actionsMarkSigilo(this_, mode, text = false, increment = false) {
    var _this = q(this_);
    var _parent = _this.closest(".cke_dialog_page_contents");
    var result = "";
    if (mode == "replace") {
      var textFind = text ? text : _parent.find("#cke_inputSigilo2_textInput").val().trim();
      if (textFind != "") {
        var i_increment = increment ? parseInt(q("#tabSigilo2_result .count").length ? q("#tabSigilo2_result .count").text() : 0) : 0;
        console.log(i_increment);
        var i = 0;
        var displayResult = "";
        var tagSigilo = state.iframeEditor.find('p:contains("' + textFind + '") span.sigiloSEI');
        if (tagSigilo.length) {
          tagSigilo.after(tagSigilo.html()).remove();
        }
        var matches = state.iframeEditor.find("p").map(function() {
          return q(this).text();
        }).get().join(" ").match(new RegExp("\\b" + textFind + "\\b", "igm"));
        i = matches ? matches.length : 0;
        if (i > 0) {
          state.oEditor.focus();
          state.oEditor.fire("saveSnapshot");
          state.iframeEditor.find("p").wrapInTag({ "class": "sigiloSEI", "words": [textFind] });
          oEditor.fire("saveSnapshot");
          matches = state.iframeEditor.find("p").map(function() {
            return q(this).text();
          }).get().join(" ").match(new RegExp("\\b" + textFind + "\\b", "igm"));
          i = matches ? matches.length : 0;
          i = i + i_increment;
          displayResult = '  <i class="fas fa-check-circle verdeColor"></i> <span class="count">' + i + "</span> " + (i == 1 ? "marca" : "marcas") + " " + (i == 1 ? "adicionada" : "adicionadas") + " com sucesso!";
        } else {
          displayResult = '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nenhum texto encontrado!';
        }
        result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">' + displayResult + "</label>";
      } else {
        result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">  <i class="fas fa-info-circle" style="color: #007fff;"></i> Digite um texto para adicionar a marca de sigilo</label>';
      }
      _parent.find("#tabSigilo2_result").show().html(result);
      q("#tabSigilo3_result").hide().html("");
      api.htmlTabSigiloResult();
    } else if (mode == "remove") {
      var i = 0;
      state.oEditor.focus();
      oEditor.fire("saveSnapshot");
      state.iframeEditor.find("span.sigiloSEI").each(function() {
        q(this).after(q(this).html()).remove();
        i++;
      });
      state.iframeEditor.find("span.sigiloSEI_tarja").each(function() {
        if (typeof q(this).data("text") !== "undefined" && q(this).data("text") != "") {
          q(this).after(q(this).data("text")).remove();
          i++;
        }
      });
      state.oEditor.fire("saveSnapshot");
      var displayResult = i == 0 ? '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nenhuma marca encontrada!' : '  <i class="fas fa-check-circle verdeColor"></i> ' + i + " " + (i == 1 ? "marca" : "marcas") + " " + (i == 1 ? "removida" : "removidas") + " com sucesso!";
      result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">' + displayResult + "</label>";
      _parent.find("#tabSigilo3_result").show().html(result);
      q("#tabSigilo2_result").hide().html("");
      api.htmlTabSigiloResult();
    } else if (mode == "apply") {
      var i = 0;
      var redactor = "\u2588";
      state.oEditor.focus();
      state.oEditor.fire("saveSnapshot");
      state.iframeEditor.find("span.sigiloSEI").each(function() {
        var rand = randomNumber(8, 15);
        q(this).data("text", q(this).html()).text(redactor.repeat(rand)).attr("class", "sigiloSEI_tarja");
        i++;
      });
      state.oEditor.fire("saveSnapshot");
      if (i > 0) {
        result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">  <i class="fas fa-check-circle verdeColor"></i> ' + i + " " + (i == 1 ? "marca" : "marcas") + " " + (i == 1 ? "tarjada" : "tarjadas") + ' com sucesso!<br>  <i class="fas fa-exclamation-triangle laranjaColor"></i>  ' + (i == 1 ? "Esta marca tarjada poder\xE1 ser revertida" : "Estas marcas tarjadas poder\xE3o ser revertidas") + ' na aba "Remover marcas"<br> somente enquanto aberto este editor de documentos.</label>';
        _parent.find("#tabSigilo1_result").show().html(result);
      } else {
        api.htmlTabSigiloResult();
      }
      q("#tabSigilo2_result").hide().html("");
      q("#tabSigilo3_result").hide().html("");
      api.rodapeSigiloMark();
    } else if (mode == "email_cpf") {
      oEditor.focus();
      q("#tabSigilo2_result").html("");
      var arrayEmails = extractEmails(state.iframeEditor.text());
      arrayEmails = arrayEmails.length ? uniqPro(arrayEmails) : [];
      var arrayCPFs = extractCPFs(state.iframeEditor.text());
      arrayCPFs = arrayCPFs.length ? uniqPro(arrayCPFs) : [];
      var arrayDadosSensiveis = q.merge(arrayCPFs, arrayEmails);
      if (arrayDadosSensiveis.length) {
        q.each(arrayDadosSensiveis, function(i2, v) {
          api.actionsMarkSigilo(this_, "replace", v, true);
        });
      }
    }
  }
  function rodapeSigiloMark() {
    var lastFrame = false;
    var countMarks = 0;
    q("iframe.cke_wysiwyg_frame").each(function(index) {
      var iframe = q(this).contents();
      if (iframe.find("body").attr("contenteditable") == "true") {
        lastFrame = iframe;
        countMarks = countMarks + iframe.find(".sigiloSEI_tarja").length;
      }
    });
    lastFrame.find("body .sigiloSEI_sigilo_mark").remove();
    if (countMarks > 0) {
      lastFrame.find("body").append('<p class="sigiloSEI_sigilo_mark" contenteditable="false" style="font-size: 6pt;color: #ccc;font-family: monospace;">#_contem_' + countMarks + "_marcas_sigilo</p>");
    }
  }
  function htmlTabSigiloResult() {
    var result = "";
    var tagSigilo = state.iframeEditor.find("p span.sigiloSEI");
    var i = tagSigilo.length;
    var iconMarkSigilo = q("#cke_" + state.idEditor).find(".getMarkSigiloButton .cke_button_icon").attr("style");
    if (i == 0) {
      result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nenhuma marca de sigilo no documento! Adicione marcas de sigilo na aba <br> "Localizar texto" ou adicione manualmente com o bot\xE3o <span style="width: 16px; height: 16px; display: inline-block; ' + iconMarkSigilo + '">&nbsp;</span>';
      "</label>";
      q("#tabSigilo1_result").show().html(result);
    } else {
      result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">  <i class="fas fa-info-circle" style="color: #007fff;"></i> ' + i + " " + (i == 1 ? "marca" : "marcas") + " de sigilo " + (i == 1 ? "encontrada" : "encontradas") + " no documento! <br></label>";
    }
    q("#tabSigilo1_result").show().html(result);
  }
  function getDialogSigilo() {
    CKEDITOR.dialog.add("SigiloSEI", function(editor) {
      return {
        title: "Gerenciar marcas de sigilo do documento",
        minWidth: 700,
        minHeight: 80,
        buttons: [CKEDITOR.dialog.okButton],
        onShow: function() {
          setTimeout(function() {
            q(".tabSigilo_result").html("").hide();
            api.htmlTabSigiloResult();
            var textSelected = editor.getSelection().getSelectedText();
            q("#cke_inputSigilo2_textInput").val(textSelected);
          }, 500);
        },
        contents: [
          {
            id: "tab2",
            label: "1. Localizar texto e dados pessoais",
            elements: [
              {
                type: "html",
                html: '<table role="presentation" class="cke_dialog_ui_hbox"> <tbody>     <tr class="cke_dialog_ui_hbox">         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo2_label" for="cke_inputSigilo2_textInput">Localizar texto e adicionar marca <br>de sigilo em todo o documento</label>         </td>         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">             <span class="cke_dialog_ui_labeled_content" id="cke_inputSigilo2_uiElement">                 <div class="cke_dialog_ui_input_text" role="presentation" style="width:200px">                     <input class="cke_dialog_ui_input_text" id="cke_inputSigilo2_textInput" type="text" aria-labelledby="cke_inputSigilo2_label">                 </div>             </span>         </td>     </tr>     <tr class="cke_dialog_ui_hbox">         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">         </td>         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">             <a style="user-select: none;" data-seipro-action="actionsMarkSigilo" data-seipro-mode="replace" title="Adicionar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo2_label" id="buttonSigilo2_uiElement">                 <span id="buttonSigilo2_label" class="cke_dialog_ui_button">Adicionar</span>             </a>         </td>     </tr>     <tr class="cke_dialog_ui_hbox">         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:20px 0 0">             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo2_label" for="cke_inputSigilo2_textInput">Localizar dados pessoais como <br>e-mails e CPFs em todo o documento</label>         </td>         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:20px 0 0">             <a style="user-select: none;" data-seipro-action="actionsMarkSigilo" data-seipro-mode="email_cpf" title="Localizar dados pessoais" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo2_label" id="buttonSigilo2_uiElement">                 <span id="buttonSigilo2_label" class="cke_dialog_ui_button">Localizar dados pessoais</span>             </a>         </td>     </tr> </tbody></table><div id="tabSigilo2_result" class="tabSigilo_result" style="display:none; margin-top: 15px;"></div>'
              }
            ]
          },
          {
            id: "tab1",
            label: "2. Tarjar marcas de sigilo",
            elements: [
              {
                type: "html",
                html: '<table role="presentation" class="cke_dialog_ui_hbox"> <tbody>     <tr class="cke_dialog_ui_hbox">         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo1_label">Aplicar tarja de sigilo <br> no documento</label>         </td>         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">             <a style="user-select: none;" data-seipro-action="actionsMarkSigilo" data-seipro-mode="apply" title="Aplicar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo1_label" id="buttonSigilo1_uiElement">                 <span id="buttonSigilo1_label" class="cke_dialog_ui_button">Aplicar</span>             </a>         </td>     </tr> </tbody></table><div id="tabSigilo1_result" class="tabSigilo_result" style="display:none; margin-top: 15px;"></div>'
              }
            ]
          },
          {
            id: "tab3",
            label: "Remover marcas",
            elements: [
              {
                type: "html",
                html: '<table role="presentation" class="cke_dialog_ui_hbox"> <tbody>     <tr class="cke_dialog_ui_hbox">         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo_label">Remover todas as marcas <br>de sigilo no documento</label>         </td>         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">             <a style="user-select: none;" data-seipro-action="actionsMarkSigilo" data-seipro-mode="remove" title="Remover" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo3_label" id="buttonSigilo3_uiElement">                 <span id="buttonSigilo3_label" class="cke_dialog_ui_button">Remover</span>             </a>         </td>     </tr> </tbody></table><div id="tabSigilo3_result" class="tabSigilo_result" style="display:none; margin-top: 15px;"></div><div id="tabSigilo3_info" style="margin-top: 15px;">     <label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">       <i class="fas fa-exclamation-triangle laranjaColor"></i> Marcas de sigilo j\xE1 tarjadas n\xE3o poder\xE3o ser revertidas ap\xF3s salvar e abandonar <br>este editor de documentos.     </label></div>'
              }
            ]
          },
          {
            id: "tab4",
            label: "Guia r\xE1pido",
            elements: [
              {
                type: "html",
                html: '<table role="presentation" class="cke_dialog_ui_hbox"> <tbody>     <tr class="cke_dialog_ui_hbox">         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:100%; padding:0px">             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo_label">Acesse o guia r\xE1pido sobre como <a target="_blank" href="https://sei-pro.github.io/sei-pro/pages/SIGILODOC.html" class="linkDialog">Adicionar marca de sigilo e tarjas pretas de confidencialidade <i class="fas fa-external-link-alt bLink" style="font-size: 90%; text-decoration: underline;"></i></a></label>         </td>     </tr> </tbody></table>'
              }
            ]
          }
        ]
      };
    });
  }
  api.getMarkSigilo = getMarkSigilo;
  api.getTarjaSigilo = getTarjaSigilo;
  api.getBoxSigilo = getBoxSigilo;
  api.actionsMarkSigilo = actionsMarkSigilo;
  api.rodapeSigiloMark = rodapeSigiloMark;
  api.htmlTabSigiloResult = htmlTabSigiloResult;
  api.getDialogSigilo = getDialogSigilo;

  // src/features/editor/view/context-menu.js
  var context_menu_exports = {};
  __export(context_menu_exports, {
    actionCopyStyle: () => actionCopyStyle,
    applyCopyStyle: () => applyCopyStyle,
    editImgPro: () => editImgPro,
    getCopyStyle: () => getCopyStyle,
    getElementStyleSelected: () => getElementStyleSelected,
    hasSelection: () => hasSelection,
    menuBlockEdition: () => menuBlockEdition,
    menuCopyStyle: () => menuCopyStyle,
    menuPlataformAI: () => menuPlataformAI,
    removeCopyStyle: () => removeCopyStyle,
    setChosenInCke: () => setChosenInCke,
    setCopyStyle: () => setCopyStyle,
    stylesEditorKeystroke: () => stylesEditorKeystroke
  });
  function setChosenInCke(multiple = false, max_width = "500px") {
    var minWidth = multiple ? "450px" : "200px";
    if (verifyConfigValue("substituiselecao")) {
      if (multiple) q("select.cke_dialog_ui_input_select").attr("multiple", "multiple");
      q("div.cke_dialog_ui_input_select").css({ "position": "absolute", "max-width": max_width, "min-width": minWidth });
      q("span.cke_dialog_ui_labeled_content").css({ "height": "27px", "display": "flex" });
      q("select.cke_dialog_ui_input_select").each(function() {
        if (q("#" + q(this).attr("id") + "_chosen").length == 0) {
          initChosenReplace(multiple ? "box_multiple" : "box_init", this);
        } else {
          q(this).chosen("destroy").chosen({
            placeholder_text_single: " ",
            no_results_text: "Nenhum resultado encontrado",
            normalize_search_text: function(text) {
              return removeAcentos(text.toLowerCase());
            }
          });
        }
      });
      setTimeout(function() {
        q(".cke_dialog_ui_labeled_content .chosen-container-single").css({ "max-width": max_width, "min-width": minWidth });
        if (multiple) {
          q(".cke_dialog_ui_labeled_content .chosen-container-multi").css("width", "-webkit-fill-available");
          q(".cke_dialog_ui_labeled_content .chosen-container-multi .chosen-choices").css({ "max-height": "90px", "overflow-y": "auto" });
        }
      }, 800);
    }
  }
  function hasSelection(editor) {
    var sel = editor.getSelection();
    var ranges = sel.getRanges();
    for (var i = 0, len = ranges.length; i < len; ++i) {
      if (!ranges[i].collapsed) {
        return true;
      }
    }
    return false;
  }
  function getElementStyleSelected(element) {
    var fontSize = parseFloat(element.css("font-size")) == 16 && (element.closest("sub").length || element.closest("sup").length) ? false : parseFloat(element.css("font-size"));
    var color = element.css("color") == "rgb(0, 0, 0)" ? false : element.css("color");
    var backgroundColor = element.css("background-color") == "rgba(0, 0, 0, 0)" ? false : element.css("background-color");
    var bold = element.closest("strong").length ? true : false;
    var underline = element.closest("u").length ? true : false;
    var italic = element.closest("em").length ? true : false;
    var strike = element.closest("s").length ? true : false;
    var subscript = element.closest("sub").length ? true : false;
    var superscript = element.closest("sup").length ? true : false;
    return { fontSize, color, backgroundColor, bold, underline, italic, strike, subscript, superscript };
  }
  function setCopyStyle(this_) {
    api.setParamEditor(this_);
    api.actionCopyStyle(oEditor);
  }
  function actionCopyStyle(editor) {
    var select = editor.getSelection().getStartElement();
    var element = q(select.$);
    var style = api.getElementStyleSelected(element);
    if (q("#cke_" + state.idEditor).find(".getCopyStyleButtom").hasClass("cke_button_on")) {
      api.removeCopyStyle();
    } else {
      sessionStorage.setItem("copyStylePro", JSON.stringify(style));
      element.closest("body").addClass("cke_copyformatting_active");
      q("#cke_" + state.idEditor).find(".getCopyStyleButtom").addClass("cke_button_on").removeClass("cke_button_off");
    }
  }
  function getCopyStyle() {
    return JSON.parse(sessionStorage.getItem("copyStylePro"));
  }
  function applyCopyStyle() {
    var select = state.oEditor.getSelection().getStartElement();
    var element = q(select.$);
    var p = element.closest("p").attr("class");
    var style = api.getCopyStyle();
    if (api.hasSelection(state.oEditor) || element.closest("body").hasClass("cke_copyformatting_active")) {
      q("#cke_" + state.idEditor).find(".getCopyStyleButtom").removeClass("cke_button_disabled");
    } else {
      q("#cke_" + state.idEditor).find(".getCopyStyleButtom").addClass("cke_button_disabled");
    }
    if (typeof style !== "undefined" && api.hasSelection(state.oEditor) && element.closest("body").hasClass("cke_copyformatting_active")) {
      state.oEditor.focus();
      oEditor.fire("saveSnapshot");
      oEditor.fire("lockSnapshot");
      oEditor.execCommand("removeFormat");
      if (typeof style !== "undefined" && style.backgroundColor && style.backgroundColor != "") {
        var styleBackgroundColor = new CKEDITOR.style({
          element: "span",
          attributes: {
            "style": "background-color: " + style.backgroundColor
          }
        });
        state.oEditor.applyStyle(styleBackgroundColor);
      }
      if (typeof style !== "undefined" && style.fontSize > 0) {
        var styleFontSize = new CKEDITOR.style({
          element: "span",
          attributes: {
            "style": "font-size: " + style.fontSize + "px"
          }
        });
        state.oEditor.applyStyle(styleFontSize);
      }
      if (typeof style !== "undefined" && style.bold) {
        oEditor.execCommand("bold");
      }
      if (typeof style !== "undefined" && style.underline) {
        oEditor.execCommand("underline");
      }
      if (typeof style !== "undefined" && style.italic) {
        oEditor.execCommand("italic");
      }
      if (typeof style !== "undefined" && style.strike) {
        oEditor.execCommand("strike");
      }
      if (typeof style !== "undefined" && style.subscript) {
        oEditor.execCommand("subscript");
      }
      if (typeof style !== "undefined" && style.superscript) {
        oEditor.execCommand("superscript");
      }
      if (typeof style !== "undefined" && style.color && style.color != "") {
        var styleColor = new CKEDITOR.style({
          element: "span",
          attributes: {
            "style": "color: " + style.color
          }
        });
        state.oEditor.applyStyle(styleColor);
      }
      if (!window.event.altKey) {
        api.removeCopyStyle();
      }
      element.closest("p").attr("class", p);
      oEditor.fire("unlockSnapshot");
      oEditor.fire("saveSnapshot");
    }
  }
  function removeCopyStyle() {
    var select = state.oEditor.getSelection().getStartElement();
    var element = q(select.$);
    element.closest("body").removeClass("cke_copyformatting_active");
    sessionStorage.removeItem("copyStylePro");
    q("#cke_" + state.idEditor).find(".getCopyStyleButtom").addClass("cke_button_off").removeClass("cke_button_on");
  }
  function menuCopyStyle(editor) {
    if (editor.contextMenu && typeof editor.getMenuItem("copystyle") === "undefined") {
      editor.addMenuGroup("copystyleGroup", -10 * 3);
      editor.addMenuItem("copystyle", {
        label: "Copiar formata\xE7\xE3o",
        icon: URL_SPRO + "icons/editor/copiarformatacao.png",
        command: "copystyle",
        group: "copystyleGroup"
      });
      editor.contextMenu.addListener(function(element) {
        if (element.getAscendant("p", true) && api.hasSelection(editor)) {
          return { copystyle: CKEDITOR.TRISTATE_OFF };
        }
      });
      editor.addCommand("copystyle", {
        exec: function(editor2) {
          api.actionCopyStyle(editor2);
        }
      });
    }
  }
  function menuBlockEdition(editor) {
    if (editor.contextMenu && typeof editor.getMenuItem("blockedition") === "undefined") {
      editor.addMenuGroup("blockGroup", -10 * 3);
      editor.addMenuItem("blockedition", {
        label: "Bloquear Edi\xE7\xE3o",
        icon: URL_SPRO + "icons/editor/blockedition.png",
        command: "blockedition",
        group: "blockGroup"
      });
      editor.contextMenu.addListener(function(element) {
        if (element.getAscendant("p", true) && api.hasSelection(editor)) {
          return { blockedition: CKEDITOR.TRISTATE_OFF };
        }
      });
      editor.addCommand("blockedition", {
        exec: function(editor2) {
          var sel = editor2.getSelection();
          var select = sel.getStartElement();
          function setNextElem(element2) {
            var editorIfm = q('iframe[title*="' + state.idEditor + '"]');
            var selWin = editorIfm[0].contentWindow.getSelection();
            var selEnd = q(selWin.anchorNode.parentNode);
            var selStart = q(selWin.focusNode.parentNode);
            var editable = typeof element2.attr("contenteditable") !== "undefined" && element2.attr("contenteditable") == "false" ? true : false;
            element2.attr("contenteditable", editable);
            if (!editable && selEnd[0] != element2[0]) {
              setNextElem(element2.next());
            }
          }
          var element = q(select.$);
          if (element.is("p")) {
            setNextElem(element);
          }
        }
      });
    }
  }
  function menuPlataformAI(editor) {
    if (editor.contextMenu && typeof editor.getMenuItem("plataform_ai") === "undefined") {
      editor.addMenuGroup("openaiGroup", -10 * 3);
      editor.addMenuItem("plataform_ai", {
        label: "Abrir Assistente IA",
        icon: URL_SPRO + "icons/editor/ferramentasia.png",
        command: "plataform_ai",
        group: "openaiGroup"
      });
      editor.contextMenu.addListener(function() {
        if (api.hasSelection(editor)) {
          return { plataform_ai: CKEDITOR.TRISTATE_OFF };
        }
      });
      editor.addCommand("plataform_ai", {
        exec: function(ed) {
          if (typeof api.loadPlataformAI === "function") {
            api.loadPlataformAI(ed.container && ed.container.$);
          }
        }
      });
    }
  }
  function stylesEditorKeystroke() {
    if (getOptionsPro("stylesEditor")) {
      q.each(getOptionsPro("stylesEditor"), function(i, v) {
        state.oEditor.addCommand(v, {
          exec: function(editor) {
            var select = editor.getSelection().getStartElement();
            var element = q(select.$);
            if (element.is("p")) {
              element.attr("class", v);
            }
          }
        });
        if (i < 36) {
          var key = i <= 9 ? 48 + i : 55 + i;
          if (getConfigValue("combinacaoteclas") == "combinacaoteclas_1") {
            state.oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + key, v);
          } else if (getConfigValue("combinacaoteclas") == "combinacaoteclas_2") {
            state.oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + key, v);
          } else if (getConfigValue("combinacaoteclas") == "combinacaoteclas_3") {
            state.oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.ALT + key, v);
          } else if (getConfigValue("combinacaoteclas") == "combinacaoteclas_4") {
            state.oEditor.setKeystroke(CKEDITOR.ALT + CKEDITOR.SHIFT + key, v);
          } else {
            state.oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + key, v);
          }
        }
      });
      if (getOptionsPro("stylesEditor")) {
        q('a.cke_combo_button[href*="Estilos de Format"]').on("click", function() {
          var ckePanel = q('iframe[class="cke_panel_frame"]').contents();
          var style = '<style type="text/css" data-style="seipro-styleeditor">   .cke_panel_listItem a p {       overflow: hidden;   }   .cke_panel_listItem a {       padding-right: 160px;       position: relative;   }   sup {       position: absolute;       right: 10px;       font-family: monospace;       background: #ccc;       padding: 3px 5px;       border-radius: 5px;       opacity: 0.5;       top: calc(50% - 10px);   }</style>';
          if (ckePanel.find('style[data-style="seipro-styleeditor"]').length == 0) {
            ckePanel.find("head").append(style);
          }
          ckePanel.find("sup").remove();
          var isMac = navigator.platform.toUpperCase().indexOf("MAC") !== -1 ? true : false;
          q.each(getOptionsPro("stylesEditor"), function(i, v) {
            if (i < 36) {
              var key = i <= 9 ? 48 + i : 55 + i;
              var combinacaoteclas = isMac ? "CMD + OPTION + SHIFT" : "CTRL + ALT + SHIFT";
              if (getConfigValue("combinacaoteclas") == "combinacaoteclas_1") {
                combinacaoteclas = isMac ? "CMD + OPTION + SHIFT" : "CTRL + ALT + SHIFT";
              } else if (getConfigValue("combinacaoteclas") == "combinacaoteclas_2") {
                combinacaoteclas = isMac ? "CMD + SHIFT" : "CTRL + SHIFT";
              } else if (getConfigValue("combinacaoteclas") == "combinacaoteclas_3") {
                combinacaoteclas = isMac ? "CMD + OPTION" : "CTRL + ALT";
              } else if (getConfigValue("combinacaoteclas") == "combinacaoteclas_4") {
                combinacaoteclas = isMac ? "OPTION + SHIFT" : "ALT + SHIFT";
              }
              ckePanel.find('li.cke_panel_listItem a[title="' + v + '"]').prepend("<sup>" + combinacaoteclas + " + <strong>" + String.fromCharCode(key) + "</strong></sup>");
            }
          });
        });
      }
    }
  }
  function editImgPro(editor) {
    if (editor.contextMenu && !delayCrash && typeof editor.getMenuItem("ImageEditorPro") === "undefined") {
      delayCrash = true;
      setTimeout(function() {
        delayCrash = false;
      }, 300);
      editor.removeMenuItem("image");
      editor.addMenuGroup("base64imageGroup", 30);
      editor.addMenuItem("base64imageItem", {
        label: "Formatar Imagem",
        icon: URL_SPRO + "icons/editor/formatarimagem.png",
        command: "base64imageDialog",
        group: "base64imageGroup"
      });
      editor.contextMenu.addListener(function(element) {
        if (element && element.getName() === "img") {
          editor.getSelection().selectElement(element);
          return { base64imageItem: CKEDITOR.TRISTATE_ON };
        }
        return null;
      });
      editor.addCommand("base64imageDialog", {
        exec: function(editor2) {
          api.openDialogUploadImgBase64(editor2);
        }
      });
      editor.addMenuItem("ImageEditorPro", {
        label: "Editar Imagem",
        icon: URL_SPRO + "icons/editor/editarimagem.png",
        command: "ImageEditorPro",
        group: "base64imageGroup"
      });
      editor.contextMenu.addListener(function(element) {
        if (element && element.getName() === "img") {
          editor.getSelection().selectElement(element);
          return { ImageEditorPro: CKEDITOR.TRISTATE_ON };
        }
        return null;
      });
      editor.addCommand("ImageEditorPro", {
        exec: function(editor2) {
          api.openImageEditorPro(editor2);
        }
      });
      editor.on("doubleclick", function(evt) {
        if (evt.data.element && !evt.data.element.isReadOnly() && evt.data.element.getName() === "img") {
          evt.data.dialog = "base64imageDialog";
          editor.getSelection().selectElement(evt.data.element);
        }
      });
    }
  }
  api.setChosenInCke = setChosenInCke;
  api.hasSelection = hasSelection;
  api.getElementStyleSelected = getElementStyleSelected;
  api.setCopyStyle = setCopyStyle;
  api.actionCopyStyle = actionCopyStyle;
  api.getCopyStyle = getCopyStyle;
  api.applyCopyStyle = applyCopyStyle;
  api.removeCopyStyle = removeCopyStyle;
  api.menuCopyStyle = menuCopyStyle;
  api.menuBlockEdition = menuBlockEdition;
  api.menuPlataformAI = menuPlataformAI;
  api.stylesEditorKeystroke = stylesEditorKeystroke;
  api.editImgPro = editImgPro;

  // src/features/editor/view/dialogs/table.js
  var table_exports = {};
  __export(table_exports, {
    activeIconsSelectedText: () => activeIconsSelectedText,
    changeColorTable: () => changeColorTable,
    detectSyleSelectedTable: () => detectSyleSelectedTable,
    getDialogSyleTable: () => getDialogSyleTable,
    getQuickTable: () => getQuickTable,
    getSyleSelectedTable: () => getSyleSelectedTable,
    getSyleTable: () => getSyleTable,
    hideQuickTable: () => hideQuickTable,
    quickTableClick: () => quickTableClick,
    quickTableOver: () => quickTableOver,
    setSyleTable: () => setSyleTable
  });

  // src/shared/table-styles.js
  function getColorID() {
    var colorID = {
      color1: {
        light: "#dddddd",
        dark: "#646464"
      },
      color2: {
        light: "#e2daf1",
        dark: "#7b54c0"
      },
      color3: {
        light: "#eed7e9",
        dark: "#b1489c"
      },
      color4: {
        light: "#f2d7dc",
        dark: "#c2495e"
      },
      color5: {
        light: "#ecdacf",
        dark: "#a85723"
      },
      color6: {
        light: "#dfdfc8",
        dark: "#6e6b06"
      },
      color7: {
        light: "#d1e2cc",
        dark: "#2f7c16"
      },
      color8: {
        light: "#c9e4d7",
        dark: "#0a824a"
      },
      color9: {
        light: "#cae2e6",
        dark: "#0e7a8b"
      },
      color10: {
        light: "#d4def0",
        dark: "#3b68b9"
      }
    };
    return colorID;
  }
  function getStyleTable(color, width = 80) {
    var styleTable = {
      tableStyle1: {
        table: "border-collapse:collapse; border-color:" + color.dark + ";margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "",
        tr: "",
        td_head: "background-color: " + color.light + ";",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle2: {
        table: "border-collapse:collapse; border-color:" + color.dark + ";margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "background-color: " + color.light + ";",
        tr: ["", "background-color: " + color.light + ";"],
        td_head: "",
        td_head_p: "Tabela_Texto_Alinhado_Esquerda",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle3: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto; width:" + width + "%; border-left: none;border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + "; border-right: none;",
        tr_head: "border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: "border: none;",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle4: {
        table: "border-collapse:collapse; margin-left:auto;margin-right:auto;width:" + width + "%;border: none;",
        tr_head: "border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: "border: none;",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "border-left: none; border-top: none;border-bottom: none;border-right: 1px solid " + color.dark + ";",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle5: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto; width:" + width + "%;border: none;",
        tr_head: "border: none;",
        tr: "border: none;",
        td_head: "",
        td_head_p: "Tabela_Texto_Alinhado_Esquerda",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle6: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto; width:" + width + "%; border: none;",
        tr_head: "border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: "border: none;",
        td_head: "background-color: " + color.light + ";",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "background-color: " + color.light + "; border-left: none; border-top: none; border-bottom: none; border-right: 1px solid " + color.dark + ";",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle7: {
        table: "border-collapse:collapse; border-color:" + color.dark + "; margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "border-bottom: 3px solid " + color.dark + ";",
        tr: "",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle8: {
        table: "border-collapse:collapse; border-bottom: 1px solid " + color.dark + "; border-left: none; border-right: none; border-top: none;margin-left: auto;margin-right:auto; width:" + width + "%;",
        tr_head: "border-bottom: 3px solid " + color.dark + ";",
        tr: "",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "border-left: 1px solid " + color.dark + ";",
        td_first: "border-right: none;",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle9: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto;width:" + width + "%; border: none;",
        tr_head: "border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: "border: none;",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "border: 1px solid " + color.dark + ";",
        td_first: "border-left: none;border-top: none;border-bottom: none;border-right: 1px solid " + color.dark + ";",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle10: {
        table: "border-collapse:collapse; border-color:" + color.dark + "; margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "color: #fff;",
        tr: "",
        td_head: "background-color: " + color.dark + ";",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle11: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto; width:" + width + "%; border: none;",
        tr_head: "color: #fff; border: 1px solid " + color.dark + "; border-bottom: 1px solid #fff !important",
        tr: "border: none;",
        td_head: "background-color: " + color.dark + ";",
        td_head_p: "Texto_Centralizado",
        td: "background-color: " + color.light + "; border-bottom: 1px solid #fff; border-right: 1px solid #fff",
        td_first: "color: #fff;background-color: " + color.dark + "; border: 1px solid " + color.dark + "; border-bottom: 1px solid #fff !important;",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle12: {
        table: "border-collapse:collapse; border-color:" + color.dark + "; margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "background-color: " + color.light + "; border-bottom: 3px solid " + color.dark + ";",
        tr: "",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle13: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto ;width:" + width + "%; border: none;",
        tr_head: "background-color: " + color.light + "; border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: "border: none;",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "border: 1px solid " + color.dark + ";",
        td_first: "border-left: none;border-top: none;border-bottom: none;border-right: 1px solid " + color.dark + ";",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle14: {
        table: "border-collapse:collapse;margin-left:auto;margin-right:auto;width:" + width + "%;border: none;",
        tr_head: "background-color: " + color.light + "; border-bottom: 1px solid " + color.dark + ";",
        tr: ["border: none;", "border: none; background-color: " + color.light + ";"],
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle15: {
        table: "border-collapse:collapse;margin-left:auto;margin-right:auto;width:" + width + "%;border-left: none; border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + "; border-right: none;",
        tr_head: "border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: "border-bottom: 1px solid " + color.dark + ";",
        td_head: "",
        td_head_p: "Tabela_Texto_Alinhado_Esquerda",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle16: {
        table: "border-collapse:collapse; border-color:" + color.dark + "; margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "color: #fff;",
        tr: "",
        td_head: "background-color: " + color.dark + ";",
        td_head_p: "Texto_Centralizado",
        td: "border: none;",
        td_first: "border: none;",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle17: {
        table: "border-collapse:collapse; border-color:" + color.dark + ";margin-left:auto; margin-right:auto;width:" + width + "%;",
        tr_head: "color: #fff;",
        tr: ["border: none;", "border: none; background-color: " + color.light + ";"],
        td_head: "background-color: " + color.dark + ";",
        td_head_p: "Texto_Centralizado",
        td: "border: none;",
        td_first: "border: none;",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle18: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto; width:" + width + "%;border: none;",
        tr_head: "color: #fff; border: 1px solid " + color.dark + "; border-bottom: 3px solid #fff !important",
        tr: ["border: none; background-color: " + color.light + ";", "color: #fff; border: none; background-color: " + color.dark + ";"],
        td_head: "background-color: " + color.dark + ";",
        td_head_p: "Texto_Centralizado",
        td: "border:none;",
        td_first: "border: none; border-right: 3px solid #fff",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle19: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto;width:" + width + "%; border-left: none;border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + "; border-right: none;",
        tr_head: "background-color: " + color.light + "; border-bottom: 1px solid " + color.dark + ";",
        tr: ["border: none;", "border: none; background-color: " + color.light + ";"],
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle20: {
        table: "border-collapse:collapse; margin-left:auto;margin-right:auto;width:" + width + "%;border: none;",
        tr_head: "background-color: " + color.light + "; border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: ["border: none;", "border: none; background-color: " + color.light + ";"],
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "border-left: none; border-top: none;border-bottom: none;border-right: 1px solid " + color.dark + ";",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle21: {
        table: "border-collapse:collapse; border-color:" + color.dark + ";margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "",
        tr: "",
        td_head: "",
        td_head_p: "Tabela_Texto_Alinhado_Esquerda",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      }
    };
    return styleTable;
  }

  // src/features/editor/view/dialogs/table.js
  function hideQuickTable() {
    q(".seipro-editor-quick-table").each(function() {
      q(this).html("").hide();
    });
    q(".getQuickTableButtom").addClass("cke_button_off").removeClass("cke_button_on");
  }
  function quickTableOver(this_) {
    var rowThis = parseInt(q(this_).attr("data-row"));
    var colThis = parseInt(q(this_).attr("data-col"));
    var table = q(this_).closest("table");
    table.find("td").removeClass("seipro-editor-quick-table-hover");
    if (rowThis >= 3 && parseInt(table.find("tr:last td:first").attr("data-row")) > rowThis + 1) {
      table.find("tr:last").remove();
      table.attr("data-row", parseInt(table.attr("data-row")) - 1);
    }
    if (colThis >= 3 && parseInt(table.find("tr:last td:last").attr("data-col")) > colThis + 1) {
      table.find("tr :last-child").remove();
      table.attr("data-col", parseInt(table.attr("data-col")) - 1);
    }
    table.find("td").each(function() {
      var rowTd = parseInt(q(this).attr("data-row"));
      var colTd = parseInt(q(this).attr("data-col"));
      if (rowTd <= rowThis && colTd <= colThis) {
        q(this).addClass("seipro-editor-quick-table-hover");
      }
    });
    q(this_).closest(".seipro-editor-quick-table").find(".seipro-editor-quick-table-info").html("Tabela " + (rowThis + 1) + "x" + (colThis + 1));
    if (rowThis == parseInt(table.attr("data-row")) && rowThis < 49) {
      var tableAppend = q(this_).closest("table");
      var rowLast = tableAppend.find("tr:last");
      var rowNew = rowLast.clone().appendTo(tableAppend);
      rowNew.find("td").each(function(index) {
        q(this).attr("data-row", rowThis + 1).attr("data-col", index).removeClass("seipro-editor-quick-table-hover");
      });
      tableAppend.attr("data-row", rowThis + 1);
    }
    if (colThis == parseInt(table.attr("data-col")) && colThis < 49) {
      var tableAppend = q(this_).closest("table");
      tableAppend.find("tr :last-child").each(function() {
        var colNew = q(this).clone().attr("data-col", colThis + 1).removeClass("seipro-editor-quick-table-hover");
        var colNew_ = q(this).parent().append(colNew);
      });
      tableAppend.attr("data-col", colThis + 1);
    }
  }
  function getQuickTable(this_) {
    var rowDefault = 5;
    var colDefault = 5;
    const quickTableContainer = q(this_).closest(".cke_toolgroup").find(".seipro-editor-quick-table");
    if (q(this_).hasClass("cke_button_off")) {
      var htmlTable = '<div class="seipro-editor-quick-table-info">Inserir Tabela</div>';
      htmlTable += '<table data-row="' + (rowDefault - 1) + '" data-col="' + (colDefault - 1) + '">';
      for (var i = 0; i < rowDefault; i++) {
        htmlTable += "<tr>";
        for (var j = 0; j < colDefault; j++) {
          htmlTable += '<td data-seipro-hover="quickTableOver" data-seipro-leave="quickTableOver" data-row="' + i + '" data-col="' + j + '" data-seipro-action="quickTableClick"></td>';
        }
        htmlTable += "</tr>";
      }
      htmlTable += "</table>";
      quickTableContainer.html(htmlTable).show();
      q(this_).removeClass("cke_button_off").addClass("cke_button_on");
    } else {
      api.hideQuickTable();
      q(this_).addClass("cke_button_off").removeClass("cke_button_on");
    }
  }
  function quickTableClick(this_) {
    api.setParamEditor(this_);
    var row = q(this_).attr("data-row");
    var col = q(this_).attr("data-col");
    var idFirstTD = "quickTablePos_" + randomString(8);
    var htmlTable = '<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';
    htmlTable += "  <tbody>";
    for (var i = 0; i <= row; i++) {
      htmlTable += "      <tr>";
      for (var j = 0; j <= col; j++) {
        var firstTD = i == 0 && j == 0 ? 'id="' + idFirstTD + '" ' : "";
        htmlTable += '          <td><p class="Tabela_Texto_Alinhado_Esquerda" ' + firstTD + "><br></p></td>";
      }
      htmlTable += "      </tr>";
    }
    htmlTable += "  </tbody>";
    htmlTable += "</table>";
    var select = state.oEditor.getSelection().getStartElement();
    var pElement = q(select.$).closest("p");
    if (pElement.length) {
      state.oEditor.focus();
      state.oEditor.fire("saveSnapshot");
      state.iframeEditor.find(pElement).after(htmlTable);
      api.hideQuickTable();
      q("#cke_" + state.idEditor).find(".getTablestylesButtom").removeClass("cke_button_disabled");
      var sel = state.oEditor.getSelection();
      var element_ = sel.getStartElement();
      var element = state.oEditor.document.getById(idFirstTD);
      var ranges = state.oEditor.getSelection().getRanges();
      ranges[0].setStart(element.getFirst(), 0);
      ranges[0].setEnd(element.getFirst(), 0);
      sel.selectRanges([ranges[0]]);
      state.iframeEditor.find("#" + idFirstTD).attr("id", "");
      oEditor.fire("saveSnapshot");
    }
  }
  function detectSyleSelectedTable() {
    var select = state.oEditor.getSelection().getStartElement();
    var tableElement = q(select.$).closest("table");
    return tableElement;
  }
  function activeIconsSelectedText() {
    if (api.detectSyleSelectedTable().length) {
      q("#cke_" + state.idEditor).find(".getTablestylesButtom").removeClass("cke_button_disabled");
    } else {
      q("#cke_" + state.idEditor).find(".getTablestylesButtom").addClass("cke_button_disabled");
    }
    if (api.hasSelection(state.oEditor)) {
      q("#cke_" + state.idEditor).find(".getFontSizeUpButtom").removeClass("cke_button_disabled");
      q("#cke_" + state.idEditor).find(".getFontSizeDownButtom").removeClass("cke_button_disabled");
      q("#cke_" + state.idEditor).find(".getCapLetterButtom").removeClass("cke_button_disabled");
    } else {
      q("#cke_" + state.idEditor).find(".getFontSizeUpButtom").addClass("cke_button_disabled");
      q("#cke_" + state.idEditor).find(".getFontSizeDownButtom").addClass("cke_button_disabled");
      q("#cke_" + state.idEditor).find(".getCapLetterButtom").addClass("cke_button_disabled");
    }
  }
  function getSyleSelectedTable(this_) {
    api.setParamEditor(this_);
    if (api.detectSyleSelectedTable().length) {
      state.oEditor.openDialog("TabelaSEI");
    } else {
      alertaBoxPro("Error", "exclamation-triangle", "Clique na tabela que deseja aplicar o estilo!");
    }
  }
  function changeColorTable(this_) {
    var id = q(this_).attr("data-colorid");
    q("#addEstiloTabela").attr("class", id);
  }
  function getDialogSyleTable() {
    var color = getColorID();
    var lenColor = Object.keys(getColorID()).length;
    var lenStyleTable = Object.keys(getStyleTable(getColorID().color1)).length;
    var htmlEstilo = '<div style="padding-bottom: 10px;">Selecione a varia\xE7\xE3o de cores da tabela:</div>';
    htmlEstilo += '<div id="selectColorTabela" class="listaCoresTabela">';
    for (var i = 0; i < lenColor; i++) {
      var id = i + 1;
      var checked = i == 0 ? "checked" : "";
      htmlEstilo += '<span><label for="colorStyle' + id + '"><a class="iconSelectColorTable" style="background-color: ' + color["color" + id].light + '"></a><a class="iconSelectColorTable" style="background-color: ' + color["color" + id].dark + '"></a></label><br><input type="radio" data-seipro-change="changeColorTable" name="colorStyle" data-colorid="color' + id + '" id="colorStyle' + id + '" value="colorStyle' + id + '" ' + checked + "></span>";
    }
    htmlEstilo += "</div>";
    htmlEstilo += '<div style="padding-bottom: 10px;">Selecione o estilo da tabela:</div><div id="addEstiloTabela" class="color1">   <div class="listaEstiloTabela">';
    for (var i = 0; i < lenStyleTable; i++) {
      var id = i + 1;
      var checked = i == 0 ? "checked" : "";
      htmlEstilo += i % 7 === 0 && i != 0 && i != lenStyleTable - 1 ? '</div><div class="listaEstiloTabela">' : "";
      htmlEstilo += '<span><label for="tableStyle' + id + '"><a class="iconSelectStyleTable" style="background-position-y: -' + id * 43 + 'px"></a></label><br><input type="radio" name="tableStyle" id="tableStyle' + id + '" value="tableStyle' + id + '" ' + checked + "></span>";
    }
    htmlEstilo += "</div></div>";
    htmlEstilo += '<div style="padding: 10px 0;">Selecione a largura da tabela:    <input type="number" id="addEstiloTableWidth" style="background: #f5f5f5; padding: 5px; border-radius: 5px; width: 50px; border: 1px solid #ccc;" max="100" step="5" min="5"> %</div>';
    htmlEstilo += '<div style="padding: 10px 0;">   <input type="checkbox" id="addEstiloTableHeader" checked> <label for="addEstiloTableHeader">Determinar a primeira linha como cabe\xE7alho da tabela</label></div>';
    CKEDITOR.dialog.add("TabelaSEI", function(editor) {
      return {
        title: "Inserir estilo \xE0 tabela",
        minWidth: 700,
        minHeight: 80,
        buttons: [CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton],
        onOk: function(event, a, b) {
          var valueT = q("#addEstiloTabela").find('input[name="tableStyle"]:checked').val();
          var valueC = q("#selectColorTabela").find('input[name="colorStyle"]:checked').attr("data-colorid");
          var valueW = q("#addEstiloTableWidth").val();
          if (valueT != "" && valueC != "" && valueW != "") {
            api.setSyleTable([valueT, valueC, valueW]);
            event.data.hide = true;
          }
        },
        onShow: function() {
          var elementTable = api.detectSyleSelectedTable();
          var percent = Math.round(100 * parseFloat(elementTable.css("width")) / parseFloat(elementTable.parent().css("width")));
          var percentInput = typeof percent != "undefined" ? parseInt(percent) : 80;
          percentInput = percentInput > 100 ? 100 : percentInput;
          percentInput = percentInput < 5 ? 5 : percentInput;
          console.log(elementTable[0].style.width, percentInput);
          q("#addEstiloTableWidth").val(percentInput);
        },
        contents: [
          {
            id: "tab1",
            label: "Estilo da tabela",
            elements: [
              {
                type: "html",
                html: htmlEstilo
              }
            ]
          }
        ]
      };
    });
  }
  function getSyleTable(this_) {
    api.setParamEditor(this_);
    state.oEditor.focus();
    state.oEditor.fire("saveSnapshot");
    api.setSyleTable();
    state.oEditor.fire("saveSnapshot");
  }
  function setSyleTable(value) {
    var tableID = value[0];
    var colorID = value[1];
    var widthID = value[2];
    var color = getColorID()[colorID];
    var arrayStyle = getStyleTable(color, widthID)[tableID];
    var elementTable = api.detectSyleSelectedTable();
    elementTable.attr("style", arrayStyle.table);
    elementTable.find("tr").each(function(index_tr) {
      var styleTr = index_tr == 0 ? arrayStyle.tr_head : arrayStyle.tr;
      styleTr = index_tr != 0 && q.isArray(arrayStyle.tr) && index_tr % 2 === 0 ? arrayStyle.tr[1] : styleTr;
      styleTr = index_tr != 0 && q.isArray(arrayStyle.tr) && index_tr % 2 !== 0 ? arrayStyle.tr[0] : styleTr;
      var styleTd = index_tr == 0 ? arrayStyle.td_head : arrayStyle.td;
      var classTdP = index_tr == 0 ? arrayStyle.td_head_p : arrayStyle.td_p;
      q(this).attr("style", styleTr);
      q(this).find("td").each(function(index_td) {
        styleTd = index_td == 0 && index_tr != 0 ? arrayStyle.td_first : arrayStyle.td;
        styleTd = index_tr == 0 ? arrayStyle.td_head : styleTd;
        q(this).attr("style", styleTd);
        if (q(this).find("p").length) {
          q(this).find("p").attr("class", classTdP);
        } else {
          q(this).html('<p class="' + classTdP + '">' + q(this).html() + "</p>");
        }
      });
    });
    elementTable.find('span[style*="background-color"],tr[style*="background-color"],td[style*="background-color"]').each(function() {
      api.setBgTableColor(this);
    });
    if (q("#addEstiloTableHeader").is(":checked")) {
      q("<thead></thead>").prependTo(elementTable).append(elementTable.find("tr:first"));
    }
  }
  api.hideQuickTable = hideQuickTable;
  api.quickTableOver = quickTableOver;
  api.getQuickTable = getQuickTable;
  api.quickTableClick = quickTableClick;
  api.detectSyleSelectedTable = detectSyleSelectedTable;
  api.activeIconsSelectedText = activeIconsSelectedText;
  api.getSyleSelectedTable = getSyleSelectedTable;
  api.changeColorTable = changeColorTable;
  api.getDialogSyleTable = getDialogSyleTable;
  api.getSyleTable = getSyleTable;
  api.setSyleTable = setSyleTable;

  // src/features/editor/view/dialogs/legis-link.js
  var legis_link_exports = {};
  __export(legis_link_exports, {
    getDialogLegisSEI: () => getDialogLegisSEI,
    getLegisSEI: () => getLegisSEI,
    getSearchLegis: () => getSearchLegis,
    getSearchLegisMore: () => getSearchLegisMore,
    insertLegisSEI: () => insertLegisSEI,
    sendLegisSEI: () => sendLegisSEI,
    uniqLinkLegisSEI: () => uniqLinkLegisSEI
  });
  function sendLegisSEI(nomeLegis) {
    var url = "https://seipro.app/legis/";
    q.ajax({
      type: "POST",
      url,
      dataType: "json",
      data: { norma: [nomeLegis] },
      success: function(legisData) {
        if (legisData[0].status == 0) {
          alertaBoxPro("Error", "exclamation-triangle", "Nenhuma legisla\xE7\xE3o encontrada");
        } else {
          var nomeLegis2 = legisData.length && legisData[0].NomeNorma ? "&nbsp;(" + legisData[0].NomeNorma + ")" : "";
          var htmlLegis = legisData.length ? '<a class="ancoraSei legisSeiPro" data-norma="' + legisData[0].SiglaNorma + '" data-normafull="' + legisData[0].DescNormaFull + '" data-index="0" href="' + legisData[0].Link + '" target="_blank">' + legisData[0].DescNormaFull + nomeLegis2.trim() + "</a>" : "";
          state.oEditor.focus();
          state.oEditor.fire("saveSnapshot");
          state.oEditor.insertHtml(htmlLegis);
          api.uniqLinkLegisSEI(state.idEditor);
          state.oEditor.fire("saveSnapshot");
        }
      }
    });
  }
  function insertLegisSEI(this_) {
    var htmlLegis = q("<div>").append(q(this_).closest("p").find(".legisSeiPro").clone().removeAttr("style").removeClass("linkDialog")).html();
    state.oEditor.focus();
    state.oEditor.fire("saveSnapshot");
    state.oEditor.insertHtml(htmlLegis);
    api.uniqLinkLegisSEI();
    state.oEditor.fire("saveSnapshot");
    CKEDITOR.dialog.getCurrent().hide();
  }
  function uniqLinkLegisSEI() {
    var arrayRef = [];
    state.iframeEditor.find(".legisSeiPro").each(function() {
      var refNorma = q(this).attr("data-norma");
      if (state.iframeEditor.find('a[data-norma="' + refNorma + '"]').length > 1) {
        var text = q(this).attr("data-normafull");
        var newText = text.split(",");
        var textDate = newText[1].trim().split(" ")[5];
        newText = typeof textDate !== "undefined" && arrayRef.includes(refNorma) ? newText[0].trim() + ", de " + textDate : text;
        q(this).text(newText);
      }
      arrayRef.push(refNorma);
    });
  }
  function getLegisSEI(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog("LegisSEI");
  }
  function getSearchLegisMore(this_) {
    var parent = q(this_).closest("tr");
    if (!parent.find(".searchLegis_ementa").is(":hidden")) {
      parent.find(".searchLegis_ementa").hide();
      parent.find(".searchLegis_ementafull").show();
    } else {
      parent.find(".searchLegis_ementa").show();
      parent.find(".searchLegis_ementafull").hide();
    }
  }
  function getSearchLegis(this_) {
    var dialog_page = q(this_).closest(".cke_dialog_page_contents");
    var dialog = CKEDITOR.dialog.getCurrent();
    var inputTipo = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "tipoNorma")._.inputId;
    inputTipo = q("#" + inputTipo).find("option:selected").text();
    var inputTermo = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "termoNorma").getValue();
    var inputNumero = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "numeroNorma").getValue();
    var inputAno = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "anoNorma").getValue();
    var url = "https://seipro.app/legis/search.php";
    var tipo = encodeURI(removeAcentos(inputTipo.toUpperCase().trim()));
    var termo = encodeURI(inputTermo.trim());
    var numero = inputNumero.indexOf("/") !== -1 ? inputNumero.split("/")[0] : inputNumero;
    numero = numero.replace(/[^0-9\-]+/g, "");
    numero = encodeURI(numero.trim());
    var ano = inputAno.replace(/[^0-9\-]+/g, "");
    ano = encodeURI(inputAno.trim());
    var periodo = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "periodoNorma").getValue();
    q("#searchLegis_load").show();
    if (q("#searchLegis_result").is(":visible")) {
      dialog.move(dialog.getPosition().x, dialog.getPosition().y + 125);
      q("#searchLegis_result").html("").hide();
    }
    q.ajax({
      type: "POST",
      url,
      dataType: "json",
      data: {
        tipo,
        numero,
        ano,
        periodo,
        termo
      },
      success: function(legisData) {
        if (legisData.status == 0) {
          q("#searchLegis_load").hide();
          alertaBoxPro("Error", "exclamation-triangle", "Erro interno do servidor :( Tente novamente mais tarde");
        } else {
          var htmlResult = "<table> <tbody>";
          q.each(legisData.docs, function(i, val) {
            var ementa = val.dsc_ementa.replace(/(\r\n|\n|\r)/gm, "");
            ementa = ementa.indexOf(" ") !== -1 && ementa.split(" ")[0] === ementa.split(" ")[0].toUpperCase() ? ementa.charAt(0).toUpperCase() + ementa.toLocaleLowerCase().slice(1) : ementa;
            var ementa_limited = ementa.length > 170 ? ementa.replace(/^(.{170}[^\s]*).*/, "$1") + "..." : ementa;
            var datanorma = val.dsc_tipo_epigrafe == "Decreto" ? "Dec" : val.dsc_tipo_epigrafe;
            datanorma = val.dsc_tipo_epigrafe == "Medida Provis\xF3ria" ? "Mp" : datanorma;
            datanorma = val.dsc_tipo_epigrafe == "Lei Complementar" ? "LC" : datanorma;
            datanorma = val.dsc_tipo_epigrafe == "Decreto-Lei" ? "DecLei" : datanorma;
            datanorma = datanorma.indexOf(" ") !== -1 ? datanorma.split(" ").join("") : datanorma;
            datanorma = datanorma + val.num_ato;
            var nomenorma = val.dsc_identificacao.indexOf(" de ") !== -1 ? val.dsc_identificacao.replace(" de ", ", de ") : val.dsc_identificacao;
            var ementa_limited_link = ementa.length > 170 ? '<a class="linkDialog" data-seipro-action="getSearchLegisMore">mais</a>' : "";
            var style_normaRevogada = val.dsc_situacao_macro == "Revogado" ? "text-decoration: line-through; color: #adadad;" : "color: #444;";
            var text_normaRevogada = val.dsc_situacao_macro == "Revogado" ? '<span style="background: #e0e0e0; padding: 1px 5px; color: #444; border-radius: 5px; margin-left: 10px;">Revogada</span>' : "";
            var btnInsertLegis = '<span data-seipro-action="insertLegisSEI" style="float: right; background: #e7effd; padding: 3px 5px; color: #4285f4; border-radius: 5px; margin-left: 10px; cursor: pointer;"><i class="fas fa-pen azulColor" style="font-size: 90%; cursor: pointer;"></i> Adicionar</span>';
            htmlResult += '     <tr style="border-bottom: 2px solid #efefef;">         <td>             <p style="padding: 10px 0 2px 0;">                 <a class="linkDialog ancoraSei legisSeiPro" style="font-size: 13px;" data-norma="' + datanorma + '" data-normafull="' + nomenorma + '" data-index="0" href="' + val.url + '" target="_blank">' + nomenorma + ' <i class="fas fa-external-link-alt linkDialog" style="font-size: 80%;"></i></a> ' + text_normaRevogada + btnInsertLegis + '             </p>             <p class="searchLegis_ementa" style="padding: 6px 0 10px 0; font-style: italic; word-break: break-word; white-space: break-spaces; width: 500px; ' + style_normaRevogada + '">' + ementa_limited + " " + ementa_limited_link + '</p>             <p class="searchLegis_ementafull" style="display:none; padding: 6px 0 10px 0; font-style: italic; word-break: break-word; white-space: break-spaces; width: 500px; ' + style_normaRevogada + '">' + ementa + ' <a class="linkDialog" data-seipro-action="getSearchLegisMore">menos</a></p>         </td>     </tr>';
          });
          if (legisData.numFound > 50) {
            htmlResult += '     <tr>         <td>             <p style="margin: 10px;text-align: center;background: #fdfbe4;padding: 5px;border-radius: 5px;"><i class="fas fa-info-circle azulColor"></i> Atingido o limite de 50 resultados. Restrinja sua pesquisa.</p>         </td>     </tr>';
          } else if (legisData.numFound == 0) {
            htmlResult += '     <tr>         <td>             <p style="margin: 10px;text-align: center;background: #fdfbe4;padding: 5px;border-radius: 5px;"><i class="fas fa-info-circle azulColor"></i> Nenhum resultado encontrado :(</p>         </td>     </tr>';
          }
          htmlResult += " </tbody></table>";
          q("#searchLegis_load").hide();
          q("#searchLegis_result").html(htmlResult).show();
          dialog.move(dialog.getPosition().x, dialog.getPosition().y - 125);
        }
      }
    });
  }
  function getDialogLegisSEI() {
    CKEDITOR.dialog.add("LegisSEI", function(editor) {
      return {
        title: "Adicionar Link de Legisla\xE7\xE3o",
        minWidth: 520,
        minHeight: 150,
        buttons: [CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton],
        onOk: function(event, a, b) {
          var tipoNorma = this.getContentElement("tab1", "tipoNorma").getValue();
          var numeroNorma = this.getContentElement("tab1", "numeroNorma").getValue();
          var orgaoInfraNorma = this.getContentElement("tab2", "orgaoInfraNorma").getValue();
          var tipoInfraNorma = this.getContentElement("tab2", "tipoInfraNorma").getValue();
          var numeroInfraNorma = this.getContentElement("tab2", "numeroInfraNorma").getValue();
          var nomeNorma = this.getContentElement("tab3", "nomeNorma").getValue();
          if (tipoNorma != "" && numeroNorma != "") {
            var nrNorma = numeroNorma.indexOf("/") !== -1 ? numeroNorma.split("/")[0] : numeroNorma;
            nrNorma = nrNorma.replace(/[^0-9\-]+/g, "");
            api.sendLegisSEI(tipoNorma + nrNorma);
            event.data.hide = true;
          } else if (tipoInfraNorma != "" && numeroInfraNorma != "") {
            var nrNorma = numeroInfraNorma.indexOf("/") !== -1 ? numeroInfraNorma.split("/")[0] : numeroInfraNorma;
            nrNorma = nrNorma.replace(/[^0-9\-]+/g, "");
            api.sendLegisSEI(orgaoInfraNorma + tipoInfraNorma + nrNorma);
            event.data.hide = true;
          } else if (nomeNorma != "") {
            api.sendLegisSEI(nomeNorma);
            event.data.hide = true;
          } else {
            event.data.hide = true;
          }
        },
        onShow: function() {
          q(".cke_dialog_page_contents").find("select").css("width", "100%");
          q("#searchLegis_load").hide();
          if (q("#searchLegis_result").is(":visible")) {
            this.move(this.getPosition().x, this.getPosition().y + 125);
            q("#searchLegis_result").html("").hide();
          }
          var inputNumero = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "numeroNorma")._.inputId;
          var inputAno = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "anoNorma")._.inputId;
          q("#" + inputNumero).attr("type", "number");
          q("#" + inputAno).attr("type", "number");
          if (verifyConfigValue("substituiselecao")) api.setChosenInCke();
          var textSelected = state.oEditor.getSelection().getSelectedText();
          var idSelectNorma = this.getContentElement("tab1", "tipoNorma")._.inputId;
          var idNumNorma = this.getContentElement("tab1", "numeroNorma")._.inputId;
          var selectNorma = q("#" + idSelectNorma);
          var numNorma = q("#" + idNumNorma);
          if (textSelected.toLowerCase().indexOf("lei complementar") !== -1 || textSelected.toLowerCase().indexOf("lc") !== -1) {
            selectNorma.val("LC").trigger("change");
          } else if (textSelected.toLowerCase().indexOf("decreto-lei") !== -1 || textSelected.toLowerCase().indexOf("dc") !== -1) {
            selectNorma.val("DecLei").trigger("change");
          } else if (textSelected.toLowerCase().indexOf("medida provis\xF3ria") !== -1 || textSelected.toLowerCase().indexOf("mp") !== -1) {
            selectNorma.val("Mp").trigger("change");
          } else if (textSelected.toLowerCase().indexOf("decreto") !== -1 || textSelected.toLowerCase().indexOf("dec") !== -1) {
            selectNorma.val("Dec").trigger("change");
          } else if (textSelected.toLowerCase().indexOf("lei") !== -1) {
            selectNorma.val("Lei").trigger("change");
          }
          if (hasNumber(textSelected)) {
            var numInput = textSelected.toLowerCase().indexOf("/") !== -1 ? textSelected.split("/")[0] : textSelected;
            numInput = textSelected.toLowerCase().indexOf(",") !== -1 ? textSelected.split(",")[0] : numInput;
            numInput = hasNumber(numInput) ? onlyNumber(numInput) : "";
            numNorma.val(numInput);
          }
        },
        contents: [
          {
            id: "tab1",
            label: "Legisla\xE7\xE3o Federal",
            elements: [
              {
                type: "select",
                id: "tipoNorma",
                label: "Tipo de Legisla\xE7\xE3o",
                labelLayout: "horizontal",
                width: "200px",
                items: [[""], ["Lei", "Lei"], ["Lei Complementar", "LC"], ["Decreto", "Dec"], ["Decreto-Lei", "DecLei"], ["Medida Provis\xF3ria", "Mp"]],
                "default": ""
              },
              {
                type: "text",
                label: "N\xFAmero da Legisla\xE7\xE3o",
                id: "numeroNorma",
                width: "200px",
                labelLayout: "horizontal"
              },
              {
                type: "select",
                id: "periodoNorma",
                label: "Per\xEDodo da Publica\xE7\xE3o",
                labelLayout: "horizontal",
                width: "200px",
                items: [[""], ["No ano", "ano"], ["At\xE9 o ano de...", "ate"], ["Ap\xF3s o ano de...", "apos"]],
                "default": ""
              },
              {
                type: "text",
                label: "Ano da Publica\xE7\xE3o",
                id: "anoNorma",
                width: "200px",
                labelLayout: "horizontal"
              },
              {
                type: "text",
                label: "Conte\xFAdo da Legisla\xE7\xE3o (palavras-chave)",
                id: "termoNorma",
                width: "200px",
                labelLayout: "horizontal"
              },
              {
                type: "html",
                html: '<table role="presentation" class="cke_dialog_ui_hbox"> <tbody>     <tr class="cke_dialog_ui_hbox">         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">         </td>         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">             <a style="user-select: none;" data-seipro-action="getSearchLegis" title="Pesquisar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="searchLegis_label" id="searchLegis_uiElement">                 <span id="searchLegis_label" class="cke_dialog_ui_button">Pesquisar</span>             </a>             <i id="searchLegis_load" class="fas fa-sync-alt fa-spin" style="margin-left: 10px; display:none"></i>         </td>     </tr> </tbody></table><div id="searchLegis_result" style="display:none; height: 250px; overflow-y: scroll; margin-top: 15px;"></div>'
              }
            ]
          },
          {
            id: "tab2",
            label: "Norma Infralegal",
            elements: [
              {
                type: "select",
                id: "orgaoInfraNorma",
                label: "Autoridade Signat\xE1ria",
                labelLayout: "horizontal",
                width: "200px",
                items: [
                  [""],
                  ["ANTAQ", "Antaq"],
                  ["Cade", "Cade"],
                  ["PRF", "PRF"],
                  ["TSE", "Tse"],
                  ["TRE RR", "Trerr"],
                  ["TJ RR", "TJRR"],
                  ["CNJ", "CNJ"]
                ],
                "default": ""
              },
              {
                type: "select",
                id: "tipoInfraNorma",
                label: "Tipo de Legisla\xE7\xE3o",
                labelLayout: "horizontal",
                width: "200px",
                items: [
                  [""],
                  ["Acordo/Plano/Ato/Nota", "acord"],
                  ["Ata e Certid\xF5es de Julgamento", "atas"],
                  ["Constitui\xE7\xE3o Estadual", "ce"],
                  ["Decreto Estadual", "decest"],
                  ["Edital", "Edit"],
                  ["Enunciado Administrativo", "enumadm"],
                  ["Emenda Constitucional", "ec"],
                  ["Emenda Regimental", "er"],
                  ["Emendas", "Emenda"],
                  ["Instru\xE7\xE3o Normativa", "in"],
                  ["Instru\xE7\xE3o Normativa Conjunta", "resconj"],
                  ["Lei Complementar Estadual", "lce"],
                  ["Lei Estadual", "leiest"],
                  ["Lei Municipal", "leimun"],
                  ["Nota T\xE9cnica", "nt"],
                  ["Orienta\xE7\xE3o Normativa", "on"],
                  ["Portaria", "port"],
                  ["Portaria Conjunta", "portconj"],
                  ["Portaria Interministerial", "portinter"],
                  ["Portaria Interinstitucional", "portinst"],
                  ["Provimento", "prov"],
                  ["Recomenda\xE7\xE3o", "Rec"],
                  ["Regimento Interno", "regim"],
                  ["Resolu\xE7\xE3o Normativa", "rn"],
                  ["Resolu\xE7\xE3o", "res"],
                  ["Resolu\xE7\xE3o Conjunta", "resconj"],
                  ["S\xFAmula Administrativa", "sum"]
                ],
                "default": ""
              },
              {
                type: "text",
                label: "N\xFAmero da Norma",
                width: "200px",
                labelLayout: "horizontal",
                id: "numeroInfraNorma"
              }
            ]
          },
          {
            id: "tab3",
            label: "Lista de Normas",
            elements: [
              {
                type: "select",
                id: "nomeNorma",
                label: "Nome da Legisla\xE7\xE3o",
                items: [
                  [""],
                  ["C\xF3digo Brasileiro de Aeron\xE1utica", "Cba"],
                  ["C\xF3digo Brasileiro de Telecomunica\xE7\xF5es", "Cbt"],
                  ["C\xF3digo Civil", "Cc"],
                  ["C\xF3digo Comercial", "Ccm"],
                  ["C\xF3digo de Defesa do Consumidor", "Cdc"],
                  ["Constitui\xE7\xE3o Federal", "Cf"],
                  ["C\xF3digo Florestal", "Cflorestal"],
                  ["Consolida\xE7\xE3o das Leis do Trabalho", "Clt"],
                  ["C\xF3digo de \xC1guas", "Codigoaguas"],
                  ["C\xF3digo Eleitoral", "Codigoeleitoral"],
                  ["C\xF3digo de Minas", "Codigominas"],
                  ["C\xF3digo Penal", "Cp"],
                  ["C\xF3digo de Processo Civil", "Cpc"],
                  ["C\xF3digo Penal Militar", "Cpm"],
                  ["C\xF3digo de Processo Penal", "Cpp"],
                  ["C\xF3digo de Processo Penal Militar", "Cppm"],
                  ["C\xF3digo de Tr\xE2nsito Brasileiro", "Ctb"],
                  ["C\xF3digo Tribut\xE1rio Nacional", "Ctn"],
                  ["Estatuto da Crian\xE7a e do Adolescente", "Eca"],
                  ["Estatuto da Cidade", "Estatutocidade"],
                  ["Estatuto do Desarmamento", "Estatutodesarmamento"],
                  ["Estatuto do Idoso", "Estatutoidoso"],
                  ["Estatuto da Igualdade Racial", "Estatutoigualdaderacial"],
                  ["Estatuto do \xCDndio", "Estatutoindio"],
                  ["Estatuto da Juventude", "Estatutojuventude"],
                  ["Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte", "Estatutomicroempresas"],
                  ["Estatuto dos Militares", "Estatutomilitares"],
                  ["Estatuto dos Museus", "Estatutomuseus"],
                  ["Estatuto da Advocacia e da Ordem dos Advogados do Brasil (OAB)", "Estatutooab"],
                  ["Estatuto da Pessoa com Defici\xEAncia", "Estatutopcd"],
                  ["Estatuto dos Refugiados", "Estatutorefugiados"],
                  ["Estatuto da Terra", "Estatutoterra"],
                  ["Estatuto de Defesa do Torcedor", "Estatutotorcedor"]
                ],
                "default": ""
              }
            ]
          }
        ]
      };
    });
  }
  api.sendLegisSEI = sendLegisSEI;
  api.insertLegisSEI = insertLegisSEI;
  api.uniqLinkLegisSEI = uniqLinkLegisSEI;
  api.getLegisSEI = getLegisSEI;
  api.getSearchLegisMore = getSearchLegisMore;
  api.getSearchLegis = getSearchLegis;
  api.getDialogLegisSEI = getDialogLegisSEI;

  // src/features/editor/view/dialogs/citacao.js
  var citacao_exports = {};
  __export(citacao_exports, {
    convertFirstLetter: () => convertFirstLetter,
    getCitacaoDocumento: () => getCitacaoDocumento,
    getDialogCitacaoDocumento: () => getDialogCitacaoDocumento,
    insertCitacaoDocumento: () => insertCitacaoDocumento
  });

  // src/features/editor/domain/process-documents.js
  function listProcessDocuments(source = globalThis) {
    const data = source.dadosProcessoPro || {};
    const direct = Array.isArray(data.listDocumentos) ? data.listDocumentos : [];
    const tree = Array.isArray(data.treeModel?.documents) ? data.treeModel.documents : [];
    if (!direct.length) return tree.slice();
    if (!tree.length) return direct.slice();
    const byId = /* @__PURE__ */ new Map();
    [...direct, ...tree].forEach((document2, index) => {
      const id = String(document2?.id_documento || document2?.id_protocolo || document2?.id || index);
      const previous = byId.get(id) || {};
      const merged = { ...previous };
      Object.entries(document2 || {}).forEach(([key, value]) => {
        if (merged[key] === void 0 || merged[key] === null || merged[key] === "") {
          merged[key] = value;
        }
      });
      byId.set(id, merged);
    });
    return [...byId.values()];
  }
  function processDocumentId(document2, fallback = "") {
    return String(document2?.id_protocolo || document2?.id_documento || document2?.id || fallback || "").trim();
  }
  function buildProcessDocumentReference(document2) {
    const id = processDocumentId(document2);
    const text = String(document2?.nr_sei || document2?.numeroSEI || document2?.numero || document2?.documento || "").trim();
    if (!id || !text) return "";
    return '<span contenteditable="false" data-cke-linksei="1" style="text-indent:0px;"><a id="lnkSei' + escapeHtml2(id) + '" class="ancora_sei" style="text-indent:0px;">' + escapeHtml2(text) + "</a></span>";
  }
  function escapeHtml2(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  // src/features/editor/view/dialogs/citacao.js
  function convertFirstLetter(this_) {
    api.setParamEditor(this_);
    var selectTxt = state.oEditor.getSelection().getSelectedText();
    if (selectTxt != "") {
      var text = capitalizeFirstLetter(selectTxt);
      state.oEditor.insertHtml(text);
    } else {
      alertaBoxPro("Error", "exclamation-triangle", "Selecione um texto para convers\xE3o");
    }
  }
  function getCitacaoDocumento(this_, TimeOut = 9e3) {
    if (checkProcessoSigiloso()) {
      alertaBoxPro("Error", "exclamation-triangle", " N\xE3o dispon\xEDvel para processos sigilosos");
      api.setParamEditor(this_);
    } else {
      const documents = listProcessDocuments(globalThis);
      if (documents.length) {
        api.setParamEditor(this_);
        api.getDialogCitacaoDocumento();
      } else if (TimeOut <= 0) {
        alertaBoxPro("Aviso", "exclamation-triangle", "N\xE3o foi poss\xEDvel carregar os documentos do processo. Atualize a p\xE1gina e tente novamente.");
      } else {
        if (typeof loadEditorProcessDocuments === "function") {
          try {
            loadEditorProcessDocuments();
          } catch (_) {
          }
        }
        setTimeout(function() {
          api.getCitacaoDocumento(this_, TimeOut - 100);
          q(this_).fadeOut(200).fadeIn(200);
          if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload getCitacaoDocumento");
        }, 500);
      }
    }
  }
  function getDialogCitacaoDocumento() {
    if (!checkProcessoSigiloso()) {
      const viewportWidth = Number(globalThis.innerWidth) || 1024;
      const viewportHeight = Number(globalThis.innerHeight) || 700;
      const dialogWidth = Math.min(900, Math.max(620, viewportWidth - 40));
      const dialogHeight = Math.min(500, Math.max(320, viewportHeight - 120));
      var listDocumentos = q.map(listProcessDocuments(globalThis), function(value) {
        var id = processDocumentId(value);
        var label = String(value.documento || "").trim();
        var number = String(value.nr_sei || value.numeroSEI || value.numero || "").trim();
        var select_text = number ? label + " (" + number + ")" : label;
        if (id && label) {
          return `<option value="${id}">${select_text}</option>`;
        }
      }).join("");
      const htmlBox = sanitizeHTML(`
            <div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;min-height: 250px;">
                <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                    <tr>
                        <td style="vertical-align: bottom; text-align: left;" class="label">
                            <label for="selectCitacaoDocumento"><i class="iconPopup iconSwitch fas fa-file cinzaColor"></i>Documentos do processo:</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <select multiple="multiple" id="selectCitacaoDocumento" style="width: 100%; min-height: 220px;">
                            ${listDocumentos}
                            </select>
                        </td>
                    </tr>
                </table>
            </div>
        `);
      resetDialogBoxPro("dialogBoxPro");
      dialogBoxPro = q("#dialogBoxPro").html(htmlBox).dialog({
        title: "Inserir refer\xEAncia de documento do processo",
        width: dialogWidth,
        height: dialogHeight,
        open: function() {
          initChosenReplace("box_multiple", this, true);
          q("#selectCitacaoDocumento").on("change", function() {
            resizeHeigthDialogBox(dialogBoxPro);
          });
        },
        buttons: [{
          text: "Inserir",
          class: "confirm ui-state-active",
          click: function(event) {
            var selectMult = q("#selectCitacaoDocumento option:checked");
            var list_protocolo = q.map(selectMult, function(e) {
              if (e.value != "") return e.value;
            });
            if (q.isArray(list_protocolo) && list_protocolo.length) {
              q.each(list_protocolo, function(index, id_protocolo) {
                if (id_protocolo != "") {
                  var insert = api.insertCitacaoDocumento(id_protocolo);
                  if (insert && index < list_protocolo.length - 2) state.oEditor.insertText(", ");
                  if (insert && index == list_protocolo.length - 2) state.oEditor.insertText(" e ");
                }
              });
              resetDialogBoxPro("dialogBoxPro");
            }
          }
        }]
      });
    }
  }
  function insertCitacaoDocumento(id_protocolo) {
    var dataValue = listProcessDocuments(globalThis).find(
      (document2) => String(document2?.id_protocolo || document2?.id_documento || document2?.id || "") === String(id_protocolo)
    );
    if (typeof dataValue !== "undefined" && dataValue !== null && dataValue.documento) {
      var documentId = processDocumentId(dataValue);
      var referenceNumber = String(dataValue.nr_sei || dataValue.numeroSEI || dataValue.numero || "").trim();
      var linkText = referenceNumber || String(dataValue.documento || "").trim();
      var citacaoDoc = getCitacaoDoc();
      var nrSeiHtml = buildProcessDocumentReference({ ...dataValue, id_protocolo: documentId, nr_sei: linkText });
      var citacaoDocumento = referenceNumber || getConfigValue("citacaodoc") == "citacaodoc_4" ? String(dataValue.documento).trim() + "&nbsp;(" + citacaoDoc + nrSeiHtml + ")" : nrSeiHtml;
      state.oEditor.focus();
      state.oEditor.fire("saveSnapshot");
      state.oEditor.insertHtml(citacaoDocumento);
      state.oEditor.fire("saveSnapshot");
      return true;
    } else {
      return false;
    }
  }
  api.convertFirstLetter = convertFirstLetter;
  api.getCitacaoDocumento = getCitacaoDocumento;
  api.getDialogCitacaoDocumento = getDialogCitacaoDocumento;
  api.insertCitacaoDocumento = insertCitacaoDocumento;

  // src/features/editor/view/dialogs/footnotes.js
  var footnotes_exports = {};
  __export(footnotes_exports, {
    getDialogNotaRodape: () => getDialogNotaRodape,
    getNotaRodape: () => getNotaRodape,
    insertNtRodape: () => insertNtRodape,
    reorderNtRodape: () => reorderNtRodape,
    updateNrABNT: () => updateNrABNT
  });

  // src/features/editor/domain/dates.js
  function formatEditorDate(value, dateStyle = "long") {
    let date = value instanceof Date ? value : new Date(value);
    const dateOnly = typeof value === "string" && value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnly) date = new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("pt-BR", { dateStyle }).format(date);
  }

  // src/features/editor/view/dialogs/footnotes.js
  function getNotaRodape(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog("NtRodapeSEI");
  }
  function getDialogNotaRodape() {
    CKEDITOR.dialog.add("NtRodapeSEI", function(editor) {
      return {
        title: "Inserir nota de rodap\xE9",
        minWidth: 500,
        minHeight: 80,
        buttons: [CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton],
        onOk: function(event, a, b) {
          var txt_NotaRodapeLivre = this.getContentElement("tab_nr", "textNotaRodape").getValue();
          var txt_NotaRodapeABNT = q("#nrABNTResult").html();
          var txt_NotaRodape = txt_NotaRodapeABNT != "" ? txt_NotaRodapeABNT : txt_NotaRodapeLivre;
          if (txt_NotaRodape != "") {
            api.insertNtRodape(txt_NotaRodape);
            event.data.hide = true;
          }
        },
        onShow: function() {
          var nr_IDInput = this.getContentElement("tab_abnt", "nr_Nome")._.inputId;
          var nr_Data = this.getContentElement("tab_abnt", "nr_Data")._.inputId;
          var nr_Data = this.getContentElement("tab_abnt", "nr_Data")._.inputId;
          var nr_Volume = this.getContentElement("tab_abnt", "nr_Volume")._.inputId;
          var nr_Ano = this.getContentElement("tab_abnt", "nr_Ano")._.inputId;
          var nr_Edicao = this.getContentElement("tab_abnt", "nr_Edicao")._.inputId;
          q("#nrABNTResult").hide().html("");
          q("#" + nr_Data).attr("type", "date");
          q("#" + nr_Volume).attr("type", "number");
          q("#" + nr_Ano).attr("type", "number");
          q("#" + nr_Edicao).attr("type", "number");
          setTimeout(function() {
            q("#" + nr_IDInput).closest(".cke_dialog_page_contents").find("input, textarea, select").on("input change", function() {
              api.updateNrABNT(q(this));
            });
          }, 100);
        },
        contents: [
          {
            id: "tab_nr",
            label: "Texto livre",
            elements: [
              {
                type: "text",
                id: "textNotaRodape",
                label: "Texto da nota de rodap\xE9",
                "default": ""
              }
            ]
          },
          {
            id: "tab_abnt",
            label: "Padr\xE3o ABNT",
            elements: [
              {
                type: "hbox",
                widths: ["50%", "50%"],
                children: [
                  {
                    type: "text",
                    id: "nr_Nome",
                    label: "Nome do autor",
                    "default": ""
                  },
                  {
                    type: "text",
                    id: "nr_Sobrenome",
                    label: "Sobrenome do Autor",
                    "default": ""
                  }
                ]
              },
              {
                type: "hbox",
                widths: ["75%", "25%"],
                children: [
                  {
                    type: "text",
                    id: "nr_Titulo",
                    label: "T\xEDtulo da publica\xE7\xE3o",
                    "default": ""
                  },
                  {
                    type: "text",
                    id: "nr_Edicao",
                    label: "N\xFAmero da Edi\xE7\xE3o",
                    "default": ""
                  }
                ]
              },
              {
                type: "hbox",
                widths: ["50%", "50%"],
                children: [
                  {
                    type: "text",
                    id: "nr_Local",
                    label: "Local de publica\xE7\xE3o (cidade)",
                    "default": ""
                  },
                  {
                    type: "text",
                    id: "nr_Editora",
                    label: "Nome da Editora",
                    "default": ""
                  }
                ]
              },
              {
                type: "hbox",
                widths: ["25%", "25%", "25%", "25%"],
                children: [
                  {
                    type: "text",
                    id: "nr_Ano",
                    label: "Ano da publica\xE7\xE3o",
                    "default": ""
                  },
                  {
                    type: "text",
                    id: "nr_Volume",
                    label: "N\xFAmero do Volume",
                    "default": ""
                  },
                  {
                    type: "text",
                    id: "nr_Paginas",
                    label: "P\xE1ginas inicial-final",
                    "default": ""
                  }
                ]
              },
              {
                type: "hbox",
                widths: ["75%", "25%"],
                children: [
                  {
                    type: "text",
                    id: "nr_Link",
                    label: "Link da publica\xE7\xE3o",
                    "default": ""
                  },
                  {
                    type: "text",
                    id: "nr_Data",
                    label: "Data do acesso",
                    "default": ""
                  }
                ]
              },
              {
                type: "html",
                html: '<div id="nrABNTResult" style="padding: 5px 5px 8px 5px; background: #f9f9dc; border-radius: 5px; white-space: break-spaces;"></div>'
              }
            ]
          }
        ]
      };
    });
  }
  function updateNrABNT(this_) {
    setMomentPtBr();
    var input = this_.closest(".cke_dialog_page_contents").find("input, textarea, select");
    var nr_Nome = input.eq(0).val();
    nr_Nome = nr_Nome != "" ? ", " + capitalizeFirstLetter(nr_Nome.trim()) : nr_Nome;
    var nr_Sobrenome = input.eq(1).val();
    nr_Sobrenome = nr_Sobrenome != "" ? nr_Sobrenome.toUpperCase() : nr_Sobrenome;
    var nr_Titulo = input.eq(2).val();
    nr_Titulo = nr_Titulo != "" ? ". <strong>" + capitalizeFirstLetter(nr_Titulo.trim()) + "</strong>" : nr_Titulo;
    var nr_Edicao = input.eq(3).val();
    nr_Edicao = nr_Edicao != "" ? ". " + nr_Edicao + ". ed." : nr_Edicao;
    var nr_Local = input.eq(4).val();
    nr_Local = nr_Local != "" ? ", " + capitalizeFirstLetter(nr_Local.trim()) : nr_Local;
    var nr_Editora = input.eq(5).val();
    nr_Editora = nr_Editora != "" ? ": " + capitalizeFirstLetter(nr_Editora.trim()) : nr_Editora;
    var nr_Ano = input.eq(6).val();
    nr_Ano = nr_Ano != "" ? ", " + nr_Ano : nr_Ano;
    var nr_Volume = input.eq(7).val();
    nr_Volume = nr_Volume != "" ? ", v. " + nr_Volume : nr_Volume;
    var nr_Paginas = input.eq(8).val();
    nr_Paginas = nr_Paginas != "" ? ". p." + nr_Paginas : nr_Paginas;
    var nr_Link = input.eq(9).val();
    nr_Link = nr_Link != "" && isValidHttpUrl(nr_Link) ? '. Dispon\xEDvel em: <a href="' + nr_Link + '" target="_blank">&lt;' + nr_Link + "&gt;</a>" : "";
    var nr_Data = input.eq(10).val();
    nr_Data = nr_Data != "" ? ". Acesso em: " + formatEditorDate(nr_Data, "medium") : nr_Data;
    var htmlResult = nr_Sobrenome + nr_Nome + nr_Titulo + nr_Edicao + nr_Local + nr_Editora + nr_Ano + nr_Volume + nr_Paginas + nr_Link + nr_Data;
    if (htmlResult != "") {
      q("#nrABNTResult").show().html(htmlResult + ".");
    }
  }
  function insertNtRodape(txt_NotaRodape) {
    var randRef = randomString(16);
    var ntRodapeId = parseInt(state.iframeEditor.find(".ntRodape_item").length) + 1;
    var ntRodapeHtml_footer = '<p class="Tabela_Texto_Alinhado_Esquerda ntRodape"><a name="footer_' + randRef + '" href="#item_' + randRef + '" class="anchorRefInternaPro"><span class="ntRodape_footer ancoraSei" data-ntrodape-ref="' + randRef + '" data-ntrodape="' + ntRodapeId + '"  contenteditable="false">[' + ntRodapeId + "]</span></a> " + txt_NotaRodape + "</p>";
    var ntRodapeHtml_item = '<sup><a href="#footer_' + randRef + '" name="item_' + randRef + '" class="anchorRefInternaPro"><span class="ntRodape_item ancoraSei" data-ntrodape="' + ntRodapeId + '" data-ntrodape-ref="' + randRef + '" contenteditable="false">[' + ntRodapeId + "]</span></a></sup> ";
    state.oEditor.focus();
    state.oEditor.fire("saveSnapshot");
    if (state.iframeEditor.find(".ntRodape_tr").length == 0) {
      state.iframeEditor.find("body").append('<p class="Tabela_Texto_Alinhado_Esquerda ntRodape_tr">____________________________</p>');
    }
    state.iframeEditor.find("body").append(ntRodapeHtml_footer);
    state.oEditor.insertHtml(ntRodapeHtml_item);
    api.reorderNtRodape(state.iframeEditor);
    state.oEditor.fire("saveSnapshot");
    api.clickScroolToRef();
  }
  function reorderNtRodape(iframeEditor2) {
    var editor = iframeEditor2 || state.iframeEditor;
    if (!editor || typeof editor.find !== "function") return;
    editor.find(".ntRodape_item").each(function(index) {
      var dataRef = q(this).attr("data-ntrodape-ref");
      var ntRodapeId = index + 1;
      q(this).attr("data-ntrodape", ntRodapeId).text("[" + ntRodapeId + "]");
      editor.find('.ntRodape_footer[data-ntrodape-ref="' + dataRef + '"]').attr("data-ntrodape", ntRodapeId).text("[" + ntRodapeId + "]");
    });
    var arrayFooters = [];
    var removedContainers = /* @__PURE__ */ new Set();
    editor.find(".ntRodape_footer").each(function(index) {
      var dataRef = q(this).attr("data-ntrodape-ref");
      var ntRodapeId = parseInt(q(this).attr("data-ntrodape"));
      var footerParagraph = q(this).closest("p")[0];
      var hasItem = editor.find('.ntRodape_item[data-ntrodape-ref="' + dataRef + '"]').length > 0;
      if (!footerParagraph || removedContainers.has(footerParagraph)) return;
      removedContainers.add(footerParagraph);
      if (hasItem) {
        arrayFooters.push({ id: ntRodapeId, html: footerParagraph.outerHTML });
      }
      q(footerParagraph).remove();
    });
    arrayFooters.sort(function(a, b) {
      return a.id - b.id;
    });
    q.each(arrayFooters, function(index, value) {
      editor.find("body").append(value.html);
    });
  }
  api.getNotaRodape = getNotaRodape;
  api.getDialogNotaRodape = getDialogNotaRodape;
  api.updateNrABNT = updateNrABNT;
  api.insertNtRodape = insertNtRodape;
  api.reorderNtRodape = reorderNtRodape;

  // src/features/editor/view/dialogs/sigilo-tarja.js
  var sigilo_tarja_exports = {};
  __export(sigilo_tarja_exports, {
    addButtonTarjaSigilo: () => addButtonTarjaSigilo,
    initAddButtonTarjaSigilo: () => initAddButtonTarjaSigilo
  });
  function initAddButtonTarjaSigilo(TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    if (q(".getMarkSigiloButton").length) {
      api.addButtonTarjaSigilo();
    } else {
      setTimeout(function() {
        api.initAddButtonTarjaSigilo(TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initAddButtonTarjaSigilo");
      }, 500);
    }
  }
  function addButtonTarjaSigilo() {
    var icon16baseTarjaSigilo = URL_SPRO + "icons/menu/tarjasigilo.png";
    var htmlButtonAfterLetters = `   <a class="getTarjaSigiloButton cke_iconPro cke_button cke_buttonPro cke_button_off" href="#" title="Adicionar tarja de sigilo no texto" hidefocus="true">      <span class="cke_button_icon" style="background: url('` + icon16baseTarjaSigilo + `');">&nbsp;</span>      <span class="cke_button_label" aria-hidden="false">Adicionar tarja de sigilo no texto</span>   </a>`;
    q(state.txaEditor).each(function(index) {
      state.idEditor = q(this).attr("id").replace("cke_", "");
      if (q('iframe[title*="' + state.idEditor + '"]').contents().find("body").attr("contenteditable") == "true") {
        q(this).find("span.cke_toolgroup .getMarkSigiloButton").after(htmlButtonAfterLetters);
      }
    });
    q(".getTarjaSigiloButton").on("click", function() {
      if (!q(this).closest(".cke_iconPro").hasClass("cke_button_disabled")) {
        api.getTarjaSigilo(this);
      }
    });
  }
  api.initAddButtonTarjaSigilo = initAddButtonTarjaSigilo;
  api.addButtonTarjaSigilo = addButtonTarjaSigilo;

  // src/features/editor/view/dialogs/dados.js
  var dados_exports = {};
  __export(dados_exports, {
    arrayDadosEditor: () => arrayDadosEditor,
    editDynamicField: () => editDynamicField,
    getDadosEditor: () => getDadosEditor,
    getDialogDadosEditor: () => getDialogDadosEditor,
    getDialogDadosEditor_htmlListTag: () => getDialogDadosEditor_htmlListTag,
    insertDadosEditor: () => insertDadosEditor,
    newDynamicField: () => newDynamicField,
    removeDynamicField: () => removeDynamicField,
    replaceDadosEditor: () => replaceDadosEditor,
    setDocAutomatico: () => setDocAutomatico,
    setDocCertidao: () => setDocCertidao,
    updateDynamicField: () => updateDynamicField
  });

  // src/features/editor/domain/process-fields.js
  function normalizeSearch(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/\s+/g, " ").trim();
  }
  function filterProcessFields(fields = [], query2 = "") {
    const terms = normalizeSearch(query2).split(" ").filter(Boolean);
    if (!terms.length) return fields.slice();
    return fields.filter(([label]) => {
      const searchable = normalizeSearch(label);
      return terms.every((term) => searchable.includes(term));
    });
  }
  function processFieldPreview(value, { parseHtml: parseHtml3 } = {}) {
    const html = String(value || "");
    if (!html) return "Selecione um campo para visualizar o valor.";
    if (typeof parseHtml3 !== "function") return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const document2 = parseHtml3(html);
    const text = String(document2.body?.textContent || "").replace(/\s+/g, " ").trim();
    return text || "Conte\xFAdo formatado (imagem, c\xF3digo QR ou elemento do SEI).";
  }

  // src/features/editor/view/dialogs/dados.js
  function installProcessFieldSearch(dialog, fields) {
    const search = document.getElementById("seipro-process-field-search");
    const preview = document.getElementById("seipro-process-field-preview");
    const selectElement = dialog.getContentElement("tab1", "listDados");
    const select = document.getElementById(selectElement?._?.inputId);
    if (!search || !preview || !select) return;
    const render = () => {
      const selectedValue = select.value;
      const filtered = filterProcessFields(fields, search.value);
      select.replaceChildren();
      filtered.forEach(([label, value]) => {
        const option = document.createElement("option");
        option.textContent = label;
        option.value = value || "";
        select.appendChild(option);
      });
      if (filtered.some(([, value]) => value === selectedValue)) select.value = selectedValue;
      preview.textContent = processFieldPreview(select.value, {
        parseHtml: (html) => new DOMParser().parseFromString(html, "text/html")
      });
    };
    search.addEventListener("input", render);
    select.addEventListener("change", render);
    render();
  }
  function setDocCertidao() {
    var dadosDocCertidao = sessionStorageRestorePro("dadosDocCertidao");
    var nomeDocCertidao = sessionStorageRestorePro("nomeDocCertidao");
    var param = getParamsUrlPro(window.location.href);
    if (typeof param.acao_pro !== "undefined" && param.acao_pro == "set_certidao" && dadosDocCertidao && nomeDocCertidao) {
      api.setCKEDITOR_instances();
      api.initAddButtonTarjaSigilo();
      var modeloHtml = '<p class="Texto_Centralizado_Maiusculas_Negrito">CERTID\xC3O</p><p class="Texto_Centralizado_Maiusculas_Negrito">C\xD3PIA DE DOCUMENTO OFICIAL COM RESTRI\xC7\xC3O LEGAL DE PARTE(S) SOB SIGILO<br><br></p><p class="Texto_Alinhado_Esquerda">Em observ\xE2ncia \xE0 <a class="ancoraSei legisSeiPro" data-norma="Lei12527" data-normafull="Lei n\xBA 12.527, de 18 de novembro de 2011" data-index="0" data-cke-saved-href="http://www.planalto.gov.br/ccivil_03/_Ato2011-2014/2011/Lei/L12527.htm" href="http://www.planalto.gov.br/ccivil_03/_Ato2011-2014/2011/Lei/L12527.htm" target="_blank" data-reflinkpro="HdNxK8xI">Lei n\xBA 12.527, de 18 de novembro de 2011</a>, que estabelece, em seu artigo 7\xBA, \xA72\xBA, que:</p><p class="Citacao">Art. 7\xBA O acesso \xE0 informa\xE7\xE3o de que trata esta Lei compreende, entre outros, os direitos de obter:<br></p><p class="Citacao">(...)</p><p class="Citacao">\xA72\xBA Quando n\xE3o for autorizado acesso integral \xE0 informa\xE7\xE3o, por ser ela parcialmente sigilosa, \xE9 assegurado o acesso \xE0 parte n\xE3o sigilosa por meio de certid\xE3o, extrato ou c\xF3pia com oculta\xE7\xE3o da parte sob sigilo.</p><p class="Citacao">(...)</p><p class="Texto_Alinhado_Esquerda">Como servidor(a) p\xFAblico(a) em exerc\xEDcio, aponho minha assinatura e confiro f\xE9 p\xFAblica ao documento abaixo, confirmando que esta vers\xE3o se trata de c\xF3pia fiel da documenta\xE7\xE3o original, havendo sido ocultadas (tarjadas) exclusivamente as informa\xE7\xF5es protegidas por sigilo legal, assegurando a fidelidade da informa\xE7\xE3o p\xFAblica. Assim, esta vers\xE3o passa a coexistir com o documento integral criado com o amparo da citada Lei.</p><p class="Texto_Alinhado_Esquerda"><br></p><table border="0" cellspacing="1" cellpadding="1" style="border-collapse:collapse;border-color: rgb(206 206 206);margin-left:auto;margin-right:auto;width:100%;">   <tbody>       <tr>           <td style="background-color: rgb(238, 238, 238);">               <p class="Texto_Centralizado" id="">In\xEDcio do(a) ' + nomeDocCertidao + '</p>           </td>       </tr>       <tr>           <td contenteditable="false">               <p class="Tabela_Texto_Alinhado_Esquerda"><br></p>               ' + dadosDocCertidao + '               <p class="Tabela_Texto_Alinhado_Esquerda"><br></p>           </td>       </tr>       <tr>           <td style="background-color: rgb(238, 238, 238);">               <p class="Texto_Centralizado">Fim do(a) ' + nomeDocCertidao + '<br></p>           </td>       </tr>   </tbody></table><p class="Texto_Alinhado_Esquerda"><br></p>';
      var elemIframe = q("iframe").filter(function() {
        return q(this).contents().find("body").attr("contenteditable") == "true";
      }).eq(0);
      if (elemIframe.length) {
        var iframe = elemIframe.contents();
        if (elemIframe.attr("title").indexOf(",") !== -1) {
          state.idEditor = elemIframe.attr("title").split(",")[1].trim();
          q("#idEditor").val(state.idEditor);
          state.oEditor = CKEDITOR.instances[state.idEditor];
          if (typeof oEditor !== "undefined") {
            state.oEditor.focus();
            state.oEditor.fire("saveSnapshot");
            iframe.find("body").html(modeloHtml);
            api.actionsMarkSigilo(void 0, "apply");
            enableButtonSavePro();
            var $form = state.oEditor.element.$.form;
            if ($form) $form.submit();
            sessionStorageRemovePro("dadosDocCertidao");
            sessionStorageRemovePro("nomeDocCertidao");
          }
        }
      }
    }
  }
  function setDocAutomatico() {
    var dadosDocAutomatico = sessionStorageRestorePro("dadosDocAutomatico");
    var nomeDocAutomatico = sessionStorageRestorePro("nomeDocAutomatico");
    var param = getParamsUrlPro(window.location.href);
    if (typeof param.acao_pro !== "undefined" && param.acao_pro == "set_automatico" && dadosDocAutomatico && nomeDocAutomatico) {
      api.setCKEDITOR_instances();
      api.initAddButtonTarjaSigilo();
      var elemIframe = q("iframe").filter(function() {
        return q(this).contents().find("body").attr("contenteditable") == "true";
      }).eq(0);
      if (elemIframe.length) {
        var iframe = elemIframe.contents();
        if (elemIframe.attr("title").indexOf(",") !== -1) {
          state.idEditor = elemIframe.attr("title").split(",")[1].trim();
          q("#idEditor").val(state.idEditor);
          state.oEditor = CKEDITOR.instances[state.idEditor];
          if (typeof state.oEditor !== "undefined") {
            state.oEditor.focus();
            oEditor.fire("saveSnapshot");
            iframe.find("body").html(dadosDocAutomatico);
            api.actionsMarkSigilo(void 0, "apply");
            sessionStorageRemovePro("dadosDocAutomatico");
            sessionStorageRemovePro("nomeDocAutomatico");
            setTimeout(function() {
              enableButtonSavePro();
              var $form = state.oEditor.element.$.form;
              if ($form) $form.submit();
            }, 1500);
          }
        }
      }
    }
  }
  function replaceDadosEditor(this_) {
    var arrayTags = uniqPro(getHashTagsPro(iframeEditor.find("p").map(function() {
      return q(this).text().replace(/\u00A0/gm, " ");
    }).get().join(" ")));
    var delimitLine = false;
    var prop = dadosProcessoPro.propProcesso;
    var docs = dadosProcessoPro.listDocumentos;
    var tagField = state.iframeEditor.find("body").find("span.hashField");
    if (tagField.length) {
      tagField.after(tagField.html()).remove();
    }
    var dadosProcesso = camposDinamicosProcesso(arrayTags);
    var dadosTags = [];
    q.each(prop.txaTagsObservacoes, function(index, valueTag) {
      if (valueTag.unidade != siglaUnidadeAtual) {
        q.each(valueTag.tags, function(i, v) {
          var isRegex = new RegExp(v.value, "i").test(void 0);
          dadosProcesso[v.name] = '<span class="ancoraSei dynamicField">' + v.value + "</span>";
          dadosTags.push(v.name);
        });
      }
    });
    q.each(prop.txaTagsObservacoes, function(index, valueTag) {
      if (valueTag.unidade == siglaUnidadeAtual) {
        q.each(valueTag.tags, function(i, v) {
          dadosProcesso[v.name] = '<span class="ancoraSei dynamicField">' + v.value + "</span>";
          dadosTags.push(v.name);
        });
      }
    });
    var count = 0;
    state.oEditor.focus();
    state.oEditor.fire("saveSnapshot");
    q.each(arrayTags, function(i, value) {
      var _value = value;
      var underline = value.indexOf("_") !== -1 && q.inArray(_value, dadosTags) === -1 ? "_" + value.split("_")[1] : "";
      value = value.indexOf("_") !== -1 ? value.split("_")[0] : value;
      value = q.inArray(_value, dadosTags) !== -1 ? _value : value;
      var hashTag = value.indexOf("+") !== -1 ? "#" + value.replace("+", "\\+") : "#" + value;
      var hashSpan = '<span class="ancoraSei hashField" data-hash="' + value + '">#' + value + "</span>";
      var fieldSpan = typeof dadosProcesso[value] !== "undefined" && dadosProcesso[value] !== null ? dadosProcesso[value] : hashSpan;
      fieldSpan = value.indexOf("+") !== -1 || value.indexOf("-") !== -1 || hasNumber(value) && q.inArray(_value, dadosTags) === -1 ? sumTagValue(value) : fieldSpan;
      fieldSpan = fieldSpan + "&nbsp;";
      state.iframeEditor.find("p").each(function() {
        q(this).html(q(this).html().replace(new RegExp(hashTag + underline, "i"), function() {
          count++;
          return fieldSpan;
        }));
      });
      console.log(arrayTags, value, hashTag + underline, fieldSpan, dadosProcesso);
    });
    state.oEditor.fire("saveSnapshot");
    var count_error = state.iframeEditor.find(".hashField").length;
    count_error = count_error == 0 ? "" : '  <i class="fas fa-exclamation-triangle laranjaColor"></i> ' + count_error + " " + (count_error == 1 ? "campo din\xE2mico n\xE3o substitu\xEDdo" : "campos n\xE3o din\xE2micos substitu\xEDdos") + ".";
    var resultDiv = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">  <i class="fas fa-check-circle verdeColor"></i> ' + count + " " + (count == 1 ? "campo din\xE2mico substitu\xEDdo" : "campos din\xE2micos substitu\xEDdos") + " com sucesso!<br>" + count_error + "</label>";
    q("#tabReplaceTag_result").show().html(resultDiv);
  }
  function arrayDadosEditor() {
    setMomentPtBr();
    var listaDadosEditor = [[""]];
    var prop = dadosProcessoPro.propProcesso;
    var processo = typeof prop !== "undefined" && typeof prop.txtProtocoloExibir === "undefined" ? prop.hdnProtocoloFormatado : prop.txtProtocoloExibir;
    var dataGeracao = typeof prop.txtDtaGeracaoExibir === "undefined" ? prop.hdnDtaGeracao : prop.txtDtaGeracaoExibir;
    var htmlProcesso = '<span contenteditable="false" data-cke-linksei="1" style="text-indent:0px;"><a id="lnkSei' + prop.hdnIdProcedimento + '" class="ancoraSei" style="text-indent:0px;">' + processo + "</a></span>";
    listaDadosEditor.push(["Processo: " + processo, htmlProcesso]);
    listaDadosEditor.push(["Data de Autua\xE7\xE3o: " + dataGeracao, dataGeracao]);
    listaDadosEditor.push(["Tipo: " + prop.hdnNomeTipoProcedimento, prop.hdnNomeTipoProcedimento]);
    listaDadosEditor.push(["Especifica\xE7\xE3o: " + prop.txtDescricao, prop.txtDescricao]);
    var acesso = typeof prop.rdoNivelAcesso !== "undefined" && prop.rdoNivelAcesso == 0 ? "P\xFAblico" : null;
    acesso = acesso !== null && prop.rdoNivelAcesso == 1 ? "Restrito" : acesso;
    acesso = acesso !== null && prop.rdoNivelAcesso == 2 ? "Sigiloso" : acesso;
    listaDadosEditor.push(["N\xEDvel de Acesso: " + acesso, acesso]);
    q.each(prop.selInteressadosProcedimento, function(index, value) {
      listaDadosEditor.push(["Interessado: " + value, value]);
    });
    q.each(prop.selAssuntos_select, function(index, value) {
      var valueAssunto = value.length > 100 ? value.replace(/^(.{100}[^\s]*).*/, "$1") + "..." : value;
      listaDadosEditor.push(["Assunto: " + valueAssunto, value]);
    });
    q.each(prop.txaObservacoes, function(index, value) {
      var valueObs = value.observacao.length > 100 ? value.observacao.replace(/^(.{100}[^\s]*).*/, "$1") + "..." : value.observacao;
      listaDadosEditor.push(["Observa\xE7\xE3o (" + value.unidade + "): " + valueObs, value.observacao]);
    });
    var today = formatEditorDate(/* @__PURE__ */ new Date());
    var currentYear = String((/* @__PURE__ */ new Date()).getFullYear());
    listaDadosEditor.push(["Hoje: " + today, today]);
    listaDadosEditor.push(["Ano: " + currentYear, currentYear]);
    listaDadosEditor.push(["QRCode do Processo", getQRProcesso()]);
    q.each(prop.txaTagsObservacoes, function(index, valueTag) {
      q.each(valueTag.tags, function(i, v) {
        var vObs = v.value.length > 100 ? v.value.replace(/^(.{100}[^\s]*).*/, "$1") + "..." : v.value;
        listaDadosEditor.push(["Personalizado (" + valueTag.unidade + ") #" + v.name + ": " + vObs, v.value]);
      });
    });
    if (typeof dadosProcessoPro.listAtribuicaoProcesso !== "undefined") {
      q.each(dadosProcessoPro.listAtribuicaoProcesso, function(index, value) {
        listaDadosEditor.push(["Respons\xE1vel: " + value.name, value.name]);
      });
    }
    return listaDadosEditor;
  }
  function getDadosEditor(this_, TimeOut = 9e3) {
    if (checkProcessoSigiloso()) {
      CKEDITOR.dialog.add("DadosSEI", function(editor) {
        return getDialogNaoDisponivel("Dados do Processo");
      });
      api.setParamEditor(this_);
      state.oEditor.openDialog("DadosSEI");
    } else {
      if (TimeOut <= 0) {
        if (typeof alertaBoxPro === "function") {
          alertaBoxPro("Aviso", "exclamation-triangle", "N\xE3o foi poss\xEDvel carregar os dados do processo. Atualize a p\xE1gina e tente novamente.");
        }
        return;
      }
      if (typeof dadosProcessoPro.propProcesso !== "undefined" && typeof dadosProcessoPro.listDocumentos !== "undefined" && api.arrayDadosEditor().length) {
        api.getDialogDadosEditor();
        api.setParamEditor(this_);
        state.oEditor.openDialog("DadosSEI");
      } else {
        setTimeout(function() {
          if (typeof dadosProcessoPro.propProcesso === "undefined" && getDadosProcessoSession()) {
            dadosProcessoPro = getDadosProcessoSession();
          }
          api.getDadosEditor(this_, TimeOut - 100);
          q(this_).fadeOut(200).fadeIn(200);
          if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload api.getDadosEditor");
        }, 500);
      }
    }
  }
  function getDialogDadosEditor() {
    if (!checkProcessoSigiloso()) {
      if (window.__SEI_PRO_DADOS_DIALOG_REGISTERED__) return;
      var tableNewDynamicField = "";
      var dadosEditorArray = api.arrayDadosEditor();
      var tagsArray = jmespath.search(dadosProcessoPro.propProcesso.txaTagsObservacoes, "[?unidade=='" + siglaUnidadeAtual + "'] | [0]");
      tagsArray = tagsArray === null ? jmespath.search(dadosProcessoPro.propProcesso.txaTagsObservacoes, "[?unidade==''] | [0]") : tagsArray;
      tableNewDynamicField = '<table role="presentation" class="cke_dialog_ui_hbox tableZebra"> <thead>     <tr>         <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Nome do campo din\xE2mico</th>         <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Valor</th>     </tr> </thead> <tbody>';
      if (tagsArray !== null) {
        q.each(tagsArray.tags, function(index, v) {
          tableNewDynamicField += '     <tr class="cke_dialog_ui_hbox" data-tag="' + v.name + '">         <td class="" role="presentation" style="width:30%; padding:8px">             <label class="cke_dialog_ui_labeled_label"><b class="hashSpan">#' + v.name + '</b></label>         </td>         <td class="" role="presentation" style="width:70%; padding:8px">             <em>' + v.value + '</em>             <a style="user-select: none; float: right;" data-seipro-action="removeDynamicField" title="Remover" hidefocus="true" class="cke_dialog_ui_button" role="button">                 <span id="buttonRemoveDynamicField_label" class="cke_dialog_ui_button">                     <i style="color: #989898;" class="fas fa-trash"></i>                 </span>             </a>             <a style="user-select: none; float: right; margin-right: 10px;" data-seipro-action="editDynamicField" title="Editar" hidefocus="true" class="cke_dialog_ui_button" role="button">                 <span id="buttonEditDynamicField_label" class="cke_dialog_ui_button">                     <i style="color: #989898;" class="fas fa-pencil-alt"></i>                 </span>             </a>         </td>     </tr>';
        });
      }
      tableNewDynamicField += " </tbody></table>";
      CKEDITOR.dialog.add("DadosSEI", function(editor) {
        return {
          title: "Dados do Processo",
          minWidth: 750,
          minHeight: 80,
          buttons: [CKEDITOR.dialog.okButton],
          onOk: function(event, a, b) {
            var value = this.getContentElement("tab1", "listDados").getValue();
            if (value != "") {
              api.insertDadosEditor(value);
              event.data.hide = true;
            }
          },
          onShow: function() {
            var arrayTags_len = getHashTagsPro(iframeEditor.find("p").map(function() {
              return q(this).text();
            }).get().join(" ")).length;
            var resultDiv = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">  <i class="fas fa-info-circle" style="color: #007fff;"></i> ' + arrayTags_len + " " + (arrayTags_len == 1 ? "campo din\xE2mico detectado" : "campos din\xE2micos detectados") + "!<br></label>";
            q("#tabReplaceTag_result").show().html(resultDiv);
            q("#tabNewDynamicField_alert").hide().html("");
            if (verifyConfigValue("substituiselecao")) api.setChosenInCke();
            installProcessFieldSearch(this, dadosEditorArray);
          },
          contents: [
            {
              id: "tab1",
              label: "Inserir Dados do Processo",
              elements: [
                {
                  type: "html",
                  html: '<label for="seipro-process-field-search" class="cke_dialog_ui_labeled_label">Pesquisar campo</label><input id="seipro-process-field-search" type="search" class="cke_dialog_ui_input_text" autocomplete="off" placeholder="Ex.: interessado, assunto, data ou respons\xE1vel" style="width:100%;box-sizing:border-box;margin-bottom:8px;"><p id="seipro-process-field-preview" class="seipro-process-field-preview" aria-live="polite" style="margin:0 0 10px;padding:8px;background:#f8f9fa;border-radius:4px;"></p>'
                },
                {
                  type: "select",
                  id: "listDados",
                  // labelLayout: 'horizontal',
                  inputStyle: "max-width: 560px",
                  label: "Dados do Processo",
                  items: dadosEditorArray,
                  "default": ""
                }
              ]
            },
            {
              id: "tab2",
              label: "Substituir Campos Din\xE2micos",
              elements: [
                {
                  type: "html",
                  html: '<table role="presentation" class="cke_dialog_ui_hbox"> <tbody>     <tr class="cke_dialog_ui_hbox">         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">             <label class="cke_dialog_ui_labeled_label">Substituir campos din\xE2micos no documento</label>         </td>         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">             <a style="user-select: none;" data-seipro-action="replaceDadosEditor" title="Substituir" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo1_label" id="buttonSigilo1_uiElement">                 <span id="buttonSigilo1_label" class="cke_dialog_ui_button">Substituir</span>             </a>         </td>     </tr> </tbody></table><div id="tabReplaceTag_result" class="tabReplaceTag_result" style="display:none; margin-top: 15px;"></div>'
                }
              ]
            },
            {
              id: "tab3",
              label: "Campos Din\xE2micos Personalizados",
              elements: [
                {
                  type: "html",
                  html: '<table role="presentation" class="cke_dialog_ui_hbox"> <tbody>     <tr class="cke_dialog_ui_hbox">         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">             <label class="cke_dialog_ui_labeled_label" id="cke_inputNameDynamicField_label" for="cke_inputNameDynamicField_textInput">Nome do campo din\xE2mico:</label>         </td>         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px 0">             # <input style="max-width: 510px;" tabindex="2" placeholder="Insira um nome personalizado, sem acentos ou espa\xE7os" class="cke_dialog_ui_input_text" id="cke_inputNameDynamicField_textInput" type="text" aria-labelledby="cke_inputNameDynamicField_label">         </td>     </tr>     <tr class="cke_dialog_ui_hbox">         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">             <label class="cke_dialog_ui_labeled_label" id="cke_inputValueDynamicField_label" for="cke_inputValueDynamicField_textInput">Valor do campo din\xE2mico:</label>         </td>         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px 0">             <input tabindex="3" placeholder="Insira o valor para o campo din\xE2mico" class="cke_dialog_ui_input_text" id="cke_inputValueDynamicField_textInput" type="text" aria-labelledby="cke_inputValueDynamicField_label">         </td>     </tr>     <tr class="cke_dialog_ui_hbox">         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">         </td>         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px 0">             <a style="user-select: none;" data-seipro-action="newDynamicField" title="Salvar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonNewDynamicField_label" id="buttonNewDynamicField_uiElement">                 <span id="buttonNewDynamicField_label" class="cke_dialog_ui_button">Salvar</span>             </a>         </td>     </tr> </tbody></table><div id="tabNewDynamicField_alert" class="tabReplaceTag_result" style="display:none; margin-top: 15px;"></div><div id="tabNewDynamicField_result" class="tabReplaceTag_result" style="margin-top: 15px;">     ' + tableNewDynamicField + '</div><div id="tabNewDynamicField_info" class="tabReplaceTag_result" style="margin-top: 15px;">     <label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">         <i class="fas fa-info-circle" style="color: #007fff;"></i> Os campos din\xE2micos personalizados s\xE3o salvos nas observa\xE7\xF5es da unidade para este processo.     </label></div>'
                }
              ]
            },
            {
              id: "tab4",
              label: "Lista de Campos Din\xE2micos",
              elements: [
                {
                  type: "html",
                  html: '<table role="presentation" class="cke_dialog_ui_hbox tableZebra"> <tbody>     <tr class="cke_dialog_ui_hbox">         <td class="" role="presentation" style="width:100%; padding:0px">             <div id="tabReplaceTag_list" style="height: 285px; overflow-y: scroll;">                  <label class="cke_dialog_ui_labeled_label" style="display: block;"><span style="font-size: 10pt;"><i class="fas fa-hashtag" style="color: #007fff; font-size: 12pt;"></i> Lista de campos din\xE2micos dispon\xEDveis para utiliza\xE7\xE3o</span></label>                  <table role="presentation" style="margin-top: 15px;" class="cke_dialog_ui_hbox" id="cke_tabReplaceTag_uiElement">                   <tbody>                       ' + api.getDialogDadosEditor_htmlListTag("processo", "N\xFAmero do processo <em>(com link)</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("processo_texto", "N\xFAmero do processo <em>(sem link)</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("autuacao", "Data de autua\xE7\xE3o do processo <em>(em formato DD/MM/AAAA)</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("tipo", "Tipo do processo") + "                       " + api.getDialogDadosEditor_htmlListTag("especificacao", "Especifica\xE7\xE3o do processo") + "                       " + api.getDialogDadosEditor_htmlListTag("assuntos", "Classifica\xE7\xE3o por assuntos do processo <em>(separados por v\xEDrgula)</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("assuntos_lista", "Classifica\xE7\xE3o por assuntos do processo <em>(em formato de lista)</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("interessados", "Interessados do processo <em>(separados por v\xEDrgula)</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("interessados_lista", "Interessados do processo <em>(em formato de lista)</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("observacoes", "Observa\xE7\xF5es do processo <em>(separados por v\xEDrgula)</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("observacoes_lista", "Observa\xE7\xF5es do processo <em>(em formato de lista)</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("observacao", "Observa\xE7\xE3o da unidade atual</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("acesso", "N\xEDvel de acesso do processo") + "                       " + api.getDialogDadosEditor_htmlListTag("acesso_texto", "N\xEDvel de acesso do processo <em>(sem \xEDcone)</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("documentos", "Lista de todos os documentos do processo (separados por v\xEDrgula)</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("totaldocumentos", "N\xFAmero de documentos do processo</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("documentos_lista", "Lista de todos os documentos do processo (em formato de lista)</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("hoje", "Data de hoje <em>(em formato [dia] de [m\xEAs] de [ano])</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("ano", "Ano corrente <em>(em formato de 4 d\xEDgitos [YYYY])</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("qrcode", "QRCode do link para acesso ao processo (SEI Interno)</em>") + '                   </tbody>                  </table>                  <label class="cke_dialog_ui_labeled_label" style="margin-top: 15px; display: block;"><span style="font-size: 10pt;"><i class="fas fa-user-ninja roxoColor" style="font-size: 12pt;"></i> Fun\xE7\xF5es Avan\xE7adas</span></label>                  <table role="presentation" style="margin-top: 15px;" class="cke_dialog_ui_hbox" id="cke_tabReplaceTagAdv_uiElement">                   <tbody>                       ' + api.getDialogDadosEditor_htmlListTag("assunto1", "Primeiro assunto do processo") + "                       " + api.getDialogDadosEditor_htmlListTag("assunto3", "Terceiro assunto do processo") + "                       " + api.getDialogDadosEditor_htmlListTag("interessado1", "Primeiro interessado do processo") + "                       " + api.getDialogDadosEditor_htmlListTag("interessado4", "Quarto interessado do processo") + "                       " + api.getDialogDadosEditor_htmlListTag("observacao1", "Primeira observa\xE7\xE3o do processo") + "                       " + api.getDialogDadosEditor_htmlListTag("observacao2", "Segunda observa\xE7\xE3o do processo") + "                       " + api.getDialogDadosEditor_htmlListTag("documento1", "Primeiro documento do processo") + "                       " + api.getDialogDadosEditor_htmlListTag("documento5", "Quinto documento do processo") + "                       " + api.getDialogDadosEditor_htmlListTag("documento+1", "Pr\xF3ximo documento do processo em rela\xE7\xE3o ao atual") + "                       " + api.getDialogDadosEditor_htmlListTag("documento+3", "Terceiro documento do processo em rela\xE7\xE3o ao atual") + "                       " + api.getDialogDadosEditor_htmlListTag("documento-1", "Primeiro documento do processo anterior ao atual") + "                       " + api.getDialogDadosEditor_htmlListTag("documento-6", "Sexto documento do processo anterior ao atual") + "                       " + api.getDialogDadosEditor_htmlListTag("hoje+1", "Amanh\xE3 <em>(em formato [dia] de [m\xEAs] de [ano])</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("hoje-1", "Ontem <em>(em formato [dia] de [m\xEAs] de [ano])</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("hoje+7", "Data daqui 7 dias <em>(em formato [dia] de [m\xEAs] de [ano])</em>") + "                       " + api.getDialogDadosEditor_htmlListTag("hoje-5", "Data \xE0 5 dias atr\xE1s <em>(em formato [dia] de [m\xEAs] de [ano])</em>") + "                   </tbody>                  </table>             </div>         </td>     </tr> </tbody></table>"
                }
              ]
            }
          ]
        };
      });
      window.__SEI_PRO_DADOS_DIALOG_REGISTERED__ = true;
    }
  }
  function removeDynamicField(this_) {
    q(this_).closest("tr").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).slideUp("slow", function() {
      q(this).remove();
      updateDynamicField();
      var result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">  <i class="fas fa-check-circle verdeColor"></i> Campo din\xE2mico exclu\xEDdo com sucesso!<br></label>';
      q("#tabNewDynamicField_alert").show().html(result);
    });
  }
  function editDynamicField(this_) {
    var _this = q(this_);
    var _parent = _this.closest("tr");
    var name = _parent.find("td").eq(0).find("b").text().replace("#", "");
    var value = _parent.find("td").eq(1).find("em").text();
    q("#cke_inputNameDynamicField_textInput").val(name);
    q("#cke_inputValueDynamicField_textInput").val(value);
  }
  function newDynamicField(this_) {
    var _this = q(this_);
    var _parent = _this.closest("table");
    var nameInput = _parent.find("#cke_inputNameDynamicField_textInput");
    var valueInput = _parent.find("#cke_inputValueDynamicField_textInput");
    var arrayRestictTags = uniqPro(q("#tabReplaceTag_list table").find("b").map(function() {
      return q(this).text().replace(/[^a-zA-Z_]+/g, "");
    }).get());
    var name = nameInput.val() != "" ? removeAcentos(nameInput.val().split(":")[0].replace("#", "")).replace(/\ /g, "").toLowerCase().trim() : nameInput.val();
    var value = valueInput.val().trim();
    var result = "";
    q("#tabNewDynamicField_alert").hide().html("");
    if (name != "" && value != "") {
      if (q.inArray(name, arrayRestictTags) === -1) {
        var htmlNewDynamicField = '     <tr class="cke_dialog_ui_hbox" data-tag="' + name + '">         <td class="" role="presentation" style="width:30%; padding:8px">             <label class="cke_dialog_ui_labeled_label"><b class="hashSpan">#' + name + '</b></label>         </td>         <td class="" role="presentation" style="width:70%; padding:8px">             <em>' + value + '</em>             <a style="user-select: none; float: right;" data-seipro-action="removeDynamicField" title="Remover" hidefocus="true" class="cke_dialog_ui_button" role="button">                 <span id="buttonRemoveDynamicField_label" class="cke_dialog_ui_button">                     <i style="color: #989898;" class="fas fa-trash"></i>                 </span>             </a>             <a style="user-select: none; float: right; margin-right: 10px;" data-seipro-action="editDynamicField" title="Editar" hidefocus="true" class="cke_dialog_ui_button" role="button">                 <span id="buttonEditDynamicField_label" class="cke_dialog_ui_button">                     <i style="color: #989898;" class="fas fa-pencil-alt"></i>                 </span>             </a>         </td>     </tr>';
        var trTagEdit = q("#tabNewDynamicField_result").find("table tbody").find('tr[data-tag="' + name + '"]');
        if (trTagEdit.length == 0) {
          q("#tabNewDynamicField_result").find("table tbody").prepend(htmlNewDynamicField);
          q("#tabNewDynamicField_result").find("table tbody").find("tr").eq(0).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        } else {
          trTagEdit.find("td").eq(0).find("b").text("#" + name);
          trTagEdit.find("td").eq(1).find("em").text(value);
          trTagEdit.eq(0).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        }
        result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">  <i class="fas fa-check-circle verdeColor"></i> Campo din\xE2mico salvo com sucesso!<br></label>';
        nameInput.val("");
        valueInput.val("");
        api.updateDynamicField();
      } else {
        result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nome restrito para utiliza&#x00E7;&#x00E3;o interna (Lista de campos din&#x00E2;micos). Insira outro nome!</label>';
      }
      q("#tabNewDynamicField_alert").show().html(result);
    }
  }
  function updateDynamicField() {
    var selectId = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "listDados")._.inputId;
    q("#" + selectId).find("option").each(function() {
      if (q(this).text().trim().split(" ")[0] == "Personalizado") {
        q(this).remove();
      }
    });
    var txtObsDynamicField = "";
    var arrayNewDynamicField = [];
    q("#tabNewDynamicField_result").find("table tbody tr").each(function(index, value) {
      var name = q(this).find("td").eq(0).find("b").text().trim().replace("#", "");
      var value = q(this).find("td").eq(1).find("em").text().trim();
      q("#" + selectId).append('<option value="' + value + '">Personalizado (' + siglaUnidadeAtual + ") #" + name + ": " + value + "</option>");
      arrayNewDynamicField.push({ name, value });
      txtObsDynamicField += "#" + name + ": " + value + "\n";
    });
    q.each(dadosProcessoPro.propProcesso.txaTagsObservacoes, function(index, value) {
      if (value.unidade == siglaUnidadeAtual) {
        dadosProcessoPro.propProcesso.txaTagsObservacoes[index].tags = arrayNewDynamicField;
      }
    });
    var txaObservacoes = jmespath.search(dadosProcessoPro.propProcesso.txaObservacoes, "[?unidade=='" + siglaUnidadeAtual + "'].observacao | [0]");
    txtObsDynamicField = txaObservacoes !== null ? txtObsDynamicField + txaObservacoes : txtObsDynamicField;
    updateDadosProcesso("txaObservacoes", txtObsDynamicField);
    console.log("arrayNewDynamicField", arrayNewDynamicField, txtObsDynamicField);
  }
  function getDialogDadosEditor_htmlListTag(tag, desc) {
    return '          <tr class="cke_dialog_ui_hbox">              <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:8px">                  <label class="cke_dialog_ui_labeled_label"><b class="hashSpan">#' + tag + '</b></label>              </td>              <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px; vertical-align: middle;">                  ' + desc + "              </td>          </tr>";
  }
  function insertDadosEditor(value) {
    oEditor.focus();
    state.oEditor.fire("saveSnapshot");
    state.oEditor.insertHtml(value);
    oEditor.fire("saveSnapshot");
  }
  api.setDocCertidao = setDocCertidao;
  api.setDocAutomatico = setDocAutomatico;
  api.replaceDadosEditor = replaceDadosEditor;
  api.arrayDadosEditor = arrayDadosEditor;
  api.getDadosEditor = getDadosEditor;
  api.getDialogDadosEditor = getDialogDadosEditor;
  api.removeDynamicField = removeDynamicField;
  api.editDynamicField = editDynamicField;
  api.newDynamicField = newDynamicField;
  api.updateDynamicField = updateDynamicField;
  api.getDialogDadosEditor_htmlListTag = getDialogDadosEditor_htmlListTag;
  api.insertDadosEditor = insertDadosEditor;

  // src/features/editor/view/dialogs/sumario.js
  var sumario_exports = {};
  __export(sumario_exports, {
    getDialogSumarioDocumento: () => getDialogSumarioDocumento,
    getDialogSumarioDocumento_: () => getDialogSumarioDocumento_,
    getListStylesDocumento: () => getListStylesDocumento,
    getSumarioDocumento: () => getSumarioDocumento,
    insertSumarioDocumento: () => insertSumarioDocumento,
    updateSelectDialog: () => updateSelectDialog
  });
  function getSumarioDocumento(this_) {
    api.setParamEditor(this_);
    api.getDialogSumarioDocumento();
  }
  function getListStylesDocumento() {
    var arrayStylesDoc = [];
    var editorIds = /* @__PURE__ */ new Set();
    q(state.txaEditor).each(function(index) {
      var id = q(this).attr("id");
      if (!id || editorIds.has(id)) return;
      var idEditor_ = id.replace("cke_", "");
      var editorFrame = q(this).find("iframe").eq(0);
      var iframe_ = editorFrame.length ? editorFrame.contents() : q('iframe[title*="' + idEditor_ + '"]').eq(0).contents();
      if (iframe_.find("body").length) {
        editorIds.add(id);
        iframe_.find("p").each(function(index2) {
          var style = typeof q(this).attr("class") !== "undefined" && q(this).attr("class").indexOf(" ") !== -1 ? q(this).attr("class").split(" ")[0] : q(this).attr("class");
          arrayStylesDoc.push(style);
        });
      }
    });
    arrayStylesDoc = uniqPro(arrayStylesDoc);
    var optionsStyles = q.map(arrayStylesDoc, function(value) {
      if (value) return `<option value=".${value}">${value}</option>`;
    }).join("");
    return optionsStyles;
  }
  function updateSelectDialog(element, array) {
    if (q("select#" + element).length) {
      q("select#" + element).html("");
      q.each(array, function(index, value) {
        q("select#" + element).append('<option value="' + value[1] + '">' + value[0] + "</option>");
      });
    }
  }
  function getDialogSumarioDocumento() {
    var optionsStyles = api.getListStylesDocumento();
    const htmlBox = sanitizeHTML(`
        <div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
            <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                <tr>
                    <td style="vertical-align: bottom; text-align: left;" class="label">
                        <label for="listStyle1"><i class="iconPopup iconSwitch fas fa-h1 cinzaColor"></i>Estilo do T\xEDtulo 1 (obrigat\xF3rio):</label>
                    </td>
                    <td>
                        <select id="listStyle1" style="width: 350px;">
                            ${optionsStyles}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td style="vertical-align: bottom; text-align: left;" class="label">
                        <label for="listStyle2"><i class="iconPopup iconSwitch fas fa-h2 cinzaColor"></i>Estilo do T\xEDtulo 2:</label>
                    </td>
                    <td>
                        <select id="listStyle2" style="width: 350px;">
                            ${optionsStyles}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td style="vertical-align: bottom; text-align: left;" class="label">
                        <label for="listStyle3"><i class="iconPopup iconSwitch fas fa-h3 cinzaColor"></i>Estilo do T\xEDtulo 3:</label>
                    </td>
                    <td>
                        <select id="listStyle3" style="width: 350px;">
                            ${optionsStyles}
                        </select>
                    </td>
                </tr>
            </table>
        </div>
    `);
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = q("#dialogBoxPro").html(htmlBox).dialog({
      title: "Inserir sum\xE1rio",
      width: 650,
      height: 250,
      open: function() {
        initChosenReplace("box_init", this, true);
      },
      buttons: [{
        text: "Inserir",
        class: "confirm ui-state-active",
        click: function(event) {
          var arrayStylesUser = [];
          var id_style1 = q("#listStyle1").val();
          var id_style2 = q("#listStyle2").val();
          var id_style3 = q("#listStyle3").val();
          if (id_style1 != "") {
            arrayStylesUser.push(id_style1);
          }
          if (id_style2 != "") {
            arrayStylesUser.push(id_style2);
          }
          if (id_style3 != "") {
            arrayStylesUser.push(id_style3);
          }
          if (arrayStylesUser.length) {
            api.insertSumarioDocumento(arrayStylesUser);
            resetDialogBoxPro("dialogBoxPro");
          }
        }
      }]
    });
  }
  function getDialogSumarioDocumento_() {
    var arrayStyles = api.getListStylesDocumento();
    CKEDITOR.dialog.add("SumarioSEI", function(editor) {
      return {
        title: "Inserir sum\xE1rio",
        minWidth: 500,
        minHeight: 80,
        buttons: [CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton],
        onOk: function(event, a, b) {
          var arrayStylesUser = [];
          var id_style1 = this.getContentElement("tab1", "listStyle1").getValue();
          var id_style2 = this.getContentElement("tab1", "listStyle2").getValue();
          var id_style3 = this.getContentElement("tab1", "listStyle3").getValue();
          if (id_style1 != "") {
            arrayStylesUser.push(id_style1);
          }
          if (id_style2 != "") {
            arrayStylesUser.push(id_style2);
          }
          if (id_style3 != "") {
            arrayStylesUser.push(id_style3);
          }
          if (arrayStylesUser.length) {
            api.insertSumarioDocumento(arrayStylesUser);
            event.data.hide = true;
          }
        },
        onShow: function() {
          var arrayStyles2 = api.getListStylesDocumento();
          api.updateSelectDialog(this.getContentElement("tab1", "listStyle1")._.inputId, arrayStyles2);
          api.updateSelectDialog(this.getContentElement("tab1", "listStyle2")._.inputId, arrayStyles2);
          api.updateSelectDialog(this.getContentElement("tab1", "listStyle3")._.inputId, arrayStyles2);
          if (verifyConfigValue("substituiselecao")) api.setChosenInCke();
        },
        contents: [
          {
            id: "tab1",
            label: "Estilo do T\xEDtulo",
            elements: [
              {
                type: "select",
                id: "listStyle1",
                labelLayout: "horizontal",
                label: "Estilo do T\xEDtulo 1 (obrigat\xF3rio)",
                items: arrayStyles,
                "default": ""
              },
              {
                type: "select",
                id: "listStyle2",
                labelLayout: "horizontal",
                label: "Estilo do T\xEDtulo 2",
                items: arrayStyles,
                "default": ""
              },
              {
                type: "select",
                id: "listStyle3",
                labelLayout: "horizontal",
                label: "Estilo do T\xEDtulo 3",
                items: arrayStyles,
                "default": ""
              }
            ]
          }
        ]
      };
    });
  }
  function insertSumarioDocumento(arrayStylesUser) {
    var selectStyles = arrayStylesUser.join(", ");
    var htmlSumario = '<p class="Texto_Alinhado_Esquerda"><strong>SUM\xC1RIO</strong></p>';
    state.iframeEditor.find(selectStyles).each(function(index) {
      var randRef = randomString(16);
      var text = q(this).text().trim();
      htmlSumario += '<p class="Texto_Alinhado_Esquerda"><a href="#bookmark-' + randRef + '">' + q(this).text().trim() + "</a></p>";
      q(this).find("a.seipro-bookmark").remove();
      q(this).prepend('<a class="seipro-bookmark" name="bookmark-' + randRef + '"></a>');
    });
    var select = state.oEditor.getSelection().getStartElement();
    var pElement = q(select.$).closest("p");
    if (pElement.length) {
      state.oEditor.focus();
      state.oEditor.fire("saveSnapshot");
      state.iframeEditor.find(pElement).after(htmlSumario);
      state.oEditor.fire("saveSnapshot");
    }
  }
  api.getSumarioDocumento = getSumarioDocumento;
  api.getListStylesDocumento = getListStylesDocumento;
  api.updateSelectDialog = updateSelectDialog;
  api.getDialogSumarioDocumento = getDialogSumarioDocumento;
  api.getDialogSumarioDocumento_ = getDialogSumarioDocumento_;
  api.insertSumarioDocumento = insertSumarioDocumento;

  // src/features/editor/view/dialogs/qr.js
  var qr_exports = {};
  __export(qr_exports, {
    getDialogQrCode: () => getDialogQrCode,
    getQrCode: () => getQrCode,
    resetOptionsQR: () => resetOptionsQR,
    setQrCode: () => setQrCode,
    toggleOptionsQR: () => toggleOptionsQR,
    updateQrCode: () => updateQrCode
  });
  function getQrCode(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog("QrCodeSEI");
  }
  function getDialogQrCode() {
    var htmlQrCodeLab = '<div id="qrCodeLab">	<table style="width: 100%;">		<tr><td style="vertical-align: top; text-align: right;" colspan="2"><a id="toggleOptionsQR" data-seipro-action="toggleOptionsQR" class="linkDialog">Op\xE7\xF5es avan\xE7adas </a></td></tr>		<tr><td style="vertical-align: top;">		<div id="optionsQrAdvanced" style="display:none">			<table>			<tr><td>				<label for="QrPro-size">Tamanho do QR: 140px</label><input id="QrPro-size" type="range" value="140" min="100" max="500" step="50">			</td><td>				<label for="QrPro-fill">Cor de Preenchimento</label><input id="QrPro-fill" type="color" value="#333333">			</td><td>				<label for="QrPro-background">Cor de Fundo</label><input id="QrPro-background" type="color" value="#ffffff">				<span style="display: inline-flex;margin-left: 20px;"><input id="QrPro-background-transparent" type="checkbox" style="margin: 0 5px;"> Transparente</span>			</td></tr><tr><td>				<label for="QrPro-minversion">Vers\xE3o: 7</label><input id="QrPro-minversion" type="range" value="6" min="1" max="10" step="1">			</td><td>				<label for="QrPro-eclevel">N\xEDvel de corre\xE7\xE3o de erros</label><select id="QrPro-eclevel"><option value="L" selected="selected">Baixo (7%)</option><option value="M">M\xE9dio (15%)</option><option value="Q">1/4 (25%)</option><option value="H">Alto (30%)</option></select>			</td><td>				<label for="QrPro-quiet">Margens de folga: 1 m\xF3dulos</label><input id="QrPro-quiet" type="range" value="1" min="0" max="4" step="1">			</td></tr><tr><td>				<label for="QrPro-radius">Raio de canto: 0%</label><input id="QrPro-radius" type="range" value="50" min="0" max="50" step="10">			</td><td>				<label for="QrPro-mode">Modo</label>					<select id="QrPro-mode">						<option value="0" selected="selected">Normal</option>						<option value="1">Etiqueta em faixa</option>						<option value="2">Etiqueta em caixa</option>						<option value="3">Imagem em faixa</option>						<option value="4">Imagem em caixa</option>					</select>			</td></tr><tr class="QrMode-etiqueta QrMode-imagem"><td>				<label for="QrPro-msize">Tamanho da etiqueta: 20%</label><input id="QrPro-msize" type="range" value="20" min="0" max="40" step="1">			</td><td>				<label for="QrPro-mposx">Posi\xE7\xE3o X: 46%</label><input id="QrPro-mposx" type="range" value="50" min="0" max="100" step="1">			</td><td>				<label for="QrPro-mposy">Posi\xE7\xE3o Y: 51%</label><input id="QrPro-mposy" type="range" value="50" min="0" max="100" step="1">			</td></tr><tr class="QrMode-etiqueta"><td>				<label for="QrPro-font">Nome da fonte</label><select id="QrPro-font"><option value="Arial" selected="selected">Arial</option><option value="Helvetica">Helvetica</option><option value="Times">Times</option><option value="Times New Roman">Times New Roman</option><option value="Courier">Courier</option><option value="Courier New">Courier New</option><option value="Verdana">Verdana</option><option value="Tahoma">Tahoma</option><option value="Impact">Impact</option></select>			</td><td>				<label for="QrPro-fontcolor">Cor da fonte</label><input id="QrPro-fontcolor" type="color" value="#ff9818">			</td><td>				<label for="QrPro-label" class="QrMode-e">Etiqueta</label><input id="QrPro-label" type="text" value="' + NAMESPACE_SPRO + '">			</td></tr>			<tr class="QrMode-imagem"><td colspan="2">				<label for="QrPro-image">Imagem</label><input id="QrPro-image" type="file">				<img id="QrPro-img-buffer" style="display:none" src="' + (typeof iconSeiPro !== "undefined" && iconSeiPro ? iconSeiPro : (typeof URL_SPRO !== "undefined" ? URL_SPRO : "") + "icons/menu/seipro.png") + '">			</td><tr><td>				<a data-seipro-action="resetOptionsQR" class="linkDialog" style="margin-top: 20px; display: block;">Resetar configura\xE7\xF5es</a>			</td></tr>			</table>		</div>	</td><td>		<div id="qrCodeResult" style="text-align: center; margin: 20px 0; min-width: 180px;"></div>	</td></tr>	</table></div>';
    CKEDITOR.dialog.add("QrCodeSEI", function(editor) {
      return {
        title: "Gerar C\xF3digo QR",
        minWidth: 500,
        minHeight: 100,
        buttons: [CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton],
        onOk: function(event, a, b) {
          var regex = /^[0-9A-Za-z\-]+$/;
          var qrCode_input = this.getContentElement("tab1", "qrCodeText").getValue();
          if (qrCode_input != "") {
            api.setQrCode(qrCode_input);
            event.data.hide = true;
          }
        },
        onShow: function() {
          var selectTxt = state.oEditor.getSelection().getSelectedText();
          var qrCode_input = this.getContentElement("tab1", "qrCodeText")._.inputId;
          setTimeout(function() {
            q("#qrCodeResult").html("");
            if (selectTxt != "") {
              q(".cke_dialog #" + qrCode_input).val(selectTxt);
              api.updateQrCode();
            }
            q(".cke_dialog #" + qrCode_input).unbind("change").on("input change", function() {
              api.updateQrCode();
            });
            q("#optionsQrAdvanced input, #optionsQrAdvanced textarea, #optionsQrAdvanced select").on("input change", function() {
              api.updateQrCode();
            });
            q("#QrPro-image").on("change", function() {
              var input = q("#QrPro-image")[0];
              if (input.files && input.files[0]) {
                var global = global || window;
                const reader = new global.FileReader();
                reader.onload = (event) => {
                  q("#QrPro-img-buffer").attr("src", event.target.result);
                  q("#QrPro-mode").val("4");
                  setTimeout(api.updateQrCode(), 1e3);
                };
                reader.readAsDataURL(input.files[0]);
              }
            });
          }, 100);
          if (verifyConfigValue("substituiselecao")) api.setChosenInCke();
        },
        contents: [
          {
            id: "tab1",
            label: "Gerar C\xF3digo QR",
            elements: [
              {
                type: "text",
                id: "qrCodeText",
                label: "Insira o texto que deseja codificar",
                required: true,
                "default": ""
              },
              {
                type: "html",
                html: htmlQrCodeLab
              }
            ]
          }
        ]
      };
    });
  }
  function resetOptionsQR() {
    var QrValues = [
      ["QrPro-size", "140"],
      ["QrPro-fill", "#333333"],
      ["QrPro-background", "#ffffff"],
      ["QrPro-minversion", "6"],
      ["QrPro-eclevel", "L"],
      ["QrPro-quiet", "1"],
      ["QrPro-radius", "50"],
      ["QrPro-mode", "0"],
      ["QrPro-label", NAMESPACE_SPRO],
      ["QrPro-msize", "20"],
      ["QrPro-mposx", "50"],
      ["QrPro-mposy", "50"],
      ["QrPro-fonte", "Arial"],
      ["QrPro-fontcolor", "#ff9818"],
      ["QrPro-image", ""]
    ];
    q.each(QrValues, (idx, pair) => {
      q("#" + pair[0]).val(pair[1]);
    });
    q("#QrPro-img-buffer").attr("src", typeof iconSeiPro !== "undefined" && iconSeiPro ? iconSeiPro : (typeof URL_SPRO !== "undefined" ? URL_SPRO : "") + "icons/menu/seipro.png");
    api.updateQrCode();
  }
  function toggleOptionsQR() {
    var options = q("#optionsQrAdvanced");
    var wasHidden = options.css("display") === "none";
    if (wasHidden) options.show();
    else options.hide();
    var position = CKEDITOR.dialog.getCurrent().getPosition();
    var positionX = wasHidden ? position.x - 150 : position.x + 150;
    CKEDITOR.dialog.getCurrent().move(positionX, position.y);
  }
  function updateQrCode() {
    q("#qrCodeResult").empty();
    q(".QrMode-etiqueta").hide();
    q(".QrMode-imagem").hide();
    var QrValues = [
      ["QrPro-size", "px"],
      ["QrPro-minversion", ""],
      ["QrPro-quiet", " m\xF3dulos"],
      ["QrPro-radius", "%"],
      ["QrPro-msize", "%"],
      ["QrPro-mposx", "%"],
      ["QrPro-mposy", "%"]
    ];
    q.each(QrValues, (idx, pair) => {
      const $label = q('label[for="' + pair[0] + '"]');
      $label.text($label.text().replace(/:.*/, ": " + q("#" + pair[0]).val() + pair[1]));
    });
    var qrCodeTxt = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "qrCodeText").getValue();
    var options = {
      render: "image",
      ecLevel: q("#QrPro-eclevel").val(),
      minVersion: parseInt(q("#QrPro-minversion").val(), 10),
      fill: q("#QrPro-fill").val(),
      background: q("#QrPro-background-transparent").is(":checked") ? null : q("#QrPro-background").val(),
      text: qrCodeTxt,
      size: parseInt(q("#QrPro-size").val(), 10),
      radius: parseInt(q("#QrPro-radius").val(), 10) * 0.01,
      quiet: parseInt(q("#QrPro-quiet").val(), 10),
      mode: parseInt(q("#QrPro-mode").val(), 10),
      mSize: parseInt(q("#QrPro-msize").val(), 10) * 0.01,
      mPosX: parseInt(q("#QrPro-mposx").val(), 10) * 0.01,
      mPosY: parseInt(q("#QrPro-mposy").val(), 10) * 0.01,
      label: q("#QrPro-label").val(),
      fontname: q("#QrPro-font").val(),
      fontcolor: q("#QrPro-fontcolor").val(),
      image: q("#QrPro-img-buffer")[0]
    };
    if (q("#QrPro-mode").val() == 1 || q("#QrPro-mode").val() == 2) {
      q(".QrMode-etiqueta").show();
    } else if (q("#QrPro-mode").val() == 3 || q("#QrPro-mode").val() == 4) {
      q(".QrMode-imagem").show();
    }
    if (qrCodeTxt != "") {
      q("#qrCodeResult").qrcode(options);
    }
  }
  function setQrCode(qrCode_text) {
    var imgBase = q("#qrCodeResult img").attr("src");
    var htmlQrCode = '<img src="' + imgBase + '">';
    state.oEditor.focus();
    state.oEditor.fire("saveSnapshot");
    state.oEditor.insertHtml(htmlQrCode);
    state.oEditor.fire("saveSnapshot");
  }
  api.getQrCode = getQrCode;
  api.getDialogQrCode = getDialogQrCode;
  api.resetOptionsQR = resetOptionsQR;
  api.toggleOptionsQR = toggleOptionsQR;
  api.updateQrCode = updateQrCode;
  api.setQrCode = setQrCode;

  // src/features/editor/view/dialogs/links.js
  var links_exports = {};
  __export(links_exports, {
    copyLinkPro: () => copyLinkPro,
    editLinkPro: () => editLinkPro,
    getDialogBatchImgQuality: () => getDialogBatchImgQuality,
    getDialogLinkPro: () => getDialogLinkPro,
    initDialogUploadImgBase64: () => initDialogUploadImgBase64,
    insertProtocoloOnBox: () => insertProtocoloOnBox,
    insertTextTotLink: () => insertTextTotLink,
    loadResizeImg: () => loadResizeImg,
    openDialogBatchImgQuality: () => openDialogBatchImgQuality,
    openLinkPro: () => openLinkPro,
    removeLinkPro: () => removeLinkPro
  });
  function loadResizeImg() {
    q(state.txaEditor).each(function(index) {
      var idEditor_ = q(this).attr("id").replace("cke_", "");
      var iframe_ = q('iframe[title*="' + idEditor_ + '"]').contents();
      if (iframe_.find("body").attr("contenteditable") == "true") {
        var oEditor_ = CKEDITOR.instances[idEditor_];
        initResizeImg(oEditor_);
        loadCSSResize(iframe_);
      }
    });
  }
  function insertTextTotLink(idEditor2) {
    var selectTxt = state.oEditor.getSelection().getSelectedText();
    if (isValidHttpUrl(selectTxt)) {
      var link = '<a href="' + selectTxt + '" target="_blank">' + selectTxt + "</a>";
      CKEDITOR.dialog.getCurrent().hide();
      state.oEditor.insertHtml(link);
    } else {
      setTimeout(function() {
        if (typeof selectTxt !== "undefined" && selectTxt != "") {
          CKEDITOR.dialog.getCurrent().getContentElement("general", "contents").setValue(selectTxt);
        }
      }, 100);
    }
  }
  function insertProtocoloOnBox(idEditor2) {
    var selectTxt = state.oEditor.getSelection().getSelectedText();
    setTimeout(function() {
      if (typeof selectTxt !== "undefined" && selectTxt != "") {
        CKEDITOR.dialog.getCurrent().getContentElement("general", "protocolo").setValue(selectTxt);
        document.getElementById(CKEDITOR.dialog.getCurrent().getButton("ok").domId).click();
      }
    }, 100);
  }
  function openLinkPro(linkRef, idEditor2) {
    var url = state.iframeEditor.find('a[data-reflinkpro="' + linkRef + '"]').attr("href");
    var win = window.open(url, "_blank");
    if (win) {
      win.focus();
    } else {
      alertaBoxPro("Error", "exclamation-triangle", "Por favor, permita popups para essa p\xE1gina");
    }
  }
  function removeLinkPro(linkRef, idEditor2) {
    if (iframeEditor.find('a[data-reflinkpro="' + linkRef + '"]').closest("span").attr("contenteditable") == "false") {
      state.iframeEditor.find('a[data-reflinkpro="' + linkRef + '"]').closest("span").removeAttr("contenteditable");
    }
    state.iframeEditor.find('a[data-reflinkpro="' + linkRef + '"]').after(state.iframeEditor.find('a[data-reflinkpro="' + linkRef + '"]').html()).remove();
    state.iframeEditor.find(".linkDisplayPro").remove();
  }
  function copyLinkPro(linkRef, idEditor2) {
    var el = state.iframeEditor.find('a[data-reflinkpro="' + linkRef + '"]');
    var url = el.attr("href");
    copyToClipboard(url);
    el.find(".info").text("Link copiado!").show();
    setTimeout(function() {
      el.find(".info").text("").hide();
    }, 2e3);
  }
  function editLinkPro(idEditor2) {
    state.oEditor.openDialog("editLinkPro");
  }
  function getDialogLinkPro() {
    CKEDITOR.dialog.add("editLinkPro", function(editor) {
      return {
        title: "Editar link",
        minWidth: 400,
        minHeight: 80,
        buttons: [CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton],
        onOk: function(event, a, b) {
          var urlLink = this.getContentElement("tab1", "urlLink").getValue();
          var nomeLink = this.getContentElement("tab1", "nomeLink").getValue();
          if (urlLink != "") {
            nomeLink = nomeLink == "" ? urlLink : nomeLink;
            var select = state.oEditor.getSelection().getStartElement();
            var aElement = q(select.$);
            var linkRef = q("#refLinkProForm").val();
            state.iframeEditor.find('a[data-reflinkpro="' + linkRef + '"]').attr("href", urlLink).attr("data-cke-saved-href", urlLink).text(nomeLink);
            event.data.hide = true;
          } else {
            alertaBoxPro("Error", "exclamation-triangle", "Digite um link");
            event.data.hide = false;
          }
        },
        onShow: function() {
          var select = state.oEditor.getSelection().getStartElement();
          var aElement = q(select.$);
          var linkRef = aElement.attr("data-reflinkpro");
          var idInputUrl = this.getContentElement("tab1", "urlLink")._.inputId;
          var idInputNome = this.getContentElement("tab1", "nomeLink")._.inputId;
          if (aElement.length) {
            setTimeout(function() {
              q(".cke_dialog #" + idInputUrl).val(aElement.attr("href"));
              q(".cke_dialog #" + idInputNome).val(aElement.text()).after('<input style="display:none" type="hidden" value="' + linkRef + '" id="refLinkProForm">');
            }, 500);
          }
        },
        contents: [
          {
            id: "tab1",
            label: "Editar link",
            elements: [
              {
                type: "text",
                id: "nomeLink",
                label: "Texto vis\xEDvel",
                "default": ""
              },
              {
                type: "text",
                id: "urlLink",
                label: "URL",
                required: true,
                "default": ""
              }
            ]
          }
        ]
      };
    });
  }
  function openDialogBatchImgQuality(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog("batchImgQuality");
  }
  function getDialogBatchImgQuality() {
    CKEDITOR.dialog.add("batchImgQuality", function(editor) {
      return {
        title: "Reduzir qualidade das imagens",
        minWidth: 400,
        minHeight: 80,
        buttons: [CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton],
        onOk: function(event, a, b) {
          var qualityImg = this.getContentElement("tab1", "quality").getValue();
          if (qualityImg != "") {
            state.iframeEditor.find("img").each(function() {
              api.qualityImages(this, this, qualityImg * 0.01);
            });
            event.data.hide = true;
          } else {
            alertaBoxPro("Error", "exclamation-triangle", "Digite um valor");
            event.data.hide = false;
          }
        },
        onShow: function() {
          this.getContentElement("tab1", "quality").getInputElement().setAttribute("type", "range").setAttribute("max", "100").setAttribute("min", "1");
        },
        contents: [
          {
            id: "tab1",
            label: "Qualidade",
            elements: [
              {
                type: "text",
                id: "quality",
                label: "Qualidade da Imagem",
                "default": state.qualidadeImagens
              }
            ]
          }
        ]
      };
    });
  }
  function initDialogUploadImgBase64() {
    if (checkConfigValue("editarimagens")) {
      api.getDialogUploadImgBase64();
    }
  }
  api.loadResizeImg = loadResizeImg;
  api.insertTextTotLink = insertTextTotLink;
  api.insertProtocoloOnBox = insertProtocoloOnBox;
  api.openLinkPro = openLinkPro;
  api.removeLinkPro = removeLinkPro;
  api.copyLinkPro = copyLinkPro;
  api.editLinkPro = editLinkPro;
  api.getDialogLinkPro = getDialogLinkPro;
  api.openDialogBatchImgQuality = openDialogBatchImgQuality;
  api.getDialogBatchImgQuality = getDialogBatchImgQuality;
  api.initDialogUploadImgBase64 = initDialogUploadImgBase64;

  // src/features/editor/view/dialogs/images-upload.js
  var images_upload_exports = {};
  __export(images_upload_exports, {
    getDialogUploadImgBase64: () => getDialogUploadImgBase64,
    openDialogUploadImgBase64: () => openDialogUploadImgBase64
  });
  function openDialogUploadImgBase64(oEditor2) {
    state.oEditor.openDialog("base64imageDialog");
  }
  function getDialogUploadImgBase64() {
    CKEDITOR.dialog.add("base64imageDialog", function(editor) {
      var t = null, selectedImg = null, orgWidth = null, orgHeight = null, imgPreview = null, imgLoading = null, urlCB = null, urlI = null, fileCB = null, imgScal = 1, lock = true;
      function fileSupport() {
        var r = false, n = null;
        try {
          if (FileReader) {
            var n = document.createElement("input");
            if (n && "files" in n) r = true;
          }
        } catch (e) {
          r = false;
        }
        n = null;
        return r;
      }
      var fsupport = fileSupport();
      function imagePreviewLoad(s) {
        if (typeof s != "string" || !s) {
          imgLoading.getElement().setHtml("");
          return;
        }
        var i = new Image();
        imgLoading.getElement().setHtml("Carregando...");
        i.onload = function() {
          imgLoading.getElement().setHtml("");
          if (orgWidth == null || orgHeight == null) {
            if (!q(this).attr("data-width")) t.setValueOf("tab-properties", "width", this.width);
            if (!q(this).attr("data-height")) t.setValueOf("tab-properties", "height", this.height);
            imgScal = 1;
            if (this.height > 0 && this.width > 0) imgScal = this.width / this.height;
            if (imgScal <= 0) imgScal = 1;
          } else {
            orgWidth = null;
            orgHeight = null;
          }
          this.id = editor.id + "previewimage_" + randomString(4);
          this.setAttribute("class", "previewImage");
          this.setAttribute("alt", "");
          this.setAttribute("style", "cursor:move;max-width:400px;max-height:100px;float:left;margin: 5px;");
          if (!q(this).attr("data-width")) q(this).attr("data-width", this.width);
          if (!q(this).attr("data-height")) q(this).attr("data-height", this.height);
          try {
            var boxPreview = CKEDITOR.dialog.getCurrent().getContentElement("tab-source", "preview").getElement().$;
            var p = imgPreview.getElement().$;
            if (p) {
              p.appendChild(this);
              if (boxPreview) {
                q(boxPreview).sortable({
                  items: "img.previewImage",
                  cursor: "grabbing",
                  start: function(event, ui) {
                    ui.placeholder.height(ui.item.height());
                    ui.placeholder.width(ui.item.width());
                  },
                  forceHelperSize: true,
                  opacity: 0.5
                });
              }
            }
          } catch (e) {
          }
        };
        i.onerror = function() {
          imgLoading.getElement().setHtml("");
        };
        i.onabort = function() {
          imgLoading.getElement().setHtml("");
        };
        i.src = s;
        if (!isBase64(s)) {
          getBase64Image(q(i));
        }
      }
      function loopFileUpload(files, i) {
        var fr = new FileReader();
        fr.onload = /* @__PURE__ */ (function(f) {
          return function(e) {
            imgLoading.getElement().setHtml("");
            imagePreviewLoad(e.target.result);
          };
        })(files[i]);
        fr.onerror = function() {
          imgLoading.getElement().setHtml("");
        };
        fr.onabort = function() {
          imgLoading.getElement().setHtml("");
        };
        try {
          fr.readAsDataURL(files[i]);
        } catch (e) {
        }
      }
      function imagePreview(src) {
        imgLoading.getElement().setHtml("");
        imgPreview.getElement().setHtml("");
        if (src == "base64") {
          if (urlCB) urlCB.setValue(false, true);
          if (fileCB) fileCB.setValue(false, true);
        } else if (src == "url") {
          if (urlCB) urlCB.setValue(true, true);
          if (fileCB) fileCB.setValue(false, true);
          if (urlI) imagePreviewLoad(urlI.getValue());
        } else if (fsupport) {
          if (urlCB) urlCB.setValue(false, true);
          if (fileCB) fileCB.setValue(true, true);
          var fileI = t.getContentElement("tab-source", "file");
          var n = null;
          try {
            n = fileI.getInputElement().$;
          } catch (e) {
            n = null;
          }
          if (n && "files" in n && n.files && n.files.length && n.files[0]) {
            if ("type" in n.files[0] && !n.files[0].type.match("image.*")) return;
            if (!FileReader) return;
            imgLoading.getElement().setHtml("Carregando...");
            for (var i in n.files) {
              loopFileUpload(n.files, i);
            }
          }
        }
      }
      ;
      function getImageDimensions() {
        var o = {
          "w": t.getContentElement("tab-properties", "width").getValue(),
          "h": t.getContentElement("tab-properties", "height").getValue(),
          "uw": "px",
          "uh": "px"
        };
        if (o.w.indexOf("%") >= 0) o.uw = "%";
        if (o.h.indexOf("%") >= 0) o.uh = "%";
        o.w = parseInt(o.w, 10);
        o.h = parseInt(o.h, 10);
        if (isNaN(o.w)) o.w = 0;
        if (isNaN(o.h)) o.h = 0;
        return o;
      }
      function imageDimensions(src) {
        var o = getImageDimensions();
        var u = "px";
        if (src == "width") {
          if (o.uw == "%") u = "%";
          o.h = Math.round(o.w / imgScal);
        } else {
          if (o.uh == "%") u = "%";
          o.w = Math.round(o.h * imgScal);
        }
        if (u == "%") {
          o.w += "%";
          o.h += "%";
        }
        t.getContentElement("tab-properties", "width").setValue(o.w), t.getContentElement("tab-properties", "height").setValue(o.h);
      }
      function integerValue(elem) {
        var v = elem.getValue(), u = "";
        if (v.indexOf("%") >= 0) u = "%";
        v = parseInt(v, 10);
        if (isNaN(v)) v = 0;
        elem.setValue(v + u);
      }
      function addImgOnEditor(img) {
        var src = q(img).attr("src");
        var data = q(img).data();
        var quality = t.getValueOf("tab-properties", "quality");
        quality = quality != "" ? parseInt(quality) * 0.01 : state.qualidadeImagens * 0.01;
        quality = quality > 100 ? 100 : quality;
        quality = quality < 0 ? 0 : quality;
        if (typeof src != "string" || src == null || src === "") return;
        if (selectedImg) var newImg = selectedImg;
        else var newImg = editor.document.createElement("img");
        newImg.setAttribute("src", src);
        src = null;
        newImg.setAttribute("alt", t.getValueOf("tab-properties", "alt").replace(/^\s+/, "").replace(/\s+$/, ""));
        var attr = {
          "width": ["width", "width:#;", "integer", 1],
          "height": ["height", "height:#;", "integer", 1],
          "maxwidth": ["maxwidth", "max-width:#;object-fit: contain;", "integer", 1],
          "maxheight": ["maxheight", "max-height:#;object-fit: contain;", "integer", 1],
          "vmargin": ["vspace", "margin-top:#;margin-bottom:#;", "integer", 0],
          "hmargin": ["hspace", "margin-left:#;margin-right:#;", "integer", 0],
          "align": ["align", ""],
          "filter": ["filter", ""],
          "border": ["border", "border:# solid black;", "integer", 0]
        }, css = [], value, cssvalue, attrvalue, k;
        for (k in attr) {
          value = t.getValueOf("tab-properties", k);
          attrvalue = value;
          cssvalue = value;
          unit = "px";
          if (k == "align") {
            switch (value) {
              case "top":
              case "bottom":
                attr[k][1] = "vertical-align:#;";
                break;
              case "left":
              case "right":
                attr[k][1] = "float:#;";
                break;
              default:
                value = null;
                break;
            }
          } else if (k == "filter") {
            switch (value) {
              case "grayscale":
                attr[k][1] = "filter:grayscale(1);";
                break;
              case "blur":
                attr[k][1] = "filter:blur(3px);";
                break;
              case "shadow":
                attr[k][1] = "filter:drop-shadow(2px 4px 6px black);";
                break;
              case "invert":
                attr[k][1] = "filter:invert(1);";
                break;
              case "sepia":
                attr[k][1] = "filter:sepia(1);";
                break;
              default:
                value = null;
                break;
            }
          }
          if (attr[k][2] == "integer") {
            if (value.indexOf("%") >= 0) unit = "%";
            value = parseInt(value, 10);
            if (isNaN(value)) value = null;
            else if (value < attr[k][3]) value = null;
            if (value != null) {
              if (unit == "%") {
                attrvalue = value + "%";
                cssvalue = value + "%";
              } else {
                attrvalue = value;
                cssvalue = value + "px";
              }
            }
          }
          if (value != null) {
            if (k == "width" && typeof data !== "undefined" && data.width && !selectedImg) {
              newImg.setAttribute("width", data.width);
            } else if (k == "height" && typeof data !== "undefined" && data.height && !selectedImg) {
              newImg.setAttribute("height", data.height);
            } else {
              newImg.setAttribute(attr[k][0], attrvalue);
              css.push(attr[k][1].replace(/#/g, cssvalue));
            }
          }
          if (attrvalue == "none") {
            newImg.removeAttribute(k);
          }
        }
        if (css.length) newImg.setAttribute("style", css.join(""));
        if (newImg.getAttribute("maxwidth")) {
          newImg.removeAttribute("height");
        }
        if (newImg.getAttribute("maxheight")) {
          newImg.removeAttribute("width");
        }
        if (!selectedImg) editor.insertElement(newImg);
        if (state.qualidadeImagens > 0) {
          newImg.setAttribute("quality", quality);
          api.qualityImages(newImg.$, newImg.$, quality);
        }
        if (editor.plugins.imageresize) editor.plugins.imageresize.resize(editor, newImg, 800, 800);
      }
      if (fsupport) {
        var sourceElements = [
          {
            type: "vbox",
            widths: ["70px"],
            children: [
              {
                type: "checkbox",
                id: "filecheckbox",
                style: "margin-top:5px",
                label: "Navegar neste computador:"
              },
              {
                type: "file",
                id: "file",
                label: "",
                onChange: function() {
                  imagePreview("file");
                }
              }
            ]
          },
          {
            type: "vbox",
            widths: ["70px"],
            children: [
              {
                type: "checkbox",
                id: "urlcheckbox",
                style: "margin-top:5px",
                label: "URL da Imagem:"
              },
              {
                type: "text",
                id: "url",
                label: "",
                onChange: function() {
                  imagePreview("url");
                }
              }
            ]
          },
          {
            type: "html",
            id: "loading",
            html: new CKEDITOR.template('<div style="text-align:center;"></div>').output()
          },
          {
            type: "html",
            id: "preview",
            html: new CKEDITOR.template('<div class="dropFilePro" style="text-align:center;max-width: 700px;"></div>').output()
          }
        ];
      } else {
        var sourceElements = [
          {
            type: "text",
            id: "url",
            label: "URL da Imagem:",
            onChange: function() {
              imagePreview("url");
            }
          },
          {
            type: "html",
            id: "loading",
            html: new CKEDITOR.template('<div style="text-align:center;"></div>').output()
          },
          {
            type: "html",
            id: "preview",
            html: new CKEDITOR.template('<div class="dropFilePro" style="text-align:center;max-width: 700px;"></div>').output()
          }
        ];
      }
      return {
        title: editor.lang.common.image,
        minWidth: 750,
        minHeight: 180,
        onLoad: function() {
          if (fsupport) {
            urlCB = this.getContentElement("tab-source", "urlcheckbox");
            fileCB = this.getContentElement("tab-source", "filecheckbox");
            urlCB.getInputElement().on("click", function() {
              imagePreview("url");
            });
            fileCB.getInputElement().on("click", function() {
              imagePreview("file");
            });
          }
          urlI = this.getContentElement("tab-source", "url");
          imgLoading = this.getContentElement("tab-source", "loading");
          imgPreview = this.getContentElement("tab-source", "preview");
          this.getContentElement("tab-properties", "lock").getInputElement().on("click", function() {
            if (this.getValue()) lock = true;
            else lock = false;
            if (lock) imageDimensions("width");
          }, this.getContentElement("tab-properties", "lock"));
          this.getContentElement("tab-properties", "width").getInputElement().on("keyup", function() {
            if (lock) imageDimensions("width");
          });
          this.getContentElement("tab-properties", "height").getInputElement().on("keyup", function() {
            if (lock) imageDimensions("height");
          });
          this.getContentElement("tab-properties", "vmargin").getInputElement().on("keyup", function() {
            integerValue(this);
          }, this.getContentElement("tab-properties", "vmargin"));
          this.getContentElement("tab-properties", "hmargin").getInputElement().on("keyup", function() {
            integerValue(this);
          }, this.getContentElement("tab-properties", "hmargin"));
          this.getContentElement("tab-properties", "border").getInputElement().on("keyup", function() {
            integerValue(this);
          }, this.getContentElement("tab-properties", "border"));
          this.getContentElement("tab-properties", "maxwidth").getInputElement().on("keyup", function() {
            integerValue(this);
          }, this.getContentElement("tab-properties", "maxwidth"));
          this.getContentElement("tab-properties", "maxheight").getInputElement().on("keyup", function() {
            integerValue(this);
          }, this.getContentElement("tab-properties", "maxheight"));
          this.getContentElement("tab-properties", "quality").getInputElement().setAttribute("type", "number").setAttribute("max", "100").setAttribute("min", "1");
          checkLoadJqueryUI();
        },
        onShow: function() {
          fileElem = this.getContentElement("tab-source", "file").getElement().$;
          if (fileElem) {
            q(fileElem).css("height", "90px").find("iframe").css("height", "90px").contents().find("head").append('<style type="text/css" data-style="seipro">input[type="file"]:before { content: "Arraste arquivos para c\xE1 ou clique em "; }</style>').end().find('input[type="file"]').prop("multiple", "multiple").css({
              "width": "100%",
              "display": "block",
              "background": "#f2f2f2",
              "padding": "30px 10px 30px 40px",
              "border-radius": "10px",
              "font-size": "13pt",
              "color": "#999",
              "filter": state.isDarkMode ? "invert(1) brightness(1.5)" : "none",
              "border": "1px dashed #ccc"
            });
          }
          imgLoading.getElement().setHtml("");
          imgPreview.getElement().setHtml("");
          t = this, orgWidth = null, orgHeight = null, imgScal = 1, lock = true;
          selectedImg = editor.getSelection().getSelectedElement();
          if (selectedImg && selectedImg.getName() == "img") {
            if (typeof selectedImg.getAttribute("src") == "string") {
              var srcSelectedImg = selectedImg.getAttribute("src");
              var base64strImg = srcSelectedImg.substring(srcSelectedImg.indexOf(",") + 1);
              var decoded = atob(base64strImg);
              console.log("FileSize: " + decoded.length);
              this.getContentElement("tab-properties", "imglength").getElement().setHtml("Tamanho da imagem: <br>" + infraFormatarTamanhoBytes(decoded.length));
            }
          }
          if (!selectedImg || selectedImg.getName() !== "img") {
            selectedImg = null;
            this.getContentElement("tab-properties", "imglength").getElement().setHtml("");
          }
          t.setValueOf("tab-properties", "lock", lock);
          t.setValueOf("tab-properties", "vmargin", "0");
          t.setValueOf("tab-properties", "hmargin", "0");
          t.setValueOf("tab-properties", "border", "0");
          t.setValueOf("tab-properties", "maxwidth", "0");
          t.setValueOf("tab-properties", "maxheight", "0");
          t.setValueOf("tab-properties", "quality", state.qualidadeImagens);
          t.setValueOf("tab-properties", "align", "none");
          t.setValueOf("tab-properties", "filter", "none");
          if (selectedImg) {
            if (typeof selectedImg.getAttribute("width") == "string") orgWidth = selectedImg.getAttribute("width");
            if (typeof selectedImg.getAttribute("height") == "string") orgHeight = selectedImg.getAttribute("height");
            if ((orgWidth == null || orgHeight == null) && selectedImg.$) {
              orgWidth = selectedImg.$.width;
              orgHeight = selectedImg.$.height;
            }
            if (orgWidth != null && orgHeight != null) {
              t.setValueOf("tab-properties", "width", orgWidth);
              t.setValueOf("tab-properties", "height", orgHeight);
              orgWidth = parseInt(orgWidth, 10);
              orgHeight = parseInt(orgHeight, 10);
              imgScal = 1;
              if (!isNaN(orgWidth) && !isNaN(orgHeight) && orgHeight > 0 && orgWidth > 0) imgScal = orgWidth / orgHeight;
              if (imgScal <= 0) imgScal = 1;
            }
            if (typeof selectedImg.getAttribute("src") == "string") {
              if (selectedImg.getAttribute("src").indexOf("data:") === 0) {
                imagePreview("base64");
                imagePreviewLoad(selectedImg.getAttribute("src"));
              } else {
                t.setValueOf("tab-source", "url", selectedImg.getAttribute("src"));
              }
            }
            if (typeof selectedImg.getAttribute("alt") == "string") t.setValueOf("tab-properties", "alt", selectedImg.getAttribute("alt"));
            if (typeof selectedImg.getAttribute("hspace") == "string") t.setValueOf("tab-properties", "hmargin", selectedImg.getAttribute("hspace"));
            if (typeof selectedImg.getAttribute("vspace") == "string") t.setValueOf("tab-properties", "vmargin", selectedImg.getAttribute("vspace"));
            if (typeof selectedImg.getAttribute("border") == "string") t.setValueOf("tab-properties", "border", selectedImg.getAttribute("border"));
            if (typeof selectedImg.getAttribute("maxwidth") == "string") t.setValueOf("tab-properties", "maxwidth", selectedImg.getAttribute("maxwidth"));
            if (typeof selectedImg.getAttribute("maxheight") == "string") t.setValueOf("tab-properties", "maxheight", selectedImg.getAttribute("maxheight"));
            if (typeof selectedImg.getAttribute("filter") == "string") t.setValueOf("tab-properties", "filter", selectedImg.getAttribute("filter"));
            if (typeof selectedImg.getAttribute("quality") == "string") {
              var qualitySelectedImg = parseInt(selectedImg.getAttribute("quality") * 100);
              t.setValueOf("tab-properties", "quality", qualitySelectedImg);
              t.getContentElement("tab-properties", "quality").getInputElement().setAttribute("type", "number").setAttribute("max", qualitySelectedImg).setAttribute("min", "1");
            }
            if (typeof selectedImg.getAttribute("align") == "string") {
              switch (selectedImg.getAttribute("align")) {
                case "top":
                case "text-top":
                  t.setValueOf("tab-properties", "align", "top");
                  break;
                case "baseline":
                case "bottom":
                case "text-bottom":
                  t.setValueOf("tab-properties", "align", "bottom");
                  break;
                case "left":
                  t.setValueOf("tab-properties", "align", "left");
                  break;
                case "right":
                  t.setValueOf("tab-properties", "align", "right");
                  break;
              }
            }
            t.selectPage("tab-properties");
          }
        },
        onOk: function() {
          var imgs = CKEDITOR.document.getElementsByTag("img").$;
          if (typeof imgs !== "undefined" && imgs.length) {
            q.each(imgs, function(i, img) {
              var src = q(img).attr("src");
              if (!isValidHttpUrl(src)) {
                addImgOnEditor(img);
              }
            });
          }
        },
        /* Dialog form */
        contents: [
          {
            id: "tab-source",
            label: editor.lang.common.generalTab,
            elements: sourceElements
          },
          {
            id: "tab-properties",
            label: editor.lang.common.advancedTab,
            elements: [
              {
                type: "text",
                id: "alt",
                label: "Texto Alternativo"
              },
              {
                type: "hbox",
                widths: ["30%", "30%", "40%"],
                children: [
                  {
                    type: "text",
                    width: "80px",
                    id: "width",
                    label: editor.lang.common.width
                  },
                  {
                    type: "text",
                    width: "80px",
                    id: "height",
                    label: editor.lang.common.height
                  },
                  {
                    type: "checkbox",
                    id: "lock",
                    label: "Travar Propor\xE7\xF5es",
                    style: "margin-top:18px;"
                  }
                ]
              },
              {
                type: "hbox",
                widths: ["30%", "30%", "40%"],
                style: "margin-top:10px;",
                children: [
                  {
                    type: "text",
                    width: "80px",
                    id: "vmargin",
                    label: "Margem Vertical"
                  },
                  {
                    type: "text",
                    width: "80px",
                    id: "hmargin",
                    label: "Margem Horizontal"
                  },
                  {
                    type: "text",
                    width: "80px",
                    id: "border",
                    label: "Borda"
                  }
                ]
              },
              {
                type: "hbox",
                widths: ["30%", "30%", "40%"],
                children: [
                  {
                    type: "text",
                    width: "80px",
                    id: "maxwidth",
                    label: "Largura M\xE1xima"
                  },
                  {
                    type: "text",
                    width: "80px",
                    id: "maxheight",
                    label: "Altura M\xE1xima"
                  },
                  {
                    type: "select",
                    id: "align",
                    label: editor.lang.common.align,
                    items: [
                      [editor.lang.common.notSet, "none"],
                      [editor.lang.common.alignTop, "top"],
                      [editor.lang.common.alignBottom, "bottom"],
                      [editor.lang.common.alignLeft, "left"],
                      [editor.lang.common.alignRight, "right"]
                    ]
                  }
                ]
              },
              {
                type: "hbox",
                widths: ["30%", "30%", "40%"],
                children: [
                  {
                    type: "text",
                    width: "80px",
                    id: "quality",
                    label: "Qualidade da Imagem (1 = baixa / 100 = alta)"
                  },
                  {
                    type: "select",
                    id: "filter",
                    label: "Filtro",
                    items: [
                      [editor.lang.common.notSet, "none"],
                      ["Escala de Cinza", "grayscale"],
                      ["Borrado", "blur"],
                      ["Caixa Sombreada", "shadow"],
                      ["Cores Invertidas", "invert"],
                      ["Envelhecido", "sepia"]
                    ]
                  },
                  {
                    type: "html",
                    id: "imglength",
                    html: new CKEDITOR.template('<div style="text-align:left;"></div>').output()
                  }
                ]
              }
            ]
          }
        ]
      };
    });
  }
  api.openDialogUploadImgBase64 = openDialogUploadImgBase64;
  api.getDialogUploadImgBase64 = getDialogUploadImgBase64;

  // src/features/editor/view/dialogs/images-editor.js
  var images_editor_exports = {};
  __export(images_editor_exports, {
    getDialogImageEditorPro: () => getDialogImageEditorPro,
    getDialogPageImageBackground: () => getDialogPageImageBackground,
    getImagePageBackground: () => getImagePageBackground,
    getImagemBgOnEditor: () => getImagemBgOnEditor,
    getPreviewImagePageBackground: () => getPreviewImagePageBackground,
    hideLinkTips: () => hideLinkTips,
    initDialogImageEditorPro: () => initDialogImageEditorPro,
    loadImagePageBackground: () => loadImagePageBackground,
    openImageEditorPro: () => openImageEditorPro,
    pageImageBackground: () => pageImageBackground,
    resetOptionsImgBg: () => resetOptionsImgBg,
    showLinkTips: () => showLinkTips,
    templateImagePageBackground: () => templateImagePageBackground
  });

  // src/shared/ui/image-crop.js
  function openImageCrop({ src, onSave, onCancel } = {}) {
    if (!src) throw new TypeError("Image source is required");
    const overlay = document.createElement("div");
    overlay.className = "seipro-crop-overlay";
    overlay.style.cssText = "position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);";
    const dialog = document.createElement("section");
    dialog.className = "seipro-crop-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-label", "Crop image");
    dialog.style.cssText = "width:min(900px,95vw);max-height:95vh;overflow:auto;padding:16px;border-radius:8px;background:#fff;";
    const canvas = document.createElement("canvas");
    canvas.className = "seipro-crop-canvas";
    canvas.style.cssText = "display:block;max-width:100%;max-height:55vh;margin:0 auto 12px;background:#eee;";
    const controls = document.createElement("div");
    controls.className = "seipro-crop-controls";
    controls.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;";
    const x = numberControl("X", "seipro-crop-x", 0, 0);
    const y = numberControl("Y", "seipro-crop-y", 0, 0);
    const cropWidth = numberControl("Crop width", "seipro-crop-width", 1, 1);
    const cropHeight = numberControl("Crop height", "seipro-crop-height", 1, 1);
    const outputWidth = numberControl("Output width", "seipro-crop-output-width", 1, 1);
    const outputHeight = numberControl("Output height", "seipro-crop-output-height", 1, 1);
    const rotation = numberControl("Rotation", "seipro-crop-rotation", 0, -180, 180);
    const quality = numberControl("Quality", "seipro-crop-quality", 0.9, 0.1, 1, 0.05);
    const format = selectControl("Format", "seipro-crop-format", [
      ["image/jpeg", "JPEG"],
      ["image/png", "PNG"],
      ["image/webp", "WebP"]
    ]);
    [
      x,
      y,
      cropWidth,
      cropHeight,
      outputWidth,
      outputHeight,
      rotation,
      quality,
      format
    ].forEach(function(control) {
      controls.appendChild(control.label);
    });
    const status = document.createElement("p");
    status.className = "seipro-crop-status";
    status.setAttribute("aria-live", "polite");
    const actions = document.createElement("div");
    actions.className = "seipro-crop-actions";
    actions.style.cssText = "display:flex;justify-content:flex-end;gap:8px;margin-top:12px;";
    const cancelButton = button("Cancel", "seipro-crop-cancel");
    const saveButton = button("Save", "seipro-crop-save");
    saveButton.disabled = true;
    actions.append(cancelButton, saveButton);
    dialog.append(canvas, controls, status, actions);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    const image = new Image();
    let loaded = false;
    function values() {
      const sourceWidth = image.naturalWidth || image.width;
      const sourceHeight = image.naturalHeight || image.height;
      const sx = clamp(numberValue(x.input), 0, Math.max(0, sourceWidth - 1));
      const sy = clamp(numberValue(y.input), 0, Math.max(0, sourceHeight - 1));
      const sw = clamp(numberValue(cropWidth.input), 1, Math.max(1, sourceWidth - sx));
      const sh = clamp(numberValue(cropHeight.input), 1, Math.max(1, sourceHeight - sy));
      return {
        x: sx,
        y: sy,
        width: sw,
        height: sh,
        outputWidth: Math.max(1, Math.round(numberValue(outputWidth.input))),
        outputHeight: Math.max(1, Math.round(numberValue(outputHeight.input))),
        rotation: numberValue(rotation.input),
        quality: clamp(numberValue(quality.input), 0.1, 1),
        type: format.input.value
      };
    }
    function render() {
      if (!loaded) return;
      const options = values();
      canvas.width = options.outputWidth;
      canvas.height = options.outputHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        status.textContent = "Canvas is unavailable.";
        return;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(options.rotation * Math.PI / 180);
      const radians = Math.abs(options.rotation * Math.PI / 180);
      const boundsWidth = Math.abs(options.width * Math.cos(radians)) + Math.abs(options.height * Math.sin(radians));
      const boundsHeight = Math.abs(options.width * Math.sin(radians)) + Math.abs(options.height * Math.cos(radians));
      const scale = Math.min(canvas.width / boundsWidth, canvas.height / boundsHeight);
      context.drawImage(
        image,
        options.x,
        options.y,
        options.width,
        options.height,
        -options.width * scale / 2,
        -options.height * scale / 2,
        options.width * scale,
        options.height * scale
      );
      context.restore();
      status.textContent = `${options.outputWidth} \xD7 ${options.outputHeight}`;
    }
    function close() {
      overlay.remove();
    }
    function cancel() {
      if (typeof onCancel === "function") onCancel(api2);
      close();
    }
    function save() {
      if (!loaded) return null;
      render();
      try {
        const options = values();
        const dataUrl = canvas.toDataURL(options.type, options.quality);
        if (typeof onSave === "function") onSave(dataUrl, options);
        close();
        return dataUrl;
      } catch (error) {
        status.textContent = `Unable to export image: ${error.message}`;
        return null;
      }
    }
    const api2 = { el: overlay, canvas, close, save, render };
    controls.addEventListener("input", render);
    cancelButton.addEventListener("click", cancel);
    saveButton.addEventListener("click", save);
    overlay.addEventListener("click", function(event) {
      if (event.target === overlay) cancel();
    });
    image.addEventListener("load", function() {
      loaded = true;
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;
      cropWidth.input.value = String(width);
      cropHeight.input.value = String(height);
      outputWidth.input.value = String(width);
      outputHeight.input.value = String(height);
      x.input.max = String(Math.max(0, width - 1));
      y.input.max = String(Math.max(0, height - 1));
      cropWidth.input.max = String(width);
      cropHeight.input.max = String(height);
      saveButton.disabled = false;
      render();
    });
    image.addEventListener("error", function() {
      status.textContent = "Unable to load image.";
    });
    if (/^https?:/i.test(src)) image.crossOrigin = "anonymous";
    image.src = src;
    return api2;
  }
  function numberControl(text, className, value, min, max, step = 1) {
    const label = document.createElement("label");
    label.className = `seipro-crop-field ${className}-field`;
    label.textContent = text;
    const input = document.createElement("input");
    input.className = className;
    input.type = "number";
    input.value = String(value);
    input.min = String(min);
    if (max != null) input.max = String(max);
    input.step = String(step);
    label.appendChild(input);
    return { label, input };
  }
  function selectControl(text, className, options) {
    const label = document.createElement("label");
    label.className = `seipro-crop-field ${className}-field`;
    label.textContent = text;
    const input = document.createElement("select");
    input.className = className;
    options.forEach(function([value, labelText]) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = labelText;
      input.appendChild(option);
    });
    label.appendChild(input);
    return { label, input };
  }
  function button(text, className) {
    const element = document.createElement("button");
    element.type = "button";
    element.className = `seipro-crop-button ${className}`;
    element.textContent = text;
    return element;
  }
  function numberValue(input) {
    const value = Number(input.value);
    return Number.isFinite(value) ? value : 0;
  }
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  // src/features/editor/view/dialogs/images-editor.js
  function hideLinkTips(iframeDoc) {
    if (iframeDoc.find(".linkDisplayPro:hover").length == 0) {
      iframeDoc.find(".linkDisplayPro").closest("a");
      iframeDoc.find(".linkDisplayPro").remove();
      api.restoreIframeDisplayLink();
    }
  }
  function showLinkTips(this_, iframeDoc) {
    iframeDoc.find(".linkDisplayPro").remove();
    var eLink = q(this_);
    var tLink = eLink.text();
    tLink = q("<div/>").text(tLink).html();
    var hrefLink = eLink.attr("href");
    var hLinkTiny = hrefLink.length > 50 ? hrefLink.replace(/^(.{50}[^\s]*).*/, "$1") + "..." : hrefLink;
    var linkRef = randomString(8);
    var html = '<div class="linkDisplayPro" unselectable="on">    <span contenteditable="false">        <a data-seipro-action="openLinkPro" data-seipro-link-ref="' + linkRef + '" data-seipro-editor-id="' + state.idEditor + '" title="Abrir link"><i class="fas fa-globe-americas" style="padding-right: 5px;"></i><span class="info"></span><strong style="font-size: 13pt;" class="title-linktip" title="' + tLink + '">' + hLinkTiny + '</strong> <i class="fas fa-external-link-alt" style="font-size: 11px; padding: 3px; vertical-align: top;"></i></a>         <a data-seipro-action="copyLinkPro" data-seipro-link-ref="' + linkRef + '" data-seipro-editor-id="' + state.idEditor + '" title="Copiar link"><i class="far fa-copy" style="color: #777;"></i></a>        <a data-seipro-action="editLinkPro" data-seipro-editor-id="' + state.idEditor + '" title="Editar link"><i class="fas fa-pen" style="color: #777;"></i></a>        <a data-seipro-action="removeLinkPro" data-seipro-link-ref="' + linkRef + '" data-seipro-editor-id="' + state.idEditor + '" title="Remover link"><i class="fas fa-unlink" style="color: #777;"></i></a>    </span></div>';
    q(this_).attr("data-reflinkpro", linkRef).prepend(html);
    var boxDisplayLink = q(this_).find(".linkDisplayPro");
    var boxDisplayLink_left = boxDisplayLink.offset().left;
    var boxDisplayLink_width = boxDisplayLink.width();
    var windowWidth = q(window).width();
    var margin = boxDisplayLink_left + boxDisplayLink_width > windowWidth ? windowWidth - (boxDisplayLink_left + boxDisplayLink_width + 45) : 0;
    boxDisplayLink.css("margin-left", margin);
  }
  function openImageEditorPro(this_) {
    api.setParamEditor(this_);
    let selectedImg = state.oEditor && state.oEditor.getSelection() ? state.oEditor.getSelection().getSelectedElement() : null;
    if (!selectedImg || selectedImg.getName() !== "img") return;
    const srcImg = selectedImg.getAttribute("src");
    if (typeof srcImg !== "string" || !srcImg) return;
    openImageCrop({
      src: srcImg,
      onSave: (dataUrl) => {
        selectedImg.setAttribute("src", dataUrl);
        try {
          state.oEditor.fire("saveSnapshot");
        } catch (e) {
        }
      }
    });
  }
  function initDialogImageEditorPro() {
  }
  function getDialogImageEditorPro() {
  }
  function pageImageBackground(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog("pageImageBackground");
  }
  function getDialogPageImageBackground() {
    var htmlImportFile = `<label class="cke_dialog_ui_labeled_label">Importar imagem (PNG, JPG ou SVG)</label>
                            <div class="cke_dialog_ui_labeled_content cke_dialog_ui_input_file">
                                <input style="width:95%" id="fileInputImportImage" type="file" accept="image/*">
                            </div>`;
    CKEDITOR.dialog.add("pageImageBackground", function(editor) {
      return {
        title: "Adicionar Image de Fundo e Configura\xE7\xF5es de P\xE1gina para Impress\xE3o",
        minWidth: 650,
        minHeight: 80,
        buttons: [CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton],
        onOk: function(event, a, b) {
          api.getImagePageBackground(true, function(src, config) {
            api.templateImagePageBackground(src, config);
          });
          event.data.hide = false;
        },
        onShow: function() {
          centralizeDialogBoxEditor();
          q("#" + CKEDITOR.dialog.getCurrent().getContentElement("tab1", "tipoEscala")._.inputId).attr("type", "number").attr("step", "10").addClass("tipoEscala");
          q("#" + CKEDITOR.dialog.getCurrent().getContentElement("tab1", "textoCabecalho")._.inputId).addClass("textoCabecalho");
          q("#" + CKEDITOR.dialog.getCurrent().getContentElement("tab1", "textoRodape")._.inputId).addClass("textoRodape");
          q(".cke_dialog_page_contents").find("select").css("width", "100%");
          q("#fileInputImportImage, .cke_dialog_page_contents input, .cke_dialog_page_contents select").on("change", function() {
            let _this = q(this);
            let val = _this.val();
            let pageBox = q("#boxBgPreview");
            let imgBox = q("#imgBgPreview");
            api.getPreviewImagePageBackground();
            if (val == "landscape") {
              pageBox.css({ "width": "297px", "height": "210px" });
            } else if (val == "portrait") {
              pageBox.css({ "height": "297px", "width": "210px" });
            } else if (val == "letter") {
              if (pageBox.height() > pageBox.width()) pageBox.css({ "height": "279.4px", "width": "215.9px" });
              else pageBox.css({ "width": "279.4px", "height": "215.9px" });
            } else if (val == "legal") {
              if (pageBox.height() > pageBox.width()) pageBox.css({ "height": "356px", "width": "216px" });
              else pageBox.css({ "width": "356px", "height": "216px" });
            } else if (val == "tabloid") {
              if (pageBox.height() > pageBox.width()) pageBox.css({ "height": "432px", "width": "279px" });
              else pageBox.css({ "width": "432px", "height": "279px" });
            } else if (val == "A4") {
              if (pageBox.height() > pageBox.width()) pageBox.css({ "height": "297px", "width": "210px" });
              else pageBox.css({ "width": "297px", "height": "210px" });
            } else if (val == "A5") {
              if (pageBox.height() > pageBox.width()) pageBox.css({ "height": "210px", "width": "148px" });
              else pageBox.css({ "width": "210px", "height": "148px" });
            } else if (val == "A3") {
              if (pageBox.height() > pageBox.width()) pageBox.css({ "height": "420px", "width": "297px" });
              else pageBox.css({ "width": "420px", "height": "297px" });
            } else if (_this.hasClass("tipoEscala")) {
              pageBox.find("p").css({ "font-size": val + "%" });
            } else if (_this.hasClass("tipoFonte")) {
              pageBox.find("p").css({ "font-family": val });
            } else if (_this.hasClass("tipoPosicao")) {
              imgBox.css({ "background-position": val });
            } else if (_this.hasClass("tipoDisposicao")) {
              imgBox.css({ "background-size": val });
            } else if (_this.hasClass("tipoRepeticao")) {
              imgBox.css({ "background-repeat": val });
            } else if (_this.hasClass("tipoUtilizacao")) {
              if (val == "page_cover") pageBox.find("p").css({ "visibility": "hidden" });
              else pageBox.find("p").css({ "visibility": "visible" });
            } else if (_this.hasClass("tipoPadding")) {
              if (val == "3cm 2cm 3cm 2cm") {
                imgBox.css({ "padding": "30px 20px" });
              } else if (val == "1cm 1cm 1cm 1cm") {
                imgBox.css({ "padding": "10px" });
              } else {
                imgBox.css({ "padding": "0" });
              }
            } else if (_this.hasClass("tipoMargem")) {
              if (val == "3cm 2cm 3cm 2cm") {
                imgBox.css({ "margin": "30px 20px" });
              } else if (val == "1cm 1cm 1cm 1cm") {
                imgBox.css({ "margin": "10px" });
              } else {
                imgBox.css({ "margin": "0" });
              }
            }
            centralizeDialogBoxEditor();
          });
          if (verifyConfigValue("substituiselecao")) api.setChosenInCke();
          setTimeout(function() {
            api.resetOptionsImgBg();
          }, 100);
        },
        contents: [
          {
            id: "tab1",
            label: "Impress\xE3o",
            elements: [
              {
                type: "hbox",
                widths: ["100%"],
                style: "margin-top:10px;",
                children: [
                  {
                    type: "html",
                    html: htmlImportFile
                  }
                ]
              },
              {
                type: "hbox",
                widths: ["33%", "33%", "33%"],
                children: [
                  {
                    type: "select",
                    id: "tipoLayout",
                    className: "tipoLayout",
                    label: "Layout",
                    width: "200px",
                    items: [["Paisagem", "landscape"], ["Retrato", "portrait"]],
                    "default": "portrait"
                  },
                  {
                    type: "select",
                    id: "tipoPapel",
                    className: "tipoPapel",
                    label: "Tamanho do Papel",
                    width: "200px",
                    items: [["A5", "A5"], ["A4", "A4"], ["A3", "A3"], ["Tabloid", "tabloid"], ["Letter", "letter"], ["Legal", "legal"]],
                    "default": "A4"
                  },
                  {
                    type: "text",
                    id: "tipoEscala",
                    className: "tipoEscala",
                    label: "Escala (%)",
                    width: "200px",
                    "default": "100"
                  }
                ]
              },
              {
                type: "hbox",
                widths: ["33%", "33%", "33%"],
                children: [
                  {
                    type: "select",
                    id: "tipoMargem",
                    className: "tipoMargem",
                    label: "Margens Externas",
                    width: "200px",
                    items: [["Padr\xE3o (3cm 2cm)", "3cm 2cm 3cm 2cm"], ["Nenhuma (0cm)", "0cm"], ["M\xEDnima (1cm)", "1cm 1cm 1cm 1cm"]],
                    "default": "0cm"
                  },
                  {
                    type: "select",
                    id: "tipoPadding",
                    className: "tipoPadding",
                    label: "Margens Internas",
                    width: "200px",
                    items: [["Padr\xE3o (3cm 2cm)", "3cm 2cm 3cm 2cm"], ["Nenhuma (0cm)", "0cm"], ["M\xEDnima (1cm)", "1cm 1cm 1cm 1cm"]],
                    "default": "3cm 2cm 3cm 2cm"
                  },
                  {
                    type: "select",
                    id: "tipoFonte",
                    className: "tipoFonte",
                    label: "Fonte",
                    width: "200px",
                    items: [["Helvetica"], ["Arial"], ["Arial Black"], ["Calibri"], ["Verdana"], ["Tahoma"], ["Trebuchet MS"], ["Impact"], ["Gill Sans"], ["Times New Roman"], ["Georgia"], ["Palatino"], ["Baskerville"], ["Andal\xE9 Mono"], ["Courier"], ["Lucida"], ["Monaco"], ["Bradley Hand"], ["Brush Script MT"], ["Luminari"], ["Comic Sans MS"]],
                    "default": "Calibri"
                  }
                ]
              },
              {
                type: "hbox",
                widths: ["33%", "33%", "33%"],
                children: [
                  {
                    type: "select",
                    id: "tipoPosicao",
                    className: "tipoPosicao",
                    label: "Posi\xE7\xE3o da Imagem",
                    width: "200px",
                    items: [
                      ["Topo Centralizada \u2238", "top center"],
                      ["Top Direito \u25F3", "top right"],
                      ["Top Esquerdo \u25F0", "top left"],
                      ["Inferior Centralizado \u2A66", "bottom center"],
                      ["Inferior Direito \u25F2", "bottom right"],
                      ["Inferior Esquerdo \u25F1", "bottom left"],
                      ["Meio Centralizada \u29C7"],
                      ["Meio Direito \u27E5", "center center"],
                      ["Meio Esquerdo \u27E4", "center left"]
                    ],
                    "default": "top center"
                  },
                  {
                    type: "select",
                    id: "tipoDisposicao",
                    className: "tipoDisposicao",
                    label: "Disposi\xE7\xE3o da Imagem",
                    width: "200px",
                    items: [["Capa (cover)", "cover"], ["Contida (contain)", "contain"]],
                    "default": "contain"
                  },
                  {
                    type: "select",
                    id: "tipoRepeticao",
                    className: "tipoRepeticao",
                    label: "Repeti\xE7\xE3o da Imagem",
                    width: "200px",
                    items: [["Sem repeti\xE7\xE3o", "no-repeat"], ["Repeti\xE7\xE3o horizontal", "repeat-x"], ["Repeti\xE7\xE3o vertical", "repeat-y"], ["Repeti\xE7\xE3o vertical e horizontal", "repeat"], ["Comprimida ou estivada", "round"], ["Repeti\xE7\xE3o em corte", "space"]],
                    "default": "no-repeat"
                  }
                ]
              },
              {
                type: "hbox",
                widths: ["33%", "33%", "33%"],
                children: [
                  {
                    type: "select",
                    id: "tipoUtilizacao",
                    className: "tipoUtilizacao",
                    label: "Utiliza\xE7\xE3o da Imagem",
                    width: "200px",
                    items: [["Imagem de fundo", "background"], ["Imagem como capa de livro", "page_cover"]],
                    "default": "background"
                  },
                  {
                    type: "text",
                    id: "textoCabecalho",
                    className: "textoCabecalho",
                    label: "Texto do Cabe\xE7alho",
                    width: "200px",
                    "default": ""
                  },
                  {
                    type: "text",
                    id: "textoRodape",
                    className: "textoRodape",
                    label: "Texto do Rodap\xE9",
                    width: "200px",
                    "default": ""
                  }
                ]
              },
              {
                type: "hbox",
                widths: ["25%", "25%", "25%", "25%"],
                children: [
                  {
                    type: "checkbox",
                    id: "visibleOnPrint",
                    className: "visibleOnPrint",
                    "default": "checked",
                    label: "Vis\xEDvel apenas ao imprimir"
                  },
                  {
                    type: "checkbox",
                    id: "onlyFirst",
                    className: "onlyFirst",
                    "default": "",
                    label: "Aplicar apenas na primeira p\xE1gina"
                  },
                  {
                    type: "checkbox",
                    id: "reduceQualityImg",
                    className: "reduceQualityImg",
                    "default": "checked",
                    label: "Reduzir qualidade da imagem"
                  }
                ]
              },
              {
                type: "html",
                id: "imgpreview",
                html: new CKEDITOR.template(
                  `<div id="boxBgPreview" style="text-align: left; width: 210px; height: 297px; margin: 20px auto; border: 1px solid rgb(204, 204, 204); border-radius: 5px; box-shadow: rgb(219, 219, 219) 0px 6px 5px -5px; overflow: hidden; font-size: 100%;" class="cke_dialog_ui_html">
                                        <div id="imgBgPreview" style="padding: 30px 20px;"><p style="font-family: Calibri; color: rgb(119, 119, 119); font-size: 100%; white-space: pre-line;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut mi lacus. Nulla et metus finibus, pretium enim at, ultrices dui. Aliquam ut mauris convallis, eleifend orci quis, pulvinar augue. Aenean ultrices malesuada ante, non tempor sem placerat in. Nunc ultrices odio ut lorem gravida volutpat. Praesent sed arcu sollicitudin, molestie urna eget, consectetur nulla. Ut sed orci mollis, consequat tortor sed, congue leo.
                                        <br>Donec ac auctor libero, eu rutrum libero. Nunc sollicitudin felis tempor, convallis augue vitae, tincidunt elit. In quis volutpat erat. Phasellus feugiat purus porta libero vehicula sodales. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam porttitor, diam quis pulvinar finibus, dolor risus convallis sem, eu pellentesque odio enim a arcu. Phasellus sem turpis, malesuada eget efficitur ornare, tristique in odio. Proin molestie tempus odio nec scelerisque. Pellentesque id faucibus libero, vel semper augue.
                                        <br>Sed convallis ante leo, eu rhoncus nisi dignissim a. Nullam convallis magna sed magna consectetur, nec gravida velit suscipit. Donec sit amet mi ut massa dapibus imperdiet nec quis eros. Vestibulum fringilla mattis metus at lobortis.</p>
                                        </div>
                                    </div>
                                    <a data-seipro-action="resetOptionsImgBg" class="linkDialog" style="float: right;margin-right: 20px;">Resetar configura\xE7\xF5es</a>`
                ).output()
              }
            ]
          }
        ]
      };
    });
  }
  function getImagemBgOnEditor() {
    let imgBgAncora = state.iframeEditor.find(".imgBgAncora");
    let config = imgBgAncora.data();
    config = typeof config !== "undefined" ? config : false;
    let styleText = imgBgAncora.find("style").text() || "";
    let src = styleText.match(/\((.*?)\)/);
    src = typeof src !== "undefined" && src !== null ? src[1].replace(/('|")/g, "") : false;
    if (src) {
      q("#imgBgPreview").css("background-image", 'url("' + src + '")');
      q("#imgBgPreview").css("background-position", config?.posicao || "center");
      q("#imgBgPreview").css("background-size", config?.disposicao || "contain");
      q("#imgBgPreview").css("background-repeat", config?.repeticao || "no-repeat");
    } else {
      q("#imgBgPreview").css("background-image", "none");
    }
    return src;
  }
  function resetOptionsImgBg() {
    let config = state.iframeEditor.find(".imgBgAncora").data();
    config = typeof config !== "undefined" ? config : false;
    q("#fileInputImportImage").val("");
    q(".cke_dialog_page_contents .tipoLayout").val(config ? config.layout : "portrait").trigger("change");
    q(".cke_dialog_page_contents .tipoPapel").val(config ? config.papel : "A4").trigger("change");
    q(".cke_dialog_page_contents .tipoEscala").val(config ? config.escala : "100").trigger("change");
    q(".cke_dialog_page_contents .tipoMargem").val(config ? config.margem : "0cm").trigger("change");
    q(".cke_dialog_page_contents .tipoPadding").val(config ? config.padding : "3cm 2cm 3cm 2cm").trigger("change");
    q(".cke_dialog_page_contents .tipoFonte").val(config ? config.fonte : "Calibri").trigger("change");
    q(".cke_dialog_page_contents .tipoPosicao").val(config ? config.posicao : "top center").trigger("change");
    q(".cke_dialog_page_contents .tipoDisposicao").val(config ? config.disposicao : "contain").trigger("change");
    q(".cke_dialog_page_contents .textoCabecalho").val(config ? config.cabecalho : "").trigger("change");
    q(".cke_dialog_page_contents .textoRodape").val(config ? config.rodape : "").trigger("change");
    q(".cke_dialog_page_contents .visibleOnPrint").prop("checked", config ? config.visivel : true);
    q(".cke_dialog_page_contents .onlyFirst").prop("checked", config ? config.primeirapg : false);
    q(".cke_dialog_page_contents .reduceQualityImg").prop("checked", config ? config.reducao : true);
    q(".cke_dialog_page_contents .tipoRepeticao").val(config ? config.repeticao : "no-repeat").trigger("change");
    q(".cke_dialog_page_contents .tipoUtilizacao").val(config ? config.utilizacao : "background").trigger("change");
    api.getImagemBgOnEditor();
    api.setChosenInCke();
    api.getPreviewImagePageBackground();
  }
  function getPreviewImagePageBackground() {
    let elem = q("#imgBgPreview");
    api.getImagePageBackground(false, function(src, config) {
      elem.css({
        // 'font-family': config.fonte,
        // 'background-position': config.posicao,
        // 'background-size': config.disposicao,
        // 'background-repeat': config.repeticao,
        "background-image": 'url("' + src + '")'
      });
    });
  }
  function getImagePageBackground(insert = false, callback = false) {
    var src = api.getImagemBgOnEditor();
    var importImage = document.getElementById("fileInputImportImage").files;
    var visibleOnPrint = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "visibleOnPrint").getValue();
    var onlyFirst = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "onlyFirst").getValue();
    var reduceQualityImg = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "reduceQualityImg").getValue();
    var tipoLayout = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "tipoLayout").getValue();
    var tipoPapel = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "tipoPapel").getValue();
    var tipoMargem = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "tipoMargem").getValue();
    var tipoPadding = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "tipoPadding").getValue();
    var tipoEscala = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "tipoEscala").getValue();
    var tipoFonte = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "tipoFonte").getValue();
    var tipoPosicao = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "tipoPosicao").getValue();
    var tipoDisposicao = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "tipoDisposicao").getValue();
    var tipoRepeticao = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "tipoRepeticao").getValue();
    var tipoUtilizacao = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "tipoUtilizacao").getValue();
    var textoCabecalho = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "textoCabecalho").getValue();
    var textoRodape = CKEDITOR.dialog.getCurrent().getContentElement("tab1", "textoRodape").getValue();
    if (importImage.length) {
      api.loadImagePageBackground(importImage[0], {
        primeirapg: onlyFirst,
        cabecalho: textoCabecalho,
        rodape: textoRodape,
        visivel: visibleOnPrint,
        reducao: reduceQualityImg,
        layout: tipoLayout,
        papel: tipoPapel,
        margem: tipoMargem,
        padding: tipoPadding,
        escala: tipoEscala,
        fonte: tipoFonte,
        posicao: tipoPosicao,
        disposicao: tipoDisposicao,
        utilizacao: tipoUtilizacao,
        repeticao: tipoRepeticao
      }, callback);
    } else if (insert && src) {
      api.templateImagePageBackground(src, {
        primeirapg: onlyFirst,
        cabecalho: textoCabecalho,
        rodape: textoRodape,
        visivel: visibleOnPrint,
        reducao: reduceQualityImg,
        layout: tipoLayout,
        papel: tipoPapel,
        margem: tipoMargem,
        padding: tipoPadding,
        escala: tipoEscala,
        fonte: tipoFonte,
        posicao: tipoPosicao,
        disposicao: tipoDisposicao,
        utilizacao: tipoUtilizacao,
        repeticao: tipoRepeticao
      });
    }
  }
  function loadImagePageBackground(item, config, callback = false) {
    var reader = new FileReader();
    reader.onload = function(evt) {
      var element = state.oEditor.document.createElement("img", {
        attributes: {
          src: evt.target.result,
          class: "img-base64"
        }
      });
      if (state.qualidadeImagens > 0 && config.reducao) qualityImages(element.$, element.$);
      setTimeout(function() {
        var src = config.reducao ? q(element).attr("src") : evt.target.result;
        if (typeof callback === "function") callback(src, config);
      }, 10);
    };
    reader.readAsDataURL(item);
  }
  function templateImagePageBackground(src, config) {
    var imgBgAncora = state.iframeEditor.find(".imgBgAncora");
    var config_cabecalho = config.cabecalho == "" ? `` : `body:before {
                                                            display: block;
                                                            position: fixed;
                                                            text-align: center;
                                                            content: "${config.cabecalho}";
                                                            top: 0.5cm;
                                                            width: 100%;
                                                            color: #717171;
                                                            font-size: 8pt;
                                                            font-family: Calibri;
                                                        }`;
    var config_rodape = config.rodape == "" ? `` : `body:after {
                                                        display: block;
                                                        position: fixed;
                                                        text-align: center;
                                                        content: "${config.rodape}";
                                                        bottom: 0.5cm;
                                                        width: 100%;
                                                        color: #717171;
                                                        font-size: 8pt;
                                                        font-family: Calibri;
                                                    }`;
    var config_capa = config.utilizacao == "page_cover" && config.papel == "A4" && config.layout == "landscape" ? "padding-top: 21cm !important;" : "";
    config_capa = config.utilizacao == "page_cover" && config.papel == "A4" && config.layout == "portrait" ? "padding-top: 29.7cm !important;" : config_capa;
    config_capa = config.utilizacao == "page_cover" && config.papel == "letter" && config.layout == "landscape" ? "padding-top: 21.59cm !important;" : config_capa;
    config_capa = config.utilizacao == "page_cover" && config.papel == "letter" && config.layout == "portrait" ? "padding-top: 27.94cm !important;" : config_capa;
    config_capa = config.utilizacao == "page_cover" && config.papel == "legal" && config.layout == "landscape" ? "padding-top: 21.6cm !important;" : config_capa;
    config_capa = config.utilizacao == "page_cover" && config.papel == "legal" && config.layout == "portrait" ? "padding-top: 35.6cm !important;" : config_capa;
    config_capa = config.utilizacao == "page_cover" && config.papel == "tabloid" && config.layout == "landscape" ? "padding-top: 27.9cm !important;" : config_capa;
    config_capa = config.utilizacao == "page_cover" && config.papel == "tabloid" && config.layout == "portrait" ? "padding-top: 43.2cm !important;" : config_capa;
    config_capa = config.utilizacao == "page_cover" && config.papel == "A5" && config.layout == "landscape" ? "padding-top: 14.8cm !important;" : config_capa;
    config_capa = config.utilizacao == "page_cover" && config.papel == "A5" && config.layout == "portrait" ? "padding-top: 21cm !important;" : config_capa;
    config_capa = config.utilizacao == "page_cover" && config.papel == "A3" && config.layout == "landscape" ? "padding-top: 29.7cm !important;" : config_capa;
    config_capa = config.utilizacao == "page_cover" && config.papel == "A3" && config.layout == "portrait" ? "padding-top: 42cm !important;" : config_capa;
    var title = q('td[class*="cke_dialog_ui_hbox"]').map(function() {
      let input = q(this).find("select").length ? q(this).find("select option:selected").text() : "";
      input = q(this).find("input.cke_dialog_ui_input_text").length ? q(this).find("input.cke_dialog_ui_input_text").val() : input;
      input = q(this).find('input[type="checkbox"]').length ? q(this).find('input[type="checkbox"]').is(":checked") ? "Sim" : "N\xE3o" : input;
      if (input != "") return q(this).find("label").text() + ": " + input.trim();
    }).get().join("\n");
    var htmlBgPage = `<p class="Tabela_Texto_Alinhado_Esquerda">
                        <span class="imgBgAncora" title="${title}" contenteditable="false" data-cabecalho="${config.cabecalho}" data-rodape="${config.rodape}" data-primeirapg="${config.primeirapg}" data-visivel="${config.visivel}" data-reducao="${config.reducao}" data-layout="${config.layout}" data-papel="${config.papel}" data-margem="${config.margem}" data-padding="${config.padding}" data-escala="${config.escala}" data-fonte="${config.fonte}" data-posicao="${config.posicao}" data-disposicao="${config.disposicao}" data-utilizacao="${config.utilizacao}" data-repeticao="${config.repeticao}">
                            <a class="ancoraSei" contenteditable="false" style="text-indent:0;">
                                <style data-style="seipro-imagebg-print" type="text/css">
                                    .imgBgAncora { text-indent: 0; font-size: .8em; padding: 2px 5px; background: #e4e4e4; border-radius: 5px; font-weight: bold; color:#d45656; margin: 0 5px; }
                                    html.dark-mode .imgBgAncora, html.dark-mode .imgBgAncora:after { background: #6f7071 !important; color: #f9f9f9 !important; }
                                    body.cke_editable .imgBgAncora:after { content: " [delete isto para remover]"; color:#888; font-weight: normal; font-size: .85em; margin: 0 5px; }
                                    @media print {
                                        @page` + (config.primeirapg ? `:first` : ``) + ` {
                                                size: ${config.papel} ${config.layout};
                                                margin: ${config.margem};
                                            }
                                        ` + (config.visivel ? `` : `}`) + `
                                            body p,
                                            body p * {
                                                font-size: ${config.escala}% !important;
                                                font-family: ${config.fonte} !important;
                                            }
                                            .imgBgAncora { display: none; }
                                            body {
                                                padding: ${config.padding};
                                                ${config_capa}
                                                background-position: ${config.posicao};
                                                background-size: ${config.disposicao};
                                                background-repeat: ${config.repeticao};
                                                background-image: url("${src}");
                                            }
                                            ${config_cabecalho}
                                            ${config_rodape}
                                        ` + (config.visivel ? `}` : ``) + `
                                </style>
                                \u{1F5A8}\uFE0F * CONFIGURA\xC7\xD5ES DE IMPRESS\xC3O
                            </a>
                        </span>
                    </p>`;
    state.oEditor.focus();
    storeCursorLocation(state.oEditor);
    state.oEditor.fire("saveSnapshot");
    if (imgBgAncora.length) imgBgAncora.closest("p").remove();
    state.iframeEditor.find("body").prepend(htmlBgPage);
    oEditor.fire("saveSnapshot");
    enableButtonSavePro();
    var imgBgAncora_new = state.iframeEditor.find(".imgBgAncora");
    imgBgAncora_new.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    imgBgAncora_new.get(0).scrollIntoView();
  }
  api.hideLinkTips = hideLinkTips;
  api.showLinkTips = showLinkTips;
  api.openImageEditorPro = openImageEditorPro;
  api.initDialogImageEditorPro = initDialogImageEditorPro;
  api.getDialogImageEditorPro = getDialogImageEditorPro;
  api.pageImageBackground = pageImageBackground;
  api.getDialogPageImageBackground = getDialogPageImageBackground;
  api.getImagemBgOnEditor = getImagemBgOnEditor;
  api.resetOptionsImgBg = resetOptionsImgBg;
  api.getPreviewImagePageBackground = getPreviewImagePageBackground;
  api.getImagePageBackground = getImagePageBackground;
  api.loadImagePageBackground = loadImagePageBackground;
  api.templateImagePageBackground = templateImagePageBackground;

  // src/features/editor/view/dialogs/import.js
  var import_exports = {};
  __export(import_exports, {
    getGoogleDocs: () => getGoogleDocs,
    getGoogleSheets: () => getGoogleSheets,
    handleFileImport: () => handleFileImport,
    importDocPro: () => importDocPro,
    loadFileImportEditor: () => loadFileImportEditor,
    loadFileImportHTML: () => loadFileImportHTML,
    wordToSEI: () => wordToSEI
  });
  function importDocPro(this_) {
    api.setParamEditor(this_);
    var tipsDocs = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic;color: #616161;"><i class="fas fa-info-circle" style="color: #007fff;"></i> Antes de importar, confira se o documento est\xE1 acess\xEDvel por qualquer<br>pessoa na internet. <a href="https://sei-pro.github.io/sei-pro/pages/INSERIRDOC.html" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238);">Consulte nossa ajuda para mais informa\xE7\xF5es.</a></label>';
    var tipsSheets = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic;color: #616161;"><i class="fas fa-info-circle" style="color: #007fff;"></i> Antes de importar, confira se a planilha est\xE1 publicada na web.<br> Aten\xE7\xE3o: O URL publicado na web \xE9 diferente do URL da planilha. <br><a href="https://sei-pro.github.io/sei-pro/pages/INSERIRPLANILHA.html" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238);">Consulte nossa ajuda para mais informa\xE7\xF5es.</a></label>';
    const htmlBox = sanitizeHTML(`
        <div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
            <div id="tabDialog" style="border: none;margin: 0;">
                <ul style="font-size: 0.8em;">
                   <li><a href="#tabDialog-tab1"><i class="fas fa-upload cinzaColor" style="margin-right: 5px;"></i> Arquivo Word (docx) ou HTML</a></li>
                   <li><a href="#tabDialog-tab2"><i class="fas fa-file-alt cinzaColor" style="margin-right: 5px;"></i> Google Docs</a></li>
                   <li><a href="#tabDialog-tab3"><i class="fas fa-file-spreadsheet cinzaColor" style="margin-right: 5px;"></i> Google Planilhas</a></li>
                </ul>
                <div id="tabDialog-tab1">
                    <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                        <tr>
                            <td style="vertical-align: bottom; text-align: left;" class="label">
                                <label for="fileInputImportHTMLDocx"><i class="iconPopup iconSwitch fas fa-upload cinzaColor"></i>Inserir texto de arquivo Word (docx) ou HTML:</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input style="width:95%" id="fileInputImportHTMLDocx" type="file" accept=".docx,.html">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="display: flex;">
                                    <div class="onoffswitch" style="transform: scale(0.5);display: inline-block;float: left;">
                                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="importWord" tabindex="0">
                                        <label class="onoff-switch-label" for="importWord"></label>
                                    </div>
                                    <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="importWord">Corrigir erros de codifica\xE7\xE3o de documentos Word</label>
                                </div>
                                <div style="display: flex;">
                                    <div class="onoffswitch" style="transform: scale(0.5);display: inline-block;float: left;">
                                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="replaceText" tabindex="0" checked>
                                        <label class="onoff-switch-label" for="replaceText"></label>
                                    </div>
                                    <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="replaceText">Substituir todo o documento pelo conte\xFAdo externo</label>
                                </div>
                                <div style="display: flex;">
                                    <div class="onoffswitch" style="transform: scale(0.5);display: inline-block;float: left;">
                                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="replaceTags" tabindex="0" checked>
                                        <label class="onoff-switch-label" for="replaceTags"></label>
                                    </div>
                                    <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="replaceTags">Substituir campos din\xE2micos no documento (se dispon\xEDvel)</label>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="tabDialog-tab2">
                    <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                        <tr>
                            <td style="vertical-align: bottom; text-align: left;" class="label">
                                <label for="urlGDocs"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i>URL do Google Docs:</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input style="width:95%" id="urlGDocs" type="text">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="display: flex;">
                                    <div class="onoffswitch" style="transform: scale(0.5);display: inline-block;float: left;">
                                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="replaceTextDocs" tabindex="0" checked>
                                        <label class="onoff-switch-label" for="replaceTextDocs"></label>
                                    </div>
                                    <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="replaceTextDocs">Substituir todo o documento pelo conte\xFAdo externo</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label style="font-style: italic;color: #616161;margin-top: 15px;display: block;">
                                    <i class="fas fa-info-circle" style="color: #007fff;"></i>
                                    Antes de importar, confira se o documento est\xE1 acess\xEDvel por qualquer<br>pessoa na internet.
                                    <a href="https://sei-pro.github.io/sei-pro/pages/INSERIRDOC.html" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238);">Consulte nossa ajuda para mais informa\xE7\xF5es.</a>
                                </label>
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="tabDialog-tab3">
                    <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                        <tr>
                            <td style="vertical-align: bottom; text-align: left;" class="label">
                                <label for="urlGSheets"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i>URL do Google Planilhas (Publicar na Web)</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input style="width:95%" id="urlGSheets" type="text">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="display: flex;">
                                    <div class="onoffswitch" style="transform: scale(0.5);display: inline-block;float: left;">
                                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="replaceTextSheets" tabindex="0" checked>
                                        <label class="onoff-switch-label" for="replaceTextSheets"></label>
                                    </div>
                                    <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="replaceTextSheets">Substituir todo o documento pelo conte\xFAdo externo</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label style="font-style: italic;color: #616161;margin-top: 15px;display: block;">
                                    <i class="fas fa-info-circle" style="color: #007fff;"></i>
                                    Antes de importar, confira se a planilha est\xE1 publicada na web.<br> Aten\xE7\xE3o: O URL publicado na web \xE9 diferente do URL da planilha.
                                    <br><a href="https://sei-pro.github.io/sei-pro/pages/INSERIRPLANILHA.html" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238);">Consulte nossa ajuda para mais informa\xE7\xF5es.</a>
                                </label>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    `);
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = q("#dialogBoxPro").html(htmlBox).dialog({
      title: "Inserir texto de conte\xFAdo externo",
      width: 600,
      height: 400,
      open: function() {
        qLoadScript(URL_SPRO + "js/lib/mammoth.browser.min.js").catch(function() {
        });
        q("#tabDialog").tabs();
        initChosenReplace("box_multiple", this, true);
        setTimeout(function() {
          q("#fileInputImportHTMLDocx").val("");
        }, 500);
      },
      buttons: [{
        text: "Inserir",
        class: "confirm ui-state-active",
        click: function(event) {
          var inputFile = document.getElementById("fileInputImportHTMLDocx").files;
          var urlGDocs = q("#urlGDocs").val();
          var urlGSheets = q("#urlGSheets").val();
          if (inputFile.length) {
            api.handleFileImport(inputFile);
          } else if (urlGDocs != "") {
            api.getGoogleDocs(urlGDocs);
          } else if (urlGSheets != "") {
            api.getGoogleSheets(urlGSheets);
          }
        }
      }]
    });
  }
  function getGoogleDocs(url) {
    var regex = "\\/d\\/(.*?)(\\/|$)";
    var regDocs = new RegExp(regex).exec(url);
    if (regDocs !== null) {
      var urlDocs = "https://docs.google.com/feeds/download/documents/export/Export?id=" + regDocs[1] + "&exportFormat=html";
      loadGoogleDocs(urlDocs, state.iframeEditor, "docs");
    } else {
      alertaBoxPro("Error", "exclamation-triangle", "Url do documento inv\xE1lido!");
    }
  }
  function getGoogleSheets(url) {
    var regex = "\\/e\\/(.*?)(\\/|$)";
    var regSheets = new RegExp(regex).exec(url);
    if (regSheets !== null) {
      var urlSheets = "https://docs.google.com/spreadsheets/d/e/" + regSheets[1] + "/pubhtml";
      loadGoogleDocs(urlSheets, state.iframeEditor, "sheets");
    } else {
      alertaBoxPro("Error", "exclamation-triangle", "Url do documento inv\xE1lido!");
    }
  }
  function handleFileImport(inputFile) {
    const file = inputFile[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "docx") {
      converterDocxParaHtml(inputFile);
    } else if (ext === "html" || ext === "htm") {
      api.loadFileImportHTML(inputFile);
    } else {
      alertaBoxPro("Error", "exclamation-triangle", "Formato n\xE3o suportado. Use um arquivo .docx ou .html");
    }
  }
  async function converterDocxParaHtml(inputFile) {
    try {
      const file = inputFile[0];
      if (!file) throw new Error("Nenhum arquivo .docx selecionado.");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      var r = !q("#replaceText").is(":checked") ? true : confirm("Deseja substituir o conte\xFAdo atual pelo arquivo importado?");
      if (r == true) {
        api.loadFileImportEditor(result.value);
      }
      if (result.messages.length > 0) {
        console.warn("Mensagens da convers\xE3o:", result.messages);
      }
    } catch (erro) {
      console.error("Erro ao converter .docx:", erro);
    }
  }
  function loadFileImportHTML(files) {
    if (files.length <= 0) {
      return false;
    }
    var fr = new FileReader();
    fr.onload = function(e) {
      var result = e.target.result;
      if (q('iframe[title*="' + idEditor + '"]').length) {
        var r = !q("#replaceText").is(":checked") ? true : confirm("Deseja substituir o conte\xFAdo atual pelo arquivo importado?");
        if (r == true) {
          api.loadFileImportEditor(result);
        }
      }
    };
    if (q("#importWord").val() == true) {
      fr.readAsText(files.item(0), "cP1252");
    } else {
      fr.readAsText(files.item(0));
    }
    if (q("#replaceTags").val() == true) {
      setTimeout(function() {
        api.replaceDadosEditor();
      }, 500);
    }
  }
  function loadFileImportEditor(result) {
    state.oEditor.focus();
    state.oEditor.fire("saveSnapshot");
    if (state.frmEditor.length) {
      if (q("#replaceText").is(":checked")) {
        state.iframeEditor.find("body").html(result);
      } else {
        var select = state.oEditor.getSelection().getStartElement();
        var pElement = q(select.$).closest("p");
        if (pElement.length) {
          state.iframeEditor.find(pElement).before(result);
        }
      }
    } else {
      if (q("#replaceText").is(":checked")) {
        state.iframeEditor.html(result);
      } else {
        var select = state.oEditor.getSelection().getStartElement();
        var pElement = q(select.$).closest("p");
        if (pElement.length) {
          pElement.before(result);
        }
      }
    }
    api.wordToSEI(state.iframeEditor);
    state.oEditor.fire("saveSnapshot");
    enableButtonSavePro();
    resetDialogBoxPro("dialogBoxPro");
  }
  function wordToSEI(iframe) {
    iframe.find("body link").remove();
    iframe.find("body script").remove();
    iframe.find("body style").remove();
    iframe.find("body meta").remove();
    iframe.find("o\\:p").remove();
    iframe.find("a.msocomanchor").remove();
    iframe.find('div[style="mso-element:comment-list"]').remove();
    iframe.find("*").contents().each(function() {
      if (this.nodeType === Node.COMMENT_NODE) {
        q(this).remove();
      }
    });
    iframe.find("p.MsoNormal").each(function() {
      var align = q(this).attr("align");
      var style = align == "center" ? "Texto_Centralizado" : "Texto_Justificado_Recuo_Primeira_Linha";
      q(this).removeClass("MsoNormal").removeAttr("align").removeAttr("style").addClass(style);
      q(this).find("span").replaceWith(function() {
        return q(this).contents();
      });
      q(this).find("del").each(function() {
        var text = q(this).html();
        if (text != "" && text != "&nbsp;") {
          q(this).after('<span style="color:#FF0000;"><s>' + text + "</s></span> ");
        }
        q(this).remove();
      });
      q(this).find("ins").each(function() {
        var text = q(this).html();
        if (text != "" && text != "&nbsp;") {
          q(this).after('<span style="color:#0000FF;"><u>' + text + "</u></span> ");
        }
        q(this).remove();
      });
    });
    iframe.find(".WordSection1").replaceWith(function() {
      return q(this).contents();
    });
  }
  api.importDocPro = importDocPro;
  api.getGoogleDocs = getGoogleDocs;
  api.getGoogleSheets = getGoogleSheets;
  api.handleFileImport = handleFileImport;
  api.loadFileImportHTML = loadFileImportHTML;
  api.loadFileImportEditor = loadFileImportEditor;
  api.wordToSEI = wordToSEI;

  // src/features/editor/view/editor-images.js
  var editor_images_exports = {};
  __export(editor_images_exports, {
    initContextMenuPro: () => initContextMenuPro,
    initDropImages: () => initDropImages,
    initPasteImgToBase64: () => initPasteImgToBase64,
    loadPasteImgToBase64: () => loadPasteImgToBase64,
    onPastePro: () => onPastePro,
    qualityImages: () => qualityImages2,
    readImageAsBase64: () => readImageAsBase64,
    tableSorterPro: () => tableSorterPro
  });
  function initPasteImgToBase64(editor) {
    if (editor.addFeature) {
      editor.addFeature({
        allowedContent: "img[alt,id,!src]{width,height};"
      });
    }
    var editableElement = editor.editable ? editor.editable() : editor.document;
    editableElement.on("paste", api.onPastePro, null, { editor });
  }
  function onPastePro(event) {
    var editor = event.listenerData && event.listenerData.editor;
    var $event = event.data.$;
    var clipboardData = $event.clipboardData;
    var found = false;
    var imageType = /^image/;
    if (!clipboardData) {
      return;
    }
    return Array.prototype.forEach.call(clipboardData.types, function(type, i) {
      if (found) {
        return;
      }
      if (type.match(imageType) || clipboardData.items[i].type.match(imageType)) {
        api.readImageAsBase64(clipboardData.items[i], editor);
        return found = true;
      }
    });
  }
  function readImageAsBase64(item, editor) {
    if (!item || typeof item.getAsFile !== "function") {
      return;
    }
    var file = item.getAsFile();
    var reader = new FileReader();
    reader.onload = function(evt) {
      var element = editor.document.createElement("img", {
        attributes: {
          src: evt.target.result,
          class: "img-base64"
        }
      });
      if (state.qualidadeImagens > 0) api.qualityImages(element.$, element.$);
      setTimeout(function() {
        editor.insertElement(element);
        var select = editor.getSelection().getStartElement();
        var p = q(select.$).closest("p");
        p.find('img[src*="http"]').not(".img-base64").remove();
      }, 10);
    };
    reader.readAsDataURL(file);
  }
  function loadPasteImgToBase64() {
    q(state.txaEditor).each(function(index) {
      var idEditor_ = q(this).attr("id").replace("cke_", "");
      var iframe_ = q('iframe[title*="' + idEditor_ + '"]').contents();
      if (iframe_.find("body").attr("contenteditable") == "true") {
        state.oEditor = CKEDITOR.instances[idEditor_];
        api.initPasteImgToBase64(state.oEditor);
      }
    });
  }
  function tableSorterPro(editor) {
    if (editor.contextMenu && typeof editor.getMenuItem("sortasc") === "undefined") {
      editor.addMenuGroup("tableproGroup");
      editor.addMenuGroup("tablesorterGroup");
      editor.addMenuItem("addestilo", {
        label: "Adicionar Estilo",
        icon: URL_SPRO + "icons/editor/addestilotabela.png",
        command: "addestilo",
        group: "tableproGroup"
      });
      editor.addMenuItem("clonetable", {
        label: "Duplicar Tabela",
        icon: URL_SPRO + "icons/editor/duplicartabela.png",
        command: "clonetable",
        group: "tableproGroup"
      });
      editor.addMenuItem("sortasc", {
        label: "Classificar A \u2192 Z",
        command: "sortasc",
        group: "tablesorterGroup"
      });
      editor.addMenuItem("sortdesc", {
        label: "Classificar Z \u2192 A",
        command: "sortdesc",
        group: "tablesorterGroup"
      });
      editor.contextMenu.addListener(function(element) {
        if (element.getAscendant("tr", true)) {
          return { addestilo: CKEDITOR.TRISTATE_OFF };
        }
      });
      editor.contextMenu.addListener(function(element) {
        if (element.getAscendant("tr", true)) {
          return { clonetable: CKEDITOR.TRISTATE_OFF };
        }
      });
      editor.contextMenu.addListener(function(element) {
        if (element.getAscendant("tr", true)) {
          return { sortasc: CKEDITOR.TRISTATE_OFF };
        }
      });
      editor.contextMenu.addListener(function(element) {
        if (element.getAscendant("tr", true)) {
          return { sortdesc: CKEDITOR.TRISTATE_OFF };
        }
      });
      editor.addCommand("addestilo", {
        exec: function(editor2) {
          editor2.openDialog("TabelaSEI");
        }
      });
      editor.addCommand("sortasc", {
        exec: function(editor2) {
          tablesort("asc");
        }
      });
      editor.addCommand("sortdesc", {
        exec: function(editor2) {
          tablesort("desc");
        }
      });
      editor.addCommand("clonetable", {
        exec: function(editor2) {
          cloneTablePro();
        }
      });
      var cloneTablePro = function() {
        var selection = editor.getSelection();
        var select = selection.getStartElement();
        if (select) {
          editor.focus();
          editor.fire("saveSnapshot");
          var tableElement = q(select.$).closest("table");
          var htmlTable = tableElement[0].outerHTML;
          var newLine = '<p class="Texto_Justificado_Recuo_Primeira_Linha"><br></p>';
          tableElement.after(newLine + htmlTable);
          editor.fire("saveSnapshot");
        }
      };
      var tablesort = function(order) {
        var selection = editor.getSelection();
        var element = selection.getStartElement();
        if (element) {
          editor.focus();
          editor.fire("saveSnapshot");
          var column_nr = element.getAscendant({ td: 1, th: 1 }, true).getIndex();
          var table = element.getAscendant({ table: 1 });
          var tbody = table.getElementsByTag("tbody").getItem(0);
          if (tbody == void 0) tbody = table;
          var items = tbody.$.childNodes;
          var itemsArr = [];
          for (var i in items) {
            if (items[i].nodeType == 1)
              itemsArr.push(items[i]);
          }
          itemsArr.sort(function(a, b) {
            var aText = a.childNodes[column_nr].innerText.trim();
            var bText = b.childNodes[column_nr].innerText.trim();
            if (!aText || 0 === aText.length)
              if (!bText || 0 === bText.length) return 0;
              else return 1;
            if (!bText || 0 === bText.length) return -1;
            if (order == "desc") return bText.localeCompare(aText, void 0, { numeric: true });
            return aText.localeCompare(bText, void 0, { numeric: true });
          });
          for (i = 0; i < itemsArr.length; ++i) {
            tbody.$.appendChild(itemsArr[i]);
          }
          editor.fire("saveSnapshot");
        }
      };
    }
  }
  function initContextMenuPro() {
    q(state.txaEditor).each(function() {
      var idEditor_ = q(this).attr("id").replace("cke_", "");
      if (q('iframe[title*="' + idEditor_ + '"]').length == 0) {
        q(this).find("iframe").attr("title", "Editor de Rich Text, " + idEditor_);
      }
    });
    setTimeout(function() {
      q(state.txaEditor).each(function(index) {
        var idEditor_ = q(this).attr("id").replace("cke_", "");
        var iframe_ = q('iframe[title*="' + idEditor_ + '"]').contents();
        if (iframe_.find("body").attr("contenteditable") == "true") {
          var oEditor_ = CKEDITOR.instances[idEditor_];
          api.tableSorterPro(oEditor_);
          api.menuCopyStyle(oEditor_);
          api.menuBlockEdition(oEditor_);
          if (restrictConfigValue("ferramentasia") && typeof api.menuPlataformAI === "function") {
            api.menuPlataformAI(oEditor_);
          }
          if (checkConfigValue("editarimagens")) {
            api.editImgPro(oEditor_);
          }
        }
      });
    }, 2e3);
  }
  function initDropImages() {
    if (checkConfigValue("editarimagens")) {
      setTimeout(function() {
        q("iframe.cke_wysiwyg_frame").each(function(index) {
          var iframe = q(this).contents();
          var instanceIframe = q(this).attr("title");
          instanceIframe = typeof instanceIframe !== "undefined" ? instanceIframe.split(",")[1].trim() : "";
          if (iframe.find("body").attr("contenteditable") == "true") {
            iframe.find("body").attr("data-editor", instanceIframe).unbind().on("drop dragdrop", function(e) {
              var items = e.originalEvent.dataTransfer.items;
              if (typeof items !== "undefined") {
                var currentEditor3 = CKEDITOR.instances[q(e.currentTarget).data("editor")];
                if (typeof currentEditor3 !== "undefined") {
                  for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                      api.readImageAsBase64(items[i], currentEditor3);
                    }
                  }
                }
              }
            });
            api.setOnBodyActs(iframe);
          }
        });
      }, 1e3);
    }
  }
  function qualityImages2(src, dst, quality, type) {
    var tmp = new Image(), canvas, context, cW, cH;
    type = type || "image/jpeg";
    quality = quality || state.qualidadeImagens * 0.01;
    cW = src.naturalWidth;
    cH = src.naturalHeight;
    tmp.src = src.src;
    tmp.onload = function() {
      canvas = document.createElement("canvas");
      cW /= 2;
      cH /= 2;
      if (cW < src.width) cW = src.width;
      if (cH < src.height) cH = src.height;
      canvas.width = cW;
      canvas.height = cH;
      context = canvas.getContext("2d");
      context.drawImage(tmp, 0, 0, cW, cH);
      dst.src = canvas.toDataURL(type, quality);
      if (cW <= src.width || cH <= src.height)
        return;
      tmp.src = dst.src;
      setTimeout(() => {
        api.removeDataCkeSavedImg();
      }, 500);
    };
  }
  api.initPasteImgToBase64 = initPasteImgToBase64;
  api.onPastePro = onPastePro;
  api.readImageAsBase64 = readImageAsBase64;
  api.loadPasteImgToBase64 = loadPasteImgToBase64;
  api.tableSorterPro = tableSorterPro;
  api.initContextMenuPro = initContextMenuPro;
  api.initDropImages = initDropImages;
  api.qualityImages = qualityImages2;

  // src/features/editor/view/dialogs/public-process.js
  var public_process_exports = {};
  __export(public_process_exports, {
    checkDadosIframeProcessoPublicoPro: () => checkDadosIframeProcessoPublicoPro,
    getCheckerProcessoPublicoPro: () => getCheckerProcessoPublicoPro,
    getDadosIframeProcessoPublicoPro: () => getDadosIframeProcessoPublicoPro,
    getLinksProcessoPublicoPro: () => getLinksProcessoPublicoPro,
    getListaProcessoPublicoPro: () => getListaProcessoPublicoPro,
    getMinutaWatermark: () => getMinutaWatermark,
    insertAutomaticMinutaWatermark: () => insertAutomaticMinutaWatermark,
    insertMinutaWatermark: () => insertMinutaWatermark,
    loadListaProcessoPublicoPro: () => loadListaProcessoPublicoPro,
    openDialogProcessoPublicoPro: () => openDialogProcessoPublicoPro
  });
  function getCheckerProcessoPublicoPro() {
    if (document.getElementById("frmCheckerProcessoPublicoPro")) return;
    const iframe = document.createElement("iframe");
    iframe.id = "frmCheckerProcessoPublicoPro";
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("style", "width: 1px; height: 1px; position: absolute; top: -100px; display: none;");
    iframe.setAttribute("tabindex", "-1");
    iframe.setAttribute("scrolling", "no");
    document.body.appendChild(iframe);
  }
  function openDialogProcessoPublicoPro(this_) {
    api.setParamEditor(this_);
    const htmlBox = sanitizeHTML(`
        <div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
            <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                <tr>
                    <td style="vertical-align: bottom; text-align: left;" class="label">
                        <label for="processoPub"><i class="iconPopup iconSwitch fas fa-folder-open cinzaColor"></i>Processo:</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="text" id="processoPub">
                    </td>
                </tr>
                <tr>
                    <td style="vertical-align: bottom; text-align: left;" class="label">
                        <label for="captchaPub"><i class="iconPopup iconSwitch fas fa-hashtag cinzaColor"></i>Digite o c\xF3digo:</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="text" id="captchaPub" style="width: 70%;" autocomplete="off">
                        <a id="searchPub_search" class="newLink newLink_active" style="user-select: none;padding-right: 20px;margin: 0 5px;"">
                            <i class="fas fa-search cinzaColor"></i>
                            <span class="txt_cinza" style="font-size: 80%;vertical-align: text-top;">Pesquisar</span>
                        </a>
                        <i id="searchPub_load" class="fas fa-sync-alt fa-spin" style="margin-left: 10px; display:none"></i>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div id="searchPub_captcha" style="margin-bottom: 8px;"></div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div id="searchPub_result" style="display:none; margin-top: 10px;"></div>
                    </td>
                </tr>
                <tr class="trListDocPublico" style="display:none;">
                    <td style="vertical-align: bottom; text-align: left;" class="label">
                        <label for="selectDocPublico"><i class="iconPopup iconSwitch fas fa-file cinzaColor"></i>Documentos:</label>
                    </td>
                </tr>
                <tr class="trListDocPublico" style="display:none;">
                    <td class="label">
                        <select id="selectDocPublico" style="width: 100%;"></select>
                    </td>
                </tr>
            </table>
        </div>
    `);
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = q("#dialogBoxPro").html(htmlBox).dialog({
      title: "Adicionar Link de Documento P\xFAblico",
      width: 600,
      height: 450,
      open: function() {
        initChosenReplace("box_multiple", this, true);
        q(document).off("click", "#searchPub_search").on("click", "#searchPub_search", function(event) {
          event.preventDefault();
          api.loadListaProcessoPublicoPro();
        });
        q(document).off("keypress", "#captchaPub").on("keypress", "#captchaPub", function(event) {
          event.preventDefault();
          if (event.which == 13) {
            api.loadListaProcessoPublicoPro();
          }
        });
        api.getDadosIframeProcessoPublicoPro();
        q("#searchPub_result").html("").hide();
        q("#searchPub_load").hide();
        var processo = typeof dadosProcessoPro.listAndamento !== "undefined" && typeof dadosProcessoPro.listAndamento.processo !== "undefined" ? dadosProcessoPro.listAndamento.processo : "";
        q("#processoPub").val(processo);
      },
      buttons: [{
        text: "Inserir",
        class: "confirm ui-state-active",
        click: function(event) {
          var selectDocPublico = q("#selectDocPublico option:selected");
          var url = selectDocPublico.attr("data-url");
          var doc = selectDocPublico.attr("data-documento");
          var htmlUrl = url == "" ? doc : '<a class="ancoraSei" href="' + url + '" target="_blank">' + doc + "</a>";
          if (typeof selectDocPublico !== "undefined" != "" && selectDocPublico.length) {
            state.oEditor.focus();
            state.oEditor.fire("saveSnapshot");
            state.oEditor.insertHtml(htmlUrl);
            state.oEditor.fire("saveSnapshot");
            resetDialogBoxPro("dialogBoxPro");
          }
        }
      }]
    });
  }
  async function resolveCapchaProcessoPublico() {
    if (typeof perfilGemini !== "undefined" && perfilGemini.KEY_USER && !q(".trListDocPublico").is(":visible") && !delayCrash) {
      const base64ImgCaptcha = await getImageBase64FromImgElement(q("#searchPub_captcha img")[0]);
      const captchaResolve = await resolveCaptchaAI("Quais os caracteres da imagem? Responsa apenas com os caracteres, sem espa\xE7o entre eles", base64ImgCaptcha);
      q("#captchaPub").val(captchaResolve);
      if (q("#processoPub").val() != "") api.loadListaProcessoPublicoPro();
    }
  }
  function getDadosIframeProcessoPublicoPro() {
    if (q("#frmCheckerProcessoPublicoPro").length == 0) {
      api.getCheckerProcessoPublicoPro();
    }
    var url = window.location.origin + "/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0";
    q("#frmCheckerProcessoPublicoPro").attr("src", url).unbind().on("load", function() {
      api.checkDadosIframeProcessoPublicoPro();
    });
  }
  function checkDadosIframeProcessoPublicoPro(TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    var ifrPublico = q("#frmCheckerProcessoPublicoPro").contents();
    if (ifrPublico.find("#seiSearch").length) {
      var captchaImg = ifrPublico.find('#lblCaptcha img, #imgCaptcha, img[src*="captcha" i]').eq(0);
      var captcha = captchaImg.attr("src") || captchaImg.attr("data-src");
      if (!captcha || captcha === "undefined") {
        setTimeout(function() {
          api.checkDadosIframeProcessoPublicoPro(TimeOut - 100);
        }, 500);
        return;
      }
      var htmlCaptcha = '<img src="' + captcha + '"> <button type="button" data-seipro-action="getDadosIframeProcessoPublicoPro" aria-label="Atualizar captcha" class="seipro-icon-button"><i class="fas fa-redo" aria-hidden="true"></i></button>';
      q("#searchPub_captcha").html(htmlCaptcha);
      q("#searchPub_load").hide();
      q("#captchaPub").val("").focus();
      resolveCapchaProcessoPublico();
    } else {
      setTimeout(function() {
        api.checkDadosIframeProcessoPublicoPro(TimeOut - 100);
        console.log("**RELOAD checkDadosIframeProcessoPublicoPro");
      }, 500);
    }
  }
  function loadListaProcessoPublicoPro() {
    delayCrash = true;
    var processo = q("#processoPub").val();
    var captcha = q("#captchaPub").val();
    if (processo != "" && captcha != "") {
      q("#searchPub_load").show();
      var ifrPublico = q("#frmCheckerProcessoPublicoPro").contents();
      ifrPublico.find("#txtProtocoloPesquisa").val(processo);
      ifrPublico.find("#txtCaptcha").val(captcha);
      ifrPublico.find("#sbmPesquisar").trigger("click");
      setTimeout(function() {
        waitLoadPro(q("#frmCheckerProcessoPublicoPro").contents(), "#conteudo", "a.protocoloNormal", api.getListaProcessoPublicoPro);
      }, 800);
    } else {
      alertaBoxPro("Error", "exclamation-triangle", "Digite os campos obrigat\xF3rios!");
      delayCrash = false;
    }
  }
  function getListaProcessoPublicoPro() {
    var ifrPublicoResult = q("#frmCheckerProcessoPublicoPro").contents();
    var htmlResult = ifrPublicoResult.find("#conteudo");
    var htmlValida = ifrPublicoResult.find("#txaInfraValidacao");
    q("#searchPub_load").hide();
    q("#frmCheckerProcessoPublicoPro").unbind();
    if (typeof htmlResult !== "undefined" && htmlResult.html() != "") {
      var linkProcesso = htmlResult.find("a.protocoloNormal").eq(0).attr("href");
      var urlProcesso = window.location.origin + "/sei/modulos/pesquisa/" + linkProcesso;
      if (typeof linkProcesso !== "undefined" && linkProcesso != "") {
        api.getLinksProcessoPublicoPro(urlProcesso);
      } else {
        api.getDadosIframeProcessoPublicoPro();
        q("#searchPub_load").hide();
      }
    }
    delayCrash = false;
  }
  function getLinksProcessoPublicoPro(href) {
    q.ajax({ url: href }).done(function(html) {
      let $html = q(html);
      var listDocumentos = [];
      $html.find("#tblDocumentos").find("tr.infraTrClara").each(function(index) {
        var link = q(this).find("a.ancoraPadraoAzul").attr("onclick");
        link = typeof link !== "undefined" && link != "" ? link.match(/'([^']+)'/)[1] : link;
        link = typeof link !== "undefined" && link != "" ? window.location.origin + "/sei/modulos/pesquisa/" + link : link;
        var data = q(this).find("td").map(function() {
          return q(this).text();
        }).get();
        listDocumentos.push({ link, data });
      });
      var processoDoc = $html.find("#tblCabecalho").find("tr.infraTrClara").eq(0).find("td").eq(1).text();
      var optionSelectDocumentos = "";
      var citacaoDoc = getCitacaoDoc();
      q.each(listDocumentos, function(index, value) {
        var urlDocumento = typeof value.link !== "undefined" ? value.link : "";
        var descDocumento = typeof value.link === "undefined" ? " [DOCUMENTO RESTRITO]" : "";
        optionSelectDocumentos += '<option data-url="' + urlDocumento + '" data-documento="' + value.data[2] + "&nbsp;(" + citacaoDoc + value.data[1] + ')">' + value.data[2] + " (" + citacaoDoc + value.data[1] + ") " + descDocumento + "</option>";
      });
      optionSelectDocumentos += '<option data-url="' + href + '" data-documento="' + processoDoc + '">' + processoDoc + "</option>";
      q(".trListDocPublico").show();
      q("#selectDocPublico").html(optionSelectDocumentos).chosen("destroy").chosen({
        placeholder_text_single: " ",
        no_results_text: "Nenhum resultado encontrado",
        normalize_search_text: function(text) {
          return removeAcentos(text.toLowerCase());
        }
      }).trigger("chosen:updated").trigger("chosen:activate");
      setTimeout(() => {
        q("#selectDocPublico").focus().trigger("chosen:open");
      }, 2e3);
    });
  }
  function insertAutomaticMinutaWatermark() {
    var nomeDocumento = jmespath.search(dadosProcessoPro.listDocumentos, "[?id_protocolo=='" + getParamsUrlPro(window.location.href).id_documento + "'].documento | [0]");
    if (nomeDocumento !== null && nomeDocumento.toLowerCase().indexOf("minuta") !== -1) {
      var maxIframeHeight = { value: 0, index: -1 };
      q("iframe.cke_wysiwyg_frame").each(function(index) {
        if (q(this).contents().find("body").attr("contenteditable") == "true") {
          var height = q(this).height();
          if (height > maxIframeHeight.value) {
            maxIframeHeight = { value: height, index };
          }
        }
      });
      if (maxIframeHeight.index != -1) {
        var elemIframe = q("iframe").eq(maxIframeHeight.index);
        var iframe = elemIframe.contents();
        if (iframe.find(".minutaAncora").length == 0) {
          if (elemIframe.attr("title").indexOf(",") !== -1) {
            q("#idEditor").val(elemIframe.attr("title").split(",")[1].trim());
            api.insertMinutaWatermark(iframe, "auto");
            console.log(q("#idEditor").val());
          }
        }
      }
    } else {
      q("iframe.cke_wysiwyg_frame").each(function(index) {
        var iframe2 = q(this).contents();
        if (iframe2.find("body").attr("contenteditable") == "true") {
          iframe2.find('.minutaAncora[data-type="auto"]').remove();
        }
      });
    }
  }
  function insertMinutaWatermark(iframe, type, mode = "minuta") {
    if (typeof oEditor !== "undefined") {
      var nomeDocumento = jmespath.search(dadosProcessoPro.listDocumentos, "[?id_protocolo=='" + getParamsUrlPro(window.location.href).id_documento + "'].documento | [0]");
      var textMinuta = nomeDocumento !== null && nomeDocumento.toLowerCase().indexOf("modelo") !== -1 || mode == "modelo" ? "MODELO" : "MINUTA";
      var htmlMinuta = '<p class="Texto_Alinhado_Esquerda">\n   <span contenteditable="false" class="minutaAncora" data-type="' + type + '">\n      <a class="ancoraSei" contenteditable="false" style="text-indent:0;">\n          <style type="text/css" data-style="seipro-watermark">\n              body:after { content: "' + textMinuta + `"; font-size: 9em; color: rgb(167 167 167 / 20%); z-index: 999; display: flex; align-items: center; justify-content: center; position: fixed; transform: rotate(-45deg); top: 0; right: 0; left: 0; bottom: 0; pointer-events: none; user-select: none; font-family: Arial; }
              html.dark-mode .minutaAncora, html.dark-mode .minutaAncora:after { background: #6f7071 !important; color: #f9f9f9 !important; }
              .minutaAncora { text-indent: 0; font-size: .8em; padding: 2px 5px; background: #e4e4e4; border-radius: 5px; font-weight: bold; color:#d45656; margin: 0 5px; }
              body.cke_editable .minutaAncora:after { content: " [delete isto para remover a marca d'agua]"; color:#888; font-weight: normal; font-size: .85em; margin: 0 5px; }
              body.cke_editable:after { width: fit-content; margin: 0 33%; overflow: hidden; }
          </style>
          * ` + textMinuta + " DE DOCUMENTO      </a>   </span>&nbsp;&nbsp;\n</p>\n";
      state.oEditor.focus();
      state.oEditor.fire("saveSnapshot");
      iframe.find("body").prepend(htmlMinuta);
      state.oEditor.fire("saveSnapshot");
      enableButtonSavePro();
    }
  }
  function getMinutaWatermark(this_) {
    api.setParamEditor(this_);
    var minutaAncora = state.iframeEditor.find(".minutaAncora");
    if (minutaAncora.length == 0) {
      api.insertMinutaWatermark(state.iframeEditor, "manual");
    } else {
      if (minutaAncora.text().indexOf("MINUTA") !== -1) {
        minutaAncora.closest("p").remove();
        api.insertMinutaWatermark(state.iframeEditor, "manual", "modelo");
      } else {
        minutaAncora.closest("p").remove();
        api.insertMinutaWatermark(state.iframeEditor, "manual");
      }
      var minutaAncora_new = state.iframeEditor.find(".minutaAncora");
      minutaAncora_new.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
      minutaAncora_new.get(0).scrollIntoView();
    }
  }
  api.getCheckerProcessoPublicoPro = getCheckerProcessoPublicoPro;
  api.openDialogProcessoPublicoPro = openDialogProcessoPublicoPro;
  api.getDadosIframeProcessoPublicoPro = getDadosIframeProcessoPublicoPro;
  api.checkDadosIframeProcessoPublicoPro = checkDadosIframeProcessoPublicoPro;
  api.loadListaProcessoPublicoPro = loadListaProcessoPublicoPro;
  api.getListaProcessoPublicoPro = getListaProcessoPublicoPro;
  api.getLinksProcessoPublicoPro = getLinksProcessoPublicoPro;
  api.insertAutomaticMinutaWatermark = insertAutomaticMinutaWatermark;
  api.insertMinutaWatermark = insertMinutaWatermark;
  api.getMinutaWatermark = getMinutaWatermark;

  // src/features/editor/view/save-repair.js
  var save_repair_exports = {};
  __export(save_repair_exports, {
    repairSaveButtonBug: () => repairSaveButtonBug
  });
  function repairSaveButtonBug(loop = true) {
    if (q(".cke_button.cke_button__save").hasClass("cke_button_off")) {
      for (var i in CKEDITOR.instances) {
        var edit = CKEDITOR.instances[i];
        if (!edit.readOnly) {
          edit.on("saveSnapshot", habilitaSalvar);
          edit.on("key", habilitaSalvar);
          edit.on("afterCommandExec", habilitaSalvar);
          edit.on("tableResize", habilitaSalvar);
        } else {
          edit.document.$.body.style.background = readOnlyColor;
        }
      }
      redimensionar();
      console.log("reparSaveButtonBug");
    }
    if (loop) {
      setTimeout(function() {
        api.repairSaveButtonBug(false);
      }, 3e3);
    }
  }
  api.repairSaveButtonBug = repairSaveButtonBug;

  // src/features/editor/view/inline-tips.js
  var inline_tips_exports = {};
  __export(inline_tips_exports, {
    centralizeTapTip: () => centralizeTapTip,
    clickScroolToRef: () => clickScroolToRef2,
    evtInlineOpenAI: () => evtInlineOpenAI,
    getCharOnCursor: () => getCharOnCursor2,
    getNiveisParagrafos: () => getNiveisParagrafos,
    getRefInterna: () => getRefInterna,
    getTextTagTip: () => getTextTagTip,
    hoverTapTip: () => hoverTapTip,
    keyActionEditor: () => keyActionEditor,
    keyupActionEditor: () => keyupActionEditor,
    renderTagsTips: () => renderTagsTips,
    replaceTextOnEditor: () => replaceTextOnEditor,
    restoreIframeDisplayLink: () => restoreIframeDisplayLink,
    selectTextOnEditor: () => selectTextOnEditor,
    setOnKeyEditor: () => setOnKeyEditor,
    setTagTip: () => setTagTip,
    showInteressadosTips: () => showInteressadosTips,
    showTagsTips: () => showTagsTips,
    updateRefsInternas: () => updateRefsInternas
  });
  function setOnKeyEditor(destroy = false) {
    if ((!state.loadOnKeyEditor || state.loadOnKeyEditor != state.oEditor.name) && !destroy) {
      state.oEditor.on("key", function(evt) {
        var self = this;
        var event = evt;
        api.keyActionEditor(event, self);
        setTimeout(function() {
          evtInlineOpenAI(event);
          api.keyupActionEditor(event, self);
        }, 10);
      });
      state.loadOnKeyEditor = state.oEditor.name;
    } else if (destroy) {
      removeOptionsPro("setInlineAI");
    }
  }
  function evtInlineOpenAI(evt) {
    const keyCode = evt?.data?.keyCode ?? evt?.keyCode;
    const config = readAiEditorConfig();
    if (keyCode !== 13 || !config.inlineEnabled) return false;
    const keyword = config.keyword;
    const start = state.oEditor?.getSelection?.().getStartElement?.();
    const paragraph = start?.$?.closest?.("p") || q(start?.$).closest("p").get(0);
    const text = String(paragraph?.textContent || "");
    const index = text.indexOf(keyword);
    if (index < 0) return false;
    const prompt = text.slice(index + keyword.length).trim();
    if (!prompt) return false;
    requestAiInline({
      editorId: state.oEditor?.name || state.idEditor || "",
      prompt,
      marker: text
    });
    return true;
  }
  function keyupActionEditor(evt, self) {
    const editor = self || state.oEditor;
    const startElement = editor?.getSelection?.()?.getStartElement?.()?.$;
    const pElement = q(startElement).closest("p");
    if (!pElement.length) return false;
    const text = String(pElement.text() || "");
    const keyCode = evt?.data?.keyCode ?? evt?.keyCode;
    const interactiveWriting = verifyConfigValue("escrivainterativa");
    const canSuggest = !pElement.find(".imgBgAncora").length && !pElement.find(".minutaAncora").length;
    const iframe = q(editor?.container?.$).find("iframe").contents();
    if (interactiveWriting && canSuggest && (keyCode == 2228275 || text.includes("#"))) {
      api.showTagsTips(pElement[0], iframe);
    } else if (interactiveWriting && canSuggest && (keyCode == 2228274 || text.includes("@"))) {
      api.showInteressadosTips(pElement[0], iframe);
    }
    return true;
  }
  function keyActionEditor(evt, self) {
    const editor = self || state.oEditor;
    const startElement = editor?.getSelection?.()?.getStartElement?.()?.$;
    const pElement = q(startElement).closest("p");
    if (!pElement.length) return false;
    if (verifyConfigValue("escrivainterativa")) {
      if ((evt.data.keyCode == 40 || evt.data.keyCode == 38) && pElement.find(".linkDisplayPro").length) {
        evt.cancel();
        evt.stop();
        state.indexDisplayPro = evt.data.keyCode == 40 ? state.indexDisplayPro + 1 : state.indexDisplayPro;
        state.indexDisplayPro = evt.data.keyCode == 38 ? state.indexDisplayPro - 1 : state.indexDisplayPro;
        state.indexDisplayPro = state.indexDisplayPro < 0 ? 0 : state.indexDisplayPro;
      } else if ((evt.data.keyCode == 13 || evt.data.keyCode == 9) && pElement.find(".linkDisplayPro").length) {
        evt.cancel();
        evt.stop();
        pElement.find(".linkDisplayPro li.highlighted").trigger("click");
        return false;
      }
    }
  }
  function getTextTagTip(keyCode = "#") {
    var e = state.oEditor;
    var r = state.oEditor.getSelection().getRanges()[0];
    r.collapse(1);
    r.setStartAt((r.startPath().block || r.startPath().blockLimit).getFirst(), CKEDITOR.POSITION_AFTER_START);
    var docFr = r.cloneContents();
    var textP = docFr.$.textContent;
    textP = textP.indexOf(keyCode) !== -1 ? textP.split(keyCode)[1].trim() : false;
    textP = textP ? textP.replace(invisibleCharacters, "") : textP;
    return textP;
  }
  function showInteressadosTips(this_, iframeDoc) {
    var textTip = api.getTextTagTip("@");
    var index = 0;
    if (textTip && textTip != "") {
      state.lastTextTip = textTip;
      getInteressadosProcesso(textTip, function(result) {
        state.resultTextTip = result;
        api.renderTagsTips(this_, iframeDoc, textTip, result);
      });
    } else {
    }
  }
  function renderTagsTips(this_, iframeDoc, textTip, result) {
    var htmlTips = q.map(result, function(v, i) {
      return `<li contenteditable='false' data-text='<span contenteditable="false" style="text-indent:0px;" class="ancoraSei interessadoSeiPro" data-id="` + v.id + '">' + v.descricao + "</span>&nbsp;' data-id='" + v.id + "' data-keycode='@' data-index='" + i + "' data-texttip='" + textTip + "' data-seipro-hover='hoverTapTip' data-seipro-action='setTagTip' class='" + (state.indexDisplayPro == i ? "highlighted" : "") + "'>" + v.descricao + "</li>";
    }).join("");
    htmlTips = htmlTips == "" ? "<li contenteditable='false' style='padding: 5px; cursor:pointer'>Nenhum resultado encontrado</li>" : htmlTips;
    var html = '<div class="linkDisplayPro" unselectable="on" contenteditable="false">  <ul>    ' + htmlTips + "  </ul></div>";
    iframeDoc.find(".linkDisplayPro").remove();
    q(this_).append(html);
    api.replaceTextOnEditor("@", '<a name="tagtip"></a></span>@');
    api.centralizeTapTip(this_);
  }
  function showTagsTips(this_, iframeDoc) {
    var textTip = api.getTextTagTip();
    var index = 0;
    var listDocumentos = q.map(listProcessDocuments(globalThis), function(v) {
      var select_text = v.nr_sei != "" ? v.documento + " (" + v.nr_sei + ")" : v.documento;
      var citacaoDoc = getCitacaoDoc();
      var referenceNumber = String(v.nr_sei || v.numeroSEI || v.numero || "").trim();
      var linkText = referenceNumber || String(v.documento || "").trim();
      var nrSeiHtml = buildProcessDocumentReference({ ...v, nr_sei: linkText });
      var citacaoDocumento = referenceNumber || getConfigValue("citacaodoc") == "citacaodoc_4" ? v.documento.trim() + "&nbsp;(" + citacaoDoc + nrSeiHtml + ")" : nrSeiHtml;
      if (v.documento != "") {
        return [[select_text, citacaoDocumento]];
      }
    });
    var listDadosProcesso = api.arrayDadosEditor();
    var listTagTip = listDadosProcesso.concat(listDocumentos);
    var htmlTips = q.map(listTagTip, function(v) {
      var txtTag = !!v[0] ? removeAcentos(v[0]).replace(/[^\x00-\x7F]/g, "").toLowerCase() : false;
      var txtTip = !!v[0] ? removeAcentos(textTip).replace(/[^\x00-\x7F]/g, "").toLowerCase() : false;
      var checkTag = txtTag && txtTip ? txtTag.includes(txtTip) : false;
      if (!!v[1] && (!textTip || textTip == "" || checkTag)) {
        index++;
        return "<li contenteditable='false' data-text='" + v[1] + "' data-keycode='#' data-index='" + index + "' data-texttip='" + textTip + "' data-seipro-hover='hoverTapTip' data-seipro-action='setTagTip' class='" + (state.indexDisplayPro == index - 1 ? "highlighted" : "") + "'>" + v[0] + "</li>";
      }
    }).join("");
    htmlTips = htmlTips == "" ? "<li contenteditable='false' style='padding: 5px; cursor:pointer'>Nenhum resultado encontrado</li>" : htmlTips;
    var html = '<div class="linkDisplayPro" unselectable="on" contenteditable="false">  <ul>    ' + htmlTips + "  </ul></div>";
    iframeDoc.find(".linkDisplayPro").remove();
    q(this_).append(html);
    api.replaceTextOnEditor("#", '<a name="tagtip"></a></span>#');
    api.centralizeTapTip(this_);
  }
  function centralizeTapTip(this_) {
    var boxDisplayLink = q(this_).find(".linkDisplayPro");
    var boxDisplayLink_offset = q(this_).find('a[name="tagtip"]').offset();
    if (typeof boxDisplayLink_offset !== "undefined") {
      var elemBody = q('iframe[title*="' + oEditor.name + '"]').contents().find("body");
      var ckeContent = q('iframe[title*="' + state.oEditor.name + '"]').closest(".cke_contents");
      var heightBody = elemBody.height();
      var boxDisplayLink_left = boxDisplayLink_offset.left;
      var boxDisplayLink_top = boxDisplayLink_offset.top;
      var boxDisplayLink_width = boxDisplayLink.width();
      var windowWidth = q(window).width();
      var marginTop = boxDisplayLink_top + 223 > heightBody ? "-240px" : "15px";
      var leftBox = boxDisplayLink_left + boxDisplayLink_width > windowWidth ? void 0 : boxDisplayLink_left;
      var rightBox = boxDisplayLink_left + boxDisplayLink_width > windowWidth ? windowWidth - boxDisplayLink_left - 40 : void 0;
      rightBox = windowWidth / 3 * 2 > boxDisplayLink_left && boxDisplayLink_left > windowWidth / 3 ? (windowWidth - boxDisplayLink_width) / 2 : rightBox;
      if (heightBody < 250) {
        elemBody.css({ "margin-bottom": "250px" });
        ckeContent.addClass("resizeDisplayLink");
        marginTop = boxDisplayLink_top > 250 ? marginTop : "15px";
      }
      boxDisplayLink.css({ "margin-top": marginTop, "left": leftBox, "right": rightBox, top: boxDisplayLink_offset.top });
      q(this_).find('a[name="tagtip"]').remove();
      if (!q(this_).find(".linkDisplayPro ul li.highlighted").length) {
        q(this_).find(".linkDisplayPro ul li").eq(0).addClass("highlighted");
        state.indexDisplayPro = 0;
      }
      if (state.indexDisplayPro > 6) q(this_).find(".linkDisplayPro ul").scrollTop(29.5 * (state.indexDisplayPro - 6));
    }
  }
  function hoverTapTip(this_) {
    var _this = q(this_);
    _this.closest("ul").find("li.highlighted").removeClass("highlighted");
    _this.addClass("highlighted");
    state.indexDisplayPro = _this.data("index");
  }
  function setTagTip(this_) {
    var _this = q(this_);
    var textTip = api.getTextTagTip();
    var textTip = _this.data("texttip");
    var textReplace = _this.data("text");
    var keyCode = _this.data("keycode");
    var select = state.oEditor.getSelection().getStartElement();
    var pElement = q(select.$).closest("p");
    q(state.oEditor.getSelection().getStartElement().$).closest("p").find(".linkDisplayPro").remove();
    api.replaceTextOnEditor(keyCode + textTip, textReplace);
    state.indexDisplayPro = 0;
    state.lastTextTip = false;
    state.resultTextTip = false;
    api.restoreIframeDisplayLink();
  }
  function restoreIframeDisplayLink() {
    if (typeof oEditor !== "undefined" && typeof state.oEditor.name !== "undefined") {
      var elemBody = q('iframe[title*="' + state.oEditor.name + '"]').contents().find("body");
      var ckeContent = q('iframe[title*="' + oEditor.name + '"]').closest(".cke_contents");
      if (ckeContent.hasClass("resizeDisplayLink")) {
        elemBody.css({ "margin-bottom": "0" });
        ckeContent.removeClass("resizeDisplayLink");
      }
    }
  }
  var storeCursorLocation2 = function(oEditor2) {
    state.bookmark = state.oEditor.getSelection().createBookmarks(true);
  };
  var restoreCursorLocation = function(oEditor2) {
    state.oEditor.getSelection().selectBookmarks(state.bookmark);
  };
  function replaceTextOnEditor(findString, replaceString) {
    state.oEditor.focus();
    storeCursorLocation2(state.oEditor);
    var sel = state.oEditor.getSelection();
    var element = sel.getStartElement();
    var data = element.getHtml();
    var replaced_text = data.replace(invisibleCharacters, "").replace(findString, replaceString);
    element.setHtml(replaced_text);
    restoreCursorLocation(state.oEditor);
  }
  function selectTextOnEditor(findString) {
    try {
      var sel = state.oEditor.getSelection();
      var element = sel.getStartElement();
      var pElement = q(element.$).closest("p");
      pElement.html(pElement.html().replace(/^\n|\n$/g, ""));
      sel.selectElement(element);
      var ranges = state.oEditor.getSelection().getRanges();
      var startIndex = element.getHtml().indexOf(findString);
      if (startIndex != -1) {
        ranges[0].setStart(element.getFirst(), startIndex);
        ranges[0].setEnd(element.getFirst(), startIndex + findString.length);
        console.log([ranges[0]]);
        sel.selectRanges([ranges[0]]);
        var range = sel.getRanges()[0];
        range.deleteContents();
        range.select();
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  function getRefInterna(this_) {
    api.setParamEditor(this_);
    let listP = api.getNiveisParagrafos();
    listP = listP ? q.map(listP, function(v) {
      return '<option value="' + v.ref + "-" + v.item + '">' + v.item + ". " + v.text.replace(/^(.{50}[^\s]*).*/, "$1") + "...</option>";
    }).join("") : false;
    const htmlBox = sanitizeHTML(`
        <div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
            <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                <tr>
                    <td style="vertical-align: bottom; text-align: left;" class="label">
                        <label for="prefixo"><i class="iconPopup iconSwitch fas fa-text-size cinzaColor"></i>Prefixo:</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="text" id="prefixo" style="width:70%">
                        <div style="float: right;">
                            <div class="onoffswitch" style="transform: scale(0.5);display: inline-block;float: left;">
                                <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="hidePrefix" tabindex="0">
                                <label class="onoff-switch-label" for="hidePrefix"></label>
                            </div>
                            <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="hidePrefix">N\xE3o utilizar prefixo</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="vertical-align: bottom; text-align: left;" class="label">
                        <label for="selectRef"><i class="iconPopup iconSwitch fas fa-sort-numeric-down cinzaColor"></i>Par\xE1grafo numerado:</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <select multiple="multiple" id="selectRef">
                        ${listP}
                        </select>
                    </td>
                </tr>
            </table>
        </div>
    `);
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = q("#dialogBoxPro").html(htmlBox).dialog({
      title: "Inserir refer\xEAncia interna",
      width: 800,
      height: 450,
      open: function() {
        initChosenReplace("box_multiple", this, true);
        q("#selectRef").on("change", function() {
          resizeHeigthDialogBox(dialogBoxPro);
        });
      },
      buttons: [{
        text: "Atualizar refer\xEAncias",
        class: "confirm",
        click: function(event) {
          let valuePrefixo = q("#prefixo").val();
          let hidePrefix = q("#hidePrefix").is(":checked");
          hidePrefix = valuePrefixo == "" ? true : hidePrefix;
          api.updateRefsInternas(valuePrefixo, hidePrefix);
          api.clickScroolToRef();
          alertaBoxPro("Sucess", "check-circle", "Refer\xEAncias atualizadas com sucesso");
        }
      }, {
        text: "Inserir",
        class: "confirm ui-state-active",
        click: function(event) {
          const valuePrefixo = q("#prefixo").val();
          const selectMult = q("#selectRef option:checked");
          const list_refs = q.map(selectMult, function(e) {
            if (e.value != "") return e.value;
          });
          let hidePrefix = q("#hidePrefix").is(":checked");
          hidePrefix = valuePrefixo == "" ? true : hidePrefix;
          let htmlRefInterna = "";
          if (q.isArray(list_refs) && list_refs.length) {
            q.each(list_refs, function(i, v) {
              let valueSelect = v.indexOf("-") !== -1 ? v.split("-") : false;
              let refInterna = valueSelect ? ' <a href="#RefPro_' + valueSelect[0] + '" class="ancoraSei refInternaPro anchorRefInternaPro" contenteditable="false">[' + valuePrefixo + " " + valueSelect[1] + "]</a> " : false;
              if (refInterna) htmlRefInterna += refInterna;
              if (i < list_refs.length - 2) htmlRefInterna += ", ";
              if (i == list_refs.length - 2) htmlRefInterna += " e ";
            });
          }
          state.oEditor.focus();
          state.oEditor.fire("saveSnapshot");
          state.oEditor.insertHtml(htmlRefInterna);
          state.oEditor.fire("saveSnapshot");
          api.updateRefsInternas(valuePrefixo, hidePrefix);
          api.clickScroolToRef();
          resetDialogBoxPro("dialogBoxPro");
        }
      }]
    });
  }
  function updateRefsInternas(valuePrefixo, hidePrefix = false) {
    const iframe_ = getEditorIframe();
    const textPrefixo = hidePrefix ? "" : valuePrefixo + " ";
    if (iframe_.find("body").length) {
      const listRefs = api.getNiveisParagrafos();
      if (listRefs) {
        iframe_.find(".refInternaPro").each(function() {
          const _this = q(this);
          let ref_this = _this.attr("href");
          ref_this = ref_this.indexOf("_") !== -1 ? ref_this.split("_")[1] : false;
          let item = ref_this ? jmespath.search(listRefs, "[?ref=='" + ref_this + "'] | [0].item ") : false;
          item = item && item !== null ? item : false;
          if (item) _this.text("[" + textPrefixo + item + "]");
        });
      }
    }
  }
  function getNiveisParagrafos() {
    var iframe_ = getEditorIframe();
    if (iframe_.find("body").length) {
      var i_Paragrafo_Numerado_Nivel1 = 0;
      var i_Paragrafo_Numerado_Nivel2 = 0;
      var i_Paragrafo_Numerado_Nivel3 = 0;
      var i_Paragrafo_Numerado_Nivel4 = 0;
      var i_Item_Nivel1 = 0;
      var i_Item_Nivel2 = 0;
      var i_Item_Nivel3 = 0;
      var i_Item_Nivel4 = 0;
      var arrayParagrafos = [];
      iframe_.find("p").each(function(i) {
        var randRef = randomString(16);
        var iNumerado = false;
        var _this = q(this);
        var hasClass = function(className) {
          return _this.hasClass(className);
        };
        if (hasClass("Paragrafo_Numerado_Nivel1")) {
          i_Paragrafo_Numerado_Nivel1++;
          i_Paragrafo_Numerado_Nivel2 = 0;
          i_Paragrafo_Numerado_Nivel3 = 0;
          i_Paragrafo_Numerado_Nivel4 = 0;
          iNumerado = true;
        }
        if (hasClass("Paragrafo_Numerado_Nivel2")) {
          i_Paragrafo_Numerado_Nivel2++;
          i_Paragrafo_Numerado_Nivel3 = 0;
          i_Paragrafo_Numerado_Nivel4 = 0;
          iNumerado = true;
        }
        if (hasClass("Paragrafo_Numerado_Nivel3")) {
          i_Paragrafo_Numerado_Nivel3++;
          i_Paragrafo_Numerado_Nivel4 = 0;
          iNumerado = true;
        }
        if (hasClass("Paragrafo_Numerado_Nivel4")) {
          i_Paragrafo_Numerado_Nivel4++;
          iNumerado = true;
        }
        if (hasClass("Item_Nivel1")) {
          i_Item_Nivel1++;
          i_Item_Nivel2 = 0;
          i_Item_Nivel3 = 0;
          i_Item_Nivel4 = 0;
          iNumerado = true;
        }
        if (hasClass("Item_Nivel2")) {
          i_Item_Nivel2++;
          i_Item_Nivel3 = 0;
          i_Item_Nivel4 = 0;
          iNumerado = true;
        }
        if (hasClass("Item_Nivel3")) {
          i_Item_Nivel3++;
          i_Item_Nivel4 = 0;
          iNumerado = true;
        }
        if (hasClass("Item_Nivel4")) {
          i_Item_Nivel4++;
          iNumerado = true;
        }
        if (hasClass("sessionBreakPro")) {
          i_Paragrafo_Numerado_Nivel1 = 0;
          i_Paragrafo_Numerado_Nivel2 = 0;
          i_Paragrafo_Numerado_Nivel3 = 0;
          i_Paragrafo_Numerado_Nivel4 = 0;
          i_Item_Nivel1 = 0;
          i_Item_Nivel2 = 0;
          i_Item_Nivel3 = 0;
          i_Item_Nivel4 = 0;
        }
        var item = hasClass("Paragrafo_Numerado_Nivel1") ? i_Paragrafo_Numerado_Nivel1 : "";
        item = hasClass("Paragrafo_Numerado_Nivel2") ? i_Paragrafo_Numerado_Nivel1 + "." + i_Paragrafo_Numerado_Nivel2 : item;
        item = hasClass("Paragrafo_Numerado_Nivel3") ? i_Paragrafo_Numerado_Nivel1 + "." + i_Paragrafo_Numerado_Nivel2 + "." + i_Paragrafo_Numerado_Nivel3 : item;
        item = hasClass("Paragrafo_Numerado_Nivel4") ? i_Paragrafo_Numerado_Nivel1 + "." + i_Paragrafo_Numerado_Nivel2 + "." + i_Paragrafo_Numerado_Nivel3 + "." + i_Paragrafo_Numerado_Nivel4 : item;
        item = hasClass("Item_Nivel1") ? i_Item_Nivel1 : item;
        item = hasClass("Item_Nivel2") ? i_Item_Nivel1 + "." + i_Item_Nivel2 : item;
        item = hasClass("Item_Nivel3") ? i_Item_Nivel1 + "." + i_Item_Nivel2 + "." + i_Item_Nivel3 : item;
        item = hasClass("Item_Nivel4") ? i_Item_Nivel1 + "." + i_Item_Nivel2 + "." + i_Item_Nivel3 + "." + i_Item_Nivel4 : item;
        if (iNumerado) {
          if (_this.find('a[name*="RefPro_"]').length == 0) {
            _this.prepend('<a name="RefPro_' + randRef + '">');
          } else {
            randRef = _this.find('a[name*="RefPro_"]').attr("name").replace("RefPro_", "");
          }
          arrayParagrafos.push({ ref: randRef, item, text: _this.text() });
        }
      });
      return arrayParagrafos;
    } else {
      return false;
    }
  }
  function getEditorIframe() {
    if (state.iframeEditor && typeof state.iframeEditor.find === "function" && state.iframeEditor.find("body").length) {
      return state.iframeEditor;
    }
    if (!state.idEditor) return q();
    var editorFrame = q("#cke_" + state.idEditor).find("iframe").eq(0);
    if (editorFrame.length) return editorFrame.contents();
    return q('iframe[title*="' + state.idEditor + '"]').eq(0).contents();
  }
  function clickScroolToRef2() {
    q("iframe.cke_wysiwyg_frame").each(function(index) {
      var iframe_ = q(this).contents();
      if (iframe_.find("body").attr("contenteditable") == "true") {
        iframe_.find(".anchorRefInternaPro").unbind().on("click", function() {
          var _this = q(this);
          var ref = _this.attr("href");
          ref = typeof ref !== "undefined" ? ref.replace("#", "") : false;
          if (ref) {
            var container = q("#divEditores");
            var element = iframe_.find('a[name="' + ref + '"]').closest("p");
            var position = element.offset().top + 270;
            container.animate({
              scrollTop: position
            });
          }
        });
      }
    });
  }
  function getCharOnCursor2(position = "prev") {
    var range = state.oEditor.getSelection().getRanges()[0], startNode = range.startContainer;
    var pos = position == "prev" ? range.startOffset - 1 : range.startOffset;
    if (startNode.type == CKEDITOR.NODE_TEXT && range.startOffset)
      return startNode.getText()[pos];
    else {
      range.collapse(true);
      range.setStartAt(state.oEditor.editable(), CKEDITOR.POSITION_AFTER_START);
      var walker = new CKEDITOR.dom.walker(range), node;
      while (node = walker.previous()) {
        if (node.type == CKEDITOR.NODE_TEXT)
          return node.getText().slice(-1);
      }
    }
    return null;
  }
  api.setOnKeyEditor = setOnKeyEditor;
  api.evtInlineOpenAI = evtInlineOpenAI;
  api.keyupActionEditor = keyupActionEditor;
  api.keyActionEditor = keyActionEditor;
  api.getTextTagTip = getTextTagTip;
  api.showInteressadosTips = showInteressadosTips;
  api.renderTagsTips = renderTagsTips;
  api.showTagsTips = showTagsTips;
  api.centralizeTapTip = centralizeTapTip;
  api.hoverTapTip = hoverTapTip;
  api.setTagTip = setTagTip;
  api.restoreIframeDisplayLink = restoreIframeDisplayLink;
  api.replaceTextOnEditor = replaceTextOnEditor;
  api.selectTextOnEditor = selectTextOnEditor;
  api.getRefInterna = getRefInterna;
  api.updateRefsInternas = updateRefsInternas;
  api.getNiveisParagrafos = getNiveisParagrafos;
  api.clickScroolToRef = clickScroolToRef2;
  api.getCharOnCursor = getCharOnCursor2;

  // src/features/editor/view/dialogs/review.js
  var review_exports = {};
  __export(review_exports, {
    addCommentReviewPro: () => addCommentReviewPro,
    contentDialogReview: () => contentDialogReview,
    getBoxCtrReview: () => getBoxCtrReview,
    getBoxReview: () => getBoxReview,
    getDialogReview: () => getDialogReview,
    getHtmlReviewDisplayPro: () => getHtmlReviewDisplayPro,
    getStyleReview: () => getStyleReview,
    hideReviewTips: () => hideReviewTips,
    initStyleReview: () => initStyleReview,
    removeReviewPro: () => removeReviewPro,
    scroolToReview: () => scroolToReview,
    setListElementsSelected: () => setListElementsSelected,
    setPositionCursor: () => setPositionCursor,
    setRemoveReviewPro: () => setRemoveReviewPro,
    setStyleReview: () => setStyleReview,
    showReviewTips: () => showReviewTips
  });

  // src/features/editor/domain/review.js
  function pad2(value) {
    return String(value).padStart(2, "0");
  }
  function formatReviewTime(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return [
      `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`,
      `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
    ].join(" ");
  }
  function createReviewMetadata(author = "", value = /* @__PURE__ */ new Date()) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new TypeError("Review time must be a valid date");
    }
    const normalizedAuthor = String(author || "").trim();
    return {
      author: normalizedAuthor,
      time: date.toISOString(),
      legacyDate: formatReviewTime(date),
      attributes: {
        "data-author": normalizedAuthor,
        "data-time": date.toISOString(),
        "data-user-review": normalizedAuthor,
        "data-date-review": formatReviewTime(date)
      }
    };
  }
  function reviewMatchesBulkMode(review = {}, mode = "", currentAuthor = "") {
    if (mode === "acceptAll" || mode === "rejectAll") return true;
    if (mode !== "acceptMine") return false;
    return String(review.author || review.userReview || "").trim() === String(currentAuthor || "").trim();
  }

  // src/features/editor/view/dialogs/review.js
  function setStyleReview(type = "add", mode = "insert", text = "", addSp = false, pClass = false) {
    var reviewMetadata = createReviewMetadata(
      getOptionsPro("usuarioSistema") ? getOptionsPro("usuarioSistema") : ""
    );
    var userReview = reviewMetadata.author;
    var dateReview = reviewMetadata.legacyDate;
    var timeReview = reviewMetadata.time;
    var reviewRef = randomString(8);
    if (mode == "change") {
      var styleBgColor = new CKEDITOR.style({
        element: "span",
        attributes: {
          "data-review": type,
          "data-author": userReview,
          "data-time": timeReview,
          "data-user-review": userReview,
          "data-date-review": dateReview,
          "data-id-review": reviewRef,
          "class": "reviewSeiPro",
          "style": type == "add" ? "background-color: #F0F8FF" : "background-color: #FFF0F5"
        }
      });
      var styleTxtColor = new CKEDITOR.style({
        element: type == "add" ? "u" : "s",
        attributes: {
          "data-review": type,
          "data-author": userReview,
          "data-time": timeReview,
          "data-user-review": userReview,
          "data-date-review": dateReview,
          "data-id-review": reviewRef,
          "class": "reviewSeiPro",
          "style": type == "add" ? "color:#0000FF" : "color:#FF0000"
        }
      });
      state.oEditor.applyStyle(styleBgColor);
      state.oEditor.applyStyle(styleTxtColor);
    } else if (mode == "insert") {
      var inserHtml = '<span data-review="' + type + '" class="reviewSeiPro" data-id-review="' + reviewRef + '" data-author="' + userReview + '" data-time="' + timeReview + '" data-date-review="' + dateReview + '" data-user-review="' + userReview + '" style="background-color:' + (type == "add" ? "#F0F8FF" : "#FFF0F5") + ';"><' + (type == "add" ? "u" : "s") + ' style="color:' + (type == "add" ? "#0000FF" : "#FF0000") + ';">' + text + "</" + (type == "add" ? "u" : "s") + "></span>" + (addSp ? '<span class="reviewSP">&nbsp;</span> ' : "");
      if (pClass) {
        state.oEditor.insertHtml('<p class="' + pClass + '">' + inserHtml + "</p> ");
      } else {
        state.oEditor.insertHtml(inserHtml);
      }
    }
  }
  function showReviewTips(this_, iframeDoc) {
    iframeDoc.find(".reviewDisplayPro").remove();
    var elem = q(this_).closest("span");
    var userReview = elem.attr("data-user-review");
    userReview = q("<div/>").text(userReview).html();
    var dateReview = elem.attr("data-date-review");
    dateReview = q("<div/>").text(dateReview).html();
    var typeReview = elem.attr("data-review");
    var idReview = elem.attr("data-id-review");
    var commentReview = elem.attr("data-comment");
    commentReview = typeof commentReview === "undefined" ? "" : q("<div/>").text(commentReview).html();
    var html = api.getHtmlReviewDisplayPro({
      date: dateReview,
      id_review: idReview,
      type: typeReview,
      user: userReview,
      comment: commentReview,
      text: false
    });
    elem.prepend(html);
    var boxDisplayLink = elem.find(".reviewDisplayPro");
    var boxDisplayLink_left = boxDisplayLink.offset().left;
    var boxDisplayLink_width = boxDisplayLink.width();
    var windowWidth = q(window).width();
    var margin = boxDisplayLink_left + boxDisplayLink_width > windowWidth ? windowWidth - (boxDisplayLink_left + boxDisplayLink_width + 45) : 0;
    boxDisplayLink.css("margin-left", margin);
    console.log(elem[0], iframeDoc);
  }
  function scroolToReview(idReview) {
    q("iframe.cke_wysiwyg_frame").each(function(index) {
      var iframe_ = q(this).contents();
      if (iframe_.find("body").attr("contenteditable") == "true") {
        var container = q("#divEditores");
        var element = iframe_.find('.reviewSeiPro[data-id-review="' + idReview + '"]').closest("p");
        var position = element.offset().top + 200;
        container.animate({
          scrollTop: position
        });
        return false;
      }
    });
  }
  function getHtmlReviewDisplayPro(data, readonly = false) {
    var textCommentReview = data.comment == "" ? "Adicionar coment\xE1rio" : data.comment;
    textCommentReview = data.comment == "" && readonly ? "Nenhum coment\xE1rio" : textCommentReview;
    var html = '<div class="reviewDisplayPro" unselectable="on">    <span contenteditable="false">' + (data.text ? '<span style="margin:5px;display:block;"><span style="background-color:' + (data.type == "add" ? "#F0F8FF" : "#FFF0F5") + ';"><' + (data.type == "add" ? "u" : "s") + ' style="color:' + (data.type == "add" ? "#0000FF" : "#FF0000") + ';">' + data.text + "</" + (data.type == "add" ? "u" : "s") + "></span></span>" : "") + (data.html ? '<div class="textReview" data-seipro-action="scroolToReview" data-seipro-review-id="' + data.id_review + '" title="Clique para rolar at\xE9 o texto">' + data.html + "</div>" : "") + '        <span style="color: #777;font-size: 90%;margin-left:5px;"><i class="fas fa-user" style="padding-right: 5px;font-size: 90%;color: #4285f4;"></i><span class="info"></span><strong class="title-reviewtip" title="' + data.user + '">' + data.user + '</strong></span>        <span style="color: #777;font-size: 80%;margin-left:10px;font-style: italic;"><i class="far fa-clock" style="color: #777;"></i> ' + data.date + '</span>        <span class="action" style="float: right;font-size: 80%;margin-left:10px;cursor:pointer;color: #9CB639;" data-seipro-action="removeReviewPro" data-readonly="' + readonly + '" data-id-review="' + data.id_review + '" data-mode="accept" data-type="' + data.type + '" title="Aceitar revis\xE7\xE3o"><i class="fas fa-check-circle" style="color: #9CB639;"></i> Aceitar</span>        <span class="action" style="float: right;font-size: 80%;margin-left:10px;cursor:pointer;color: #E46E64;" data-seipro-action="removeReviewPro" data-readonly="' + readonly + '" data-id-review="' + data.id_review + '" data-mode="reject" data-type="' + data.type + '" title="Rejeitar revis\xE7\xE3o"><i class="fas fa-times-circle" style="color: #E46E64;"></i> Rejeitar</span>' + (getOptionsPro("usuarioSistema") == data.user && !readonly ? '        <span data-seipro-action="addCommentReviewPro" data-info="' + (data.comment == "" ? "new" : "update") + '" style="color: #777;font-size: 90%;display:block;font-style: italic;margin: 10px 0 5px 0;padding: 5px;border-radius:5px;"><i class="fas fa-comment" style="margin-right: 5px;font-size: 90%;color: #e9af68;transform: scale(-1, 1);"></i><span class="commentReview info" style="padding: 3px;">' + textCommentReview + "<span></span>" : data.comment == "" && !readonly ? "" : '<span style="color: #777;font-size: 90%;display:block;font-style: italic;margin: 10px 0 5px 0;padding: 5px;border-radius:5px;"><i class="fas fa-comment" style="margin-right: 5px;font-size: 90%;color: #e9af68;transform: scale(-1, 1);"></i><span class="commentReview info">' + textCommentReview + "<span></span>") + "    </span></div>";
    return html;
  }
  function addCommentReviewPro(this_) {
    var _this = q(this_);
    var _target = _this.data("readonly") ? _this : _this;
    var _info = _this.find(".commentReview");
    if (_this.attr("data-info") == "new") _info.html("");
    _info.prop("contenteditable", true).focus().on("keydown", function(e) {
      setTimeout(function() {
        var text = _info.text().trim();
        if (text != "") {
          _this.attr("data-info", "update");
          _this.closest(".reviewSeiPro").attr("data-comment", text.replace(/(\r\n|\n|\r)/gm, " ")).attr("data-date-review", createReviewMetadata().legacyDate);
        } else {
          _this.attr("data-info", "new");
          _this.closest(".reviewSeiPro").removeAttr("data-comment");
        }
      }, 100);
    });
  }
  function removeReviewPro(this_) {
    var _this = q(this_);
    var _data = _this.data();
    state.oEditor.fire("saveSnapshot");
    q("iframe.cke_wysiwyg_frame").each(function(index) {
      if (q(this).contents().find("body").attr("contenteditable") == "true") {
        api.setRemoveReviewPro(_this, q(this).contents(), _data);
        state.oEditor.fire("saveSnapshot");
      }
    });
  }
  function setRemoveReviewPro(_this, iframeEditor2, _data) {
    iframeEditor2.find(".reviewDisplayPro").remove();
    if (_data.mode == "acceptAll" || _data.mode == "acceptMine") {
      var currentAuthor = getOptionsPro("usuarioSistema");
      iframeEditor2.find(".reviewSeiPro").each(function() {
        var rv = q(this);
        if (!reviewMatchesBulkMode({
          author: rv.attr("data-user-review")
        }, _data.mode, currentAuthor)) return;
        if (rv.data("review") == "add") {
          rv.prev("span.reviewSP").remove();
          rv.after(rv.text()).remove();
        } else if (rv.data("review") == "delete") {
          rv.remove();
        }
      });
    } else if (_data.mode == "rejectAll") {
      iframeEditor2.find(".reviewSeiPro").each(function() {
        var rv = q(this);
        if (rv.data("review") == "add") {
          rv.prev("span.reviewSP").remove();
          rv.remove();
        } else if (rv.data("review") == "delete") {
          rv.after(rv.text()).remove();
        }
      });
    } else if (_data.mode == "accept") {
      if (_data.type == "add") {
        var elemReview = iframeEditor2.find('span[data-id-review="' + _data.idReview + '"]');
        elemReview.prev("span.reviewSP").remove();
        elemReview.after(elemReview.text()).remove();
        if (_data.readonly) _this.closest(".reviewDisplayPro").slideUp("slow", function() {
          _this.closest(".reviewDisplayPro").remove();
        });
        return false;
      } else if (_data.type == "delete") {
        var elemReview = iframeEditor2.find('span[data-id-review="' + _data.idReview + '"]');
        elemReview.remove();
        if (_data.readonly) _this.closest(".reviewDisplayPro").slideUp("slow", function() {
          _this.closest(".reviewDisplayPro").remove();
        });
        return false;
      }
    } else if (_data.mode == "reject") {
      if (_data.type == "add") {
        var elemReview = iframeEditor2.find('span[data-id-review="' + _data.idReview + '"]');
        elemReview.prev("span.reviewSP").remove();
        elemReview.remove();
        if (_data.readonly) _this.closest(".reviewDisplayPro").slideUp("slow", function() {
          _this.closest(".reviewDisplayPro").remove();
        });
        return false;
      } else if (_data.type == "delete") {
        var elemReview = iframeEditor2.find('span[data-id-review="' + _data.idReview + '"]');
        elemReview.after(elemReview.text()).remove();
        if (_data.readonly) _this.closest(".reviewDisplayPro").slideUp("slow", function() {
          _this.closest(".reviewDisplayPro").remove();
        });
        return false;
      }
    }
    if (_data.mode == "acceptAll" || _data.mode == "acceptMine" || _data.mode == "rejectAll") {
      setTimeout(function() {
        api.contentDialogReview('<span style="font-size: 12pt;"><i class="fas fa-check verdeColor" style="margin-right: 5px;"></i>Revis\xF5es realizadas com sucesso</span>');
        setTimeout(function() {
          CKEDITOR.dialog.getCurrent().hide();
        }, 3e3);
      }, 500);
    }
  }
  function hideReviewTips(iframeDoc) {
    if (iframeDoc.find(".reviewDisplayPro:hover").length == 0) {
      iframeDoc.find(".reviewDisplayPro").remove();
    }
  }
  function getStyleReview(evt) {
    var keycode = evt.data.keyCode;
    var wordKey = evt.data.domEvent.$.key;
    var sel = state.oEditor.getSelection();
    var select = sel.getStartElement();
    var spanElement = q(select.$).closest("span");
    var selectTxt = sel.getSelectedText();
    if (spanElement.hasClass("commentReview")) return false;
    if (selectTxt == "" && keycode == 8 && (spanElement.length == 0 || spanElement.length && spanElement.data("review") != "add")) {
      state.oEditor.fire("saveSnapshot");
      var newRange = api.setPositionCursor();
      var wordDeleted = getCharOnCursor("prev");
      wordDeleted = wordDeleted == " " ? "&nbsp;" : wordDeleted;
      setStyleReview("delete", "insert", wordDeleted);
      sel.selectRanges([newRange]);
      oEditor.fire("saveSnapshot");
    } else if (selectTxt == "" && keycode == 46) {
      state.oEditor.fire("saveSnapshot");
      var newRange = api.setPositionCursor();
      var wordDeleted = getCharOnCursor("next");
      setStyleReview("delete", "insert", wordDeleted);
      oEditor.fire("saveSnapshot");
    } else {
      if (wordKey != "Shift" && wordKey != "Meta" && wordKey.indexOf("Arrow") === -1) {
        if (selectTxt != "") {
          state.oEditor.fire("saveSnapshot");
          var insetSp = keycode == 46 || keycode == 32 ? "" : wordKey;
          insetSp = keycode == 8 ? " " : insetSp;
          if (selectTxt.indexOf("\n\n") !== -1) {
            var listElem = api.setListElementsSelected();
            q.each(listElem, function(i, v) {
              console.log(i, v.attr("class"));
              api.setStyleReview("delete", "insert", v.text(), true, v.attr("class"));
            });
            state.oEditor.fire("saveSnapshot");
          } else {
            api.setStyleReview("delete", "insert", selectTxt, true);
            setStyleReview("add", "insert", insetSp);
            state.oEditor.fire("saveSnapshot");
          }
          var _select = state.oEditor.getSelection().getStartElement();
          var _spanElement = q(_select.$).closest("span");
          if (keycode != 8 && keycode != 46 && _spanElement.length && _spanElement.data("review") == "add") {
            var newRange = api.setPositionCursor();
            setTimeout(function() {
              _spanElement.find("u").text(wordKey);
              state.oEditor.getSelection().selectRanges([newRange]);
            });
          }
        } else {
          if (spanElement.length == 0 || spanElement.length && spanElement.data("review") != "add") {
            state.oEditor.fire("saveSnapshot");
            setStyleReview("add", "change");
            state.oEditor.fire("saveSnapshot");
          }
        }
      }
    }
  }
  function setListElementsSelected() {
    var init = state.oEditor.getSelection().getNative();
    var start = q(init.focusNode.parentNode);
    var end = q(init.baseNode.parentNode);
    var list = [];
    function add(elem) {
      var next = elem.next();
      list.push(elem.clone());
      if (end[0] != elem[0]) add(next);
    }
    add(start);
    return list;
  }
  function setPositionCursor() {
    var oldRanges = state.oEditor.getSelection().getRanges();
    var oldRange = oldRanges[oldRanges.length - 1];
    var newRange = state.oEditor.createRange();
    newRange.setStart(oldRange.endContainer, oldRange.endOffset);
    newRange.setEnd(oldRange.endContainer, oldRange.endOffset);
    return newRange;
  }
  function getBoxCtrReview(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog("ReviewSEI");
  }
  function contentDialogReview(alertText2 = '<span style="font-size: 12pt;"><i class="fas fa-info-circle laranjaColor" style="margin-right: 5px;"></i>Nenhuma revis\xE3o identificada</span>') {
    var listReviews = q('iframe[title*="txaEditor_"]').map(function(v, i) {
      var _this = q(this);
      var body = _this.contents().find("body");
      api.hideReviewTips(_this);
      if (body.attr("contenteditable") == "true") {
        var review = body.find(".reviewSeiPro").map(function() {
          var _data = q(this).data();
          var html = q(this).closest("p").clone().find('.reviewSeiPro[data-id-review="' + _data.idReview + '"]').addClass("reviewHighlights").end().html();
          q(this).find(".reviewDisplayPro").remove();
          return api.getHtmlReviewDisplayPro({
            date: _data.dateReview,
            id_review: _data.idReview,
            type: _data.review,
            user: _data.userReview,
            comment: typeof _data.comment === "undefined" ? "" : _data.comment,
            text: false,
            html
          }, true);
        }).get().join("");
        return review;
      }
    }).get().join("");
    var btnControlReject = '<div style="margin: 10px 0 !important;display: inline-block;width: 95%;">   <span class="action" style="font-size: 11pt;float: right;margin-left:10px;cursor:pointer;color: #9CB639;" data-seipro-action="removeReviewPro" data-mode="acceptAll" title="Aceitar todas as revis\xF5es"><i class="fas fa-check-circle" style="font-size: 11pt;color: #9CB639;"></i> Aceitar todas</span>   <span class="action" style="font-size: 11pt;float: right;margin-left:10px;cursor:pointer;color: #4285F4;" data-seipro-action="removeReviewPro" data-mode="acceptMine" title="Aceitar somente minhas revis\xF5es"><i class="fas fa-user-check" style="font-size: 11pt;color: #4285F4;"></i> Aceitar minhas</span>   <span class="action" style="font-size: 11pt;float: left;margin-left:10px;cursor:pointer;color: #E46E64;" data-seipro-action="removeReviewPro" data-mode="rejectAll" title="Rejeitar todas as revis\xF5es"><i class="fas fa-times-circle" style="font-size: 11pt;color: #E46E64;"></i> Rejeitar todas</span></div>';
    q("#boxReviews").html(listReviews == "" ? alertText2 : btnControlReject + listReviews);
  }
  function getDialogReview() {
    var htmlReview = '<div style="padding-bottom: 10px;overflow: auto;max-height: 400px;text-align: center;" id="boxReviews"></div>';
    CKEDITOR.dialog.add("ReviewSEI", function(editor) {
      return {
        title: "Gerenciar Revis\xF5es",
        minWidth: 700,
        minHeight: 280,
        buttons: [],
        onShow: function() {
          api.contentDialogReview();
        },
        contents: [
          {
            id: "tab1",
            label: "Revis\xF5es",
            elements: [
              {
                type: "html",
                html: htmlReview
              }
            ]
          }
        ]
      };
    });
  }
  function getBoxReview(this_) {
    var btn = q(this_);
    if (btn.hasClass("cke_button_off")) {
      btn.addClass("cke_button_on").removeClass("cke_button_off");
      setReviewButtonLabel(btn, true);
      api.initStyleReview(btn[0]);
    } else {
      btn.addClass("cke_button_off").removeClass("cke_button_on");
      setReviewButtonLabel(btn, false);
    }
  }
  function setReviewButtonLabel(btn, active) {
    var label = active ? "Desativar revis\xE3o de texto" : "Ativar revis\xE3o de texto";
    btn.attr("aria-label", label).attr("onmouseover", "return infraTooltipMostrar('" + label + "')").find(".cke_button_label").text(label);
  }
  function initStyleReview(button2) {
    var editor = state.oEditor;
    var loaded = Array.isArray(window.loadedStyleReview) ? window.loadedStyleReview : [];
    if (loaded.includes(editor.name)) {
      return false;
    } else {
      editor.on("key", function(evt) {
        if (q(button2).hasClass("cke_button_on")) api.getStyleReview(evt);
      });
      loaded.push(editor.name);
      window.loadedStyleReview = loaded;
    }
  }
  api.setStyleReview = setStyleReview;
  api.showReviewTips = showReviewTips;
  api.scroolToReview = scroolToReview;
  api.getHtmlReviewDisplayPro = getHtmlReviewDisplayPro;
  api.addCommentReviewPro = addCommentReviewPro;
  api.removeReviewPro = removeReviewPro;
  api.setRemoveReviewPro = setRemoveReviewPro;
  api.hideReviewTips = hideReviewTips;
  api.getStyleReview = getStyleReview;
  api.setListElementsSelected = setListElementsSelected;
  api.setPositionCursor = setPositionCursor;
  api.getBoxCtrReview = getBoxCtrReview;
  api.contentDialogReview = contentDialogReview;
  api.getDialogReview = getDialogReview;
  api.getBoxReview = getBoxReview;
  api.initStyleReview = initStyleReview;

  // src/features/editor/view/dialogs/ditado.js
  var ditado_exports = {};
  __export(ditado_exports, {
    getBoxCtrDitado: () => getBoxCtrDitado,
    getBoxDitado: () => getBoxDitado,
    getDialogDitado: () => getDialogDitado,
    initDitadoPro: () => initDitadoPro,
    instanceDitadoPro: () => instanceDitadoPro
  });
  function instanceDitadoPro(oEditor2) {
    if (typeof oEditor2.ckWebSpeech === "undefined") {
      if (typeof state.CKWebSpeech !== "function" || !("webkitSpeechRecognition" in window)) {
        q(".getDitadoButton, .getCtrDitadoButton").closest(".cke_iconPro").addClass("cke_button_disabled");
        return false;
      }
      oEditor2.addCommand("webspeechDialog", new CKEDITOR.dialogCommand("webspeechDialog"));
      oEditor2.addCommand("webspeechToogle", {
        exec: function(oEditor3) {
          oEditor3.ckWebSpeech.toogleSpeech();
        }
      });
      var culture = typeof oEditor2.config.ckwebspeech === "undefined" ? void 0 : typeof oEditor2.config.ckwebspeech.culture === "undefined" ? void 0 : oEditor2.config.ckwebspeech.culture;
      oEditor2["ckWebSpeech"] = new state.CKWebSpeech(state.langs, culture, oEditor2);
      oEditor2.config.ckwebspeech = {
        "culture": "pt-BR",
        "commandvoice": "ok",
        // trigger command listener
        "commands": [
          // action list
          { "vai": "plataform_ai" },
          { "newline": "nova linha" },
          { "newparagraph": "novo par\xE1grafo" },
          { "undo": "desfazer" },
          { "redo": "refazer" }
        ]
      };
      if (oEditor2.contextMenu && typeof oEditor2.getMenuItem("webSpeechEnabled") === "undefined") {
        oEditor2.addMenuGroup("webSpeech", -10 * 3);
        oEditor2.addMenuItem(
          "webSpeechEnabled",
          {
            label: "Ditado",
            icon: URL_SPRO + "icons/editor/webspeech.png",
            command: "webspeechToogle",
            group: "webSpeech"
          }
        );
        oEditor2.contextMenu.addListener(function(element) {
          return { webSpeechEnabled: CKEDITOR.TRISTATE_OFF };
        });
      }
    }
  }
  function getBoxDitado(this_) {
    api.setParamEditor(this_);
    var btn = q(this_);
    if (!state.oEditor?.ckWebSpeech || btn.closest(".cke_button_disabled").length) return false;
    if (btn.hasClass("cke_button_off")) {
      btn.addClass("cke_button_on").removeClass("cke_button_off");
    } else {
      btn.addClass("cke_button_off").removeClass("cke_button_on");
    }
    state.oEditor.execCommand("webspeechToogle");
  }
  function getBoxCtrDitado(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog("webspeechDialog");
  }
  function initDitadoPro() {
    state.langs = [
      ["Afrikaans", ["af-ZA"]],
      ["Bahasa Indonesia", ["id-ID"]],
      ["Bahasa Melayu", ["ms-MY"]],
      ["Catal\xE0", ["ca-ES"]],
      ["\u010Ce\u0161tina", ["cs-CZ"]],
      ["Deutsch", ["de-DE"]],
      [
        "English",
        ["en-AU", "Australia"],
        ["en-CA", "Canada"],
        ["en-IN", "India"],
        ["en-NZ", "New Zealand"],
        ["en-ZA", "South Africa"],
        ["en-GB", "United Kingdom"],
        ["en-US", "United States"]
      ],
      [
        "Espa\xF1ol",
        ["es-AR", "Argentina"],
        ["es-BO", "Bolivia"],
        ["es-CL", "Chile"],
        ["es-CO", "Colombia"],
        ["es-CR", "Costa Rica"],
        ["es-EC", "Ecuador"],
        ["es-SV", "El Salvador"],
        ["es-ES", "Espa\xF1a"],
        ["es-US", "Estados Unidos"],
        ["es-GT", "Guatemala"],
        ["es-HN", "Honduras"],
        ["es-MX", "M\xE9xico"],
        ["es-NI", "Nicaragua"],
        ["es-PA", "Panam\xE1"],
        ["es-PY", "Paraguay"],
        ["es-PE", "Per\xFA"],
        ["es-PR", "Puerto Rico"],
        ["es-DO", "Rep\xFAblica Dominicana"],
        ["es-UY", "Uruguay"],
        ["es-VE", "Venezuela"]
      ],
      ["Euskara", ["eu-ES"]],
      ["Fran\xE7ais", ["fr-FR"]],
      ["Galego", ["gl-ES"]],
      ["Hrvatski", ["hr_HR"]],
      ["IsiZulu", ["zu-ZA"]],
      ["\xCDslenska", ["is-IS"]],
      [
        "Italiano",
        ["it-IT", "Italia"],
        ["it-CH", "Svizzera"]
      ],
      ["Magyar", ["hu-HU"]],
      ["Nederlands", ["nl-NL"]],
      ["Norsk bokm\xE5l", ["nb-NO"]],
      ["Polski", ["pl-PL"]],
      [
        "Portugu\xEAs",
        ["pt-BR", "Brasil"],
        ["pt-PT", "Portugal"]
      ],
      ["Rom\xE2n\u0103", ["ro-RO"]],
      ["Sloven\u010Dina", ["sk-SK"]],
      ["Suomi", ["fi-FI"]],
      ["Svenska", ["sv-SE"]],
      ["T\xFCrk\xE7e", ["tr-TR"]],
      ["\u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438", ["bg-BG"]],
      ["P\u0443\u0441\u0441\u043A\u0438\u0439", ["ru-RU"]],
      ["\u0421\u0440\u043F\u0441\u043A\u0438", ["sr-RS"]],
      ["\uD55C\uAD6D\uC5B4", ["ko-KR"]],
      [
        "\u4E2D\u6587",
        ["cmn-Hans-CN", "\u666E\u901A\u8BDD (\u4E2D\u56FD\u5927\u9646)"],
        ["cmn-Hans-HK", "\u666E\u901A\u8BDD (\u9999\u6E2F)"],
        ["cmn-Hant-TW", "\u4E2D\u6587 (\u53F0\u7063)"],
        ["yue-Hant-HK", "\u7CB5\u8A9E (\u9999\u6E2F)"]
      ],
      ["\u65E5\u672C\u8A9E", ["ja-JP"]],
      ["Lingua lat\u012Bna", ["la"]]
    ];
    state.CKWebSpeechHandler = function(oEditor2) {
      this._editor = oEditor2;
      this._currentCulture = { val: "pt-BR", langVal: 19 };
      this._elmtPlugIcon;
      this._plugPath;
      this._recognizing;
      this._recognition;
      this._ignoreOnend;
      this._start_timestamp;
      this._working;
      this.CKWebSpeechHandler();
    };
    state.CKWebSpeechHandler.prototype.CKWebSpeechHandler = function() {
      this._recognition;
      this._plugPath = URL_SPRO;
      this._recognizing = false;
      this._ignoreOnend = false;
      this._working = false;
      this.getElementPluginIcon();
      this.initServiceSpeech();
    };
    state.CKWebSpeechHandler.prototype.isUnlockedService = function() {
      if (!("webkitSpeechRecognition" in window))
        return false;
      return true;
    };
    state.CKWebSpeechHandler.prototype.getElementPluginIcon = function() {
      var obj = this;
      var cont = 0;
      var listener = setInterval(function() {
        cont++;
        var element;
        try {
          element = document.getElementById(obj._editor.ui.instances.Webspeech._.id);
        } catch (err) {
          element = null;
        }
        if (element !== null) {
          obj._elmtPlugIcon = element.getElementsByClassName("cke_button__webspeech_icon")[0];
          clearInterval(listener);
        }
        if (cont == 500) clearInterval(listener);
      }, 1);
    };
    state.CKWebSpeechHandler.prototype.updateIcons = function() {
      var toolbar = q("#cke_" + this._editor.name);
      if (this._recognizing) {
        toolbar.find(".cke_button__ditado_icon").css("background", "url('" + URL_SPRO + "icons/editor/webspeech-enable.gif')");
        toolbar.find(".getDitadoButton").addClass("cke_button_on").removeClass("cke_button_off");
      } else {
        toolbar.find(".cke_button__ditado_icon").css("background", "url('" + URL_SPRO + "icons/editor/webspeech.png')");
        toolbar.find(".getDitadoButton").addClass("cke_button_off").removeClass("cke_button_on");
      }
    };
    state.CKWebSpeechHandler.prototype.initServiceSpeech = function() {
      if (this.isUnlockedService()) {
        this._recognition = new webkitSpeechRecognition();
        this._recognition.continuous = true;
        this._recognition.interimResults = false;
        var self = this;
        this._recognition.onstart = function() {
          self.onStart();
        };
        this._recognition.onerror = function(event) {
          self.onError(event);
        };
        this._recognition.onend = function() {
          self.onEnd();
        };
        this._recognition.onresult = function(event) {
          self.onResult(event);
        };
        this._recognition.onspeechstart = function(event) {
          self.onSpeech();
        };
        this._recognition.onspeechend = function(event) {
          self.onSpeechEnd();
        };
      }
    };
    state.CKWebSpeechHandler.prototype.onStart = function() {
      this._recognizing = true;
      this.updateIcons();
    };
    state.CKWebSpeechHandler.prototype.onError = function(event) {
      if (event.error == "no-speech") {
        this._ignoreOnend = true;
      }
      if (event.error == "audio-capture") {
        this._ignoreOnend = true;
      }
      if (event.error == "not-allowed") {
        if (event.timeStamp - this._start_timestamp < 100) {
        } else {
        }
        this._ignoreOnend = true;
      }
      this.updateIcons();
    };
    state.CKWebSpeechHandler.prototype.onEnd = function() {
      this._recognizing = false;
      this._ignoreOnend = false;
      this.updateIcons();
    };
    state.CKWebSpeechHandler.prototype.onSpeech = function(event) {
    };
    state.CKWebSpeechHandler.prototype.onSpeechEnd = function(event) {
      this.updateIcons();
    };
    state.CKWebSpeechHandler.prototype.onResult = function(event) {
      if (typeof event.results == "undefined") {
        this._recognizing = false;
        this._recognition.onend = null;
        this._recognition.stop();
        this.updateIcons();
        return;
      }
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          var t = " " + event.results[i][0].transcript + " ";
          if (t.match(/.* nova linha .*/) || t.match(/.* ponto final .*/) || t.match(/.* novo par\u00E1grafo .*/)) {
            var l = t.match(/.* nova linha .*/) ? t.trim().split("nova linha") : t;
            l = t.match(/.* ponto final .*/) ? t.trim().split("ponto final") : l;
            l = t.match(/.* novo par\u00E1grafo .*/) ? t.trim().split("novo par\xE1grafo") : l;
            l = l.filter((n) => n);
            if (l.length) {
              var _this = this;
              q.each(l, function(i2, v) {
                if (v.trim() != "") {
                  var ponto = i2 < l.length - 1 ? "." : "";
                  v = _this.replaceTranscript(v);
                  _this._editor.insertText(v + ponto);
                  if (ponto != "") state.oEditor.execCommand("enter");
                }
              });
            } else {
              state.oEditor.execCommand("enter");
            }
          } else if (t.trim().toLocaleLowerCase() == "desfazer") {
            state.oEditor.execCommand("undo");
          } else if (t.trim().toLocaleLowerCase() == "refazer") {
            state.oEditor.execCommand("redo");
          } else {
            t = this.replaceTranscript(t);
            this._editor.insertText(t);
          }
        }
      }
    };
    state.CKWebSpeechHandler.prototype.replaceTranscript = function(t) {
      t = t.match(/.* abre par\u00EAnteses .*/) ? t.replace(/ abre par\u00EAnteses /, "(") : t;
      t = t.match(/.* fecha par\u00EAnteses .*/) ? t.replace(/ fecha par\u00EAnteses /, ")") : t;
      t = t.match(/.* abre colchete .*/) ? t.replace(/ abre colchetes /, "[") : t;
      t = t.match(/.* fecha colchete .*/) ? t.replace(/ fecha colchete /, "]") : t;
      t = t.match(/.* abre aspas .*/) ? t.replace(/ abre aspas /, '"') : t;
      t = t.match(/.* fecha aspas .*/) ? t.replace(/ fecha aspas /, '"') : t;
      t = t.match(/.* espa\u00E7o .*/) ? t.replace(/ espa\u00E7o /, " ") : t;
      t = t.match(/.* aspas .*/) ? t.replace(/ aspas /, '"') : t;
      t = t.match(/.* travess\u00E3o .*/) ? t.replace(/ travess\u00E3o /, " \u2013 ") : t;
      t = t.match(/.* tra\u00E7o .*/) ? t.replace(/ tra\u00E7o /, "- ") : t;
      t = t.match(/.* ponto e v\u00EDrgula .*/) ? t.replace(/ ponto e v\u00EDrgula /, "; ") : t;
      t = t.match(/.* dois pontos .*/) ? t.replace(/ dois pontos /, ": ") : t;
      t = t.match(/.* 2 pontos .*/) ? t.replace(/ 2 pontos /, ": ") : t;
      t = t.match(/.* ponto .*/) ? t.replace(/ ponto /, ". ") : t;
      t = t.match(/.* v\u00EDrgula .*/) ? t.replace(/ v\u00EDrgula /, ", ") : t;
      var iStr = Array.from(t.trim())[0];
      var space = iStr == "," || iStr == ";" || iStr == ":" || iStr == "-" || iStr == "." ? "" : " ";
      return space + t.trim();
    };
    state.CKWebSpeechHandler.prototype.toogleSpeech = function() {
      if (!this._recognition) return false;
      if (!this._recognizing) {
        this._recognition.lang = this._currentCulture.val;
        this._recognition.start();
        this._ignoreOnend = false;
        this._start_timestamp = (/* @__PURE__ */ new Date()).getTime();
      } else {
        this._recognition.stop();
      }
    };
    state.CKWebSpeech = function(langs, culture, oEditor2) {
      state.CKWebSpeechHandler.call(this, oEditor2);
      this._langs = state.langs;
      this.CKWebSpeech(culture);
    };
    state.CKWebSpeech.prototype = Object.create(state.CKWebSpeechHandler.prototype);
    state.CKWebSpeech.prototype.CKWebSpeech = function(_culture) {
      if (typeof _culture !== "undefined")
        this.setDialectByCulture(_culture);
    };
    state.CKWebSpeech.prototype.setDialectByCulture = function(_culture) {
      for (var i = 0; i < this._langs.length; i++) {
        for (var j = 1; j < this._langs[i].length; j++) {
          if (this._langs[i][j][0].toLowerCase() == _culture.toLowerCase()) {
            this._currentCulture = { val: this._langs[i][j][0], langVal: i };
            return this._currentCulture;
          }
        }
        ;
      }
      ;
      return this._currentCulture;
    };
    state.CKWebSpeech.prototype.setDialectByLanguage = function(_langVal) {
      this.setDialectByCulture(this._langs[_langVal][1][0]);
    };
    state.CKWebSpeech.prototype.getLanguages = function() {
      var _languages = new Array();
      for (var i = 0; i < this._langs.length; i++) {
        _languages.push(new Array(this._langs[i][0], i));
      }
      ;
      return _languages;
    };
    state.CKWebSpeech.prototype.getCultures = function(_langVal) {
      if (typeof _langVal === "undefined")
        _langVal = this._currentCulture.langVal;
      var _cultures = new Array();
      for (var i = 1; i < this._langs[_langVal].length; i++) {
        _cultures.push(new Array(this._langs[_langVal][i][0]));
      }
      ;
      return _cultures;
    };
    var extern;
    state.wsDialogHtml = function() {
      this.updateCulturesSelect = function(elmtCulture, options) {
        var select_dialect = document.getElementById(elmtCulture._.inputId);
        for (var i = select_dialect.options.length - 1; i >= 0; i--) {
          select_dialect.remove(i);
        }
        for (var i = 0; i < options.length; i++) {
          select_dialect.options.add(new Option(options[i], options[i]));
        }
      };
    };
  }
  function getDialogDitado() {
    if (checkConfigValue("ditado")) {
      api.initDitadoPro();
      CKEDITOR.dialog.add("webspeechDialog", function(oEditor2) {
        var wsDialogDom = new state.wsDialogHtml();
        var selectCulture = state.oEditor.ckWebSpeech._currentCulture.val;
        return {
          title: "Configura\xE7\xF5es do Ditado",
          minWidth: 400,
          minHeight: 200,
          contents: [
            {
              id: "tab-basic",
              label: "Configura\xE7\xF5es b\xE1sicas",
              elements: [
                {
                  type: "select",
                  id: "wslanguages",
                  label: "Idioma",
                  items: state.oEditor.ckWebSpeech.getLanguages(),
                  "default": state.oEditor.ckWebSpeech._currentCulture.langVal,
                  onChange: function(api2) {
                    var dialog = CKEDITOR.dialog.getCurrent();
                    var selCultures = dialog.getContentElement("tab-basic", "wscultures");
                    var options = state.oEditor.ckWebSpeech.getCultures(api2.data.value);
                    selCultures.setup({ selCultures, options });
                    selCultures.fire("change", { value: options[0][0] }, state.oEditor);
                  },
                  onShow: function(data) {
                    var dialog = CKEDITOR.dialog.getCurrent();
                    var selLanguages = dialog.getContentElement("tab-basic", "wslanguages");
                    document.getElementById(selLanguages._.inputId).value = state.oEditor.ckWebSpeech._currentCulture.langVal;
                  }
                },
                {
                  type: "select",
                  id: "wscultures",
                  label: "Cultura",
                  items: state.oEditor.ckWebSpeech.getCultures(),
                  "default": state.oEditor.ckWebSpeech._currentCulture.val,
                  onChange: function(api2) {
                    selectCulture = api2.data.value;
                  },
                  setup: function(data) {
                    wsDialogDom.updateCulturesSelect(data.selCultures, data.options);
                  },
                  onShow: function(data) {
                    var dialog = CKEDITOR.dialog.getCurrent();
                    var selCultures = dialog.getContentElement("tab-basic", "wscultures");
                    document.getElementById(selCultures._.inputId).value = state.oEditor.ckWebSpeech._currentCulture.val;
                  }
                }
              ]
            },
            {
              id: "tab-adv",
              label: "Advanced Settings",
              elements: []
            }
          ],
          onOk: function() {
            oEditor2.ckWebSpeech.setDialectByCulture(selectCulture);
          }
        };
      });
    }
  }
  api.instanceDitadoPro = instanceDitadoPro;
  api.getBoxDitado = getBoxDitado;
  api.getBoxCtrDitado = getBoxCtrDitado;
  api.initDitadoPro = initDitadoPro;
  api.getDialogDitado = getDialogDitado;

  // src/features/editor/view/style-editor.js
  var style_editor_exports = {};
  __export(style_editor_exports, {
    getBoxStyleEditor: () => getBoxStyleEditor,
    updateStyleEditor: () => updateStyleEditor
  });
  function getBoxStyleEditor(this_) {
    var btn = q(".getNewStyleButton");
    if (btn.hasClass("cke_button_off")) {
      btn.addClass("cke_button_on").removeClass("cke_button_off");
      api.updateStyleEditor("set");
    } else {
      btn.addClass("cke_button_off").removeClass("cke_button_on");
      api.updateStyleEditor("remove");
    }
  }
  function updateStyleEditor(mode) {
    if (mode == "set") {
      localStorage.setItem("seiSlim_editor", true);
      q("head").find('link[data-style="seipro-fonticon"]').remove();
      q("head").find('style[data-style="seipro-fonticon"]').remove();
      if (typeof insertFontIcon === "function") insertFontIcon("head");
      q("body").addClass("seiSlim seiSlim_parent seiSlim_view");
    } else {
      localStorage.removeItem("seiSlim_editor");
      q("body").attr("class", "");
    }
  }
  api.getBoxStyleEditor = getBoxStyleEditor;
  api.updateStyleEditor = updateStyleEditor;

  // src/features/editor/view/boot-functions.js
  var boot_functions_exports = {};
  __export(boot_functions_exports, {
    initFunctions: () => initFunctions
  });
  function initFunctions() {
    api.initContextMenuPro();
    api.getDialogLegisSEI();
    api.getDialogNotaRodape();
    api.getDialogSyleTable();
    api.getDialogQrCode();
    api.getDialogLinkPro();
    api.getDialogPageImageBackground();
    api.initDialogUploadImgBase64();
    api.getDialogSigilo();
    api.getDialogReview();
    api.getDialogDitado();
    api.getDialogBatchImgQuality();
    api.initDialogImageEditorPro();
    api.loadResizeImg();
    if (typeof updateDialogDefinitionPro === "function") updateDialogDefinitionPro();
    api.loadPasteImgToBase64();
    if (typeof insertFontIcon === "function") insertFontIcon("head");
    if (typeof reloadModalLink === "function") reloadModalLink();
    api.setDocCertidao();
    api.setDocAutomatico();
    api.initDropImages();
    if (typeof getStylesOnEditor === "function") getStylesOnEditor();
    api.repairSaveButtonBug();
    clickScroolToRef();
    if (typeof checkLoadJqueryUI === "function") checkLoadJqueryUI();
    var idProcedimento = getParamsUrlPro(window.location.href).id_procedimento;
    if (typeof checkHostLimit === "function" && !checkHostLimit() && typeof getDadosIframeProcessoPro === "function") {
      getDadosIframeProcessoPro(idProcedimento, "editor");
    }
  }
  api.initFunctions = initFunctions;

  // src/features/editor/legacy-api.js
  var migrated = [
    { installEditorStateBridge, setParamEditor, bootEditor },
    toolbar_exports2,
    toolbar_exports,
    styles_exports,
    editor_text_exports,
    formatting_exports,
    sigilo_exports,
    context_menu_exports,
    table_exports,
    legis_link_exports,
    citacao_exports,
    footnotes_exports,
    sigilo_tarja_exports,
    dados_exports,
    sumario_exports,
    qr_exports,
    links_exports,
    images_upload_exports,
    images_editor_exports,
    import_exports,
    editor_images_exports,
    public_process_exports,
    save_repair_exports,
    inline_tips_exports,
    review_exports,
    ditado_exports,
    style_editor_exports,
    boot_functions_exports,
    load_ai_exports
  ];
  function installEditorLegacyApi() {
    installEditorStateBridge();
    [domain_exports2, view_exports2, ...migrated].forEach((mod) => {
      Object.keys(mod).forEach((name) => {
        if (typeof mod[name] === "function") aliasGlobal(name, mod[name]);
      });
    });
  }

  // src/features/editor/domain/citations.js
  var SEI_REFERENCE_PATTERN = /\bSEI(?:\s+n[ºo.]*)?\s*(\d{5,12})\b/giu;
  var LEGAL_REFERENCE_PATTERN = /\b(?:Lei|Decreto|Portaria|Instrução\s+Normativa|Resolução)\s+n[ºo.]?\s*[\d.]+/giu;
  function verifyCitations(html, documents = [], { parseHtml: parseHtml3 } = {}) {
    if (typeof parseHtml3 !== "function") {
      throw new TypeError("verifyCitations requer parseHtml");
    }
    const document2 = parseHtml3(String(html || ""));
    const knownNumbers = new Set(documents.map((item) => String(
      item.numeroSEI || item.nr_sei || item.numero || ""
    ).replace(/\D/g, "")).filter(Boolean));
    const findings = [];
    const seen = /* @__PURE__ */ new Set();
    const add = (finding) => {
      const key = `${finding.type}:${finding.value}`;
      if (seen.has(key)) return;
      seen.add(key);
      findings.push(finding);
    };
    const text = document2.body?.textContent || "";
    if (knownNumbers.size) {
      for (const match of text.matchAll(SEI_REFERENCE_PATTERN)) {
        const number = match[1].replace(/\D/g, "");
        if (!knownNumbers.has(number)) {
          add({
            type: "unknown-sei-reference",
            severity: "error",
            value: number,
            message: `Refer\xEAncia SEI ${number} n\xE3o encontrada no processo`
          });
        }
      }
    }
    Array.from(document2.querySelectorAll("a[data-cke-linksei], a.ancoraSei, a.ancora_sei")).forEach((anchor) => {
      const number = String(anchor.textContent || "").match(/\d{5,12}/)?.[0];
      if (number && knownNumbers.size && !knownNumbers.has(number)) {
        add({
          type: "unknown-sei-reference",
          severity: "error",
          value: number,
          message: `Refer\xEAncia SEI ${number} n\xE3o encontrada no processo`
        });
      }
    });
    Array.from(document2.querySelectorAll("a.legisSeiPro, a[data-norma]")).forEach((anchor) => {
      const href = anchor.getAttribute("href") || anchor.getAttribute("data-cke-saved-href") || "";
      if (!/^https?:\/\//i.test(href)) {
        const value = String(anchor.textContent || anchor.getAttribute("data-norma") || "").trim();
        add({
          type: "broken-legal-citation",
          severity: "error",
          value,
          message: `Cita\xE7\xE3o normativa sem link verific\xE1vel: ${value || "norma sem identifica\xE7\xE3o"}`
        });
      }
    });
    const linkedLegalText = new Set(Array.from(document2.querySelectorAll("a")).map(
      (anchor) => String(anchor.textContent || "").replace(/\s+/g, " ").trim().toLocaleLowerCase()
    ));
    for (const match of text.matchAll(LEGAL_REFERENCE_PATTERN)) {
      const value = match[0].replace(/\s+/g, " ").trim();
      if (![...linkedLegalText].some((linked) => linked.includes(value.toLocaleLowerCase()))) {
        add({
          type: "unlinked-legal-citation",
          severity: "warning",
          value,
          message: `Confira a fonte e o link de \u201C${value}\u201D`
        });
      }
    }
    return findings;
  }

  // src/features/editor/domain/checklist.js
  var REQUIRED_CLASS_PATTERN = /(?:^|[-_\s])(required|required-field|obrigatorio|campo-obrigatorio)(?:$|[-_\s])/i;
  var PLACEHOLDER_PATTERN = /(?:\[\s*(?:preencher|inserir|informar|texto|exemplo)[^\]]*\]|\{\{[^}]+\}\}|_{3,})/i;
  var TEMPLATE_TEXT_PATTERN = /^(?:nome completo|cargo ou fun[cç][aã]o)$/i;
  var TAG_PATTERN = /(^|[\s([{>])#([\p{L}][\p{L}\p{N}_+-]*)/gu;
  function excerpt(value, maxLength = 100) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}\u2026` : text;
  }
  function issue(type, message, context = "", severity = "warning", location2 = null) {
    return {
      id: `${type}:${message}:${context}`,
      type,
      severity,
      message,
      context: excerpt(context),
      location: location2
    };
  }
  function defaultParseHtml(html) {
    if (typeof DOMParser !== "function") {
      throw new TypeError("scanChecklist requires parseHtml outside a browser");
    }
    return new DOMParser().parseFromString(html, "text/html");
  }
  function scanChecklist(html, { parseHtml: parseHtml3 = defaultParseHtml, documents = [] } = {}) {
    const document2 = parseHtml3(String(html ?? ""));
    const issues = [];
    const bodyText = document2.body?.textContent || document2.documentElement?.textContent || "";
    const seenTags = /* @__PURE__ */ new Set();
    for (const match of bodyText.matchAll(TAG_PATTERN)) {
      const tag = `#${match[2]}`;
      if (!seenTags.has(tag.toLocaleLowerCase())) {
        seenTags.add(tag.toLocaleLowerCase());
        issues.push(issue("unresolved-tag", `Campo din\xE2mico n\xE3o resolvido: ${tag}`, tag, "error", {
          kind: "text",
          value: tag
        }));
      }
    }
    Array.from(document2.querySelectorAll("p")).forEach((paragraph, index) => {
      const text = String(paragraph.textContent || "").replace(/\u00a0/g, " ").trim();
      const className = paragraph.getAttribute("class") || "";
      const explicitlyRequired = paragraph.hasAttribute("required") || paragraph.getAttribute("aria-required") === "true" || paragraph.getAttribute("data-required") === "true" || REQUIRED_CLASS_PATTERN.test(className);
      const previousText = String(paragraph.previousElementSibling?.textContent || "").trim();
      const followsShortLabel = !text && previousText.length > 0 && previousText.length <= 80 && /:\s*$/.test(previousText);
      if (!text && (explicitlyRequired || followsShortLabel) || PLACEHOLDER_PATTERN.test(text) || TEMPLATE_TEXT_PATTERN.test(text)) {
        issues.push(issue(
          "required-field",
          text ? "Campo obrigat\xF3rio ainda cont\xE9m um marcador" : "Campo obrigat\xF3rio aparentemente vazio",
          text || previousText || `Paragraph ${index + 1}`,
          "error",
          { kind: "paragraph", index }
        ));
      }
    });
    const reviewNodes = Array.from(document2.querySelectorAll(
      ".reviewSeiPro, [data-review], .seipro-review-pending, .pending-review"
    ));
    const reviewMarks = new Set(reviewNodes.map(
      (node, index) => node.getAttribute("data-id-review") || `node-${index}`
    ));
    if (reviewMarks.size) {
      issues.push(issue(
        "pending-review",
        `${reviewMarks.size} marca(s) de revis\xE3o pendente(s)`,
        reviewNodes.map((node) => node.textContent).join(" "),
        "error",
        { kind: "selector", value: ".reviewSeiPro, [data-review]" }
      ));
    }
    Array.from(document2.querySelectorAll('a[href^="#"]')).forEach((anchor) => {
      const href = anchor.getAttribute("href");
      const target = href?.slice(1);
      if (!target) return;
      let decodedTarget = target;
      try {
        decodedTarget = decodeURIComponent(target);
      } catch {
      }
      const destination = document2.getElementById(decodedTarget) || document2.getElementsByName?.(decodedTarget)?.[0];
      if (!destination) {
        issues.push(issue(
          "broken-reference",
          `Refer\xEAncia interna quebrada: #${decodedTarget}`,
          anchor.textContent || href,
          "error",
          { kind: "selector", value: `a[href="#${target}"]` }
        ));
      }
    });
    verifyCitations(html, documents, { parseHtml: parseHtml3 }).forEach((finding) => {
      issues.push(issue(
        finding.type,
        finding.message,
        finding.value,
        finding.severity,
        { kind: "text", value: finding.value }
      ));
    });
    return {
      issues,
      counts: issues.reduce((counts, item) => {
        counts[item.type] = (counts[item.type] || 0) + 1;
        return counts;
      }, {}),
      ok: issues.length === 0
    };
  }

  // src/features/editor/io/drafts.js
  var DEFAULT_DB_NAME = "seipro-editor";
  var DEFAULT_STORE_NAME = "drafts";
  var DEFAULT_MAX_SNAPSHOTS = 20;
  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDB request failed"));
    });
  }
  function transactionDone(transaction) {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("IndexedDB transaction failed"));
      transaction.onabort = () => reject(transaction.error || new Error("IndexedDB transaction aborted"));
    });
  }
  function normalizeDraftContext({ processId, documentId } = {}) {
    const normalizedProcessId = String(processId || "").trim();
    const normalizedDocumentId = String(documentId || "").trim();
    if (!normalizedProcessId || !normalizedDocumentId) {
      throw new TypeError("Drafts require processId and documentId");
    }
    return {
      processId: normalizedProcessId,
      documentId: normalizedDocumentId,
      contextKey: `${normalizedProcessId}:${normalizedDocumentId}`
    };
  }
  function createIndexedDbDraftAdapter({
    indexedDB = globalThis.indexedDB,
    dbName = DEFAULT_DB_NAME,
    storeName = DEFAULT_STORE_NAME
  } = {}) {
    if (!indexedDB || typeof indexedDB.open !== "function") {
      throw new Error("IndexedDB is not available");
    }
    let databasePromise;
    function openDatabase2() {
      if (!databasePromise) {
        databasePromise = new Promise((resolve, reject) => {
          const request = indexedDB.open(dbName, 1);
          request.onupgradeneeded = () => {
            const database = request.result;
            const store = database.objectStoreNames.contains(storeName) ? request.transaction.objectStore(storeName) : database.createObjectStore(storeName, { keyPath: "id" });
            if (!store.indexNames.contains("contextKey")) {
              store.createIndex("contextKey", "contextKey", { unique: false });
            }
          };
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error || new Error("Unable to open the draft database"));
        });
      }
      return databasePromise;
    }
    return {
      async put(record) {
        const database = await openDatabase2();
        const transaction = database.transaction(storeName, "readwrite");
        transaction.objectStore(storeName).put(record);
        await transactionDone(transaction);
        return record;
      },
      async get(id) {
        const database = await openDatabase2();
        const transaction = database.transaction(storeName, "readonly");
        return requestResult(transaction.objectStore(storeName).get(id));
      },
      async getAllByContext(contextKey) {
        const database = await openDatabase2();
        const transaction = database.transaction(storeName, "readonly");
        const index = transaction.objectStore(storeName).index("contextKey");
        return requestResult(index.getAll(contextKey));
      },
      async delete(id) {
        const database = await openDatabase2();
        const transaction = database.transaction(storeName, "readwrite");
        transaction.objectStore(storeName).delete(id);
        await transactionDone(transaction);
      }
    };
  }
  function createDraftRepository({
    adapter,
    now = () => /* @__PURE__ */ new Date(),
    createId = () => globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
    maxSnapshots = DEFAULT_MAX_SNAPSHOTS
  } = {}) {
    if (!adapter) throw new TypeError("A draft storage adapter is required");
    async function listDrafts2(context) {
      const normalized = normalizeDraftContext(context);
      const drafts = await adapter.getAllByContext(normalized.contextKey);
      return drafts.slice().sort((left, right) => right.savedAt.localeCompare(left.savedAt));
    }
    async function saveDraft2({ processId, documentId, editors = {}, title = "", sourceUrl = "" } = {}) {
      const context = normalizeDraftContext({ processId, documentId });
      const savedAt = now().toISOString();
      const normalizedEditors = Object.fromEntries(
        Object.entries(editors).map(([id, html]) => [String(id), String(html ?? "")])
      );
      const record = {
        id: `${context.contextKey}:${savedAt}:${createId()}`,
        ...context,
        savedAt,
        title: String(title || ""),
        sourceUrl: String(sourceUrl || ""),
        editors: normalizedEditors
      };
      await adapter.put(record);
      const drafts = await listDrafts2(context);
      await Promise.all(drafts.slice(maxSnapshots).map((draft) => adapter.delete(draft.id)));
      return record;
    }
    async function loadDraft2({ processId, documentId, draftId } = {}) {
      const context = normalizeDraftContext({ processId, documentId });
      if (draftId) {
        const draft = await adapter.get(String(draftId));
        return draft?.contextKey === context.contextKey ? draft : null;
      }
      return (await listDrafts2(context))[0] || null;
    }
    async function deleteDraft2({ processId, documentId, draftId } = {}) {
      const context = normalizeDraftContext({ processId, documentId });
      if (draftId) {
        const draft = await adapter.get(String(draftId));
        if (!draft || draft.contextKey !== context.contextKey) return false;
        await adapter.delete(draft.id);
        return true;
      }
      const drafts = await listDrafts2(context);
      await Promise.all(drafts.map((draft) => adapter.delete(draft.id)));
      return drafts.length;
    }
    return { saveDraft: saveDraft2, loadDraft: loadDraft2, listDrafts: listDrafts2, deleteDraft: deleteDraft2 };
  }
  var defaultRepository;
  function getDraftRepository() {
    if (!defaultRepository) {
      defaultRepository = createDraftRepository({ adapter: createIndexedDbDraftAdapter() });
    }
    return defaultRepository;
  }
  var saveDraft = (draft) => getDraftRepository().saveDraft(draft);
  var loadDraft = (query2) => getDraftRepository().loadDraft(query2);
  var listDrafts = (query2) => getDraftRepository().listDrafts(query2);
  var deleteDraft = (query2) => getDraftRepository().deleteDraft(query2);

  // src/features/editor/io/snippets.js
  var DB_NAME = "seipro-editor-snippets";
  var STORE_NAME = "snippets";
  var singleton;
  function openDatabase(indexedDBImpl = globalThis.indexedDB) {
    return new Promise((resolve, reject) => {
      if (!indexedDBImpl) {
        reject(new Error("IndexedDB indispon\xEDvel"));
        return;
      }
      const request = indexedDBImpl.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("unit", "unit", { unique: false });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("N\xE3o foi poss\xEDvel abrir os trechos"));
    });
  }
  function requestResult2(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  function createSnippetRepository({ indexedDBImpl = globalThis.indexedDB } = {}) {
    let databasePromise;
    const database = () => {
      databasePromise ||= openDatabase(indexedDBImpl);
      return databasePromise;
    };
    return {
      async list(unit2) {
        const db = await database();
        const transaction = db.transaction(STORE_NAME, "readonly");
        const rows = await requestResult2(
          transaction.objectStore(STORE_NAME).index("unit").getAll(String(unit2 || "geral"))
        );
        return rows.sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
      },
      async save({ id, unit: unit2, name, body }) {
        const snippet = {
          id: String(id || `snippet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
          unit: String(unit2 || "geral"),
          name: String(name || "").trim(),
          body: String(body || ""),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        if (!snippet.name || !snippet.body.trim()) {
          throw new Error("Informe o nome e o conte\xFAdo do trecho");
        }
        const db = await database();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        await requestResult2(transaction.objectStore(STORE_NAME).put(snippet));
        return snippet;
      },
      async remove(id) {
        const db = await database();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        await requestResult2(transaction.objectStore(STORE_NAME).delete(String(id)));
        return true;
      }
    };
  }
  function getSnippetRepository() {
    singleton ||= createSnippetRepository();
    return singleton;
  }

  // src/shared/ui/command-palette.js
  function createCommandPalette({
    commands = [],
    storage = globalThis.localStorage,
    storageKey = "seipro-command-palette"
  } = {}) {
    const normalizedCommands = commands.filter(function(command) {
      return command && command.id && command.label && typeof command.run === "function";
    });
    const overlay = document.createElement("div");
    overlay.className = "seipro-palette-overlay";
    overlay.hidden = true;
    const dialog = document.createElement("div");
    dialog.className = "seipro-palette-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-label", "Paleta de comandos");
    const input = document.createElement("input");
    input.className = "seipro-palette-input";
    input.type = "search";
    input.placeholder = "Digite um comando\u2026";
    input.setAttribute("aria-label", "Filtrar comandos");
    const list = document.createElement("ul");
    list.className = "seipro-palette-list";
    list.setAttribute("role", "listbox");
    dialog.append(input, list);
    overlay.appendChild(dialog);
    let filteredCommands = normalizedCommands.slice();
    let selectedIndex = 0;
    let previouslyFocused = null;
    let preferences = readPreferences();
    function readPreferences() {
      try {
        const parsed = JSON.parse(storage?.getItem?.(storageKey) || "{}");
        return {
          favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
          recent: Array.isArray(parsed.recent) ? parsed.recent : []
        };
      } catch (_) {
        return { favorites: [], recent: [] };
      }
    }
    function savePreferences() {
      try {
        storage?.setItem?.(storageKey, JSON.stringify(preferences));
      } catch (_) {
      }
    }
    function commandRank(command) {
      const favorite = preferences.favorites.indexOf(command.id);
      const recent = preferences.recent.indexOf(command.id);
      return {
        favorite: favorite === -1 ? Number.MAX_SAFE_INTEGER : favorite,
        recent: recent === -1 ? Number.MAX_SAFE_INTEGER : recent
      };
    }
    function sortCommands(items) {
      return items.map((command, index) => ({ command, index, rank: commandRank(command) })).sort((left, right) => {
        const leftFavorite = left.rank.favorite !== Number.MAX_SAFE_INTEGER;
        const rightFavorite = right.rank.favorite !== Number.MAX_SAFE_INTEGER;
        if (leftFavorite !== rightFavorite) return leftFavorite ? -1 : 1;
        if (left.rank.favorite !== right.rank.favorite) return left.rank.favorite - right.rank.favorite;
        if (left.rank.recent !== right.rank.recent) return left.rank.recent - right.rank.recent;
        return left.index - right.index;
      }).map(({ command }) => command);
    }
    function commandSearchText(command) {
      const keywords = Array.isArray(command.keywords) ? command.keywords.join(" ") : command.keywords || "";
      return `${command.label} ${keywords}`.toLocaleLowerCase();
    }
    function runCommand(command) {
      if (!command) return;
      preferences.recent = [
        command.id,
        ...preferences.recent.filter((id) => id !== command.id)
      ].slice(0, 8);
      savePreferences();
      api2.close();
      command.run();
    }
    function render() {
      list.replaceChildren();
      let previousCategory = "";
      filteredCommands.forEach(function(command, index) {
        const category = String(command.category || "Outros");
        if (category !== previousCategory) {
          const heading = document.createElement("li");
          heading.className = "seipro-palette-category";
          heading.setAttribute("role", "presentation");
          heading.textContent = category;
          list.appendChild(heading);
          previousCategory = category;
        }
        const item = document.createElement("li");
        item.className = "seipro-palette-item";
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", index === selectedIndex ? "true" : "false");
        item.dataset.commandId = command.id;
        const button2 = document.createElement("button");
        button2.type = "button";
        button2.className = "seipro-palette-command";
        button2.textContent = command.label;
        button2.addEventListener("click", function() {
          runCommand(command);
        });
        const favorite = document.createElement("button");
        favorite.type = "button";
        favorite.className = "seipro-palette-favorite";
        const isFavorite = preferences.favorites.includes(command.id);
        favorite.setAttribute("aria-label", isFavorite ? `Remover ${command.label} dos favoritos` : `Adicionar ${command.label} aos favoritos`);
        favorite.setAttribute("aria-pressed", isFavorite ? "true" : "false");
        favorite.textContent = isFavorite ? "\u2605" : "\u2606";
        favorite.addEventListener("click", function(event) {
          event.stopPropagation();
          preferences.favorites = isFavorite ? preferences.favorites.filter((id) => id !== command.id) : [...preferences.favorites, command.id];
          savePreferences();
          api2.filter(input.value);
        });
        item.append(button2, favorite);
        list.appendChild(item);
      });
      if (!filteredCommands.length) {
        const empty = document.createElement("li");
        empty.className = "seipro-palette-empty";
        empty.textContent = "Nenhum comando encontrado";
        list.appendChild(empty);
      }
    }
    const api2 = {
      el: overlay,
      open() {
        if (!overlay.isConnected) document.body.appendChild(overlay);
        previouslyFocused = document.activeElement;
        overlay.hidden = false;
        input.value = "";
        api2.filter("");
        input.focus();
        return api2;
      },
      close() {
        overlay.hidden = true;
        if (previouslyFocused?.isConnected && typeof previouslyFocused.focus === "function") {
          previouslyFocused.focus();
        }
        return api2;
      },
      filter(query2 = "") {
        const terms = String(query2).trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
        filteredCommands = sortCommands(normalizedCommands.filter(function(command) {
          const searchText = commandSearchText(command);
          return terms.every(function(term) {
            return searchText.includes(term);
          });
        }));
        selectedIndex = 0;
        render();
        return filteredCommands.slice();
      },
      destroy() {
        document.removeEventListener("keydown", onGlobalKeydown, true);
        overlay.remove();
      }
    };
    function moveSelection(direction) {
      if (!filteredCommands.length) return;
      selectedIndex = (selectedIndex + direction + filteredCommands.length) % filteredCommands.length;
      render();
      const selected = list.querySelector('[aria-selected="true"]');
      if (selected && typeof selected.scrollIntoView === "function") {
        selected.scrollIntoView({ block: "nearest" });
      }
    }
    function onGlobalKeydown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        if (overlay.hidden || !overlay.isConnected) api2.open();
        else api2.close();
        return;
      }
      if (overlay.hidden || !overlay.isConnected) return;
      if (event.key === "Escape") {
        event.preventDefault();
        api2.close();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSelection(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSelection(-1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        runCommand(filteredCommands[selectedIndex]);
      }
    }
    input.addEventListener("input", function() {
      api2.filter(input.value);
    });
    overlay.addEventListener("click", function(event) {
      if (event.target === overlay) api2.close();
    });
    document.addEventListener("keydown", onGlobalKeydown, true);
    render();
    return api2;
  }

  // src/features/editor/domain/snippets.js
  var PLACEHOLDER_PATTERN2 = /\{\{\s*([\p{L}\p{N}_-]+)\s*\}\}/gu;
  function renderSnippet(template = "", values = {}) {
    const normalized = Object.fromEntries(Object.entries(values).map(([key, value]) => [
      String(key).toLocaleLowerCase(),
      String(value ?? "")
    ]));
    return String(template).replace(PLACEHOLDER_PATTERN2, (match, key) => {
      const normalizedKey = key.toLocaleLowerCase();
      return Object.prototype.hasOwnProperty.call(normalized, normalizedKey) ? normalized[normalizedKey] : match;
    });
  }
  function snippetToHtml(text = "") {
    const escaped = String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    return escaped.split(/\r?\n/).map((line) => `<p>${line || "<br>"}</p>`).join("");
  }

  // src/features/editor/domain/diff.js
  function tokenize(value) {
    return String(value || "").match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) || [];
  }
  function comparable(token) {
    return token.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
  }
  function semanticDiff(before = "", after = "", { maxTokens = 1800 } = {}) {
    const left = tokenize(before).slice(0, maxTokens);
    const right = tokenize(after).slice(0, maxTokens);
    const rows = left.length + 1;
    const columns = right.length + 1;
    const matrix = Array.from({ length: rows }, () => new Uint16Array(columns));
    for (let i2 = left.length - 1; i2 >= 0; i2--) {
      for (let j2 = right.length - 1; j2 >= 0; j2--) {
        matrix[i2][j2] = comparable(left[i2]) === comparable(right[j2]) ? matrix[i2 + 1][j2 + 1] + 1 : Math.max(matrix[i2 + 1][j2], matrix[i2][j2 + 1]);
      }
    }
    const parts = [];
    const push = (type, token) => {
      const last = parts[parts.length - 1];
      if (last?.type === type) last.tokens.push(token);
      else parts.push({ type, tokens: [token] });
    };
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      if (comparable(left[i]) === comparable(right[j])) {
        push("equal", right[j]);
        i++;
        j++;
      } else if (matrix[i + 1][j] >= matrix[i][j + 1]) {
        push("remove", left[i++]);
      } else {
        push("add", right[j++]);
      }
    }
    while (i < left.length) push("remove", left[i++]);
    while (j < right.length) push("add", right[j++]);
    const output = parts.map((part) => ({
      type: part.type,
      text: joinTokens(part.tokens)
    }));
    return {
      parts: output,
      added: output.filter((part) => part.type === "add").reduce((sum, part) => sum + tokenize(part.text).length, 0),
      removed: output.filter((part) => part.type === "remove").reduce((sum, part) => sum + tokenize(part.text).length, 0),
      truncated: left.length >= maxTokens || right.length >= maxTokens
    };
  }
  function joinTokens(tokens) {
    return tokens.reduce((text, token) => {
      if (!text) return token;
      return /^[,.;:!?%)\]}]$/u.test(token) ? `${text}${token}` : `${text} ${token}`;
    }, "");
  }

  // src/features/editor/view/editor-tools.js
  var AUTOSAVE_INTERVAL_MS = 3e4;
  var configuredDraftRepository;
  var configuredSnippetRepository;
  function resolveRepository(repository) {
    const resolved = repository || configuredDraftRepository;
    if (!resolved) throw new TypeError("O reposit\xF3rio de rascunhos deve ser injetado pelo editor");
    return resolved;
  }
  function resolveSnippetRepository(repository) {
    const resolved = repository || configuredSnippetRepository;
    if (!resolved) throw new TypeError("O reposit\xF3rio de trechos deve ser injetado pelo editor");
    return resolved;
  }
  function queryValue(root3, selectors) {
    for (const selector of selectors) {
      const value = root3?.querySelector?.(selector)?.value;
      if (value) return value;
    }
    return "";
  }
  function resolveDraftContext(location2 = globalThis.location, root3 = globalThis.document) {
    const url = new URL(location2?.href || String(location2), "https://invalid.local/");
    const processId = url.searchParams.get("id_procedimento") || queryValue(root3, ["#hdnIdProcedimento", '[name="id_procedimento"]']);
    const documentId = url.searchParams.get("id_documento") || queryValue(root3, ["#hdnIdDocumento", '[name="id_documento"]']);
    const action = url.searchParams.get("acao") || "editor";
    return {
      processId: processId || `standalone:${url.pathname}`,
      documentId: documentId || `${action}:${url.searchParams.get("id_texto_padrao") || "current"}`
    };
  }
  function readEditorSnapshot(instances = {}) {
    return Object.fromEntries(
      Object.entries(instances).filter(([, instance]) => instance && typeof instance.getData === "function").map(([id, instance]) => [id, instance.getData()])
    );
  }
  function hasDirtyEditor(instances, serialized, previousSerialized) {
    const editors = Object.values(instances);
    const supportsDirtyCheck = editors.some((editor) => typeof editor?.checkDirty === "function");
    if (supportsDirtyCheck) {
      return editors.some((editor) => typeof editor?.checkDirty === "function" && editor.checkDirty());
    }
    return previousSerialized !== null && serialized !== previousSerialized;
  }
  function installDraftAutosave({
    getInstances = () => globalThis.CKEDITOR?.instances || {},
    context = resolveDraftContext(),
    repository,
    intervalMs = AUTOSAVE_INTERVAL_MS,
    setIntervalFn = globalThis.setInterval,
    clearIntervalFn = globalThis.clearInterval,
    title = globalThis.document?.title || "",
    sourceUrl = globalThis.location?.href || "",
    onError = (error) => console.error("SEI Pro draft autosave failed", error)
  } = {}) {
    repository = resolveRepository(repository);
    let previousSerialized = null;
    let saveInProgress = false;
    async function snapshot2({ force = false } = {}) {
      if (saveInProgress) return null;
      const instances = getInstances();
      const editors = readEditorSnapshot(instances);
      if (!Object.keys(editors).length) return null;
      const serialized = JSON.stringify(editors);
      const shouldSave = force || serialized !== previousSerialized && hasDirtyEditor(instances, serialized, previousSerialized);
      previousSerialized = serialized;
      if (!shouldSave) return null;
      saveInProgress = true;
      try {
        return await repository.saveDraft({
          ...context,
          editors,
          title,
          sourceUrl
        });
      } catch (error) {
        onError(error);
        return null;
      } finally {
        saveInProgress = false;
      }
    }
    const timer = setIntervalFn(() => {
      void snapshot2();
    }, intervalMs);
    return {
      snapshot: snapshot2,
      stop() {
        clearIntervalFn(timer);
      }
    };
  }
  function formatDraftDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value || "");
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "medium"
    }).format(date);
  }
  function restoreEditors(instances, draft, selectedIds) {
    const selected = selectedIds ? new Set(selectedIds) : null;
    const savedEntries = Object.entries(draft.editors || {}).filter(
      ([id]) => !selected || selected.has(id)
    );
    const currentEntries = Object.entries(instances || {});
    if (!savedEntries.length || !currentEntries.length) return false;
    savedEntries.forEach(([id, html], index) => {
      const editor = instances[id] || currentEntries[index]?.[1];
      if (!editor || typeof editor.setData !== "function") return;
      editor.fire?.("saveSnapshot");
      editor.setData(html, function() {
        editor.fire?.("saveSnapshot");
        editor.focus?.();
      });
    });
    return true;
  }
  function plainText(html) {
    return new DOMParser().parseFromString(String(html || ""), "text/html").body?.textContent || "";
  }
  function renderDraftDiff(container, instances, draft) {
    const before = Object.values(draft.editors || {}).map(plainText).join("\n");
    const after = Object.values(readEditorSnapshot(instances)).map(plainText).join("\n");
    const diff = semanticDiff(before, after);
    container.replaceChildren();
    const summary = document.createElement("p");
    summary.textContent = `${diff.added} termo(s) novo(s) e ${diff.removed} removido(s) desde este instant\xE2neo.`;
    const text = document.createElement("div");
    text.className = "seipro-draft-diff";
    diff.parts.forEach((part) => {
      const node = document.createElement(part.type === "add" ? "ins" : part.type === "remove" ? "del" : "span");
      node.textContent = `${part.text} `;
      text.appendChild(node);
    });
    container.append(summary, text);
  }
  function currentEditor2(instances = {}) {
    return Object.values(instances).find((editor) => editor?.focusManager?.hasFocus) || Object.values(instances)[0] || null;
  }
  function snippetContext(source = globalThis) {
    const props = source.dadosProcessoPro?.propProcesso || {};
    const interested = props.selInteressadosProcedimento || props.selInteressados_select || [];
    return {
      processo: props.hdnProtocoloFormatado || props.txtProtocoloExibir || "",
      tipo: props.hdnNomeTipoProcedimento || "",
      especificacao: props.txtDescricao || "",
      interessado: Array.isArray(interested) ? interested[0] || "" : interested,
      interessados: Array.isArray(interested) ? interested.join(", ") : interested,
      unidade: source.siglaUnidadeAtual || props.siglaUnidade || "",
      hoje: new Intl.DateTimeFormat("pt-BR").format(/* @__PURE__ */ new Date())
    };
  }
  function openSnippetPanel({
    repository,
    getInstances = () => globalThis.CKEDITOR?.instances || {},
    unit: unit2 = globalThis.siglaUnidadeAtual || "geral",
    contextValues = snippetContext(globalThis)
  } = {}) {
    repository = resolveSnippetRepository(repository);
    const content = document.createElement("div");
    content.className = "seipro-snippet-panel";
    const form = document.createElement("form");
    form.className = "seipro-snippet-form";
    const name = document.createElement("input");
    name.type = "text";
    name.placeholder = "Nome do trecho";
    name.setAttribute("aria-label", "Nome do trecho");
    const body = document.createElement("textarea");
    body.rows = 5;
    body.placeholder = "Texto. Use {{processo}}, {{interessado}}, {{unidade}}, {{hoje}}\u2026";
    body.setAttribute("aria-label", "Conte\xFAdo do trecho");
    const save = document.createElement("button");
    save.type = "submit";
    save.textContent = "Salvar trecho";
    form.append(name, body, save);
    const status = document.createElement("p");
    status.className = "seipro-snippet-status";
    status.setAttribute("aria-live", "polite");
    const list = document.createElement("ul");
    list.className = "seipro-snippet-list";
    content.append(form, status, list);
    const modal = openModal({
      title: `Trechos da unidade ${unit2 || "geral"}`,
      content,
      width: 760,
      className: "seipro-editor-modal"
    });
    async function render() {
      const snippets = await repository.list(unit2);
      list.replaceChildren();
      snippets.forEach((snippet) => {
        const row = document.createElement("li");
        row.className = "seipro-snippet-item";
        const info = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = snippet.name;
        const preview = document.createElement("span");
        preview.textContent = renderSnippet(snippet.body, contextValues).slice(0, 180);
        info.append(title, preview);
        const actions = document.createElement("div");
        const insert = document.createElement("button");
        insert.type = "button";
        insert.textContent = "Inserir";
        insert.addEventListener("click", () => {
          const editor = currentEditor2(getInstances());
          if (!editor?.insertHtml) return;
          editor.fire?.("saveSnapshot");
          editor.insertHtml(snippetToHtml(renderSnippet(snippet.body, contextValues)));
          editor.fire?.("saveSnapshot");
          modal.close();
        });
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Excluir";
        remove.addEventListener("click", async () => {
          await repository.remove(snippet.id);
          await render();
        });
        actions.append(insert, remove);
        row.append(info, actions);
        list.appendChild(row);
      });
      if (!snippets.length) status.textContent = "Nenhum trecho salvo para esta unidade.";
      else status.textContent = `${snippets.length} trecho(s) dispon\xEDvel(is).`;
    }
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        await repository.save({ unit: unit2, name: name.value, body: body.value });
        name.value = "";
        body.value = "";
        await render();
        name.focus();
      } catch (error) {
        status.textContent = error.message;
      }
    });
    void render();
    return modal;
  }
  function openDraftRestorePanel({
    context = resolveDraftContext(),
    repository,
    getInstances = () => globalThis.CKEDITOR?.instances || {},
    confirmRestore = (message) => globalThis.confirm(message)
  } = {}) {
    repository = resolveRepository(repository);
    const content = document.createElement("div");
    content.className = "seipro-draft-panel";
    content.setAttribute("aria-live", "polite");
    const status = document.createElement("p");
    status.className = "seipro-draft-status";
    status.textContent = "Carregando rascunhos locais\u2026";
    content.appendChild(status);
    const modal = openModal({
      title: "Restaurar rascunho local",
      content,
      width: 720,
      className: "seipro-editor-modal"
    });
    async function render() {
      try {
        const drafts = await repository.listDrafts(context);
        content.replaceChildren();
        if (!drafts.length) {
          const empty = document.createElement("p");
          empty.className = "seipro-draft-empty";
          empty.textContent = "Nenhum rascunho local foi encontrado para este documento.";
          content.appendChild(empty);
          return;
        }
        const intro = document.createElement("p");
        intro.className = "seipro-draft-intro";
        intro.textContent = "Escolha um instant\xE2neo. A restaura\xE7\xE3o substitui o conte\xFAdo atual do editor.";
        const list = document.createElement("ul");
        list.className = "seipro-draft-list";
        drafts.forEach((draft) => {
          const item = document.createElement("li");
          item.className = "seipro-draft-item";
          const info = document.createElement("div");
          info.className = "seipro-draft-info";
          const date = document.createElement("strong");
          date.className = "seipro-draft-date";
          date.textContent = formatDraftDate(draft.savedAt);
          const details = document.createElement("span");
          details.className = "seipro-draft-details";
          const characters = Object.values(draft.editors || {}).reduce((total, html) => total + String(html).length, 0);
          details.textContent = `${Object.keys(draft.editors || {}).length} se\xE7\xE3o(\xF5es), ${characters.toLocaleString("pt-BR")} caracteres`;
          info.append(date, details);
          const actions = document.createElement("div");
          actions.className = "seipro-draft-actions";
          const sections = document.createElement("details");
          sections.className = "seipro-draft-sections";
          const sectionsTitle = document.createElement("summary");
          sectionsTitle.textContent = "Escolher se\xE7\xF5es";
          sections.appendChild(sectionsTitle);
          Object.keys(draft.editors || {}).forEach((editorId) => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = editorId;
            checkbox.checked = true;
            label.append(checkbox, document.createTextNode(editorId));
            sections.appendChild(label);
          });
          const restore = document.createElement("button");
          restore.type = "button";
          restore.className = "newLink seipro-draft-restore";
          restore.textContent = "Restaurar";
          restore.addEventListener("click", () => {
            if (!confirmRestore("Restaurar este rascunho e substituir o conte\xFAdo atual?")) return;
            const selectedIds = Array.from(sections.querySelectorAll("input:checked"), (input) => input.value);
            if (restoreEditors(getInstances(), draft, selectedIds)) modal.close();
          });
          const compare = document.createElement("button");
          compare.type = "button";
          compare.className = "newLink seipro-draft-compare";
          compare.textContent = "Comparar";
          const comparison = document.createElement("div");
          comparison.className = "seipro-draft-comparison";
          comparison.hidden = true;
          compare.addEventListener("click", () => {
            comparison.hidden = !comparison.hidden;
            if (!comparison.hidden) renderDraftDiff(comparison, getInstances(), draft);
          });
          const remove = document.createElement("button");
          remove.type = "button";
          remove.className = "newLink seipro-draft-delete";
          remove.textContent = "Excluir";
          remove.addEventListener("click", async () => {
            remove.disabled = true;
            await repository.deleteDraft({ ...context, draftId: draft.id });
            await render();
          });
          actions.append(compare, restore, remove);
          item.append(info, sections, actions, comparison);
          list.appendChild(item);
        });
        content.append(intro, list);
      } catch (error) {
        content.replaceChildren();
        const failure = document.createElement("p");
        failure.className = "seipro-draft-error";
        failure.textContent = "N\xE3o foi poss\xEDvel acessar os rascunhos locais.";
        content.appendChild(failure);
        console.error("SEI Pro draft panel failed", error);
      }
    }
    void render();
    return modal;
  }
  function installConcurrentEditMonitor({
    context = resolveDraftContext(),
    BroadcastChannelImpl = globalThis.BroadcastChannel,
    onConcurrentEdit = showConcurrentEditWarning
  } = {}) {
    if (typeof BroadcastChannelImpl !== "function") return { close() {
    } };
    const channelName = `seipro-editor-${context.processId}-${context.documentId}`;
    const channel = new BroadcastChannelImpl(channelName);
    const instanceId = Math.random().toString(36).slice(2);
    channel.onmessage = (event) => {
      const message = event.data || {};
      if (message.instanceId === instanceId) return;
      if (message.type === "hello") {
        channel.postMessage({ type: "active", instanceId });
      } else if (message.type === "active") {
        onConcurrentEdit(context);
      }
    };
    channel.postMessage({ type: "hello", instanceId });
    return channel;
  }
  function showConcurrentEditWarning() {
    if (document.querySelector(".seipro-concurrent-warning")) return;
    const warning = document.createElement("div");
    warning.className = "seipro-concurrent-warning";
    warning.setAttribute("role", "alert");
    warning.textContent = "Este documento tamb\xE9m est\xE1 aberto em outra aba. Evite edi\xE7\xF5es simult\xE2neas para n\xE3o sobrescrever altera\xE7\xF5es.";
    const close = document.createElement("button");
    close.type = "button";
    close.setAttribute("aria-label", "Fechar aviso");
    close.textContent = "\xD7";
    close.addEventListener("click", () => warning.remove());
    warning.appendChild(close);
    document.body.appendChild(warning);
  }
  function openChecklistPanel({
    getInstances = () => globalThis.CKEDITOR?.instances || {},
    parseHtml: parseHtml3 = (html) => new DOMParser().parseFromString(html, "text/html"),
    documents = globalThis.dadosProcessoPro?.listDocumentos || []
  } = {}) {
    const instances = getInstances();
    const editors = readEditorSnapshot(instances);
    const html = Object.values(editors).join("\n");
    const result = scanChecklist(html, { parseHtml: parseHtml3, documents });
    const content = document.createElement("div");
    content.className = `seipro-checklist ${result.ok ? "seipro-checklist-ok" : "seipro-checklist-warning"}`;
    const summary = document.createElement("p");
    summary.className = "seipro-checklist-summary";
    summary.textContent = result.ok ? "Nenhuma pend\xEAncia detect\xE1vel foi encontrada." : `${result.issues.length} pend\xEAncia(s) encontrada(s). Revise antes de assinar.`;
    content.appendChild(summary);
    if (!result.ok) {
      const list = document.createElement("ul");
      list.className = "seipro-checklist-list";
      result.issues.forEach((item) => {
        const row = document.createElement("li");
        row.className = `seipro-checklist-item seipro-checklist-${item.severity}`;
        const message = document.createElement("strong");
        message.textContent = item.message;
        row.appendChild(message);
        if (item.context) {
          const context = document.createElement("span");
          context.className = "seipro-checklist-context";
          context.textContent = item.context;
          row.appendChild(context);
        }
        if (item.location) {
          const go = document.createElement("button");
          go.type = "button";
          go.className = "seipro-checklist-go";
          go.textContent = "Ir ao ponto";
          go.addEventListener("click", () => {
            if (focusChecklistIssue(instances, item.location)) modal.close();
          });
          row.appendChild(go);
        }
        list.appendChild(row);
      });
      content.appendChild(list);
    }
    const modal = openModal({
      title: "Checklist antes da assinatura",
      content,
      width: 720,
      className: "seipro-editor-modal"
    });
    return modal;
  }
  function focusChecklistIssue(instances, location2) {
    for (const editor of Object.values(instances || {})) {
      const root3 = editor?.document?.$;
      if (!root3) continue;
      let target = null;
      if (location2.kind === "selector") {
        try {
          target = root3.querySelector(location2.value);
        } catch (_) {
          target = null;
        }
      } else if (location2.kind === "paragraph") {
        target = root3.querySelectorAll("p")[location2.index] || null;
      } else if (location2.kind === "text") {
        target = Array.from(root3.querySelectorAll("p, a, span")).find(
          (node) => String(node.textContent || "").includes(location2.value)
        ) || null;
      }
      if (!target) continue;
      target.scrollIntoView?.({ block: "center", behavior: "smooth" });
      target.setAttribute("data-seipro-checklist-target", "true");
      const previousOutline = target.style.outline;
      const previousOffset = target.style.outlineOffset;
      target.style.outline = "3px solid #f9ab00";
      target.style.outlineOffset = "3px";
      globalThis.setTimeout(() => {
        target.removeAttribute("data-seipro-checklist-target");
        target.style.outline = previousOutline;
        target.style.outlineOffset = previousOffset;
      }, 2500);
      editor.focus?.();
      return true;
    }
    return false;
  }
  function runToolbarCommand(selector) {
    const button2 = Array.from(document.querySelectorAll(selector)).find((candidate) => !candidate.closest(".cke_button_disabled"));
    if (!button2) {
      console.warn(`SEI Pro editor command unavailable: ${selector}`);
      return false;
    }
    button2.click();
    return true;
  }
  function createEditorCommands(options = {}) {
    const command = (id, label, selector, keywords = [], category = "Inser\xE7\xE3o") => ({
      id,
      label,
      keywords,
      category,
      selector,
      run: () => runToolbarCommand(selector)
    });
    return [
      command("ai", "Abrir Assistente IA", ".getPlataformAIButtom", ["intelig\xEAncia artificial", "redigir", "despacho"], "IA e an\xE1lise"),
      command(
        "import",
        "Inserir texto de conte\xFAdo externo (Word, HTML ou Google)",
        ".importDocButtom",
        ["importar", "word", "docx", "html", "google docs"]
      ),
      command("process-data", "Inserir dados do processo", ".getDadosProcessoButtom", ["campos", "tags", "interessado"]),
      {
        id: "checklist",
        label: "Verificar antes de assinar",
        keywords: ["checklist", "revis\xE3o", "pend\xEAncias"],
        category: "IA e an\xE1lise",
        run: () => openChecklistPanel(options)
      },
      {
        id: "snippets",
        label: "Inserir ou gerenciar trechos da unidade",
        keywords: ["modelo", "bloco", "texto", "placeholder"],
        category: "Inser\xE7\xE3o",
        run: () => openSnippetPanel({
          ...options,
          repository: options.snippetRepository
        })
      },
      {
        id: "semantic-diff",
        label: "Comparar com documento anterior",
        keywords: ["diferen\xE7as", "vers\xE3o", "altera\xE7\xF5es"],
        category: "IA e an\xE1lise",
        run: () => options.openDiff?.()
      },
      {
        id: "restore-draft",
        label: "Restaurar rascunho local",
        keywords: ["autosave", "instant\xE2neo", "recuperar"],
        category: "Seguran\xE7a",
        run: () => openDraftRestorePanel(options)
      },
      command("document-reference", "Inserir refer\xEAncia de documento", ".getCitacaoDocumentoButtom", ["cita\xE7\xE3o", "sei"]),
      command("legislation-link", "Adicionar link de legisla\xE7\xE3o", ".getLinkLegisButtom", ["lei", "norma"]),
      command("footnote", "Inserir nota de rodap\xE9", ".getNotaRodapeButtom", ["nota"]),
      command("internal-reference", "Inserir refer\xEAncia interna", ".getRefInternaButtom", ["\xE2ncora", "par\xE1grafo"]),
      command("summary", "Inserir sum\xE1rio", ".getSumarioButtom", ["\xEDndice"]),
      command("qr-code", "Gerar c\xF3digo QR", ".getQrCodeButtom", ["link", "processo"]),
      command("page-break", "Inserir quebra de p\xE1gina", ".getPageBreakButtom", ["p\xE1gina"]),
      command("section-break", "Inserir quebra de se\xE7\xE3o", ".getSessionBreakButtom", ["se\xE7\xE3o"]),
      command("public-link", "Adicionar link p\xFAblico de documento", ".getProcessoPublicoButton", ["processo p\xFAblico"]),
      command("checkbox", "Inserir caixa de sele\xE7\xE3o", ".getInsertCheckboxButtom", ["check", "marca\xE7\xE3o"]),
      command("quick-table", "Inserir tabela r\xE1pida", ".getQuickTableButtom", ["linhas", "colunas"], "Tabelas e imagens"),
      command("table-style", "Aplicar estilo \xE0 tabela", ".getTablestylesButtom", ["cores"], "Tabelas e imagens"),
      command("image-quality", "Reduzir qualidade das imagens", ".getBatchImgQualityButtom", ["compactar"], "Tabelas e imagens"),
      command("page-background", "Configurar imagem de fundo e p\xE1gina", ".pageImageBackgroundButtom", ["impress\xE3o"], "Tabelas e imagens"),
      command("capitalize", "Aplicar mai\xFAsculas iniciais", ".getCapLetterButtom", ["capitalizar"], "Formata\xE7\xE3o"),
      command("font-up", "Aumentar tamanho da fonte", ".getFontSizeUpButtom", ["fonte"], "Formata\xE7\xE3o"),
      command("font-down", "Diminuir tamanho da fonte", ".getFontSizeDownButtom", ["fonte"], "Formata\xE7\xE3o"),
      command("copy-style", "Copiar formata\xE7\xE3o", ".getCopyStyleButtom", ["estilo"], "Formata\xE7\xE3o"),
      command("align-left", "Alinhar \xE0 esquerda", ".getAlignLeftButtom", ["alinhamento"], "Formata\xE7\xE3o"),
      command("align-center", "Centralizar texto", ".getAlignCenterButtom", ["alinhamento"], "Formata\xE7\xE3o"),
      command("align-right", "Alinhar \xE0 direita", ".getAlignRightButtom", ["alinhamento"], "Formata\xE7\xE3o"),
      command("align-justify", "Justificar texto", ".getAlignJustifyButtom", ["alinhamento"], "Formata\xE7\xE3o"),
      command("watermark", "Adicionar marca d\u2019\xE1gua", ".getMinutaWatermarkButton", ["minuta", "modelo"], "Seguran\xE7a"),
      command("mark-sensitive", "Marcar dados protegidos", ".getMarkSigiloButton", ["sigilo", "cpf", "email"], "Seguran\xE7a"),
      command("redact-box", "Inserir caixa de sigilo", ".getBoxSigiloButton", ["tarja", "sigilo"], "Seguran\xE7a"),
      command("review-enable", "Ativar revis\xE3o de texto", ".getReviewButton", ["altera\xE7\xF5es"], "Revis\xE3o"),
      command("review-manage", "Gerenciar revis\xF5es", ".getCtrReviewButton", ["aceitar", "rejeitar"], "Revis\xE3o"),
      command("dictation-enable", "Ativar ditado (reconhecimento de fala do Chrome)", ".getDitadoButton", ["voz", "fala", "chrome", "microfone"], "Acessibilidade"),
      command("dictation-settings", "Configurar ditado", ".getCtrDitadoButton", ["voz", "microfone"], "Acessibilidade"),
      command("style-editor", "Criar estilo de texto", ".getNewStyleButton", ["formata\xE7\xE3o"], "Formata\xE7\xE3o"),
      command("legislation-format", "Formatar e numerar texto normativo", ".getLegisButtom", ["lei", "artigo", "norma"], "Revis\xE3o")
    ];
  }
  function installIframePaletteShortcut(palette, getInstances) {
    const attachedDocuments = /* @__PURE__ */ new WeakSet();
    const attach = () => {
      Object.values(getInstances()).forEach((editor) => {
        const editorDocument = editor?.document?.$;
        if (!editorDocument || attachedDocuments.has(editorDocument)) return;
        editorDocument.addEventListener("keydown", (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") {
            event.preventDefault();
            palette.open();
          }
        }, true);
        attachedDocuments.add(editorDocument);
      });
    };
    attach();
    return globalThis.setInterval(attach, 1e3);
  }
  var installedFeatures;
  function installEditorTools(options = {}) {
    if (installedFeatures) return installedFeatures;
    const getInstances = options.getInstances || (() => globalThis.CKEDITOR?.instances || {});
    const context = options.context || resolveDraftContext();
    const repository = resolveRepository(options.repository);
    const snippetRepository = resolveSnippetRepository(options.snippetRepository);
    configuredDraftRepository = repository;
    configuredSnippetRepository = snippetRepository;
    const sharedOptions = { ...options, getInstances, context, repository, snippetRepository };
    const palette = createCommandPalette({ commands: createEditorCommands(sharedOptions) });
    const shortcutTimer = installIframePaletteShortcut(palette, getInstances);
    const autosave = installDraftAutosave(sharedOptions);
    const concurrentMonitor = installConcurrentEditMonitor({ context });
    installedFeatures = {
      palette,
      autosave,
      destroy() {
        globalThis.clearInterval(shortcutTimer);
        autosave.stop();
        concurrentMonitor.close();
        palette.destroy();
        installedFeatures = null;
      }
    };
    return installedFeatures;
  }

  // src/features/editor/view/delegated-actions.js
  var DIRECT_ACTIONS = /* @__PURE__ */ new Set([
    "hoverTapTip",
    "setTagTip",
    "removeDynamicField",
    "editDynamicField",
    "replaceDadosEditor",
    "newDynamicField",
    "removeReviewPro",
    "addCommentReviewPro",
    "quickTableClick",
    "changeColorTable",
    "getSearchLegisMore",
    "insertLegisSEI",
    "getSearchLegis",
    "resetOptionsImgBg"
  ]);
  var NO_ARGUMENT_ACTIONS = /* @__PURE__ */ new Set([
    "getDadosIframeProcessoPublicoPro",
    "toggleOptionsQR",
    "resetOptionsQR"
  ]);
  var TOOLBAR_ACTIONS = [
    [".getTablestylesButtom", "getSyleSelectedTable"],
    [".getQuickTableButtom", "getQuickTable"],
    [".importDocButtom", "importDocPro"],
    [".getLinkLegisButtom", "getLegisSEI"],
    [".getCapLetterButtom", "convertFirstLetter"],
    [".getFontSizeUpButtom", "changeFontSize", "up"],
    [".getFontSizeDownButtom", "changeFontSize", "down"],
    [".getCopyStyleButtom", "setCopyStyle"],
    [".getAlignButtom", "openAlignText"],
    [".getAlignLeftButtom", "setAlignText", "left"],
    [".getAlignCenterButtom", "setAlignText", "center"],
    [".getAlignRightButtom", "setAlignText", "right"],
    [".getAlignJustifyButtom", "setAlignText", "justify"],
    [".getCitacaoDocumentoButtom", "getCitacaoDocumento"],
    [".getNotaRodapeButtom", "getNotaRodape"],
    [".getRefInternaButtom", "getRefInterna"],
    [".getPlataformAIButtom", "loadPlataformAI", void 0, "ferramentasia"],
    [".getSumarioButtom", "getSumarioDocumento"],
    [".getDadosProcessoButtom", "getDadosEditor"],
    [".getQrCodeButtom", "getQrCode"],
    [".getPageBreakButtom", "getPageBreak"],
    [".getSessionBreakButtom", "getSessionBreak"],
    [".getBatchImgQualityButtom", "openDialogBatchImgQuality"],
    [".getInsertCheckboxButtom", "getInsertCheckboxButtom"],
    [".getProcessoPublicoButton", "openDialogProcessoPublicoPro"],
    [".getMinutaWatermarkButton", "getMinutaWatermark"],
    [".pageImageBackgroundButtom", "pageImageBackground"],
    [".getMarkSigiloButton", "getMarkSigilo"],
    [".getBoxSigiloButton", "getBoxSigilo"],
    [".getReviewButton", "getBoxReview"],
    [".getCtrReviewButton", "getBoxCtrReview"],
    [".getDitadoButton", "getBoxDitado"],
    [".getCtrDitadoButton", "getBoxCtrDitado"],
    [".getNewStyleButton", "getBoxStyleEditor"],
    [".getLegisButtom", "initLegis", void 0, void 0, true],
    [".cke_combo_button", "setDarkModeCkePanel"]
  ];
  var installedRoots = /* @__PURE__ */ new WeakSet();
  function actionArguments(element, action) {
    if (action === "actionsMarkSigilo") return [element, element.dataset.seiproMode || ""];
    if (action === "scroolToReview") return [element.dataset.seiproReviewId || ""];
    if (["openLinkPro", "copyLinkPro", "removeLinkPro"].includes(action)) {
      return [element.dataset.seiproLinkRef || "", element.dataset.seiproEditorId || ""];
    }
    if (action === "editLinkPro") return [element.dataset.seiproEditorId || ""];
    if (NO_ARGUMENT_ACTIONS.has(action)) return [];
    if (DIRECT_ACTIONS.has(action)) return [element];
    return null;
  }
  function invoke(element) {
    const action = element?.dataset?.seiproAction;
    const args = actionArguments(element, action);
    const handler = action && api[action];
    if (!args || typeof handler !== "function") return false;
    handler(...args);
    return true;
  }
  function editorInstanceFor(element) {
    const editorId = element?.closest?.("div.cke")?.id?.replace(/^cke_/, "");
    return editorId ? globalThis.CKEDITOR?.instances?.[editorId] : null;
  }
  function isToolbarElementAvailable(element) {
    if (!element?.closest?.(".cke_button_disabled")) return true;
    return editorInstanceFor(element)?.readOnly === false;
  }
  function resolveToolbarElement(target, selector) {
    const clicked = target?.closest?.(selector);
    if (!clicked) return null;
    if (isToolbarElementAvailable(clicked)) return clicked;
    const candidates = Array.from(clicked.ownerDocument?.querySelectorAll?.(selector) || []).filter(isToolbarElementAvailable);
    if (!candidates.length) return null;
    const focusedEditorId = state.idEditor || globalThis.CKEDITOR?.currentInstance?.name || "";
    const activeEditorId = focusedEditorId ? `cke_${focusedEditorId}` : "";
    return candidates.find((candidate) => candidate.closest("div.cke")?.id === activeEditorId) || candidates[candidates.length - 1];
  }
  function invokeToolbarAction(target) {
    for (const [selector, action, extraArgument, requiredConfig, useGlobal] of TOOLBAR_ACTIONS) {
      const element = resolveToolbarElement(target, selector);
      if (!element) continue;
      if (requiredConfig && typeof globalThis.restrictConfigValue === "function" && !globalThis.restrictConfigValue(requiredConfig)) {
        return false;
      }
      const handler = useGlobal ? globalThis[action] : api[action];
      if (typeof handler !== "function") return false;
      const args = extraArgument === void 0 ? [element] : [element, extraArgument];
      if (selector === ".cke_combo_button") args.length = 0;
      handler(...args);
      return true;
    }
    return false;
  }
  function installDelegatedActions(root3 = document) {
    if (!root3?.addEventListener || installedRoots.has(root3)) return false;
    installedRoots.add(root3);
    root3.addEventListener("click", (event) => {
      const target = event.target?.closest?.("[data-seipro-action]");
      if ((!target || !invoke(target)) && !invokeToolbarAction(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);
    root3.addEventListener("change", (event) => {
      const target = event.target?.closest?.("[data-seipro-change]");
      const action = target?.dataset?.seiproChange;
      if (!target || action !== "changeColorTable" || typeof api.changeColorTable !== "function") return;
      api.changeColorTable(target);
    });
    root3.addEventListener("mouseover", (event) => {
      const target = event.target?.closest?.("[data-seipro-hover]");
      const action = target?.dataset?.seiproHover;
      if (!target || typeof api[action] !== "function") return;
      api[action](target);
    });
    root3.addEventListener("mouseout", (event) => {
      const target = event.target?.closest?.("[data-seipro-leave]");
      const action = target?.dataset?.seiproLeave;
      if (!target || typeof api[action] !== "function") return;
      api[action](target);
    });
    return true;
  }
  function installEditorDelegatedActions({
    getInstances = () => globalThis.CKEDITOR?.instances || {},
    setIntervalFn = globalThis.setInterval,
    clearIntervalFn = globalThis.clearInterval
  } = {}) {
    installDelegatedActions(document);
    const attachFrames = () => {
      Object.values(getInstances()).forEach((editor) => {
        installDelegatedActions(editor?.document?.$);
      });
    };
    attachFrames();
    const timer = setIntervalFn(attachFrames, 1e3);
    return () => clearIntervalFn(timer);
  }

  // src/features/editor/io/process-documents.js
  function listComparableDocuments(source = globalThis) {
    const data = source.dadosProcessoPro || {};
    const documents = listProcessDocuments(source);
    const links = data.listLinksAll || data.treeModel?.linksAll || data.listLinks || [];
    return documents.map((document2, index) => {
      const id = String(document2.id_documento || document2.id_protocolo || document2.id || index);
      const src = document2.src || links.find((link) => String(link).includes(`id_documento=${id}`)) || "";
      return {
        id,
        label: [
          document2.tipo || document2.nome_documento || document2.documento || "Documento",
          document2.numeroSEI || document2.nr_sei || document2.numero || ""
        ].filter(Boolean).join(" "),
        src: absolutize2(src, source.location?.href)
      };
    }).filter((document2) => document2.src);
  }
  async function fetchComparableDocument(src, {
    fetchImpl = globalThis.fetch?.bind(globalThis),
    parseHtml: parseHtml3 = (html) => new DOMParser().parseFromString(html, "text/html")
  } = {}) {
    if (!fetchImpl) throw new Error("Leitura de documentos indispon\xEDvel");
    const first = await fetchText(src, fetchImpl);
    const document2 = parseHtml3(first);
    const nested = document2.querySelector(
      '#ifrArvoreHtml, #ifrVisualizacao, iframe[src*="documento_"]'
    )?.getAttribute("src");
    const finalDocument = nested ? parseHtml3(await fetchText(absolutize2(nested, src), fetchImpl)) : document2;
    const container = finalDocument.querySelector("#divArvoreHtml, #conteudo, article, main") || finalDocument.body;
    return String(container?.textContent || "").replace(/\s+/g, " ").trim();
  }
  async function fetchText(url, fetchImpl) {
    const response = await fetchImpl(url, { credentials: "same-origin" });
    if (!response || response.ok === false) {
      throw new Error(`O SEI retornou ${response?.status || "uma resposta inv\xE1lida"}`);
    }
    return response.text();
  }
  function absolutize2(value, base) {
    try {
      return new URL(value, base || "http://localhost/").href;
    } catch (_) {
      return String(value || "");
    }
  }

  // src/features/editor/view/semantic-diff.js
  function openSemanticDiffPanel({
    documents = [],
    loadDocument,
    readCurrentText
  } = {}) {
    const content = document.createElement("div");
    content.className = "seipro-diff-panel";
    const controls = document.createElement("div");
    controls.className = "seipro-diff-controls";
    const select = document.createElement("select");
    select.setAttribute("aria-label", "Documento anterior para compara\xE7\xE3o");
    documents.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.label;
      select.appendChild(option);
    });
    const compare = document.createElement("button");
    compare.type = "button";
    compare.textContent = "Comparar";
    const status = document.createElement("p");
    status.className = "seipro-diff-status";
    status.setAttribute("aria-live", "polite");
    const result = document.createElement("div");
    result.className = "seipro-diff-result";
    controls.append(select, compare);
    content.append(controls, status, result);
    compare.disabled = documents.length === 0;
    if (!documents.length) status.textContent = "Nenhum documento anterior leg\xEDvel foi encontrado no processo.";
    compare.addEventListener("click", async () => {
      const selected = documents.find((item) => item.id === select.value);
      if (!selected || typeof loadDocument !== "function") return;
      compare.disabled = true;
      status.textContent = `Lendo ${selected.label}\u2026`;
      try {
        const [before, after] = await Promise.all([
          loadDocument(selected),
          Promise.resolve(readCurrentText?.() || "")
        ]);
        const diff = semanticDiff(before, after);
        result.replaceChildren();
        diff.parts.forEach((part) => {
          const node = document.createElement(part.type === "add" ? "ins" : part.type === "remove" ? "del" : "span");
          node.textContent = `${part.text} `;
          result.appendChild(node);
        });
        status.textContent = `${diff.added} termo(s) adicionado(s) e ${diff.removed} removido(s).${diff.truncated ? " Compara\xE7\xE3o limitada aos primeiros 1.800 termos." : ""}`;
      } catch (error) {
        status.textContent = `N\xE3o foi poss\xEDvel comparar: ${error.message}`;
      } finally {
        compare.disabled = false;
      }
    });
    return openModal({
      title: "Comparar com documento anterior",
      content,
      width: 860,
      className: "seipro-editor-modal"
    });
  }

  // src/features/editor/diff-controller.js
  function openProcessDocumentDiff({
    source = globalThis,
    getInstances = () => source.CKEDITOR?.instances || {}
  } = {}) {
    return openSemanticDiffPanel({
      documents: listComparableDocuments(source),
      loadDocument: (document2) => fetchComparableDocument(document2.src),
      readCurrentText: () => {
        const editors = Object.values(getInstances());
        const editor = editors.find((item) => item?.focusManager?.hasFocus) || editors[0];
        const html = editor?.getData?.() || "";
        const parsed = new DOMParser().parseFromString(html, "text/html");
        return parsed.body?.textContent || "";
      }
    });
  }

  // src/features/editor/index.js
  var root2 = getSeiPro();
  root2.features = root2.features || {};
  root2.features.editor = {
    extractTextWithNumbering,
    extractTextFromHtml,
    bindEditorFocus,
    collectEditorText,
    scanChecklist,
    createReviewMetadata,
    formatReviewTime,
    saveDraft,
    loadDraft,
    listDrafts,
    deleteDraft,
    installDraftAutosave,
    openChecklistPanel,
    openDraftRestorePanel,
    openSnippetPanel
  };
  installEditorLegacyApi();
  ready(() => {
    try {
      installEditorAiBridge();
      installEditorDelegatedActions();
      bootEditor();
      installEditorTools({
        repository: getDraftRepository(),
        snippetRepository: getSnippetRepository(),
        openDiff: () => openProcessDocumentDiff()
      });
    } catch (error) {
      console.error("SEI Pro editor boot failed", error);
    }
  });
})();
