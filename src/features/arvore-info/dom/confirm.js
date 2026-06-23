/**
 * Utilitário de confirmação para ações de remoção do SEI feitas via iframe.
 * Extraído do boot (Etapa D). VERBATIM.
 *
 * `forceTrueConfirm(winObj)` sobrescreve `confirm()` da janela-alvo para sempre
 * retornar true — o SEI usa `confirm()` nativo antes de remover (marcador etc.),
 * e a remoção é disparada programaticamente dentro de um iframe controlado.
 */
export function forceTrueConfirm(winObj) {
    if (!winObj) return;
    var alwaysTrue = function () { return true; };
    try { winObj.confirm = alwaysTrue; } catch (_) {}
    try {
        Object.defineProperty(winObj, 'confirm', {
            configurable: true,
            writable: true,
            value: alwaysTrue
        });
    } catch (_) {}
    try {
        if (typeof winObj.eval === 'function') {
            winObj.eval('window.confirm = function () { return true; };');
        }
    } catch (_) {}
    try {
        if (winObj.top && winObj.top !== winObj) {
            winObj.top.confirm = alwaysTrue;
        }
    } catch (_) {}
}
