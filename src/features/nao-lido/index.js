/**
 * Marcar processos como "Não Visualizado" (config `marcar_naolido`) — ENTRY do bundle.
 *
 * Decomposição em io/view (substitui as funções homônimas que viviam soltas em
 * sei-functions-pro.js e sei-pro.js). Bundlado por esbuild → dist/js/sei-pro-nao-lido.js,
 * carregado após sei-pro.js nos blocos 3 e 4 do manifest (procedimento_trabalhar /
 * procedimento_controlar), no mundo isolado.
 *
 * Preserva a superfície GLOBAL: cada função exportada é reexposta como global via
 * aliasGlobal — o botão (onclick="marcarProcessoNaoLido()") e o init em sei-pro.js
 * (initNaoVisualizadoPro()) continuam resolvendo por nome, sem mudança de comportamento.
 * As definições legadas foram REMOVIDAS de sei-functions-pro.js / sei-pro.js (aliasGlobal
 * só define se ausente; manter o legado anularia o bundle). A lógica pura de detecção de
 * redirect (isAjaxRedirectAction) já vive em src/sei/urls.js desde a Fase 6.
 */
import { aliasGlobal } from '../../core/global.js';
import * as io from './io.js';
import * as view from './view.js';

[io, view].forEach(function (mod) {
    Object.keys(mod).forEach(function (name) {
        if (typeof mod[name] === 'function') aliasGlobal(name, mod[name]);
    });
});
