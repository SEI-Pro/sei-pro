/**
 * Utilitário de confirmação para ações de remoção do SEI feitas via iframe.
 * Extraído do boot (Etapa D).
 *
 * `forceTrueConfirm(winObj)` sobrescreve `confirm()` da janela-alvo para sempre
 * retornar true — o SEI usa `confirm()` nativo antes de remover (marcador etc.),
 * e a remoção é disparada programaticamente dentro de um iframe controlado.
 * ADR-0015: sem eval; Object.defineProperty é a via primária.
 */
export function forceTrueConfirm(winObj: Window | null | undefined) {
    if (!winObj) return;
    const alwaysTrue = function () { return true; };
    try { winObj.confirm = alwaysTrue; } catch (_) { /* ignore */ }
    try {
        Object.defineProperty(winObj, 'confirm', {
            configurable: true,
            writable: true,
            value: alwaysTrue
        });
    } catch (_) { /* ignore */ }
    try {
        if (winObj.top && winObj.top !== winObj) {
            winObj.top.confirm = alwaysTrue;
        }
    } catch (_) { /* ignore */ }
}
