// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Marcar processos como "Não Visualizado" (config `marcar_naolido`) — ENTRY do bundle.
 *
 * Decomposição: domain.js (puro) · io.js (rede/serialização SEI) · view.js (DOM +
 * orquestração) · legacy-api.js (aliasGlobal). É incluído pela entry
 * `lista-context`, carregada após sei-pro.js nos blocos da lista, no mundo
 * isolado.
 *
 * O botão na lista de processos (gerado em sei-pro.js) usa `data-act="nao-lido-marcar"`
 * e é tratado por um handler DELEGADO no document (installNaoLido) — não mais
 * onclick inline, que executaria no mundo MAIN e não enxergaria a função do content
 * script. A superfície global legada (initNaoVisualizadoPro, chamada por nome no
 * init da home) é preservada via legacy-api.js.
 */
import './legacy-api.js';
import { installNaoLido } from './view.js';

// A instalação ocorre exclusivamente em entries/lista-context.ts. Este módulo
// continua a publicar a ponte legada acima, antes que init.js a consuma.
export { installNaoLido };
