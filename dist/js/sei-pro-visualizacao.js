function initSeiProVisualizacao() {
    if (typeof parent.insertIconIntegrity === 'function' || typeof parent.insertIconIntegrity !== 'undefined') {
        parent.insertIconIntegrity();
    }
    if (typeof parent.insertIconDynamicField === 'function' || typeof parent.insertIconDynamicField !== 'undefined') {
        parent.insertIconDynamicField();
    }
    if ((typeof parent.insertIconFormSheet === 'function' || typeof parent.insertIconFormSheet !== 'undefined') && parent.checkConfigValue('gerenciarformularios')) {
        parent.insertIconFormSheet();
    }
    if (typeof parent.initDocVideoPro === 'function' || typeof parent.initDocVideoPro !== 'undefined' || typeof parent.initDocZipPro !== 'undefined') {
        parent.initDocVideoPro();
        parent.initDocImagemPro();
        // parent.initDocZipPro();
    }
    if (typeof parent.insertIconNewDoc === 'function' && typeof parent.linksArvore !== 'undefined') {
        parent.insertIconNewDoc();
    }
    if (typeof parent.insertTooltipOnButtons === 'function' && !localStorage.getItem('seiSlim')) {
        parent.insertTooltipOnButtons();
    }
    if (typeof parent.insertIconDocCertidao === 'function' && typeof parent.linksArvore !== 'undefined') {
        parent.insertIconDocCertidao();
    }
    if (typeof parent.insertIconBatchActions === 'function' && parent.checkConfigValue('acoesemlote')) {
        parent.insertIconBatchActions();
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
    if (typeof parent.setCapaProcesso === 'function') {
        parent.setCapaProcesso();
    }
    if (typeof parent.verifyMenuSistemaView === 'function') {
        parent.verifyMenuSistemaView();
    }
}
$(document).ready(function () { initSeiProVisualizacao() });