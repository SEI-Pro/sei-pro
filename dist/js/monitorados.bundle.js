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
  function defaultMonitoradoStore() {
    return { monitorados: [], config: { colortags: [] } };
  }
  function findMonitoradoIndex(store, id_procedimento) {
    if (!store || !store.monitorados) return -1;
    return store.monitorados.findIndex(function(obj) {
      return String(obj.id_procedimento) === String(id_procedimento);
    });
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
  function persistMonitoradoStore(store, options) {
    const moment = globalRef.moment;
    options = options || {};
    storeState = store || getStoreMonitoradoPro();
    if (!storeState.config) storeState.config = { colortags: [] };
    storeState.config.datetime = moment().format("YYYY-MM-DD HH:mm:ss");
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
      const html = '<div class="loadingLocation" style="color:#888;position:absolute;z-index:9999;right:0;padding:5px 15px 5px 10px;background:#fff;border-bottom-left-radius:5px;font-size:10pt;"><i class="fas fa-spinner fa-spin"></i> Carregando sua localiza\xE7\xE3o <i class="fas fa-times-circle" data-act="map-clear-location" style="cursor:pointer"></i></div>';
      const mapid = qs("#mapid");
      if (mapid) mapid.insertAdjacentElement("beforebegin", elFromHtml(html));
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
  function openModal({ title, contentHtml, width, buttons, onOpen, onClose }) {
    const existing = qs(".seipro-monitorado-modal");
    if (existing) existing.remove();
    const overlay = elFromHtml(
      '<div class="seipro-monitorado-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:100000;display:flex;align-items:center;justify-content:center;"><div class="dialogBoxDiv" style="background:#fff;border-radius:6px;box-shadow:0 8px 30px rgba(0,0,0,.3);max-width:95vw;max-height:95vh;overflow:auto;width:' + (width || 620) + 'px;"><div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #eee;font-weight:bold;"><span>' + title + '</span><i class="fas fa-times" data-act="map-close" style="cursor:pointer;color:#888;"></i></div><div class="seipro-modal-body" style="padding:14px;">' + contentHtml + '</div><div class="seipro-modal-buttons" style="display:flex;gap:8px;justify-content:flex-end;padding:10px 14px;border-top:1px solid #eee;"></div></div></div>'
    );
    const close = () => {
      if (typeof onClose === "function") onClose();
      overlay.remove();
    };
    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay) {
        close();
        return;
      }
      if (ev.target.closest('[data-act="map-close"]')) close();
      if (ev.target.closest('[data-act="map-clear-location"]')) clearLocationUser();
    });
    const btnRow = overlay.querySelector(".seipro-modal-buttons");
    (buttons || [{ text: "Fechar", onClick: close }]).forEach((b) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "newLink " + (b.class || "");
      btn.textContent = b.text;
      btn.style.cssText = "cursor:pointer;padding:4px 12px;";
      btn.addEventListener("click", () => b.onClick(close));
      btnRow.appendChild(btn);
    });
    document.body.appendChild(overlay);
    if (typeof onOpen === "function") onOpen();
    return overlay;
  }
  function openBoxSingleMap(triggerEl, readonly = false) {
    locationDenied = false;
    const row = triggerEl && triggerEl.closest ? triggerEl.closest("tr") : null;
    const id = row ? row.getAttribute("data-id_procedimento") : triggerEl && triggerEl.dataset ? triggerEl.dataset.id_procedimento : "";
    const buttons = readonly ? [{ text: "Fechar", onClick: (close) => close() }] : [
      { text: "Remover", onClick: (close) => {
        saveConfigMapsMonitorado(id, "remove");
        close();
      } },
      { text: "Salvar", class: "confirm", onClick: (close) => {
        saveConfigMapsMonitorado(id);
        close();
      } }
    ];
    openModal({
      title: "Processos Monitorados: Mapa",
      contentHtml: '<div id="mapid" style="width:600px;height:400px;max-width:100%;"></div>',
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
      contentHtml: '<div id="mapid" style="width:900px;height:600px;max-width:100%;"></div>',
      width: 920,
      onOpen: renderMultipleMap
    });
  }

  // src/features/monitorados/index.js
  var monitorados = getSeiPro().features.monitorados || (getSeiPro().features.monitorados = {});
  monitorados.view = { initIcon, mountIcon, iconHtml };
  monitorados.maps = { openSingle: openBoxSingleMap, openMultiple: openBoxMultipleMap, save: saveConfigMapsMonitorado };
  aliasGlobal("insertIconMonitorados", initIcon);
  aliasGlobal("appendIconMonitorados", mountIcon);
  aliasGlobal("htmlIconMonitorados", iconHtml);
  aliasGlobal("openBoxSingleMap", openBoxSingleMap);
  aliasGlobal("openBoxMultipleMap", openBoxMultipleMap);
  aliasGlobal("saveConfigMapsMonitorado", saveConfigMapsMonitorado);
})();
