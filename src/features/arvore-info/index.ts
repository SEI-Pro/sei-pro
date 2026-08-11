/**
 * Feature "Informações adicionais na árvore do processo" (config `infoarvore`).
 * Panel-only composition: tree observation/enrichment pipeline is owned by peer `arvore`.
 */
import { extractNosAcoesHtml } from './parse/inline-payload.js';
import { createIo } from './io.js';
import { forceTrueConfirm } from './dom/confirm.js';
import { createInfoArvorePanelFeature } from './panel.js';
import { normalizeMojibakeUtf8 } from '../../core/texto.js';
import { ensureTreePipeline, type TreeBootWindow } from '../arvore/tree-pipeline.js';

export type InstallArvoreInfoDeps = {
    window?: Window & typeof globalThis;
    document?: Document;
};

export function installArvoreInfo(deps: InstallArvoreInfoDeps = {}): void {
    // Prefer pipeline already started by `arvore` (registry order). Fallback boots without
    // re-installing peer enrichers if somehow infoarvore runs alone.
    let pipeline = ensureTreePipeline({
        window: deps.window,
        document: deps.document
    });
    if (!pipeline) return;

    const { win, doc, register } = pipeline;
    const treeWin = win as TreeBootWindow;

    const TAG = '[SeiProTree]';
    function log(...args: unknown[]) { console.log(TAG, ...args); }
    function warn(...args: unknown[]) { console.warn(TAG, ...args); }
    function err(...args: unknown[]) { console.error(TAG, ...args); }

    function reportContext() {
        const ctx = { url: '', frame: '', idProc: '', host: '' };
        try {
            const w = treeWin as Window;
            ctx.url = ((treeWin.location && treeWin.location.href) || '').split('?')[0] ?? '';
            ctx.frame = (treeWin.name || '') || (w === w.top ? 'top' : 'iframe');
            ctx.host = (treeWin.location && treeWin.location.hostname) || '';
            const m = ((treeWin.location && treeWin.location.href) || '').match(/[?&]id_procedimento=(\d+)/);
            ctx.idProc = m?.[1] ?? '';
        } catch (_e) { /* ignore */ }
        return ctx;
    }
    function report(reason: string, detail?: unknown) {
        const ctx = reportContext();
        const detailStr = detail !== undefined
            ? ' | detail=' + (typeof detail === 'string' ? detail : JSON.stringify(detail))
            : '';
        console.error(TAG, '[REPORT]', reason, '| ctx=' + JSON.stringify(ctx) + detailStr);
    }

    const io = createIo({ win: treeWin, log: log, warn: warn, err: err });
    const fetchPage = io.fetchPage;
    const invalidatePage = io.invalidatePage;
    const submitForm = io.submitForm;
    if (treeWin.SeiProTree) treeWin.SeiProTree.fetchPage = fetchPage;

    let _toolbarLinksCache: Array<{ name: string; url: string }> | null = null;
    function collectToolbarLinksFromRoot(root: ParentNode, links: Array<{ name: string; url: string }>) {
        const anchors = root.querySelectorAll('a[href*="controlador.php?acao="]');
        for (const anchor of anchors) {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') continue;
            const img = anchor.querySelector('img');
            links.push({ name: img ? (img.getAttribute('title') || '') : '', url: href });
        }
    }
    function getToolbarLinks() {
        if (_toolbarLinksCache) return _toolbarLinksCache;
        const links: Array<{ name: string; url: string }> = [];
        const scripts = doc.querySelectorAll('script:not([src])');
        for (const script of scripts) {
            const t = script.textContent || '';
            const html = extractNosAcoesHtml(t);
            if (html === null) continue;
            const parsed = new DOMParser().parseFromString(html, 'text/html');
            collectToolbarLinksFromRoot(parsed, links);
            break;
        }
        if (!links.length && treeWin.Nos && treeWin.Nos[0] && treeWin.Nos[0].acoes) {
            const parsed2 = new DOMParser().parseFromString(treeWin.Nos[0].acoes, 'text/html');
            collectToolbarLinksFromRoot(parsed2, links);
            if (links.length) log('toolbar links from window.Nos fallback:', links.length);
        }
        if (!links.length) {
            report('getToolbarLinks: no action links found — Nos[0].acoes missing or unparseable. Panel sections depending on toolbar links will show "(indisponível)".');
        }
        _toolbarLinksCache = links;
        log('toolbar links parsed:', links.length);
        return links;
    }
    function findToolbarLink(hrefFragment: string) {
        const links = getToolbarLinks();
        for (const link of links) {
            if (link.url && link.url.indexOf(hrefFragment) !== -1) return link.url;
        }
        const a = doc.querySelector('a[href*="' + hrefFragment + '"]') as HTMLAnchorElement | null;
        return a ? a.href : null;
    }

    register(createInfoArvorePanelFeature({
        doc: doc,
        win: treeWin,
        fetchPage: fetchPage,
        invalidatePage: invalidatePage,
        submitForm: submitForm,
        findToolbarLink: findToolbarLink,
        getToolbarLinks: getToolbarLinks,
        log: log,
        warn: warn,
        err: err,
        report: report,
        forceTrueConfirm: forceTrueConfirm,
        normalizeMojibakeUtf8: normalizeMojibakeUtf8
    }) as Parameters<typeof register>[0]);
}
