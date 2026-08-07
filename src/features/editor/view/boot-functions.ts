// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../lib/domq.js';
import { state } from '../state.js';
import { api } from '../api.js';

export function initFunctions() {
    api.initContextMenuPro();
    api.getDialogLegisSEI();
    api.getDialogNotaRodape();
    // getDialogRefInterna();
    // getDialogSumarioDocumento();
    api.getDialogSyleTable();
	api.getDialogQrCode();
    api.getDialogLinkPro();
    // getDialogImportDocPro();
    api.getDialogPageImageBackground();
    api.initDialogUploadImgBase64();
    // getDialogProcessoPublicoPro();
    api.getDialogSigilo();
    api.getDialogReview();
    api.getDialogDitado();
    api.getDialogBatchImgQuality();
    api.initDialogImageEditorPro();
	api.loadResizeImg();
    if (typeof updateDialogDefinitionPro === 'function') updateDialogDefinitionPro();
    api.loadPasteImgToBase64();
    if (typeof insertFontIcon === 'function') insertFontIcon('head');
    if (typeof reloadModalLink === 'function') reloadModalLink();
    api.setDocCertidao();
    api.setDocAutomatico();
    api.initDropImages();
    if (typeof getStylesOnEditor === 'function') getStylesOnEditor();
    api.repairSaveButtonBug();
    clickScroolToRef();
    if (typeof checkLoadJqueryUI === 'function') checkLoadJqueryUI();

	// Process data: isolated editor-loader preloads into sessionStorage; MAIN
	// page-runtime syncs dadosProcessoPro. Keep a direct call when available.
	var idProcedimento = getParamsUrlPro(window.location.href).id_procedimento;
	if (typeof checkHostLimit === 'function' && !checkHostLimit()
        && typeof getDadosIframeProcessoPro === 'function') {
        getDadosIframeProcessoPro(idProcedimento, 'editor');
    }
}
api.initFunctions = initFunctions;
