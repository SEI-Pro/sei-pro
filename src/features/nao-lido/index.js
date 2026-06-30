/**
 * Marcar processos como "Não Visualizado" (config `marcar_naolido`) — ENTRY do bundle.
 *
 * Decomposição: domain.js (puro) · io.js (rede/serialização SEI) · view.js (DOM +
 * orquestração) · legacy-api.js (aliasGlobal). Bundlado por esbuild →
 * dist/js/sei-pro-nao-lido.js, carregado após sei-pro.js nos blocos 3 e 4 do
 * manifest (procedimento_trabalhar / procedimento_controlar), no mundo isolado.
 *
 * O botão na lista de processos (gerado em sei-pro.js) usa `data-act="nao-lido-marcar"`
 * e é tratado por um handler DELEGADO no document (installNaoLido) — não mais
 * onclick inline, que executaria no mundo MAIN e não enxergaria a função do content
 * script. A superfície global legada (initNaoVisualizadoPro, chamada por nome no
 * init da home) é preservada via legacy-api.js.
 */
import { ready } from '../../dom/index.js';
import './legacy-api.js';
import { installNaoLido } from './view.js';

ready(function () { installNaoLido(document); });
