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

  // src/features/editor/domain.js
  var domain_exports = {};
  __export(domain_exports, {
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

  // src/features/editor/io.js
  var io_exports = {};
  __export(io_exports, {
    extractTextFromHtml: () => extractTextFromHtml
  });
  function extractTextFromHtml(html, {
    parseHtml,
    extract = extractTextWithNumbering
  } = {}) {
    if (typeof parseHtml !== "function") {
      throw new TypeError("extractTextFromHtml requer parseHtml");
    }
    const document = parseHtml(String(html ?? ""));
    const paragraphs = Array.from(document.querySelectorAll("p"), (paragraph) => ({
      className: paragraph.className,
      textContent: paragraph.textContent
    }));
    return extract(paragraphs);
  }

  // src/features/editor/view.js
  var view_exports = {};
  __export(view_exports, {
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

  // src/features/editor/legacy-api.js
  function installEditorLegacyApi() {
    [domain_exports, io_exports, view_exports].forEach((mod) => {
      Object.keys(mod).forEach((name) => {
        if (typeof mod[name] === "function") aliasGlobal(name, mod[name]);
      });
    });
  }

  // src/features/editor/index.js
  var root = getSeiPro();
  root.features = root.features || {};
  root.features.editor = {
    extractTextWithNumbering,
    extractTextFromHtml,
    bindEditorFocus,
    collectEditorText
  };
  installEditorLegacyApi();
})();
