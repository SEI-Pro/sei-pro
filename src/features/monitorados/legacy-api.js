import { aliasGlobal } from '../../core/global.js';
import { initPanelMonitorados, initAppendIconMonitorados, setAppendIconMonitorados } from './boot.js';
import { legacyApi as icon } from './icon.js';
import { legacyApi as panel } from './panel.js';
import { legacyApi as commands } from './commands.js';
import { legacyApi as datas } from './datas.js';
import { legacyApi as categorias } from './categorias.js';
import { legacyApi as server } from './server.js';
import { legacyApi as prazoRow } from './prazo-row.js';
import { legacyApi as extras } from './extras.js';
import { legacyApi as panelLifecycle } from './panel-lifecycle.js';
import { legacyApi as visualizacao } from './visualizacao.js';

/**
 * Monitorados — PONTE DE COMPATIBILIDADE: único arquivo da feature que usa
 * aliasGlobal (regra DEVELOPMENT.md). Expõe como globais os pontos de entrada que
 * o legado ainda chama (sei-pro.js, sei-pro-all.js, sei-functions-pro.js, init*.js,
 * HTML gerado com data-act que aponta para nomes legados).
 *
 * Cada módulo da feature exporta um objeto `legacyApi` { nomeGlobal: fn } com suas
 * próprias bindings; aqui apenas iteramos e aliasamos. Nenhum aliasGlobal vive nos
 * módulos de domain/io/view.
 *
 * EXCEÇÃO documentada — store.js: seus aliasGlobal ficam em store.js porque o store
 * é instalado via core-stack (installMonitoradoStore), carregado em TODOS os contextos
 * — inclusive blocos que carregam sei-functions-pro.js mas NÃO o monitorados.bundle
 * (procedimento_visualizar, arvore_visualizar, editor_montar…), onde o legado chama
 * getStoreMonitoradoPro. Mover esses aliases para cá os perderia nesses contextos.
 *
 * TODO: remover cada grupo quando o respectivo call-site legado migrar.
 */

const groups = [
    { initPanelMonitorados, initAppendIconMonitorados, setAppendIconMonitorados }, // boot.js
    icon, panel, commands, datas, categorias, server, prazoRow, extras, panelLifecycle, visualizacao
];

for (const group of groups) {
    for (const [name, fn] of Object.entries(group)) {
        aliasGlobal(name, fn);
    }
}
