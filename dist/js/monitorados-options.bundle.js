(() => {
  // src/features/monitorados/options.js
  var MASTER_ID = "itemConfigGeral_gerenciarmonitorados";
  var SUB_ID = "itemConfigGeral_monitoradosacimacontrole";
  var ROW_ID = "monitoradosPro_beforeControl";
  var CONFIG_KEY = "gerenciarmonitorados";
  function applyDependency(masterOn) {
    const row = document.getElementById(ROW_ID);
    const sub = document.getElementById(SUB_ID);
    if (row) row.style.display = masterOn ? "" : "none";
    if (!masterOn && sub) sub.checked = false;
  }
  function readStoredEnabled() {
    return new Promise((resolve) => {
      try {
        chrome.storage.sync.get({ dataValues: "" }, (items) => {
          let enabled = true;
          try {
            const parsed = items.dataValues ? JSON.parse(items.dataValues) : [];
            const list = Array.isArray(parsed) ? parsed.map((e) => e && e.configGeral).find(Boolean) || [] : [];
            const found = list.find((v) => v && v.name === CONFIG_KEY);
            if (found && found.value === false) enabled = false;
          } catch (e) {
          }
          resolve(enabled);
        });
      } catch (e) {
        resolve(true);
      }
    });
  }
  function init() {
    const master = document.getElementById(MASTER_ID);
    if (!master) return;
    master.addEventListener("change", () => applyDependency(master.checked));
    readStoredEnabled().then((enabled) => applyDependency(enabled));
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
