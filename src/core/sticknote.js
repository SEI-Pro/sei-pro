import { aliasGlobal, getSeiPro } from './global.js';
import { normalizeMojibakeUtf8 } from './texto.js';

/**
 * Núcleo PURO da feature "Mostrar anotação do processo na tela de controle de
 * processos" (config `mostraranotacaocontrole`) — extraído de sei-pro.js (Fase 6).
 *
 * Cobre o parsing do rótulo/tooltip da anotação (sticknote) e a normalização do
 * texto da anotação. A camada de DOM da feature (varredura das tabelas de
 * processos, montagem de HTML/células, AJAX de prioridade, render inline)
 * permanece em sei-pro.js e chama este core. Sem DOM, jQuery ou estado próprio.
 *
 * Dependências: normalizeMojibakeUtf8 (core/texto, import modular).
 */

// Extrai {text, user} do rótulo "Anotação / <texto> / <usuário> em DD/MM/YYYY HH:MM".
// Retorna false quando o rótulo não casa o formato esperado.
export function parseSticknoteHomeLabel(label) {
    label = normalizeMojibakeUtf8(label);
    label = (typeof label === 'string') ? label : '';
    if (!label) {
        return false;
    }
    // O separador texto/usuário exige espaço dos DOIS lados (`\s+\/\s+`): o
    // formato do SEI é "Anotação / <texto> / <usuário> em ...". Usar `\s*` (espaço
    // opcional) fazia a barra INTERNA de uma data casar como separador — uma
    // anotação "25/06/2026" era truncada em texto="25", usuário="06/2026 / ...".
    var match = label.match(/^Anota(?:ç|c)(?:ã|a)o\s*\/\s*([\s\S]*?)\s+\/\s+(.*?)\s+em\s+\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}$/i);
    if (!match) {
        return false;
    }
    return {
        text: match[1].trim(),
        user: match[2].trim()
    };
}

// Normaliza o texto da anotação: unifica quebras de linha, remove NBSP, colapsa
// linhas em branco excessivas e apara as bordas.
//
// Trata tanto quebras reais (\r, \n, \r\n) quanto as sequências ESCAPADAS
// literais ("\\r\\n", "\\n", "\\r") — porque parte do texto chega de dentro do
// atributo `onmouseover` da linha (uma string JS escapada), onde a quebra vem
// como os dois caracteres barra-invertida + "n", não como newline de verdade.
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

// Interpreta UMA linha da anotação como item de checklist no formato do SEI Pro:
// "[ ] tarefa" (pendente) ou "[X] tarefa" (concluída). Retorna a estrutura PURA
// (sem HTML), deixando a renderização (ícone / classe CSS / risco) para a camada
// de DOM. `checked` tem precedência sobre `[ ]` quando ambos aparecem.
//   { isItem: bool, checked: bool, text: string }
// Para linhas que não são item, `text` é a linha original; para itens, é a linha
// sem o marcador e aparada.
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

    // Aliases dos nomes legados da página (sei-pro.js).
    aliasGlobal('parseSticknoteHomeLabel', parseSticknoteHomeLabel);
    aliasGlobal('normalizeSticknoteHomeText', normalizeSticknoteHomeText);
    aliasGlobal('parseSticknoteChecklistLine', parseSticknoteChecklistLine);

    return sticknote;
}
