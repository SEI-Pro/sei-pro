// docs-lote — ponte temporária dos mapas globais legados.
// TODO: remover quando consumidores externos dos mapas forem descartados.
import { aliasGlobal } from '../core/global.js';
import {
    docsLoteSpecialChars,
    docsLoteNormalCharsUtf8,
    docsLoteNormalCharsIso,
    installDocsLote
} from './docslote.js';

export function installDocsLoteLegacyApi() {
    installDocsLote();
    aliasGlobal('docsLote_specialChars', docsLoteSpecialChars);
    aliasGlobal('docsLote_normalChars_utf8', docsLoteNormalCharsUtf8);
    aliasGlobal('docsLote_normalChars_iso', docsLoteNormalCharsIso);
}
