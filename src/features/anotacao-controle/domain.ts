// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Domínio PURO da feature "Mostrar anotação do processo na tela de controle de
 * processos" (config `mostraranotacaocontrole`).
 *
 * Sem DOM, sem jQuery, sem chrome.*. O parsing/normalização do texto vive em
 * core/sticknote.js (compartilhado); aqui ficam os bits puros específicos da
 * VIEW desta feature: classes de checklist e montagem do HTML escapado do
 * tooltip. Renderização real (inserir células, ler atributos) fica na view.
 */
import {
    normalizeSticknoteHomeText,
    parseSticknoteChecklistLine,
    parseSticknoteHomeLabel
} from '../../shared/sticknote/domain.js';
import { normalizeMojibakeUtf8 } from '../../core/texto.js';

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

// Converte os atributos legados do link em dados canônicos, sem depender de DOM.
// A view continua responsável apenas por ler os atributos do elemento.
export function parseSticknoteHomeAttributes(ariaLabel, onmouseover) {
    if (ariaLabel) {
        var parsed = parseSticknoteHomeLabel(ariaLabel);
        if (parsed) {
            return { text: normalizeMojibakeUtf8(parsed.text), user: normalizeMojibakeUtf8(parsed.user) };
        }
    }
    var tooltip = (onmouseover != null) ? onmouseover.split("'") : false;
    if (tooltip) {
        return {
            text: normalizeMojibakeUtf8(tooltip[1] || ''),
            user: normalizeMojibakeUtf8(tooltip[3] || '')
        };
    }
    return false;
}

// Renderiza o HTML puro da anotação para o card inline. A transformação de texto
// legada é recebida como dependência para manter este helper sem window/DOM.
export function buildSticknoteCardHtml(value, replaceText) {
    value = normalizeSticknoteHomeText(value);
    if (value === '') return '';
    var transform = (typeof replaceText === 'function') ? replaceText : function (text) { return text; };
    if (value.indexOf('\n') === -1) {
        var single = parseSticknoteChecklistLine(value);
        return '<div' + sticknoteChecklistClass(single) + '>' + transform(single.text) + '</div>';
    }
    var result = '';
    value.split('\n').forEach(function (line, i) {
        if (line !== '') {
            var item = parseSticknoteChecklistLine(line);
            result += '<div' + sticknoteChecklistClass(item) + '>' + transform(item.text) + '</div>';
        } else if (i !== 0 || i !== value.length - 1) {
            result += '<div><br></div>';
        }
    });
    return result;
}
