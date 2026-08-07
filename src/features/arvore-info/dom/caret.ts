// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Utilitários de cursor (caret) para o editor de Anotação contenteditable.
 * Extraídos do boot (Etapa D). Fábrica injeta { doc, win }; funções operam sobre
 * o elemento passado. VERBATIM do legado.
 *
 * O offset é em CARACTERES independente do DOM (quebra entre <div> conta 1 char),
 * para sobreviver à reconstrução do editor no auto-save em vez de pular pro fim.
 */
export function createCaret(deps) {
    var doc = deps.doc;
    var win = deps.win;

    function placeCaretAtEnd(el) {
        el.focus();
        var range = doc.createRange(); range.selectNodeContents(el); range.collapse(false);
        var sel = win.getSelection(); sel.removeAllRanges(); sel.addRange(range);
    }

    function getCaretCharOffset(el) {
        try {
            var sel = win.getSelection();
            if (!sel || !sel.rangeCount) return null;
            var r = sel.getRangeAt(0);
            if (!el.contains(r.startContainer)) return null;
            var lines = Array.prototype.slice.call(el.children);
            if (!lines.length) {
                // Flat editor: count text up to caret directly.
                if (r.startContainer.nodeType === 3) return r.startOffset;
                return (el.textContent || '').length;
            }
            var count = 0;
            for (var i = 0; i < lines.length; i++) {
                if (i > 0) count += 1; // newline between lines
                var lineDiv = lines[i];
                var inThisLine = lineDiv === r.startContainer || lineDiv.contains(r.startContainer);
                if (!inThisLine) { count += (lineDiv.textContent || '').length; continue; }
                if (r.startContainer === lineDiv) {
                    for (var c = 0; c < r.startOffset && c < lineDiv.childNodes.length; c++) {
                        count += (lineDiv.childNodes[c].textContent || '').length;
                    }
                    return count;
                }
                var walker = doc.createTreeWalker(lineDiv, NodeFilter.SHOW_TEXT, null, false);
                var node;
                while ((node = walker.nextNode())) {
                    if (node === r.startContainer) return count + r.startOffset;
                    count += node.nodeValue.length;
                }
                return count;
            }
            return count;
        } catch (e) { return null; }
    }

    function setCaretCharOffset(el, target) {
        if (target == null || target < 0) { placeCaretAtEnd(el); return; }
        el.focus();
        try {
            var lines = Array.prototype.slice.call(el.children);
            if (!lines.length) { placeCaretAtEnd(el); return; }
            var count = 0;
            for (var i = 0; i < lines.length; i++) {
                if (i > 0) count += 1; // newline between lines
                var lineDiv = lines[i];
                var lineLen = (lineDiv.textContent || '').length;
                if (target <= count + lineLen) {
                    var within = target - count;
                    var walker = doc.createTreeWalker(lineDiv, NodeFilter.SHOW_TEXT, null, false);
                    var node, acc = 0;
                    while ((node = walker.nextNode())) {
                        var len = node.nodeValue.length;
                        if (within <= acc + len) {
                            var range = doc.createRange();
                            range.setStart(node, within - acc); range.collapse(true);
                            var sel = win.getSelection(); sel.removeAllRanges(); sel.addRange(range);
                            return;
                        }
                        acc += len;
                    }
                    // Empty line / no text node: collapse at line start.
                    var r2 = doc.createRange(); r2.selectNodeContents(lineDiv); r2.collapse(true);
                    var s2 = win.getSelection(); s2.removeAllRanges(); s2.addRange(r2);
                    return;
                }
                count += lineLen;
            }
            placeCaretAtEnd(el);
        } catch (e) { placeCaretAtEnd(el); }
    }

    return { placeCaretAtEnd: placeCaretAtEnd, getCaretCharOffset: getCaretCharOffset, setCaretCharOffset: setCaretCharOffset };
}
