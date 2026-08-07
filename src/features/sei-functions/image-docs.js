/**
 * Sei Functions Pro — image resizer, Google Docs, DocsToSEI.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    alertaBoxPro,
    resetDialogBoxPro
} from './modules.js';

export function initResizeImg(editor) {
	var window = editor.window.$, document = editor.document.$;
	var snapToSize = (typeof IMAGE_SNAP_TO_SIZE === 'undefined') ? null : IMAGE_SNAP_TO_SIZE;

	var resizer = new Resizer(editor, {snapToSize: snapToSize});

	document.addEventListener('mousedown', function(e) {
	  if (resizer.isHandle(e.target)) {
		resizer.initDrag(e);
	  }
	}, false);

	function selectionChange() {
	  var selection = editor.getSelection();
	  if (!selection) return;
	  // If an element is selected and that element is an IMG
	  if (selection.getType() !== CKEDITOR.SELECTION_NONE && selection.getStartElement().is('img')) {
		// And we're not right or middle clicking on the image
		if (!window.event || !window.event.button || window.event.button === 0) {
		  resizer.show(selection.getStartElement().$);
		}
	  } else {
		resizer.hide();
	  }
	}

	editor.on('selectionChange', selectionChange);

	editor.on('getData', function(e) {
	  var html = e.data.dataValue || '';
	  html = html.replace(/<div id="ckimgrsz"([\s\S]*?)<\/div>/i, '');
	  html = html.replace(/\b(ckimgrsz)\b/g, '');
	  e.data.dataValue = html;
	});

	editor.on('beforeUndoImage', function() {
	  // Remove the handles before undo images are saved
	  resizer.hide();
	});

	editor.on('afterUndoImage', function() {
	  // Restore the handles after undo images are saved
	  selectionChange();
	});

	editor.on('blur', function() {
	  // Remove the handles when editor loses focus
	  resizer.hide();
	});

	editor.on('beforeModeUnload', function self() {
	  editor.removeListener('beforeModeUnload', self);
	  resizer.hide();
	});

	// Update the selection when the browser window is resized
	var resizeTimeout;
	editor.window.on('resize', function() {
	  // Cancel any resize waiting to happen
	  clearTimeout(resizeTimeout);
	  // Delay resize to "debounce"
	  resizeTimeout = setTimeout(selectionChange, 50);
	});
}

export function Resizer(editor, cfg) {
	this.editor = editor;
	this.window = editor.window.$;
	this.document = editor.document.$;
	this.cfg = cfg || {};
	this.init();
}

Resizer.prototype = {
init: function() {
  var container = this.container = this.document.createElement('div');
  container.id = 'ckimgrsz';
  this.preview = this.document.createElement('span');
  container.appendChild(this.preview);
  var handles = this.handles = {
	tl: this.createHandle('tl'),
	tm: this.createHandle('tm'),
	tr: this.createHandle('tr'),
	lm: this.createHandle('lm'),
	rm: this.createHandle('rm'),
	bl: this.createHandle('bl'),
	bm: this.createHandle('bm'),
	br: this.createHandle('br')
  };
  for (var n in handles) {
	container.appendChild(handles[n]);
  }
},
createHandle: function(name) {
  var el = this.document.createElement('i');
  el.classList.add(name);
  return el;
},
isHandle: function(el) {
  var handles = this.handles;
  for (var n in handles) {
	if (handles[n] === el) return true;
  }
  return false;
},
show: function(el) {
  this.el = el;
  if (this.cfg.snapToSize) {
	this.otherImages = toArray(this.document.getElementsByTagName('img'));
	this.otherImages.splice(this.otherImages.indexOf(el), 1);
  }
  var box = this.box = getBoundingBox(this.window, el);
  positionElement(this.container, box.left, box.top);
  this.document.body.appendChild(this.container);
  this.el.classList.add('ckimgrsz');
  this.showHandles();
},
hide: function() {
  // Remove class from all img.ckimgrsz
  var elements = this.document.getElementsByClassName('ckimgrsz');
  for (var i = 0; i < elements.length; ++i) {
	elements[i].classList.remove('ckimgrsz');
  }
  this.hideHandles();
  if (this.container.parentNode) {
	this.container.parentNode.removeChild(this.container);
  }
},
initDrag: function(e) {
	  if (e.button !== 0) {
		//right-click or middle-click
		return;
	  }
	  var resizer = this;
	  var drag = new DragEvent(this.window, this.document);
	  drag.onStart = function() {
		resizer.showPreview();
		resizer.isDragging = true;
		resizer.editor.getSelection().lock();
	  };
	  drag.onDrag = function() {
		resizer.calculateSize(this);
		resizer.updatePreview();
		var box = resizer.previewBox;
		resizer.updateHandles(box, box.left, box.top);
	  };
	  drag.onRelease = function() {
		resizer.isDragging = false;
		resizer.hidePreview();
		resizer.hide();
		resizer.editor.getSelection().unlock();
		// Save an undo snapshot before the image is permanently changed
		resizer.editor.fire('saveSnapshot');
	  };
	  drag.onComplete = function() {
		resizer.resizeComplete();
		// Save another snapshot after the image is changed
		resizer.editor.fire('saveSnapshot');
	  };
	  drag.start(e);
	},
	updateHandles: function(box, left, top) {
	  left = left || 0;
	  top = top || 0;
	  var handles = this.handles;
	  positionElement(handles.tl, -3 + left, -3 + top);
	  positionElement(handles.tm, Math.round(box.width / 2) - 3 + left, -3 + top);
	  positionElement(handles.tr, box.width - 4 + left, -3 + top);
	  positionElement(handles.lm, -3 + left, Math.round(box.height / 2) - 3 + top);
	  positionElement(handles.rm, box.width - 4 + left, Math.round(box.height / 2) - 3 + top);
	  positionElement(handles.bl, -3 + left, box.height - 4 + top);
	  positionElement(handles.bm, Math.round(box.width / 2) - 3 + left, box.height - 4 + top);
	  positionElement(handles.br, box.width - 4 + left, box.height - 4 + top);
	},
	showHandles: function() {
	  var handles = this.handles;
	  this.updateHandles(this.box);
	  for (var n in handles) {
		handles[n].style.display = 'block';
	  }
	},
	hideHandles: function() {
	  var handles = this.handles;
	  for (var n in handles) {
		handles[n].style.display = 'none';
	  }
	},
	showPreview: function() {
	  this.preview.style.backgroundImage = 'url("' + this.el.src + '")';
	  this.calculateSize();
	  this.updatePreview();
	  this.preview.style.display = 'block';
	},
	updatePreview: function() {
	  var box = this.previewBox;
	  positionElement(this.preview, box.left, box.top);
	  resizeElement(this.preview, box.width, box.height);
	},
	hidePreview: function() {
	  var box = getBoundingBox(this.window, this.preview);
	  this.result = {width: box.width, height: box.height};
	  this.preview.style.display = 'none';
	},
	calculateSize: function(data) {
	  var box = this.previewBox = {top: 0, left: 0, width: this.box.width, height: this.box.height};
	  if (!data) return;
	  var attr = data.target.className;
	  if (~attr.indexOf('r')) {
		box.width = Math.max(32, this.box.width + data.delta.x);
	  }
	  if (~attr.indexOf('b')) {
		box.height = Math.max(32, this.box.height + data.delta.y);
	  }
	  if (~attr.indexOf('l')) {
		box.width = Math.max(32, this.box.width - data.delta.x);
	  }
	  if (~attr.indexOf('t')) {
		box.height = Math.max(32, this.box.height - data.delta.y);
	  }
	  //if dragging corner, enforce aspect ratio (unless shift key is being held)
	  if (attr.indexOf('m') < 0 && !data.keys.shift) {
		var ratio = this.box.width / this.box.height;
		if (box.width / box.height > ratio) {
		  box.height = Math.round(box.width / ratio);
		} else {
		  box.width = Math.round(box.height * ratio);
		}
	  }
	  var snapToSize = this.cfg.snapToSize;
	  if (snapToSize) {
		var others = this.otherImages;
		for (var i = 0; i < others.length; i++) {
		  var other = getBoundingBox(this.window, others[i]);
		  if (Math.abs(box.width - other.width) <= snapToSize && Math.abs(box.height - other.height) <= snapToSize) {
			box.width = other.width;
			box.height = other.height;
			break;
		  }
		}
	  }
	  //recalculate left or top position
	  if (~attr.indexOf('l')) {
		box.left = this.box.width - box.width;
	  }
	  if (~attr.indexOf('t')) {
		box.top = this.box.height - box.height;
	  }
	},
	resizeComplete: function() {
	  resizeElement(this.el, this.result.width, this.result.height);
	}
};

export function DragEvent(window, document) {
	this.window = window;
	this.document = document;
	this.events = {
	  mousemove: bind(this.mousemove, this),
	  keydown: bind(this.keydown, this),
	  mouseup: bind(this.mouseup, this)
	};
}

DragEvent.prototype = {
	start: function(e) {
	  e.preventDefault();
	  e.stopPropagation();
	  this.target = e.target;
	  this.attr = e.target.className;
	  this.startPos = {x: e.clientX, y: e.clientY};
	  this.update(e);
	  var events = this.events;
	  this.document.addEventListener('mousemove', events.mousemove, false);
	  this.document.addEventListener('keydown', events.keydown, false);
	  this.document.addEventListener('mouseup', events.mouseup, false);
	  this.document.body.classList.add('dragging-' + this.attr);
	  this.onStart && this.onStart();
	},
	update: function(e) {
	  this.currentPos = {x: e.clientX, y: e.clientY};
	  this.delta = {x: e.clientX - this.startPos.x, y: e.clientY - this.startPos.y};
	  this.keys = {shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey};
	},
	mousemove: function(e) {
	  this.update(e);
	  this.onDrag && this.onDrag();
	  if (e.which === 0) {
		//mouse button released outside window; mouseup wasn't fired (Chrome)
		this.mouseup(e);
	  }
	},
	keydown: function(e) {
	  //escape key cancels dragging
	  if (e.keyCode === 27) {
		this.release();
	  }
	},
	mouseup: function(e) {
	  this.update(e);
	  this.release();
	  this.onComplete && this.onComplete();
	},
	release: function() {
	  this.document.body.classList.remove('dragging-' + this.attr);
	  var events = this.events;
	  this.document.removeEventListener('mousemove', events.mousemove, false);
	  this.document.removeEventListener('keydown', events.keydown, false);
	  this.document.removeEventListener('mouseup', events.mouseup, false);
	  this.onRelease && this.onRelease();
	}
};

//helper functions
// toArray migrada para SeiPro.core.numeros (src/core/numeros.js) — Fase 6

export function bind(fn, ctx) {
	if (fn.bind) {
	  return fn.bind(ctx);
	}
	return function() {
	  fn.apply(ctx, arguments);
	};
}

export function positionElement(el, left, top) {
	el.style.left = String(left) + 'px';
	el.style.top = String(top) + 'px';
}

export function resizeElement(el, width, height) {
	el.style.width = String(width) + 'px';
	el.style.height = String(height) + 'px';
}

export function getBoundingBox(window, el) {
	var rect = el.getBoundingClientRect();
	return {
	  left: rect.left + window.pageXOffset,
	  top: rect.top + window.pageYOffset,
	  width: rect.width,
	  height: rect.height
	};
}
export function setMomentPtBr() {
    moment.defineLocale('pt-br', {
            months : 'janeiro_fevereiro_mar\u00E7o_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
            monthsShort : 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
            weekdays : 'domingo_segunda-feira_ter\u00E7a-feira_quarta-feira_quinta-feira_sexta-feira_s\u00E1bado'.split('_'),
            weekdaysShort : 'dom_seg_ter_qua_qui_sex_s\u00E1b'.split('_'),
            weekdaysMin : 'dom_2\u00AA_3\u00AA_4\u00AA_5\u00AA_6\u00AA_s\u00E1b'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                L : 'DD/MM/YYYY',
                LL : 'D [de] MMMM [de] YYYY',
                LLL : 'D [de] MMMM [de] YYYY [\u00E1s] LT',
                LLLL : 'dddd, D [de] MMMM [de] YYYY [\u00E1s] LT'
            },
            calendar : {
                sameDay: '[Hoje \u00E0s] LT',
                nextDay: '[Amanh\u00E3 \u00E0s] LT',
                nextWeek: 'dddd [\u00E0s] LT',
                lastDay: '[Ontem \u00E0s] LT',
                lastWeek: function () {
                    return (this.day() === 0 || this.day() === 6) ?
                        '[\u00DAltimo] dddd [\u00E1s] LT' : // Saturday + Sunday
                        '[\u00DAltima] dddd [\u00E1s] LT'; // Monday - Friday
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : 'em %s',
                past : '%s atr\u00E1s',
                s : 'segundos',
                m : 'um minuto',
                mm : '%d minutos',
                h : 'uma hora',
                hh : '%d horas',
                d : 'um dia',
                dd : '%d dias',
                M : 'um m\u00EAs',
                MM : '%d meses',
                y : 'um ano',
                yy : '%d anos'
            },
            ordinal : '%dº'
        });
    moment.locale('pt-br');
}

// SINCRONIZA COM GOOGLE DOCS
export var CSSJSON =new function(){var e=this;e.init=function(){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")},String.prototype.repeat=function(e){return new Array(1+e).join(this)}},e.init();var t=/\/\*[\s\S]*?\*\//g,r=/([^\:]+):([^\;]*);/,n=/(\/\*[\s\S]*?\*\/)|([^\s\;\{\}][^\;\{\}]*(?=\{))|(\})|([^\;\{\}]+\;(?!\s*\*\/))/gim,o=function(e){return void 0===e||0==e.length||null==e};e.toJSON=function(i,a){var s={children:{},attributes:{}},u=null,l=0;if(void 0===a)a={ordered:!1,comments:!1,stripComments:!1,split:!1};for(a.stripComments&&(a.comments=!1,i=i.replace(t,""));null!=(u=n.exec(i));)if(!o(u[1])&&a.comments){var f=u[1].trim();s[l++]=f}else if(o(u[2])){if(!o(u[3]))return s;if(!o(u[4])){var c=u[4].trim(),d=r.exec(c);if(d){p=d[1].trim();var m=d[2].trim();if(a.ordered)(S={}).name=p,S.value=m,S.type="attr",s[l++]=S;else if(p in s.attributes){var v=s.attributes[p];v instanceof Array||(s.attributes[p]=[v]),s.attributes[p].push(m)}else s.attributes[p]=m}else s[l++]=c}}else{var p=u[2].trim(),h=e.toJSON(i,a);if(a.ordered){var S;(S={}).name=p,S.value=h,S.type="rule",s[l++]=S}else{if(a.split)var y=p.split(",");else y=[p];for(var b=0;b<y.length;b++){var g=y[b].trim();if(g in s.children)for(var C in h.attributes)s.children[g].attributes[C]=h.attributes[C];else s.children[g]=h}}}return s},e.toCSS=function(e,t,r){var n="";if(void 0===t&&(t=0),void 0===r&&(r=!1),e.attributes)for(i in e.attributes){var o=e.attributes[i];if(o instanceof Array)for(var a=0;a<o.length;a++)n+=u(i,o[a],t);else n+=u(i,o,t)}if(e.children){var s=!0;for(i in e.children)r&&!s?n+="\n":s=!1,n+=l(i,e.children[i],t)}return n},e.toHEAD=function(t,r,i){var n=document.getElementsByTagName("head")[0],u=document.getElementById(r),l=null!==u&&u instanceof HTMLStyleElement;if(!o(t)&&n instanceof HTMLHeadElement){if(l){if(!0!==i&&!o(i))return;u.removeAttribute("id")}(function(e){return!o(e)&&e.attributes&&e.children})(t)&&(t=e.toCSS(t));var f=document.createElement("style");if(f.type="text/css",o(r)?f.id="cssjson_"+s():f.id=r,f.styleSheet?f.styleSheet.cssText=t:f.appendChild(document.createTextNode(t)),n.appendChild(f),a(f))l&&u.parentNode.removeChild(u);else{if(f.parentNode.removeChild(f),!l)return;u.setAttribute("id",r),f=u}return f}},"undefined"!=typeof window&&(window.createCSS=e.toHEAD);var a=function(e){return e instanceof HTMLStyleElement&&e.sheet.cssRules.length>0},s=function(){return Date.now()||+new Date},u=function(e,t,r){return"\t".repeat(r)+e+": "+t+";\n"},l=function(t,r,i){var n="\t".repeat(i)+t+" {\n";return n+=e.toCSS(r,i+1),n+="\t".repeat(i)+"}\n"}};

export function loadGoogleDocs(url, iframeDoc, mode) {
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data){ 
            if ( data ) { 
                console.log(data);
                var r = confirm("Deseja substituir o conte\u00FAdo atual pelo arquivo importado?");
                if (r == true) { 
                    oEditor.focus();
                    oEditor.fire('saveSnapshot');
                    if ( $((mode == 'sheets' ? '#replaceTextSheets' : '#replaceTextDocs')).val() == true ) {
                        iframeDoc.find('body').html(data);
                        oEditor.fire('saveSnapshot');
                        enableButtonSavePro();
                        DocsToSEI(iframeDoc, mode);
                    } else {
                        var select = oEditor.getSelection().getStartElement();
                        var pElement = $(select.$).closest('p');
                        if ( pElement.length > 0 ) {
                            iframeDoc.find(pElement).before(data);
                            oEditor.fire('saveSnapshot');
                            enableButtonSavePro();
                            DocsToSEI(iframeDoc, mode);
                        }
                    }
                    resetDialogBoxPro('dialogBoxPro');
                }
            }
        },
        error: function(data) {
            alertaBoxPro('Error', 'exclamation-triangle', 'Nenhum documento encontrado! \nConfira se o documento est\u00E1 acess\u00EDvel por qualquer pessoa na internet e tente novamente.')
        }
    });
}
export function getBase64Image(imgObj) {
    var imgUrl = imgObj.attr('src');
    var img = new Image();

    // set attributes and src 
    img.setAttribute('crossOrigin', 'anonymous'); //
    img.src = imgUrl;

    // onload fires when the image is fully loadded, and has width and height
    img.onload = function(){

      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
          imgObj.attr('src', dataURL).css({'overflow': '', 'display': '', 'transform': '', 'margin-top': '', 'margin-left': ''}).addClass('img-base64');
          imgObj.closest('span').replaceWith(function() {
             return $('img', this);
          });
    };
}
export function validarTagsPro() {
  for (inst in CKEDITOR.instances) {
    var editor = CKEDITOR.instances[inst];
    if (!editor.readOnly) {
      var tags = ['img', 'button', 'input', 'select', 'iframe', 'frame', 'embed', 'object', 'param', 'video', 'audio', 'form'];
      for (var i = 0; i < tags.length; i++) {
        var elements = editor.document.getElementsByTag(tags[i]);
        if (elements.count() > 0) {
          switch (tags[i]) {
            case 'img':
                var erro=false;
              if (arrImgPermitida.length == 0) {
                console.log('Nao sao permitidas imagens no conteudo.');
                erro=true;
                break;
              } else {
                var posIni = null;
                var posFim = null;
                var n = elements.count();
                for (var j = 0; j < n; j++) {
                  ImgSrc = elements.getItem(j).getAttribute('src');
                  posIni = ImgSrc.indexOf('/');
                  if (posIni != -1) {
                    posFim = ImgSrc.indexOf(';', posIni);
                    if (posFim != -1) {
                      posIni = posIni + 1;
                      if (arrImgPermitida.indexOf(ImgSrc.substr(posIni, (posFim - posIni))) == -1) {
                        console.log('Imagem formato "' + ImgSrc.substr(posIni, (posFim - posIni)) + '" nao permitida.');
                        erro=true;
                        break;
                      }
                    } else {
                      console.log('Nao sao permitidas imagens referenciadas.'); 
                      console.log(ImgSrc, posIni, posFim);
                      erro=true;
                      break;
                    }
                  }
                }
              }
              if (erro) break;
              continue;
            case 'button':
            case 'input':
            case 'select':
              console.log('Nao sao permitidos componentes de formulario HTML no conteudo.');
              break;

            case 'iframe':
              console.log('Nao sao permitidos formularios ocultos no conteúdo.');
              break;

            case 'frame':
            case 'form':
              console.log('Nao sao permitidos formularios no conteúdo.');
              break;

            case 'embed':
            case 'object':
            case 'param':
              console.log('Nao sao permitidos objetos no conteudo.');
              break;

            case 'video':
              console.log('Nao sao permitidos videos no conteudo.');
              break;

            case 'audio':
              console.log('Nao e permitido audio no conteúdo.');
              break;
          }
          return false;
        }
      }
    }
  }
	return true;
}
export function enableButtonSavePro() {
    if (frmEditor.length) {
        var idEditor = $('#idEditor').val();
        $('div#cke_'+idEditor).find('.cke_button__save').removeClass('cke_button_disabled').addClass('cke_button_off').removeAttr('aria-disabled').css('background-color','');
        CKEDITOR.instances[idEditor].commands.save.state = undefined;
        if (CKEDITOR.dialog.getCurrent() != null ) {
            CKEDITOR.dialog.getCurrent().hide();
        }
        console.log('enableButtonSavePro')
    }
}
export function DocsToSEI(iframeDoc, mode) {
    if (mode == 'sheets') {
        iframeDoc.find('body #sheets-viewport div').each(function(){
            var _this = $(this);
            var idTab = _this.attr('id');
            var titleTab = iframeDoc.find('#sheet-button-'+idTab);
                titleTab = (titleTab.length > 0) ? titleTab.text() : false;
                _this.show();
            if (titleTab) {
                _this.prepend(   '<p class="Texto_Alinhado_Esquerda"><br></p>'+
                                '<p class="Texto_Alinhado_Esquerda"><strong>'+titleTab+'</strong></p>'+
                                '<p class="Texto_Alinhado_Esquerda"><br></p>'
                            );
            }
        });
        iframeDoc.find('body #sheets-viewport').css('display', 'contents');
        iframeDoc.find('body #top-bar').remove();
        iframeDoc.find('body #footer').remove();
        iframeDoc.find('body table tbody th.row-headers-background.row-header-shim').remove();
    }
    iframeDoc.find('body link').remove();
    iframeDoc.find('body style').data('style','seipro-import');
    iframeDoc.find('body meta').remove();
    iframeDoc.find('body title').remove();
    iframeDoc.find('body script').remove();
    iframeDoc.find('a').each(function(){
        var urlLink = ( typeof $(this).attr('href') !== 'undefined' && $(this).attr('href') != '' ) ? $(this).attr('href') : '';
            urlLink = ( urlLink != '' && urlLink.indexOf('https://www.google.com/url?q=') !== -1 ) 
                        ? getParamsUrlPro(urlLink).q
                        : urlLink;
        $(this).attr('href', urlLink).attr('target', '_blank').attr('rel', 'noreferrer');
    });
    ImgToBase64(iframeDoc);
    convertCSSToStyle(iframeDoc);
    enableButtonSavePro();
    //setAllLinkTips();
}
export function convertCSSToStyle(iframeDoc) {
    var seiproImport = iframeDoc.find('style[data-style="seipro-import"]');
    if (typeof seiproImport !== 'undefined' && seiproImport.length > 0) {

        seiproImport.each(function(){
            var css = $.map($(this).text().split(';'), function(substr, i) {
                return (substr.indexOf('@import') === -1) ? substr : null;
            }).join(';');
            $(this).text(css);
        });
        var CSSString = seiproImport.html().toString();
        var arrayCSS = CSSJSON.toJSON(CSSString).children;
        for (var key in arrayCSS) {
            if (arrayCSS.hasOwnProperty(key)) {
                var style = arrayCSS[key].attributes;
                var className = key.toString().replace('.','');
                if ( !$.isEmptyObject(style) ) {
                    iframeDoc.find(key).each(function(){
                        if ( (typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'P') || (typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'SPAN') ) {
                            for (var key in style) {
                                if (style.hasOwnProperty(key)) {
                                    if ( key == 'font-style' && style[key] == 'italic' ) {
                                        $(this).wrapInner('<em></em>');
                                    } else if ( key == 'font-weight' && ( style[key] == 'bold' || style[key] == 'bolder' || parseFloat(style[key]) >= 600 ) ) {
                                        $(this).wrapInner('<strong></strong>');
                                    } else if ( key == 'text-decoration' && style[key] == 'underline' ) {
                                        $(this).wrapInner('<u></u>');
                                    } else if ( key == 'text-decoration' && style[key] == 'line-through' ) {
                                        $(this).wrapInner('<s></s>');
                                    } else if ( key == 'vertical-align' && style[key] == 'sub' ) {
                                        $(this).wrapInner('<sub></sub>');
                                    } else if ( key == 'vertical-align' && style[key] == 'super' ) {
                                        $(this).wrapInner('<sup></sup>');
                                    }
                                }
                            }
                        }
                        if ( typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'P' ) {
                            var styleP = ( style['text-align'] == 'center' ) ? 'Texto_Centralizado': 'Texto_Alinhado_Esquerda';
                                styleP = ( $(this).hasClass('Texto_Centralizado') ) ? 'Texto_Centralizado' : styleP;
                                styleP = ( $(this).hasClass('Tabela_Texto_Alinhado_Esquerda') ) ? 'Tabela_Texto_Alinhado_Esquerda' : styleP;
                            var allowed = ['background-color'];
                            var filteredStyle = Object.keys(style)
                                          .filter(key => allowed.includes(key))
                                          .reduce((obj, key) => {
                                            obj[key] = style[key];
                                            return obj;
                                          }, {});
                            $(this).addClass(styleP).removeClass(className);
                        } else if ( typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'TABLE' ) {
                            $(this).css('margin','auto');
                        } else if ( typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'SPAN' ) {
                            var allowed = ['color', 'background-color'];
                            var filteredStyle = Object.keys(style)
                                          .filter(key => allowed.includes(key))
                                          .reduce((obj, key) => {
                                            obj[key] = style[key];
                                            return obj;
                                          }, {});
                            $(this).css(filteredStyle).removeClass(className);
                            if ($.isEmptyObject(filteredStyle)) {
                                $(this).after($(this).html()).remove();
                            }
                        } else if ( (typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'LI') || (typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'UL') ) {
                            var allowed = ['margin', 'margin-left', 'margin-top', 'margin-right', 'margin-left', 'padding', 'padding-left', 'padding-top', 'padding-right', 'padding-left', 'color', 'background-color'];
                            var filteredStyle = Object.keys(style)
                                          .filter(key => allowed.includes(key))
                                          .reduce((obj, key) => {
                                            obj[key] = style[key];
                                            return obj;
                                          }, {});
                            if ( typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'LI' && $(this).find('p.Tabela_Texto_Alinhado_Esquerda').length == 0 ) {
                                $(this).wrapInner('<p></p>').find('p').eq(0).addClass('Tabela_Texto_Alinhado_Esquerda').css('display','contents');
                            }
                            $(this).css(filteredStyle).removeClass(className);
                        } else {
                            $(this).css(style).removeClass(className);
                        }
                    });
                } else {
                    iframeDoc.find(key).each(function(){
                        if (typeof $(this)[0] !== 'undefined' && ( $(this)[0].tagName == 'P' || $(this)[0].tagName == 'SPAN')) {
                            $(this).removeClass(className);
                        }
                    });
                }
            }
        }
    }
    //iframeDoc.find('style[data-style="seipro-import"]').remove();
}
// isBase64 migrada para SeiPro.core.serial (src/core/serial.js) — Fase 6
export function ImgToBase64(iframeDoc, TimeOut = 1000) {
    if (TimeOut <= 0) { 
        iframeDoc.find('img').not('.img-base64').each(function(){
            if (!isBase64($(this).attr('src'))) { 
                $(this).after('<span style="color:#FF0000;"><span style="background-color:#FFFF00;">[!Erro ao converter a imagem!]</span></span>');
                $(this).remove();
            }
        });
        return; 
    }
    iframeDoc.find('img').not('.img-base64').each(function(){
        if (!isBase64($(this).attr('src'))) { 
            getBase64Image($(this));
        }
    });
    setTimeout(function(){ 
        if (!validarTagsPro()) { 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload => '+TimeOut);
            ImgToBase64(iframeDoc, TimeOut - 200); 
        }
    }, 1000);
}
