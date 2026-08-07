// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { getSeiPro } from '../../core/global.js';
import { normalizeMojibakeUtf8 } from '../../core/texto.js';

/**
 * Núcleo PURO de parsing de anotação (sticknote) na lista de processos.
 * Sem DOM, jQuery ou estado próprio. Antes vivia em core/; agora em shared/.
 */

export function parseSticknoteHomeLabel(label) {
    label = normalizeMojibakeUtf8(label);
    label = (typeof label === 'string') ? label : '';
    if (!label) {
        return false;
    }
    var match = label.match(/^Anota(?:ç|c)(?:ã|a)o\s*\/\s*([\s\S]*?)\s+\/\s+(.*?)\s+em\s+\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}$/i);
    if (!match) {
        return false;
    }
    return {
        text: match[1].trim(),
        user: match[2].trim()
    };
}

export function normalizeSticknoteHomeText(value) {
    value = (typeof value === 'string') ? value : '';
    return value
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\n')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\u00a0/g, ' ')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

export function parseSticknoteChecklistLine(line) {
    line = (typeof line === 'string') ? line : '';
    var hasUnchecked = line.indexOf('[ ]') !== -1;
    var checked = line.indexOf('[X]') !== -1;
    var isItem = hasUnchecked || checked;
    var text = line;
    if (checked) {
        text = line.replace('[X]', '').trim();
    } else if (hasUnchecked) {
        text = line.replace('[ ]', '').trim();
    }
    return { isItem: isItem, checked: checked, text: text };
}

export function installSticknote() {
    const sticknote = {
        parseSticknoteHomeLabel,
        normalizeSticknoteHomeText,
        parseSticknoteChecklistLine
    };
    getSeiPro().core.sticknote = sticknote;
    return sticknote;
}
