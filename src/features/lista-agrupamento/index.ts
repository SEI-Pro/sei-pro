// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { installListaAgrupamentoDomain } from './domain.js';
import { installListaAgrupamentoIO } from './io.js';
import { installListaAgrupamentoView } from './view.js';
import { installListaAgrupamentoLegacyApi } from './legacy-api.js';
import { publishFeature } from '../../app/publish-feature.js';

const globalRef = typeof window !== 'undefined' ? window : globalThis;

export function installListaAgrupamento() {
    installListaAgrupamentoDomain(globalRef);
    installListaAgrupamentoIO(globalRef);
    installListaAgrupamentoView(globalRef);
    installListaAgrupamentoLegacyApi();
}

publishFeature({
    id: 'lista-agrupamento',
    api: Object.freeze({
        extractGroupTableTooltipToArray: undefined,
        getTagName: undefined
    }),
    install: installListaAgrupamento
});
