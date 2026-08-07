// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * domq.js — jQuery-COMPATIBLE subset for editor modules (NOT jQuery).
 *
 * Exists so editor code can drop the jQuery library while keeping familiar
 * `$`-style chaining. Only APIs used by the editor are implemented; behavior
 * may differ slightly from real jQuery. Native DOM only — zero dependencies.
 */
import { loadScriptOnce } from '../../../shared/lazy-script.js';
import { renderQrCode } from '../../../shared/qr-code.js';

const dataStore = new WeakMap();
const eventStore = new WeakMap();

/** @param {string} s */
function isHtml(s) {
    return typeof s === 'string' && /^\s*<[\w!]/.test(s);
}

/** @param {string} html */
function parseHtml(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    return Array.from(tpl.content.childNodes);
}

/** @param {string} html */
function parseHtmlElements(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    return Array.from(tpl.content.children);
}

/** @param {*} input */
function toNodes(input) {
    if (input == null) return [];
    if (input instanceof Q) return input.elements.slice();
    if (input instanceof Node) return [input];
    if (typeof input === 'string') return isHtml(input) ? parseHtml(input) : [document.createTextNode(input)];
    if (input.nodeType) return [input];
    return Array.from(input);
}

/** @param {string} sel @param {ParentNode} root */
function query(sel, root) {
    if (!sel) return [];
    const m = sel.match(/^(\w+|)\:contains\((['"])(.*?)\2\)(.*)$/);
    if (!m) {
        try { return Array.from((root || document).querySelectorAll(sel)); }
        catch { return []; }
    }
    const [, tag, , text, rest] = m;
    const base = tag ? (root || document).querySelectorAll(tag) : [root];
    const hits = Array.from(base).filter((el) => (el.textContent || '').includes(text));
    if (!rest.trim()) return hits;
    return hits.flatMap((el) => query(rest.trim(), el));
}

/** @param {ParentNode|ParentNode[]} roots @param {string} sel */
function queryIn(roots, sel) {
    const list = Array.isArray(roots) ? roots : [roots];
    return list.flatMap((root) => (root ? query(sel, root) : []));
}

/** @param {Element} el */
function isVisible(el) {
    if (!el || el.nodeType !== 1) return false;
    const st = getComputedStyle(el);
    return st.display !== 'none' && st.visibility !== 'hidden' && el.getClientRects().length > 0;
}

/** @param {Element} el @param {string} pseudo */
function matchPseudo(el, pseudo) {
    if (pseudo === ':visible') return isVisible(el);
    if (pseudo === ':hidden') return !isVisible(el);
    if (pseudo === ':checked') return 'checked' in el && !!el.checked;
    return false;
}

class Q {
    /** @param {Node[]} elements @param {Q|null} [prev] */
    constructor(elements, prev) {
        this.elements = elements.filter(Boolean);
        this._prev = prev || null;
        this.length = this.elements.length;
        for (let i = 0; i < this.length; i++) this[i] = this.elements[i];
    }

    [Symbol.iterator]() { return this.elements[Symbol.iterator](); }

    _push(next) { return new Q(next, this); }

    find(sel) {
        if (sel instanceof Q) {
            const targets = sel.elements;
            return this._push(this.elements.flatMap((r) => targets.filter((el) => r.contains?.(el))));
        }
        if (sel instanceof Element) {
            return this._push(this.elements.flatMap((r) => (r.contains?.(sel) ? [sel] : [])));
        }
        return this._push(this.elements.flatMap((r) => queryIn(r, sel)));
    }

    closest(sel) {
        return this._push(this.elements.map((el) => (el.nodeType === 1 ? el.closest(sel) : null)).filter(Boolean));
    }

    parent() { return this._push(this.elements.map((el) => el.parentElement).filter(Boolean)); }
    children(sel) {
        const kids = this.elements.flatMap((el) => Array.from(el.children || []));
        return this._push(sel ? kids.filter((el) => el.matches(sel)) : kids);
    }

    contents() {
        const out = [];
        for (const el of this.elements) {
            if (el.tagName === 'IFRAME') {
                const doc = el.contentDocument;
                if (doc) out.push(doc);
            } else if (el.nodeType === 9) out.push(...el.childNodes);
            else out.push(...el.childNodes);
        }
        return this._push(out);
    }

    eq(i) { return this._push(i < 0 ? [this.elements[this.length + i]] : [this.elements[i]].filter(Boolean)); }
    get(i) { return i == null ? this.elements.slice() : this.elements[i]; }
    end() { return this._prev || q(); }

    filter(arg) {
        if (typeof arg === 'function') return this._push(this.elements.filter((el, i) => arg.call(el, i, el)));
        if (arg.startsWith(':')) return this._push(this.elements.filter((el) => matchPseudo(el, arg)));
        return this._push(this.elements.filter((el) => el.matches && el.matches(arg)));
    }

    not(sel) { return this._push(this.elements.filter((el) => !el.matches || !el.matches(sel))); }

    map(fn) {
        const out = [];
        this.elements.forEach((el, i) => {
            const v = fn.call(el, i, el);
            if (v != null) out.push(v);
        });
        return this._push(out.flat());
    }

    each(fn) { this.elements.forEach((el, i) => fn.call(el, i, el)); return this; }
    add(input) { return this._push(this.elements.concat(q(input).elements)); }

    is(arg) {
        if (typeof arg === 'string' && arg.startsWith(':')) return this.elements.some((el) => matchPseudo(el, arg));
        return this.elements.some((el) => el.matches && el.matches(arg));
    }

    attr(name, val) {
        if (val === undefined && this.elements.length <= 1) return this.elements[0]?.getAttribute(name);
        this.elements.forEach((el) => { if (el.nodeType === 1) val == null ? el.removeAttribute(name) : el.setAttribute(name, val); });
        return this;
    }

    removeAttr(name) { this.elements.forEach((el) => el.removeAttribute?.(name)); return this; }

    prop(name, val) {
        if (val === undefined && this.elements.length <= 1) return this.elements[0]?.[name];
        this.elements.forEach((el) => { el[name] = val; });
        return this;
    }

    val(v) {
        if (v === undefined && this.elements.length <= 1) return this.elements[0]?.value;
        this.elements.forEach((el) => { if ('value' in el) el.value = v; });
        return this;
    }

    html(v) {
        if (v === undefined && this.elements.length <= 1) return this.elements[0]?.innerHTML;
        this.elements.forEach((el) => { if (el.nodeType === 1) el.innerHTML = v; });
        return this;
    }

    text(v) {
        if (v === undefined && this.elements.length <= 1) return this.elements[0]?.textContent;
        this.elements.forEach((el) => { el.textContent = v; });
        return this;
    }

    css(name, val) {
        if (typeof name === 'object') {
            this.elements.forEach((el) => { if (el.style) Object.assign(el.style, name); });
            return this;
        }
        if (val === undefined && this.elements.length <= 1) {
            const el = this.elements[0];
            if (!el || el.nodeType !== 1) return undefined;
            return getComputedStyle(el).getPropertyValue(name.replace(/([A-Z])/g, '-$1').toLowerCase()) || el.style[name];
        }
        this.elements.forEach((el) => { if (el.style) el.style[name] = val; });
        return this;
    }

    data(key, val) {
        if (val === undefined && this.elements.length <= 1) {
            const el = this.elements[0];
            if (!el) return undefined;
            const bag = dataStore.get(el);
            if (bag && key in bag) return bag[key];
            const dk = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            return el.dataset?.[dk];
        }
        this.elements.forEach((el) => {
            const bag = dataStore.get(el) || {};
            bag[key] = val;
            dataStore.set(el, bag);
        });
        return this;
    }

    addClass(...names) {
        this.elements.forEach((el) => el.classList?.add(...names.join(' ').split(/\s+/).filter(Boolean)));
        return this;
    }

    removeClass(...names) {
        this.elements.forEach((el) => el.classList?.remove(...names.join(' ').split(/\s+/).filter(Boolean)));
        return this;
    }

    hasClass(name) { return this.elements.some((el) => el.classList?.contains(name)); }

    toggleClass(name, force) {
        this.elements.forEach((el) => el.classList?.toggle(name, force));
        return this;
    }

    show() { this.elements.forEach((el) => { if (el.style) el.style.display = ''; }); return this; }
    hide() { this.elements.forEach((el) => { if (el.style) el.style.display = 'none'; }); return this; }

    fadeOut(ms, cb) {
        const delay = typeof ms === 'number' ? ms : 0;
        const done = typeof ms === 'function' ? ms : cb;
        setTimeout(() => { this.hide(); done?.(); }, delay);
        return this;
    }

    fadeIn(ms, cb) {
        const delay = typeof ms === 'number' ? ms : 0;
        const done = typeof ms === 'function' ? ms : cb;
        setTimeout(() => { this.show(); done?.(); }, delay);
        return this;
    }

    slideUp(_speed, cb) { this.hide(); cb?.(); return this; }

    focus() { this.elements[0]?.focus?.(); return this; }

    width(v) {
        if (v !== undefined) return this.css('width', typeof v === 'number' ? `${v}px` : v);
        const el = this.elements[0];
        if (!el) return undefined;
        if (el === window) return document.documentElement.clientWidth;
        return el.getBoundingClientRect?.().width ?? el.offsetWidth;
    }

    height(v) {
        if (v !== undefined) return this.css('height', typeof v === 'number' ? `${v}px` : v);
        const el = this.elements[0];
        if (!el) return undefined;
        if (el === window) return document.documentElement.clientHeight;
        return el.getBoundingClientRect?.().height ?? el.offsetHeight;
    }

    _bind(type, sel, fn, add) {
        const types = type.split(/\s+/);
        const realSel = sel && typeof sel !== 'function' ? sel : null;
        const realFn = sel && typeof sel === 'function' ? sel : fn;
        this.elements.forEach((el) => {
            if (el.nodeType !== 1 && el.nodeType !== 9) return;
            types.forEach((t) => {
                const h = realSel
                    ? (e) => { const m = e.target?.closest?.(realSel); if (m && el.contains(m)) realFn.call(m, e); }
                    : (e) => realFn.call(el, e);
                if (add) {
                    el.addEventListener(t, h);
                    const list = eventStore.get(el) || [];
                    list.push({ type: t, handler: h, sel: realSel });
                    eventStore.set(el, list);
                } else {
                    const list = eventStore.get(el) || [];
                    eventStore.set(el, list.filter((item) => {
                        const drop = item.type === t && (!realSel || item.sel === realSel) && (!realFn || item.handler === realFn);
                        if (drop) el.removeEventListener(item.type, item.handler);
                        return !drop;
                    }));
                }
            });
        });
        return this;
    }

    on(type, sel, fn) {
        if (typeof sel === 'function') { fn = sel; sel = null; }
        return this._bind(type, sel, fn, true);
    }

    off(type, sel, fn) {
        if (type == null) {
            this.elements.forEach((el) => {
                (eventStore.get(el) || []).forEach(({ type: t, handler: h }) => el.removeEventListener(t, h));
                eventStore.delete(el);
            });
            return this;
        }
        if (typeof sel === 'function') { fn = sel; sel = null; }
        return this._bind(type, sel, fn, false);
    }
    unbind(type, sel, fn) { return this.off(type, sel, fn); }

    trigger(type) {
        type.split(/\s+/).forEach((t) => {
            this.elements.forEach((el) => el.dispatchEvent?.(new CustomEvent(t, { bubbles: true, cancelable: true })));
        });
        return this;
    }

    append(content) {
        this.elements.forEach((el) => toNodes(content).forEach((n) => el.appendChild(n)));
        return this;
    }

    prepend(content) {
        this.elements.forEach((el) => toNodes(content).reverse().forEach((n) => el.insertBefore(n, el.firstChild)));
        return this;
    }

    prependTo(target) { q(target).prepend(this.elements); return this; }

    after(content) {
        this.elements.forEach((el) => toNodes(content).forEach((n) => el.parentNode?.insertBefore(n, el.nextSibling)));
        return this;
    }

    before(content) {
        this.elements.forEach((el) => toNodes(content).forEach((n) => el.parentNode?.insertBefore(n, el)));
        return this;
    }

    remove() { this.elements.forEach((el) => el.remove?.()); return this; }

    empty() { this.elements.forEach((el) => { while (el.firstChild) el.removeChild(el.firstChild); }); return this; }

    offset() {
        const el = this.elements[0];
        if (!el || !el.getBoundingClientRect) return { top: 0, left: 0 };
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, left: r.left + window.scrollX };
    }

    /**
     * jQuery-UI-compatible dialog → shared/ui/modal.
     * Options: title, width, height, open, buttons: [{ text, class, click }]
     */
    dialog(options = {}) {
        const el = this.elements[0];
        if (!el) return this;
        const content = el.innerHTML || el;
        // openModal materializes string content in its own body. Clear the
        // legacy host first so form controls do not remain duplicated by ID.
        if (typeof content === 'string') el.replaceChildren();
        // Lazy import avoided — openModal is sync-required; assign on q via installDialog
        if (typeof q._openModal !== 'function') {
            throw new Error('domq.dialog: call installDomqDialog(openModal) first');
        }
        const buttons = (options.buttons || []).map((b) => ({
            text: b.text,
            class: b.class,
            onClick: (ref) => {
                if (typeof b.click === 'function') b.click.call(el, { data: ref });
            }
        }));
        const ref = q._openModal({
            title: options.title || '',
            content: typeof content === 'string' ? content : el,
            width: options.width || 600,
            buttons: buttons.length ? buttons : undefined,
            onOpen: (r) => {
                if (typeof options.open === 'function') options.open.call(el, r);
            },
            className: 'seipro-editor-modal'
        });
        this._modalRef = ref;
        q._lastModal = ref;
        return this;
    }

    /** Minimal jQuery UI tabs for #tabDialog-style markup (ul>li>a[href] + panels). */
    tabs() {
        this.elements.forEach((root) => {
            const links = Array.from(root.querySelectorAll('ul.ui-tabs-nav a, ul li a[href^="#"]'));
            const panels = [];
            links.forEach((a, i) => {
                const id = (a.getAttribute('href') || '').replace(/^#/, '');
                const panel = id ? document.getElementById(id) : null;
                if (panel) panels.push(panel);
                a.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    panels.forEach((p) => { p.style.display = 'none'; });
                    links.forEach((l) => l.parentElement && l.parentElement.classList.remove('ui-tabs-active', 'ui-state-active'));
                    if (panel) panel.style.display = '';
                    if (a.parentElement) a.parentElement.classList.add('ui-tabs-active', 'ui-state-active');
                });
                if (panel) panel.style.display = i === 0 ? '' : 'none';
                if (i === 0 && a.parentElement) a.parentElement.classList.add('ui-tabs-active', 'ui-state-active');
            });
        });
        return this;
    }

    /** Render a QR code into the first element (lazy-loads the shared vendor). */
    qrcode(options = {}) {
        const el = this.elements[0];
        if (!el) return this;
        const token = {};
        el.__seiproQrRenderToken = token;
        const pending = renderQrCode(el, options)
            .then((result) => {
                if (el.__seiproQrRenderToken !== token) {
                    if (result?.parentNode === el) result.remove();
                    return null;
                }
                return result;
            })
            .catch(() => {
                if (el.__seiproQrRenderToken === token) el.textContent = options.text || '';
                return null;
            });
        el.__seiproQrPromise = pending;
        pending.then(() => {
            if (el.__seiproQrPromise === pending) delete el.__seiproQrPromise;
        });
        return this;
    }
}

/** Wire openModal into q.dialog (call once from editor boot). */
export function installDomqDialog(openModal) {
    q._openModal = openModal;
}

/** @param {*} input @param {ParentNode} [ctx] */
function q(input, ctx) {
    if (typeof input === 'function') {
        if (typeof document === 'undefined') { input(); return q(); }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', input, { once: true });
        else setTimeout(input, 0);
        return q();
    }
    if (input instanceof Q) return input;
    // Nodes inside a CKEditor iframe belong to a different Window, so they
    // fail an `instanceof Node` check against the parent page. Node-like
    // detection keeps q() compatible with jQuery across editor iframes.
    if (input instanceof Node || input?.nodeType || input === window) return new Q([input]);
    if (Array.isArray(input) || (input && typeof input.length === 'number' && input.item)) {
        return new Q(Array.from(input));
    }
    if (typeof input === 'string') {
        if (isHtml(input)) return new Q(parseHtmlElements(input));
        const root = ctx instanceof Q ? ctx.elements[0] : (ctx || document);
        return new Q(query(input, root));
    }
    return new Q([]);
}

/** Inject a script tag; replacement for $.getScript. */
export function qLoadScript(url) {
    return loadScriptOnce(url);
}

/** jQuery-compatible static helpers used by editor dialogs. */
q.isArray = Array.isArray;
q.each = function each(obj, fn) {
    if (obj == null) return obj;
    if (typeof obj.length === 'number' && typeof obj !== 'function') {
        for (let i = 0; i < obj.length; i++) {
            if (fn.call(obj[i], i, obj[i]) === false) break;
        }
    } else {
        Object.keys(obj).forEach((k) => fn.call(obj[k], k, obj[k]));
    }
    return obj;
};
q.map = function map(arr, fn) {
    const out = [];
    q.each(arr, function (i, v) {
        const r = fn.call(v, v, i);
        if (r != null) out.push(r);
    });
    return out;
};

export { q };
export default q;
