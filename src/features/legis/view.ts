// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import {
    capitalizeFirstLetter,
    randomString,
    removeAcentos,
    romanToInt
} from '../../core/util.js';
import {
    formatRepeatedCitation,
    getATTags,
    getHashTags,
    romanizeNum,
    uniq
} from './domain.js';
let searchLegislation = async () => ({
    error: 'unavailable',
    message: 'Pesquisa de legislação não configurada.',
    data: []
});

export function configureLegisView({ search } = {}) {
    if (typeof search === 'function') searchLegislation = search;
}

let getRefLegis = [];
const alertText = {
    0: 'Artigos e parágrafos dever ser terminados com ponto final (.) ou dois pontos (:), sem espaço antes da pontuação. ',
    1: 'Artigos e parágrafos dever ser iniciados com letra maiúscula. ',
    2: 'Incisos ou Alíneas dever ser terminados com ponto final (.), dois pontos (:) ou ponto e vírgula (;), sem espaço antes da pontuação. ',
    3: 'Incisos ou Alíneas dever ser iniciados com letra minúscula. ',
    4: 'Itens dever ser terminadas com ponto final (.), dois pontos (:) ou ponto e vírgula (;), sem espaço antes da pontuação. ',
    5: 'Itens dever ser iniciados com letra minúscula.  '
};

let iAnex = 0;
let iTit = 0;
let iCap = 0;
let iSec = 0;
let iSub = 0;
let iArt = 0;
let iPar = 0;
let iInc = 0;
let iAlin = 0;
let iItem = 0;
let letterAlin = '';
let alertDisp = '';
let ordTit = '';
let ordCap = '';
let ordSec = '';
let ordInc = '';

export function letteringNumAlin(number) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let charIndex = number % alphabet.length;
    let quotient = number / alphabet.length;
    if (charIndex - 1 === -1) {
        charIndex = alphabet.length;
        quotient--;
    }
    letterAlin = alphabet.charAt(charIndex - 1) + letterAlin;
    if (quotient >= 1) letteringNumAlin(parseInt(quotient));
}

export function removeEnum(iframe) {
    iframe.find('p').not('[data-comment="true"]').each(function () {
        if ($(this).find('.legis').length) return;

        const randRef = randomString(16);
        $(this).html($(this).html().replace(/&nbsp;/g, ' '));
        $(this).html($(this).html().replace(/\u200B/g, ' '));
        let text = $(this).html();
        const textSearch = $(this).text().trim().split(' ');
        if (textSearch.length <= 1) return;

        const textNormalize = removeAcentos(textSearch[0] + ' ' + textSearch[1])
            .toLowerCase().replace(/[^a-z ]/g, '');
        const textNormalize1 = removeAcentos(textSearch[0])
            .toLowerCase().replace(/[^a-z ]/g, '');
        const replaceWithMarker = (textReplace, markerClass, markerText) => {
            text = text.replace(
                textReplace,
                `<span contenteditable="false" class="legis auto ${markerClass}" data-ref="${randRef}">${markerText}</span>`
            );
            $(this).html(text);
        };

        if (textNormalize1 === 'anexo') {
            replaceWithMarker(
                typeof textSearch[1] !== 'undefined' ? textSearch[0] + ' ' + textSearch[1] : textSearch[0],
                'anexo',
                'anexo.'
            );
        }
        if (textNormalize1 === 'titulo' && romanToInt(textSearch[1].toString()) > 0) {
            replaceWithMarker(textSearch[0] + ' ' + textSearch[1], 'tit', 'TIT.');
        }
        if (textNormalize1 === 'capitulo' && romanToInt(textSearch[1].toString()) > 0) {
            replaceWithMarker(textSearch[0] + ' ' + textSearch[1], 'cap', 'CAP.');
        }
        if (textNormalize1 === 'secao' && romanToInt(textSearch[1].toString()) > 0) {
            replaceWithMarker(textSearch[0] + ' ' + textSearch[1], 'sec', 'Sec.');
        }
        if (textNormalize1 === 'subsecao' && romanToInt(textSearch[1].toString()) > 0) {
            replaceWithMarker(textSearch[0] + ' ' + textSearch[1], 'sub', 'Sub.');
        }
        if (textSearch[0].toLowerCase().includes('art') && textSearch[1].match(/\d+/g) != null) {
            replaceWithMarker(textSearch[0] + ' ' + textSearch[1], 'art', 'Art.');
        }
        if (textSearch[0].toLowerCase().includes('§') && textSearch[1].match(/\d+/g) != null) {
            replaceWithMarker(textSearch[0] + ' ' + textSearch[1], 'par', '§');
        }
        if (textSearch[0].toLowerCase().includes('§') && textSearch[0].match(/\d+/g) != null) {
            replaceWithMarker(textSearch[0], 'par', '§');
        }
        if (textNormalize === 'paragrafo unico' || textNormalize === 'par unico') {
            replaceWithMarker(textSearch[0] + ' ' + textSearch[1], 'par', '§');
        }
        if (
            romanToInt(textSearch[0].toString()) > 0 &&
            (textSearch[1].toString() === '-' || textSearch[1].toString() === '—')
        ) {
            replaceWithMarker(textSearch[0] + ' ' + textSearch[1], 'inc', 'Inc.');
        }
        if (textSearch[0].toString().slice(-1) === ')' && textSearch[0].toString().charAt(0) !== '(') {
            replaceWithMarker(textSearch[0], 'alin', 'Alin.');
        }
        if (textSearch[0].toString().slice(-1) === '.' && $.isNumeric(textSearch[0].toString().charAt(0))) {
            replaceWithMarker(textSearch[0], 'item', 'Item.');
        }
    });
}

export function undoRemoveEnum(iframe) {
    iframe.find('.legis.auto').each(function () {
        const textOld = $(this).attr('data-old-text').hexEncode().hexDecode();
        $(this).after(textOld);
        $(this).remove();
    });
}

function legisButton(button) {
    return button ? $(button) : $('.getLegisButtom').last();
}

function legisIframes(button) {
    const editor = legisButton(button).closest('div.cke');
    return editor.length ? editor.find('iframe.cke_wysiwyg_frame') : $('iframe.cke_wysiwyg_frame');
}

export function disableAllLegis(button) {
    legisIframes(button).each(function () {
        $(this).contents().find('.legis').attr('contenteditable', 'true');
    });
}

export function removeAllLegis() {
    $('iframe').each(function () {
        $(this).contents().find('.legis').each(function () {
            $(this).after($(this).text());
            $(this).remove();
        });
    });
}

export function cleanLegis(iframe) {
    iframe.find('p').not('[data-comment="true"]').each(function () {
        $(this).find('.legis.anexo').html('anexo.');
        $(this).find('.legis.tit').html('tit.');
        $(this).find('.legis.cap').html('cap.');
        $(this).find('.legis.sec').html('sec.');
        $(this).find('.legis.sub').html('sub.');
        $(this).find('.legis.art').html('art.');
        $(this).find('.legis.par').html('§');
        $(this).find('.legis.inc').html('inc.');
        $(this).find('.legis.alin').html('alin.');
        $(this).find('.legis.item').html('item.');
    });
}

export function getAnexoUnico(iframe) {
    const anexo = iframe.find('.legis.anexo');
    if (anexo.length === 1) anexo.html(anexo.html().replace('ANEXO I', 'ANEXO ÚNICO'));
}

export function getParUnico(iframe) {
    iframe.find('.legis.par').each(function () {
        let text = $(this).html();
        const art = $(this).find('a').attr('data-art');
        if (!iframe.find(`a[name=art${art}§2]`).length) {
            text = text.replace('§ 1º', 'Parágrafo único.');
            $(this).html(text);
            $(this).find('a').attr('data-parunico', 'true');
        }
    });
}

export function getDeclaraLegis(iframe) {
    const references = [];
    iframe.find('.legis.refext.refok').each(function () {
        const refext = $(this).attr('data-refext');
        if ($(`.legis[data-refext="${refext}"]`, iframe).length > 1) {
            if (references.includes(refext)) {
                $(this).find('a').text(formatRepeatedCitation($(this).text()));
            }
            references.push(refext);
        }
    });
}

export function checkText(this_, resultText, disp) {
    const alerts = [];
    const text = $(this_).text().trim();
    const textDispositivo = text.replace(disp + '.', '').trim();
    const firstChar = textDispositivo.charAt(0);
    const lastChar = textDispositivo.slice(-1);
    const lastWord = textDispositivo.split(' ').pop();
    $('<div>' + resultText + '</div>').text();

    if (disp === 'art' || disp === 'par') {
        if (lastChar !== '.' && lastChar !== ':') alerts.push(0);
        if (firstChar !== firstChar.toUpperCase()) alerts.push(1);
    } else if (disp === 'inc' || disp === 'alin') {
        if (!['.', ':', ';'].includes(lastChar) && lastWord !== 'e' && lastWord !== 'ou') alerts.push(2);
        if (firstChar !== firstChar.toLowerCase()) alerts.push(3);
    } else if (disp === 'item') {
        if (lastChar !== '.' && lastChar !== ';' && lastWord !== 'e' && lastWord !== 'ou') alerts.push(4);
        if (firstChar !== firstChar.toLowerCase()) alerts.push(5);
    }
    return alerts.length > 0 ? alerts.join(',') : false;
}

export function updateLegis(iframe) {
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

    iframe.find('p').not('[data-comment="true"]').each(function () {
        const this_ = $(this);
        alertDisp = '';
        this_.html(this_.html().replace(/&nbsp;/g, ' '));
        this_.html(this_.html().replace(/\u200B/g, ' '));
        let text = this_.html();
        const textSearch = this_.text().trim().split(' ')[0];
        const textSearchFull = this_.text().trim();
        const thisClassParag = this_.attr('class');
        let classParag;
        let linkAnchor;
        let result;
        let spaceBlank;

        if (textSearchFull.includes('@')) {
            getATTags(textSearchFull).forEach((tag) => {
                let dataValue = tag.toString();
                dataValue = dataValue.includes('#') ? dataValue.split('#')[0] : dataValue;
                dataValue = dataValue.includes('/') ? dataValue.split('/')[0] : dataValue;
                dataValue = dataValue.replace(/[\W_]+/g, '').toLowerCase();
                getRefLegis.push(dataValue);
                const value = tag.toString().slice(-1) === '.' ? tag.toString().slice(0, -1) : tag;
                const resultRef = this_.find(`.legis.refext:contains("${value}")`).length
                    ? '@' + value
                    : `<span class="legis refext">@${value}</span>`;
                text = text.replace('@' + value, resultRef);
                this_.html(text);
            });
        }

        if (textSearch.toLowerCase().includes('anexo.')) {
            classParag = verifyConfigValue('estilolegistica') ? thisClassParag : 'Texto_Centralizado';
            const indexAnex = iAnex + 1;
            const randRef = randomString(16);
            const ordAnex = romanizeNum(indexAnex);
            linkAnchor = `<a name="anexo${ordAnex.toLowerCase()}" data-anexo="${ordAnex.toLowerCase()}"></a>`;
            result = this_.find('.legis.anexo').length
                ? linkAnchor + 'ANEXO ' + ordAnex
                : `<span contenteditable="false" class="legis anexo" data-ref="${randRef}">${linkAnchor}ANEXO ${ordAnex}</span>`;
            text = text.replace(textSearch, result);
            this_.html(text).attr('class', classParag);
            iAnex++;
            iTit = 0; iCap = 0; iSec = 0; iSub = 0; iArt = 0; iPar = 0; iInc = 0; iAlin = 0; letterAlin = '';
        }
        if (textSearch.toLowerCase().includes('tit.')) {
            classParag = verifyConfigValue('estilolegistica') ? thisClassParag : 'Texto_Centralizado';
            const indexTit = iTit + 1;
            const randRef = randomString(16);
            ordTit = romanizeNum(indexTit);
            linkAnchor = `<a name="titulo${ordTit.toLowerCase()}" data-tit="${ordTit.toLowerCase()}"></a>`;
            result = this_.find('.legis.tit').length
                ? linkAnchor + 'TÍTULO ' + ordTit
                : `<span contenteditable="false" class="legis tit" data-ref="${randRef}">${linkAnchor}TÍTULO ${ordTit}</span>`;
            text = text.replace(textSearch, result);
            this_.html(text).attr('class', classParag);
            iTit++;
            iCap = 0; iSec = 0; iSub = 0;
        }
        if (textSearch.toLowerCase().includes('cap.')) {
            classParag = verifyConfigValue('estilolegistica') ? thisClassParag : 'Texto_Centralizado';
            const indexCap = iCap + 1;
            const randRef = randomString(16);
            ordCap = romanizeNum(indexCap);
            linkAnchor = iTit > 0
                ? `<a name="titulo${ordTit.toLowerCase()}capitulo${ordCap.toLowerCase()}" data-tit="${ordTit.toLowerCase()}" data-cap="${ordCap.toLowerCase()}"></a>`
                : `<a name="capitulo${ordCap.toLowerCase()}" data-cap="${ordCap.toLowerCase()}"></a>`;
            result = this_.find('.legis.cap').length
                ? linkAnchor + 'CAPÍTULO ' + ordCap
                : `<span contenteditable="false" class="legis cap" data-ref="${randRef}">${linkAnchor}CAPÍTULO ${ordCap}</span>`;
            text = text.replace(textSearch, result);
            this_.html(text).attr('class', classParag);
            iCap++;
            iSec = 0; iSub = 0;
        }
        if (textSearch.toLowerCase().includes('sec.')) {
            classParag = verifyConfigValue('estilolegistica') ? thisClassParag : 'Texto_Centralizado';
            const indexSec = iSec + 1;
            const randRef = randomString(16);
            ordSec = romanizeNum(indexSec);
            linkAnchor = iTit > 0
                ? `<a name="titulo${ordTit.toLowerCase()}capitulo${ordCap.toLowerCase()}secao${ordSec.toLowerCase()}" data-tit="${ordTit.toLowerCase()}" data-cap="${ordCap.toLowerCase()}" data-sec="${ordSec.toLowerCase()}"></a>`
                : `<a name="capitulo${ordCap.toLowerCase()}secao${ordSec.toLowerCase()}" data-cap="${ordCap.toLowerCase()}" data-sec="${ordSec.toLowerCase()}"></a>`;
            result = this_.find('.legis.sec').length
                ? linkAnchor + 'Seção ' + ordSec
                : `<span contenteditable="false" class="legis sec" data-ref="${randRef}">${linkAnchor}Seção ${ordSec}</span>`;
            if (!this_.find('strong').length) result = '<strong>' + result + '<strong>';
            text = text.replace(textSearch, result);
            this_.html(text).attr('class', classParag);
            iSec++;
        }
        if (textSearch.toLowerCase().includes('sub.')) {
            classParag = verifyConfigValue('estilolegistica') ? thisClassParag : 'Texto_Centralizado';
            const indexSub = iSub + 1;
            const randRef = randomString(16);
            const ordSub = romanizeNum(indexSub);
            linkAnchor = iTit > 0
                ? `<a name="titulo${ordTit.toLowerCase()}capitulo${ordCap.toLowerCase()}secao${ordSec.toLowerCase()}subsecao${ordSub.toLowerCase()}" data-tit="${ordTit.toLowerCase()}" data-cap="${ordCap.toLowerCase()}" data-sec="${ordSec.toLowerCase()}" data-sub="${ordSub.toLowerCase()}"></a>`
                : `<a name="capitulo${ordCap.toLowerCase()}secao${ordSec.toLowerCase()}subsecao${ordSub.toLowerCase()}" data-cap="${ordCap.toLowerCase()}" data-sec="${ordSec.toLowerCase()}" data-sub="${ordSub.toLowerCase()}"></a>`;
            result = this_.find('.legis.sub').length
                ? linkAnchor + 'Subseção ' + ordSub
                : `<span contenteditable="false" class="legis sub" data-ref="${randRef}">${linkAnchor}Subseção ${ordSub}</span>`;
            if (!this_.find('strong').length) result = '<strong>' + result + '<strong>';
            text = text.replace(textSearch, result);
            this_.html(text).attr('class', classParag);
            iSub++;
        }
        if (textSearch.toLowerCase().includes('art.')) {
            classParag = verifyConfigValue('estilolegistica') ? thisClassParag : 'Texto_Justificado_Recuo_Primeira_Linha';
            const indexArt = iArt + 1;
            const randRef = randomString(16);
            const ordArt = indexArt < 10 ? indexArt + 'º' : indexArt + '.';
            const enumDisp = 'Art. ' + ordArt;
            linkAnchor = `<a name="art${indexArt}" data-art="${indexArt}"></a>`;
            result = this_.find('.legis.art').length
                ? linkAnchor + enumDisp
                : `<span contenteditable="false" class="legis art" data-ref="${randRef}">${linkAnchor}${enumDisp}</span>`;
            alertDisp = checkText(this, result, 'art');
            spaceBlank = this_.text().replace('art.', '').trim() === '' ? '&nbsp;' : '';
            text = text.replace(textSearch, result);
            this_.html(text + spaceBlank).attr('class', classParag);
            iArt++;
            iPar = 0; iInc = 0; iAlin = 0; letterAlin = '';
        }
        if (textSearch.toLowerCase().includes('§')) {
            classParag = verifyConfigValue('estilolegistica') ? thisClassParag : 'Texto_Justificado_Recuo_Primeira_Linha';
            const indexPar = iPar + 1;
            const randRef = randomString(16);
            const ordPar = indexPar < 10 ? indexPar + 'º' : indexPar + '.';
            const enumDisp = '§ ' + ordPar;
            linkAnchor = `<a name="art${iArt}§${indexPar}" data-art="${iArt}" data-par="${indexPar}"></a>`;
            result = this_.find('.legis.par').length
                ? linkAnchor + enumDisp
                : `<span contenteditable="false" class="legis par" data-ref="${randRef}">${linkAnchor}${enumDisp}</span>`;
            alertDisp = checkText(this, result, 'par');
            spaceBlank = this_.text().replace('§', '').trim() === '' ? '&nbsp;' : '';
            text = text.replace(textSearch, result);
            this_.html(text + spaceBlank).attr('class', classParag);
            iPar++;
            iInc = 0; iAlin = 0; letterAlin = '';
        }
        if (textSearch.toLowerCase().includes('inc.')) {
            classParag = verifyConfigValue('estilolegistica') ? thisClassParag : 'Texto_Justificado_Recuo_Primeira_Linha';
            const indexInc = iInc + 1;
            const randRef = randomString(16);
            ordInc = romanizeNum(indexInc);
            const enumDisp = ordInc + ' -';
            linkAnchor = iPar > 0
                ? `<a name="art${iArt}§${iPar}${ordInc.toLowerCase()}" data-art="${iArt}" data-par="${iPar}" data-inc="${ordInc.toLowerCase()}"></a>`
                : `<a name="art${iArt}${ordInc.toLowerCase()}" data-art="${iArt}" data-inc="${ordInc.toLowerCase()}"></a>`;
            result = this_.find('.legis.inc').length
                ? linkAnchor + enumDisp
                : `<span contenteditable="false" class="legis inc" data-ref="${randRef}">${linkAnchor}${enumDisp}</span> `;
            alertDisp = checkText(this, result, 'inc');
            spaceBlank = this_.text().replace('inc.', '').trim() === '' ? '&nbsp;' : '';
            text = text.replace(textSearch, result);
            this_.html(text + spaceBlank).attr('class', classParag);
            iInc++;
            iAlin = 0; letterAlin = '';
        }
        if (textSearch.toLowerCase().includes('alin.')) {
            classParag = verifyConfigValue('estilolegistica') ? thisClassParag : 'Texto_Justificado_Recuo_Primeira_Linha';
            const indexAlin = iAlin + 1;
            const randRef = randomString(16);
            letteringNumAlin(indexAlin);
            const enumDisp = letterAlin + ')';
            linkAnchor = iPar > 0
                ? `<a name="art${iArt}§${iPar}${ordInc.toLowerCase()}" data-art="${iArt}" data-par="${iPar}" data-inc="${ordInc.toLowerCase()}" data-alin="${letterAlin}"></a>`
                : `<a name="art${iArt}${ordInc.toLowerCase()}${letterAlin}" data-art="${iArt}" data-inc="${ordInc.toLowerCase()}" data-alin="${letterAlin}"></a>`;
            result = this_.find('.legis.alin').length
                ? linkAnchor + enumDisp
                : `<span contenteditable="false" class="legis alin" data-ref="${randRef}">${linkAnchor}${enumDisp}</span> `;
            alertDisp = checkText(this, result, 'alin');
            spaceBlank = this_.text().replace('alin.', '').trim() === '' ? '&nbsp;' : '';
            text = text.replace(textSearch, result);
            this_.html(text + spaceBlank).attr('class', classParag);
            iAlin++;
            iItem = 0; letterAlin = '';
        }
        if (textSearch.toLowerCase().includes('item.')) {
            classParag = verifyConfigValue('estilolegistica') ? thisClassParag : 'Texto_Justificado_Recuo_Primeira_Linha';
            const indexItem = iItem + 1;
            const randRef = randomString(16);
            const enumDisp = indexItem + '.';
            linkAnchor = iPar > 0
                ? `<a name="art${iArt}§${iPar}${ordInc.toLowerCase()}" data-art="${iArt}" data-par="${iPar}" data-inc="${ordInc.toLowerCase()}" data-alin="${letterAlin}" data-item="${indexItem}"></a>`
                : `<a name="art${iArt}${ordInc.toLowerCase()}${letterAlin}${indexItem}" data-art="${iArt}" data-inc="${ordInc.toLowerCase()}" data-alin="${letterAlin}" data-item="${indexItem}"></a>`;
            result = this_.find('.legis.item').length
                ? linkAnchor + enumDisp
                : `<span contenteditable="false" class="legis item" data-ref="${randRef}">${linkAnchor}${enumDisp}</span> `;
            alertDisp = checkText(this, result, 'item');
            spaceBlank = this_.text().replace('item.', '').trim() === '' ? '&nbsp;' : '';
            text = text.replace(textSearch, result);
            this_.html(text + spaceBlank).attr('class', classParag);
            iItem++;
        }

        const htmlAlert = `<span contenteditable="false" class="tooltips" style="display:none" data-text-tip="${alertDisp}"></span>`;
        if (alertDisp !== '' && this_.find('span.ignoretip').length === 0) {
            this_.find('span.legis').attr('contenteditable', 'false').find('span.tooltips').remove();
            this_.find('span.legis').eq(0)
                .addClass('alert')
                .prepend(htmlAlert)
                .off('mouseover mouseout dblclick')
                .on('dblclick', function () { ignoreTooltips($(this)); })
                .on('mouseover', function () { showTooltips($(this)); })
                .on('mouseout', function () { hideTooltips($(this)); });
        } else {
            this_.find('span.legis').attr('contenteditable', 'false');
            this_.find('span.legis').eq(0)
                .removeClass('alert')
                .off('mouseover mouseout dblclick')
                .find('span.tooltips').remove();
        }
    });
    getRefLegis = uniq(getRefLegis);
}

export function getCodTip(codtip) {
    if (codtip.includes(',')) {
        return codtip.split(',').map((value) => alertText[parseInt(value)]).join('');
    }
    return alertText[parseInt(codtip)];
}

export function ignoreTooltips(this_) {
    $(this_).addClass('ignoretip').removeClass('alert').find('span.tooltips').remove();
}

export function showTooltips(this_) {
    const ignoretip = '<span class="ignoretext">dois cliques para ignorar alerta</span>';
    const tip = $(this_).find('span.tooltips').attr('data-text-tip');
    $(this_).find('span.tooltips').html(getCodTip(tip) + ignoretip).show();
}

export function hideTooltips(this_) {
    $(this_).find('span.tooltips').html('').hide();
}

export function getNameRef(anchor, iframe, this_) {
    const result = [];
    let refinc = '';
    let refselfart = '';

    if (
        typeof anchor.attr('data-inc') !== 'undefined' &&
        typeof anchor.attr('data-par') === 'undefined' &&
        typeof anchor.attr('data-art') !== 'undefined'
    ) {
        const refart = anchor.attr('data-art');
        iframe.find(`a[name*=art${refart}§]`).each(function () {
            if (typeof $(this).attr('data-inc') !== 'undefined') refinc = ' do <strong>caput</strong>';
        });
    }
    if (
        this_ !== null &&
        typeof anchor.attr('data-art') !== 'undefined' &&
        (typeof anchor.attr('data-inc') !== 'undefined' || typeof anchor.attr('data-par') !== 'undefined')
    ) {
        const refart = this_.closest('p').find('span.legis').eq(0).find('a');
        if (parseInt(refart.attr('data-art')) === parseInt(anchor.attr('data-art'))) refselfart = ' ';
    }

    const anexoValue = anchor.attr('data-anexo');
    const anexo = typeof anexoValue !== 'undefined' && anexoValue !== ''
        ? 'Anexo ' + anexoValue.toUpperCase()
        : '';
    if (anexo) result.push(anexo);

    const titValue = anchor.attr('data-tit');
    const tit = typeof titValue !== 'undefined' && titValue !== ''
        ? 'Título ' + titValue.toUpperCase()
        : '';
    if (tit) result.push(tit);

    const capValue = anchor.attr('data-cap');
    const cap = typeof capValue !== 'undefined' && capValue !== ''
        ? 'Capítulo ' + capValue.toUpperCase()
        : '';
    if (cap) result.push(cap);

    const secValue = anchor.attr('data-sec');
    const sec = typeof secValue !== 'undefined' && secValue !== ''
        ? 'Seção ' + secValue.toUpperCase()
        : '';
    if (sec) result.push(sec);

    const subValue = anchor.attr('data-sub');
    const sub = typeof subValue !== 'undefined' && subValue !== ''
        ? 'Subseção ' + subValue.toUpperCase()
        : '';
    if (sub) result.push(sub);

    const artValue = anchor.attr('data-art');
    const ordArt = parseInt(artValue) < 10 ? artValue + 'º' : artValue || '';
    const art = typeof artValue !== 'undefined' && artValue !== '' && refselfart === ''
        ? 'art. ' + ordArt
        : '';
    if (art) result.push(art);

    const parValue = anchor.attr('data-par');
    const ordPar = parseInt(parValue) < 10 ? parValue + 'º' : '.';
    let par = typeof parValue !== 'undefined' && parValue !== '' ? '§ ' + ordPar : '';
    if (anchor.attr('data-parunico') === 'true') par = 'parágrafo único';
    if (par) result.push(par);

    const incValue = anchor.attr('data-inc');
    const inc = typeof incValue !== 'undefined' && incValue !== ''
        ? 'inciso ' + incValue.toUpperCase() + refinc
        : '';
    if (inc) result.push(inc);

    const alinValue = anchor.attr('data-alin');
    const alin = typeof alinValue !== 'undefined' && alinValue !== '' ? `alínea "${alinValue}"` : '';
    if (alin) result.push(alin);

    const itemValue = anchor.attr('data-item');
    const item = typeof itemValue !== 'undefined' && itemValue !== '' ? `item "${itemValue}"` : '';
    if (item) result.push(item);

    const textRef = result.join(', ');
    return refselfart !== '' ? textRef + refselfart : textRef;
}

export function getRefsTags(iframe) {
    iframe.find('.legis.error').each(function () {
        $(this).after($(this).text());
        $(this).remove();
    });
    iframe.find('p').not('[data-comment="true"]').each(function () {
        const this_ = $(this);
        let text = this_.html();
        const textSearch = this_.text();
        if (!textSearch.includes('#')) return;

        getHashTags(textSearch).forEach((value) => {
            const refTag = value.toLowerCase();
            if (iframe.find(`a[name=${refTag}]`).length) {
                const anchor = iframe.find(`a[name=${refTag}]`);
                const textRef = getNameRef(anchor, iframe, null).trim();
                const refArt = anchor.closest('span.legis').attr('data-ref');
                const resultRef = `<a href="#${refTag}"><span contenteditable="false" class="legis ref" data-anchor="${refArt}">${textRef}</span></a>`;
                text = text.replace('#' + value, resultRef);
            } else {
                text = text.replace(
                    '#' + value,
                    `<span contenteditable="true" class="legis ref error">#${value}</span>`
                );
            }
            this_.html(text);
        });
    });
}

export async function getDadosNormas(iframe, arrayLegis) {
    const data = await searchLegislation(arrayLegis);
    if (!Array.isArray(data)) return data;

    updateRefsLegis(iframe, data);
    getRefLegis = [];
    getDeclaraLegis(iframe);
    return data;
}

export function getRefsLegis(iframe) {
    if (getRefLegis.length > 0) return getDadosNormas(iframe, getRefLegis);
    return Promise.resolve([]);
}

export function updateRefsLegis(iframe, data) {
    iframe.find('.legis.refext').each(function () {
        if ($(this).hasClass('refok')) return;

        const this_ = $(this);
        const text = this_.html();
        const dataLegis = this_.text();
        let dataValue = dataLegis.toString().replace('@', '');
        dataValue = dataValue.includes('#') ? dataValue.split('#')[0] : dataValue;
        dataValue = dataValue.includes('/') ? dataValue.split('/')[0] : dataValue;
        dataValue = dataValue.replace(/[\W_]+/g, '').toLowerCase();
        const normalizedValue = capitalizeFirstLetter(dataValue);
        const legisData = jmespath.search(data, `[?SiglaNorma=='${normalizedValue}']`);
        const nomeLegis = legisData.length > 0 && legisData[0].NomeNorma
            ? ' (' + legisData[0].NomeNorma + ')'
            : '';
        const htmlLegis = legisData.length > 0
            ? `<a href="${legisData[0].Link}" target="_blank">${legisData[0].DescNormaFull}${nomeLegis.trim()}</a>`
            : text;
        this_.html(htmlLegis);
        if (legisData.length > 0) {
            this_.attr('data-refext', dataValue).removeClass('error').addClass('refok');
        } else {
            this_.addClass('error').removeAttr('data-refext');
        }
    });
}

export function updateRefsTags(iframe) {
    iframe.find('.legis.ref').each(function () {
        const this_ = $(this);
        const dataRef = this_.attr('data-anchor');
        const anchor = iframe.find(`.legis[data-ref="${dataRef}"] a`);
        const textRef = getNameRef(anchor, iframe, this_).trim();
        if (typeof textRef !== 'undefined' && textRef !== '') {
            this_.html(textRef).removeClass('error');
            this_.closest('a')
                .attr('href', '#' + anchor.attr('name'))
                .attr('data-cke-saved-href', '#' + anchor.attr('name'));
        } else {
            this_.addClass('error');
        }
    });
}

export function observeKey(iframe, button) {
    iframe.find('body').off('keydown.seiproLegis').on('keydown.seiproLegis', function (event) {
        if (event.keyCode === 13 && legisButton(button).hasClass('cke_button_on')) getLegis(iframe);
    });
}

export function getNotComment(iframe) {
    iframe.find('table').each(function () {
        $(this).find('p').attr('data-comment', 'true');
    });
}

export function getLegis(iframe) {
    getNotComment(iframe);
    removeEnum(iframe);
    cleanLegis(iframe);
    updateLegis(iframe);
    getParUnico(iframe);
    getRefsTags(iframe);
    updateRefsTags(iframe);
    return getRefsLegis(iframe);
}

export function iframeLegis(button) {
    legisIframes(button).each(function () {
        const iframe = $(this).contents();
        getLegis(iframe);
        observeKey(iframe, button);
    });
}

export function initLegis(button) {
    const btn = legisButton(button);
    if (btn.hasClass('cke_button_off')) {
        btn.addClass('cke_button_on').removeClass('cke_button_off')
            .attr('aria-label', 'Desativar formatação normativa')
            .attr('onmouseover', "return infraTooltipMostrar('Desativar formatação normativa')");
        btn.find('.cke_button_label').text('Desativar formatação normativa');
        iframeLegis(button);
    } else {
        btn.addClass('cke_button_off').removeClass('cke_button_on')
            .attr('aria-label', 'Formatar e numerar texto normativo')
            .attr('onmouseover', "return infraTooltipMostrar('Formatar e numerar texto normativo')");
        btn.find('.cke_button_label').text('Formatar e numerar texto normativo');
        disableAllLegis(button);
    }
}
