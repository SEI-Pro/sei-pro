/**
 * Utilitários de cursor (caret) para o editor de Anotação contenteditable.
 */
export type CaretDeps = {
    doc: Document;
    win: Window & typeof globalThis;
};

export function createCaret(deps: CaretDeps) {
    const doc = deps.doc;
    const win = deps.win;

    function placeCaretAtEnd(el: HTMLElement) {
        el.focus();
        const range = doc.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = win.getSelection();
        if (!sel) return;
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function getCaretCharOffset(el: HTMLElement): number | null {
        try {
            const sel = win.getSelection();
            if (!sel || !sel.rangeCount) return null;
            const r = sel.getRangeAt(0);
            if (!el.contains(r.startContainer)) return null;
            const lines = Array.prototype.slice.call(el.children) as HTMLElement[];
            if (!lines.length) {
                if (r.startContainer.nodeType === 3) return r.startOffset;
                return (el.textContent || '').length;
            }
            let count = 0;
            for (let i = 0; i < lines.length; i++) {
                if (i > 0) count += 1;
                const lineDiv = lines[i]!;
                const inThisLine = lineDiv === r.startContainer || lineDiv.contains(r.startContainer);
                if (!inThisLine) { count += (lineDiv.textContent || '').length; continue; }
                if (r.startContainer === lineDiv) {
                    for (let c = 0; c < r.startOffset && c < lineDiv.childNodes.length; c++) {
                        count += (lineDiv.childNodes[c]!.textContent || '').length;
                    }
                    return count;
                }
                const walker = doc.createTreeWalker(lineDiv, NodeFilter.SHOW_TEXT);
                let node: Node | null;
                while ((node = walker.nextNode())) {
                    if (node === r.startContainer) return count + r.startOffset;
                    count += (node.nodeValue || '').length;
                }
                return count;
            }
            return count;
        } catch {
            return null;
        }
    }

    function setCaretCharOffset(el: HTMLElement, target: number | null | undefined) {
        if (target == null || target < 0) { placeCaretAtEnd(el); return; }
        el.focus();
        try {
            const lines = Array.prototype.slice.call(el.children) as HTMLElement[];
            if (!lines.length) { placeCaretAtEnd(el); return; }
            let count = 0;
            for (let i = 0; i < lines.length; i++) {
                if (i > 0) count += 1;
                const lineDiv = lines[i]!;
                const lineLen = (lineDiv.textContent || '').length;
                if (target <= count + lineLen) {
                    const within = target - count;
                    const walker = doc.createTreeWalker(lineDiv, NodeFilter.SHOW_TEXT);
                    let node: Node | null;
                    let acc = 0;
                    while ((node = walker.nextNode())) {
                        const len = (node.nodeValue || '').length;
                        if (within <= acc + len) {
                            const range = doc.createRange();
                            range.setStart(node, within - acc);
                            range.collapse(true);
                            const sel = win.getSelection();
                            if (!sel) return;
                            sel.removeAllRanges();
                            sel.addRange(range);
                            return;
                        }
                        acc += len;
                    }
                    const r2 = doc.createRange();
                    r2.selectNodeContents(lineDiv);
                    r2.collapse(true);
                    const s2 = win.getSelection();
                    if (!s2) return;
                    s2.removeAllRanges();
                    s2.addRange(r2);
                    return;
                }
                count += lineLen;
            }
            placeCaretAtEnd(el);
        } catch {
            placeCaretAtEnd(el);
        }
    }

    return {
        placeCaretAtEnd: placeCaretAtEnd,
        getCaretCharOffset: getCaretCharOffset,
        setCaretCharOffset: setCaretCharOffset
    };
}
