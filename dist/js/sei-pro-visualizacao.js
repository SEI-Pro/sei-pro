function initSeiProVisualizacao() {
    if (typeof parent.insertIconIntegrity === 'function' || typeof parent.insertIconIntegrity !== 'undefined') {
        parent.insertIconIntegrity();
    }
    if (typeof parent.initDocVideoPro === 'function' || typeof parent.initDocVideoPro !== 'undefined') {
        parent.initDocVideoPro();
        parent.initDocImagemPro();
    }
    if (typeof parent.insertIconNewDoc === 'function' && typeof parent.linksArvore !== 'undefined') {
        parent.insertIconNewDoc();
    }
    if (
        (typeof parent.insertIconAtividade === 'function' || typeof parent.insertIconAtividade !== 'undefined' ) && 
        parent.checkConfigValue('gerenciaratividades') && localStorage.getItem('configBasePro_atividades') !== null
        ) {
        parent.insertIconAtividade();
    }
}

$(document).ready(function () { initSeiProVisualizacao() });