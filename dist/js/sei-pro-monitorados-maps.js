// Monitorados — Mapas (Leaflet)
// Slice da view de Processos Monitorados (sei-pro-monitorados.js). Script global,
// carregado em sequência pelo manifest. Mapa único/múltiplo, marcadores e geolocalização.
var map;
var markers = [];
var markersLayer = false;
var locationUser = false;
var current_position = false;
var monitoradoLocationDenied = false;
function configureLeafletAssets() {
    if (typeof L === 'undefined' || typeof L.Icon === 'undefined' || typeof L.Icon.Default === 'undefined') return;
    if (L.Icon.Default.prototype._seiProAssetsConfigured) return;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: URL_SPRO+'css/images/marker-icon-2x.png',
        iconUrl: URL_SPRO+'css/images/marker-icon.png',
        shadowUrl: URL_SPRO+'css/images/marker-shadow.png'
    });
    L.Icon.Default.prototype._seiProAssetsConfigured = true;
}
function setSingleMap(id_procedimento, readonly = false) {
    var storeMonitorados = getStoreMonitoradoPro();
    var value = jmespath.search(storeMonitorados.monitorados, "[?id_procedimento=='"+id_procedimento+"'] | [0]");
        value = (value !== null) ? value : false;
    var latlng = (value !== null && typeof value.latlng !== 'undefined' && value.latlng !== null && value.latlng.length > 0 && value.latlng[0] !== null && value.latlng[1] !== null) ? value.latlng : false;
    var latlng_monitorado = (latlng) ? latlng : [-15.800909532800379, -47.861289633438];

    function onLocationFound(e) {
        // if position defined, then remove the existing position marker and accuracy circle from the map
        map.eachLayer((layer) => {
            if(layer['_latlng'] != undefined) layer.remove();
        });
        if (current_position) {
            map.removeLayer(current_position);
        }
        var radius = e.accuracy / 2;
            current_position = L.marker(e.latlng).addTo(map).bindPopup("Sua localiza\u00E7\u00E3o em um raio de " + radius + " metros deste ponto").openPopup();
            clearLocationUser();
            markers = e.latlng;
    }
    function onLocationError(e) {
        monitoradoLocationDenied = true;
        clearLocationUser();
    }
    // wrap map.locate in a function    
    function locate() {
        var htmlLoadingLocation =   '<div class="loadingLocation" style="color: #888;position: absolute;z-index: 9999;right: 0;padding: 5px 15px 5px 10px;background-color: #fff;border-bottom-left-radius: 5px;font-size: 10pt;">'+
                                    '   <i class="fas fa-spinner fa-spin"></i>'+
                                    '   Carregando sua localiza\u00E7\u00E3o'+
                                    '   <i class="fas fa-times-circle" onclick="clearLocationUser()"></i>'+
                                    '</div>';
        $('.loadingLocation').remove();
        $('#mapid').before(htmlLoadingLocation);
        map.locate({setView: true, maxZoom: 16});
    }

    markersLayer = new L.LayerGroup();
    map = L.map('mapid').setView(latlng_monitorado, 16);
    configureLeafletAssets();

    var geocoder = L.Control.Geocoder.nominatim();
    if (typeof URLSearchParams !== 'undefined' && location.search) {
        // parse /?geocoder=nominatim from URL
        var params = new URLSearchParams(location.search);
        var geocoderString = params.get('geocoder');
        if (geocoderString && L.Control.Geocoder[geocoderString]) {
            console.log('Using geocoder', geocoderString);
            geocoder = L.Control.Geocoder[geocoderString]();
        } else if (geocoderString) {
            console.warn('Unsupported geocoder', geocoderString);
        }
    }
    var control = L.Control.geocoder({
        placeholder: 'Localizar...',
        geocoder: geocoder
    }).addTo(map).on('markgeocode', function(e) {
        map.eachLayer((layer) => {
            if(layer['_latlng'] != undefined) layer.remove();
        });
        var result = e.geocode.bbox.getCenter();
        var marker = L.marker([result.lat, result.lng]).addTo(map);
            marker.bindPopup(e.geocode.html).openPopup();
            markers = result;
    });

    // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '<a href="https://seipro.app" target="_blank">SEI Pro</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    var marker = L.marker(latlng_monitorado).addTo(map);
    markers = marker._latlng;
    if (value && latlng) {
        var linkProc = $('#monitoradoTablePro tbody tr[data-id_procedimento="'+id_procedimento+'"] .followLinkProcesso')[0].outerHTML;
        marker.bindPopup('<b>'+linkProc+'</b><br>'+((typeof escapeHtml === 'function') ? escapeHtml(value.descricao) : value.descricao)).openPopup();
    }
    
    if (!readonly) {   
        map.on('click', addMarker);
        if (latlng === false && !monitoradoLocationDenied) {
            locationUser = setInterval(locate, 3000);
            map.on('locationfound', onLocationFound);
            map.on('locationerror', onLocationError);
        }
    }

}
function addMarker(e){
    clearLocationUser();
    map.eachLayer((layer) => {
        if(layer['_latlng'] != undefined) layer.remove();
    });
    // Add marker to map at click location; add popup window
    var newMarker = new L.marker(e.latlng).addTo(map);
    markers = e.latlng;

    setTimeout(function(){ 
        map.panTo(new L.LatLng(e.latlng.lat, e.latlng.lng));
    }, 500);
}
function clearLocationUser() {
    $('.loadingLocation').remove();
    clearInterval(locationUser);
    locationUser = false;
}
function openBoxSingleMap(this_, readonly = false) {
    monitoradoLocationDenied = false;
    var _this = $(this_);
    var id_procedimento = _this.closest('tr').data('id_procedimento');
    var buttons = (readonly) 
        ? null
        : [{
            text: "Remover",
            icon: 'ui-icon-trash',
            click: function() {
                saveConfigMapsMonitorado(id_procedimento, 'remove');
                resetDialogBoxPro('dialogBoxPro');
            }
        },{
            text: "Salvar",
            class: 'confirm ui-state-active',
            click: function() {
                saveConfigMapsMonitorado(id_procedimento);
                resetDialogBoxPro('dialogBoxPro');
            }
        }];
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div id="mapid" style="width: 600px; height: 400px;"></div>')
        .dialog({
            title: "Processos Monitorados: Mapa",
            width: 620,
            close: function(){
                clearLocationUser();
                setTimeout(function(){ 
                    markers = [];
                }, 1000);
            },
            open: function(){
                setSingleMap(id_procedimento, readonly);
            },
            buttons: buttons
    });
}
function openBoxMultipleMap() {
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div id="mapid" style="width: 900px; height: 600px;"></div>')
        .dialog({
            title: "Processos Monitorados: Mapa",
            width: 920,
            open: function(){
                setMultipleMap();
            }
    });
}
function setMultipleMap() {
    var marker_list = [];
    var storeMonitorados = getStoreMonitoradoPro();
    var listMonitorado = jmespath.search(storeMonitorados.monitorados, "[?not_null(latlng)]");
        listMonitorado = (typeof listMonitorado !== 'undefined' && listMonitorado !== null && listMonitorado.length > 0) ? listMonitorado : false;
    if (listMonitorado) {
        markersLayer = new L.LayerGroup();
        map = L.map('mapid').setView(listMonitorado[0].latlng, 16);

        var geocoder = L.Control.Geocoder.nominatim();
        if (typeof URLSearchParams !== 'undefined' && location.search) {
            // parse /?geocoder=nominatim from URL
            var params = new URLSearchParams(location.search);
            var geocoderString = params.get('geocoder');
            if (geocoderString && L.Control.Geocoder[geocoderString]) {
                console.log('Using geocoder', geocoderString);
                geocoder = L.Control.Geocoder[geocoderString]();
            } else if (geocoderString) {
                console.warn('Unsupported geocoder', geocoderString);
            }
        }
        var control = L.Control.geocoder({
            placeholder: 'Localizar...',
            defaultMarkGeocode: false,
            geocoder: geocoder
        }).addTo(map).on('markgeocode', function(e) {
            var result = e.geocode.bbox.getCenter();
            var result_latlng = [result.lat, result.lng];
            var marker = L.marker(result_latlng).addTo(map);
                marker.bindPopup(e.geocode.html).openPopup();
                L.DomUtil.addClass(marker._icon, 'markerSearch');
                map.fitBounds([result_latlng]).setZoom(13);
        });


        // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '<a href="https://seipro.app" target="_blank">'+NAMESPACE_SPRO+'</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(map);
        $.each(listMonitorado,function(index, value){
            var marker = L.marker(value.latlng).addTo(map).on('click', openMarkerMonitorado);
            var linkProc = $('#monitoradoTablePro tbody tr[data-id_procedimento="'+value.id_procedimento+'"] .followLinkProcesso')[0].outerHTML;
                marker.bindPopup('<b>'+linkProc+'</b><br>'+((typeof escapeHtml === 'function') ? escapeHtml(value.descricao) : value.descricao));
                marker_list.push([marker._latlng.lat, marker._latlng.lng]);
                marker.monitorados = value;
        });
        map.fitBounds(marker_list);
        marker = false;
    }
}
function openMarkerMonitorado(e){
    var value = e.target.monitorados;
    $('#monitoradoTablePro').find('#lnkInfraCheck').data('index',1).trigger('click');
    scrollToElement($('#monitoradosProDiv .tabelaPanelScroll'), $('#monitoradoTablePro tbody tr[data-id_procedimento="'+value.id_procedimento+'"]'), 30);
    $('#monitoradoPro_'+value.id_procedimento).trigger('click');
}
function saveConfigMapsMonitorado(id_procedimento, mode = 'add'){
    if (typeof markers === 'object' && markers.lat !== null && markers.lng !== null) {
        var storeMonitorados = getStoreMonitoradoPro();
        var monitoradoIndex = findMonitoradoIndex(storeMonitorados, id_procedimento);
        if (monitoradoIndex >= 0) {
            var item = storeMonitorados.monitorados[monitoradoIndex];
                item.latlng = (mode == 'remove') ? null : [markers.lat, markers.lng];
            storeMonitorados.monitorados[monitoradoIndex] = item;
            persistMonitoradoStore(storeMonitorados);
            setPanelMonitorados('refresh');
            markers = [];
            setTimeout(function(){ 
                alertaBoxPro('Sucess', 'check-circle', 'Mapa '+(mode == 'remove' ? 'removido' : 'adicionado')+' com sucesso!');
            }, 500);
        }
    }
}

