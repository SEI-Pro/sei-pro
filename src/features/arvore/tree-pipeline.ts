/**
 * Pipeline de observação/enrichment da árvore do processo.
 * Owned by peer exclusive `arvore` — não pela capacidade `infoarvore`.
 */
import {
    TREE_IFRAME_BODY,
    TREE_READY_GATE,
    TREE_ANCHOR
} from '../../sei/selectors.js';
import type { TreeEnricher, TreeEnricherRegister } from './tree-enrichers.js';

export type TreePipelineFeature = TreeEnricher;

type ParentHost = Window & {
    SeiProReady?: Promise<unknown>;
    checkConfigValue?: (key: string) => boolean;
    verifyConfigValue?: (key: string) => boolean;
    CustomEvent: typeof CustomEvent;
};

type StubParent = {
    __stub: true;
    checkConfigValue: () => boolean;
    verifyConfigValue: () => boolean;
};

type PipelineCtx = {
    parent: ParentHost | StubParent;
    enabled: Record<string, boolean>;
};

export type TreeBootWindow = Window & typeof globalThis & {
    __SEI_PRO_TREE_BOOT__?: boolean;
    __SEI_PRO_TREE_PROCESSED_KEYS__?: Record<string, boolean>;
    SeiProTree?: {
        register: TreeEnricherRegister;
        features: TreePipelineFeature[];
        fetchPage?: (url: string) => Promise<Document>;
    };
    Nos?: Array<{ acoes?: string }>;
    name?: string;
    parent: ParentHost;
};

export type EnsureTreePipelineResult = {
    win: TreeBootWindow;
    doc: Document;
    register: TreeEnricherRegister;
    alreadyBooted: boolean;
};

function errMessage(e: unknown): string {
    return e instanceof Error ? e.message : String(e);
}

/**
 * Idempotent: first call owns `__SEI_PRO_TREE_BOOT__`, register API, observer and initial pipeline.
 * Peer features (e.g. infoarvore panel) MUST register before the readiness Promise resolves
 * (microtask) — install order `arvore` then `arvore-info` satisfies that.
 */
export function ensureTreePipeline(deps: {
    window?: Window & typeof globalThis;
    document?: Document;
}): EnsureTreePipelineResult | null {
    const win = (deps.window || (typeof window !== 'undefined' ? window : globalThis)) as TreeBootWindow;
    const doc = deps.document || (win && win.document);
    if (!win || !doc) return null;

    if (win.__SEI_PRO_TREE_BOOT__ && win.SeiProTree && typeof win.SeiProTree.register === 'function') {
        return {
            win,
            doc,
            register: win.SeiProTree.register.bind(win.SeiProTree) as TreeEnricherRegister,
            alreadyBooted: true
        };
    }

    win.__SEI_PRO_TREE_BOOT__ = true;

    const TAG = '[SeiProTree]';
    const DONE_ATTR = 'data-seipro-done';
    const PARENT_READY_TIMEOUT = 6000;
    const TREE_READY_TIMEOUT = 20000;

    function log(...args: unknown[]) { console.log(TAG, ...args); }
    function warn(...args: unknown[]) { console.warn(TAG, ...args); }
    function err(...args: unknown[]) { console.error(TAG, ...args); }

    function waitFor(
        name: string,
        predicate: () => Element | null,
        root: Node | null,
        timeoutMs: number
    ): Promise<Element> {
        return new Promise(function (resolve, reject) {
            const v = predicate();
            if (v) { log(name, 'ready (sync)'); return resolve(v); }
            let mo: MutationObserver;
            const timer = setTimeout(function () {
                mo.disconnect();
                err(name, 'timeout after', timeoutMs, 'ms');
                reject(new Error(name + ' timeout'));
            }, timeoutMs);
            mo = new MutationObserver(function () {
                const r = predicate();
                if (r) { clearTimeout(timer); mo.disconnect(); log(name, 'ready (observed)'); resolve(r); }
            });
            mo.observe(root || doc.documentElement, { childList: true, subtree: true });
        });
    }

    function treeReady() {
        return waitFor('treeReady', function () {
            const root = doc.querySelector(TREE_IFRAME_BODY);
            if (!root) return null;
            const gate = doc.querySelector(TREE_READY_GATE);
            if (gate && !gate.querySelector(TREE_ANCHOR)) return null;
            if (!root.querySelector(TREE_ANCHOR)) return null;
            return root;
        }, null, TREE_READY_TIMEOUT);
    }

    function stubParent(): StubParent {
        return {
            __stub: true,
            checkConfigValue: function () { return true; },
            verifyConfigValue: function () { return false; }
        };
    }

    function parentReady(): Promise<ParentHost | StubParent> {
        const start = Date.now();
        try {
            if (win.parent && win.parent.SeiProReady && typeof win.parent.SeiProReady.then === 'function') {
                return win.parent.SeiProReady.then(function () {
                    log('parentReady via SeiProReady promise after', Date.now() - start, 'ms');
                    return win.parent;
                });
            }
        } catch (e: unknown) {
            warn('parentReady cross-origin error, using stub:', errMessage(e));
            return Promise.resolve(stubParent());
        }

        try {
            if (win.parent && win.parent.document && !win.parent.document.getElementById('ifrArvore')) {
                log('parentReady: parent is not trabalhar context — using stub (silent degrade)');
                return Promise.resolve(stubParent());
            }
        } catch (_e) {
            log('parentReady: parent inaccessible (cross-origin) — using stub');
            return Promise.resolve(stubParent());
        }

        try {
            if (win.parent && typeof win.parent.checkConfigValue === 'function') {
                log('parentReady via checkConfigValue síncrono (sem SeiProReady, sem polling)');
                return Promise.resolve(win.parent);
            }
        } catch (e: unknown) {
            warn('parentReady cross-origin error, using stub:', errMessage(e));
            return Promise.resolve(stubParent());
        }

        warn('parent.SeiProReady missing — polling for checkConfigValue (250ms intervals, timeout=' + PARENT_READY_TIMEOUT + 'ms)');
        return new Promise(function (resolve) {
            (function probe() {
                try {
                    if (win.parent && typeof win.parent.checkConfigValue === 'function') {
                        log('parentReady via fallback probe after', Date.now() - start, 'ms');
                        return resolve(win.parent);
                    }
                } catch (e: unknown) {
                    warn('parentReady cross-origin in probe, using stub:', errMessage(e));
                    return resolve(stubParent());
                }
                if (Date.now() - start > PARENT_READY_TIMEOUT) {
                    warn('parentReady timeout after', PARENT_READY_TIMEOUT, 'ms — degrading to stub parent');
                    return resolve(stubParent());
                }
                setTimeout(probe, 250);
            })();
        });
    }

    const features: TreePipelineFeature[] = [];
    function register(feature: TreePipelineFeature) {
        if (!feature || !feature.id || typeof feature.enrich !== 'function') {
            err('register: invalid feature', feature);
            return;
        }
        features.push(feature);
    }
    win.SeiProTree = { register: register, features: features };

    const PROCESSED_KEYS = win.__SEI_PRO_TREE_PROCESSED_KEYS__
        || (win.__SEI_PRO_TREE_PROCESSED_KEYS__ = Object.create(null) as Record<string, boolean>);
    function hasDone(el: Element, id: string) {
        return ((el.getAttribute(DONE_ATTR) || '').split(' ').indexOf(id) !== -1);
    }
    function markDone(el: Element, id: string) {
        const cur = el.getAttribute(DONE_ATTR) || '';
        el.setAttribute(DONE_ATTR, cur ? cur + ' ' + id : id);
    }
    function anchorKey(el: Element | null) {
        if (!el) return '';
        return [
            el.getAttribute('id') || '',
            el.getAttribute('href') || '',
            el.getAttribute('target') || ''
        ].join('|');
    }
    function isProcessed(el: Element) {
        const key = anchorKey(el);
        return !!(key && PROCESSED_KEYS[key]);
    }
    function markProcessed(el: Element) {
        const key = anchorKey(el);
        if (key) PROCESSED_KEYS[key] = true;
    }

    function runPipeline(ctx: PipelineCtx, anchors: Element[], label?: string) {
        const applied: Record<string, number> = {};
        for (const f of features) {
            if (!ctx.enabled[f.id]) continue;
            applied[f.id] = 0;
        }
        for (const a of anchors) {
            if (isProcessed(a)) continue;
            for (const f2 of features) {
                if (!ctx.enabled[f2.id]) continue;
                if (hasDone(a, f2.id)) continue;
                try {
                    f2.enrich(a, ctx);
                    markDone(a, f2.id);
                    applied[f2.id] = (applied[f2.id] || 0) + 1;
                } catch (e) {
                    err('feature', f2.id, 'threw on', a.id, e);
                }
            }
            markProcessed(a);
        }
        log('pipeline', label || '', '— anchors:', anchors.length, 'applied:', applied);
    }

    function observeTree(root: Element, onBatch: (batch: Element[]) => void) {
        let pending = false;
        const queued = new Set<Element>();
        const mo = new MutationObserver(function (records) {
            for (const r of records) {
                for (const n of r.addedNodes) {
                    if (n.nodeType !== 1) continue;
                    const el = n as Element;
                    if (el.matches && el.matches(TREE_ANCHOR)) queued.add(el);
                    if (el.querySelectorAll) el.querySelectorAll(TREE_ANCHOR).forEach(function (a) { queued.add(a); });
                }
            }
            if (pending || queued.size === 0) return;
            pending = true;
            requestAnimationFrame(function () {
                pending = false;
                let batch = Array.from(queued); queued.clear();
                batch = batch.filter(function (a) { return !isProcessed(a); });
                if (batch.length === 0) return;
                log('observer batch —', batch.length, 'new anchor(s)');
                onBatch(batch);
            });
        });
        mo.observe(root, { childList: true, subtree: true });
        return mo;
    }

    Promise.all([treeReady(), parentReady()]).then(function (r) {
        const root = r[0];
        const parent = r[1];
        const enabled = features.reduce(function (acc: Record<string, boolean>, f) {
            try { acc[f.id] = f.enabled ? !!f.enabled(parent) : true; }
            catch (e) { err('feature.enabled threw for', f.id, e); acc[f.id] = false; }
            if (!acc[f.id]) log('feature disabled:', f.id);
            return acc;
        }, {});
        const ctx: PipelineCtx = { parent: parent, enabled: enabled };

        features.forEach(function (f) {
            if (ctx.enabled[f.id] && typeof f.initOnce === 'function') {
                try { f.initOnce.call(f, ctx); }
                catch (e) { err('initOnce threw for', f.id, e); }
            }
        });

        runPipeline(ctx, Array.from(root.querySelectorAll(TREE_ANCHOR)), 'initial');
        observeTree(root, function (batch) { runPipeline(ctx, batch, 'incremental'); });

        try {
            win.parent.dispatchEvent(new win.parent.CustomEvent('sei-pro-arvore-ready', {
                detail: {
                    href: win.location.href,
                    loop: false,
                    anchors: root.querySelectorAll(TREE_ANCHOR).length,
                    features: Object.keys(enabled).filter(function (k) { return enabled[k]; })
                }
            }));
        } catch (e: unknown) { warn('could not dispatch sei-pro-arvore-ready:', errMessage(e)); }
    }).catch(function (e: unknown) { err('boot aborted:', errMessage(e)); });

    return { win, doc, register, alreadyBooted: false };
}
