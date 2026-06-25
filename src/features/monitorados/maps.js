import { globalRef } from '../../core/global.js';
import { qs, elFromHtml } from './dom.js';
import { openModal } from '../../shared/ui/modal.js';
import { getStoreMonitoradoPro, persistMonitoradoStore } from './store.js';
import { findMonitoradoIndex } from './domain.js';

/**
 * Monitorados — Mapas (Leaflet), reescrita vanilla ESM.
 *
 * Leaflet (L.*) e jmespath seguem como libs globais (lidas lazy). jQuery e o
 * jQuery UI dialog foram substituídos: estado encapsulado no módulo e um modal
 * vanilla próprio (openModal). Entry points expostos por aliasGlobal no index.js.
 *
 * Reachability: o painel (ainda legado) é quem abre os mapas; quando o painel
 * for portado para delegação, os botões usarão data-act -> estas funções.
 */

const DEFAULT_LATLNG = [-15.800909532800379, -47.861289633438];

// Estado do mapa (antes eram 6 globais soltos no script legado).
let map = null;
let markers = [];
let markersLayer = false;
let locationUser = false;
let currentPosition = false;
let locationDenied = false;

function L() { return globalRef.L; }
function jp() { return globalRef.jmespath; }
function escHtml(s) {
    return (typeof globalRef.escapeHtml === 'function') ? globalRef.escapeHtml(s) : String(s == null ? '' : s);
}

function configureLeafletAssets() {
    const Lf = L();
    if (!Lf || !Lf.Icon || !Lf.Icon.Default) return;
    if (Lf.Icon.Default.prototype._seiProAssetsConfigured) return;
    Lf.Icon.Default.mergeOptions({
        iconRetinaUrl: globalRef.URL_SPRO + 'css/images/marker-icon-2x.png',
        iconUrl: globalRef.URL_SPRO + 'css/images/marker-icon.png',
        shadowUrl: globalRef.URL_SPRO + 'css/images/marker-shadow.png'
    });
    Lf.Icon.Default.prototype._seiProAssetsConfigured = true;
}

function resolveGeocoder(Lf) {
    let geocoder = Lf.Control.Geocoder.nominatim();
    if (typeof URLSearchParams !== 'undefined' && location.search) {
        const name = new URLSearchParams(location.search).get('geocoder');
        if (name && Lf.Control.Geocoder[name]) geocoder = Lf.Control.Geocoder[name]();
    }
    return geocoder;
}

function tileLayer(Lf) {
    return Lf.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '<a href="https://seipro.app" target="_blank">' + (globalRef.NAMESPACE_SPRO || 'SEI Pro') + '</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1
    });
}

function followLinkHtml(id_procedimento) {
    const link = qs('#monitoradoTablePro tbody tr[data-id_procedimento="' + id_procedimento + '"] .followLinkProcesso');
    return link ? link.outerHTML : '';
}

function clearLocationUser() {
    const loading = qs('.loadingLocation');
    if (loading) loading.remove();
    if (locationUser) clearInterval(locationUser);
    locationUser = false;
}

function renderSingleMap(id_procedimento, readonly) {
    const Lf = L();
    const store = getStoreMonitoradoPro();
    const value = jp().search(store.monitorados, "[?id_procedimento=='" + id_procedimento + "'] | [0]") || false;
    const latlng = (value && Array.isArray(value.latlng) && value.latlng[0] != null && value.latlng[1] != null) ? value.latlng : false;
    const center = latlng || DEFAULT_LATLNG;

    function onLocationFound(e) {
        map.eachLayer((layer) => { if (layer._latlng !== undefined) layer.remove(); });
        if (currentPosition) map.removeLayer(currentPosition);
        const radius = e.accuracy / 2;
        currentPosition = Lf.marker(e.latlng).addTo(map).bindPopup('Sua localização em um raio de ' + radius + ' metros deste ponto').openPopup();
        clearLocationUser();
        markers = e.latlng;
    }
    function onLocationError() { locationDenied = true; clearLocationUser(); }
    function locate() {
        const old = qs('.loadingLocation'); if (old) old.remove();
        const html = '<div class="loadingLocation" style="color:#888;position:absolute;z-index:9999;right:0;padding:5px 15px 5px 10px;background:#fff;border-bottom-left-radius:5px;font-size:10pt;">'
            + '<i class="fas fa-spinner fa-spin"></i> Carregando sua localização '
            + '<i class="fas fa-times-circle seipro-clear-location" style="cursor:pointer"></i></div>';
        const mapid = qs('#mapid');
        if (mapid) {
            const node = elFromHtml(html);
            node.querySelector('.seipro-clear-location').addEventListener('click', clearLocationUser);
            mapid.insertAdjacentElement('beforebegin', node);
        }
        map.locate({ setView: true, maxZoom: 16 });
    }

    markersLayer = new Lf.LayerGroup();
    map = Lf.map('mapid').setView(center, 16);
    configureLeafletAssets();

    Lf.Control.geocoder({ placeholder: 'Localizar...', geocoder: resolveGeocoder(Lf) })
        .addTo(map)
        .on('markgeocode', function (e) {
            map.eachLayer((layer) => { if (layer._latlng !== undefined) layer.remove(); });
            const c = e.geocode.bbox.getCenter();
            Lf.marker([c.lat, c.lng]).addTo(map).bindPopup(e.geocode.html).openPopup();
            markers = c;
        });
    tileLayer(Lf).addTo(map);

    const marker = Lf.marker(center).addTo(map);
    markers = marker._latlng;
    if (value && latlng) {
        marker.bindPopup('<b>' + followLinkHtml(id_procedimento) + '</b><br>' + escHtml(value.descricao)).openPopup();
    }
    if (!readonly) {
        map.on('click', addMarker);
        if (latlng === false && !locationDenied) {
            locationUser = setInterval(locate, 3000);
            map.on('locationfound', onLocationFound);
            map.on('locationerror', onLocationError);
        }
    }
}

function addMarker(e) {
    const Lf = L();
    clearLocationUser();
    map.eachLayer((layer) => { if (layer._latlng !== undefined) layer.remove(); });
    Lf.marker(e.latlng).addTo(map);
    markers = e.latlng;
    setTimeout(() => map.panTo(new Lf.LatLng(e.latlng.lat, e.latlng.lng)), 500);
}

function renderMultipleMap() {
    const Lf = L();
    const store = getStoreMonitoradoPro();
    const list = jp().search(store.monitorados, '[?not_null(latlng)]');
    if (!list || !list.length) return;
    const bounds = [];
    markersLayer = new Lf.LayerGroup();
    map = Lf.map('mapid').setView(list[0].latlng, 16);
    configureLeafletAssets();

    Lf.Control.geocoder({ placeholder: 'Localizar...', defaultMarkGeocode: false, geocoder: resolveGeocoder(Lf) })
        .addTo(map)
        .on('markgeocode', function (e) {
            const c = e.geocode.bbox.getCenter();
            const m = Lf.marker([c.lat, c.lng]).addTo(map).bindPopup(e.geocode.html).openPopup();
            Lf.DomUtil.addClass(m._icon, 'markerSearch');
            map.fitBounds([[c.lat, c.lng]]).setZoom(13);
        });
    tileLayer(Lf).addTo(map);

    list.forEach((value) => {
        const m = Lf.marker(value.latlng).addTo(map).on('click', openMarkerMonitorado);
        m.bindPopup('<b>' + followLinkHtml(value.id_procedimento) + '</b><br>' + escHtml(value.descricao));
        m.monitorados = value;
        bounds.push([m._latlng.lat, m._latlng.lng]);
    });
    map.fitBounds(bounds);
}

function openMarkerMonitorado(e) {
    const value = e.target.monitorados;
    const row = qs('#monitoradoTablePro tbody tr[data-id_procedimento="' + value.id_procedimento + '"]');
    if (typeof globalRef.scrollToElement === 'function') {
        globalRef.scrollToElement(qs('#monitoradosProDiv .tabelaPanelScroll'), row, 30);
    }
    const toggle = qs('#monitoradoPro_' + value.id_procedimento);
    if (toggle) toggle.click();
}

export function saveConfigMapsMonitorado(id_procedimento, mode = 'add') {
    if (typeof markers !== 'object' || markers.lat == null || markers.lng == null) return;
    const store = getStoreMonitoradoPro();
    const idx = findMonitoradoIndex(store, id_procedimento);
    if (idx < 0) return;
    store.monitorados[idx].latlng = (mode === 'remove') ? null : [markers.lat, markers.lng];
    persistMonitoradoStore(store);
    if (typeof globalRef.setPanelMonitorados === 'function') globalRef.setPanelMonitorados('refresh');
    markers = [];
    setTimeout(() => {
        if (typeof globalRef.alertaBoxPro === 'function') {
            globalRef.alertaBoxPro('Sucess', 'check-circle', 'Mapa ' + (mode === 'remove' ? 'removido' : 'adicionado') + ' com sucesso!');
        }
    }, 500);
}

// Caixas de mapa via modal compartilhado (src/shared/ui/modal.js).
export function openBoxSingleMap(triggerEl, readonly = false) {
    locationDenied = false;
    const row = triggerEl && triggerEl.closest ? triggerEl.closest('tr') : null;
    const id = row ? row.getAttribute('data-id_procedimento') : (triggerEl && triggerEl.dataset ? triggerEl.dataset.id_procedimento : '');
    const buttons = readonly ? [{ text: 'Fechar', onClick: (ref) => ref.close() }] : [
        { text: 'Remover', onClick: (ref) => { saveConfigMapsMonitorado(id, 'remove'); ref.close(); } },
        { text: 'Salvar', class: 'confirm', onClick: (ref) => { saveConfigMapsMonitorado(id); ref.close(); } }
    ];
    openModal({
        title: 'Processos Monitorados: Mapa',
        content: '<div id="mapid" style="width:600px;height:400px;max-width:100%;"></div>',
        width: 620, buttons,
        onOpen: () => renderSingleMap(id, readonly),
        onClose: () => { clearLocationUser(); setTimeout(() => { markers = []; }, 1000); }
    });
}

export function openBoxMultipleMap() {
    openModal({
        title: 'Processos Monitorados: Mapa',
        content: '<div id="mapid" style="width:900px;height:600px;max-width:100%;"></div>',
        width: 920, onOpen: renderMultipleMap
    });
}
