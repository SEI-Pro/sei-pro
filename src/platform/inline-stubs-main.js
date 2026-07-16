/**
 * MAIN-world companion for legacy-inline-bridge.
 *
 * Loaded via <script src="chrome-extension://.../js/inline-stubs-main.js"> from
 * the isolated content script (web_accessible_resources). Runs in the page world
 * so it can install no-op stubs for extension function names referenced by
 * inline handlers (onclick/onmouseover/...), preventing ReferenceError when the
 * browser evaluates those attributes in MAIN.
 *
 * Must stay classic JS (no imports) — injected as a plain page script.
 */
(function () {
    if (window.__SEI_PRO_MAIN_INLINE_STUBS__) return;
    window.__SEI_PRO_MAIN_INLINE_STUBS__ = true;

    var ATTRS = ['onclick', 'onmouseover', 'onmouseout', 'onchange', 'onfocus', 'onblur', 'ondblclick'];
    var CALL_RE = /^\s*([A-Za-z_$][\w$]*)\s*\(([^()]*)\)\s*;?\s*$/;

    function findTarget(start, attr) {
        var node = start;
        while (node && node.nodeType === 1) {
            if (node.hasAttribute && node.hasAttribute(attr)) return node;
            node = node.parentElement;
        }
        return null;
    }

    ATTRS.forEach(function (attr) {
        var type = attr.slice(2);
        document.addEventListener(type, function (event) {
            var el = findTarget(event.target, attr);
            if (!el) return;
            var val = el.getAttribute(attr) || '';
            var m = CALL_RE.exec(val);
            if (!m) return;
            var fnName = m[1];
            if (/^infra/i.test(fnName)) return;
            if (typeof window[fnName] === 'function') return;
            window[fnName] = function () {};
        }, true);
    });
})();
