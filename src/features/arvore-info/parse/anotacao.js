/**
 * Regras PURAS de checklist da Anotação (round-trip texto-plano ↔ DOM).
 * A leitura/escrita do contenteditable fica na view; aqui só os marcadores.
 *
 * Atenção: aqui o marcador é reconhecido SÓ no INÍCIO da linha (prefixo),
 * diferente de core `parseSticknoteChecklistLine` (que aceita em qualquer
 * posição). Por isso é uma função própria — semântica preservada VERBATIM.
 */

// Remove um marcador de checklist no início do texto: "[ ] " ou "[X] ".
export function stripChecklistMarker(text) {
    var t = (typeof text === 'string') ? text : '';
    return t.replace(/^\[[ X]\]\s*/, '');
}

// Interpreta o PREFIXO da linha (posição 0). Retorna { check, checked, rest }:
//   "[X] ..." → check:true, checked:true ; "[ ] ..." → check:true, checked:false
//   sem prefixo → check:false, checked:false, rest = linha original.
export function parseAnotLinePrefix(raw) {
    var r = (typeof raw === 'string') ? raw : '';
    if (r.indexOf('[X]') === 0) return { check: true, checked: true, rest: r.slice(3).trim() };
    if (r.indexOf('[ ]') === 0) return { check: true, checked: false, rest: r.slice(3).trim() };
    return { check: false, checked: false, rest: r };
}
