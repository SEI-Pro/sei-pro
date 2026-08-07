// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Entry (bundle) do contexto ÁRVORE da feature "Filtrar a página pelo campo de
 * pesquisa rápida". Carregado pelo manifest no bloco procedimento_visualizar
 * (all_frames) — roda dentro do ifrArvore. Self-boot isolated-first.
 *
 * A árvore re-renderiza de forma assíncrona; um MutationObserver (debounce rAF)
 * reaplica o highlight do termo ativo quando novos nós entram, substituindo a
 * antiga rechamada de initQuickPageFilterArvore dentro de initSeiProArvore.
 */
import { initQuickFilterTree } from './tree.js';

function isEnabled() {
    try { return typeof parent.checkConfigValue === 'function' && parent.checkConfigValue('filtrarpaginapelapesquisarapida'); }
    catch (e) { return false; }
}

function getParentInput() {
    try { return parent && parent.document ? parent.document.getElementById('txtPesquisaRapida') : null; }
    catch (e) { return null; }
}

function observeTree() {
    const root = document.getElementById('divArvore');
    if (!root || root.__seiproQuickObserved) return;
    root.__seiproQuickObserved = true;
    let pending = false;
    const mo = new MutationObserver(function () {
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () {
            pending = false;
            const input = getParentInput();
            if (input && input.value) initQuickFilterTree();
        });
    });
    mo.observe(root, { childList: true, subtree: true });
}

(function boot() {
    // Só age dentro do frame da árvore (#divArvore); no frame pai do visualizar
    // não há árvore — nada a fazer (o highlight do visualizador é outra feature).
    if (!document.getElementById('divArvore')) return;
    if (window.__SEI_PRO_QUICK_FILTER_TREE_BOOTED__) return;
    window.__SEI_PRO_QUICK_FILTER_TREE_BOOTED__ = true;
    if (!isEnabled()) return;
    initQuickFilterTree();
    observeTree();
})();
