function initSeiProVisualizacao(TimeOut = 9000) {
    if (typeof parent.insertIconIntegrity === 'function' || typeof parent.insertIconIntegrity !== 'undefined') {
        parent.insertIconIntegrity();
    }
}

$(document).ready(function () { initSeiProVisualizacao() });