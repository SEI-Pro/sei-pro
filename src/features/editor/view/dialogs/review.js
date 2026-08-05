/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';
import { createReviewMetadata, reviewMatchesBulkMode } from '../../domain/review.js';

export function setStyleReview(type = 'add' , mode = 'insert', text = '', addSp = false, pClass = false) {
    var reviewMetadata = createReviewMetadata(
        getOptionsPro('usuarioSistema') ? getOptionsPro('usuarioSistema') : ''
    );
    var userReview = reviewMetadata.author;
    var dateReview = reviewMetadata.legacyDate;
    var timeReview = reviewMetadata.time;
    var reviewRef = randomString(8);
    if (mode == 'change') {
        var styleBgColor = new CKEDITOR.style({
            element: 'span',
            attributes: {
                'data-review': type,
                'data-author': userReview,
                'data-time': timeReview,
                'data-user-review': userReview,
                'data-date-review': dateReview,
                'data-id-review': reviewRef,
                'class': 'reviewSeiPro',
                'style': (type == 'add') ? 'background-color: #F0F8FF' : 'background-color: #FFF0F5'
            }
        });

        var styleTxtColor = new CKEDITOR.style({
            element: (type == 'add') ? 'u' : 's',
            attributes: {
                'data-review': type,
                'data-author': userReview,
                'data-time': timeReview,
                'data-user-review': userReview,
                'data-date-review': dateReview,
                'data-id-review': reviewRef,
                'class': 'reviewSeiPro',
                'style': (type == 'add') ? 'color:#0000FF' : 'color:#FF0000'
            }
        });

        state.oEditor.applyStyle(styleBgColor);
        state.oEditor.applyStyle(styleTxtColor);
    } else if (mode == 'insert') {
        var inserHtml = '<span data-review="'+type+'" class="reviewSeiPro" data-id-review="'+reviewRef+'" data-author="'+userReview+'" data-time="'+timeReview+'" data-date-review="'+dateReview+'" data-user-review="'+userReview+'" style="background-color:'+(type == 'add' ? '#F0F8FF' : '#FFF0F5')+';"><'+(type == 'add' ? 'u' : 's')+' style="color:'+(type == 'add' ? '#0000FF' : '#FF0000')+';">'+text+'</'+(type == 'add' ? 'u' : 's')+'></span>'+(addSp ? '<span class="reviewSP">&nbsp;</span> ' : '');
            if (pClass) {
                state.oEditor.insertHtml('<p class="'+pClass+'">'+inserHtml+'</p> ');
            } else {
                state.oEditor.insertHtml(inserHtml);
            }
    }
}
export function showReviewTips(this_, iframeDoc) {
    iframeDoc.find('.reviewDisplayPro').remove();

    var elem = q(this_).closest('span');
    var userReview = elem.attr('data-user-review');
        userReview = q("<div/>").text(userReview).html();
    var dateReview = elem.attr('data-date-review');
        dateReview = q("<div/>").text(dateReview).html();
    var typeReview = elem.attr('data-review');
    var idReview = elem.attr('data-id-review');
    var commentReview = elem.attr('data-comment');
        commentReview = (typeof commentReview === 'undefined') ? '' : q("<div/>").text(commentReview).html();

    var html =  api.getHtmlReviewDisplayPro({
        date: dateReview,
        id_review: idReview,
        type: typeReview,
        user: userReview,
        comment: commentReview,
        text: false
    });

        elem.prepend(html);

        var boxDisplayLink = elem.find('.reviewDisplayPro');
        var boxDisplayLink_left = boxDisplayLink.offset().left;
        var boxDisplayLink_width = boxDisplayLink.width();
        var windowWidth = q(window).width();
        var margin = ( boxDisplayLink_left+boxDisplayLink_width > windowWidth ) ? windowWidth-(boxDisplayLink_left+boxDisplayLink_width+45) : 0;
            boxDisplayLink.css('margin-left', margin);
    console.log(elem[0], iframeDoc);
}
export function scroolToReview(idReview) {
    q('iframe.cke_wysiwyg_frame').each(function(index){
        var iframe_ = q(this).contents();
        if ( iframe_.find('body').attr('contenteditable') == 'true' ) {
                var container = q('#divEditores');
                var element = iframe_.find('.reviewSeiPro[data-id-review="'+idReview+'"]').closest('p');
                var position = element.offset().top + 200;
                container.animate({
                    scrollTop: position
                });
                return false;
        }
    });
}
export function getHtmlReviewDisplayPro(data, readonly = false) {
    var textCommentReview = (data.comment == '') ? 'Adicionar coment\u00E1rio' : data.comment;
        textCommentReview = (data.comment == '' && readonly) ? 'Nenhum coment\u00E1rio' : textCommentReview;
    var html =  '<div class="reviewDisplayPro" unselectable="on">'+
                '    <span contenteditable="false">'+
                (data.text
                    ? '<span style="margin:5px;display:block;"><span style="background-color:'+(data.type == 'add' ? '#F0F8FF' : '#FFF0F5')+';"><'+(data.type == 'add' ? 'u' : 's')+' style="color:'+(data.type == 'add' ? '#0000FF' : '#FF0000')+';">'+data.text+'</'+(data.type == 'add' ? 'u' : 's')+'></span></span>'
                    : ''
                )+
                (data.html
                    ? '<div class="textReview" data-seipro-action="scroolToReview" data-seipro-review-id="'+data.id_review+'" title="Clique para rolar até o texto">'+data.html+'</div>'
                    : ''
                )+
                '        <span style="color: #777;font-size: 90%;margin-left:5px;"><i class="fas fa-user" style="padding-right: 5px;font-size: 90%;color: #4285f4;"></i><span class="info"></span><strong class="title-reviewtip" title="'+data.user+'">'+data.user+'</strong></span>'+
                '        <span style="color: #777;font-size: 80%;margin-left:10px;font-style: italic;"><i class="far fa-clock" style="color: #777;"></i> '+data.date+'</span>'+
                '        <span class="action" style="float: right;font-size: 80%;margin-left:10px;cursor:pointer;color: #9CB639;" data-seipro-action="removeReviewPro" data-readonly="'+readonly+'" data-id-review="'+data.id_review+'" data-mode="accept" data-type="'+data.type+'" title="Aceitar revis\u00E7\u00E3o"><i class="fas fa-check-circle" style="color: #9CB639;"></i> Aceitar</span>'+
                '        <span class="action" style="float: right;font-size: 80%;margin-left:10px;cursor:pointer;color: #E46E64;" data-seipro-action="removeReviewPro" data-readonly="'+readonly+'" data-id-review="'+data.id_review+'" data-mode="reject" data-type="'+data.type+'" title="Rejeitar revis\u00E7\u00E3o"><i class="fas fa-times-circle" style="color: #E46E64;"></i> Rejeitar</span>'+
                (getOptionsPro('usuarioSistema') == data.user && !readonly
                    ? '        <span data-seipro-action="addCommentReviewPro" data-info="'+(data.comment == '' ? 'new' : 'update')+'" style="color: #777;font-size: 90%;display:block;font-style: italic;margin: 10px 0 5px 0;padding: 5px;border-radius:5px;"><i class="fas fa-comment" style="margin-right: 5px;font-size: 90%;color: #e9af68;transform: scale(-1, 1);"></i><span class="commentReview info" style="padding: 3px;">'+textCommentReview+'<span></span>'
                    : (data.comment == '' && !readonly ? '' : '<span style="color: #777;font-size: 90%;display:block;font-style: italic;margin: 10px 0 5px 0;padding: 5px;border-radius:5px;"><i class="fas fa-comment" style="margin-right: 5px;font-size: 90%;color: #e9af68;transform: scale(-1, 1);"></i><span class="commentReview info">'+textCommentReview+'<span></span>')
                )+
                '    </span>'+
                '</div>';
    return html;
}
export function addCommentReviewPro(this_) {
    var _this = q(this_);
    var _target = _this.data('readonly') ? _this : _this;
    var _info = _this.find('.commentReview');

    if (_this.attr('data-info') == 'new') _info.html('');
        _info.prop('contenteditable',true).focus().on('keydown',function(e) {
            setTimeout(function(){
                var text = _info.text().trim();
                if (text != '') {
                    _this.attr('data-info','update');
                    _this.closest('.reviewSeiPro').attr('data-comment',text.replace(/(\r\n|\n|\r)/gm, ' ')).attr('data-date-review',createReviewMetadata().legacyDate);
                } else {
                    _this.attr('data-info','new');
                    _this.closest('.reviewSeiPro').removeAttr('data-comment');
                }
            }, 100);
        });
}
export function removeReviewPro(this_) {
    var _this = q(this_);
    var _data = _this.data();

    state.oEditor.fire('saveSnapshot');
    q('iframe.cke_wysiwyg_frame').each(function(index){
        if ( q(this).contents().find('body').attr('contenteditable') == 'true' ) {
            api.setRemoveReviewPro(_this, q(this).contents(), _data);
            state.oEditor.fire('saveSnapshot');
        }
    });
}
export function setRemoveReviewPro(_this, iframeEditor, _data) {
    iframeEditor.find('.reviewDisplayPro').remove();
    if (_data.mode == 'acceptAll' || _data.mode == 'acceptMine') {
        var currentAuthor = getOptionsPro('usuarioSistema');
        iframeEditor.find('.reviewSeiPro').each(function(){
            var rv = q(this);
            if (!reviewMatchesBulkMode({
                author: rv.attr('data-user-review')
            }, _data.mode, currentAuthor)) return;
            if (rv.data('review') == 'add') {
                rv.prev('span.reviewSP').remove();
                rv.after(rv.text()).remove();
            } else if (rv.data('review') == 'delete') {
                rv.remove();
            }
        });
    } else if (_data.mode == 'rejectAll') {
        iframeEditor.find('.reviewSeiPro').each(function(){
            var rv = q(this);
            if (rv.data('review') == 'add') {
                rv.prev('span.reviewSP').remove();
                rv.remove();
            } else if (rv.data('review') == 'delete') {
                rv.after(rv.text()).remove();
            }
        });
    } else if (_data.mode == 'accept') {
        if (_data.type == 'add') {
            var elemReview = iframeEditor.find('span[data-id-review="'+_data.idReview+'"]');
            elemReview.prev('span.reviewSP').remove();
            elemReview.after(elemReview.text()).remove();
            if (_data.readonly) _this.closest('.reviewDisplayPro').slideUp('slow', function() { _this.closest('.reviewDisplayPro').remove() });
            return false;
        } else if (_data.type == 'delete') {
            var elemReview = iframeEditor.find('span[data-id-review="'+_data.idReview+'"]');
            elemReview.remove();
            if (_data.readonly) _this.closest('.reviewDisplayPro').slideUp('slow', function() { _this.closest('.reviewDisplayPro').remove() });
            return false;
        }
    } else if (_data.mode == 'reject') {
        if (_data.type == 'add') {
            var elemReview = iframeEditor.find('span[data-id-review="'+_data.idReview+'"]');
            elemReview.prev('span.reviewSP').remove();
            elemReview.remove();
            if (_data.readonly) _this.closest('.reviewDisplayPro').slideUp('slow', function() { _this.closest('.reviewDisplayPro').remove() });
            return false;
        } else if (_data.type == 'delete') {
            var elemReview = iframeEditor.find('span[data-id-review="'+_data.idReview+'"]');
            elemReview.after(elemReview.text()).remove();
            if (_data.readonly) _this.closest('.reviewDisplayPro').slideUp('slow', function() { _this.closest('.reviewDisplayPro').remove() });
            return false;
        }
    }
    if (_data.mode == 'acceptAll' || _data.mode == 'acceptMine' || _data.mode == 'rejectAll') {
        setTimeout(function(){
            api.contentDialogReview('<span style="font-size: 12pt;"><i class="fas fa-check verdeColor" style="margin-right: 5px;"></i>Revis\u00F5es realizadas com sucesso</span>');
            setTimeout(function(){ CKEDITOR.dialog.getCurrent().hide() },3000);
        },500);
    }
}
export function hideReviewTips(iframeDoc) {
    if (iframeDoc.find('.reviewDisplayPro:hover').length == 0) {
        iframeDoc.find('.reviewDisplayPro').remove();
    }
}
export function getStyleReview(evt) {
    var keycode = evt.data.keyCode;
    var wordKey = evt.data.domEvent.$.key;
    var sel = state.oEditor.getSelection();
    var select = sel.getStartElement();
    var spanElement = q(select.$).closest('span');
    var selectTxt = sel.getSelectedText();

    if (spanElement.hasClass('commentReview')) return false;
    // console.log(keycode, wordKey, selectTxt, evt);

    if (selectTxt == '' && keycode == 8 && (spanElement.length == 0 || (spanElement.length && spanElement.data('review') != 'add'))) {
        state.oEditor.fire('saveSnapshot');
        var newRange = api.setPositionCursor();
        var wordDeleted = getCharOnCursor('prev');
            wordDeleted = (wordDeleted == ' ') ? '&nbsp;' :  wordDeleted;

            setStyleReview('delete', 'insert', wordDeleted);
            sel.selectRanges([ newRange ]);
            oEditor.fire('saveSnapshot');
            // console.log(wordDeleted);

    } else if (selectTxt == '' && keycode == 46) {
        state.oEditor.fire('saveSnapshot');
        var newRange = api.setPositionCursor();
        var wordDeleted = getCharOnCursor('next');

            setStyleReview('delete', 'insert', wordDeleted);
            //oEditor.getSelection().selectRanges([ newRange ]);
            oEditor.fire('saveSnapshot');
            // console.log(wordDeleted);

    } else {
        if (wordKey != 'Shift' && wordKey != 'Meta' && wordKey.indexOf('Arrow') === -1) {
            if (selectTxt != '' ) {
                state.oEditor.fire('saveSnapshot');
                var insetSp = (keycode == 46 || keycode == 32) ? '' : wordKey;
                    insetSp = (keycode == 8) ? ' ' : insetSp;

                    if (selectTxt.indexOf('\n\n') !== -1) {
                        var listElem = api.setListElementsSelected();
                        // console.log(listElem);
                        q.each(listElem,function(i, v){
                            console.log(i, v.attr('class'));
                            api.setStyleReview('delete', 'insert', v.text(), true, v.attr('class'));
                        });
                        state.oEditor.fire('saveSnapshot');
                    } else {
                        api.setStyleReview('delete', 'insert', selectTxt, true);
                        setStyleReview('add', 'insert', insetSp);
                        state.oEditor.fire('saveSnapshot');
                    }

                    var _select = state.oEditor.getSelection().getStartElement();
                    var _spanElement = q(_select.$).closest('span');
                    if (keycode != 8 && keycode != 46 && _spanElement.length && _spanElement.data('review') == 'add') {
                        var newRange = api.setPositionCursor();

                        setTimeout(function(){
                            _spanElement.find('u').text(wordKey);
                            state.oEditor.getSelection().selectRanges([ newRange ]);
                        });
                    }
                    // console.log(_spanElement[0], keycode, wordKey);

            } else {
                if (spanElement.length == 0 || (spanElement.length && spanElement.data('review') != 'add')) {
                    state.oEditor.fire('saveSnapshot');
                    setStyleReview('add','change');
                    // console.log('add insert');
                    state.oEditor.fire('saveSnapshot');
                }
            }
        }
    }
}
export function setListElementsSelected() {
    var init = state.oEditor.getSelection().getNative();
    var start = q(init.focusNode.parentNode);
    var end = q(init.baseNode.parentNode);
    var list = [];

    function add(elem) {
        var next = elem.next();
            list.push(elem.clone());
        if (end[0] != elem[0]) add(next);
    }
    add(start);

    return list;
}
export function setPositionCursor() {
    var oldRanges = state.oEditor.getSelection().getRanges();
    var oldRange = oldRanges[oldRanges.length - 1];
    var newRange = state.oEditor.createRange();
        newRange.setStart(oldRange.endContainer, oldRange.endOffset);
        newRange.setEnd(oldRange.endContainer, oldRange.endOffset);
    return newRange;
}
export function getBoxCtrReview(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog('ReviewSEI');
}
export function contentDialogReview(alertText = '<span style="font-size: 12pt;"><i class="fas fa-info-circle laranjaColor" style="margin-right: 5px;"></i>Nenhuma revis\u00E3o identificada</span>') {
    var listReviews = q('iframe[title*="txaEditor_"]').map(function(v, i){
        var _this = q(this);
        var body = _this.contents().find('body');
        api.hideReviewTips(_this);
        if ( body.attr('contenteditable') == 'true' ) {
            var review = body.find('.reviewSeiPro').map(function(){
                var _data = q(this).data();
                var html = q(this).closest('p').clone().find('.reviewSeiPro[data-id-review="'+_data.idReview+'"]').addClass('reviewHighlights').end().html();
                    q(this).find('.reviewDisplayPro').remove();

                return api.getHtmlReviewDisplayPro({
                    date: _data.dateReview,
                    id_review: _data.idReview,
                    type: _data.review,
                    user: _data.userReview,
                    comment: typeof _data.comment === 'undefined' ? '' : _data.comment,
                    text: false,
                    html: html
                }, true);
            }).get().join('');
            return review;
        }
    }).get().join('');

    var btnControlReject =  '<div style="margin: 10px 0 !important;display: inline-block;width: 95%;">'+
                            '   <span class="action" style="font-size: 11pt;float: right;margin-left:10px;cursor:pointer;color: #9CB639;" data-seipro-action="removeReviewPro" data-mode="acceptAll" title="Aceitar todas as revis\u00F5es"><i class="fas fa-check-circle" style="font-size: 11pt;color: #9CB639;"></i> Aceitar todas</span>'+
                            '   <span class="action" style="font-size: 11pt;float: right;margin-left:10px;cursor:pointer;color: #4285F4;" data-seipro-action="removeReviewPro" data-mode="acceptMine" title="Aceitar somente minhas revis\u00F5es"><i class="fas fa-user-check" style="font-size: 11pt;color: #4285F4;"></i> Aceitar minhas</span>'+
                            '   <span class="action" style="font-size: 11pt;float: left;margin-left:10px;cursor:pointer;color: #E46E64;" data-seipro-action="removeReviewPro" data-mode="rejectAll" title="Rejeitar todas as revis\u00F5es"><i class="fas fa-times-circle" style="font-size: 11pt;color: #E46E64;"></i> Rejeitar todas</span>'+
                            '</div>';

    q('#boxReviews').html(listReviews == '' ? alertText : btnControlReject+listReviews);
}
export function getDialogReview() {
    var htmlReview =   '<div style="padding-bottom: 10px;overflow: auto;max-height: 400px;text-align: center;" id="boxReviews"></div>';
    CKEDITOR.dialog.add( 'ReviewSEI', function(editor)
      {
         return {
            title : 'Gerenciar Revis\u00F5es',
            minWidth : 700,
            minHeight : 280,
            buttons: [],
            onShow : function() {
                api.contentDialogReview();
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Revis\u00F5es',
                  elements :
                  [
                    {
             			type: 'html',
             			html: htmlReview
             		}
                  ]
               }
            ]
         };
      } );
}
export function getBoxReview(this_) {
    var btn = q(this_);
	if ( btn.hasClass('cke_button_off') ) {
        btn.addClass('cke_button_on').removeClass('cke_button_off');
	    setReviewButtonLabel(btn, true);
        api.initStyleReview(btn[0]);
	} else {
		btn.addClass('cke_button_off').removeClass('cke_button_on');
	    setReviewButtonLabel(btn, false);
	}
}
function setReviewButtonLabel(btn, active) {
    var label = active ? 'Desativar revisão de texto' : 'Ativar revisão de texto';
    btn.attr('aria-label', label)
        .attr('onmouseover', "return infraTooltipMostrar('"+label+"')")
        .find('.cke_button_label').text(label);
}
export function initStyleReview(button) {
    var editor = state.oEditor;
    var loaded = Array.isArray(window.loadedStyleReview) ? window.loadedStyleReview : [];
    if (loaded.includes(editor.name)) {
        return false;
    } else {
        editor.on('key', function (evt) {
            if (q(button).hasClass('cke_button_on')) api.getStyleReview(evt);
        });
        loaded.push(editor.name);
        window.loadedStyleReview = loaded;
    }
}

// CKWebSpeech
// CKWebSpeech is a speech recognition plugin to CKEditor, it type out voice ideas into CKEdtior, with support for 32 languages from 62 culture variants.
// https://github.com/ultranaco/ckwebspeech

api.setStyleReview = setStyleReview;
api.showReviewTips = showReviewTips;
api.scroolToReview = scroolToReview;
api.getHtmlReviewDisplayPro = getHtmlReviewDisplayPro;
api.addCommentReviewPro = addCommentReviewPro;
api.removeReviewPro = removeReviewPro;
api.setRemoveReviewPro = setRemoveReviewPro;
api.hideReviewTips = hideReviewTips;
api.getStyleReview = getStyleReview;
api.setListElementsSelected = setListElementsSelected;
api.setPositionCursor = setPositionCursor;
api.getBoxCtrReview = getBoxCtrReview;
api.contentDialogReview = contentDialogReview;
api.getDialogReview = getDialogReview;
api.getBoxReview = getBoxReview;
api.initStyleReview = initStyleReview;
