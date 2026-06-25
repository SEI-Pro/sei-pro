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

  // src/features/monitorados/index.js
  var monitorados = getSeiPro().features.monitorados || (getSeiPro().features.monitorados = {});
  monitorados.view = { initIcon, mountIcon, iconHtml };
  monitorados.maps = { openSingle: openBoxSingleMap, openMultiple: openBoxMultipleMap, save: saveConfigMapsMonitorado };
  monitorados.panel = { render: setPanelMonitorados };
  aliasGlobal("insertIconMonitorados", initIcon);
  aliasGlobal("appendIconMonitorados", mountIcon);
  aliasGlobal("htmlIconMonitorados", iconHtml);
  aliasGlobal("openBoxSingleMap", openBoxSingleMap);
  aliasGlobal("openBoxMultipleMap", openBoxMultipleMap);
  aliasGlobal("saveConfigMapsMonitorado", saveConfigMapsMonitorado);
  aliasGlobal("setPanelMonitorados", setPanelMonitorados);
  bindPanelDispatcher(document);
})();
