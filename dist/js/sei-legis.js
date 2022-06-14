var getRefLegis = [];
var alertText = {
    0: 'Artigos e par\u00E1grafos dever ser terminados com ponto final (.) ou dois pontos (:), sem espa\u00E7o antes da pontua\u00E7\u00E3o. ',
    1: 'Artigos e par\u00E1grafos dever ser iniciados com letra mai\u00FAscula. ',
    2: 'Incisos ou Al\u00EDneas dever ser terminados com ponto final (.), dois pontos (:) ou ponto e v\u00EDrgula (;), sem espa\u00E7o antes da pontua\u00E7\u00E3o. ',
    3: 'Incisos ou Al\u00EDneas dever ser iniciados com letra min\u00FAscula. ',
    4: 'Itens dever ser terminadas com ponto final (.), dois pontos (:) ou ponto e u00EDrgula (;), sem espa\u00E7o antes da pontua\u00E7\u00E3o. ',
    5: 'Itens dever ser iniciados com letra min\u00FAscula.  '
}
var romanToInt = function(s) {
    const mapRoman=new Map();
    mapRoman.set('I', 1);
    mapRoman.set('V', 5);
    mapRoman.set('X', 10);
    mapRoman.set('L', 50);
    mapRoman.set('C', 100);
    mapRoman.set('D', 500);
    mapRoman.set('M', 1000);
    var result=0;
    if(s){
        var s1=s.split('');
        s1.forEach(function(e,i){
            result += mapRoman.get(e) < mapRoman.get(s1[i+1]) ? -mapRoman.get(e) : mapRoman.get(e);
        });
    }
    return result;
}
function removeAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}
function getATTags(inputText) {  
    var regex = /(?:^|\s)(?:@)([a-zA-Z./#§\d]+)/gm;
    var matches = [];
    var match;
    while ((match = regex.exec(inputText))) {
        matches.push(match[1]);
    }
    return matches;
}
function getHashTags(inputText) {  
    var regex = /(?:^|\s)(?:#)([a-zA-Z§\d]+)/gm;
    var matches = [];
    var match;
    while ((match = regex.exec(inputText))) {
        matches.push(match[1]);
    }
    return matches;
}
function randomString(length) {
    var result = '';
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
function romanizeNum(num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}
function letteringNumAlin(number){
    var alphabet = 'abcdefghijklmnopqrstuvwxyz';
    var charIndex = number % alphabet.length;
    var quotient = number/alphabet.length;
    if ( charIndex-1 == -1 ){
        charIndex = alphabet.length;
        quotient--;
    }
    letterAlin = alphabet.charAt(charIndex-1) + letterAlin;
    if ( quotient >= 1 ){
        letteringNumAlin(parseInt(quotient));
    } else {
        letterAlin = letterAlin;
    }
}

var iAnex = 0;
var iTit = 0;
var iCap = 0;
var iSec = 0;
var iSub = 0;
var iArt = 0;
var iPar = 0;
var iInc = 0;
var iAlin = 0;
var iItem = 0;
var letterAlin = '';
var alertDisp = '';

function removeEnum(iframe) {
    iframe.find('p').not('[data-comment="true"]').each(function(){ 
        if ( !$(this).find('.legis').length ) {
            randRef = randomString(16);
            $(this).html($(this).html().replace(/&nbsp;/g, ' '));
            $(this).html($(this).html().replace(/\u200B/g, ' '));
            var text = $(this).html();
            var textSearch = $(this).text().trim().split(' ');
			if ( textSearch.length > 1 ) {
				var textNormalize = removeAcentos(textSearch[0]+' '+textSearch[1]);
					textNormalize = textNormalize.toString().toLowerCase().replace(/[^a-z ]/g, "");
				var textNormalize1 = removeAcentos(textSearch[0]);
					textNormalize1 = textNormalize1.toString().toLowerCase().replace(/[^a-z ]/g, "");

                if ( textNormalize1 == 'anexo' ){
                    var textReplace = ( typeof textSearch[1] !== 'undefined' ) ? textSearch[0]+' '+textSearch[1] : textSearch[0]; 
                    text = text.replace(textReplace, '<span contenteditable="false" class="legis auto anexo" data-ref="'+randRef+'">anexo.</span>');
                    $(this).html(text);
                }
				if ( textNormalize1 == 'titulo' && (romanToInt(textSearch[1].toString()) > 0) ){
					var textReplace = textSearch[0]+' '+textSearch[1];
					text = text.replace(textReplace, '<span contenteditable="false" class="legis auto tit" data-ref="'+randRef+'">TIT.</span>');
					$(this).html(text);
				}
				if ( textNormalize1 == 'capitulo' && (romanToInt(textSearch[1].toString()) > 0) ){
					var textReplace = textSearch[0]+' '+textSearch[1];
					text = text.replace(textReplace, '<span contenteditable="false" class="legis auto cap" data-ref="'+randRef+'">CAP.</span>');
					$(this).html(text);
				}
				if ( textNormalize1 == 'secao' && (romanToInt(textSearch[1].toString()) > 0) ){
					var textReplace = textSearch[0]+' '+textSearch[1];
					text = text.replace(textReplace, '<span contenteditable="false" class="legis auto sec" data-ref="'+randRef+'">Sec.</span>');
					$(this).html(text);
				}
                if ( textNormalize1 == 'subsecao' && (romanToInt(textSearch[1].toString()) > 0) ){
					var textReplace = textSearch[0]+' '+textSearch[1];
					text = text.replace(textReplace, '<span contenteditable="false" class="legis auto sub" data-ref="'+randRef+'">Sub.</span>');
					$(this).html(text);
				}
				if ((textSearch[0].toLowerCase().indexOf('art') !== -1) && (textSearch[1].match(/\d+/g) != null)){
					var textReplace = textSearch[0]+' '+textSearch[1];
					text = text.replace(textReplace, '<span contenteditable="false" class="legis auto art" data-ref="'+randRef+'">Art.</span>');
					$(this).html(text);
				}
				if ((textSearch[0].toLowerCase().indexOf('\u00A7') !== -1) && (textSearch[1].match(/\d+/g) != null)){
					var textReplace = textSearch[0]+' '+textSearch[1];
					text = text.replace(textReplace, '<span contenteditable="false" class="legis auto par" data-ref="'+randRef+'">\u00A7</span>');
					$(this).html(text);
				}
				if ((textSearch[0].toLowerCase().indexOf('\u00A7') !== -1) && (textSearch[0].match(/\d+/g) != null)){
					var textReplace = textSearch[0];
					text = text.replace(textReplace, '<span contenteditable="false" class="legis auto par" data-ref="'+randRef+'">\u00A7</span>');
					$(this).html(text);
				}
				if ((textSearch[0].toLowerCase().indexOf('\u00A7') !== -1) && (textSearch[0].match(/\d+/g) != null)){
					var textReplace = textSearch[0];
					text = text.replace(textReplace, '<span contenteditable="false" class="legis auto par" data-ref="'+randRef+'">\u00A7</span>');
					$(this).html(text);
				}
				if ( textNormalize == 'paragrafo unico' || textNormalize == 'par unico' ){
					var textReplace = textSearch[0]+' '+textSearch[1];
					text = text.replace(textReplace, '<span contenteditable="false" class="legis auto par" data-ref="'+randRef+'">\u00A7</span>');
					$(this).html(text);
				}
				if ((romanToInt(textSearch[0].toString()) > 0 && textSearch[1].toString() == '-') || 
					(romanToInt(textSearch[0].toString()) > 0 && textSearch[1].toString() == '\u2014')
				   ){
					var textReplace = textSearch[0]+' '+textSearch[1];
					text = text.replace(textReplace, '<span contenteditable="false" class="legis auto inc" data-ref="'+randRef+'">Inc.</span>');
					$(this).html(text);
				}
				if ( textSearch[0].toString().slice(-1) == '\u0029' && textSearch[0].toString().charAt(0) != '\u0028' ) {
					var textReplace = textSearch[0];
					text = text.replace(textReplace, '<span contenteditable="false" class="legis auto alin" data-ref="'+randRef+'">Alin.</span>');
					$(this).html(text);
				}
                if ( textSearch[0].toString().slice(-1) == '.' && $.isNumeric(textSearch[0].toString().charAt(0)) ) {
					var textReplace = textSearch[0];
					text = text.replace(textReplace, '<span contenteditable="false" class="legis auto item" data-ref="'+randRef+'">Item.</span>');
					$(this).html(text);
				}
			}
        }
    });
}
function undoRemoveEnum(iframe) {
    iframe.find('.legis.auto').each(function(){ 
        var textOld = $(this).attr('data-old-text').hexEncode().hexDecode();
        $(this).after(textOld);
        $(this).remove();
    });
}
function disableAllLegis() {
    $('iframe').each(function(){ 
        var iframe = $(this).contents();
        iframe.find('.legis').each(function(){ 
            $(this).attr('contenteditable', 'true');
        });
    });
}
function removeAllLegis() {
    $('iframe').each(function(){ 
        var iframe = $(this).contents();
        iframe.find('.legis').each(function(){ 
            var text = $(this).text();
            $(this).after(text);
            $(this).remove();
        });
    });
}

function cleanLegis(iframe) {
    iframe.find('p').not('[data-comment="true"]').each(function(){ 
        $(this).find('.legis.anexo').html('anexo.');
        $(this).find('.legis.tit').html('tit.');
        $(this).find('.legis.cap').html('cap.');
        $(this).find('.legis.sec').html('sec.');
        $(this).find('.legis.sub').html('sub.');
        $(this).find('.legis.art').html('art.');
        $(this).find('.legis.par').html('\u00A7');
        $(this).find('.legis.inc').html('inc.');
        $(this).find('.legis.alin').html('alin.');
        $(this).find('.legis.item').html('item.');
    });
}
function getAnexoUnico(iframe) {
    var anexo = iframe.find('.legis.anexo');
    if ( anexo.length == 1 ) {
        var text = anexo.html();
            text = text.replace('ANEXO I', 'ANEXO \u00DANICO');
            anexo.html(text);
    }
}
function getParUnico(iframe) {
    iframe.find('.legis.par').each(function(){ 
        var text = $(this).html();
        var art = $(this).find('a').attr('data-art');
        if ( !iframe.find('a[name=art'+art+'\u00A72]').length ) {
            text = text.replace('\u00A7 1\u00BA', 'Par\u00E1grafo \u00FAnico.');
            $(this).html(text);
            $(this).find('a').attr('data-parunico','true');
        }
    });
}
function getDeclaraLegis(iframe) {
    var arrayRefExt = [];
    iframe.find('.legis.refext.refok').each(function(){ 
        var refext = $(this).attr('data-refext');
        if ( $('.legis[data-refext="'+refext+'"]', iframe).length > 1 ) {
            if ( arrayRefExt.includes(refext) ) {
                var text = $(this).text();
                var newText = text.split(',');
                var textDate = newText[1].trim().split(' ')[5];
                    newText = ( typeof textDate !== 'undefined' ) ? newText[0].trim()+', de '+textDate : text;
                    $(this).find('a').text(newText);
            }
            arrayRefExt.push(refext);
        }
    });
}
function checkText(this_, resultText, disp) {
	var alert = [];
	var text = $(this_).text().trim();
	var refDispositivo = $('<div>'+resultText+'</div>').text();
	var textDispositivo = text.replace(disp+'.', '').trim();
	var firstChar = textDispositivo.toString().charAt(0);
	var lastChar = textDispositivo.toString().slice(-1);
    var lastWord = textDispositivo.toString().split(" ").pop();
	if ( disp == 'art' || disp == 'par' ) {
		if ( lastChar != '.' && lastChar != ':' ) {
			alert.push(0);
		}
		if ( firstChar != firstChar.toUpperCase() ) {
			alert.push(1);
		}
	} else if ( disp == 'inc' || disp == 'alin' ) {
		if ( lastChar != '.' && lastChar != ':' && lastChar != ';' && lastWord != 'e' && lastWord != 'ou'  ) {
			alert.push(2);
		}
		if ( firstChar != firstChar.toLowerCase() ) {
			alert.push(3);
		}
	} else if ( disp == 'item' ) {
		if ( lastChar != '.' && lastChar != ';' && lastWord != 'e' && lastWord != 'ou' ) {
			alert.push(4);
		}
		if ( firstChar != firstChar.toLowerCase() ) {
			alert.push(5);
		}
	}
	if ( alert.length > 0 ) { return alert.join(',')  } else { return false }
}
function updateLegis(iframe) {

    iAnex = 0;
    iTit = 0;
    iCap = 0;
    iSec = 0;
    iSub = 0;
    iArt = 0;
    iPar = 0;
    iInc = 0;
    iAlin = 0;
    iItem = 0;
    letterAlin = '';

    iframe.find('p').not('[data-comment="true"]').each(function(){ 
        var this_ = $(this);
            alertDisp = '';
            this_.html(this_.html().replace(/&nbsp;/g, ' '));
            this_.html(this_.html().replace(/\u200B/g, ' '));
        var text = this_.html();
        var textSearch = this_.text().trim().split(' ')[0];
        var textSearchFull = this_.text().trim();

        if ( textSearchFull.indexOf('@') !== -1) {
            var arrayTag = getATTags(textSearchFull);
            $.each(arrayTag, function (index, value) {
                var dataValue = value.toString();
                    dataValue = ( dataValue.indexOf('#') !== -1) ? dataValue.split('#')[0] : dataValue;
                    dataValue = ( dataValue.indexOf('/') !== -1) ? dataValue.split('/')[0] : dataValue;
                    dataValue = dataValue.replace(/[\W_]+/g,"").toLowerCase();
                    getRefLegis.push(dataValue);
                    value = ( value.toString().slice(-1) == '.' ) ? value.toString().slice(0, -1) : value;
                var resultRef = ( this_.find('.legis.refext:contains("'+value+'")').length ) ? '@'+value : '<span class="legis refext">@'+value+'</span>';
                    text = text.replace('@'+value, resultRef);
                    this_.html(text);
            });
        }
        if ( textSearch.toLowerCase().indexOf('anexo.') !== -1) {
            classParag = 'Texto_Centralizado';
            indexAnex = iAnex+1;
            randRef = randomString(16);
//            ordAnex = ( iAnex == 0 ) ? '' : String.fromCharCode(97 + (iAnex-1)).toString().toUpperCase();
            ordAnex = romanizeNum(indexAnex);
            linkAnchor = '<a name="anexo'+ordAnex.toLowerCase()+'" data-anexo="'+ordAnex.toLowerCase()+'"></a>';
            resultAnex = ( $(this).find('.legis.anexo').length ) ? linkAnchor+'ANEXO '+ordAnex : '<span contenteditable="false" class="legis anexo" data-ref="'+randRef+'">'+linkAnchor+'ANEXO '+ordAnex+'</span>';
            text = text.replace(textSearch, resultAnex);
            $(this).html(text).attr('class',classParag);
            iAnex++;
			iTit = 0; iCap = 0; iSec = 0; iArt = 0; iPar = 0; iInc = 0; iAlin = 0; letterAlin = '';
        }
        if ( textSearch.toLowerCase().indexOf('tit.') !== -1) {
            classParag = 'Texto_Centralizado';
            indexTit = iTit+1;
            randRef = randomString(16);
            ordTit = romanizeNum(indexTit);
            linkAnchor = '<a name="titulo'+ordTit.toLowerCase()+'" data-tit="'+ordTit.toLowerCase()+'"></a>';
            resultTit = ( $(this).find('.legis.tit').length ) ? linkAnchor+'T\u00CDTULO '+ordTit : '<span contenteditable="false" class="legis tit" data-ref="'+randRef+'">'+linkAnchor+'T\u00CDTULO '+ordTit+'</span>';
            text = text.replace(textSearch, resultTit);
            $(this).html(text).attr('class',classParag);
            iTit++;
            iCap = 0; iSec = 0;
        }
        if ( textSearch.toLowerCase().indexOf('cap.') !== -1) {
            classParag = 'Texto_Centralizado';
            indexCap = iCap+1;
            randRef = randomString(16);
            ordCap = romanizeNum(indexCap);
            linkAnchor = ( iTit > 0 ) ? '<a name="titulo'+ordTit.toLowerCase()+'capitulo'+ordCap.toLowerCase()+'" data-tit="'+ordTit.toLowerCase()+'" data-cap="'+ordCap.toLowerCase()+'"></a>' 
                                      : '<a name="capitulo'+ordCap.toLowerCase()+'" data-cap="'+ordCap.toLowerCase()+'"></a>';
            resultCap = ( $(this).find('.legis.cap').length ) ? linkAnchor+'CAP\u00CDTULO '+ordCap : '<span contenteditable="false" class="legis cap" data-ref="'+randRef+'">'+linkAnchor+'CAP\u00CDTULO '+ordCap+'</span>';
            text = text.replace(textSearch, resultCap);
            $(this).html(text).attr('class',classParag);
            iCap++;
            iSec = 0;
        }
        if ( textSearch.toLowerCase().indexOf('sec.') !== -1) {
            classParag = 'Texto_Centralizado';
            indexSec = iSec+1;
            randRef = randomString(16);
            ordSec = romanizeNum(indexSec);
            linkAnchor = ( iTit > 0 ) ? '<a name="titulo'+ordTit.toLowerCase()+'capitulo'+ordCap.toLowerCase()+'secao'+ordSec.toLowerCase()+'" data-tit="'+ordTit.toLowerCase()+'" data-cap="'+ordCap.toLowerCase()+'"  data-sec="'+ordSec.toLowerCase()+'"></a>' 
                                      : '<a name="capitulo'+ordCap.toLowerCase()+'secao'+ordSec.toLowerCase()+'" data-cap="'+ordCap.toLowerCase()+'"  data-sec="'+ordSec.toLowerCase()+'"></a>';
            resultSec = ( $(this).find('.legis.sec').length ) ? linkAnchor+'Se\u00E7\u00E3o '+ordSec : '<span contenteditable="false" class="legis sec" data-ref="'+randRef+'">'+linkAnchor+'Se\u00E7\u00E3o '+ordSec+'</span>';
            resultSecBold = ( $(this).find('strong').length ) ? resultSec : '<strong>'+resultSec+'<strong>';
            text = text.replace(textSearch, resultSecBold);
            $(this).html(text).attr('class',classParag);
            iSec++;
        }
        if ( textSearch.toLowerCase().indexOf('sub.') !== -1) {
            classParag = 'Texto_Centralizado';
            indexSub = iSub+1;
            randRef = randomString(16);
            ordSub = romanizeNum(indexSub);
            linkAnchor = ( iTit > 0 ) ? '<a name="titulo'+ordTit.toLowerCase()+'capitulo'+ordCap.toLowerCase()+'secao'+ordSec.toLowerCase()+'subsecao'+ordSub.toLowerCase()+'" data-tit="'+ordTit.toLowerCase()+'" data-cap="'+ordCap.toLowerCase()+'" data-sec="'+ordSec.toLowerCase()+'" data-sub="'+ordSub.toLowerCase()+'"></a>' 
                                      : '<a name="capitulo'+ordCap.toLowerCase()+'secao'+ordSec.toLowerCase()+'subsecao'+ordSub.toLowerCase()+'" data-cap="'+ordCap.toLowerCase()+'" data-sec="'+ordSec.toLowerCase()+'" data-sub="'+ordSub.toLowerCase()+'"></a>';
            resultSub = ( $(this).find('.legis.sub').length ) ? linkAnchor+'Subse\u00E7\u00E3o '+ordSub : '<span contenteditable="false" class="legis sub" data-ref="'+randRef+'">'+linkAnchor+'Subse\u00E7\u00E3o '+ordSub+'</span>';
            resultSubBold = ( $(this).find('strong').length ) ? resultSub : '<strong>'+resultSub+'<strong>';
            text = text.replace(textSearch, resultSubBold);
            $(this).html(text).attr('class',classParag);
            iSub++;
        }
        if ( textSearch.toLowerCase().indexOf('art.') !== -1) {
            classParag = 'Texto_Justificado_Recuo_Primeira_Linha';
            indexArt = iArt+1;
            randRef = randomString(16);
            ordArt = ( indexArt < 10 ) ? indexArt+'\u00BA' : indexArt+'.';
			enumDisp = 'Art. '+ordArt;
            linkAnchor = '<a name="art'+indexArt+'" data-art="'+indexArt+'"></a>';
            resultArt = ( $(this).find('.legis.art').length ) ? linkAnchor+enumDisp : '<span contenteditable="false" class="legis art" data-ref="'+randRef+'">'+linkAnchor+enumDisp+'</span>';
			alertDisp = checkText($(this), resultArt, 'art');
            spaceBlank = ( ($(this).text().replace('art.', '').trim()) == '' ) ? '&nbsp;' : '';
            text = text.replace(textSearch, resultArt);
            $(this).html(text+spaceBlank).attr('class',classParag);
            iArt++;
            iPar = 0; iInc = 0; iAlin = 0; letterAlin = '';
        }
        if ( textSearch.toLowerCase().indexOf('\u00A7') !== -1) {
            classParag = 'Texto_Justificado_Recuo_Primeira_Linha';
            indexPar = iPar+1;
            randRef = randomString(16);
            ordPar = ( indexPar < 10 ) ? indexPar+'\u00BA' : indexPar+'.';
			enumDisp = '\u00A7 '+ordPar;
            linkAnchor = '<a name="art'+iArt+'\u00A7'+indexPar+'" data-art="'+iArt+'" data-par="'+indexPar+'"></a>';
            resultPar = ( $(this).find('.legis.par').length ) ? linkAnchor+enumDisp : '<span contenteditable="false" class="legis par" data-ref="'+randRef+'">'+linkAnchor+enumDisp+'</span>';
			alertDisp = checkText($(this), resultPar, 'par');
            spaceBlank = ( ($(this).text().replace('\u00A7', '').trim()) == '' ) ? '&nbsp;' : '';
            text = text.replace(textSearch, resultPar);
            $(this).html(text+spaceBlank).attr('class',classParag);
            iPar++;
            iInc = 0; iAlin = 0; letterAlin = '';
        }
        if ( textSearch.toLowerCase().indexOf('inc.') !== -1) {
            classParag = 'Texto_Justificado_Recuo_Primeira_Linha';
            indexInc = iInc+1;
            randRef = randomString(16);
            ordInc = romanizeNum(indexInc);
			enumDisp = ordInc+' -';
            linkAnchor = ( iPar > 0 ) ? '<a name="art'+iArt+'\u00A7'+iPar+ordInc.toLowerCase()+'" data-art="'+iArt+'" data-par="'+iPar+'" data-inc="'+ordInc.toLowerCase()+'"></a>' 
                                      : '<a name="art'+iArt+ordInc.toLowerCase()+'" data-art="'+iArt+'" data-inc="'+ordInc.toLowerCase()+'"></a>';
            resultInc = ( $(this).find('.legis.inc').length ) ? linkAnchor+enumDisp : '<span contenteditable="false" class="legis inc" data-ref="'+randRef+'">'+linkAnchor+enumDisp+'</span> ';
			alertDisp = checkText($(this), resultInc, 'inc');
            spaceBlank = ( ($(this).text().replace('inc.', '').trim()) == '' ) ? '&nbsp;' : '';
            text = text.replace(textSearch, resultInc);
            $(this).html(text+spaceBlank).attr('class',classParag);
            iInc++;
            iAlin = 0; letterAlin = '';
        }
        if ( textSearch.toLowerCase().indexOf('alin.') !== -1) {
            classParag = 'Texto_Justificado_Recuo_Primeira_Linha';
            indexAlin = iAlin+1;
            randRef = randomString(16);
            letteringNumAlin(indexAlin);
			enumDisp = letterAlin+')';
            linkAnchor = ( iPar > 0 ) ? '<a name="art'+iArt+'\u00A7'+iPar+ordInc.toLowerCase()+'" data-art="'+iArt+'" data-par="'+iPar+'" data-inc="'+ordInc.toLowerCase()+'" data-alin="'+letterAlin+'"></a>' 
                                      : '<a name="art'+iArt+ordInc.toLowerCase()+letterAlin+'" data-art="'+iArt+'" data-inc="'+ordInc.toLowerCase()+'" data-alin="'+letterAlin+'"></a>';
            resultAlin = ( $(this).find('.legis.alin').length ) ? linkAnchor+enumDisp : '<span contenteditable="false" class="legis alin" data-ref="'+randRef+'">'+linkAnchor+enumDisp+'</span> ';
			alertDisp = checkText($(this), resultAlin, 'alin');
            spaceBlank = ( ($(this).text().replace('alin.', '').trim()) == '' ) ? '&nbsp;' : '';
            text = text.replace(textSearch, resultAlin);
            $(this).html(text+spaceBlank).attr('class',classParag);
            iAlin++; 
            iItem = 0; letterAlin = '';
        }
        if ( textSearch.toLowerCase().indexOf('item.') !== -1) {
            classParag = 'Texto_Justificado_Recuo_Primeira_Linha';
            indexItem = iItem+1;
            randRef = randomString(16);
			enumDisp = indexItem+'.';
            linkAnchor = ( iPar > 0 ) ? '<a name="art'+iArt+'\u00A7'+iPar+ordInc.toLowerCase()+'" data-art="'+iArt+'" data-par="'+iPar+'" data-inc="'+ordInc.toLowerCase()+'" data-alin="'+letterAlin+'" data-item="'+indexItem+'"></a>' 
                                      : '<a name="art'+iArt+ordInc.toLowerCase()+letterAlin+indexItem+'" data-art="'+iArt+'" data-inc="'+ordInc.toLowerCase()+'" data-alin="'+letterAlin+'" data-item="'+indexItem+'"></a>';
            resultItem = ( $(this).find('.legis.item').length ) ? linkAnchor+enumDisp : '<span contenteditable="false" class="legis item" data-ref="'+randRef+'">'+linkAnchor+enumDisp+'</span> ';
			alertDisp = checkText($(this), resultItem, 'item');
            spaceBlank = ( ($(this).text().replace('item.', '').trim()) == '' ) ? '&nbsp;' : '';
            text = text.replace(textSearch, resultItem);
            $(this).html(text+spaceBlank).attr('class',classParag);
            iItem++;
        }
        var htmlAlert = '<span contenteditable="false" class="tooltips" style="display:none" data-text-tip="'+alertDisp+'"></span>';
		if ( alertDisp != '' && $(this).find('span.ignoretip').length == 0 ) { 
            $(this).find('span.legis')
                .attr('contenteditable', 'false')
                .find('span.tooltips')
                .remove();
            $(this).find('span.legis')
                .eq(0)
                .addClass('alert')
                .prepend(htmlAlert)
                .off('mouseover')
                .off('mouseout')
                .on('dblclick', function(e) { ignoreTooltips($(this)) })
                .mouseover(function() { showTooltips($(this)) })
                .mouseout(function() { hideTooltips($(this)) });
        } else { 
            $(this).find('span.legis')
                .attr('contenteditable', 'false');
            $(this).find('span.legis')
                .eq(0)
                .removeClass('alert')
                .off('mouseover')
                .off('mouseout')
                .off('dblclick')
                .find('span.tooltips').remove();
        }
    });
    uniq(getRefLegis);
}

function getCodTip(codtip) {
    var returnText = '';
    if ( codtip.indexOf(',') !== -1 ) {
        codtip = codtip.split(',');
        $.each(codtip, function (index, value) {
            returnText += alertText[parseInt(value)];
        });
    } else {
        returnText = alertText[parseInt(codtip)];
    }
    return returnText;
}
function ignoreTooltips(this_) {
    $(this_).addClass('ignoretip').removeClass('alert').find('span.tooltips').remove();
}
function showTooltips(this_) {
    var ignoretip = '<span class="ignoretext">dois cliques para ignorar alerta</span>';
    var tip = $(this_).find('span.tooltips').attr('data-text-tip');
        tip = getCodTip(tip);
        $(this_).find('span.tooltips').html(tip+ignoretip).show();
}
function hideTooltips(this_) {
    $(this_).find('span.tooltips').html('').hide();
}
function getNameRef(anchor, iframe, this_) {
    var arrayResult = [];
    var refinc = '';
    var refselfart = '';
    if ( typeof anchor.attr('data-inc') !== 'undefined' && typeof anchor.attr('data-par') === 'undefined' && typeof anchor.attr('data-art') !== 'undefined' ) {
        var refart = anchor.attr('data-art');
        var refFind = iframe.find('a[name*=art'+refart+'\u00A7]');
        if ( refFind.length > 0 ) {
            refFind.each(function(index){
                if ( typeof $(this).attr('data-inc') !== 'undefined' ) { refinc = ' do <strong>caput</strong>'; }
            });
        }
    }
    if ( this_ !== null && typeof anchor.attr('data-art') !== 'undefined' && ( typeof anchor.attr('data-inc') !== 'undefined' || typeof anchor.attr('data-par') !== 'undefined' ) ) {
        var refart = this_.closest('p').find('span.legis').eq(0).find('a');
        if ( parseInt(refart.attr('data-art')) == parseInt(anchor.attr('data-art')) ) {
            refselfart = ' ';
            //refselfart = ' deste artigo';
        }
    }
    
    var anexo = ( typeof anchor.attr('data-anexo') !== 'undefined' ) ? anchor.attr('data-anexo') : '';
        anexo = ( anexo != '' ) ? 'Anexo '+anexo.toUpperCase() : '';
        if ( anexo != '' ) { arrayResult.push(anexo) } 
    var tit = ( typeof anchor.attr('data-tit') !== 'undefined' ) ? anchor.attr('data-tit') : '';
        tit = ( tit != '' ) ? 'T\u00EDtulo '+tit.toUpperCase() : '';
        if ( tit != '' ) { arrayResult.push(tit) } 
    var cap = ( typeof anchor.attr('data-cap') !== 'undefined' ) ? anchor.attr('data-cap') : '';
        cap = ( cap != '' ) ? 'Cap\u00EDtulo '+cap.toUpperCase() : '';
        if ( cap != '' ) { arrayResult.push(cap) } 
    var sec = ( typeof anchor.attr('data-sec') !== 'undefined' ) ? anchor.attr('data-sec') : '';
        sec = ( sec != '' ) ? 'Se\u00E7\u00E3o '+sec.toUpperCase() : '';
        if ( sec != '' ) { arrayResult.push(sec) } 
    var sub = ( typeof anchor.attr('data-sub') !== 'undefined' ) ? anchor.attr('data-sub') : '';
        sub = ( sub != '' ) ? 'Subse\u00E7\u00E3o '+sub.toUpperCase() : '';
        if ( sub != '' ) { arrayResult.push(sub) } 
    var art = ( typeof anchor.attr('data-art') !== 'undefined' ) ? anchor.attr('data-art') : '';
    var ordArt = ( parseInt(art) < 10 ) ? art+'\u00BA' : art+'';
        art = ( art != '' && refselfart == '' ) ? 'art. '+ordArt : '';
        if ( art != '' ) { arrayResult.push(art) } 
    var par = ( typeof anchor.attr('data-par') !== 'undefined' ) ? anchor.attr('data-par') : '';
    var ordPar = ( parseInt(par) < 10 ) ? par+'\u00BA' : '.';
        par = ( par != '' ) ? '\u00A7 '+ordPar+'' : '';
        par = ( typeof anchor.attr('data-parunico') !== 'undefined' && anchor.attr('data-parunico') == 'true' ) ? 'par\u00E1grafo \u00FAnico' : par;
        if ( par != '' ) { arrayResult.push(par) } 
    var inc = ( typeof anchor.attr('data-inc') !== 'undefined' ) ? anchor.attr('data-inc') : '';
        inc = ( inc != '' ) ? 'inciso '+inc.toUpperCase()+refinc : '';
        if ( inc != '' ) { arrayResult.push(inc) } 
    var alin = ( typeof anchor.attr('data-alin') !== 'undefined' ) ? anchor.attr('data-alin') : '';
        alin = ( alin != '' ) ? 'al\u00EDnea "'+alin+'"' : '';
        if ( alin != '' ) { arrayResult.push(alin) } 
    var item = ( typeof anchor.attr('data-item') !== 'undefined' ) ? anchor.attr('data-item') : '';
        item = ( item != '' ) ? 'item "'+item+'"' : '';
        if ( item != '' ) { arrayResult.push(item) } 
    var textRef = arrayResult.join(', ') ;
        textRef = ( refselfart != '' ) ? textRef+refselfart : textRef;
    return textRef;
}
function getRefsTags(iframe) {
    iframe.find('.legis.error').each(function(){ 
        var textLink = $(this).text();
        $(this).after(textLink);
        $(this).remove();
    });
    iframe.find('p').not('[data-comment="true"]').each(function(){ 
        var this_ = $(this);
        var text = this_.html();
        var textSearch = this_.text();
        if ( textSearch.indexOf('#') !== -1) {
            var arrayTag = getHashTags(textSearch);
            $.each(arrayTag, function (index, value) {
                var refTag = value.toLowerCase();
                if ( iframe.find('a[name='+refTag+']').length ) {
                    var anchor = iframe.find('a[name='+refTag+']');
                    var textRef = getNameRef(anchor, iframe, null).trim();
                    var refArt = anchor.closest('span.legis').attr('data-ref');
                    var resultRef = '<a href="#'+refTag+'"><span contenteditable="false" class="legis ref" data-anchor="'+refArt+'">'+textRef+'</span></a>';
                    text = text.replace('#'+value, resultRef);
                    this_.html(text);
                } else {
                    var resultRef = '<span contenteditable="true" class="legis ref error">#'+value+'</span>';
                    text = text.replace('#'+value, resultRef);
                    this_.html(text);
                }
            });
        }
    });
}
function getDadosNormas(iframe, arrayLegis) {
	var url = "https://seipro.app/legis/";
	$.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		data: { norma: arrayLegis },
		success: function(data){
            updateRefsLegis(iframe, data);
            getRefLegis = [];
            getDeclaraLegis(iframe);
		}
	});
}
function getRefsLegis(iframe) {
    if ( getRefLegis.length > 0 ) {
        getDadosNormas(iframe, getRefLegis);
    }
}
function updateRefsLegis(iframe, data) {
    iframe.find('.legis.refext').each(function(){ 
        if ( !$(this).hasClass('refok')) {
            var this_ = $(this);
            var text = this_.html();
            var dataLegis = this_.text();
            var dataValue = dataLegis.toString().replace('@','');
                dataValue = ( dataValue.indexOf('#') !== -1) ? dataValue.split('#')[0] : dataValue;
                dataValue = ( dataValue.indexOf('/') !== -1) ? dataValue.split('/')[0] : dataValue;
                dataValue = dataValue.replace(/[\W_]+/g,"").toLowerCase();
            var dataValue_ = capitalizeFirstLetter(dataValue);
            var legisData = jmespath.search(data, "[?SiglaNorma=='"+dataValue_+"']");
            console.log(dataValue_, legisData, data);
            var nomeLegis = ( legisData.length > 0 && legisData[0].NomeNorma ) ? ' ('+legisData[0].NomeNorma+')' : '';
            var htmlLegis = ( legisData.length > 0 ) ? '<a href="'+legisData[0].Link+'" target="_blank">'+legisData[0].DescNormaFull+nomeLegis.trim()+'</a>' : text;
                this_.html(htmlLegis);
            if ( legisData.length > 0 ) { 
                this_.attr('data-refext',dataValue).removeClass('error').addClass('refok'); 
            } else { 
                this_.addClass('error').removeAttr('data-refext');
            }
        }
    });
}

function updateRefsTags(iframe) {
    iframe.find('.legis.ref').each(function(){
        var this_ = $(this);
        var dataRef = this_.attr('data-anchor');
        var anchor = iframe.find('.legis[data-ref="'+dataRef+'"] a');
        var textRef = getNameRef(anchor, iframe, this_).trim();
        if (  typeof textRef !== 'undefined' && textRef != '' ) { 
            this_.html(textRef).removeClass('error');
            this_.closest('a').attr('href', '#'+anchor.attr('name')).attr('data-cke-saved-href', '#'+anchor.attr('name'));
        } else { 
            this_.addClass('error');
        }
    });
}
function observeKey(iframe) {
	iframe.find('body').keydown(function (e){
		var legisBt = $('.getLegisButtom', parent.document);
		if(e.keyCode == 13 && legisBt.hasClass('cke_button_on') ){
			getLegis(iframe);
		}
	});
}
function getNotComment(iframe) {
    iframe.find('table').each(function(){
        $(this).find('p').attr('data-comment', 'true');
    });
}
function getLegis(iframe) {
    getNotComment(iframe);
    removeEnum(iframe);
    cleanLegis(iframe);
    updateLegis(iframe);
    getParUnico(iframe);
    getRefsTags(iframe);
    updateRefsTags(iframe);
    getRefsLegis(iframe);
}

function iframeLegis() {
    $('iframe').each(function(){ 
        var iframe = $(this).contents();
        getLegis(iframe);
        observeKey(iframe);
    });
    // console.log('iframeLegis');
}
function initLegis() {
	if ( $('.getLegisButtom').hasClass('cke_button_off') ) {
        $('.getLegisButtom').addClass('cke_button_on').removeClass('cke_button_off');
        iframeLegis();
	} else {
		$('.getLegisButtom').addClass('cke_button_off').removeClass('cke_button_on');
        disableAllLegis();
	}
}