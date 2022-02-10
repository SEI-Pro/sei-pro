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
    if (typeof parent.insertNewIcons === 'function' && typeof parent.insertNewIcons !== 'undefined') {
        parent.insertNewIcons();
    }
    if (
        (typeof parent.insertIconAtividade === 'function' || typeof parent.insertIconAtividade !== 'undefined' ) && 
        parent.checkConfigValue('gerenciaratividades') && localStorage.getItem('configBasePro_atividades') !== null
        ) {
        parent.insertIconAtividade();
    }
    if (typeof parent.insertIconNewTab === 'function') {
        parent.insertIconNewTab();
    }
}

$(document).ready(function () { initSeiProVisualizacao() });