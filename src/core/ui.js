import { aliasGlobal, getSeiPro, globalRef } from './global.js';

export function installUi() {
    function resolveTarget(elementTo, target) {
        const $ = globalRef.jQuery || globalRef.$;
        if (!$) {
            return null;
        }
        target = target || $('html');
        if (target && target.find && typeof elementTo === 'string') {
            return target.find(elementTo);
        }
        if (target && target.jquery) {
            return target;
        }
        return $(elementTo);
    }

    function buildFontFaceStyles(pathExtension, iconBoxSlim) {
        let html = '<style type="text/css" data-style="seipro-fonticon">' +
            '    @font-face {\n' +
            '       font-family: "Font Awesome 5 Pro";\n' +
            '       font-style: normal;\n' +
            '       font-weight: 900;\n' +
            '       font-display: block;\n' +
            '       src: url(' + pathExtension + 'webfonts/pro/fa-solid-900.eot) !important;\n' +
            '       src: url(' + pathExtension + 'webfonts/pro/fa-solid-900.eot?#iefix) format("embedded-opentype"),url(' + pathExtension + 'webfonts/pro/fa-solid-900.woff2) format("woff2"),url(' + pathExtension + 'webfonts/pro/fa-solid-900.woff) format("woff"),url(' + pathExtension + 'webfonts/pro/fa-solid-900.ttf) format("truetype"),url(' + pathExtension + 'webfonts/pro/fa-solid-900.svg#fontawesome) format("svg") !important;\n' +
            '   }\n' +
            '   @font-face {\n' +
            '       font-family: "Font Awesome 5 Pro";\n' +
            '       font-style: normal;\n' +
            '       font-weight: 400;\n' +
            '       font-display: block;\n' +
            '       src: url(' + pathExtension + 'webfonts/pro/fa-regular-400.eot) !important;\n' +
            '       src: url(' + pathExtension + 'webfonts/pro/fa-regular-400.eot?#iefix) format("embedded-opentype"),url(' + pathExtension + 'webfonts/pro/fa-regular-400.woff2) format("woff2"),url(' + pathExtension + 'webfonts/pro/fa-regular-400.woff) format("woff"),url(' + pathExtension + 'webfonts/pro/fa-regular-400.ttf) format("truetype"),url(' + pathExtension + 'webfonts/pro/fa-regular-400.svg#fontawesome) format("svg") !important;\n' +
            '   }\n';
        if (iconBoxSlim) {
            html += '   @font-face { \n' +
                '       font-family: "Font Awesome 5 Pro";\n' +
                '       font-style: normal;\n' +
                '       font-weight: 300;\n' +
                '       font-display: block;\n' +
                '       src: url(' + pathExtension + 'webfonts/pro/fa-light-300.eot) !important;\n' +
                '       src: url(' + pathExtension + 'webfonts/pro/fa-light-300.eot?#iefix) format("embedded-opentype"), url(' + pathExtension + 'webfonts/pro/fa-light-300.woff2) format("woff2"), url(' + pathExtension + 'webfonts/pro/fa-light-300.woff) format("woff"), url(' + pathExtension + 'webfonts/pro/fa-light-300.ttf) format("truetype"), url(' + pathExtension + 'webfonts/pro/fa-light-300.svg#fontawesome) format("svg") !important; }\n' +
                '   }\n' +
                '   @font-face {\n' +
                '       font-family: "Font Awesome 5 Duotone";\n' +
                '       font-style: normal;\n' +
                '       font-weight: 900;\n' +
                '       font-display: block;\n' +
                '       src: url(' + pathExtension + 'webfonts/pro/fa-duotone-900.eot) !important;\n' +
                '       src: url(' + pathExtension + 'webfonts/pro/fa-duotone-900.eot?#iefix) format("embedded-opentype"), url(' + pathExtension + 'webfonts/pro/fa-duotone-900.woff2) format("woff2"), url(' + pathExtension + 'webfonts/pro/fa-duotone-900.woff) format("woff"), url(' + pathExtension + 'webfonts/pro/fa-duotone-900.ttf) format("truetype"), url(' + pathExtension + 'webfonts/pro/fa-duotone-900.svg#fontawesome) format("svg") !important; }\n' +
                '   }\n';
        }
        html += '</style>';
        return html;
    }

    function loadFontIcons(elementTo, target) {
        const $ = globalRef.jQuery || globalRef.$;
        if (!$) return;

        target = target || $('html');
        const iconBoxSlim = !!(globalRef.localStorage.getItem('seiSlim') || globalRef.localStorage.getItem('seiSlim_editor'));
        const pathExtension = getSeiPro().core.runtime.pathExtensionSEIPro();
        const appendTarget = resolveTarget(elementTo, target);

        if (target.find('link[data-style="seipro-fonticon"]').length === 0 &&
            target.find('style[data-style="seipro-fonticon"]').length === 0) {
            $('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                'data-style': 'seipro-fonticon',
                href: getSeiPro().core.runtime.getUrlExtension('css/fontawesome.pro.min.css')
            }).appendTo(appendTarget);

            const htmlStyleFont = buildFontFaceStyles(pathExtension, iconBoxSlim);
            target.find('head').append(htmlStyleFont);
        }
    }

    function loadStylePro(url, elementTo, iframeTo) {
        const $ = globalRef.jQuery || globalRef.$;
        if (!$) return;

        elementTo = elementTo || $('head');
        iframeTo = iframeTo || $('head');
        if (iframeTo.find('link[data-style="seipro-style"]').length === 0) {
            $('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                'data-style': 'seipro-style',
                href: url
            }).appendTo(elementTo);
        }
    }

    function loadFilesUI() {
        const $ = globalRef.jQuery || globalRef.$;
        if (!$) return;
        if (typeof globalRef.jQuery.ui === 'undefined') {
            $.getScript(getSeiPro().core.runtime.getUrlExtension('js/lib/jquery-ui.min.js'));
        }
        loadStylePro(getSeiPro().core.runtime.getUrlExtension('css/jquery-ui.css'), 'head');
    }

    // Extra dark-mode CSS for the HTML document viewer (init_visualizacao_html).
    // Ported verbatim from the legacy per-page loadStyleDesign so the bundled,
    // parameterized version keeps the same behaviour when options.htmlExtras is set.
    const HTML_VIEWER_DARK_CSS =
        '   p.Texto_Fundo_Cinza_Maiusculas_Negrito, \n' +
        '   p.Texto_Fundo_Cinza_Negrito, \n' +
        '   p .ancoraSei, \n' +
        '   p.Item_Nivel1 { \n' +
        '       background-color: #e5e5e566 !important;  \n' +
        '   } \n' +
        '   .dark-mode-color-black, \n' +
        '   .dark-mode-color-black * { \n' +
        '       color: #000 !important;  \n' +
        '   } \n' +
        '   .dark-mode-color-white, \n' +
        '   .dark-mode-color-white * { \n' +
        '       color: #fff !important;  \n' +
        '   } \n' +
        '   .pageBreakPro { background: #6f7071; height: 15px; } \n';

    function applyHtmlViewerDarkExtras() {
        const doc = globalRef.document;
        if (doc && doc.head) {
            const style = doc.createElement('style');
            style.type = 'text/css';
            style.appendChild(doc.createTextNode(HTML_VIEWER_DARK_CSS));
            doc.head.appendChild(style);
        }
        if (typeof globalRef.initRepareBgTableColor === 'function') {
            globalRef.initRepareBgTableColor();
        }
    }

    function loadStyleDesign(body, secondClass, options) {
        options = options || {};
        const $ = globalRef.jQuery || globalRef.$;
        const slimEnabled = !!globalRef.localStorage.getItem('seiSlim');
        const darkEnabled = !!globalRef.localStorage.getItem('darkModePro');
        const parentNewSEI = !!(options.checkParentNewSEI && globalRef.parent && globalRef.parent.isNewSEI);

        if ($ && body && typeof body.addClass === 'function') {
            if (slimEnabled) {
                body.addClass('seiSlim');
                if (secondClass) body.addClass('seiSlim_' + secondClass);
                if (options.parent) body.addClass('seiSlim_parent');
                if (options.autoView && globalRef.document.getElementById('divInfraAreaTelaE') === null) {
                    body.addClass('seiSlim_view');
                }
                if (darkEnabled) {
                    body.addClass('dark-mode');
                    if (options.htmlExtras) applyHtmlViewerDarkExtras();
                }
                if (options.viewerExtras) {
                    if (globalRef.localStorage.getItem('seiBtnRight')) body.addClass('seiBtnRight');
                    if (globalRef.localStorage.getItem('iconLabel')) body.addClass('seiIconLabel');
                }
            }
            if (parentNewSEI) body.addClass('newSEI');
            return;
        }

        const el = body && body.nodeType ? body : (globalRef.document && globalRef.document.body);
        if (!el || !el.classList) return;

        if (slimEnabled) {
            el.classList.add('seiSlim');
            if (secondClass) el.classList.add('seiSlim_' + secondClass);
            if (options.parent) el.classList.add('seiSlim_parent');
            if (options.autoView && globalRef.document.getElementById('divInfraAreaTelaE') === null) {
                el.classList.add('seiSlim_view');
            }
            if (darkEnabled) {
                el.classList.add('dark-mode');
                if (options.htmlExtras) applyHtmlViewerDarkExtras();
            }
            if (options.viewerExtras) {
                if (globalRef.localStorage.getItem('seiBtnRight')) el.classList.add('seiBtnRight');
                if (globalRef.localStorage.getItem('iconLabel')) el.classList.add('seiIconLabel');
            }
        }
        if (parentNewSEI) el.classList.add('newSEI');
    }

    const ui = {
        loadFontIcons,
        loadStylePro,
        loadFilesUI,
        loadStyleDesign
    };

    getSeiPro().core.ui = ui;

    aliasGlobal('loadFontIcons', loadFontIcons);
    aliasGlobal('loadStylePro', loadStylePro);
    aliasGlobal('loadFilesUI', loadFilesUI);
    aliasGlobal('loadStyleDesign', loadStyleDesign);

    return ui;
}
