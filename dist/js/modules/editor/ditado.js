/**
 * SEI Pro - Editor Feature: ditado (Ditado por voz / WebSpeech)
 *
 * Ditado de texto por voz usando a API nativa SpeechRecognition
 * (webkitSpeechRecognition). Origem: plugin CKWebSpeech adaptado
 * (https://github.com/ultranaco/ckwebspeech).
 *
 * Entradas (handlers globais ligados pelo monolito em setClickButtons):
 *   - getBoxDitado(this_)      -> botao .getDitadoButton: liga/desliga o ditado.
 *   - getBoxCtrDitado(this_)   -> botao .getCtrDitadoButton: abre o dialogo de
 *                                 configuracoes (idioma/cultura).
 * Boot/registro (chamados pelo monolito):
 *   - instanceDitadoPro(oEditor) -> antes em setCKEDITOR_SEIPRO (boot CK4),
 *     cria a instancia ckWebSpeech no editor e instala menu de contexto + atalho.
 *   - getDialogDitado()         -> antes em initFunctions(): registra as classes
 *     do plugin (initDitadoPro). O dialogo CK4 (CKEDITOR.dialog.add) foi
 *     substituido por jQuery UI on-demand em getBoxCtrDitado().
 *   - initDitadoPro()           -> define langs + classes CKWebSpeechHandler/
 *     CKWebSpeech (idempotente).
 *
 * PORTABILIDADE CK4 -> CK5 (tudo via SeiProEditorAdapter):
 *   - A engine de reconhecimento (webkitSpeechRecognition) e nativa do browser
 *     e foi mantida verbatim.
 *   - oEditor.addCommand('webspeechDialog', dialogCommand) / oEditor.openDialog
 *     -> removidos; o dialogo agora e jQuery UI via SeiProEditorAdapter.openDialog.
 *   - oEditor.addCommand('webspeechToogle', ...) + oEditor.execCommand(...)
 *     -> chamada direta a ckWebSpeech.toogleSpeech().
 *   - oEditor.contextMenu/addMenuGroup/addMenuItem/addListener
 *     -> SeiProEditorAdapter.addContextMenu (menu DOM uniforme CK4/CK5).
 *   - atalho de teclado (setKeystroke) -> keydown DOM no getBodyContainer
 *     (Ctrl+Shift+Espaco liga/desliga o ditado).
 *   - this._editor.insertText / oEditor.execCommand('enter'|'undo'|'redo')
 *     -> SeiProEditorAdapter.insertText / .execCommand (que mapeia para
 *     editor.execCommand no CK4 e editor.execute no CK5).
 *   - getElementPluginIcon (lia oEditor.ui.instances.Webspeech, um botao de
 *     plugin CK4 inexistente nesta toolbar) -> no-op. O estado visual usa as
 *     classes jQuery .getDitadoButton/.cke_button__ditado_icon (inofensivas
 *     quando ausentes).
 *
 * Helpers compartilhados (no monolito; chamados so em tempo de clique/boot):
 *   setParamEditor, checkConfigValue, alertaBoxPro. Constante global URL_SPRO.
 *
 * Status: 'partial'. O reconhecimento de voz e suportado nativamente em ambos.
 * O que NAO foi portado 1:1: o seletor de idioma/cultura do dialogo CK4 usava
 * a infra de <select> do CKEDITOR.dialog (getContentElement/setup/onShow);
 * reconstruimos isso como <select> HTML nativos no dialogo jQuery UI. Os
 * "commands voice" extras configurados em oEditor.config.ckwebspeech (vai/
 * undo/redo via comando de voz) nao tinham consumidor real no plugin e ficaram
 * de fora; os comandos de voz que JA funcionavam (nova linha / novo paragrafo /
 * ponto final / desfazer / refazer + pontuacao) foram preservados em onResult.
 */
(function () {
    'use strict';

    // ----------------------------------------------------------------
    // Estado de modulo (eram globais no monolito: langs, CKWebSpeechHandler,
    // CKWebSpeech, wsDialogHtml). Mantidos no escopo do modulo porque so esta
    // feature os consome.
    // ----------------------------------------------------------------
    var langs = null;
    var CKWebSpeechHandler = null;
    var CKWebSpeech = null;
    var _classesReady = false;

    // Base de recursos da extensao (icones do botao). URL_SPRO pode nao existir
    // em todos os ambientes; resolvemos um fallback via adapter.
    function extBase() {
        if (typeof window.URL_SPRO === 'string' && window.URL_SPRO) return window.URL_SPRO;
        try {
            var b = SeiProEditorAdapter.resolveExtBase && SeiProEditorAdapter.resolveExtBase();
            return b || '';
        } catch (e) { return ''; }
    }

    // ----------------------------------------------------------------
    // initDitadoPro: define langs + classes do plugin. Idempotente.
    // ----------------------------------------------------------------
    function buildClasses() {
        if (_classesReady) return;

        langs =
        [
        ['Afrikaans',           ['af-ZA']],
        ['Bahasa Indonesia',    ['id-ID']],
        ['Bahasa Melayu',       ['ms-MY']],
        ['Catal\u00E0',         ['ca-ES']],
        ['\u010Ce\u0161tina',   ['cs-CZ']],
        ['Deutsch',             ['de-DE']],
        ['English',             ['en-AU', 'Australia'],
                                ['en-CA', 'Canada'],
                                ['en-IN', 'India'],
                                ['en-NZ', 'New Zealand'],
                                ['en-ZA', 'South Africa'],
                                ['en-GB', 'United Kingdom'],
                                ['en-US', 'United States']],
        ['Espa\u00F1ol',        ['es-AR', 'Argentina'],
                                ['es-BO', 'Bolivia'],
                                ['es-CL', 'Chile'],
                                ['es-CO', 'Colombia'],
                                ['es-CR', 'Costa Rica'],
                                ['es-EC', 'Ecuador'],
                                ['es-SV', 'El Salvador'],
                                ['es-ES', 'Espa\u00F1a'],
                                ['es-US', 'Estados Unidos'],
                                ['es-GT', 'Guatemala'],
                                ['es-HN', 'Honduras'],
                                ['es-MX', 'M\u00E9xico'],
                                ['es-NI', 'Nicaragua'],
                                ['es-PA', 'Panam\u00E1'],
                                ['es-PY', 'Paraguay'],
                                ['es-PE', 'Per\u00FA'],
                                ['es-PR', 'Puerto Rico'],
                                ['es-DO', 'Rep\u00FAblica Dominicana'],
                                ['es-UY', 'Uruguay'],
                                ['es-VE', 'Venezuela']],
        ['Euskara',             ['eu-ES']],
        ['Fran\u00E7ais',       ['fr-FR']],
        ['Galego',              ['gl-ES']],
        ['Hrvatski',            ['hr_HR']],
        ['IsiZulu',             ['zu-ZA']],
        ['\u00CDslenska',       ['is-IS']],
        ['Italiano',            ['it-IT', 'Italia'],
                                ['it-CH', 'Svizzera']],
        ['Magyar',              ['hu-HU']],
        ['Nederlands',          ['nl-NL']],
        ['Norsk bokm\u00E5l',   ['nb-NO']],
        ['Polski',              ['pl-PL']],
        ['Portugu\u00EAs',      ['pt-BR', 'Brasil'],
                                ['pt-PT', 'Portugal']],
        ['Rom\u00E2n\u0103',    ['ro-RO']],
        ['Sloven\u010Dina',     ['sk-SK']],
        ['Suomi',               ['fi-FI']],
        ['Svenska',             ['sv-SE']],
        ['T\u00FCrk\u00E7e',    ['tr-TR']],
        ['\u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438',   ['bg-BG']],
        ['P\u0443\u0441\u0441\u043A\u0438\u0439',                    ['ru-RU']],
        ['\u0421\u0440\u043F\u0441\u043A\u0438',                     ['sr-RS']],
        ['\uD55C\uAD6D\uC5B4',                                      ['ko-KR']],
        ['\u4E2D\u6587',        ['cmn-Hans-CN', '\u666E\u901A\u8BDD (\u4E2D\u56FD\u5927\u9646)'],
                                ['cmn-Hans-HK', '\u666E\u901A\u8BDD (\u9999\u6E2F)'],
                                ['cmn-Hant-TW', '\u4E2D\u6587 (\u53F0\u7063)'],
                                ['yue-Hant-HK', '\u7CB5\u8A9E (\u9999\u6E2F)']],
        ['\u65E5\u672C\u8A9E',  ['ja-JP']],
        ['Lingua lat\u012Bna',  ['la']]
        ];

        // -------------------------------------------------------------
        // CKWebSpeechHandler: gerencia o ciclo de vida do reconhecimento.
        // O segundo argumento (editor) e a instancia do editor resolvida pelo
        // adapter (CK4 ou CK5); usamos o adapter para inserir texto e comandos.
        // -------------------------------------------------------------
        CKWebSpeechHandler = function (editor) {
            this._editor = editor;
            this._currentCulture = { val: 'pt-BR', langVal: 19 };
            this._elmtPlugIcon = null;
            this._plugPath = null;
            this._recognizing = false;
            this._recognition = null;
            this._ignoreOnend = false;
            this._start_timestamp = 0;
            this._working = false;
            this.CKWebSpeechHandler();
        };

        CKWebSpeechHandler.prototype.CKWebSpeechHandler = function () {
            this._plugPath = extBase();
            this._recognizing = false;
            this._ignoreOnend = false;
            this._working = false;
            this.getElementPluginIcon();
            this.initServiceSpeech();
        };

        CKWebSpeechHandler.prototype.isUnlockedService = function () {
            if (!('webkitSpeechRecognition' in window)) return false;
            return true;
        };

        // No-op portado: a versao CK4 procurava o botao de um plugin Webspeech
        // (oEditor.ui.instances.Webspeech) que nao existe nesta toolbar. O estado
        // visual e tratado por updateIcons via classes jQuery.
        CKWebSpeechHandler.prototype.getElementPluginIcon = function () {
            /* no-op: o botao de plugin CK4 (.cke_button__webspeech_icon) nao
               existe; usamos .getDitadoButton/.cke_button__ditado_icon. */
        };

        CKWebSpeechHandler.prototype.updateIcons = function () {
            if (!window.$) return;
            var base = extBase();
            if (this._recognizing) {
                $('.cke_button__ditado_icon').css('background', 'url(\'' + base + 'icons/editor/webspeech-enable.gif\')');
                $('.getDitadoButton').addClass('cke_button_on').removeClass('cke_button_off');
            } else {
                $('.cke_button__ditado_icon').css('background', 'url(\'' + base + 'icons/editor/webspeech.png\')');
                $('.getDitadoButton').addClass('cke_button_off').removeClass('cke_button_on');
            }
        };

        CKWebSpeechHandler.prototype.initServiceSpeech = function () {
            if (this.isUnlockedService()) {
                this._recognition = new webkitSpeechRecognition();
                this._recognition.continuous = true;
                this._recognition.interimResults = false;

                var self = this;
                this._recognition.onstart = function () { self.onStart(); };
                this._recognition.onerror = function (event) { self.onError(event); };
                this._recognition.onend = function () { self.onEnd(); };
                this._recognition.onresult = function (event) { self.onResult(event); };
                this._recognition.onspeechstart = function (event) { self.onSpeech(); };
                this._recognition.onspeechend = function (event) { self.onSpeechEnd(); };
            }
        };

        CKWebSpeechHandler.prototype.onStart = function () {
            this._recognizing = true;
            this.updateIcons();
        };

        CKWebSpeechHandler.prototype.onError = function (event) {
            if (event.error == 'no-speech') {
                this._ignore_onend = true;
            }
            if (event.error == 'audio-capture') {
                this._ignore_onend = true;
            }
            if (event.error == 'not-allowed') {
                if (event.timeStamp - this._start_timestamp < 100) {
                    // info_blocked
                } else {
                    // info_denied
                }
                this._ignore_onend = true;
            }
            this.updateIcons();
        };

        CKWebSpeechHandler.prototype.onEnd = function () {
            this._recognizing = false;
            if (this._ignoreOnend) return;
            this.updateIcons();
        };

        CKWebSpeechHandler.prototype.onSpeech = function (event) {
            /* sem alteracao de icone no inicio da fala */
        };

        CKWebSpeechHandler.prototype.onSpeechEnd = function (event) {
            this.updateIcons();
        };

        // Resolve o editor atual: prefere o armazenado; senao pergunta ao adapter.
        CKWebSpeechHandler.prototype._ed = function () {
            if (this._editor) return this._editor;
            this._editor = SeiProEditorAdapter.getInstance();
            return this._editor;
        };

        CKWebSpeechHandler.prototype.onResult = function (event) {
            var editor = this._ed();
            if (typeof (event.results) == 'undefined') {
                this._recognizing = false;
                if (this._recognition) {
                    this._recognition.onend = null;
                    this._recognition.stop();
                }
                this.updateIcons();
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    var t = ' ' + event.results[i][0].transcript + ' ';

                    if (t.match(/.* nova linha .*/) || t.match(/.* ponto final .*/) || t.match(/.* novo par\u00E1grafo .*/)) {
                        var l = (t.match(/.* nova linha .*/)) ? t.trim().split('nova linha') : t;
                            l = (t.match(/.* ponto final .*/)) ? t.trim().split('ponto final') : l;
                            l = (t.match(/.* novo par\u00E1grafo .*/)) ? t.trim().split('novo par\u00E1grafo') : l;
                            l = l.filter(function (n) { return n; });
                        if (l.length) {
                            var _this = this;
                            $.each(l, function (idx, v) {
                                if (v.trim() != '') {
                                    var ponto = (idx < l.length - 1) ? '.' : '';
                                    v = _this.replaceTranscript(v);
                                    SeiProEditorAdapter.insertText(editor, v + ponto);
                                    if (ponto != '') SeiProEditorAdapter.execCommand(editor, 'enter');
                                }
                            });
                        } else {
                            SeiProEditorAdapter.execCommand(editor, 'enter');
                        }
                    } else if (t.trim().toLocaleLowerCase() == 'desfazer') {
                        SeiProEditorAdapter.execCommand(editor, 'undo');
                    } else if (t.trim().toLocaleLowerCase() == 'refazer') {
                        SeiProEditorAdapter.execCommand(editor, 'redo');
                    } else {
                        t = this.replaceTranscript(t);
                        SeiProEditorAdapter.insertText(editor, t);
                    }
                }
            }
        };

        CKWebSpeechHandler.prototype.replaceTranscript = function (t) {
            t = (t.match(/.* abre par\u00EAnteses .*/)) ? t.replace(/ abre par\u00EAnteses /, '(') : t;
            t = (t.match(/.* fecha par\u00EAnteses .*/)) ? t.replace(/ fecha par\u00EAnteses /, ')') : t;
            t = (t.match(/.* abre colchete .*/)) ? t.replace(/ abre colchetes /, '[') : t;
            t = (t.match(/.* fecha colchete .*/)) ? t.replace(/ fecha colchete /, ']') : t;
            t = (t.match(/.* abre aspas .*/)) ? t.replace(/ abre aspas /, '"') : t;
            t = (t.match(/.* fecha aspas .*/)) ? t.replace(/ fecha aspas /, '"') : t;
            t = (t.match(/.* espa\u00E7o .*/)) ? t.replace(/ espa\u00E7o /, ' ') : t;
            t = (t.match(/.* aspas .*/)) ? t.replace(/ aspas /, '"') : t;
            t = (t.match(/.* travess\u00E3o .*/)) ? t.replace(/ travess\u00E3o /, ' \u2013 ') : t;
            t = (t.match(/.* tra\u00E7o .*/)) ? t.replace(/ tra\u00E7o /, '- ') : t;
            t = (t.match(/.* ponto e v\u00EDrgula .*/)) ? t.replace(/ ponto e v\u00EDrgula /, '; ') : t;
            t = (t.match(/.* dois pontos .*/)) ? t.replace(/ dois pontos /, ': ') : t;
            t = (t.match(/.* 2 pontos .*/)) ? t.replace(/ 2 pontos /, ': ') : t;
            t = (t.match(/.* ponto .*/)) ? t.replace(/ ponto /, '. ') : t;
            t = (t.match(/.* v\u00EDrgula .*/)) ? t.replace(/ v\u00EDrgula /, ', ') : t;

            var iStr = Array.from(t.trim())[0];
            var space = (iStr == ',' || iStr == ';' || iStr == ':' || iStr == '-' || iStr == '.') ? '' : ' ';
            return space + t.trim();
        };

        CKWebSpeechHandler.prototype.toogleSpeech = function () {
            if (!this._recognition) {
                if (typeof window.alertaBoxPro === 'function') {
                    alertaBoxPro('Ditado indispon\u00EDvel', 'exclamation-triangle', 'Seu navegador n\u00E3o suporta reconhecimento de voz (webkitSpeechRecognition).');
                }
                return;
            }
            if (!this._recognizing) {
                this._recognition.lang = this._currentCulture.val;
                this._recognition.start();
                this._ignore_onend = false;
                this._start_timestamp = new Date().getTime();
            } else {
                this._recognition.stop();
            }
        };

        // -------------------------------------------------------------
        // CKWebSpeech: subclasse com a logica de idioma/cultura.
        // -------------------------------------------------------------
        CKWebSpeech = function (langsArg, culture, editor) {
            CKWebSpeechHandler.call(this, editor);
            this._langs = langsArg;
            this.CKWebSpeech(culture);
        };

        CKWebSpeech.prototype = Object.create(CKWebSpeechHandler.prototype);

        CKWebSpeech.prototype.CKWebSpeech = function (_culture) {
            if (typeof _culture !== 'undefined') {
                this.setDialectByCulture(_culture);
            }
        };

        CKWebSpeech.prototype.setDialectByCulture = function (_culture) {
            for (var i = 0; i < this._langs.length; i++) {
                for (var j = 1; j < this._langs[i].length; j++) {
                    if (this._langs[i][j][0].toLowerCase() == _culture.toLowerCase()) {
                        this._currentCulture = { val: this._langs[i][j][0], langVal: i };
                        return this._currentCulture;
                    }
                }
            }
            return this._currentCulture;
        };

        CKWebSpeech.prototype.setDialectByLanguage = function (_langVal) {
            this.setDialectByCulture(this._langs[_langVal][1][0]);
        };

        CKWebSpeech.prototype.getLanguages = function () {
            var _languages = [];
            for (var i = 0; i < this._langs.length; i++) {
                _languages.push([this._langs[i][0], i]);
            }
            return _languages;
        };

        CKWebSpeech.prototype.getCultures = function (_langVal) {
            if (typeof _langVal === 'undefined') {
                _langVal = this._currentCulture.langVal;
            }
            var _cultures = [];
            for (var i = 1; i < this._langs[_langVal].length; i++) {
                _cultures.push([this._langs[_langVal][i][0]]);
            }
            return _cultures;
        };

        _classesReady = true;
    }

    // ----------------------------------------------------------------
    // Cria/recupera a instancia ckWebSpeech ligada a um editor.
    // Substitui instanceDitadoPro (que usava addCommand/dialogCommand/
    // contextMenu do CK4). Idempotente por editor.
    // ----------------------------------------------------------------
    function ensureCkWebSpeech(editor) {
        if (!editor) return null;
        buildClasses();
        if (typeof editor.ckWebSpeech === 'undefined' || editor.ckWebSpeech === null) {
            editor.ckWebSpeech = new CKWebSpeech(langs, 'pt-BR', editor);

            // Menu de contexto: item "Ditado" (liga/desliga). No CK4 era
            // contextMenu/addMenuGroup/addMenuItem; aqui via menu DOM uniforme.
            try {
                SeiProEditorAdapter.addContextMenu(editor, function (targetEl) {
                    return [{
                        label: 'Ditado',
                        action: function () {
                            if (editor.ckWebSpeech) editor.ckWebSpeech.toogleSpeech();
                        }
                    }];
                });
            } catch (e) {}

            // Atalho de teclado: Ctrl+Shift+Espaco liga/desliga o ditado.
            // Substitui o antigo setKeystroke do CK4 por keydown DOM no corpo.
            try {
                var body = SeiProEditorAdapter.getBodyContainer(editor);
                if (body && !body.__seiProDitadoKey) {
                    body.__seiProDitadoKey = true;
                    body.addEventListener('keydown', function (ev) {
                        if (ev.ctrlKey && ev.shiftKey && (ev.code === 'Space' || ev.key === ' ' || ev.keyCode === 32)) {
                            ev.preventDefault();
                            if (editor.ckWebSpeech) editor.ckWebSpeech.toogleSpeech();
                        }
                    });
                }
            } catch (e) {}
        }
        return editor.ckWebSpeech;
    }

    // ----------------------------------------------------------------
    // HANDLERS GLOBAIS (mesmos nomes do monolito)
    // ----------------------------------------------------------------

    // Boot: antes chamado em setCKEDITOR_SEIPRO. Recebe o editor (CK4) ou nada
    // (CK5/lazy). Cria a instancia ckWebSpeech + menu + atalho. Idempotente.
    window.instanceDitadoPro = function (editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        ensureCkWebSpeech(editor);
    };

    // Botao .getDitadoButton: liga/desliga o ditado.
    window.getBoxDitado = function (this_) {
        if (window.$) {
            var btn = $('.getDitadoButton');
            if (btn.hasClass('cke_button_off')) {
                btn.addClass('cke_button_on').removeClass('cke_button_off');
            } else {
                btn.addClass('cke_button_off').removeClass('cke_button_on');
            }
        }
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        var ws = ensureCkWebSpeech(editor);
        if (ws) ws.toogleSpeech();
    };

    // Botao .getCtrDitadoButton: abre o dialogo de configuracoes (idioma/cultura).
    // Antes: oEditor.openDialog('webspeechDialog'). Agora: jQuery UI on-demand.
    window.getBoxCtrDitado = function (this_) {
        if (typeof window.setParamEditor === 'function') {
            try { setParamEditor(this_); } catch (e) {}
        }
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        var ws = ensureCkWebSpeech(editor);
        if (!ws) return;
        openDialogDitado(editor, ws);
    };

    // Abre o dialogo de configuracoes do ditado (jQuery UI via adapter).
    // Substitui o antigo CKEDITOR.dialog.add('webspeechDialog', ...).
    function openDialogDitado(editor, ws) {
        var langOptions = ws.getLanguages();    // [ [nome, idx], ... ]
        var curLangVal = ws._currentCulture.langVal;
        var curVal = ws._currentCulture.val;

        // Monta as <option> de idioma.
        var langHtml = '';
        for (var i = 0; i < langOptions.length; i++) {
            var sel = (langOptions[i][1] == curLangVal) ? ' selected' : '';
            langHtml += '<option value="' + langOptions[i][1] + '"' + sel + '>' + langOptions[i][0] + '</option>';
        }
        // Monta as <option> de cultura do idioma atual.
        function culturesHtmlFor(langVal, selectedVal) {
            var cultures = ws.getCultures(langVal);
            var html = '';
            for (var j = 0; j < cultures.length; j++) {
                var cval = cultures[j][0];
                var s = (cval == selectedVal) ? ' selected' : '';
                html += '<option value="' + cval + '"' + s + '>' + cval + '</option>';
            }
            return html;
        }

        var htmlBox =
            '<div class="dialogBoxDiv seipro-dialog-compact" style="font-size:13px;line-height:1.4;color:#333;font-family:Arial,sans-serif;">'
            + '<style>'
            + '.seipro-dialog-compact, .seipro-dialog-compact * { box-sizing:border-box; font-size:13px; }'
            + '.seipro-dialog-compact label { display:block; font-size:12px; color:#555; margin-bottom:2px; }'
            + '.seipro-dialog-compact select { font-size:13px; padding:4px 6px; border:1px solid #ccc; border-radius:3px; width:100%; }'
            + '.seipro-dialog-compact .ds-row { margin-bottom:10px; }'
            + '</style>'
            + '<div class="ds-row">'
            + '<label for="wslanguages">Idioma</label>'
            + '<select id="wslanguages">' + langHtml + '</select>'
            + '</div>'
            + '<div class="ds-row">'
            + '<label for="wscultures">Cultura</label>'
            + '<select id="wscultures">' + culturesHtmlFor(curLangVal, curVal) + '</select>'
            + '</div>'
            + '<div style="font-style:italic;color:#616161;margin-top:6px;">'
            + '<i class="fas fa-info-circle" style="color:#007fff;"></i> Atalho: <strong>Ctrl + Shift + Espa\u00E7o</strong> liga/desliga o ditado.'
            + '</div>'
            + '</div>';

        // selectCulture acompanha a escolha do usuario (equivalente ao onChange
        // de wscultures do dialogo CK4).
        var selectCulture = curVal;

        SeiProEditorAdapter.openDialog({
            id: 'dialogDitadoPro',
            title: 'Configura\u00E7\u00F5es do Ditado',
            html: htmlBox,
            width: 420,
            height: 260,
            onOpen: function ($box) {
                // Ao trocar de idioma, recarrega as culturas (equivale ao onChange
                // de wslanguages, que repovoava o <select> de cultura).
                $box.find('#wslanguages').on('change', function () {
                    var langVal = parseInt($(this).val(), 10);
                    var firstCultures = ws.getCultures(langVal);
                    var firstVal = (firstCultures.length) ? firstCultures[0][0] : '';
                    $box.find('#wscultures').html(culturesHtmlFor(langVal, firstVal));
                    selectCulture = firstVal;
                });
                $box.find('#wscultures').on('change', function () {
                    selectCulture = $(this).val();
                });
            },
            buttons: [{
                text: 'OK',
                primary: true,
                click: function ($box) {
                    // Equivale ao onOk do dialogo CK4.
                    if (selectCulture) ws.setDialectByCulture(selectCulture);
                    try { $box.dialog('close'); } catch (e) {}
                }
            }]
        });
    }

    // Antes em initFunctions(): registrava o CKEDITOR.dialog (CK4) apos
    // initDitadoPro(). O dialogo agora e jQuery UI on-demand em getBoxCtrDitado();
    // aqui so garantimos as classes do plugin definidas (respeitando o gate de
    // configuracao 'revisaotexto', como no original).
    window.getDialogDitado = function () {
        var gated = (typeof window.checkConfigValue === 'function') ? checkConfigValue('revisaotexto') : true;
        if (gated) {
            initDitadoPro();
        }
    };

    // Define langs + classes do plugin (idempotente). Nome preservado para
    // compat com chamadas do monolito.
    window.initDitadoPro = function () {
        buildClasses();
    };

    // Registra a feature (leve: id). Idempotente.
    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'ditado' });
    }
})();
