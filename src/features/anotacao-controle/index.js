/**
 * Feature "Mostrar anotação do processo na tela de controle de processos"
 * (config `mostraranotacaocontrole`) — ENTRY do bundle isolado.
 *
 * Arquitetura:
 *   core/sticknote.js   → núcleo PURO (parse/normalização), import modular
 *   ./view.js           → camada de DOM (render/replace/format), extraída de sei-pro.js
 *   ./index.js (aqui)   → expõe a API da feature em SeiPro.features.anotacaoControle
 *
 * O lifecycle continua ancorado no ciclo do tablesorter da lista de processos
 * (sei-pro.js), que chama `init()` (init da lista) e `render()` (rebuild da
 * tabela) via este namespace — ponte enxuta no lugar do cluster de ~300 linhas
 * que vivia embutido. Roda no mundo isolado, mesmo `window` do sei-pro.js.
 */
import { initReplaceSticknoteHome, renderSticknoteHomeInline, replaceSticknoteHome } from './view.js';

(function (win) {
    'use strict';
    win.SeiPro = win.SeiPro || {};
    win.SeiPro.features = win.SeiPro.features || {};
    win.SeiPro.features.anotacaoControle = {
        init: initReplaceSticknoteHome,
        render: renderSticknoteHomeInline,
        replace: replaceSticknoteHome
    };
})(window);
