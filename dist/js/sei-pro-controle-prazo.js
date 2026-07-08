(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/core/global.js
  var globalRef = typeof window !== "undefined" ? window : globalThis;
  function aliasGlobal(name, value) {
    if (typeof globalRef[name] === "undefined") {
      globalRef[name] = value;
    }
  }

  // src/features/controlar-prazos/domain.js
  var domain_exports = {};
  __export(domain_exports, {
    buildControlePrazoNativeTooltip: () => buildControlePrazoNativeTooltip
  });
  function buildControlePrazoNativeTooltip(prazoInfo, dateValue) {
    var dateText = dateValue && moment(dateValue, "YYYY-MM-DD HH:mm:ss").isValid() ? moment(dateValue, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY") : "";
    if (prazoInfo && prazoInfo.concluido) {
      return "Conclu\xEDdo em " + dateText;
    }
    if (prazoInfo && prazoInfo.content) {
      return prazoInfo.content;
    }
    var userName = typeof getCurrentUserNamePro === "function" ? getCurrentUserNamePro() : "";
    var daysRemaining = prazoInfo && prazoInfo.diasRestantes !== null && typeof prazoInfo.diasRestantes !== "undefined" ? prazoInfo.diasRestantes : "";
    if (userName && dateText && daysRemaining !== "") {
      return userName + " " + dateText + " (" + daysRemaining + " " + (Math.abs(daysRemaining) == 1 ? "dia" : "dias") + ")";
    }
    if (userName && dateText) {
      return userName + " " + dateText;
    }
    return dateText || prazoInfo && prazoInfo.content || "";
  }

  // src/features/controlar-prazos/io.js
  var io_exports = {};
  __export(io_exports, {
    fetchControlePrazoDefinirHref: () => fetchControlePrazoDefinirHref,
    fetchControlePrazoNativeInfo: () => fetchControlePrazoNativeInfo,
    fillNativeControlePrazoFormDoc: () => fillNativeControlePrazoFormDoc,
    findControlePrazoFormDoc: () => findControlePrazoFormDoc,
    findControlePrazoSalvarBtn: () => findControlePrazoSalvarBtn,
    getControlePrazoNativeHref: () => getControlePrazoNativeHref,
    getControlePrazoNativeInfo: () => getControlePrazoNativeInfo
  });
  function getControlePrazoNativeInfo(row) {
    var _row = $(row);
    var nativeLink = _row.find('a[href*="acao=controle_prazo_definir"], a[href*="controle_prazo_definir"]').first();
    if (nativeLink.length == 0) {
      nativeLink = _row.find('img[src*="controle_prazo"]').first().closest('a[href*="acao=controle_prazo_definir"], a[href*="controle_prazo_definir"]');
      if (nativeLink.length == 0) {
        nativeLink = _row.find('img[src*="controle_prazo"]').first();
      }
    }
    if (nativeLink.length == 0) {
      return false;
    }
    var nativeAnchor = nativeLink.closest("a");
    var href = nativeLink.attr("href") || nativeAnchor.attr("href") || "";
    var onmouseover = nativeLink.attr("onmouseover") || nativeAnchor.attr("onmouseover") || nativeLink.attr("title") || nativeAnchor.attr("title") || "";
    var tooltipArray = extractGroupTableTooltipToArray(onmouseover);
    var tooltip = tooltipArray && tooltipArray.length > 0 && tooltipArray[0] != "" ? tooltipArray[0] : onmouseover;
    var src = nativeLink.attr("src") || nativeLink.find("img").attr("src") || nativeAnchor.find("img").attr("src") || "";
    var prazoInfo = typeof parseControlePrazoNativo === "function" ? parseControlePrazoNativo(tooltip, src) : false;
    if (!prazoInfo || !prazoInfo.dateDue && !prazoInfo.dateFinished) {
      return false;
    }
    var params = getParamsUrlPro(href);
    prazoInfo.id_controle_prazo = params && typeof params.id_controle_prazo !== "undefined" ? params.id_controle_prazo : false;
    prazoInfo.id_procedimento = params && typeof params.id_procedimento !== "undefined" ? params.id_procedimento : false;
    prazoInfo.href = href;
    prazoInfo.tooltip = tooltip;
    prazoInfo.src = src;
    prazoInfo.nativeLink = nativeAnchor.length > 0 ? nativeAnchor : nativeLink;
    return prazoInfo;
  }
  function getControlePrazoNativeHref(row, id_procedimento, id_controle_prazo = false, allowFallback = true) {
    var _row = $(row);
    var nativeLink = _row.find('a[href*="acao=controle_prazo_definir"], a[href*="controle_prazo_definir"]').first();
    var href = nativeLink.attr("href") || nativeLink.closest("a").attr("href") || "";
    if (!href) {
      var comandoNative = $(divComandos + ' a[href*="acao=controle_prazo_definir"], ' + divComandos + ' a[onclick*="controle_prazo_definir"]').first();
      href = comandoNative.attr("href") || comandoNative.closest("a").attr("href") || comandoNative.attr("onclick") || "";
      if (href) {
        var hrefMatch = href.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, "g"));
        href = hrefMatch && hrefMatch.length > 0 ? hrefMatch[0] : href;
      }
    }
    if (href && id_controle_prazo && href.indexOf("id_controle_prazo=") === -1) {
      href = href + (href.indexOf("?") === -1 ? "?" : "&") + "id_controle_prazo=" + id_controle_prazo;
    }
    return href;
  }
  function fetchControlePrazoDefinirHref(trabalharHref) {
    if (!trabalharHref) return Promise.resolve(false);
    var absTrab;
    try {
      absTrab = new URL(trabalharHref, location.href).href;
    } catch (e) {
      return Promise.resolve(false);
    }
    return fetch(absTrab, { credentials: "include" }).then(function(r) {
      return r.text();
    }).then(function(html) {
      var m = html.match(/src="([^"]*procedimento_visualizar[^"]*)"/i);
      if (!m) return false;
      var visUrl = new URL(m[1].replace(/&amp;/g, "&"), absTrab).href;
      return fetch(visUrl, { credentials: "include" }).then(function(r) {
        return r.text();
      }).then(function(vhtml) {
        var lm = vhtml.match(/href="([^"]*controle_prazo_definir[^"]*)"/i);
        return lm ? new URL(lm[1].replace(/&amp;/g, "&"), visUrl).href : false;
      });
    }).catch(function() {
      return false;
    });
  }
  function fetchControlePrazoNativeInfo(trabalharHref) {
    if (!trabalharHref) return Promise.resolve(false);
    var absTrab;
    try {
      absTrab = new URL(trabalharHref, location.href).href;
    } catch (e) {
      return Promise.resolve(false);
    }
    return fetch(absTrab, { credentials: "include" }).then(function(r) {
      return r.text();
    }).then(function(html) {
      var m = html.match(/src="([^"]*procedimento_visualizar[^"]*)"/i);
      if (!m) return false;
      var visUrl = new URL(m[1].replace(/&amp;/g, "&"), absTrab).href;
      return fetch(visUrl, { credentials: "include" }).then(function(r) {
        return r.text();
      }).then(function(vhtml) {
        var block = vhtml.match(/<a\b[^>]*controle_prazo_definir[^>]*>\s*<img\b[^>]*src="[^"]*controle_prazo[12]\.svg[^"]*"[^>]*>/i);
        if (!block) return false;
        return getControlePrazoNativeInfo($("<div>").html(block[0].replace(/&amp;/g, "&") + "</a>")) || false;
      });
    }).catch(function() {
      return false;
    });
  }
  function findControlePrazoFormDoc(doc) {
    try {
      if (doc && doc.getElementById && doc.getElementById("frmControlePrazoCadastro")) return doc;
      var frames = doc && doc.querySelectorAll ? doc.querySelectorAll("iframe, frame") : [];
      for (var i = 0; i < frames.length; i++) {
        try {
          var sub = findControlePrazoFormDoc(frames[i].contentDocument);
          if (sub) return sub;
        } catch (e) {
        }
      }
    } catch (e) {
    }
    return null;
  }
  function fillNativeControlePrazoFormDoc(fdoc, mode, dateRef, daysRef, daysUteis) {
    var radioId = mode === "concluir" ? "optConcluir" : mode === "dias" ? "optDias" : "optDataCerta";
    var radio = fdoc.getElementById(radioId);
    if (radio) {
      radio.checked = true;
      try {
        radio.click();
      } catch (e) {
      }
    }
    if (mode === "data") {
      var t = fdoc.getElementById("txtPrazo");
      if (t) t.value = moment(dateRef, "YYYY-MM-DD").format("DD/MM/YYYY");
    } else if (mode === "dias") {
      var d = fdoc.getElementById("txtDias");
      if (d) d.value = String(parseInt(daysRef, 10));
      var c = fdoc.getElementById("chkSinDiasUteis");
      if (c) c.checked = !!daysUteis;
    }
  }
  function findControlePrazoSalvarBtn(fdoc) {
    var btns = fdoc.querySelectorAll("button, input[type=submit], input[type=button]");
    for (var i = 0; i < btns.length; i++) {
      var label = (btns[i].value || btns[i].textContent || "").trim();
      if (/salvar/i.test(label)) return btns[i];
    }
    var form = fdoc.getElementById("frmControlePrazoCadastro");
    return form ? form.querySelector("button[type=submit], input[type=submit]") || null : null;
  }

  // src/features/controlar-prazos/view.js
  var view_exports = {};
  __export(view_exports, {
    addControlePrazo: () => addControlePrazo,
    configDatesSwitchChangePrazo: () => configDatesSwitchChangePrazo,
    getControlePrazoNativeTargetRows: () => getControlePrazoNativeTargetRows,
    initControlePrazo: () => initControlePrazo,
    openControlePrazoNativoDialog: () => openControlePrazoNativoDialog,
    reconcileControlePrazoColspan: () => reconcileControlePrazoColspan,
    renderControlePrazoNativePreview: () => renderControlePrazoNativePreview,
    scheduleControlePrazoColspanReconcile: () => scheduleControlePrazoColspanReconcile,
    setControlePrazo: () => setControlePrazo,
    setControlePrazoNativo: () => setControlePrazoNativo,
    updateControlePrazoNativeRow: () => updateControlePrazoNativeRow,
    updateTablePrazoProcesso: () => updateTablePrazoProcesso
  });
  function renderControlePrazoNativePreview(prazoInfo, dateValue, hrefNative) {
    var dateSort = prazoInfo && prazoInfo.dateSort ? prazoInfo.dateSort : dateValue;
    if (!dateSort) {
      return "";
    }
    var dateMoment = moment(dateSort, "YYYY-MM-DD HH:mm:ss");
    var tooltipText = buildControlePrazoNativeTooltip(prazoInfo, dateSort);
    var href = hrefNative || prazoInfo && prazoInfo.href || "";
    var linkOpen = href ? '<a href="' + href + '" onmouseover="return infraTooltipMostrar(' + quoteInlineJsText(tooltipText) + `,'Controle de Prazo');" onmouseout="return infraTooltipOcultar();">` : '<span onmouseover="return infraTooltipMostrar(' + quoteInlineJsText(tooltipText) + `,'Controle de Prazo');" onmouseout="return infraTooltipOcultar();">`;
    var linkClose = href ? "</a>" : "</span>";
    if (prazoInfo && prazoInfo.concluido) {
      return '<span class="dateboxDisplay tagTableText_date_entregue" data-time-sorter="' + dateSort + '" data-colortag="#ddf1dd" data-tagname="date_entregue" data-nametag="Entregue" data-type="date" data-seipro-add-prazo="1">   <span class="dateBoxIcon" onmouseover="return infraTooltipMostrar(' + quoteInlineJsText(tooltipText) + `,'Controle de Prazo');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-check-circle verdeColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i></span> Conclu\xEDdo</span>`;
    }
    var config = {
      date: dateMoment.format("YYYY-MM-DD HH:mm:ss"),
      dateDue: dateMoment.format("YYYY-MM-DD HH:mm:ss"),
      dateMaxProgress: 30,
      countdays: true,
      workday: false,
      duesetdate: true,
      displayformat: "DD/MM/YYYY HH:mm",
      action: "addControlePrazo(this)"
    };
    var htmlDatePreview = getDatesPreview(config).replace('onclick="addControlePrazo(this)"', 'data-seipro-add-prazo="1"' + (href ? ' data-native-href="' + href + '"' : ""));
    return htmlDatePreview;
  }
  function updateControlePrazoNativeRow(tr, prazoInfo, dateValue, hrefNative) {
    var _tr = $(tr);
    var dateSort = prazoInfo && prazoInfo.dateSort ? prazoInfo.dateSort : dateValue;
    var tdProcesso = _tr.find("td").eq(1);
    var tooltipText = buildControlePrazoNativeTooltip(prazoInfo, dateValue);
    var nativeHref = hrefNative || prazoInfo && prazoInfo.href || "";
    var nativeSrc = prazoInfo && prazoInfo.concluido ? "controle_prazo2.svg" : "controle_prazo1.svg";
    var nativeIcon = nativeHref ? '<a href="' + nativeHref + '" onmouseover="return infraTooltipMostrar(' + quoteInlineJsText(tooltipText) + `,'Controle de Prazo');" onmouseout="return infraTooltipOcultar();"><img src="` + nativeSrc + '" class="imagemStatus"></a>' : '<img src="' + nativeSrc + '" class="imagemStatus" onmouseover="return infraTooltipMostrar(' + quoteInlineJsText(tooltipText) + `,'Controle de Prazo');" onmouseout="return infraTooltipOcultar();">`;
    var htmlDatePreview = renderControlePrazoNativePreview(prazoInfo, dateValue, nativeHref);
    tdProcesso.find('a[href*="andamento_marcador_gerenciar"], a[href*="controle_prazo_definir"], a[href*="acao=controle_prazo_definir"], img[src*="controle_prazo"]').remove();
    tdProcesso.append(nativeIcon);
    _tr.removeClass("infraTrAtrasada").removeClass("infraTrAlerta");
    if (prazoInfo && !prazoInfo.concluido) {
      if (prazoInfo.vencido) {
        _tr.addClass("infraTrAtrasada");
      } else if (dateValue && moment(dateValue, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
        _tr.addClass("infraTrAlerta");
      }
    }
    if (htmlDatePreview) {
      _tr.find("td.prazoBoxDisplay").html(htmlDatePreview).attr("data-time-sorter", dateSort);
    }
  }
  function getControlePrazoNativeTargetRows(this_) {
    var tblProcessos = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    if (this_) {
      var _this = $(this_);
      if (_this.closest("tr").length > 0) {
        return _this.closest("tr");
      }
    }
    return tblProcessos.find('input[type="checkbox"]:checked').closest("tr").not(".tableHeader");
  }
  function openControlePrazoNativoDialog(this_, form, hrefNative, nativeInfo, dateRef, daysRef, dueSetDate, textControle, processo) {
    var tblProcessos = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    var hasActiveDeadline = !!(nativeInfo && nativeInfo.id_controle_prazo && !nativeInfo.concluido);
    var modeSelected = "data";
    var dateValue = nativeInfo && nativeInfo.dateDue ? moment(nativeInfo.dateDue, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD") : dateRef;
    var daysValue = nativeInfo && nativeInfo.diasRestantes !== null && typeof nativeInfo.diasRestantes !== "undefined" ? Math.max(1, Math.abs(nativeInfo.diasRestantes)) : daysRef;
    var diasUteis = nativeInfo && nativeInfo.content && removeAcentos(nativeInfo.content).toLowerCase().indexOf("dia util") !== -1 ? true : false;
    var htmlBox = '<div class="dialogBoxDiv">   <table style="font-size: 10pt;width: 100%;" class="seiProForm">      <tr style="height: 40px;">          <td style="vertical-align: bottom;">               <i class="iconPopup iconSwitch fas fa-calendar-day azulColor"></i>                <label><input type="radio" name="configControlePrazoMode" value="data" ' + (modeSelected == "data" ? "checked" : "") + '> Data certa</label>          </td>          <td style="text-align: right;">               <input type="date" id="configControlePrazoDate" value="' + dateValue + '" style="width: 150px;">          </td>      </tr>      <tr style="height: 40px;">          <td style="vertical-align: bottom;">               <i class="iconPopup iconSwitch fas fa-hourglass-half azulColor"></i>                <label><input type="radio" name="configControlePrazoMode" value="dias" ' + (modeSelected == "dias" ? "checked" : "") + '> Prazo em dias</label>          </td>          <td style="text-align: right;">               <input type="number" min="1" step="1" id="configControlePrazoDays" value="' + daysValue + '" style="width: 100px;">               <label style="margin-left: 10px;"><input type="checkbox" id="configControlePrazoDaysUteis" ' + (diasUteis ? "checked" : "") + "> Dias \xFAteis</label>          </td>      </tr>   </table></div>";
    var btnDialogBoxPro = [];
    if (hasActiveDeadline) {
      btnDialogBoxPro.push({
        text: "Concluir prazo",
        icon: "ui-icon-closethick",
        click: function(event) {
          setControlePrazoNativo("concluir", this_, form, hrefNative, {
            date: $("#configControlePrazoDate").val(),
            days: $("#configControlePrazoDays").val(),
            daysUteis: $("#configControlePrazoDaysUteis").is(":checked"),
            idControlePrazo: nativeInfo && nativeInfo.id_controle_prazo ? nativeInfo.id_controle_prazo : false
          });
        }
      });
    }
    btnDialogBoxPro.push({
      text: textControle + " prazo",
      class: "confirm",
      icon: "ui-icon-disk",
      click: function() {
        setControlePrazoNativo($("#dialogBoxPro").find('input[name="configControlePrazoMode"]:checked').val() || "data", this_, form, hrefNative, {
          date: $("#configControlePrazoDate").val(),
          days: $("#configControlePrazoDays").val(),
          daysUteis: $("#configControlePrazoDaysUteis").is(":checked"),
          idControlePrazo: nativeInfo && nativeInfo.id_controle_prazo ? nativeInfo.id_controle_prazo : false
        });
      }
    });
    resetDialogBoxPro("dialogBoxPro");
    window.dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv"> ' + htmlBox + "</div>").dialog({
      title: this_ ? textControle + " controle de prazo (" + processo + ")" : "Controle de prazo em processos (" + tblProcessos.find('input[type="checkbox"]:checked').length + ")",
      width: 580,
      open: function() {
      },
      close: function() {
        if (this_) $(this_).closest("table").find('thead th a[onclick*="setSelectAllTr"]').data("index", 1).trigger("click");
      },
      buttons: btnDialogBoxPro
    });
  }
  function setControlePrazoNativo(mode, this_, form, href, param = false, callback = false) {
    var _this = this_ ? $(this_) : false;
    var tblProcessos = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    var selectedRows = getControlePrazoNativeTargetRows(this_);
    var failCount = 0;
    var _mode = param && typeof param.mode !== "undefined" && param.mode !== false ? param.mode : mode;
    var _dateRef = param && typeof param.date !== "undefined" ? param.date : $("#configControlePrazoDate").val();
    var _daysRef = param && typeof param.days !== "undefined" ? param.days : $("#configControlePrazoDays").val();
    var _daysUteis = param && typeof param.daysUteis !== "undefined" ? param.daysUteis : $("#configControlePrazoDaysUteis").is(":checked");
    var _idControlePrazo = param && typeof param.idControlePrazo !== "undefined" ? param.idControlePrazo : false;
    if (selectedRows.length == 0 && !_this) {
      alertaBoxPro("Error", "exclamation-triangle", "Selecione pelo menos um processo.");
      return;
    }
    if (_mode == "data" && !_dateRef) {
      alertaBoxPro("Error", "exclamation-triangle", "Selecione uma data!");
      return;
    }
    if (_mode == "dias" && (!_daysRef || parseInt(_daysRef, 10) <= 0)) {
      alertaBoxPro("Error", "exclamation-triangle", "Informe a quantidade de dias!");
      return;
    }
    if (_mode == "dias") {
      _dateRef = buildSubmittedDate("dias").slice(0, 10);
      _mode = "data";
    }
    if (_this && _this.closest(".kanban-item").length) {
      var id = _this.closest(".kanban-item").attr("data-eid");
      var _addEl = $("#P" + id + " td.prazoBoxDisplay [data-seipro-add-prazo]")[0];
      if (_addEl) addControlePrazo(_addEl);
      return false;
    }
    function buildSubmittedDate(modeSubmit) {
      if (modeSubmit == "data") {
        return moment(_dateRef, "YYYY-MM-DD").format("YYYY-MM-DD 23:59:59");
      }
      if (modeSubmit == "dias") {
        var n = parseInt(_daysRef, 10) || 0;
        var d = moment();
        if (!_daysUteis) return d.add(n, "days").format("YYYY-MM-DD 23:59:59");
        var added = 0;
        while (added < n) {
          d.add(1, "day");
          if (d.isoWeekday() <= 5) added++;
        }
        return d.format("YYYY-MM-DD 23:59:59");
      }
      return moment().format("YYYY-MM-DD 23:59:59");
    }
    function buildNativeIconHtml(prazoInfo, hrefNative, dateValue) {
      var tooltipText = buildControlePrazoNativeTooltip(prazoInfo, dateValue);
      var src = prazoInfo && prazoInfo.concluido ? "controle_prazo2.svg" : "controle_prazo1.svg";
      var hrefIcon = hrefNative || prazoInfo && prazoInfo.href || "";
      var html = hrefIcon ? '<a href="' + hrefIcon + '" onmouseover="return infraTooltipMostrar(' + quoteInlineJsText(tooltipText) + `,'Controle de Prazo');" onmouseout="return infraTooltipOcultar();"><img src="` + src + '" class="imagemStatus"></a>' : '<img src="' + src + '" class="imagemStatus" onmouseover="return infraTooltipMostrar(' + quoteInlineJsText(tooltipText) + `,'Controle de Prazo');" onmouseout="return infraTooltipOcultar();">`;
      return html;
    }
    function submitNativeForRow(row, next) {
      var _row = $(row);
      var prevCell = _row.find("td.prazoBoxDisplay").html();
      var rowInfo = getControlePrazoNativeInfo(_row);
      var rowTrabalharHref = _row.find('a[href*="procedimento_trabalhar"]').attr("href");
      var idProc = rowInfo && rowInfo.id_procedimento ? rowInfo.id_procedimento : getParamsUrlPro(rowTrabalharHref).id_procedimento;
      var existingHref = getControlePrazoNativeHref(_row, idProc, _idControlePrazo || rowInfo && rowInfo.id_controle_prazo);
      var hasExistingForm = _row.find('a[href*="controle_prazo_definir"]').length > 0 || !!_idControlePrazo || !!(rowInfo && rowInfo.id_controle_prazo);
      _row.find("td.prazoBoxDisplay").html('<i class="fas fa-sync fa-spin ' + (SeiPro.sei.adapter.isNewSEI() ? "brancoColor" : "azulColor") + '"></i>');
      if (existingHref && hasExistingForm) {
        runIframe(existingHref);
      } else if (_mode === "concluir") {
        _row.find("td.prazoBoxDisplay").html(prevCell);
        failCount++;
        next();
      } else {
        fetchControlePrazoDefinirHref(rowTrabalharHref).then(function(resolvedHref) {
          if (!resolvedHref) {
            _row.find("td.prazoBoxDisplay").html(prevCell);
            failCount++;
            next();
            return;
          }
          runIframe(resolvedHref);
        });
      }
      return;
      function runIframe(rowHref) {
        var iframe = document.createElement("iframe");
        iframe.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;top:-9999px;border:0;";
        var stage = 0;
        var finished = false;
        var capturedAlert = "";
        var timeoutId = setTimeout(function() {
          finish(false);
        }, 2e4);
        function cleanup() {
          clearTimeout(timeoutId);
          if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }
        function finish(ok, resultDoc) {
          if (finished) return;
          finished = true;
          cleanup();
          if (ok) {
            renderRowFromResult(resultDoc);
          } else {
            _row.find("td.prazoBoxDisplay").html(prevCell);
            failCount++;
          }
          if (typeof next === "function") next();
        }
        function renderRowFromResult(resultDoc) {
          var prazoInfo = false;
          if (resultDoc) {
            try {
              var link = $(resultDoc).find('a[href*="controle_prazo_definir"], img[src*="controle_prazo"]').first();
              if (link.length) {
                var holder = link.closest("a").length ? link.closest("a") : link;
                prazoInfo = getControlePrazoNativeInfo($("<div>").append(holder.clone())) || false;
              }
            } catch (e) {
            }
          }
          if (prazoInfo && (prazoInfo.dateDue || prazoInfo.dateFinished)) {
            prazoInfo.href = prazoInfo.href || rowHref;
            updateControlePrazoNativeRow(_row, prazoInfo, prazoInfo.dateSort, prazoInfo.href);
            return;
          }
          fetchControlePrazoNativeInfo(rowTrabalharHref).then(function(info) {
            if (info && (info.dateDue || info.dateFinished)) {
              info.href = info.href || rowHref;
              updateControlePrazoNativeRow(_row, info, info.dateSort, info.href);
            } else {
              renderOptimistic();
            }
          });
          function renderOptimistic() {
            var dateValue = buildSubmittedDate(_mode);
            var concluded = _mode === "concluir";
            var optInfo = {
              fonte: "nativo",
              content: buildControlePrazoNativeTooltip({ concluido: concluded, diasRestantes: _mode === "dias" ? parseInt(_daysRef, 10) : null }, dateValue),
              responsavel: typeof getCurrentUserNamePro === "function" ? getCurrentUserNamePro() : false,
              dateDue: concluded ? false : dateValue,
              dateFinished: concluded ? dateValue : false,
              dateSort: dateValue,
              diasRestantes: _mode === "dias" ? parseInt(_daysRef, 10) : null,
              concluido: concluded,
              vencido: false,
              status: concluded ? "concluido" : "ativo",
              src: concluded ? "controle_prazo2.svg" : "controle_prazo1.svg",
              href: rowHref,
              id_procedimento: idProc,
              id_controle_prazo: _idControlePrazo
            };
            updateControlePrazoNativeRow(_row, optInfo, optInfo.dateSort, optInfo.href);
          }
        }
        iframe.addEventListener("load", function() {
          var idoc;
          try {
            idoc = iframe.contentDocument;
          } catch (e) {
            finish(false);
            return;
          }
          if (!idoc) {
            finish(false);
            return;
          }
          try {
            iframe.contentWindow.alert = function(m) {
              capturedAlert = String(m || "");
            };
          } catch (e) {
          }
          if (stage === 0) {
            var fdoc = findControlePrazoFormDoc(idoc);
            if (!fdoc) {
              return;
            }
            stage = 1;
            try {
              fillNativeControlePrazoFormDoc(fdoc, _mode, _dateRef, _daysRef, _daysUteis);
              var btn = findControlePrazoSalvarBtn(fdoc);
              if (!btn) {
                finish(false);
                return;
              }
              capturedAlert = "";
              btn.click();
              if (capturedAlert && /selecione|obrigat|inv[aá]lid/i.test(capturedAlert)) {
                finish(false);
              }
            } catch (e) {
              finish(false);
            }
          } else {
            var txt = "";
            try {
              txt = idoc.body && idoc.body.innerText || "";
            } catch (e) {
            }
            var loc = "";
            try {
              loc = idoc.location ? idoc.location.href : "";
            } catch (e) {
            }
            var temExcecaoSei = false;
            try {
              temExcecaoSei = !!(idoc.querySelector && idoc.querySelector("#divInfraExcecao, .infraExcecao"));
            } catch (e) {
            }
            var failed = capturedAlert && /selecione|obrigat|inv[aá]lid/i.test(capturedAlert) || temExcecaoSei || /Acesso negado/i.test(txt) || /sip\/login\.php/.test(loc);
            finish(!failed, failed ? null : idoc);
          }
        });
        document.body.appendChild(iframe);
        iframe.src = rowHref;
      }
    }
    function runQueue(index) {
      if (index >= selectedRows.length) {
        if (_this) {
          tblProcessos.find('thead th a[onclick*="setSelectAllTr"]').data("index", 1).trigger("click");
        }
        setTimeout(function() {
          if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload tableHomeDestroy");
          tableHomeDestroy(true);
        }, 500);
        if (typeof callback === "function") {
          callback();
        }
        if (failCount > 0) {
          alertaBoxPro("Error", "exclamation-triangle", "N\xE3o foi poss\xEDvel gravar o prazo em " + failCount + ' processo(s) pela lista. Para definir o primeiro prazo de um processo, abra o processo e use "Controle de Prazo".');
        }
        resetDialogBoxPro("dialogBoxPro");
        return;
      }
      submitNativeForRow(selectedRows[index], function() {
        runQueue(index + 1);
      });
    }
    runQueue(0);
  }
  function addControlePrazo(this_ = false) {
    var dateRef = moment().format("YYYY-MM-DD");
    var timeRef = "23:59";
    var dueSetDate = true;
    var tagName = false;
    var textTag = "";
    var textControle = "Adicionar";
    var form = $("#frmProcedimentoControlar");
    var href = SeiPro.sei.adapter.isNewSEI() ? $(divComandos + ' a[onclick*="andamento_marcador_cadastrar"]').attr("onclick") : $(divComandos + ' a[onclick*="andamento_marcador_gerenciar"]').attr("onclick");
    href = typeof href !== "undefined" ? href.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, "g")) : false;
    href = href && href !== null && href.length > 0 && href[0] != "" ? href[0] : false;
    if (this_) {
      var _this = $(this_);
      if (_this.closest(".kanban-item").length) {
        var id = _this.closest(".kanban-item").attr("data-eid");
        var _addEl = $("#P" + id + " td.prazoBoxDisplay [data-seipro-add-prazo]")[0];
        if (_addEl) addControlePrazo(_addEl);
        return false;
      }
      var _data = _this.data();
      var _parent = _this.closest("tr");
      _parent = typeof _parent === "undefined" ? _this.closest(".kanban-item") : _parent;
      var _processo = _parent.find('a[href*="procedimento_trabalhar"]');
      var _tag = _parent.find('a[href*="andamento_marcador_gerenciar"]').attr("onmouseover");
      var tag = typeof _tag !== "undefined" ? _tag.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, "g")) : false;
      tagName = tag && tag !== null && tag.length > 0 && tag[2] != "" ? tag[2] : false;
      textTag = tag && tag !== null && tag.length > 0 && tag[0] != "" ? tag[0] : false;
      var processo = _processo.text().trim();
      var linkParams = getParamsUrlPro(_processo.attr("href"));
      var id_procedimento = linkParams && typeof linkParams.id_procedimento !== "undefined" ? linkParams.id_procedimento : false;
      dateRef = typeof _data.timeSorter !== "undefined" ? moment(_data.timeSorter, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD") : dateRef;
      timeRef = typeof _data.timeSorter !== "undefined" ? moment(_data.timeSorter, "YYYY-MM-DD HH:mm").format("HH:mm") : timeRef;
      textControle = typeof _data.timeSorter !== "undefined" ? "Alterar" : textControle;
      dueSetDate = typeof _data.duesetdate !== "undefined" ? _data.duesetdate : dueSetDate;
      _this.closest("table").find('thead th a[onclick*="setSelectAllTr"]').data("index", 1).trigger("click");
      _parent.find('input[type="checkbox"]').trigger("click");
      textTag = typeof _data.timeSorter !== "undefined" && typeof textTag === "string" ? textTag.replace(moment(_data.timeSorter, "YYYY-MM-DD HH:mm").format("DD/MM/YYYY HH:mm"), "").replace("Ate ", "").trim() : textTag;
      textTag = typeof textTag === "string" && textTag != "" ? textTag.replace(/\\n/g, "") : "";
    }
    var nativeInfo = typeof parseControlePrazoNativo === "function" ? getControlePrazoNativeInfo(_parent) : false;
    var nativeHref = getControlePrazoNativeHref(_parent, id_procedimento, nativeInfo && nativeInfo.id_controle_prazo ? nativeInfo.id_controle_prazo : false, false);
    if (typeof parseControlePrazoNativo === "function") {
      openControlePrazoNativoDialog(this_, form, nativeHref || (nativeInfo ? nativeInfo.href : ""), nativeInfo, dateRef, nativeInfo && nativeInfo.diasRestantes !== null && typeof nativeInfo.diasRestantes !== "undefined" ? nativeInfo.diasRestantes : 1, dueSetDate, textControle, processo);
      return false;
    }
  }
  function configDatesSwitchChangePrazo(this_) {
    var _this = $(this_);
    var _parent = _this.closest(".ui-dialog");
    if (_this.is(":checked")) {
      _parent.find(".configDates_setdate").show();
      _parent.find(".configDates_duesetdate").show();
      _this.closest("tr").find(".iconSwitch").addClass("azulColor");
    } else {
      _parent.find(".configDates_setdate").hide();
      _parent.find(".configDates_duesetdate").hide();
      _this.closest("tr").find(".iconSwitch").removeClass("azulColor");
    }
  }
  function reconcileControlePrazoColspan() {
    $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").each(function() {
      var t = $(this);
      var bodyRow = t.find("tbody tr").not(".tableHeader").filter(function() {
        return $(this).find("td.prazoBoxDisplay").length > 0;
      }).first();
      var headRow = t.find("thead tr").not(".tablesorter-filter-row").first();
      if (bodyRow.length === 0 || headRow.length === 0) return;
      if (headRow.find("th.prazoBoxDisplay").length === 0) return;
      var bodyCols = bodyRow.find("td").length;
      var headCols = 0, mainTh = null, maxSpan = 0;
      headRow.find("th").each(function() {
        var c = parseInt($(this).attr("colspan") || "1", 10);
        headCols += c;
        if (c > maxSpan) {
          maxSpan = c;
          mainTh = $(this);
        }
      });
      if (mainTh && headCols !== bodyCols) {
        var adjusted = maxSpan - (headCols - bodyCols);
        if (adjusted >= 1) {
          mainTh.attr("colspan", adjusted);
        }
      }
    });
  }
  function scheduleControlePrazoColspanReconcile() {
    reconcileControlePrazoColspan();
    [200, 800, 2e3].forEach(function(ms) {
      setTimeout(reconcileControlePrazoColspan, ms);
    });
    if (!window.__seiProPrazoColspanBound) {
      window.__seiProPrazoColspanBound = true;
      $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").on("tablesorter-initialized sortEnd filterEnd", function() {
        setTimeout(reconcileControlePrazoColspan, 30);
      });
    }
  }
  function setControlePrazo(force = false) {
    var tblProcessos = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    var prazoColumnWidth = "5em";
    var thead = tblProcessos.find("thead");
    if (tblProcessos.find("tbody tr").not(".tableHeader").find("td.prazoBoxDisplay").length == 0 || tblProcessos.find("thead tr").find("th.prazoBoxDisplay").length < 2 || force == true) {
      if (thead.length == 0) {
        tblProcessos.each(function() {
          var headerRow = $(this).find("tbody tr").not(".tableHeader").first();
          if (headerRow.length > 0 && headerRow.find('a[href*="procedimento_trabalhar"]').length == 0) {
            var caption = $(this).children("caption").last();
            if (caption.length > 0) {
              caption.after("<thead></thead>");
            } else {
              $(this).prepend("<thead></thead>");
            }
            headerRow.prependTo($(this).find("thead"));
          }
        });
        thead = tblProcessos.find("thead");
      }
      tblProcessos.find(".prazoBoxDisplay").remove();
      tblProcessos.find("tbody tr").not(".tableHeader").append('<td class="prazoBoxDisplay" style="text-align: center;"></td>');
      if (thead.length > 0) {
        thead.find("tr").append('<th class="tituloControle tablesorter-header prazoBoxDisplay ' + (SeiPro.sei.adapter.isNewSEI() ? "infraTh" : "") + '" style="width: ' + prazoColumnWidth + ";min-width: " + prazoColumnWidth + ";max-width: " + prazoColumnWidth + ';"> Prazos</th>');
      } else {
        $("#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first").find(".prazoBoxDisplay").remove();
        $("#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first").not(".tableHeader").append('<th class="tituloControle tablesorter-header prazoBoxDisplay ' + (SeiPro.sei.adapter.isNewSEI() ? "infraTh" : "") + '" style="width: ' + prazoColumnWidth + ";min-width: " + prazoColumnWidth + ";max-width: " + prazoColumnWidth + ';"> Prazos</th>');
      }
    }
    scheduleControlePrazoColspanReconcile();
    tblProcessos.find("tbody tr").each(function() {
      var _checkbox = $(this).find('input[type="checkbox"]');
      var _processo = $(this).find('a[href*="procedimento_trabalhar"]');
      var nativeInfo = typeof parseControlePrazoNativo === "function" ? getControlePrazoNativeInfo(this) : false;
      $(this).find('a[href*="controle_prazo_definir"], img[src*="controle_prazo"]').filter(function() {
        return $(this).closest("td.prazoBoxDisplay").length === 0;
      }).css("display", "none");
      if (nativeInfo) {
        var nativeDate = nativeInfo.dateFinished || nativeInfo.dateDue || nativeInfo.dateSort;
        var htmlDateNative = renderControlePrazoNativePreview(nativeInfo, nativeDate, nativeInfo.href);
        $(this).removeClass("infraTrAtrasada").removeClass("infraTrAlerta");
        $(this).find("td.prazoBoxDisplay").html(htmlDateNative).attr("data-time-sorter", nativeInfo.dateSort || nativeDate).attr("data-id-controle-prazo", nativeInfo.id_controle_prazo || "");
        if (!nativeInfo.concluido) {
          if (nativeInfo.vencido) {
            $(this).addClass("infraTrAtrasada");
          } else if (nativeDate && moment(nativeDate, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
            $(this).addClass("infraTrAlerta");
          }
        }
        return;
      }
      var _tag = $(this).find('a[href*="andamento_marcador_gerenciar"]').attr("onmouseover");
      var _prazoTag = parsePrazoTag(_tag);
      var dateTo = _prazoTag.dateTo;
      var dateTag = _prazoTag.dateTag ? moment(_prazoTag.dateTag, "DD/MM/YYYY HH:mm") : false;
      var linkParams = getParamsUrlPro(_processo.attr("href"));
      var id_procedimento = linkParams && typeof linkParams.id_procedimento !== "undefined" ? linkParams.id_procedimento : false;
      var processo = _processo.text();
      if (dateTag && dateTag.isValid()) {
        var config = {
          date: dateTag.format("YYYY-MM-DD HH:mm:ss"),
          dateDue: dateTo ? dateTag.format("YYYY-MM-DD HH:mm:ss") : void 0,
          dateMaxProgress: 30,
          countdays: true,
          workday: false,
          duesetdate: dateTo,
          displayformat: "DD/MM/YYYY HH:mm",
          action: "addControlePrazo(this)"
        };
        var htmlDatePreview = getDatesPreview(config).replace('onclick="addControlePrazo(this)"', 'data-seipro-add-prazo="1"');
        $(this).find("td.prazoBoxDisplay").html(htmlDatePreview);
        if ($(htmlDatePreview).hasClass("tagTableText_date_atrasado")) {
          $(this).addClass("infraTrAtrasada");
        } else if (dateTag.format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
          $(this).addClass("infraTrAlerta");
        }
      } else if (!_checkbox.is(":disabled")) {
        var htmlDateAdd = '<a class="addControlePrazo" data-seipro-add-prazo="1">   <i class="fas fa-clock azulColor"></i>   <span style="font-size: 9pt;color: #666;font-style: italic;">Adicionar prazo</span></a>';
        $(this).find("td.prazoBoxDisplay").html(htmlDateAdd);
      }
    });
  }
  function initControlePrazo(force = false, TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    if (typeof window !== "undefined" && !window.__seiProAddPrazoDelegated) {
      window.__seiProAddPrazoDelegated = true;
      document.addEventListener("click", function(ev) {
        if (!ev.target || !ev.target.closest) return;
        if (ev.target.closest("[data-seipro-add-prazo-all]")) {
          ev.preventDefault();
          addControlePrazo();
          return;
        }
        var row = ev.target.closest("[data-seipro-add-prazo]");
        if (row) {
          ev.preventDefault();
          addControlePrazo(row);
        }
      });
    }
    if (typeof checkConfigValue !== "undefined" && typeof moment == "function") {
      if (checkConfigValue("gerenciarprazos")) {
        setControlePrazo(force);
      }
    } else {
      setTimeout(function() {
        initControlePrazo(force, TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initControlePrazo");
      }, 500);
    }
  }
  function updateTablePrazoProcesso() {
    var tblProcessos = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    if (tblProcessos.find("tbody tr").not(".tableHeader").find("td.prazosBoxDisplay").length == 0) {
      tblProcessos.find("tbody tr").not(".tableHeader").append('<td class="prazosBoxDisplay" style="text-align: right;"></td>');
      if (tblProcessos.find("thead").length > 0) {
        tblProcessos.find("thead tr").append('<th class="tituloControle tablesorter-header prazosBoxDisplay">Prazos</th>');
      } else {
        $("#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first").find(".prazosBoxDisplay").remove();
        $("#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first").not(".tableHeader").append('<th class="tituloControle tablesorter-header prazosBoxDisplay">Prazos</th>');
      }
      if ($(".tabelaControle").find("tr").hasClass("tableHeader")) {
        $(".tabelaControle").find("tr.tableHeader").each(function() {
          var td = $(this).find("th.tituloControle").eq(1);
          var colspan = parseInt(td.attr("colspan"));
          if (colspan == 6) {
            td.attr("colspan", colspan + 1);
          }
        });
      }
      if ($(".tabelaControle").hasClass("tablesorter")) {
        $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").trigger("destroy");
        setTableSorterHome();
      }
    }
    tblProcessos.find("tbody tr").each(function() {
      var tag = $(this).find('a[href*="acao=andamento_marcador_gerenciar"]');
      if (tag.length > 0) {
        var linkTag = tag.attr("href");
        var textTag = typeof tag.attr("onmouseover") !== "undefined" ? extractTooltip(tag.attr("onmouseover")) : "";
        var _prazoTooltip = parsePrazoTooltip(textTag);
        var datePrazoDue = _prazoTooltip.datePrazoDue;
        var datePrazo = _prazoTooltip.datePrazo;
        var htmlDatePrazo = datePrazo ? getDatesPreview({ date: datePrazo }) : false;
        htmlDatePrazo = datePrazoDue ? getDatesPreview({ date: datePrazoDue }) : htmlDatePrazo;
        htmlDatePrazo = htmlDatePrazo ? $("<div>" + htmlDatePrazo + "</div>").find(".dateboxDisplay").html() : htmlDatePrazo;
        var dateSorter = htmlDatePrazo ? datePrazo || datePrazoDue : "";
        var htmlPrazo = htmlDatePrazo ? '<span class="info_dates_monitorado">    <span class="dateboxDisplay">        ' + htmlDatePrazo + "    </span></span>" : "";
        $(this).find("td.prazosBoxDisplay").html(htmlPrazo).attr("data-time-sorter", dateSorter);
        console.log({ url: linkTag, text: textTag, data: datePrazo, datadue: datePrazoDue, html: htmlDatePrazo });
      }
    });
  }

  // src/features/controlar-prazos/legacy-api.js
  [domain_exports, io_exports, view_exports].forEach(function(mod) {
    Object.keys(mod).forEach(function(name) {
      if (typeof mod[name] === "function") aliasGlobal(name, mod[name]);
    });
  });
})();
