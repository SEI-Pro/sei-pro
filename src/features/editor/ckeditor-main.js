/**
 * MAIN-world helper: runs as a page <script src="chrome-extension://...">.
 * Signals when CKEDITOR is ready. Isolated world still obtains the object via
 * same-origin editor iframe → contentWindow.parent.CKEDITOR.
 */
(function () {
    if (window.__SEI_PRO_CKE_MAIN__) return;
    window.__SEI_PRO_CKE_MAIN__ = true;

    function mark() {
        if (!window.CKEDITOR || !window.CKEDITOR.dialog) return false;
        try {
            document.documentElement.setAttribute('data-seipro-cke', 'ready');
            document.documentElement.setAttribute(
                'data-seipro-cke-instances',
                Object.keys(window.CKEDITOR.instances || {}).join(',')
            );
            window.dispatchEvent(new CustomEvent('seipro-ckeditor-ready'));
        } catch (e) { /* noop */ }
        return true;
    }

    if (!mark()) {
        var n = 0;
        var t = setInterval(function () {
            if (mark() || ++n > 200) clearInterval(t);
        }, 100);
    }
})();
