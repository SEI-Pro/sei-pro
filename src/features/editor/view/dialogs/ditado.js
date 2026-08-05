/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';

export function instanceDitadoPro(oEditor) {
    if (typeof oEditor.ckWebSpeech === 'undefined') {
        if (typeof state.CKWebSpeech !== 'function' || !('webkitSpeechRecognition' in window)) {
            q('.getDitadoButton, .getCtrDitadoButton').closest('.cke_iconPro').addClass('cke_button_disabled');
            return false;
        }

        oEditor.addCommand( 'webspeechDialog', new CKEDITOR.dialogCommand( 'webspeechDialog' ) );

        oEditor.addCommand('webspeechToogle', {
            exec: function( oEditor ) {
                oEditor.ckWebSpeech.toogleSpeech();
            }
        });

        var culture = typeof (oEditor.config.ckwebspeech) === "undefined"
                    ? undefined : typeof oEditor.config.ckwebspeech.culture === "undefined"
                        ?undefined : oEditor.config.ckwebspeech.culture;

            oEditor['ckWebSpeech'] = new state.CKWebSpeech(state.langs, culture, oEditor);

            oEditor.config.ckwebspeech = {
                'culture' : 'pt-BR',
                'commandvoice' : 'ok', // trigger command listener
                'commands': [            // action list
                    {'vai': 'plataform_ai'},
                    {'newline': 'nova linha'},
                    {'newparagraph': 'novo par\u00E1grafo'},
                    {'undo': 'desfazer'},
                    {'redo': 'refazer'}
                ]
            };

        if ( oEditor.contextMenu && typeof oEditor.getMenuItem('webSpeechEnabled') === 'undefined' ) {
            oEditor.addMenuGroup( 'webSpeech', -10 * 3 );
            oEditor.addMenuItem( 'webSpeechEnabled',
                {
                    label : 'Ditado',
                    icon : URL_SPRO + 'icons/editor/webspeech.png',
                    command : 'webspeechToogle',
                    group : 'webSpeech'
                });
            oEditor.contextMenu.addListener( function( element ) {
                // if ( hasSelection(oEditor) ) {
                    return { webSpeechEnabled: CKEDITOR.TRISTATE_OFF};
                // }
            });
        }
    }
}
export function getBoxDitado(this_) {
    api.setParamEditor(this_);
    var btn = q(this_);
	if (!state.oEditor?.ckWebSpeech || btn.closest('.cke_button_disabled').length) return false;
	if ( btn.hasClass('cke_button_off') ) {
        btn.addClass('cke_button_on').removeClass('cke_button_off');
	} else {
        btn.addClass('cke_button_off').removeClass('cke_button_on');
	}
    state.oEditor.execCommand('webspeechToogle');
}
export function getBoxCtrDitado(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog('webspeechDialog');
}
export function initDitadoPro() {
    state.langs =
	[
	['Afrikaans', 			['af-ZA']],
	['Bahasa Indonesia',	['id-ID']],
	['Bahasa Melayu', 		['ms-MY']],
	['Catal\u00E0', 		['ca-ES']],
	['\u010Ce\u0161tina', 	['cs-CZ']],
	['Deutsch',         	['de-DE']],
	['English',         	['en-AU', 'Australia'],
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
	['Euskara',         	['eu-ES']],
	['Fran\u00E7ais',       ['fr-FR']],
	['Galego',          	['gl-ES']],
	['Hrvatski',        	['hr_HR']],
	['IsiZulu',         	['zu-ZA']],
	['\u00CDslenska',        ['is-IS']],
	['Italiano',        	['it-IT', 'Italia'],
							['it-CH', 'Svizzera']],
	['Magyar',          	['hu-HU']],
	['Nederlands',      	['nl-NL']],
	['Norsk bokm\u00E5l',   ['nb-NO']],
	['Polski',          	['pl-PL']],
	['Portugu\u00EAs',      ['pt-BR', 'Brasil'],
							['pt-PT', 'Portugal']],
	['Rom\u00E2n\u0103',    ['ro-RO']],
	['Sloven\u010Dina',     ['sk-SK']],
	['Suomi',           	['fi-FI']],
	['Svenska',         	['sv-SE']],
	['T\u00FCrk\u00E7e',    ['tr-TR']],
	['\u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438',       	['bg-BG']],
	['P\u0443\u0441\u0441\u043A\u0438\u0439',         					['ru-RU']],
	['\u0421\u0440\u043F\u0441\u043A\u0438',          					['sr-RS']],
	['\uD55C\uAD6D\uC5B4',            									['ko-KR']],
	['\u4E2D\u6587',             										['cmn-Hans-CN', '\u666E\u901A\u8BDD (\u4E2D\u56FD\u5927\u9646)'],
							['cmn-Hans-HK', '\u666E\u901A\u8BDD (\u9999\u6E2F)'],
							['cmn-Hant-TW', '\u4E2D\u6587 (\u53F0\u7063)'],
							['yue-Hant-HK', '\u7CB5\u8A9E (\u9999\u6E2F)']],
	['\u65E5\u672C\u8A9E',  ['ja-JP']],
	['Lingua lat\u012Bna',  ['la']]
	];

    state.CKWebSpeechHandler = function(oEditor) {
        this._editor = oEditor;
        this._currentCulture = {val: 'pt-BR', langVal: 19};
        this._elmtPlugIcon;
        this._plugPath;
        this._recognizing;
        this._recognition;
        this._ignoreOnend;
        this._start_timestamp;
        this._working;
        this.CKWebSpeechHandler();
    }

    state.CKWebSpeechHandler.prototype.CKWebSpeechHandler = function() {
        this._recognition;
        this._plugPath = URL_SPRO;
        this._recognizing = false;
        this._ignoreOnend = false;
        this._working = false;
        this.getElementPluginIcon();
        this.initServiceSpeech();
    }
    state.CKWebSpeechHandler.prototype.isUnlockedService = function() {
        if (!('webkitSpeechRecognition' in window))
            return false;
        return true;
    }
    state.CKWebSpeechHandler.prototype.getElementPluginIcon = function() {
        var obj = this; var cont =0;

        var listener = setInterval(function(){
            cont++;
            var element;
            try
                {element = document.getElementById(obj._editor.ui.instances.Webspeech._.id);}
            catch(err)
                {element = null;}

            if(element !== null) {
                obj._elmtPlugIcon = element.getElementsByClassName('cke_button__webspeech_icon')[0];
                clearInterval(listener);
            }
            if(cont == 500) clearInterval(listener);
        }, 1);
    }

    state.CKWebSpeechHandler.prototype.updateIcons = function() {
        var toolbar = q('#cke_'+this._editor.name);
        if(this._recognizing){
            toolbar.find('.cke_button__ditado_icon').css('background','url(\''+URL_SPRO+'icons/editor/webspeech-enable.gif\')');
            toolbar.find('.getDitadoButton').addClass('cke_button_on').removeClass('cke_button_off');

        }else{
            toolbar.find('.cke_button__ditado_icon').css('background','url(\''+URL_SPRO+'icons/editor/webspeech.png\')');
            toolbar.find('.getDitadoButton').addClass('cke_button_off').removeClass('cke_button_on');
        }
    }

    state.CKWebSpeechHandler.prototype.initServiceSpeech = function() {
        if(this.isUnlockedService())
        {
            this._recognition = new webkitSpeechRecognition();
            this._recognition.continuous = true;
            this._recognition.interimResults = false;

            var self = this
            this._recognition.onstart = function(){ self.onStart() };
            this._recognition.onerror = function(event){ self.onError(event) };
            this._recognition.onend = function(){ self.onEnd() };
            this._recognition.onresult = function(event){ self.onResult(event) };
            this._recognition.onspeechstart = function(event){self.onSpeech()};
            this._recognition.onspeechend = function(event){self.onSpeechEnd()};
        }
    }

    state.CKWebSpeechHandler.prototype.onStart = function() {
        //console.log(this)
        this._recognizing = true;
        this.updateIcons();
    }

    state.CKWebSpeechHandler.prototype.onError = function(event) {
        if (event.error == 'no-speech') {
            //start_img.src = '/media/images-webspeech/mic.gif
            //console.log('info_no_speech');
            this._ignoreOnend = true;
        }
        if (event.error == 'audio-capture') {
            //start_img.src = '/media/images-webspeech/mic.gif';
            //showInfo('info_no_microphone');
            //console.log('auddio_capture');
            this._ignoreOnend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - this._start_timestamp < 100) {
                //console.log('info_blocked');//showInfo('info_blocked');
            } else {
                //console.log('info_denied');//showInfo('info_denied');
            }
            this._ignoreOnend = true;
        }
        this.updateIcons();
    }

    state.CKWebSpeechHandler.prototype.onEnd = function() {
        this._recognizing = false;
        this._ignoreOnend = false;
        this.updateIcons();
    }
    state.CKWebSpeechHandler.prototype.onSpeech = function(event)  {
        // this._elmtPlugIcon.style.backgroundImage = 'url(' +  this._plugPath
                // + 'icons/editor/speech.gif)';
    }

    state.CKWebSpeechHandler.prototype.onSpeechEnd = function(event) {
        this.updateIcons();
    }

    state.CKWebSpeechHandler.prototype.onResult = function(event) {
        if (typeof(event.results) == 'undefined') {
            this._recognizing = false;
            this._recognition.onend = null;
            this._recognition.stop();
            this.updateIcons();
        //upgrade();
            return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                var t = ' '+event.results[i][0].transcript+' ';

                if (t.match(/.* nova linha .*/) || t.match(/.* ponto final .*/) || t.match(/.* novo par\u00E1grafo .*/)) {
                    var l = (t.match(/.* nova linha .*/)) ? t.trim().split('nova linha') : t;
                        l = (t.match(/.* ponto final .*/)) ? t.trim().split('ponto final') : l;
                        l = (t.match(/.* novo par\u00E1grafo .*/)) ? t.trim().split('novo par\u00E1grafo') : l;
                        l = l.filter( n => n);
                    if (l.length) {
                        var _this = this;
                        q.each(l, function(i, v){
                            if (v.trim() != '') {
                                var ponto = (i < l.length-1) ? '.' : '';
                                    v = _this.replaceTranscript(v);
                                    _this._editor.insertText(v+ponto);
                                    if (ponto != '') state.oEditor.execCommand('enter');
                            }
                        });
                    } else {
                        state.oEditor.execCommand('enter');
                    }
                } else if (t.trim().toLocaleLowerCase() == 'desfazer') {
                    state.oEditor.execCommand('undo');
                } else if (t.trim().toLocaleLowerCase() == 'refazer') {
                    state.oEditor.execCommand('redo');
                } else {
                    t = this.replaceTranscript(t);
                    this._editor.insertText(t);
                }
            }
        }
    }

    state.CKWebSpeechHandler.prototype.replaceTranscript = function(t) {
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
        return space+t.trim();
    }
    state.CKWebSpeechHandler.prototype.toogleSpeech = function() {
        if (!this._recognition) return false;
        if(!this._recognizing){
                this._recognition.lang = this._currentCulture.val;
                this._recognition.start();
                this._ignoreOnend = false;
                this._start_timestamp = new Date().getTime();
            }
        else
            {this._recognition.stop();}
    }

    state.CKWebSpeech = function(langs, culture, oEditor){
        state.CKWebSpeechHandler.call(this, oEditor);
        this._langs = state.langs;
        this.CKWebSpeech(culture);
    }

    state.CKWebSpeech.prototype = Object.create( state.CKWebSpeechHandler.prototype );

    state.CKWebSpeech.prototype.CKWebSpeech = function(_culture){
        if(typeof _culture !== "undefined")
            this.setDialectByCulture(_culture);
    }

    state.CKWebSpeech.prototype.setDialectByCulture = function(_culture) {
        for (var i = 0; i < this._langs.length; i++) {
            for (var j = 1; j < this._langs[i].length; j++) {
                if(this._langs[i][j][0].toLowerCase() == _culture.toLowerCase())
                {
                    this._currentCulture ={val: this._langs[i][j][0], langVal: i};
                    return this._currentCulture;
                }//FALTA COLOCAR EN COOKIE
            };
        };
        return this._currentCulture;
    }

    state.CKWebSpeech.prototype.setDialectByLanguage = function(_langVal) {
        this.setDialectByCulture(this._langs[_langVal][1][0]);
    }

    state.CKWebSpeech.prototype.getLanguages = function() {
        var _languages = new Array();
        for (var i = 0; i < this._langs.length; i++) {
            _languages.push(new Array(this._langs[i][0], i));
        };
        return _languages;
    }

    state.CKWebSpeech.prototype.getCultures = function(_langVal) {

        if(typeof _langVal === "undefined")
            _langVal = this._currentCulture.langVal;

        var _cultures = new Array();
        for (var i = 1; i < this._langs[_langVal].length; i++) {
            _cultures.push( new Array(this._langs[_langVal][i][0]));
        };
        return  _cultures;
    }
    var extern;

    state.wsDialogHtml = function() {
        this.updateCulturesSelect = function(elmtCulture, options)
        {
            var select_dialect = document.getElementById(elmtCulture._.inputId);

            for (var i = select_dialect.options.length - 1; i >= 0; i--) {
                select_dialect.remove(i);
            }

            for (var i = 0; i < options.length; i++) {
                select_dialect.options.add(new Option(options[i], options[i]));
            }

        }
    }
}
export function getDialogDitado() {
    if (checkConfigValue('ditado')) {
        api.initDitadoPro();
        CKEDITOR.dialog.add( 'webspeechDialog', function ( oEditor ) {
            var wsDialogDom = new state.wsDialogHtml();
            var selectCulture = state.oEditor.ckWebSpeech._currentCulture.val;

            return {
                title: 'Configura\u00E7\u00F5es do Ditado',
                minWidth: 400,
                minHeight: 200,
                contents: [
                    {
                        id: 'tab-basic',
                        label: 'Configura\u00E7\u00F5es b\u00E1sicas',
                        elements: [
                            {
                                type: 'select',
                                id: 'wslanguages',
                                label: 'Idioma',
                                items: state.oEditor.ckWebSpeech.getLanguages(),
                                'default': state.oEditor.ckWebSpeech._currentCulture.langVal,
                                onChange: function( api ) {
                                    var dialog = CKEDITOR.dialog.getCurrent();
                                    var selCultures = dialog.getContentElement('tab-basic', 'wscultures');
                                    var options = state.oEditor.ckWebSpeech.getCultures(api.data.value);
                                    selCultures.setup({selCultures : selCultures, options : options});
                                    selCultures.fire('change', {value : options[0][0]}, state.oEditor);
                                },
                                onShow: function(data) {
                                    var dialog = CKEDITOR.dialog.getCurrent();
                                    var selLanguages = dialog.getContentElement('tab-basic', 'wslanguages');
                                    document.getElementById(selLanguages._.inputId).value =
                                        state.oEditor.ckWebSpeech._currentCulture.langVal;
                                }
                            },
                            {
                                type: 'select',
                                id: 'wscultures',
                                label: 'Cultura',
                                items: state.oEditor.ckWebSpeech.getCultures(),
                                'default': state.oEditor.ckWebSpeech._currentCulture.val,
                                onChange: function( api ) {
                                    selectCulture = api.data.value;
                                },
                                setup: function(data) {
                                    wsDialogDom.updateCulturesSelect(data.selCultures, data.options);
                                },
                                onShow: function(data) {
                                    var dialog = CKEDITOR.dialog.getCurrent();
                                    var selCultures = dialog.getContentElement('tab-basic', 'wscultures');
                                    //console.log(selCultures);
                                    document.getElementById(selCultures._.inputId).value =
                                        state.oEditor.ckWebSpeech._currentCulture.val;
                                }
                            }
                        ]
                    },
                    {
                        id: 'tab-adv',
                        label: 'Advanced Settings',
                        elements: [

                        ]
                    }
                ],
                onOk: function() {
                    oEditor.ckWebSpeech.setDialectByCulture(selectCulture);
                }
            };
        });
    }
}
api.instanceDitadoPro = instanceDitadoPro;
api.getBoxDitado = getBoxDitado;
api.getBoxCtrDitado = getBoxCtrDitado;
api.initDitadoPro = initDitadoPro;
api.getDialogDitado = getDialogDitado;
