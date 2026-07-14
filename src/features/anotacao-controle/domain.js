/**
 * Domínio PURO da feature "Mostrar anotação do processo na tela de controle de
 * processos" (config `mostraranotacaocontrole`).
 *
 * Sem DOM, sem jQuery, sem chrome.*. O parsing/normalização do texto vive em
 * core/sticknote.js (compartilhado); aqui ficam os bits puros específicos da
 * VIEW desta feature: classes de checklist e montagem do HTML escapado do
 * tooltip. Renderização real (inserir células, ler atributos) fica na view.
 */
import { normalizeSticknoteHomeText, parseSticknoteChecklistLine } from '../../core/sticknote.js';

// Monta o registro puro que a lista legada persiste em `arraySticknoteHome`.
// Centraliza a forma do payload e a normalização final do texto antes de sair da
// feature, sem levar DOM, storage ou jQuery para o domínio.
export function buildSticknoteHomeRecord(id_protocolo, texttip, usertip) {
    if (!id_protocolo) {
        return false;
    }
    return {
        id_protocolo: id_protocolo,
        usertip: (typeof usertip === 'string') ? usertip : '',
        texttip: normalizeSticknoteHomeText(texttip)
    };
}

// Classe CSS do item de checklist na renderização inline do card.
export function sticknoteChecklistClass(item) {
    if (!item.isItem) {
        return '';
    }
    return item.checked ? ' class="stickNoteCheck stickNoteChecked"' : ' class="stickNoteCheck"';
}

// HTML do tooltip da anotação (linha a linha), ESCAPADO para caber dentro do
// atributo `onmouseover="...infraTooltipMostrar(<html>)"` — por isso as aspas
// vêm como \\" (a string é re-parseada pelo SEI ao montar o tooltip nativo).
export function buildChecklistTooltipHtml(texttip) {
    return texttip.split('\n').map(function (v) {
        if (v === '') {
            return v;
        }
        var item = parseSticknoteChecklistLine(v);
        if (!item.isItem) {
            return v;
        }
        var icon = item.checked ? '<i class=\\"fas fa-check-square\\"></i> ' : '<i class=\\"far fa-square\\"></i> ';
        var style = item.checked ? ' style=\\"text-decoration: line-through;\\"' : '';
        return '<div' + style + '>' + icon + item.text + '</div>';
    }).join('');
}
