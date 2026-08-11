/**
 * Safe status / muted placeholders for the infoarvore panel (textContent only).
 */

export function clearChildren(el: Element | null | undefined): void {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
}

/** Replace body contents with a muted status span (loading / empty / unavailable). */
export function setMutedStatus(el: Element | null | undefined, text: string): HTMLSpanElement | null {
    if (!el) return null;
    clearChildren(el);
    const span = el.ownerDocument.createElement('span');
    span.className = 'seipro-infoarvore-muted';
    span.textContent = text;
    el.appendChild(span);
    return span;
}

/** Replace body contents with an alert-style failure message. */
export function setFailedStatus(el: Element | null | undefined, text: string): HTMLSpanElement | null {
    if (!el) return null;
    clearChildren(el);
    const span = el.ownerDocument.createElement('span');
    span.className = 'infoAlerta seipro-infoarvore-status-failed';
    span.textContent = text;
    el.appendChild(span);
    return span;
}

/** Snapshot children for later restore (cancel / submit failure). */
export function snapshotChildren(el: Element): Node[] {
    return Array.from(el.childNodes).map(function (n) {
        return n.cloneNode(true);
    });
}

export function restoreChildren(el: Element, nodes: Node[]): void {
    clearChildren(el);
    nodes.forEach(function (n) {
        el.appendChild(n.cloneNode(true));
    });
}

export function createFaIcon(doc: Document, className: string): HTMLElement {
    const i = doc.createElement('i');
    i.className = className;
    return i;
}
