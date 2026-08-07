// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { aliasGlobal, globalRef } from '../../core/global.js';
import {
    extractGroupTableTooltipToArray,
    getTagName
} from './domain.js';
import {
    clearGroupCollapsed,
    persistGroupCollapsed
} from './io.js';
import { toggleGroupTable } from './view.js';

// Ponte temporária: sei-pro.js continua chamando os nomes globais legados.
export function installListaAgrupamentoLegacyApi() {
    aliasGlobal('extractGroupTableTooltipToArray', extractGroupTableTooltipToArray);
    aliasGlobal('getTagName', getTagName);

    // A fachada legada permanece global, mas a implementação de view já não é
    // redefinida no monólito `sei-pro.js`.
    function toggleGroupTableLegacy(this_) {
        return toggleGroupTable(
            this_,
            globalRef.$ || globalRef.jQuery,
            (tagName) => persistGroupCollapsed(globalRef.setOptionsPro, tagName),
            (tagName) => clearGroupCollapsed(globalRef.removeOptionsPro, tagName)
        );
    }

    aliasGlobal('toggleGroupTablePro', toggleGroupTableLegacy);
}
