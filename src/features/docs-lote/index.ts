// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
// docs-lote — Tier S. Contrato { id, api, install }.
import { publishFeature } from '../../app/publish-feature.js';
import { installDocsLoteDelegation, docLoteModalSelecaoDoc, docsLote_getDocsArvore } from './view.js';
import './legacy-api.js';

export function installDocsLoteFeature() {
    installDocsLoteDelegation();
}

publishFeature({
    id: 'docs-lote',
    nsKey: 'docsLote',
    api: Object.freeze({
        openWizard: docLoteModalSelecaoDoc,
        getDocsArvore: docsLote_getDocsArvore
    }),
    install: installDocsLoteFeature
});

installDocsLoteFeature();
