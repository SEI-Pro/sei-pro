function atividadesApiParent() {
    var feature = typeof parent !== 'undefined' && parent.SeiPro && parent.SeiPro.features && parent.SeiPro.features.atividades;
    return (feature && feature.api) || null;
}
function hasParentAtividades(name) {
    var api = atividadesApiParent();
    return !!(api && api.commands && typeof api.commands[name] === 'function')
        || !!(api && api.queries && typeof api.queries[name] === 'function')
        || !!(api && api.handlers && typeof api.handlers[name] === 'function');
}
function callParentAtividades(name) {
    var api = atividadesApiParent();
    var fn = (api && api.commands && typeof api.commands[name] === 'function') ? api.commands[name]
        : (api && api.queries && typeof api.queries[name] === 'function') ? api.queries[name]
        : (api && api.handlers && typeof api.handlers[name] === 'function') ? api.handlers[name]
        : (api && api.handlers && typeof api.handlers[name] === 'function' ? api.handlers[name] : null);
    if (typeof fn !== 'function') return undefined;
    var args = Array.prototype.slice.call(arguments, 1);
    return fn.apply(null, args);
}

const loadSEIProVisualizacao = true;
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
        if (parent.checkConfigValue('visualizarzip')) parent.initDocZipPro();
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
    if (typeof parent.insertIconPublicacaoEletronica === 'function') {
        parent.insertIconPublicacaoEletronica();
    }
    if (hasParentAtividades('setTipoPrescricaoProcesso') && parent.checkTipoPrescricaoProcesso()) {
        parent.appendIconCtrPrescricao();
    }
    if (typeof parent.checkHostLimit !== 'undefined' && !parent.checkHostLimit() && typeof parent.insertIconBatchActions === 'function' && parent.checkConfigValue('acoesemlote')) {
        parent.insertIconBatchActions();
    }
    if (typeof parent.initMoveIconDeleteToEnd === 'function' && parent.checkConfigValue('movericone')) {
        parent.initMoveIconDeleteToEnd();
    }
    if (typeof parent.checkHostLimit !== 'undefined' && !parent.checkHostLimit() && typeof parent.insertIconBatchDocs === 'function' && parent.checkConfigValue('documentosemlote')) {
        parent.insertIconBatchDocs();
    }
    if (typeof parent.insertIconCompareDocs === 'function' && parent.checkConfigValue('comparardocumentos')) {
        parent.insertIconCompareDocs();
    }
    if (typeof parent.insertIconAIActions === 'function' && parent.restrictConfigValue('ferramentasia')) {
        parent.insertIconAIActions();
    }
    if (typeof parent.insertNewIcons === 'function' && typeof parent.insertNewIcons !== 'undefined') {
        parent.insertNewIcons();
    }
    if (typeof parent.insertActionInteressadosSend !== 'undefined') {
        parent.insertActionInteressadosSend();
    }
    if (
        hasParentAtividades('insertIconAtividade') &&
        parent.checkConfigValue('gerenciaratividades') && localStorage.getItem('configBasePro_atividades') !== null
        ) {
        callParentAtividades('insertIconAtividade');
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
