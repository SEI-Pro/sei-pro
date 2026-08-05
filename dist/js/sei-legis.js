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

  // src/core/util.js
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

  // src/features/legis/view.js
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
      const randRef = randomString(16);
      $(this).html($(this).html().replace(/&nbsp;/g, " "));
      $(this).html($(this).html().replace(/\u200B/g, " "));
      let text = $(this).html();
      const textSearch = $(this).text().trim().split(" ");
      if (textSearch.length <= 1) return;
      const textNormalize = removeAcentos(textSearch[0] + " " + textSearch[1]).toLowerCase().replace(/[^a-z ]/g, "");
      const textNormalize1 = removeAcentos(textSearch[0]).toLowerCase().replace(/[^a-z ]/g, "");
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
  function legisButton(button) {
    return button ? $(button) : $(".getLegisButtom").last();
  }
  function legisIframes(button) {
    const editor = legisButton(button).closest("div.cke");
    return editor.length ? editor.find("iframe.cke_wysiwyg_frame") : $("iframe.cke_wysiwyg_frame");
  }
  function disableAllLegis(button) {
    legisIframes(button).each(function() {
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
        const randRef = randomString(16);
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
        const randRef = randomString(16);
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
        const randRef = randomString(16);
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
        const randRef = randomString(16);
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
        const randRef = randomString(16);
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
        const randRef = randomString(16);
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
        const randRef = randomString(16);
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
        const randRef = randomString(16);
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
        const randRef = randomString(16);
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
        const randRef = randomString(16);
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
      const normalizedValue = capitalizeFirstLetter(dataValue);
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
  function observeKey(iframe, button) {
    iframe.find("body").off("keydown.seiproLegis").on("keydown.seiproLegis", function(event) {
      if (event.keyCode === 13 && legisButton(button).hasClass("cke_button_on")) getLegis(iframe);
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
  function iframeLegis(button) {
    legisIframes(button).each(function() {
      const iframe = $(this).contents();
      getLegis(iframe);
      observeKey(iframe, button);
    });
  }
  function initLegis(button) {
    const btn = legisButton(button);
    if (btn.hasClass("cke_button_off")) {
      btn.addClass("cke_button_on").removeClass("cke_button_off").attr("aria-label", "Desativar formata\xE7\xE3o normativa").attr("onmouseover", "return infraTooltipMostrar('Desativar formata\xE7\xE3o normativa')");
      btn.find(".cke_button_label").text("Desativar formata\xE7\xE3o normativa");
      iframeLegis(button);
    } else {
      btn.addClass("cke_button_off").removeClass("cke_button_on").attr("aria-label", "Formatar e numerar texto normativo").attr("onmouseover", "return infraTooltipMostrar('Formatar e numerar texto normativo')");
      btn.find(".cke_button_label").text("Formatar e numerar texto normativo");
      disableAllLegis(button);
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
})();
