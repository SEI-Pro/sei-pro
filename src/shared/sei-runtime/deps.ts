/**
 * Dependências legadas entre capacidades.
 *
 * Antes da dissolução de `sei-functions`, cada cluster importava um barrel que
 * importava todos os outros clusters. Isso tornava qualquer bundle um
 * monólito, mesmo quando usava uma única função. A ponte abaixo resolve a
 * dependência no momento da ação, depois que as raízes de composição
 * instalaram os aliases de cada capacidade.
 */
const root: Record<string, unknown> = typeof window !== 'undefined'
    ? (window as unknown as Record<string, unknown>)
    : (globalThis as unknown as Record<string, unknown>);

function call(name: string, args: unknown[]): unknown {
    const fn = root[name];
    if (typeof fn !== 'function') return undefined;
    return fn.apply(root, args);
}

function dependency(name: string) {
    return function legacyDependency(...args: unknown[]): unknown {
        return call(name, args);
    };
}

export const ajaxDadosDocumentosPro = dependency('ajaxDadosDocumentosPro');
export const ajaxDadosProcessoPro = dependency('ajaxDadosProcessoPro');
export const alertaBoxPro = dependency('alertaBoxPro');
export const buildTreeModel = dependency('buildTreeModel');
export const centralizeDialogBox = dependency('centralizeDialogBox');
export const checkLoadJqueryUI = dependency('checkLoadJqueryUI');
export const checkLoadingButtonConfirm = dependency('checkLoadingButtonConfirm');
export const checkMenuSEIPro = dependency('checkMenuSEIPro');
export const checkPageVisualizacao = dependency('checkPageVisualizacao');
export const checkProcessoSigiloso = dependency('checkProcessoSigiloso');
export const checkboxRangerSelectShift = dependency('checkboxRangerSelectShift');
export const chosenReparePosition = dependency('chosenReparePosition');
export const confirmaBoxPro = dependency('confirmaBoxPro');
export const confirmaFraseBoxPro = dependency('confirmaFraseBoxPro');
export const copyToClipboard = dependency('copyToClipboard');
export const copyToClipboardHTML = dependency('copyToClipboardHTML');
export const downloadTableCSV = dependency('downloadTableCSV');
export const fnJqueryPro = dependency('fnJqueryPro');
export const getActionsOnSendProcess = dependency('getActionsOnSendProcess');
export const getAllLinksFolder = dependency('getAllLinksFolder');
export const getArrayHistorico = dependency('getArrayHistorico');
export const getAutomaticActions = dependency('getAutomaticActions');
export const getCheckerProcessoPro = dependency('getCheckerProcessoPro');
export const getCitacaoDoc = dependency('getCitacaoDoc');
export const getConfigHost = dependency('getConfigHost');
export const getContentDocSEI = dependency('getContentDocSEI');
export const getDadosAjaxMonitoradoPro = dependency('getDadosAjaxMonitoradoPro');
export const getDadosAndamentoPro = dependency('getDadosAndamentoPro');
export const getDadosHistoricoUrlPro = dependency('getDadosHistoricoUrlPro');
export const getDadosProcessoPro = dependency('getDadosProcessoPro');
export const getDadosProcessoSession = dependency('getDadosProcessoSession');
export const getDocsArvore = dependency('getDocsArvore');
export const getDocumentosActions = dependency('getDocumentosActions');
export const getHipoteseLegal = dependency('getHipoteseLegal');
export const getIDProtocoloSEI = dependency('getIDProtocoloSEI');
export const getIdProcedimento = dependency('getIdProcedimento');
export const getIframeArvoreElement = dependency('getIframeArvoreElement');
export const getLinksArvoreAjax = dependency('getLinksArvoreAjax');
export const getLinksInText = dependency('getLinksInText');
export const getLinksProcessoAjax = dependency('getLinksProcessoAjax');
export const getListDocumentosArvore = dependency('getListDocumentosArvore');
export const getListaAtribuicaoProcesso = dependency('getListaAtribuicaoProcesso');
export const getNumProcesso = dependency('getNumProcesso');
export const getProcessoUnidadePro = dependency('getProcessoUnidadePro');
export const getScriptIframe = dependency('getScriptIframe');
export const getTreeDocumentsSession = dependency('getTreeDocumentsSession');
export const getTreeIconsViewSession = dependency('getTreeIconsViewSession');
export const getTreeLinkUrlByName = dependency('getTreeLinkUrlByName');
export const getTreeLinksAllSession = dependency('getTreeLinksAllSession');
export const getTreeSignedDocumentsSession = dependency('getTreeSignedDocumentsSession');
export const getUrlNewDocArvore = dependency('getUrlNewDocArvore');
export const initBlocoProcessoHistorico = dependency('initBlocoProcessoHistorico');
export const initCheckNaoAssinados = dependency('initCheckNaoAssinados');
export const initChosenReplace = dependency('initChosenReplace');
export const initModalNewSEISigiloso = dependency('initModalNewSEISigiloso');
export const initTablePaginacaoHistorico = dependency('initTablePaginacaoHistorico');
export const loadScriptPro = dependency('loadScriptPro');
export const loadingButtonConfirm = dependency('loadingButtonConfirm');
export const mergeAllAndamentosProcesso = dependency('mergeAllAndamentosProcesso');
export const normalizeTreeDocuments = dependency('normalizeTreeDocuments');
export const openLinkNewTab = dependency('openLinkNewTab');
export const openWindowEditor = dependency('openWindowEditor');
export const patchNativeEditorOpen = dependency('patchNativeEditorOpen');
export const pullDadosProcessoSession = dependency('pullDadosProcessoSession');
export const removeTreeDocumentById = dependency('removeTreeDocumentById');
export const replaceColorsIcons = dependency('replaceColorsIcons');
export const resetDialogBoxPro = dependency('resetDialogBoxPro');
export const resizeArvoreMaxWidth = dependency('resizeArvoreMaxWidth');
export const scrollToElement = dependency('scrollToElement');
export const setCaretPosition = dependency('setCaretPosition');
export const setHistoryProcessosPro = dependency('setHistoryProcessosPro');
export const setHtmlProtocoloAlterar = dependency('setHtmlProtocoloAlterar');
export const setInfraImg = dependency('setInfraImg');
export const setNewDoc = dependency('setNewDoc');
export const setParamEditorAtiv = dependency('setParamEditorAtiv');
export const setResizeArvoreMaxWidth = dependency('setResizeArvoreMaxWidth');
export const setSessionProcessosPro = dependency('setSessionProcessosPro');
export const setSizeIframePro = dependency('setSizeIframePro');
export const setTabelaPanelScrollHeight = dependency('setTabelaPanelScrollHeight');
export const updateButtonConfirm = dependency('updateButtonConfirm');
export const updateDadosArvore = dependency('updateDadosArvore');
export const updateDadosProcesso = dependency('updateDadosProcesso');
export const updateTitlePage = dependency('updateTitlePage');
export const updateTreeDocumentById = dependency('updateTreeDocumentById');
export const updateUrlPage = dependency('updateUrlPage');
export const waitLoadPro = dependency('waitLoadPro');
