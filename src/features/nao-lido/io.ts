// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Marcar como "Não Visualizado" (config `marcar_naolido`) — IO.
 * Fronteira de rede/serialização com o SEI: GET de página, POST de form e
 * serialização x-www-form-urlencoded (charset ISO-8859-1) esperada pelo backend.
 * Globais lidos do escopo isolado no momento da chamada ($, parent, escapeComponent).
 * Relocado verbatim de sei-functions-pro.js (split io/view) — comportamento idêntico.
 */

// Serializa um form do SEI (#frmAtividadeListar etc.) no formato
// x-www-form-urlencoded esperado pelo backend (charset ISO-8859-1), aplicando os
// `overrides` informados e as regras de encoding específicas de cada campo.
// Centraliza a lógica que antes ficava duplicada nos POSTs de "Atualizar
// Andamento" e "Enviar Processo".
export function serializeSeiForm(form, overrides) {
    var param = {};
    form.find('input[type=hidden]').each(function () {
        var name = $(this).attr('name'), id = $(this).attr('id');
        if (name && id && id.indexOf('hdn') !== -1) param[name] = $(this).val();
    });
    form.find('input[type=text]').each(function () {
        var id = $(this).attr('id');
        if (id && id.indexOf('txt') !== -1) param[id] = $(this).val();
    });
    form.find('select').each(function () {
        var id = $(this).attr('id');
        if (id && id.indexOf('sel') !== -1) param[id] = $(this).val();
    });
    form.find('input[type=radio]').each(function () {
        var name = $(this).attr('name');
        if (name && name.indexOf('rdo') !== -1) param[name] = $(this).val();
    });
    $.extend(param, overrides || {});

    var parts = [];
    for (var k in param) {
        if (!param.hasOwnProperty(k)) continue;
        var valor;
        if (k === 'hdnAssuntos' || k === 'hdnInteressados') {
            valor = param[k];                                   // já vêm codificados pelo SEI
        } else if (k === 'txtDescricao') {
            valor = parent.encodeURI_toHex(String(param[k]).normalize('NFC'));
        } else {
            valor = escapeComponent(param[k]);
        }
        parts.push(k + '=' + valor);
    }
    return parts.join('&');
}

// GET de uma página do SEI como Promise (resolve com o HTML retornado).
export function getSeiHtml(url) {
    return Promise.resolve($.ajax({ url: url }));
}

// POST de um form do SEI como Promise. Resolve com { html, xhr } para que o
// chamador possa inspecionar xhr.responseURL via isAjaxRedirectAction.
export function postSeiForm(url, data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        $.ajax({
            method: 'POST',
            data: data,
            url: url,
            contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1',
            xhr: function () { return xhr; }
        }).done(function (html) { resolve({ html: html, xhr: xhr }); })
          .fail(function () { reject(); });
    });
}
