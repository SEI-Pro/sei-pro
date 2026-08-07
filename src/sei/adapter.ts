// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { getSeiPro } from '../core/global.js';
import { resolveSelectors } from './selectors.js';

export function installAdapter() {
    function flags() {
        return getSeiPro().sei.version.resolveVersionFlags();
    }

    function selectors(isNewSEI, version) {
        const isAtLeast = getSeiPro().sei.version.isAtLeast;
        return resolveSelectors(!!isNewSEI, version, isAtLeast);
    }

    function isNewSEI() {
        return !!flags().isNewSEI;
    }

    function isSEI5() {
        const f = flags();
        return getSeiPro().sei.version.isSEI5(f.isNewSEI, f.version);
    }

    function atLeast(target) {
        return getSeiPro().sei.version.isAtLeast(flags().version, target);
    }

    function pick(novo, legado) {
        return isNewSEI() ? novo : legado;
    }

    const adapter = {
        flags,
        selectors,
        isNewSEI,
        isSEI5,
        atLeast,
        pick,
        divInformacao: function () {
            return selectors(flags().isNewSEI, flags().version).divInformacao;
        },
        mainMenu: function () {
            return selectors(flags().isNewSEI, flags().version).mainMenu;
        },
        frmEditor: function () {
            return selectors(flags().isNewSEI, flags().version).frmEditor;
        }
    };

    getSeiPro().sei.adapter = adapter;
    return adapter;
}
