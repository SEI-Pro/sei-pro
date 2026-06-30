// docs-lote — PONTE DE COMPATIBILIDADE: único arquivo da feature com aliasGlobal
// (regra DEVELOPMENT.md). Expõe como globais os pontos de entrada que o legado ainda
// chama no mesmo mundo isolado:
//   - sei-functions-pro.js:10455  → docLoteModalSelecaoDoc()   (abre o wizard)
//   - sei-functions-pro.js:1742   → docsLote_getDocsArvore(...) (recarrega selects)
//
// TODO: remover quando os call-sites em sei-functions-pro.js forem migrados.
import { aliasGlobal } from '../../core/global.js';
import { docLoteModalSelecaoDoc, docsLote_getDocsArvore } from './view.js';

aliasGlobal('docLoteModalSelecaoDoc', docLoteModalSelecaoDoc);
aliasGlobal('docsLote_getDocsArvore', docsLote_getDocsArvore);
