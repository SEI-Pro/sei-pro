// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { aliasGlobal, getSeiPro } from './global.js';

/**
 * Opções da extensão guardadas no objeto `optionsPro` (web storage local).
 * Origem: dist/js/sei-functions-pro.js. Porte verbatim, SEM jQuery
 * ($.isEmptyObject → isEmptyObjectPro, mesma semântica for-in).
 *
 * Delega o storage à camada webstore (SeiPro.core.webstore), instalada antes.
 */
export function installOptions() {
    function ws() { return getSeiPro().core.webstore; }

    // Equivalente a $.isEmptyObject: for-in retorna false na 1ª chave enumerável;
    // em null/undefined/false/number não itera → true (igual ao jQuery).
    function isEmptyObjectPro(obj) {
        for (var name in obj) return false; // eslint-disable-line no-unused-vars
        return true;
    }

    function verifyOptionsPro(item) {
        var option = ws().localStorageRestorePro('optionsPro');
        if (typeof option !== 'undefined') {
            if (!isEmptyObjectPro(option) && typeof option[item] !== 'undefined' && option[item] !== null) {
                return true;
            }
            return false;
        }
        return false;
    }

    function getOptionsPro(item) {
        updateOptionsPro(item);
        var option = ws().localStorageRestorePro('optionsPro');
        if (typeof option !== 'undefined' && !isEmptyObjectPro(option) && typeof option[item] !== 'undefined' && option[item] !== null) {
            return option[item];
        }
        return false;
    }

    function setOptionsPro(item, value) {
        var option = ws().localStorageRestorePro('optionsPro');
        if (typeof option !== 'undefined') {
            if (isEmptyObjectPro(option)) {
                option = { [item]: value };
            } else {
                option[item] = value;
            }
            ws().localStorageStorePro('optionsPro', option);
            return true;
        }
        return false;
    }

    function removeOptionsPro(item) {
        var option = ws().localStorageRestorePro('optionsPro');
        if (typeof option !== 'undefined' && !isEmptyObjectPro(option) && option[item] !== null) {
            delete option[item];
            ws().localStorageStorePro('optionsPro', option);
        }
        return true;
    }

    // Migra uma chave antiga de top-level (localStorage) para dentro de optionsPro.
    function updateOptionsPro(item) {
        var oldOption = ws().localStorageRestorePro(item);
        if (typeof oldOption !== 'undefined' && oldOption !== null) {
            setOptionsPro(item, oldOption);
            ws().localStorageRemovePro(item);
        }
    }

    const options = { verifyOptionsPro, getOptionsPro, setOptionsPro, removeOptionsPro, updateOptionsPro };
    getSeiPro().core.options = options;

    aliasGlobal('verifyOptionsPro', verifyOptionsPro);
    aliasGlobal('getOptionsPro', getOptionsPro);
    aliasGlobal('setOptionsPro', setOptionsPro);
    aliasGlobal('removeOptionsPro', removeOptionsPro);
    aliasGlobal('updateOptionsPro', updateOptionsPro);

    return options;
}
