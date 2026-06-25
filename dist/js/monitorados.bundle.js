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

  // src/features/monitorados/dom.js
  var qsa = (sel, root = document) => Array.prototype.slice.call(root.querySelectorAll(sel));
  function elFromHtml(html) {
    const tpl = document.createElement("template");
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild;
  }
  function frameDoc(id) {
    const ifr = document.getElementById(id);
    try {
      return ifr && ifr.contentDocument ? ifr.contentDocument : null;
    } catch (e) {
      return null;
    }
  }
  function waitFor(root, selector, timeoutMs = 9e3) {
    return new Promise(function(resolve) {
      const found = root.querySelector(selector);
      if (found) return resolve(found);
      let done = false;
      const mo = new MutationObserver(function() {
        const el = root.querySelector(selector);
        if (el && !done) {
          done = true;
          mo.disconnect();
          resolve(el);
        }
      });
      mo.observe(root, { childList: true, subtree: true });
      setTimeout(function() {
        if (!done) {
          done = true;
          mo.disconnect();
          resolve(null);
        }
      }, timeoutMs);
    });
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

  // src/features/monitorados/domain.js
  function defaultMonitoradoStore() {
    return { monitorados: [], config: { colortags: [] } };
  }

  // src/features/monitorados/store.js
  var STORE_KEY = "configDataMonitoradosPro";
  var storeState = null;
  var storeLastRaw = null;
  function getStoreMonitoradoPro() {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw === storeLastRaw && storeState !== null) {
      return storeState;
    }
    const parsed = raw && isJson(raw) ? JSON.parse(raw) : false;
    storeState = parsed && Object.keys(parsed).length > 0 ? parsed : defaultMonitoradoStore();
    storeLastRaw = raw;
    return storeState;
  }

  // src/features/monitorados/icon.js
  var TARGET_SEL = 'a[target="ifrConteudoVisualizacao"], a[target="ifrVisualizacao"]';
  function processAnchor(treeDoc) {
    return treeDoc.querySelector("#topmenu " + TARGET_SEL);
  }
  function idFromAnchor(anchor) {
    if (!anchor || !anchor.getAttribute("href")) return "";
    const params = globalRef.getParamsUrlPro(anchor.getAttribute("href"));
    const id = String(params && params.id_procedimento);
    return !id || id === "undefined" ? "" : id;
  }
  function iconHtml(id_procedimento, float = false) {
    const monitorados2 = getStoreMonitoradoPro().monitorados || [];
    const isMonitored = monitorados2.some((m) => String(m.id_procedimento) === String(id_procedimento));
    const floatStyle = float ? "float:" + float + ";" : "";
    const base = 'iconMonitoradoPro" data-id_procedimento="' + id_procedimento + '" id="iconMonitoradoPro_' + id_procedimento + '"';
    return isMonitored ? '<i title="Remover dos Processos Monitorados" class="fas fa-star starGold ' + base + ' data-act="monitorado-toggle" data-mode="remove" style="font-size:12pt;margin:0 5px;cursor:pointer;-webkit-text-fill-color:#FED35B;-webkit-text-stroke-color:rgb(216 162 22);-webkit-text-stroke-width:2px;' + floatStyle + '"></i>' : '<i title="Adicionar aos Processos Monitorados" class="far fa-star ' + base + ' data-act="monitorado-toggle" data-mode="add" style="font-size:12pt;margin:0 5px;color:#666;cursor:pointer;' + floatStyle + '"></i>';
  }
  function mountIcon() {
    const treeDoc = frameDoc("ifrArvore");
    if (!treeDoc) return;
    const anchor = processAnchor(treeDoc);
    if (!anchor) return;
    const id = idFromAnchor(anchor);
    if (!id) return;
    qsa(".iconMonitoradoPro", treeDoc).forEach((n) => n.remove());
    anchor.insertAdjacentElement("afterend", elFromHtml(iconHtml(id)));
  }
  function bindToggle(treeDoc) {
    if (treeDoc.__seiproMonitoradoIconBound) return;
    treeDoc.__seiproMonitoradoIconBound = true;
    treeDoc.addEventListener("click", function(ev) {
      const icon = ev.target.closest('[data-act="monitorado-toggle"]');
      if (!icon) return;
      ev.preventDefault();
      if (typeof globalRef.actMonitoradoPro === "function") {
        globalRef.actMonitoradoPro(icon, icon.dataset.mode || "add");
      }
    });
  }
  function initIcon() {
    const treeDoc = frameDoc("ifrArvore");
    if (!treeDoc) return;
    bindToggle(treeDoc);
    waitFor(treeDoc, "#topmenu " + TARGET_SEL).then((el) => {
      if (el) mountIcon();
    });
  }

  // src/features/monitorados/index.js
  var monitorados = getSeiPro().features.monitorados || (getSeiPro().features.monitorados = {});
  monitorados.view = { initIcon, mountIcon, iconHtml };
  aliasGlobal("insertIconMonitorados", initIcon);
  aliasGlobal("appendIconMonitorados", mountIcon);
  aliasGlobal("htmlIconMonitorados", iconHtml);
})();
