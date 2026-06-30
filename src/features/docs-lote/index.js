// docs-lote — ENTRY do bundle ESM "Enviar Múltiplos Documentos Externos"
// (config `documentosemlote`). Reescrita estruturada isolated-world:
//   domain.js  — lógica pura (regex/interpolação/cruzamento/serialização) + testes
//   state.js   — estado mutável do wizard (antes eram var globais)
//   io.js      — scraping/POSTs ao SEI (jQuery na transição), progresso via callback
//   view.js    — 6 diálogos jQuery UI + delegação (sem onchange/onclick inline nossos)
//   legacy-api — única ponte global (aliasGlobal) p/ os call-sites legados
//
// A feature não auto-executa: o ponto de entrada (docLoteModalSelecaoDoc) é disparado
// pelo legado quando o usuário clica no ícone "documentos em lote". Aqui só instalamos
// a delegação de eventos uma vez e registramos a compat global.

import { getSeiPro } from '../../core/global.js';
import { installDocsLoteDelegation, docLoteModalSelecaoDoc, docsLote_getDocsArvore } from './view.js';
import './legacy-api.js'; // único ponto com aliasGlobal

const docsLote = getSeiPro().features.docsLote || (getSeiPro().features.docsLote = {});
docsLote.openWizard = docLoteModalSelecaoDoc;
docsLote.getDocsArvore = docsLote_getDocsArvore;

installDocsLoteDelegation();
