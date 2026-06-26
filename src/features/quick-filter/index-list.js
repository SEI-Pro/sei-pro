/**
 * Entry (bundle) do contexto LISTA da feature "Filtrar a página pelo campo de
 * pesquisa rápida". Carregado pelo manifest nos blocos de lista de processos
 * (procedimento_trabalhar / procedimento_controlar). Self-boot isolated-first;
 * não depende do legado chamá-lo.
 */
import { ready } from '../../dom/index.js';
import { initQuickFilterList } from './list.js';

function isEnabled() {
    try { return typeof checkConfigValue === 'function' && checkConfigValue('filtrarpaginapelapesquisarapida'); }
    catch (e) { return false; }
}

(function boot() {
    if (window.__SEI_PRO_QUICK_FILTER_LIST_BOOTED__) return;
    window.__SEI_PRO_QUICK_FILTER_LIST_BOOTED__ = true;
    ready(function () {
        if (!isEnabled()) return;
        initQuickFilterList();
        // O #txtPesquisaRapida faz parte do cabeçalho nativo; uma 2ª tentativa cobre
        // o caso de o campo aparecer um tick depois do DOMContentLoaded.
        setTimeout(function () { if (isEnabled()) initQuickFilterList(); }, 500);
    });
})();
