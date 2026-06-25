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
  var qs = (sel, root = document) => root.querySelector(sel);
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
  function defaultConfigDate() {
    const moment2 = globalRef.moment;
    return {
      date: moment2().format("YYYY-MM-DD"),
      listdocs: false,
      dateDue: moment2().add(5, "d").format("YYYY-MM-DD"),
      countdown: true,
      countdays: false,
      workday: false,
      setdate: true,
      duenumber: 5,
      duecounter: "corrido",
      duemode: "depois",
      duesetdate: false,
      duedate: false,
      newdoc: true,
      selectdoc: false,
      advanced: false,
      displayformat: false,
      displayicon: false,
      displaydue: false,
      displaydue_txt: "Vencimento:",
      displaytip: "",
      deliverydoc: false,
      deliverydoc_style: "",
      newdoclist: []
    };
  }
  function defaultMonitoradoStore() {
    return { monitorados: [], config: { colortags: [] } };
  }
  function findMonitoradoIndex(store, id_procedimento) {
    if (!store || !store.monitorados) return -1;
    return store.monitorados.findIndex(function(obj) {
      return String(obj.id_procedimento) === String(id_procedimento);
    });
  }
  function monitoradoProcessDataReady(id_procedimento, dados2) {
    return typeof dados2 !== "undefined" && dados2 && Object.keys(dados2).length > 0 && dados2.constructor === Object && typeof dados2.listAndamento !== "undefined" && dados2.listAndamento !== null && dados2.hasOwnProperty("listAndamento") && typeof dados2.listAndamento.id_procedimento !== "undefined" && dados2.listAndamento.id_procedimento !== null && dados2.listAndamento.hasOwnProperty("id_procedimento") && String(dados2.listAndamento.id_procedimento) == String(id_procedimento) && typeof dados2.propProcesso !== "undefined" && dados2.propProcesso !== null;
  }
  function monitoradoProcessPayloadReady(id_procedimento, dados2) {
    return monitoradoProcessDataReady(id_procedimento, dados2) && typeof dados2.listDocumentosAssinados !== "undefined" && Array.isArray(dados2.listDocumentosAssinados);
  }

  // src/features/monitorados/store.js
  var STORE_KEY = "configDataMonitoradosPro";
  var storeState = null;
  var storeLastRaw = null;
  var remoteTimer = null;
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
  function getOptionsConfigDate(index) {
    const store = getStoreMonitoradoPro();
    const item = index >= 0 && store["monitorados"][index] ? store["monitorados"][index] : false;
    const hasConfig = item && item["configdate"] && Object.keys(item["configdate"]).length > 0;
    return hasConfig ? item["configdate"] : defaultConfigDate();
  }
  function persistMonitoradoStore(store, options) {
    const moment2 = globalRef.moment;
    options = options || {};
    storeState = store || getStoreMonitoradoPro();
    if (!storeState.config) storeState.config = { colortags: [] };
    storeState.config.datetime = moment2().format("YYYY-MM-DD HH:mm:ss");
    storeLastRaw = JSON.stringify(storeState);
    localStorage.setItem(STORE_KEY, storeLastRaw);
    if (options.remote !== false) scheduleMonitoradoRemote();
  }
  function scheduleMonitoradoRemote() {
    if (remoteTimer) clearTimeout(remoteTimer);
    remoteTimer = setTimeout(function() {
      remoteTimer = null;
      flushMonitoradoRemote();
    }, 800);
  }
  function flushMonitoradoRemote() {
    const jmespath = globalRef.jmespath;
    const store = getStoreMonitoradoPro();
    if (typeof store === "undefined" || !store.hasOwnProperty("monitorados")) return;
    if (typeof globalRef.perfilLoginAtiv === "undefined" || globalRef.perfilLoginAtiv === null) return;
    const sendMonitorados = { monitorados: [], config: { colortags: [] } };
    sendMonitorados.monitorados = jmespath.search(store.monitorados, "[*].{id_procedimento: id_procedimento, assuntos: assuntos, descricao: descricao, interessados: interessados, processo: processo, tipo_procedimento: tipo_procedimento, categoria: categoria, order: order, etiquetas: etiquetas, configdate: configdate}");
    sendMonitorados.config.colortags = store.config.colortags;
    globalRef.getServerAtividades({
      config: encodeURIComponent(globalRef.encodeJSON_toHex(JSON.stringify(sendMonitorados))),
      action: "set_monitorados"
    }, "set_monitorados");
    globalRef.setLocalFilePro(getStoreMonitoradoPro());
  }
  function getConfigDatetimeMonitorado() {
    const store = getStoreMonitoradoPro();
    persistMonitoradoStore(store, { remote: false });
    return store;
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

  // src/shared/ui/modal.js
  function openModal({ title = "", content = "", width = 600, buttons, onOpen, onClose, className = "" } = {}) {
    document.querySelectorAll(".seipro-modal").forEach((m) => m.remove());
    const overlay = document.createElement("div");
    overlay.className = "seipro-modal " + className;
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:100000;display:flex;align-items:center;justify-content:center;";
    overlay.innerHTML = '<div class="dialogBoxDiv seipro-modal-box" role="dialog" aria-modal="true" style="background:#fff;border-radius:6px;box-shadow:0 8px 30px rgba(0,0,0,.3);max-width:95vw;max-height:95vh;overflow:auto;width:' + width + 'px;"><div class="seipro-modal-head" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #eee;font-weight:bold;"><span class="seipro-modal-title">' + title + '</span><i class="fas fa-times" data-modal-close style="cursor:pointer;color:#888;"></i></div><div class="seipro-modal-body" style="padding:14px;"></div><div class="seipro-modal-buttons" style="display:flex;gap:8px;justify-content:flex-end;padding:10px 14px;border-top:1px solid #eee;"></div></div>';
    const body = overlay.querySelector(".seipro-modal-body");
    if (typeof content === "string") body.innerHTML = content;
    else if (content instanceof Node) body.appendChild(content);
    const ref = { el: overlay, body, close };
    let onKey;
    function close() {
      document.removeEventListener("keydown", onKey, true);
      if (typeof onClose === "function") {
        try {
          onClose(ref);
        } catch (e) {
        }
      }
      overlay.remove();
    }
    onKey = (ev) => {
      if (ev.key === "Escape") {
        ev.stopPropagation();
        close();
      }
    };
    document.addEventListener("keydown", onKey, true);
    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay || ev.target.closest("[data-modal-close]")) close();
    });
    const btnRow = overlay.querySelector(".seipro-modal-buttons");
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
    return ref;
  }

  // src/features/monitorados/maps.js
  var DEFAULT_LATLNG = [-15.800909532800379, -47.861289633438];
  var map = null;
  var markers = [];
  var markersLayer = false;
  var locationUser = false;
  var currentPosition = false;
  var locationDenied = false;
  function L() {
    return globalRef.L;
  }
  function jp() {
    return globalRef.jmespath;
  }
  function escHtml(s) {
    return typeof globalRef.escapeHtml === "function" ? globalRef.escapeHtml(s) : String(s == null ? "" : s);
  }
  function configureLeafletAssets() {
    const Lf = L();
    if (!Lf || !Lf.Icon || !Lf.Icon.Default) return;
    if (Lf.Icon.Default.prototype._seiProAssetsConfigured) return;
    Lf.Icon.Default.mergeOptions({
      iconRetinaUrl: globalRef.URL_SPRO + "css/images/marker-icon-2x.png",
      iconUrl: globalRef.URL_SPRO + "css/images/marker-icon.png",
      shadowUrl: globalRef.URL_SPRO + "css/images/marker-shadow.png"
    });
    Lf.Icon.Default.prototype._seiProAssetsConfigured = true;
  }
  function resolveGeocoder(Lf) {
    let geocoder = Lf.Control.Geocoder.nominatim();
    if (typeof URLSearchParams !== "undefined" && location.search) {
      const name = new URLSearchParams(location.search).get("geocoder");
      if (name && Lf.Control.Geocoder[name]) geocoder = Lf.Control.Geocoder[name]();
    }
    return geocoder;
  }
  function tileLayer(Lf) {
    return Lf.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '<a href="https://seipro.app" target="_blank">' + (globalRef.NAMESPACE_SPRO || "SEI Pro") + '</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1
    });
  }
  function followLinkHtml(id_procedimento) {
    const link = qs('#monitoradoTablePro tbody tr[data-id_procedimento="' + id_procedimento + '"] .followLinkProcesso');
    return link ? link.outerHTML : "";
  }
  function clearLocationUser() {
    const loading = qs(".loadingLocation");
    if (loading) loading.remove();
    if (locationUser) clearInterval(locationUser);
    locationUser = false;
  }
  function renderSingleMap(id_procedimento, readonly) {
    const Lf = L();
    const store = getStoreMonitoradoPro();
    const value = jp().search(store.monitorados, "[?id_procedimento=='" + id_procedimento + "'] | [0]") || false;
    const latlng = value && Array.isArray(value.latlng) && value.latlng[0] != null && value.latlng[1] != null ? value.latlng : false;
    const center = latlng || DEFAULT_LATLNG;
    function onLocationFound(e) {
      map.eachLayer((layer) => {
        if (layer._latlng !== void 0) layer.remove();
      });
      if (currentPosition) map.removeLayer(currentPosition);
      const radius = e.accuracy / 2;
      currentPosition = Lf.marker(e.latlng).addTo(map).bindPopup("Sua localiza\xE7\xE3o em um raio de " + radius + " metros deste ponto").openPopup();
      clearLocationUser();
      markers = e.latlng;
    }
    function onLocationError() {
      locationDenied = true;
      clearLocationUser();
    }
    function locate() {
      const old = qs(".loadingLocation");
      if (old) old.remove();
      const html = '<div class="loadingLocation" style="color:#888;position:absolute;z-index:9999;right:0;padding:5px 15px 5px 10px;background:#fff;border-bottom-left-radius:5px;font-size:10pt;"><i class="fas fa-spinner fa-spin"></i> Carregando sua localiza\xE7\xE3o <i class="fas fa-times-circle seipro-clear-location" style="cursor:pointer"></i></div>';
      const mapid = qs("#mapid");
      if (mapid) {
        const node = elFromHtml(html);
        node.querySelector(".seipro-clear-location").addEventListener("click", clearLocationUser);
        mapid.insertAdjacentElement("beforebegin", node);
      }
      map.locate({ setView: true, maxZoom: 16 });
    }
    markersLayer = new Lf.LayerGroup();
    map = Lf.map("mapid").setView(center, 16);
    configureLeafletAssets();
    Lf.Control.geocoder({ placeholder: "Localizar...", geocoder: resolveGeocoder(Lf) }).addTo(map).on("markgeocode", function(e) {
      map.eachLayer((layer) => {
        if (layer._latlng !== void 0) layer.remove();
      });
      const c = e.geocode.bbox.getCenter();
      Lf.marker([c.lat, c.lng]).addTo(map).bindPopup(e.geocode.html).openPopup();
      markers = c;
    });
    tileLayer(Lf).addTo(map);
    const marker = Lf.marker(center).addTo(map);
    markers = marker._latlng;
    if (value && latlng) {
      marker.bindPopup("<b>" + followLinkHtml(id_procedimento) + "</b><br>" + escHtml(value.descricao)).openPopup();
    }
    if (!readonly) {
      map.on("click", addMarker);
      if (latlng === false && !locationDenied) {
        locationUser = setInterval(locate, 3e3);
        map.on("locationfound", onLocationFound);
        map.on("locationerror", onLocationError);
      }
    }
  }
  function addMarker(e) {
    const Lf = L();
    clearLocationUser();
    map.eachLayer((layer) => {
      if (layer._latlng !== void 0) layer.remove();
    });
    Lf.marker(e.latlng).addTo(map);
    markers = e.latlng;
    setTimeout(() => map.panTo(new Lf.LatLng(e.latlng.lat, e.latlng.lng)), 500);
  }
  function renderMultipleMap() {
    const Lf = L();
    const store = getStoreMonitoradoPro();
    const list = jp().search(store.monitorados, "[?not_null(latlng)]");
    if (!list || !list.length) return;
    const bounds = [];
    markersLayer = new Lf.LayerGroup();
    map = Lf.map("mapid").setView(list[0].latlng, 16);
    configureLeafletAssets();
    Lf.Control.geocoder({ placeholder: "Localizar...", defaultMarkGeocode: false, geocoder: resolveGeocoder(Lf) }).addTo(map).on("markgeocode", function(e) {
      const c = e.geocode.bbox.getCenter();
      const m = Lf.marker([c.lat, c.lng]).addTo(map).bindPopup(e.geocode.html).openPopup();
      Lf.DomUtil.addClass(m._icon, "markerSearch");
      map.fitBounds([[c.lat, c.lng]]).setZoom(13);
    });
    tileLayer(Lf).addTo(map);
    list.forEach((value) => {
      const m = Lf.marker(value.latlng).addTo(map).on("click", openMarkerMonitorado);
      m.bindPopup("<b>" + followLinkHtml(value.id_procedimento) + "</b><br>" + escHtml(value.descricao));
      m.monitorados = value;
      bounds.push([m._latlng.lat, m._latlng.lng]);
    });
    map.fitBounds(bounds);
  }
  function openMarkerMonitorado(e) {
    const value = e.target.monitorados;
    const row = qs('#monitoradoTablePro tbody tr[data-id_procedimento="' + value.id_procedimento + '"]');
    if (typeof globalRef.scrollToElement === "function") {
      globalRef.scrollToElement(qs("#monitoradosProDiv .tabelaPanelScroll"), row, 30);
    }
    const toggle = qs("#monitoradoPro_" + value.id_procedimento);
    if (toggle) toggle.click();
  }
  function saveConfigMapsMonitorado(id_procedimento, mode = "add") {
    if (typeof markers !== "object" || markers.lat == null || markers.lng == null) return;
    const store = getStoreMonitoradoPro();
    const idx = findMonitoradoIndex(store, id_procedimento);
    if (idx < 0) return;
    store.monitorados[idx].latlng = mode === "remove" ? null : [markers.lat, markers.lng];
    persistMonitoradoStore(store);
    if (typeof globalRef.setPanelMonitorados === "function") globalRef.setPanelMonitorados("refresh");
    markers = [];
    setTimeout(() => {
      if (typeof globalRef.alertaBoxPro === "function") {
        globalRef.alertaBoxPro("Sucess", "check-circle", "Mapa " + (mode === "remove" ? "removido" : "adicionado") + " com sucesso!");
      }
    }, 500);
  }
  function openBoxSingleMap(triggerEl, readonly = false) {
    locationDenied = false;
    const row = triggerEl && triggerEl.closest ? triggerEl.closest("tr") : null;
    const id = row ? row.getAttribute("data-id_procedimento") : triggerEl && triggerEl.dataset ? triggerEl.dataset.id_procedimento : "";
    const buttons = readonly ? [{ text: "Fechar", onClick: (ref) => ref.close() }] : [
      { text: "Remover", onClick: (ref) => {
        saveConfigMapsMonitorado(id, "remove");
        ref.close();
      } },
      { text: "Salvar", class: "confirm", onClick: (ref) => {
        saveConfigMapsMonitorado(id);
        ref.close();
      } }
    ];
    openModal({
      title: "Processos Monitorados: Mapa",
      content: '<div id="mapid" style="width:600px;height:400px;max-width:100%;"></div>',
      width: 620,
      buttons,
      onOpen: () => renderSingleMap(id, readonly),
      onClose: () => {
        clearLocationUser();
        setTimeout(() => {
          markers = [];
        }, 1e3);
      }
    });
  }
  function openBoxMultipleMap() {
    openModal({
      title: "Processos Monitorados: Mapa",
      content: '<div id="mapid" style="width:900px;height:600px;max-width:100%;"></div>',
      width: 920,
      onOpen: renderMultipleMap
    });
  }

  // src/features/monitorados/panel.js
  var g = (name) => globalRef[name];
  var opt = (name) => typeof globalRef.getOptionsPro === "function" ? globalRef.getOptionsPro(name) : "";
  var esc = (s) => typeof globalRef.escapeHtml === "function" ? globalRef.escapeHtml(s) : String(s == null ? "" : s);
  var isNewSEI = () => globalRef.SeiPro && globalRef.SeiPro.sei && globalRef.SeiPro.sei.adapter.isNewSEI();
  function sortedMonitorados() {
    const jp2 = globalRef.jmespath;
    let list = getStoreMonitoradoPro().monitorados;
    list.forEach((m) => {
      if (m.order === null) m.order = -1;
    });
    if (typeof globalRef.checkObjHasProperty === "function" && globalRef.checkObjHasProperty(list, "order")) {
      list = jp2.search(list, "sort_by([*],&order)");
    }
    return list;
  }
  function rowHtml(value, index, arrayProcessosUnidade) {
    const id = value.id_procedimento;
    const linkDoc = globalRef.url_host + "?acao=procedimento_trabalhar&id_procedimento=" + id;
    const etq = Array.isArray(value.etiquetas) ? value.etiquetas : [];
    const tagsMonitorado = etq.length ? etq.join(";") : "";
    const tagsHtml = etq.map((i) => globalRef.getHtmlEtiqueta(i, "monitorado")).join("");
    const tagsClass = etq.map((i) => "tagTableName_" + globalRef.normalizeNameTag(i)).join(" ");
    const datesVal = value.configdate && value.configdate.date != null ? value.configdate.date : "";
    if (value.configdate && value.configdate.dateTo != null) value.configdate.dateTo = globalRef.moment().format("YYYY-MM-DD");
    const datesHtml = value.configdate ? globalRef.getDatesPreview(value.configdate) : "";
    const datesEl = datesHtml ? elFromHtml(datesHtml) : null;
    const tagDatesClass = datesEl && datesEl.dataset.tagname ? "tagTableName_" + datesEl.dataset.tagname : "";
    const aberto = arrayProcessosUnidade.indexOf(value.processo) !== -1;
    const iconProcesso = aberto ? "far fa-folder-open" : "fas fa-folder";
    const tipsProcesso = aberto ? "Processo aberto nesta unidade" : "Processo fechado nesta unidade";
    const issetOrder = value.order != null && value.order != -1;
    const order = issetOrder ? value.order : index;
    const categoria = value.categoria != null && value.categoria !== "" ? value.categoria : false;
    const procRow = qsa("#P" + id + " td:nth-child(2) a");
    const htmlIconsHome = procRow.map((a) => a.outerHTML).join("");
    const hasMap = value.latlng != null;
    return '<tr data-tagname="SemGrupo" data-index="' + index + '" data-id_procedimento="' + id + '" class="' + tagsClass + " " + tagDatesClass + '"><td align="center"><input type="checkbox" data-act="row-check" id="monitoradoPro_' + id + '" name="monitoradoPro" value="' + id + '"></td><td align="left"><a class="followLinkProcesso bLink" style="text-decoration:underline;" href="' + linkDoc + '"><i class="' + iconProcesso + ' bLink" style="text-decoration:underline;" title="' + tipsProcesso + '"></i> ' + esc(value.processo) + '</a><a class="newLink followLink followLinkNewtab" href="' + linkDoc + '" title="Abrir em nova aba" target="_blank"><i class="fas fa-external-link-alt" style="font-size:90%;text-decoration:underline;"></i></a><div class="info_icons_monitorado">' + htmlIconsHome + '</div></td><td align="left" class="tdmonitorado_dates ' + (datesHtml.trim() === "" ? "info_dates_follow_empty" : "") + '"><span class="info_dates_monitorado">' + datesHtml + '</span><a class="newLink followLink followLinkDates followLinkDatesEdit" data-act="dates-show" title="Editar prazo"><i class="fas fa-pencil-alt"></i></a><a class="newLink followLink followLinkDates followLinkDatesAdd" data-act="dates-show" title="Adicionar prazo"><i class="fas fa-stopwatch"></i></a><span class="info_dates_monitorado_txt" style="display:none;"><input value="' + datesVal + '" data-act="dates-hide-blur" data-key="dates" type="date" class="monitoradoDatesPro" name="monitoradoDatesPro"><a class="newLink" data-act="dates-hide" style="padding:2px;margin:0 2px;" title="Salvar"><i class="fas fa-thumbs-up"></i></a><a class="newLink monitoradoConfigDates" data-act="dates-config" style="padding:2px;margin:0 2px;" title="Op\xE7\xF5es"><i class="fas fa-cog"></i></a></span></td><td align="left" class="tdmonitorado_tags ' + (tagsHtml.trim() === "" ? "info_tags_follow_empty" : "") + '" data-etiqueta-mode="monitorado"><span class="info_tags_follow">' + tagsHtml + '</span><span class="info_tags_follow_txt" style="display:none"><input value="' + tagsMonitorado + '" class="monitoradoTagsPro" name="monitoradoTagsPro"></span><a class="newLink followLink followLinkTags followLinkTagsEdit" data-act="tags-show" title="Editar etiqueta"><i class="fas fa-pencil-alt"></i></a><a class="newLink followLink followLinkTags followLinkTagsAdd" data-act="tags-show" title="Adicionar etiqueta"><i class="fas fa-tags"></i></a></td><td class="tdmonitorado_map ' + (hasMap ? "" : "info_maps_follow_empty") + '"><span class="info_maps_follow">' + (hasMap ? '<a class="newLink" data-act="map-single-ro"><i class="fas fa-map-marked azulColor"></i></a>' : "") + '</span><a class="newLink followLink followLinkMaps followLinkMapsEdit" data-act="map-single" title="Editar mapa"><i class="fas fa-pencil-alt"></i></a><a class="newLink followLink followLinkMaps followLinkMapsAdd" data-act="map-single" title="Adicionar mapa"><i class="fas fa-map-marker-alt"></i></a></td><td class="content_desc"><span class="info_txt" style="display:none"><input data-act="desc-blur" data-key="desc" value="' + esc(value.descricao) + '" name="monitoradoDescriptionPro"></span><span class="info">' + esc(value.descricao) + '</span><a class="newLink followLink followLinkDesc" data-act="desc-edit" title="Editar especifica\xE7\xE3o"><i class="fas fa-pencil-alt"></i></a></td><td>' + esc(value.tipo_procedimento) + '<a class="newLink followLink followLinkTags followLinkMonitoradoRemove" data-act="remove-row" title="Remover dos Processos Monitorados"><i class="fas fa-trash-alt"></i></a></td><td class="td_monitorado_category"><span class="info_category_txt">' + (categoria ? esc(categoria) : "") + '</span><span class="info_category" style="display:none"></span><a class="newLink followLink followLinkTags followLinkMonitoradoCategory" data-act="category-edit" title="Editar categoria"><i class="fas fa-pencil-alt"></i></a></td><td align="center" data-order="' + order + '"><a class="newLink sorterTrMonitorado" style="margin-right:20px;cursor:grab;"><span class="fa-layers fa-fw"><i class="fas fa-bars cinzaColor"></i>' + (issetOrder ? '<span class="fa-layers-counter">' + value.order + "</span>" : "") + "</span></a></td></tr>";
  }
  function panelHtml() {
    const jp2 = globalRef.jmespath;
    const hidden = opt("monitoradosProDiv") === "hide";
    const statusView = hidden ? "display:none;" : "display: inline-table;";
    const iconShow = hidden ? "" : "display:none;";
    const iconHide = hidden ? "display:none;" : "";
    const all = sortedMonitorados();
    const selectedCategoryView = opt("panelMonitoradosView") || "";
    const list = selectedCategoryView !== "" ? jp2.search(all, "[?categoria=='" + selectedCategoryView + "']") : all;
    if (!list || !list.length) return null;
    const count = list.length + (list.length === 1 ? " registro:" : " registros:");
    const checkMaps = jp2.search(all, "length([?not_null(latlng)])") > 0;
    const arrayProcessosUnidade = typeof globalRef.getProcessoUnidadePro === "function" ? globalRef.getProcessoUnidadePro() : [];
    const th = isNewSEI() ? "infraTh" : "";
    const checkImg = isNewSEI() ? "svg/check.svg" : "imagens/check.gif";
    let table = '<table class="tableInfo tableZebra infraTable tableFollow tableMonitorados tabelaControle" data-name-table="Processos Monitorados" data-tabletype="monitorados" id="monitoradoTablePro"><caption class="infraCaption" style="text-align:left;">' + count + '</caption><thead><tr class="tableHeader"><th class="tituloControle ' + th + '" style="width:50px;" align="center"><span class="lblInfraCheck" aria-hidden="true"></span><a id="lnkInfraCheck" data-act="select-all"><img src="/infra_css/' + checkImg + '" id="imgRecebidosCheck" title="Selecionar Tudo" alt="Selecionar Tudo" class="infraImg"></a></th><th class="tituloControle ' + th + '" style="width:210px;">Processo</th><th class="tituloControle ' + th + ' tituloFilter" data-filter-type="date" style="width:150px;">Prazo</th><th class="tituloControle ' + th + ' tituloFilter" data-filter-type="etiqueta" style="width:150px;">Marcador</th><th class="tituloControle ' + th + ' tituloFilter" data-filter-type="etiqueta" style="width:80px;">Mapa</th><th class="tituloControle ' + th + '">Anota\xE7\xE3o</th><th class="tituloControle ' + th + '">Tipo de Processo</th><th class="tituloControle ' + th + '">Categoria</th><th class="tituloControle ' + th + '" style="width:50px;" align="center"><i class="fas fa-sort-numeric-up"></i></th></tr></thead><tbody>';
    list.forEach((value, index) => {
      if (selectedCategoryView === "" || selectedCategoryView === value.categoria) {
        table += rowHtml(value, index, arrayProcessosUnidade);
      }
    });
    table += "</tbody></table>";
    const idOrder = opt("orderPanelHome") && jp2.search(opt("orderPanelHome"), "[?name=='monitoradosPro'].index | length(@)") > 0 ? jp2.search(opt("orderPanelHome"), "[?name=='monitoradosPro'].index | [0]") : "";
    const selectCategory = typeof globalRef.selectCategoryMonitorado === "function" ? globalRef.selectCategoryMonitorado(selectedCategoryView, "changePanelCategoryMonitorado") : "";
    return { idOrder, html: '<div class="panelHomePro" style="display:inline-block;width:100%;" id="monitoradosPro" data-order="' + idOrder + '"><div class="infraBarraLocalizacao titlePanelHome"><i class="fas fa-star starGold" style="margin:0 5px;font-size:1.1em;"></i> Processos Monitorados<a class="newLink" id="monitoradosProDiv_showIcon" data-act="toggle-show" title="Mostrar Tabela" style="font-size:11pt;' + iconShow + '"><i class="fas fa-plus-square cinzaColor"></i></a><a class="newLink" id="monitoradosProDiv_hideIcon" data-act="toggle-hide" title="Recolher Tabela" style="font-size:11pt;' + iconHide + '"><i class="fas fa-minus-square cinzaColor"></i></a></div><div id="monitoradosProDiv" class="panelHome" style="width:100%;' + statusView + '"><div id="monitoradosProActions" style="top:0;position:absolute;z-index:9999;left:190px;width:calc(100% - 230px)"><a class="newLink iconMonitorados_remove" data-act="remove-selected" title="Remover processos monitorados" style="margin:0;font-size:14pt;display:none"><span class="fa-layers fa-fw"><i class="fas fa-trash-alt"></i><span class="fa-layers-counter">1</span></span></a><span style="display:block;float:right;width:200px;">' + selectCategory + '</span><a class="newLink iconMonitorados_update" data-act="update" title="Atualizar Informa\xE7\xF5es" style="margin-right:10px;font-size:14pt;float:right;"><i class="fas fa-sync-alt"></i></a><a class="newLink iconMonitorados_maps" data-act="map-multiple" title="Mapa de processos monitorados" style="margin:0;font-size:14pt;float:right;' + (checkMaps ? "" : "display:none;") + '"><i class="fas fa-map-marker-alt"></i></a><a class="newLink iconMonitorados_config" data-act="config" title="Configura\xE7\xF5es" style="margin:0;font-size:14pt;float:right;"><i class="fas fa-cog"></i></a></div><div class="tabelaPanelScroll">' + table + "</div></div></div>" };
  }
  function positionBeforeControl() {
    const panel = qs("#monitoradosPro");
    const control = qs("#processosSEIPro");
    if (panel && control) control.parentNode.insertBefore(panel, control);
  }
  function setPanelMonitorados(mode) {
    if (!getStoreMonitoradoPro().monitorados.length || mode !== "insert" && mode !== "refresh") {
      if (typeof globalRef.checkFileLocalMonitorado === "function") globalRef.checkFileLocalMonitorado();
      if (typeof globalRef.appendStarOnProcess === "function") globalRef.appendStarOnProcess();
      return;
    }
    const built = panelHtml();
    if (!built) {
      if (typeof globalRef.checkFileLocalMonitorado === "function") globalRef.checkFileLocalMonitorado();
      if (typeof globalRef.appendStarOnProcess === "function") globalRef.appendStarOnProcess();
      return;
    }
    if (mode === "insert") {
      const old = qs("#monitoradosPro");
      if (old) old.remove();
      if (typeof globalRef.orderDivPanel === "function") globalRef.orderDivPanel(built.html, built.idOrder, "monitoradosPro");
      positionBeforeControl();
      if (typeof globalRef.L === "undefined") {
        if (typeof globalRef.loadStylePro === "function") globalRef.loadStylePro(globalRef.URL_SPRO + "css/leaflet.css");
        if (globalRef.jQuery) globalRef.jQuery.getScript(globalRef.URL_SPRO + "js/lib/leaflet.js", function(d, ts, jqxhr) {
          if (typeof globalRef.L === "object" && jqxhr.status === 200) globalRef.jQuery.getScript(globalRef.URL_SPRO + "js/lib/leaflet-geocoder.js");
        });
      }
      if (opt("panelSortPro") && typeof globalRef.initSortDivPanel === "function") globalRef.initSortDivPanel();
    } else {
      const cur = qs("#monitoradosPro");
      if (cur) {
        cur.id = "monitoradosPro_temp";
        cur.insertAdjacentElement("afterend", elFromHtml(built.html));
        cur.remove();
        positionBeforeControl();
      }
    }
    if (typeof globalRef.initFunctionsPanelMonitorado === "function") globalRef.initFunctionsPanelMonitorado();
    if (typeof globalRef.checkFileSystemInit === "function") globalRef.checkFileSystemInit();
    if (typeof globalRef.appendStarOnProcess === "function") globalRef.appendStarOnProcess();
  }
  var CLICK = {
    "select-all": (el) => g("getSelectAllTr") && g("getSelectAllTr")(el, "SemGrupo"),
    "dates-show": (el) => g("showDatesMonitorado") && g("showDatesMonitorado")(el, "show"),
    "dates-hide": (el) => g("showDatesMonitorado") && g("showDatesMonitorado")(el, "hide"),
    "dates-config": (el) => g("openBoxConfigDates") && g("openBoxConfigDates")(el),
    "tags-show": (el) => g("showFollowEtiqueta") && g("showFollowEtiqueta")(el, "show", "monitorado"),
    "map-single-ro": (el) => g("openBoxSingleMap") && g("openBoxSingleMap")(el, true),
    "map-single": (el) => g("openBoxSingleMap") && g("openBoxSingleMap")(el),
    "desc-edit": (el) => g("editFollowDesc") && g("editFollowDesc")(el, "monitorado"),
    "remove-row": (el) => g("removeMonitoradoPainelPro") && g("removeMonitoradoPainelPro")(el, el.closest("tr") && el.closest("tr").dataset.id_procedimento),
    "category-edit": (el) => g("editCategoryMonitorado") && g("editCategoryMonitorado")(el, el.closest("tr") && el.closest("tr").dataset.id_procedimento),
    "toggle-show": () => g("toggleTablePro") && g("toggleTablePro")("#monitoradosProDiv", "show"),
    "toggle-hide": () => g("toggleTablePro") && g("toggleTablePro")("#monitoradosProDiv", "hide"),
    "remove-selected": (el) => g("removeMonitoradoPainelPro") && g("removeMonitoradoPainelPro")(el),
    "update": (el) => g("updateMonitorados") && g("updateMonitorados")(el),
    "map-multiple": () => g("openBoxMultipleMap") && g("openBoxMultipleMap")(),
    "config": (el) => g("openConfigMonitorados") && g("openConfigMonitorados")(el)
  };
  function bindPanelDispatcher(root = document) {
    if (root.__seiproMonitoradoPanelBound) return;
    root.__seiproMonitoradoPanelBound = true;
    root.addEventListener("click", (ev) => {
      const el = ev.target.closest("[data-act]");
      if (!el || !el.closest("#monitoradosPro")) return;
      const fn = CLICK[el.dataset.act];
      if (fn) {
        ev.preventDefault();
        fn(el);
      }
    });
    root.addEventListener("change", (ev) => {
      const el = ev.target.closest('[data-act="row-check"]');
      if (el && g("followSelecionarItens")) g("followSelecionarItens")(el);
    });
    root.addEventListener("focusout", (ev) => {
      const el = ev.target.closest("[data-act]");
      if (!el || !el.closest("#monitoradosPro")) return;
      if (el.dataset.act === "dates-hide-blur" && g("showDatesMonitorado")) g("showDatesMonitorado")(el, "hide");
      if (el.dataset.act === "desc-blur" && g("saveFollowDesc")) g("saveFollowDesc")(el, "monitorado");
    });
    root.addEventListener("keydown", (ev) => {
      const el = ev.target.closest("[data-act]");
      if (!el || !el.closest("#monitoradosPro")) return;
      if (el.dataset.key === "dates" && g("keyDatesMonitorado")) g("keyDatesMonitorado")(ev);
      if (el.dataset.key === "desc" && g("keyFollowDesc")) g("keyFollowDesc")(ev, "monitorado");
    });
  }

  // src/features/monitorados/datas.js
  var g2 = (name) => globalRef[name];
  var byId = (id) => document.getElementById(id);
  var moment = () => globalRef.moment;
  var preview = () => {
    if (typeof globalRef.configDatesPreview === "function") globalRef.configDatesPreview();
  };
  function appendNewdoclist(nameDoc) {
    return '<span class="dateboxDoc"><i class="far fa-file-alt" style="color:#777;padding-right:3px;"></i> ' + nameDoc + ' <i class="fas fa-times seipro-newdoc-remove" style="color:#F783AD;padding-left:3px;cursor:pointer"></i></span>';
  }
  function appendArrayNewdoclist(listArray) {
    return (listArray || []).map(appendNewdoclist).join("");
  }
  function sw(state, on, off) {
    return state ? on : off;
  }
  function formHtml(configdate, id_procedimento, store, monitoradoIndex) {
    const docList = store.monitorados[monitoradoIndex] && store.monitorados[monitoradoIndex].documentos || [];
    const duenumber = configdate.duenumber > 0 ? configdate.duenumber : Math.abs(configdate.duenumber);
    let docsOptions = "";
    docList.forEach((value) => {
      if (value.data_assinatura === "") return;
      const selected = configdate.listdocs && configdate.listdocs == value.id_protocolo ? "selected" : "";
      docsOptions += '<option data-sign="' + value.data_assinatura + '" data-id-protocolo="' + value.id_documento + '" value="' + value.id_documento + '" ' + selected + ">" + value.nome_documento + " (SEI n\xBA " + value.nr_sei + ") [assinado em " + value.data_assinatura + "]</option>";
    });
    let tiposOptions = "";
    if (store.config && Array.isArray(store.config.tiposdocs)) {
      store.config.tiposdocs.forEach((v) => {
        if (v.name !== "") tiposOptions += '<option value="' + v.id + '">' + v.name + "</option>";
      });
    }
    const swRow = (icon, label, id, type, checked, act = "switch-change", extra = "") => '<tr style="height:40px;"><td><i class="iconPopup iconSwitch fas ' + icon + " " + sw(checked, "azulColor", "cinzaColor") + '"></i> ' + label + '</td><td><div class="onoffswitch" style="float:right;"><input type="checkbox" data-act="' + act + '" ' + extra + ' class="onoffswitch-checkbox" id="configDatesBox_' + id + '" data-type="' + type + '" tabindex="0" ' + (checked ? "checked" : "") + '><label class="onoff-switch-label" for="configDatesBox_' + id + '"></label></div></td></tr>';
    return '<div id="configDatesBox"><table style="font-size:10pt;width:100%;" class="seiProForm"><tr style="height:40px;"><td colspan="2">Contar o tempo decorrido do processo a partir:</td></tr>' + swRow("fa-file-signature", "Da data de assinatura de um documento", "selectdoc", "selectdoc", configdate.selectdoc, "switch-selectdoc", 'data-id="' + id_procedimento + '"') + '<tr style="height:40px;' + sw(configdate.selectdoc, "", "display:none") + '" class="configDates_selectdoc"><td colspan="2"><select data-act="setupdate" id="configDatesBox_listdocs">' + docsOptions + '</select></td></tr><tr style="height:10px;display:none" class="configDates_selectdoc"><td colspan="2"></td></tr>' + swRow("fa-calendar-check", "De uma data espec\xEDfica", "setdate", "setdate", configdate.setdate) + '<tr style="height:40px;' + sw(configdate.setdate, "", "display:none") + '" class="configDates_setdate"><td><i class="iconPopup fas fa-clock cinzaColor"></i> Data referencial</td><td><input type="date" data-act="preview" id="configDatesBox_date" value="' + configdate.date + '" style="width:130px;float:right;"></td></tr><tr style="height:10px;"><td colspan="2"><a class="newLink ' + sw(configdate.advanced, "newLink_active", "") + '" data-act="advanced" style="font-size:10pt;cursor:pointer;margin:5px 0 0 0;float:right;"><i class="fas fa-wrench cinzaColor"></i> Op\xE7\xF5es avan\xE7adas</a></td></tr></table><table style="font-size:10pt;width:100%;' + sw(configdate.advanced, "", "display:none") + '" class="seiProForm configDates_advanced"><tr class="hrForm"><td colspan="4"></td></tr><tr style="height:40px;"><td colspan="2">Visualizar o resultado:</td></tr>' + swRow("fa-stopwatch", "Em tempo relativo", "countdown", "countdown", configdate.countdown) + swRow("fa-calendar-day", "Em n\xFAmero de dias", "countdays", "countdays", configdate.countdays) + '<tr style="height:40px;' + sw(configdate.countdays, "", "display:none") + '" class="configDates_countdays"><td><i class="iconPopup iconSwitch fas fa-briefcase ' + sw(configdate.workday, "azulColor", "cinzaColor") + '"></i> Calcular em dias \xFAteis</td><td><div class="onoffswitch" style="float:right;"><input type="checkbox" data-act="switch-icon" class="onoffswitch-checkbox" id="configDatesBox_workday" data-type="workday" tabindex="0" ' + (configdate.workday ? "checked" : "") + '><label class="onoff-switch-label" for="configDatesBox_workday"></label></div></td></tr><tr class="hrForm"><td colspan="4"></td></tr><tr style="height:40px;"><td colspan="2">Sinalizar a partir:</td></tr>' + swRow("fa-pen-fancy", "Da assinatura de um novo documento (EM BREVE)", "newdoc", "newdoc", configdate.newdoc) + '<tr class="configDates_newdoc"><td colspan="2"><span id="configDatesBox_newdoclist">' + appendArrayNewdoclist(configdate.newdoclist) + '</span></td></tr><tr style="height:40px;' + sw(configdate.newdoc, "", "display:none") + '" class="configDates_newdoc"><td colspan="2"><select id="configDatesBox_listnewdoc" data-act="docs-change"><option value="0">Qualquer tipo de documento</option>' + tiposOptions + '</select></td></tr><tr style="height:10px;"><td colspan="2"></td></tr>' + swRow("fa-hourglass-half", "Do n\xFAmero de dias decorridos", "duedate", "duedate", configdate.duedate) + '<tr style="height:40px;' + sw(configdate.duedate, "", "display:none") + '" class="configDates_duedate"><td colspan="2"><input type="number" data-act="preview" id="configDatesBox_duenumber" value="' + duenumber + '" style="width:40px;margin-left:35px !important;" min="0"> dias <select id="configDatesBox_duecounter" data-act="preview" style="width:auto;"><option value="corrido" ' + sw(configdate.duecounter === "corrido", "selected", "") + '>corridos</option><option value="util" ' + sw(configdate.duecounter === "util", "selected", "") + '>\xFAteis</option></select><select id="configDatesBox_duemode" data-act="preview" style="width:auto;"><option value="depois" ' + sw(configdate.duemode === "depois", "selected", "") + '>depois</option><option value="antes" ' + sw(configdate.duemode === "antes", "selected", "") + '>antes</option></select><span class="configDates_selectdoc" style="display:none">da data de assinatura</span><span class="configDates_setdate">da data de refer\xEAncia</span></td></tr><tr style="height:10px;" class="configDates_duedate"><td colspan="2"></td></tr>' + swRow("fa-calendar-alt", "De uma data de vencimento espec\xEDfica", "duesetdate", "duesetdate", configdate.duesetdate) + '<tr style="height:40px;' + sw(configdate.duesetdate, "", "display:none") + '" class="configDates_duesetdate"><td><i class="iconPopup iconSwitch fas fa-clock cinzaColor"></i> Data de vencimento</td><td><input type="date" data-act="preview" id="configDatesBox_duesetdt" value="' + configdate.dateDue + '" style="width:130px;float:right;"></td></tr></table><table style="font-size:10pt;width:100%;" class="seiProForm"><tr class="hrForm"><td colspan="4"></td></tr><tr style="height:40px;"><td colspan="2">Pr\xE9via:</td></tr><tr style="height:40px;"><td colspan="2"><div id="dateboxPreview" style="display:none;text-align:center;"></div></td></tr></table><input type="hidden" value="' + id_procedimento + '" id="configDatesBox_id_procedimento"></div>';
  }
  function switchGroup(el, o1, o2, o3) {
    const type = el.dataset.type;
    const group = o3 ? [o1, o2, o3] : [o1, o2];
    if (group.indexOf(type) !== -1) {
      let active;
      if (el.checked) active = type;
      else if (type === o2) active = o1;
      else active = o2;
      group.forEach((opt2) => {
        const on = opt2 === active;
        const cb = byId("configDatesBox_" + opt2);
        if (cb) {
          cb.checked = on;
          const row2 = cb.closest("tr");
          if (row2) qsa(".iconSwitch", row2).forEach((i) => i.classList.toggle("azulColor", on));
        }
        qsa(".configDates_" + opt2).forEach((n) => {
          n.style.display = on ? "" : "none";
        });
      });
    }
    const row = el.closest("tr");
    if (row) qsa(".iconSwitch", row).forEach((i) => i.classList.toggle("azulColor", el.checked));
  }
  function switchChange(el) {
    switchGroup(el, "countdown", "countdays");
    switchGroup(el, "setdate", "selectdoc");
    switchGroup(el, "duedate", "newdoc", "duesetdate");
    preview();
    const sd = byId("configDatesBox_selectdoc");
    if (sd && sd.checked) setUpdate("update");
  }
  function switchIcon(el) {
    const row = el.closest("tr");
    if (row) qsa(".iconSwitch", row).forEach((i) => i.classList.toggle("azulColor", el.checked));
    preview();
  }
  function advanced(el) {
    qsa(".configDates_advanced").forEach((n) => {
      n.style.display = n.style.display === "none" ? "" : "none";
    });
    el.classList.toggle("newLink_active");
  }
  function setUpdate(mode) {
    const sel = byId("configDatesBox_listdocs");
    const opt2 = sel && sel.options[sel.selectedIndex];
    const dataSign = opt2 && opt2.getAttribute("data-sign");
    if (dataSign) {
      byId("configDatesBox_date").value = moment()(dataSign, "DD/MM/YYYY").format("YYYY-MM-DD");
      if (mode === "update") preview();
    }
  }
  function docsChange(el) {
    const nameDoc = el.options[el.selectedIndex] ? el.options[el.selectedIndex].text : "";
    const valueDoc = parseInt((el.value || "").trim());
    const listEl = byId("configDatesBox_newdoclist");
    const selected = qsa(".dateboxDoc", listEl).map((s) => s.textContent.trim());
    if (valueDoc === 0) {
      listEl.innerHTML = "";
      return;
    }
    if (!selected.includes(nameDoc)) {
      if (selected.length > 10) {
        alert("Atingido o limite de documentos para pesquisa (10)");
        return;
      }
      listEl.insertAdjacentHTML("beforeend", appendNewdoclist(nameDoc));
    }
  }
  function getConfigDates() {
    const chk = (id) => {
      const e = byId("configDatesBox_" + id);
      return !!(e && e.checked);
    };
    const val = (id) => {
      const e = byId("configDatesBox_" + id);
      return e ? (e.value || "").trim() : "";
    };
    const duemode = val("duemode");
    let duenumber = val("duenumber");
    duenumber = duemode === "depois" ? duenumber : -Math.abs(duenumber);
    const newdoc = chk("newdoc");
    const listEl = byId("configDatesBox_newdoclist");
    const newdoclist = newdoc && listEl ? qsa(".dateboxDoc", listEl).map((s) => s.textContent.trim()) : [];
    const countdays = chk("countdays"), duedate = chk("duedate"), duesetdate = chk("duesetdate");
    const listdocsSel = byId("configDatesBox_listdocs");
    const listdocs = listdocsSel && listdocsSel.options[listdocsSel.selectedIndex] ? listdocsSel.options[listdocsSel.selectedIndex].getAttribute("data-id-protocolo") : void 0;
    return {
      date: val("date"),
      dateDue: val("duesetdt"),
      advanced: countdays || duedate || duesetdate || newdoclist.length > 0,
      newdoclist,
      listdocs,
      setdate: chk("setdate"),
      newdoc,
      countdown: chk("countdown"),
      countdays,
      workday: chk("workday"),
      duenumber: parseInt(duenumber),
      duecounter: val("duecounter"),
      duemode,
      duesetdate,
      duedate,
      selectdoc: chk("selectdoc")
    };
  }
  function applyAndClose(triggerEl, remove, ref) {
    const config = remove ? null : getConfigDates();
    const store = getStoreMonitoradoPro();
    const id = parseInt((byId("configDatesBox_id_procedimento") || {}).value || "");
    const idx = findMonitoradoIndex(store, id);
    if (idx < 0) {
      if (g2("alertaBoxPro")) g2("alertaBoxPro")("Error", "exclamation-triangle", "Erro ao cadastrar!");
      return;
    }
    const inAtividade = triggerEl && triggerEl.closest && triggerEl.closest("#frmAtividadeListar");
    const tr = qs('#monitoradoTablePro tr[data-id_procedimento="' + id + '"]');
    if (!inAtividade && tr) {
      const info = qs(".info_dates_monitorado", tr);
      if (info) {
        info.innerHTML = remove ? "" : g2("getDatesPreview")(config);
        info.style.display = "";
      }
      const txt = qs(".info_dates_monitorado_txt", tr);
      if (txt) txt.style.display = "none";
      const editLink = qs(".followLinkDatesEdit", tr);
      if (editLink) editLink.style.display = "";
      const dateInput = qs(".monitoradoDatesPro", tr);
      if (dateInput) dateInput.value = remove ? "" : config.date;
    }
    store.monitorados[idx].configdate = config;
    persistMonitoradoStore(store);
    if (g2("alertaBoxPro")) g2("alertaBoxPro")("Sucess", "check-circle", "Contagem de tempo " + (remove ? "removida" : "cadastrada") + " com sucesso!");
    if (ref) ref.close();
  }
  function waitProcessData(id, callback, onTimeout, requireDocs) {
    const eventName = "sei-pro-process-session-updated";
    let resolved = false, timeoutId = null;
    const ready = (d) => monitoradoProcessDataReady(id, d) && (!requireDocs || typeof d.listDocumentosAssinados !== "undefined");
    const handler = (event) => {
      const detail = event && event.detail || {};
      if (detail.id_procedimento != null && String(detail.id_procedimento) !== String(id)) return;
      const d = g2("pullDadosProcessoSession")(id);
      if (ready(d)) {
        resolved = true;
        window.removeEventListener(eventName, handler);
        if (timeoutId) clearTimeout(timeoutId);
        callback(d);
      }
    };
    const d0 = g2("pullDadosProcessoSession")(id);
    if (ready(d0)) {
      callback(d0);
      return true;
    }
    window.addEventListener(eventName, handler);
    timeoutId = setTimeout(() => {
      if (!resolved) {
        window.removeEventListener(eventName, handler);
        if (onTimeout) onTimeout();
      }
    }, 15e3);
    return false;
  }
  function getDadosSelectDoc(el, id) {
    if (!el.checked) return;
    globalRef.dadosProcessoPro = {};
    const cell = el.closest("tr") && el.closest("tr").querySelector("td");
    if (cell) cell.classList.add("editCellLoading");
    g2("getDadosIframeProcessoPro")(String(id), "monitorados");
    waitProcessData(id, () => {
      globalRef.dadosProcessoPro = g2("pullDadosProcessoSession")(id);
      if (cell) cell.classList.remove("editCellLoading");
      updateSelect(id);
    }, () => {
      if (cell) cell.classList.remove("editCellLoading");
    }, true);
  }
  function updateSelect(id) {
    const dados2 = globalRef.dadosProcessoPro;
    if (!dados2 || !Array.isArray(dados2.listDocumentosAssinados) || !dados2.listDocumentosAssinados.length) return;
    const sel = byId("configDatesBox_listdocs");
    const cur = sel ? (sel.value || "").trim() : "";
    sel.innerHTML = dados2.listDocumentosAssinados.map((v) => {
      if (v.data_assinatura === "") return "";
      const s = cur !== "" && cur == v.id_documento ? "selected" : "";
      return '<option data-sign="' + v.data_assinatura + '" data-id-protocolo="' + v.id_documento + '" ' + s + ">" + v.nome_documento + " (SEI n\xBA " + v.nr_sei + ") [assinado em " + v.data_assinatura + "]</option>";
    }).join("");
    const store = getStoreMonitoradoPro();
    const idx = findMonitoradoIndex(store, id);
    if (idx >= 0) {
      store.monitorados[idx].documentos = dados2.listDocumentosAssinados;
      store.monitorados[idx].andamento = dados2.listAndamento.andamento;
      persistMonitoradoStore(store);
    }
  }
  function bindForm(body, id_procedimento) {
    body.addEventListener("change", (ev) => {
      const el = ev.target.closest("[data-act]");
      if (!el) return;
      switch (el.dataset.act) {
        case "switch-change":
          switchChange(el);
          break;
        case "switch-selectdoc":
          switchChange(el);
          getDadosSelectDoc(el, id_procedimento);
          break;
        case "switch-icon":
          switchIcon(el);
          break;
        case "preview":
          preview();
          break;
        case "setupdate":
          setUpdate("update");
          break;
        case "docs-change":
          docsChange(el);
          break;
        default:
          break;
      }
    });
    body.addEventListener("click", (ev) => {
      const adv = ev.target.closest('[data-act="advanced"]');
      if (adv) {
        ev.preventDefault();
        advanced(adv);
        return;
      }
      const rm = ev.target.closest(".seipro-newdoc-remove");
      if (rm) {
        const sp = rm.closest(".dateboxDoc");
        if (sp) sp.remove();
      }
    });
  }
  function openBoxConfigDates(triggerEl) {
    const tr = triggerEl && triggerEl.closest ? triggerEl.closest("tr") : null;
    const id_procedimento = tr ? parseInt(tr.getAttribute("data-id_procedimento")) : NaN;
    const store = getStoreMonitoradoPro();
    const idx = findMonitoradoIndex(store, id_procedimento);
    const dateInputEl = triggerEl && triggerEl.closest(".info_dates_monitorado_txt") ? triggerEl.closest(".info_dates_monitorado_txt").querySelector(".monitoradoDatesPro") : null;
    const dateInput = dateInputEl ? (dateInputEl.value || "").trim() : "";
    const configdate = getOptionsConfigDate(idx);
    configdate.date = dateInput === "" ? configdate.date : dateInput;
    openModal({
      title: "Processos Monitorados: Op\xE7\xF5es",
      width: 500,
      content: formHtml(configdate, id_procedimento, store, idx),
      buttons: [
        { text: "Remover", onClick: (ref) => applyAndClose(triggerEl, true, ref) },
        { text: "Ok", class: "confirm", onClick: (ref) => applyAndClose(triggerEl, false, ref) }
      ],
      onOpen: (ref) => {
        bindForm(ref.body, id_procedimento);
        preview();
      }
    });
  }
  function actionMonitoradoCheckbox(el) {
    const box = el.closest(".infraDivCheckbox");
    const optionsDiv = box ? box.querySelector(".monitoradosLabelOptions") : null;
    if (el.checked) {
      if (g2("actMonitoradoPro")) g2("actMonitoradoPro")(false, "add");
      if (optionsDiv) optionsDiv.style.display = "";
    } else {
      if (g2("actMonitoradoPro")) g2("actMonitoradoPro")(false, "remove");
      if (optionsDiv) {
        optionsDiv.style.display = "none";
        optionsDiv.querySelectorAll(".selectPro, #monitoradoPrazoSend, .monitoradoTagsPro").forEach((i) => {
          i.value = "";
        });
        optionsDiv.querySelectorAll(".info_tags_follow").forEach((n) => {
          n.innerHTML = "";
        });
        optionsDiv.querySelectorAll("div.tagsinput .tag").forEach((n) => n.remove());
      }
    }
  }
  function updateCountTableMonitorado() {
    const rows = qsa(".tableFollow tbody tr").filter((r) => r.offsetParent !== null);
    const cap = qs(".tableFollow caption.infraCaption");
    if (cap) cap.textContent = rows.length + (rows.length === 1 ? " registro:" : " registros:");
  }
  function installDatas() {
    aliasGlobal("openBoxConfigDates", openBoxConfigDates);
    aliasGlobal("getConfigDatesMonitorado", getConfigDates);
    aliasGlobal("configDatesSwitchChange", switchChange);
    aliasGlobal("configDatesSwitchIcon", switchIcon);
    aliasGlobal("configDatesAdvanced", advanced);
    aliasGlobal("configDatesDocsChange", docsChange);
    aliasGlobal("configDatesSetUpdate", setUpdate);
    aliasGlobal("updateSelectMonitorados", updateSelect);
    aliasGlobal("waitMonitoradoProcessData", waitProcessData);
    aliasGlobal("actionMonitoradoCheckbox", actionMonitoradoCheckbox);
    aliasGlobal("updateCountTableMonitorado", updateCountTableMonitorado);
  }

  // src/features/monitorados/categorias.js
  function selectCategoryMonitorado(select = "", func = false, newItem = false, id_procedimento = 0) {
    const list = getStoreMonitoradoPro().monitorados;
    let cats = globalRef.jmespath.search(list, "[*].categoria");
    cats = cats !== null && typeof globalRef.uniqPro === "function" ? globalRef.uniqPro(cats) : cats || [];
    const options = (cats || []).map((v) => {
      if (v === null || v === "") return "";
      return '<option value="' + v + '" ' + (select !== null && v == select ? "selected" : "") + ">" + v + "</option>";
    }).join("");
    const act = func === "changePanelCategoryMonitorado" ? "category-panel" : func === "changeCategoryMonitorado" ? "category-change" : "";
    const attrs = id_procedimento ? 'style="margin:0 !important;font-size:10pt;" data-id="' + id_procedimento + '"' : 'style="width:100%;font-size:10pt;"';
    return '<select class="selectPro" ' + attrs + (act ? ' data-act="' + act + '"' : "") + '><option value="&nbsp;">&nbsp;</option>' + options + (newItem ? '<option value="new">\u2795 Nova categoria</option>' : "") + "</select>";
  }
  function editCategoryMonitorado(el, id_procedimento) {
    const td = el.closest("td");
    const catElem = qs(".info_category", td);
    const catTxt = qs(".info_category_txt", td);
    const icon = el.querySelector("i");
    if (catElem && catElem.offsetParent !== null) {
      catElem.style.display = "none";
      if (catTxt) catTxt.style.display = "";
      if (icon) icon.className = "fas fa-pencil-alt";
    } else {
      const value = globalRef.jmespath.search(getStoreMonitoradoPro().monitorados, "[?id_procedimento=='" + id_procedimento + "'] | [0]");
      catElem.style.display = "";
      catElem.innerHTML = selectCategoryMonitorado(value ? value.categoria : "", "changeCategoryMonitorado", true, id_procedimento);
      if (catTxt) catTxt.style.display = "none";
      if (icon) icon.className = "fas fa-thumbs-up";
    }
  }
  function changePanelCategoryMonitorado(el) {
    if (typeof globalRef.setOptionsPro === "function") globalRef.setOptionsPro("panelMonitoradosView", (el.value || "").trim());
    if (typeof globalRef.setPanelMonitorados === "function") globalRef.setPanelMonitorados("refresh");
  }
  function saveCategoryMonitorado(refEl, value) {
    const id = refEl && refEl.dataset ? refEl.dataset.id : void 0;
    const store = getStoreMonitoradoPro();
    const idx = findMonitoradoIndex(store, id);
    if (idx >= 0) store.monitorados[idx].categoria = value;
    persistMonitoradoStore(store);
    if (typeof globalRef.setPanelMonitorados === "function") globalRef.setPanelMonitorados("refresh");
  }
  function promptNewCategory(selectEl) {
    let saved = false;
    const commit = (ref, v) => {
      saved = true;
      saveCategoryMonitorado(selectEl, v);
      ref.close();
    };
    openModal({
      title: "Adicionar nova categoria",
      width: 400,
      content: '<div class="seiProForm" style="text-align:center;font-size:9pt;"><i class="fas fa-info-circle azulColor" style="margin-right:5px;"></i> Digite o nome da nova categoria:<br><br><input type="text" class="required infraText" id="nomeNovoItem" style="width:90% !important;"></div>',
      buttons: [{ text: "Ok", class: "confirm", onClick: (ref) => commit(ref, ref.body.querySelector("#nomeNovoItem").value.trim()) }],
      onOpen: (ref) => {
        const inp = ref.body.querySelector("#nomeNovoItem");
        inp.focus();
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") commit(ref, inp.value.trim());
        });
      },
      onClose: () => {
        if (saved) return;
        const td = selectEl.closest("td");
        if (td) {
          const catElem = qs(".info_category", td);
          const catTxt = qs(".info_category_txt", td);
          if (catElem) {
            catElem.style.display = "none";
            catElem.innerHTML = "";
          }
          if (catTxt) catTxt.style.display = "";
        }
      }
    });
  }
  function changeCategoryMonitorado(selectEl) {
    if (selectEl.value === "new") promptNewCategory(selectEl);
    else saveCategoryMonitorado(selectEl, (selectEl.value || "").trim());
  }
  function installCategorias() {
    aliasGlobal("selectCategoryMonitorado", selectCategoryMonitorado);
    aliasGlobal("editCategoryMonitorado", editCategoryMonitorado);
    aliasGlobal("changePanelCategoryMonitorado", changePanelCategoryMonitorado);
    aliasGlobal("changeCategoryMonitorado", changeCategoryMonitorado);
    aliasGlobal("saveCategoryMonitorado", saveCategoryMonitorado);
    if (globalRef.__seiproMonitoradoCategoriaBound) return;
    globalRef.__seiproMonitoradoCategoriaBound = true;
    document.addEventListener("change", (ev) => {
      const el = ev.target.closest("select.selectPro[data-act]");
      if (!el) return;
      if (el.dataset.act === "category-panel") changePanelCategoryMonitorado(el);
      else if (el.dataset.act === "category-change") changeCategoryMonitorado(el);
    });
  }

  // src/features/monitorados/commands.js
  var g3 = (n) => globalRef[n];
  var dados = () => globalRef.dadosProcessoPro;
  var setDados = (v) => {
    globalRef.dadosProcessoPro = v;
  };
  function processAnchor2(treeDoc) {
    if (!treeDoc) return null;
    return treeDoc.querySelector('#topmenu a[target="ifrConteudoVisualizacao"], #topmenu a[target="ifrVisualizacao"]');
  }
  function visualizacaoDoc() {
    const ifr = document.querySelector("#ifrConteudoVisualizacao, #ifrVisualizacao");
    try {
      return ifr && ifr.contentDocument ? ifr.contentDocument : null;
    } catch (e) {
      return null;
    }
  }
  function removeMonitoradoPro(id_procedimento, store = false) {
    store = store || getStoreMonitoradoPro();
    store.monitorados = store.monitorados.filter((item) => item.id_procedimento != id_procedimento);
    return store;
  }
  function addMonitoradoPro(id_procedimento = false) {
    let store = getStoreMonitoradoPro();
    const d = dados() || {};
    const id = id_procedimento || (d.listAndamento ? d.listAndamento.id_procedimento : false);
    if (id !== false) store = removeMonitoradoPro(id, store);
    const andamento = d.listAndamento || {};
    const prop = d.propProcesso || {};
    store.monitorados.push({
      id_procedimento: andamento.id_procedimento,
      processo: andamento.processo,
      andamento: andamento.andamento || [],
      documentos: d.listDocumentosAssinados || [],
      tipo_procedimento: prop.hdnNomeTipoProcedimento || "",
      assuntos: prop.selAssuntos_select || [],
      interessados: prop.selInteressadosProcedimento || [],
      descricao: prop.txtDescricao || "",
      order: -1,
      categoria: ""
    });
    return store;
  }
  function storeMonitoradoPro(mode, id_procedimento) {
    const store = mode === "add" ? addMonitoradoPro(id_procedimento) : removeMonitoradoPro(id_procedimento);
    const d = dados();
    if (d && Array.isArray(d.tiposDocumentos) && d.tiposDocumentos.length > 0) store.config.tiposdocs = d.tiposDocumentos;
    persistMonitoradoStore(store);
    if (typeof g3("appendIconMonitorados") === "function") g3("appendIconMonitorados")();
    if (!document.getElementById("ifrArvore")) {
      if (!document.getElementById("monitoradosPro")) {
        if (g3("setPanelMonitorados")) g3("setPanelMonitorados")("insert");
        if (g3("initAppendIconMonitorados")) g3("initAppendIconMonitorados")();
      } else if (!store.monitorados || store.monitorados.length === 0) {
        const panel = document.getElementById("monitoradosPro");
        if (panel) panel.remove();
        if (g3("appendStarOnProcess")) g3("appendStarOnProcess")();
      } else if (g3("setPanelMonitorados")) {
        g3("setPanelMonitorados")("refresh");
      }
      setDados({});
      const kanban = document.getElementById("processosKanban");
      if (kanban && kanban.offsetParent !== null && g3("addKanbanProc")) g3("addKanbanProc")();
    }
  }
  function getFallbackMonitoradoRowData(target, id_procedimento) {
    let row = target && target.closest ? target.closest("tr") : null;
    if (!row && id_procedimento) {
      row = qsa(".tabelaControle tr").find((r) => {
        const a = r.querySelector('a[href*="id_procedimento="]');
        return a && String(g3("getParamsUrlPro")(a.getAttribute("href")).id_procedimento) === String(id_procedimento);
      }) || null;
    }
    if (!row) return false;
    const rowText = row.textContent.trim();
    const checkbox = row.querySelector('input[type="checkbox"]');
    const hrefProcesso = row.querySelector('a[href*="acao=procedimento_trabalhar"]');
    const cells = row.querySelectorAll("td");
    let processo = cells[3] ? cells[3].textContent.trim() : "";
    let descricao = cells[2] ? cells[2].textContent.trim() : "";
    let tipo_procedimento = "";
    const cbHelp = checkbox ? checkbox.getAttribute("title") || checkbox.getAttribute("aria-label") || checkbox.getAttribute("data-original-title") || "" : "";
    const cbDesc = checkbox ? checkbox.getAttribute("alt") || checkbox.getAttribute("label") || "" : "";
    if (!processo && cbHelp) processo = cbHelp.trim();
    if (!processo && hrefProcesso) processo = hrefProcesso.textContent.trim();
    if (!descricao && cbDesc) {
      const m = cbDesc.match(/Especifica(?:ção|cao)\s+(.+)$/i);
      if (m && m[1]) descricao = m[1].trim();
    }
    const tt = hrefProcesso && hrefProcesso.getAttribute("onmouseover") || "";
    const ttArr = typeof g3("extractTooltipToArray") === "function" ? g3("extractTooltipToArray")(tt) : null;
    if (ttArr && ttArr.length > 1) tipo_procedimento = ttArr[1].split(" / ")[0].trim();
    if (!tipo_procedimento && cbDesc) {
      const m = cbDesc.match(/Tipo\s+(.+?)(?:\s*\/\s*Especifica(?:ção|cao)\s+|$)/i);
      if (m && m[1]) tipo_procedimento = m[1].trim();
    }
    if (!descricao && rowText) descricao = rowText.replace(/\s+/g, " ").trim();
    if (!processo) processo = String(id_procedimento);
    return {
      listAndamento: { historico_completo: false, processo, id_procedimento: String(id_procedimento), andamento: [] },
      listDocumentosAssinados: [],
      tiposDocumentos: [],
      propProcesso: { hdnIdProcedimento: String(id_procedimento), hdnNomeTipoProcedimento: tipo_procedimento, selAssuntos_select: [], selInteressadosProcedimento: [], txtDescricao: descricao }
    };
  }
  function saveImmediateMonitoradoPro(target, id_procedimento) {
    const fallback = getFallbackMonitoradoRowData(target, id_procedimento);
    if (!fallback) return false;
    setDados(fallback);
    storeMonitoradoPro("add", id_procedimento);
    return fallback;
  }
  function snapshot(item) {
    return JSON.stringify({
      processo: item.processo || "",
      andamento: item.andamento || [],
      documentos: item.documentos || [],
      tipo_procedimento: item.tipo_procedimento || "",
      assuntos: item.assuntos || [],
      interessados: item.interessados || [],
      descricao: item.descricao || ""
    });
  }
  function syncMonitoradoProProcessData(id_procedimento, d) {
    if (id_procedimento == null || id_procedimento === "") return;
    if (!d || !d.propProcesso) return;
    const store = getStoreMonitoradoPro();
    if (!store.monitorados || !store.monitorados.length) return;
    const idx = findMonitoradoIndex(store, id_procedimento);
    if (idx === -1) return;
    const andamento = d.listAndamento || {};
    const prop = d.propProcesso || {};
    const item = store.monitorados[idx];
    const before = snapshot(item);
    item.id_procedimento = andamento.id_procedimento || item.id_procedimento;
    item.processo = andamento.processo || item.processo;
    item.andamento = andamento.andamento || item.andamento || [];
    item.documentos = d.listDocumentosAssinados || item.documentos || [];
    item.tipo_procedimento = prop.hdnNomeTipoProcedimento || item.tipo_procedimento || "";
    item.assuntos = prop.selAssuntos_select || item.assuntos || [];
    item.interessados = prop.selInteressadosProcedimento || item.interessados || [];
    item.descricao = prop.txtDescricao || item.descricao || "";
    if (Array.isArray(d.tiposDocumentos) && d.tiposDocumentos.length > 0) {
      store.config = store.config || {};
      store.config.tiposdocs = d.tiposDocumentos;
    }
    persistMonitoradoStore(store);
    if (!document.getElementById("ifrArvore") && document.getElementById("monitoradosPro") && before !== snapshot(item) && g3("setPanelMonitorados")) {
      g3("setPanelMonitorados")("refresh");
    }
  }
  function checkDataMonitoradoPro(this_, mode, id_procedimento) {
    const treeDoc = frameDoc("ifrArvore");
    const target = this_ || treeDoc && treeDoc.getElementById("iconMonitoradoPro_" + id_procedimento);
    let saved = false;
    const storeWhenReady = (d) => {
      setDados(d || dados());
      const dd = dados();
      if (dd && !dd.hasOwnProperty("tiposDocumentos")) dd.tiposDocumentos = [];
      if (dd && !dd.hasOwnProperty("listDocumentosAssinados")) dd.listDocumentosAssinados = [];
      if (mode === "add" && saved) syncMonitoradoProProcessData(id_procedimento, dd);
      else {
        storeMonitoradoPro(mode, id_procedimento);
        saved = mode === "add";
      }
    };
    if (mode === "remove") {
      storeWhenReady();
      return true;
    }
    const d0 = g3("pullDadosProcessoSession")(id_procedimento);
    if (monitoradoProcessPayloadReady(id_procedimento, d0)) {
      storeWhenReady(d0);
      return true;
    }
    if (mode === "add") saved = !!saveImmediateMonitoradoPro(target, id_procedimento);
    if (typeof g3("waitMonitoradoProcessData") === "function") {
      g3("waitMonitoradoProcessData")(id_procedimento, (d) => {
        if (monitoradoProcessPayloadReady(id_procedimento, d)) storeWhenReady(d);
      }, () => {
      }, false);
    }
    if (mode === "add" && g3("getDadosIframeProcessoPro")) g3("getDadosIframeProcessoPro")(id_procedimento, "monitorados");
    return false;
  }
  function actMonitoradoPro(this_, mode) {
    let id_procedimento, treeDoc = null, visDoc = null;
    if (this_) {
      id_procedimento = this_.dataset ? this_.dataset.id_procedimento : this_.getAttribute && this_.getAttribute("data-id_procedimento");
    } else {
      treeDoc = frameDoc("ifrArvore");
      visDoc = visualizacaoDoc();
      const anchor = processAnchor2(treeDoc);
      if (!anchor || !anchor.getAttribute("href")) return false;
      id_procedimento = String(g3("getParamsUrlPro")(anchor.getAttribute("href")).id_procedimento);
    }
    checkDataMonitoradoPro(this_, mode, id_procedimento);
    if (mode === "add" && visDoc && !visDoc.getElementById("frmAtividadeListar") && treeDoc) {
      const htmlBox = typeof g3("monitoradosLabelOptions") === "function" ? g3("monitoradosLabelOptions")(id_procedimento) : "";
      openModal({
        title: "Op\xE7\xF5es: Processos Monitorados",
        width: 650,
        content: '<strong class="iframeSucessPro" style="background:#f9efad;font-size:10pt;padding:10px;border-radius:5px;margin:0 0 10px 0;display:block;color:#404040;"><i class="fas fa-check-circle azulColor" style="margin-right:5px;"></i> Processo adicionado com sucesso no painel de Processos Monitorados (p\xE1gina inicial do SEI)</strong>' + htmlBox,
        buttons: [{ text: "Ok", class: "confirm", onClick: (ref) => ref.close() }]
      });
    }
  }
  function removeMonitoradoPainelPro(this_, id_procedimento = 0) {
    const doRemove = () => {
      if (id_procedimento == 0) {
        qsa('#monitoradoTablePro input[name="monitoradoPro"]:checked').forEach((cb) => removeRow(cb, (cb.value || "").trim()));
        setTimeout(() => {
          if (this_ && this_.style) this_.style.display = "none";
        }, 500);
      } else {
        removeRow(this_, id_procedimento);
      }
    };
    if (typeof g3("confirmaBoxPro") === "function") g3("confirmaBoxPro")("Tem certeza que deseja remover esse processo dos Processos Monitorados?", doRemove);
    else if (window.confirm("Remover esse processo dos Processos Monitorados?")) doRemove();
  }
  function removeRow(el, id_procedimento) {
    persistMonitoradoStore(removeMonitoradoPro(id_procedimento));
    const tr = el && el.closest ? el.closest("tr") : null;
    if (tr) tr.style.display = "none";
  }
  function updateMonitorados(this_) {
    const i = this_ && this_.querySelector ? this_.querySelector("i") : null;
    if (i) i.classList.add("fa-spin");
    if (g3("setPanelMonitorados")) g3("setPanelMonitorados")("refresh");
  }
  function bindProcessSync() {
    if (globalRef.__seiProMonitoradoProcessSyncBound) return;
    globalRef.__seiProMonitoradoProcessSyncBound = true;
    window.addEventListener("sei-pro-process-session-updated", (event) => {
      const detail = event && event.detail || {};
      const id = detail.id_procedimento;
      if (id == null || id === "") return;
      const d = g3("pullDadosProcessoSession")(id);
      if (monitoradoProcessDataReady(id, d)) syncMonitoradoProProcessData(id, d);
    });
  }
  function installCommands() {
    bindProcessSync();
    aliasGlobal("actMonitoradoPro", actMonitoradoPro);
    aliasGlobal("storeMonitoradoPro", storeMonitoradoPro);
    aliasGlobal("addMonitoradoPro", addMonitoradoPro);
    aliasGlobal("removeMonitoradoPro", removeMonitoradoPro);
    aliasGlobal("removeMonitoradoPainelPro", removeMonitoradoPainelPro);
    aliasGlobal("updateMonitorados", updateMonitorados);
    aliasGlobal("checkDataMonitoradoPro", checkDataMonitoradoPro);
    aliasGlobal("syncMonitoradoProProcessData", syncMonitoradoProProcessData);
    aliasGlobal("getFallbackMonitoradoRowData", getFallbackMonitoradoRowData);
  }

  // src/features/monitorados/server.js
  var g4 = (n) => globalRef[n];
  var statusLoadRemoteFile = true;
  var loopServer = 0;
  function checkFileSystemInit() {
    if (globalRef.fileSystemPro) return;
    if (g4("getLocalFilePro")) g4("getLocalFilePro")();
    setTimeout(() => {
      if (globalRef.fileSystemPro) return;
      const actions = qs("#monitoradosProActions");
      if (!actions) return;
      const old = qs("#htmlFileSystemStatus");
      if (old) old.remove();
      actions.insertAdjacentHTML(
        "beforeend",
        '<span id="htmlFileSystemStatus" style="display:block;float:left;font-size:9pt;color:#888;clear:both;top:0;left:60px;position:absolute;width:calc(100% - 400px);"><i class="fas fa-exclamation-triangle vermelhoColor"></i> Seu navegador n\xE3o possui suporte ao sistema de arquivos local (FileSystem API) ou o usu\xE1rio n\xE3o autorizou o seu uso.<br> A n\xE3o utiliza\xE7\xE3o dessa tecnologia poder\xE1 ocasionar a perda de dados dos Processos Monitorados, caso o cache do navegador seja apagado.<br><a class="seipro-reauth-fs" style="font-size:9pt;color:blue;text-decoration:underline;cursor:pointer;">Re-autorize</a> a aplica\xE7\xE3o ou utilize outro navegador compat\xEDvel.</span>'
      );
      const link = qs("#htmlFileSystemStatus .seipro-reauth-fs");
      if (link) link.addEventListener("click", () => {
        if (g4("initFileSystem")) g4("initFileSystem")();
        if (g4("setPanelMonitorados")) g4("setPanelMonitorados")("refresh");
      });
    }, 1e3);
  }
  function getRemoteFileMonitorado() {
    if (loopServer < 5 && g4("getServerAtividades")) {
      g4("getServerAtividades")({ action: "get_monitorados" }, "get_monitorados");
      loopServer++;
    }
  }
  function checkFileRemoteMonitorado(mode, data = false) {
    if (mode === "get" && g4("getServerAtividades") && !globalRef.checkLoadMonitoradosProcPro) {
      g4("getServerAtividades")({ action: "check_monitorados" }, "check_monitorados");
    } else if (mode === "set" && data) {
      const store = getStoreMonitoradoPro();
      const moment2 = globalRef.moment;
      const dtServer = moment2(data.datetime, "YYYY-MM-DD HH:mm:ss");
      const dtLocal = moment2(store.datetime, "YYYY-MM-DD HH:mm:ss");
      if (statusLoadRemoteFile && dtServer.isValid() && dtLocal.isValid() && dtServer > dtLocal.add(1, "minutes")) {
        getConfigDatetimeMonitorado();
        setTimeout(() => {
          getRemoteFileMonitorado();
          statusLoadRemoteFile = false;
          setTimeout(() => {
            statusLoadRemoteFile = true;
          }, 5e3);
        }, 3e3);
      }
    }
  }
  function checkFileLocalMonitorado() {
    if (g4("getLocalFilePro")) g4("getLocalFilePro")();
    setTimeout(() => {
      const content = globalRef.fileSystemContentPro;
      const moment2 = globalRef.moment;
      if (globalRef.fileSystemPro && content && typeof content === "object" && typeof moment2().isoWeekdayCalc === "function" && Array.isArray(content.monitorados) && content.monitorados.length > 0) {
        persistMonitoradoStore(content);
        if (g4("initPanelMonitorados")) g4("initPanelMonitorados")();
      } else if (globalRef.perfilLoginAtiv != null) {
        getRemoteFileMonitorado();
        if (typeof moment2().isoWeekdayCalc !== "function" && globalRef.jQuery) globalRef.jQuery.getScript(globalRef.URL_SPRO + "js/lib/moment-weekday-calc.js");
      }
    }, 500);
  }
  function restoreMonitoradoServer(data) {
    const store = getStoreMonitoradoPro();
    if (store && store.monitorados && data && data.monitorados && data.config && data.config.colortags !== void 0) {
      store.monitorados = data.monitorados;
      store.config.colortags = data.config.colortags;
      persistMonitoradoStore(store, { remote: false });
      if (g4("setLocalFilePro")) g4("setLocalFilePro")(store);
      if (g4("initPanelMonitorados")) g4("initPanelMonitorados")();
    }
  }
  function installServer() {
    aliasGlobal("checkFileSystemInit", checkFileSystemInit);
    aliasGlobal("checkFileRemoteMonitorado", checkFileRemoteMonitorado);
    aliasGlobal("checkFileLocalMonitorado", checkFileLocalMonitorado);
    aliasGlobal("getRemoteFileMonitorado", getRemoteFileMonitorado);
    aliasGlobal("restoreMonitoradoServer", restoreMonitoradoServer);
  }

  // src/features/monitorados/prazo-row.js
  var g5 = (n) => globalRef[n];
  function updateDatesMonitorado(el) {
    const tr = el.closest("tr");
    if (!tr) return;
    const store = getStoreMonitoradoPro();
    const id = parseInt(tr.getAttribute("data-id_procedimento"));
    const idx = findMonitoradoIndex(store, id);
    if (idx < 0) return;
    const config = getOptionsConfigDate(idx);
    const v = (el.value || "").trim();
    if (v === "") return;
    if (v !== config.date && config.date !== "") {
      config.selectdoc = false;
      config.setdate = true;
    }
    config.date = v;
    config.dateTo = globalRef.moment().format("YYYY-MM-DD");
    const td = el.closest("td");
    const info = td && qs(".info_dates_monitorado", td);
    const followLink = td && qs(".followLink", td);
    if (info && followLink) info.innerHTML = g5("getDatesPreview")(config) + followLink.outerHTML;
    store.monitorados[idx].configdate = config;
    persistMonitoradoStore(store);
  }
  function showDatesMonitorado(el, mode) {
    if (el.closest("#frmAtividadeListar")) {
      updateDatesMonitorado(el);
      return;
    }
    const tr = el.closest("tr");
    const table = el.closest("table");
    const configBtn = tr && qs(".monitoradoConfigDates", tr);
    if (!(configBtn && configBtn.matches(":hover"))) {
      if (table) {
        qsa(".info_dates_monitorado", table).forEach((n) => {
          n.style.display = "";
        });
        qsa(".info_dates_monitorado_txt", table).forEach((n) => {
          n.style.display = "none";
        });
        qsa(".followLinkDates", table).forEach((n) => {
          n.style.display = "";
        });
      }
      if (typeof globalRef.infraTooltipOcultar === "function") globalRef.infraTooltipOcultar();
      updateDatesMonitorado(el);
    }
    if (mode === "show" && tr) {
      const td = el.closest("td");
      if (td) qsa(".followLinkDates", td).forEach((n) => {
        n.style.display = "none";
      });
      qsa(".info_dates_monitorado", tr).forEach((n) => {
        n.style.display = "none";
      });
      const txt = qs(".info_dates_monitorado_txt", tr);
      if (txt) {
        txt.style.display = "inline-flex";
        const inp = qs("input.monitoradoDatesPro", txt);
        if (inp) {
          inp.focus();
          inp.click();
        }
      }
    }
    if (tr) {
      const td = el.closest("td");
      const info = qs(".info_dates_monitorado", tr);
      if (td) td.classList.toggle("info_dates_follow_empty", !(info && info.textContent.trim() !== ""));
    }
  }
  function keyDatesMonitorado(e) {
    if (e.which === 13 || e.key === "Enter") {
      const target = e.target || e.currentTarget;
      if (target) showDatesMonitorado(target, "hide");
    }
  }
  function installPrazoRow() {
    aliasGlobal("updateDatesMonitorado", updateDatesMonitorado);
    aliasGlobal("showDatesMonitorado", showDatesMonitorado);
    aliasGlobal("keyDatesMonitorado", keyDatesMonitorado);
  }

  // src/features/monitorados/extras.js
  var g6 = (n) => globalRef[n];
  function appendStarOnProcess() {
    qsa(".tabelaControle tbody tr").forEach((tr) => {
      let id = tr.getAttribute("id");
      id = id != null && id !== "" ? id.replace("P", "") : false;
      if (!id) {
        const a = tr.querySelector('a[href*="id_procedimento="]');
        id = a ? g6("getParamsUrlPro")(a.getAttribute("href")).id_procedimento : false;
      }
      if (!id) {
        const a = tr.querySelector('a[href*="acao=procedimento_trabalhar"]');
        id = a ? g6("getParamsUrlPro")(a.getAttribute("href")).id_procedimento : false;
      }
      const td = tr.querySelectorAll("td")[1];
      if (!td) return;
      qsa(".iconMonitoradoPro", td).forEach((n) => n.remove());
      td.style.verticalAlign = "middle";
      if (id) td.insertAdjacentElement("afterbegin", elFromHtml(iconHtml(id)));
    });
  }
  function openConfigMonitorados() {
    openModal({
      title: "Configura\xE7\xF5es: Processos Monitorados",
      width: 450,
      content: '<table style="font-size:9pt;width:100%;" class="seiProForm"><tr style="height:40px;"><td style="vertical-align:bottom;text-align:left;" class="label"><a class="newLink seipro-backup-dl" style="cursor:pointer"><i class="fas fa-download azulColor"></i>Baixar Processos Monitorados</a></td><td style="vertical-align:bottom;text-align:left;" class="label"><input type="file" id="selectLocalFilesPro" class="seipro-backup-file" style="display:none" /><a class="newLink seipro-backup-up" style="cursor:pointer;float:right;"><i class="fas fa-upload azulColor"></i>Carregar Processos Monitorados</a></td><td></td></tr></table>',
      onOpen: (ref) => {
        if (g6("getLocalFilePro")) g6("getLocalFilePro")();
        const dl = qs(".seipro-backup-dl", ref.body);
        const up = qs(".seipro-backup-up", ref.body);
        const file = qs(".seipro-backup-file", ref.body);
        if (dl) dl.addEventListener("click", () => {
          if (g6("initDownloadLocalFilePro")) g6("initDownloadLocalFilePro")(dl);
        });
        if (up) up.addEventListener("click", () => {
          if (g6("initLoadLocalFilePro")) g6("initLoadLocalFilePro")();
        });
        if (file) file.addEventListener("change", () => {
          if (g6("loadLocalFilePro")) g6("loadLocalFilePro")();
        });
      }
    });
  }
  function updateIndexTableMonitorado() {
    qsa(".tableFollow tbody tr").forEach((tr, index) => {
      tr.dataset.index = index;
    });
  }
  function removeMonitorado(el) {
    const tr = el.closest("tr");
    if (!tr) return;
    const store = getStoreMonitoradoPro();
    const index = parseInt(tr.getAttribute("data-index"));
    if (!(index >= 0)) return;
    store.monitorados.splice(index, 1);
    tr.style.transition = "opacity .4s";
    tr.style.opacity = "0";
    setTimeout(() => {
      tr.remove();
      updateIndexTableMonitorado();
      if (g6("updateCountTableMonitorado")) g6("updateCountTableMonitorado")();
      persistMonitoradoStore(store);
    }, 400);
  }
  function actionToolbarMonitoradoPro(this_, triggerButton) {
    const action = triggerButton && triggerButton.dataset ? triggerButton.dataset.action : "";
    if (action === "etiqueta" && g6("showFollowEtiqueta")) g6("showFollowEtiqueta")(this_, "show");
    else if (action === "remove") removeMonitorado(this_);
    else if (action === "dates" && g6("showDatesMonitorado")) g6("showDatesMonitorado")(this_, "show");
    else if (action === "descricao" && g6("editMonitoradoDesc")) g6("editMonitoradoDesc")(this_);
  }
  function installExtras() {
    aliasGlobal("appendStarOnProcess", appendStarOnProcess);
    aliasGlobal("openConfigMonitorados", openConfigMonitorados);
    aliasGlobal("removeMonitorado", removeMonitorado);
    aliasGlobal("updateIndexTableMonitorado", updateIndexTableMonitorado);
    aliasGlobal("actionToolbarMonitoradoPro", actionToolbarMonitoradoPro);
  }

  // src/shared/ui/tags-input.js
  function createTagsInput(input, opts = {}) {
    const o = Object.assign({
      delimiter: ";",
      placeholder: "Adicionar",
      minChars: 1,
      maxChars: 100,
      limit: 0,
      unique: true,
      removeWithBackspace: true,
      source: [],
      // array de sugestões ou função () => array
      renderLabel: null,
      // (tag) => HTML do conteúdo da pill (sem o x)
      onAdd: null,
      onRemove: null,
      onChange: null
    }, opts);
    let tags = String(input.value || "").split(o.delimiter).map((t) => t.trim()).filter(Boolean);
    const wrap = document.createElement("div");
    wrap.className = "seipro-tagsinput";
    wrap.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;align-items:center;border:1px solid #ccc;border-radius:4px;padding:3px;min-height:28px;";
    const inner = document.createElement("input");
    inner.type = "text";
    inner.placeholder = o.placeholder;
    inner.className = "seipro-tagsinput-entry";
    inner.style.cssText = "border:0;outline:0;flex:1;min-width:80px;font-size:inherit;background:transparent;";
    input.style.display = "none";
    input.insertAdjacentElement("afterend", wrap);
    const dropdown = document.createElement("div");
    dropdown.className = "seipro-tagsinput-suggest";
    dropdown.style.cssText = "position:absolute;z-index:100001;background:#fff;border:1px solid #ccc;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,.15);max-height:160px;overflow:auto;display:none;font-size:11px;";
    document.body.appendChild(dropdown);
    function sync() {
      input.value = tags.join(o.delimiter);
      if (typeof o.onChange === "function") o.onChange(tags.slice(), input);
    }
    function pill(tag) {
      const el = document.createElement("span");
      el.className = "tag seipro-tag";
      el.style.cssText = "display:inline-flex;align-items:center;gap:3px;background:#eef;border-radius:3px;padding:1px 6px;";
      el.innerHTML = typeof o.renderLabel === "function" ? o.renderLabel(tag) : escapeText(tag);
      const x = document.createElement("i");
      x.className = "fas fa-times seipro-tag-remove";
      x.style.cssText = "cursor:pointer;font-size:.8em;opacity:.7;";
      x.addEventListener("click", () => remove(tag));
      el.appendChild(x);
      el.dataset.tag = tag;
      return el;
    }
    function render() {
      wrap.querySelectorAll(".seipro-tag").forEach((n) => n.remove());
      tags.forEach((t) => wrap.insertBefore(pill(t), inner));
    }
    function add(raw) {
      const tag = String(raw || "").trim();
      if (tag.length < o.minChars || tag.length > o.maxChars) return false;
      if (o.unique && tags.indexOf(tag) !== -1) return false;
      if (o.limit > 0 && tags.length >= o.limit) return false;
      tags.push(tag);
      render();
      sync();
      if (typeof o.onAdd === "function") o.onAdd(tag, tags.slice());
      return true;
    }
    function remove(tag) {
      const i = tags.indexOf(tag);
      if (i === -1) return;
      tags.splice(i, 1);
      render();
      sync();
      if (typeof o.onRemove === "function") o.onRemove(tag, tags.slice());
    }
    function sources() {
      return (typeof o.source === "function" ? o.source() : o.source) || [];
    }
    function hideSuggest() {
      dropdown.style.display = "none";
      dropdown.innerHTML = "";
    }
    function showSuggest() {
      const q = inner.value.trim().toLowerCase();
      if (!q) return hideSuggest();
      const matches = sources().filter((s) => String(s).toLowerCase().indexOf(q) !== -1 && tags.indexOf(String(s)) === -1).slice(0, 8);
      if (!matches.length) return hideSuggest();
      dropdown.innerHTML = "";
      matches.forEach((m) => {
        const item = document.createElement("div");
        item.textContent = m;
        item.style.cssText = "padding:4px 8px;cursor:pointer;";
        item.addEventListener("mousedown", (e) => {
          e.preventDefault();
          add(m);
          inner.value = "";
          hideSuggest();
        });
        dropdown.appendChild(item);
      });
      const r = inner.getBoundingClientRect();
      dropdown.style.left = r.left + window.scrollX + "px";
      dropdown.style.top = r.bottom + window.scrollY + "px";
      dropdown.style.minWidth = r.width + "px";
      dropdown.style.display = "block";
    }
    inner.addEventListener("input", showSuggest);
    inner.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === o.delimiter) {
        e.preventDefault();
        if (inner.value.trim()) {
          add(inner.value);
          inner.value = "";
          hideSuggest();
        }
      } else if (e.key === "Backspace" && inner.value === "" && o.removeWithBackspace && tags.length) {
        remove(tags[tags.length - 1]);
      }
    });
    inner.addEventListener("blur", () => {
      setTimeout(hideSuggest, 150);
      if (inner.value.trim()) {
        add(inner.value);
        inner.value = "";
      }
    });
    wrap.addEventListener("click", () => inner.focus());
    wrap.appendChild(inner);
    render();
    return {
      getTags: () => tags.slice(),
      add,
      remove,
      destroy() {
        hideSuggest();
        dropdown.remove();
        wrap.remove();
        input.style.display = "";
      }
    };
  }
  function escapeText(s) {
    return String(s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]);
  }

  // src/shared/ui/sortable.js
  function insertionTarget(y, rows) {
    for (const row of rows) {
      const r = row.getBoundingClientRect();
      if (y < r.top + r.height / 2) return row;
    }
    return null;
  }
  function createSortable(container, opts = {}) {
    const itemsSel = opts.items || "tr";
    const handleSel = opts.handle || null;
    let dragged = null;
    function rows() {
      return Array.prototype.slice.call(container.querySelectorAll(itemsSel));
    }
    function onDown(e) {
      const handle = handleSel ? e.target.closest(handleSel) : e.target.closest(itemsSel);
      if (!handle) return;
      const row = handle.closest(itemsSel);
      if (!row || !container.contains(row)) return;
      dragged = row;
      row.classList.add("seipro-sorting");
      row.style.opacity = "0.5";
      try {
        handle.setPointerCapture(e.pointerId);
      } catch (_) {
      }
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp, { once: true });
      e.preventDefault();
    }
    function onMove(e) {
      if (!dragged) return;
      const others = rows().filter((r) => r !== dragged);
      const before = insertionTarget(e.clientY, others);
      if (before) dragged.parentNode.insertBefore(dragged, before);
      else dragged.parentNode.appendChild(dragged);
    }
    function onUp(e) {
      if (!dragged) return;
      dragged.classList.remove("seipro-sorting");
      dragged.style.opacity = "";
      const handle = handleSel ? e.target.closest(handleSel) : dragged;
      if (handle) handle.removeEventListener("pointermove", onMove);
      dragged = null;
      if (typeof opts.onUpdate === "function") opts.onUpdate(rows());
    }
    container.addEventListener("pointerdown", onDown);
    return { destroy() {
      container.removeEventListener("pointerdown", onDown);
    } };
  }

  // src/shared/ui/sortable-table.js
  function compareValues(a, b) {
    const na = parseFloat(a), nb = parseFloat(b);
    const bothNum = !isNaN(na) && !isNaN(nb) && String(a).trim() !== "" && String(b).trim() !== "";
    if (bothNum) return na - nb;
    return String(a).localeCompare(String(b), void 0, { numeric: true, sensitivity: "base" });
  }
  function createSortableTable(table, opts = {}) {
    const headers = opts.headers || {};
    const extraction = opts.textExtraction || {};
    const tbody = table.tBodies[0];
    const headRow = table.tHead ? table.tHead.rows[table.tHead.rows.length - 1] : null;
    if (!tbody || !headRow) return { destroy() {
    } };
    let sortState = { col: -1, dir: 0 };
    const filters = {};
    function cfg(col) {
      return headers[col] || {};
    }
    function sortable(col) {
      return cfg(col).sorter !== false;
    }
    function filterable(col) {
      return cfg(col).filter === true;
    }
    function cellText(row, col) {
      const cell = row.cells[col];
      if (!cell) return "";
      const fn = extraction[col];
      return fn ? fn(cell, table, col) : cell.textContent.trim();
    }
    function save() {
      if (!opts.saveKey) return;
      try {
        localStorage.setItem("seipro-table-" + opts.saveKey, JSON.stringify({ sortState, filters }));
      } catch (_) {
      }
    }
    function load() {
      if (!opts.saveKey) return;
      try {
        const raw = localStorage.getItem("seipro-table-" + opts.saveKey);
        if (!raw) return;
        const s = JSON.parse(raw);
        if (s.sortState) sortState = s.sortState;
        Object.assign(filters, s.filters || {});
      } catch (_) {
      }
    }
    function applySort() {
      if (sortState.dir === 0 || sortState.col < 0) return;
      const rows = Array.prototype.slice.call(tbody.rows);
      const col = sortState.col, dir = sortState.dir;
      rows.sort((ra, rb) => dir * compareValues(cellText(ra, col), cellText(rb, col)));
      rows.forEach((r) => tbody.appendChild(r));
    }
    function onHeaderClick(ev) {
      const th = ev.target.closest("th");
      if (!th) return;
      const col = Array.prototype.indexOf.call(headRow.cells, th);
      if (col < 0 || !sortable(col)) return;
      if (sortState.col !== col) sortState = { col, dir: 1 };
      else sortState.dir = sortState.dir === 1 ? -1 : sortState.dir === -1 ? 0 : 1;
      updateHeaderIndicators();
      applySort();
      applyFilter();
      save();
      if (typeof opts.onSortEnd === "function") opts.onSortEnd(api);
    }
    function updateHeaderIndicators() {
      Array.prototype.forEach.call(headRow.cells, (th, i) => {
        th.classList.remove("seipro-sort-asc", "seipro-sort-desc");
        if (i === sortState.col && sortState.dir === 1) th.classList.add("seipro-sort-asc");
        if (i === sortState.col && sortState.dir === -1) th.classList.add("seipro-sort-desc");
        if (sortable(i)) th.style.cursor = "pointer";
      });
    }
    let filterRow = null;
    function buildFilterRow() {
      if (!Object.keys(headers).some((k) => filterable(Number(k)))) return;
      filterRow = document.createElement("tr");
      filterRow.className = "seipro-filter-row";
      Array.prototype.forEach.call(headRow.cells, (th, i) => {
        const td = document.createElement("td");
        if (filterable(i)) {
          const inp = document.createElement("input");
          inp.type = "search";
          inp.className = "seipro-filter";
          inp.value = filters[i] || "";
          inp.style.cssText = "width:100%;box-sizing:border-box;font-size:11px;";
          inp.addEventListener("input", () => {
            filters[i] = inp.value;
            applyFilter();
            save();
          });
          td.appendChild(inp);
        }
        filterRow.appendChild(td);
      });
      table.tHead.appendChild(filterRow);
    }
    function rowMatches(row) {
      return Object.keys(filters).every((col) => {
        const q = (filters[col] || "").trim().toLowerCase();
        if (!q) return true;
        return cellText(row, Number(col)).toLowerCase().indexOf(q) !== -1;
      });
    }
    function applyFilter() {
      let count = 0;
      Array.prototype.forEach.call(tbody.rows, (row) => {
        const ok = rowMatches(row);
        row.style.display = ok ? "" : "none";
        if (ok) count++;
      });
      if (typeof opts.onFilterEnd === "function") opts.onFilterEnd(count, api);
      return count;
    }
    const api = {
      sort(col, dir) {
        sortState = { col, dir };
        updateHeaderIndicators();
        applySort();
        applyFilter();
        save();
      },
      filter(col, value) {
        filters[col] = value;
        if (filterRow) {
          const inp = filterRow.cells[col] && filterRow.cells[col].querySelector("input");
          if (inp) inp.value = value;
        }
        applyFilter();
        save();
      },
      refresh() {
        applySort();
        applyFilter();
      },
      visibleCount() {
        return Array.prototype.filter.call(tbody.rows, (r) => r.style.display !== "none").length;
      },
      destroy() {
        headRow.removeEventListener("click", onHeaderClick);
        if (filterRow) filterRow.remove();
      }
    };
    load();
    headRow.addEventListener("click", onHeaderClick);
    buildFilterRow();
    updateHeaderIndicators();
    applySort();
    applyFilter();
    return api;
  }

  // src/features/monitorados/panel-lifecycle.js
  var g7 = (n) => globalRef[n];
  function initTags(table) {
    qsa(".monitoradoTagsPro", table).forEach((input) => {
      if (input.dataset.seiproTagsInit === "1") return;
      input.dataset.seiproTagsInit = "1";
      const persist = () => {
        if (typeof g7("saveFollowEtiqueta") === "function") g7("saveFollowEtiqueta")(input);
      };
      createTagsInput(input, {
        delimiter: ";",
        placeholder: "Adicionar etiqueta",
        limit: 8,
        minChars: 2,
        maxChars: 100,
        source: () => typeof g7("sugestEtiquetaPro") === "function" ? g7("sugestEtiquetaPro")("monitorado") : [],
        onAdd: persist,
        onRemove: persist
      });
    });
  }
  function initTable(table) {
    const dateExtract = (cell) => {
      const d = cell.querySelector(".dateboxDisplay");
      return d ? d.getAttribute("data-time-sorter") : cell.textContent.trim();
    };
    const orderExtract = (cell) => parseInt(cell.getAttribute("data-order")) || 0;
    return createSortableTable(table, {
      headers: { 0: { sorter: false }, 1: { filter: true }, 2: { filter: true }, 3: { filter: true }, 4: { filter: true } },
      textExtraction: { 2: dateExtract, 8: orderExtract },
      saveKey: "monitorados",
      onSortEnd: () => {
        if (g7("checkboxRangerSelectShift")) g7("checkboxRangerSelectShift")("#monitoradoTablePro");
      },
      onFilterEnd: (count) => {
        const cap = qs("caption", table);
        if (cap) cap.textContent = cap.textContent.replace(/\d+/g, count);
        qsa("tbody tr", table).forEach((tr) => {
          const inp = tr.querySelector("td input");
          if (inp) inp.disabled = tr.style.display === "none";
        });
        if (g7("checkboxRangerSelectShift")) g7("checkboxRangerSelectShift")("#monitoradoTablePro");
      }
    });
  }
  function initRowSortable(table) {
    const tbody = table.tBodies[0];
    if (!tbody) return;
    createSortable(tbody, {
      items: "tr",
      handle: ".sorterTrMonitorado",
      onUpdate: (rows) => {
        const store = getStoreMonitoradoPro();
        rows.forEach((tr, index) => {
          const id = tr.getAttribute("data-id_procedimento");
          const idx = findMonitoradoIndex(store, id);
          if (idx >= 0) store.monitorados[idx].order = index + 1;
        });
        persistMonitoradoStore(store);
        rows.forEach((tr, index) => {
          tr.setAttribute("data-index", index);
          const last = tr.cells[tr.cells.length - 1];
          if (last) last.setAttribute("data-order", index + 1);
        });
      }
    });
  }
  function initSelectionObserver(table) {
    const tbody = table.tBodies[0];
    if (!tbody) return;
    const update = () => {
      const count = qsa("tr.infraTrMarcada", table).length;
      const actions = qs("#monitoradosProActions");
      const icon = actions && actions.querySelector(".iconMonitorados_remove");
      if (!icon) return;
      icon.style.display = count > 0 ? "" : "none";
      const counter = icon.querySelector(".fa-layers-counter");
      if (counter && count > 0) counter.textContent = count;
    };
    new MutationObserver(update).observe(tbody, { attributes: true, attributeFilter: ["class"], subtree: true });
    update();
  }
  function initFunctionsPanelMonitorado() {
    const table = qs("#monitoradoTablePro");
    if (!table || table.dataset.seiproInit === "1") return;
    table.dataset.seiproInit = "1";
    initTags(table);
    initTable(table);
    initRowSortable(table);
    initSelectionObserver(table);
    if (g7("checkboxRangerSelectShift")) g7("checkboxRangerSelectShift")("#monitoradoTablePro");
    if (typeof g7("checkFileRemoteMonitorado") === "function") g7("checkFileRemoteMonitorado")("get");
  }
  function installPanelLifecycle() {
    aliasGlobal("initFunctionsPanelMonitorado", initFunctionsPanelMonitorado);
  }

  // src/features/monitorados/index.js
  var monitorados = getSeiPro().features.monitorados || (getSeiPro().features.monitorados = {});
  monitorados.view = { initIcon, mountIcon, iconHtml };
  monitorados.maps = { openSingle: openBoxSingleMap, openMultiple: openBoxMultipleMap, save: saveConfigMapsMonitorado };
  monitorados.panel = { render: setPanelMonitorados };
  monitorados.datas = { openBox: openBoxConfigDates };
  installDatas();
  installCategorias();
  installCommands();
  installServer();
  installPrazoRow();
  installExtras();
  installPanelLifecycle();
  aliasGlobal("insertIconMonitorados", initIcon);
  aliasGlobal("appendIconMonitorados", mountIcon);
  aliasGlobal("htmlIconMonitorados", iconHtml);
  aliasGlobal("openBoxSingleMap", openBoxSingleMap);
  aliasGlobal("openBoxMultipleMap", openBoxMultipleMap);
  aliasGlobal("saveConfigMapsMonitorado", saveConfigMapsMonitorado);
  aliasGlobal("setPanelMonitorados", setPanelMonitorados);
  bindPanelDispatcher(document);
})();
