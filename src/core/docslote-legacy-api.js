// docs-lote — ponte temporária dos mapas globais legados.
// TODO: remover quando consumidores externos dos mapas forem definitivamente
// descartados; a implementação permanece em core/docslote.js.
import { aliasGlobal } from './global.js';
import {
    docsLoteSpecialChars,
    docsLoteNormalCharsUtf8,
    docsLoteNormalCharsIso
} from './docslote.js';

export function installDocsLoteLegacyApi() {
    aliasGlobal('docsLote_specialChars', docsLoteSpecialChars);
    aliasGlobal('docsLote_normalChars_utf8', docsLoteNormalCharsUtf8);
    aliasGlobal('docsLote_normalChars_iso', docsLoteNormalCharsIso);
}