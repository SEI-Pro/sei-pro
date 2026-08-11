/**
 * Enrichers de nós da árvore que NÃO pertencem à capacidade `infoarvore`.
 * Vivem em `arvore` (peer exclusive); o pipeline de `SeiProTree.register` os instala
 * para timing correto junto ao boot da árvore.
 */
export type TreeEnricher = {
    id: string;
    enabled?: (parent: unknown) => boolean;
    initOnce?: (this: TreeEnricher, ctx?: unknown) => void;
    enrich: (this: TreeEnricher, anchor: Element, ctx?: unknown) => void;
    _counter?: number;
};

export type TreeEnricherRegister = (feature: TreeEnricher) => void;

export type TreeEnricherDeps = {
    register: TreeEnricherRegister;
    doc: Document;
};

/**
 * Registra enrichers de outras chaves (`duaslinhas`, `numerar_documentos`, `urgente`, `tag`).
 */
export function installTreeEnrichers(deps: TreeEnricherDeps): void {
    const { register, doc } = deps;

    register({
        id: 'duaslinhas',
        enabled: function (p: unknown) {
            const parent = p as { verifyConfigValue?: (k: string) => boolean };
            return typeof parent.verifyConfigValue === 'function' && parent.verifyConfigValue('duaslinhas');
        },
        enrich: function (a) {
            if (a.nextElementSibling && a.nextElementSibling.classList.contains('breackline_doc')) return;
            const text = (a.textContent || '').trim();
            const idx = text.lastIndexOf(' ');
            if (idx === -1) return;
            const tail = text.slice(idx + 1);
            if (!tail) return;
            const span = doc.createElement('span');
            span.className = 'breackline_doc';
            const br = doc.createElement('br');
            const inner = doc.createElement('span');
            inner.className = 'seipro-duaslinhas-tail';
            inner.textContent = tail;
            span.appendChild(br);
            span.appendChild(inner);
            a.textContent = text.slice(0, idx);
            if (a.parentNode) a.parentNode.insertBefore(span, a.nextSibling);
        }
    });

    register({
        id: 'numerar_documentos',
        enabled: function (p: unknown) {
            const parent = p as { verifyConfigValue?: (k: string) => boolean };
            return typeof parent.verifyConfigValue === 'function' && parent.verifyConfigValue('numerar_documentos');
        },
        initOnce: function () { this._counter = 0; },
        enrich: function (a) {
            if (a.previousElementSibling && a.previousElementSibling.classList.contains('numericDocsPro')) return;
            this._counter = (this._counter || 0) + 1;
            const span = doc.createElement('span');
            span.className = 'numericDocsPro';
            span.setAttribute('data-count', String(this._counter));
            span.textContent = this._counter + '. ';
            span.classList.add('seipro-numeric-docs');
            if (a.parentNode) a.parentNode.insertBefore(span, a);
        }
    });

    register({
        id: 'urgente',
        enabled: function () { return true; },
        enrich: function (a) {
            if ((a.textContent || '').indexOf('(URGENTE)') === -1) return;
            a.classList.add('urgentePro');
            if (a.querySelector('div.urgentePro')) return;
            const d = doc.createElement('div');
            d.className = 'urgentePro';
            a.insertBefore(d, a.firstChild);
        }
    });

    register({
        id: 'tag',
        enrich: function (a) { a.classList.add('seipro-tagged'); }
    });
}
