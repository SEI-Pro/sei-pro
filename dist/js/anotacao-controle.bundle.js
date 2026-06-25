(() => {
  // src/core/texto.js
  function normalizeMojibakeUtf8(value) {
    value = typeof value === "string" ? value : "";
    if (!value) return value;
    if (!/(?:[\u00C2\u00C3][\u0080-\u00BF]|\u00E2[\u0080-\u00BF]{2})/.test(value)) {
      return value;
    }
    try {
      return decodeURIComponent(escape(value));
    } catch (err) {
      if (typeof TextDecoder !== "undefined" && typeof Uint8Array !== "undefined") {
        try {
          return new TextDecoder("utf-8").decode(Uint8Array.from(value, function(ch) {
            return ch.charCodeAt(0);
          }));
        } catch (err2) {
        }
      }
    }
    return value;
  }
  var COMBINING_MARKS_RE = new RegExp("[\\u0300-\\u036f]", "g");

  // src/core/sticknote.js
  function parseSticknoteHomeLabel(label) {
    label = normalizeMojibakeUtf8(label);
    label = typeof label === "string" ? label : "";
    if (!label) {
      return false;
    }
    var match = label.match(/^Anota(?:ç|c)(?:ã|a)o\s*\/\s*([\s\S]*?)\s*\/\s*(.*?)\s+em\s+\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}$/i);
    if (!match) {
      return false;
    }
    return {
      text: match[1].trim(),
      user: match[2].trim()
    };
  }
  function normalizeSticknoteHomeText(value) {
    value = typeof value === "string" ? value : "";
    return value.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\\r/g, "\n").replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  }
  function parseSticknoteChecklistLine(line) {
    line = typeof line === "string" ? line : "";
    var hasUnchecked = line.indexOf("[ ]") !== -1;
    var checked = line.indexOf("[X]") !== -1;
    var isItem = hasUnchecked || checked;
    var text = line;
    if (checked) {
      text = line.replace("[X]", "").trim();
    } else if (hasUnchecked) {
      text = line.replace("[ ]", "").trim();
    }
    return { isItem, checked, text };
  }

  // src/features/anotacao-controle/view.js
  function getParamsUrlPro(u) {
    return window.getParamsUrlPro(u);
  }
  function normalizeMojibakeUtf82(v) {
    return window.normalizeMojibakeUtf8 ? window.normalizeMojibakeUtf8(v) : v;
  }
  function setOptionsPro(k, v) {
    return window.setOptionsPro(k, v);
  }
  function replaceTextToProcessoSEI(t) {
    return window.replaceTextToProcessoSEI ? window.replaceTextToProcessoSEI(t) : t;
  }
  function verifyConfigValue(n) {
    return typeof window.verifyConfigValue !== "undefined" ? window.verifyConfigValue(n) : false;
  }
  function checkConfigValue(n) {
    return typeof window.checkConfigValue !== "undefined" ? window.checkConfigValue(n) : false;
  }
  function resolveSticknoteHomeParsed(link) {
    var $ = window.jQuery;
    var _this = $(link);
    var ariaLabel = _this.attr("aria-label");
    if (ariaLabel) {
      var parsed = parseSticknoteHomeLabel(ariaLabel);
      if (parsed) {
        return parsed;
      }
    }
    var tooltip = _this.attr("onmouseover");
    tooltip = typeof tooltip !== "undefined" ? tooltip.split("'") : false;
    if (tooltip) {
      return { text: tooltip[1] || "", user: tooltip[3] || "" };
    }
    return false;
  }
  function replaceSticknoteHome() {
    var $ = window.jQuery;
    var arraySticknoteHome = [];
    $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").find('a[href*="acao=anotacao_registrar"]').each(function() {
      var _this = $(this);
      var parsed = resolveSticknoteHomeParsed(_this);
      if (parsed && parsed.text) {
        var id_protocolo = _this.attr("href");
        id_protocolo = typeof id_protocolo !== "undefined" ? getParamsUrlPro(id_protocolo).id_protocolo : false;
        var texttip = normalizeSticknoteHomeText(parsed.text);
        var usertip = normalizeMojibakeUtf82(parsed.user || "");
        var _return = $.map(texttip.split("\n"), function(v) {
          if (v === "") {
            return v;
          }
          var item = parseSticknoteChecklistLine(v);
          if (!item.isItem) {
            return v;
          }
          var icon = item.checked ? '<i class=\\"fas fa-check-square\\"></i> ' : '<i class=\\"far fa-square\\"></i> ';
          var style = item.checked ? ' style=\\"text-decoration: line-through;\\"' : "";
          return "<div" + style + ">" + icon + item.text + "</div>";
        }).join("");
        _this.attr("onmouseover", "return infraTooltipMostrar(" + JSON.stringify(_return) + "," + JSON.stringify(usertip) + ");").attr("data-sticknote-text", texttip).attr("data-sticknote-user", usertip);
        if (id_protocolo) {
          arraySticknoteHome.push({ id_protocolo, usertip, texttip });
        }
      }
    });
    setOptionsPro("arraySticknoteHome", arraySticknoteHome);
  }
  function sticknoteChecklistClass(item) {
    if (!item.isItem) {
      return "";
    }
    return item.checked ? ' class="stickNoteCheck stickNoteChecked"' : ' class="stickNoteCheck"';
  }
  function formatDadosAnotacaoHome(value) {
    var $ = window.jQuery;
    value = normalizeMojibakeUtf82(value);
    value = normalizeSticknoteHomeText(value);
    if (value === "") {
      return "";
    }
    if (value.indexOf("\n") === -1) {
      var single = parseSticknoteChecklistLine(value);
      return "<div" + sticknoteChecklistClass(single) + ">" + replaceTextToProcessoSEI(single.text) + "</div>";
    }
    var result = "";
    $.each(value.split("\n"), function(i, v) {
      if (v != "") {
        var item = parseSticknoteChecklistLine(v);
        result += "<div" + sticknoteChecklistClass(item) + ">" + replaceTextToProcessoSEI(item.text) + "</div>";
      } else if (i != 0 || i != value.length - 1) {
        result += "<div><br></div>";
      }
    });
    return result;
  }
  function getSticknoteHomeLinks() {
    var $ = window.jQuery;
    return $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").find('a[href*="acao=anotacao_registrar"]');
  }
  function getSticknoteHomeText(link) {
    var $ = window.jQuery;
    var _this = $(link);
    var texttip = _this.attr("data-sticknote-text");
    if (typeof texttip !== "undefined") {
      return normalizeSticknoteHomeText(normalizeMojibakeUtf82(texttip));
    }
    var parsed = resolveSticknoteHomeParsed(_this);
    if (parsed && parsed.text) {
      return normalizeSticknoteHomeText(normalizeMojibakeUtf82(parsed.text));
    }
    return "";
  }
  function getSticknoteHomePriority(link) {
    var $ = window.jQuery;
    var _this = $(link);
    var priority = _this.attr("data-sticknote-priority");
    if (typeof priority !== "undefined") {
      return priority === "true";
    }
    return false;
  }
  function loadSticknoteHomePriority(link) {
    var $ = window.jQuery;
    var _this = $(link);
    var href = _this.attr("href");
    if (!href || _this.attr("data-sticknote-priority-loading") === "true") {
      return;
    }
    _this.attr("data-sticknote-priority-loading", "true");
    $.ajax({ url: href }).done(function(html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var priority = doc.querySelector("#chkSinPrioridade");
      priority = priority ? priority.checked : false;
      _this.attr("data-sticknote-priority", priority ? "true" : "false");
      scheduleRenderSticknoteHomeInline();
    }).always(function() {
      _this.removeAttr("data-sticknote-priority-loading");
    });
  }
  var _sticknoteRenderTimer = null;
  function scheduleRenderSticknoteHomeInline() {
    if (_sticknoteRenderTimer) {
      clearTimeout(_sticknoteRenderTimer);
    }
    _sticknoteRenderTimer = setTimeout(function() {
      _sticknoteRenderTimer = null;
      renderSticknoteHomeInline();
    }, 100);
  }
  function renderSticknoteHomeInline() {
    var $ = window.jQuery;
    var tableProc = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    tableProc.find(".sticknoteHomeDetailedNoteCell .sticknoteHomeInline").each(function() {
      $(this).replaceWith($(this).html());
    });
    tableProc.find(".sticknoteHomeInline").remove();
    tableProc.removeClass("sticknoteHomeLayout");
    tableProc.find(".sticknoteHomeInsertedCell").remove();
    tableProc.find(".sticknoteHomeInsertedHead").remove();
    tableProc.find(".sticknoteHomeCheckCell").removeClass("sticknoteHomeCheckCell");
    tableProc.find(".sticknoteHomeCheckHead").removeClass("sticknoteHomeCheckHead");
    tableProc.find(".sticknoteHomeIconCell").removeClass("sticknoteHomeIconCell");
    tableProc.find(".sticknoteHomeDetailedNoteCell").removeClass("sticknoteHomeDetailedNoteCell sticknoteHomeNoteCell");
    tableProc.find(".sticknoteHomeProcessCell").removeClass("sticknoteHomeProcessCell");
    tableProc.find('td[data-sticknote-home-icon="true"]').removeAttr("data-sticknote-home-icon").css({ "width": "", "min-width": "", "max-width": "" });
    tableProc.find("td[data-sticknote-orig-width]").each(function() {
      var orig = $(this).attr("data-sticknote-orig-width");
      if (orig) $(this).attr("width", orig);
      else $(this).removeAttr("width");
      $(this).removeAttr("data-sticknote-orig-width");
    });
    tableProc.find("thead tr th[data-sticknote-orig-colspan], tr.tableHeader th[data-sticknote-orig-colspan]").each(function() {
      var orig = $(this).attr("data-sticknote-orig-colspan");
      if (orig) $(this).attr("colspan", orig);
      else $(this).removeAttr("colspan");
      $(this).removeAttr("data-sticknote-orig-colspan");
    });
    if (!verifyConfigValue("mostraranotacaocontrole")) {
      return;
    }
    tableProc.addClass("sticknoteHomeLayout");
    tableProc.find("tbody tr").not(".tableHeader, .tagintable, .infraCaption, .tablesorter-filter-row").has('a[href*="acao=procedimento_trabalhar"]').each(function() {
      $(this).find("td").eq(0).addClass("sticknoteHomeCheckCell");
    });
    tableProc.find('a[href*="acao=procedimento_trabalhar"]').each(function() {
      var processLink = $(this);
      var table = processLink.closest("table");
      var processCell = processLink.closest("td");
      if (!processCell.length) return;
      processCell.addClass("sticknoteHomeProcessCell");
      if (!table.is("#tblProcessosDetalhado")) {
        $('<td class="sticknoteHomeInsertedCell sticknoteHomeNoteCell"></td>').insertBefore(processCell);
      }
    });
    tableProc.each(function() {
      var $table = $(this);
      if ($table.is("#tblProcessosDetalhado")) return;
      var processRow = $table.find("tbody tr").not(".tableHeader, .infraCaption, .tablesorter-filter-row").has('a[href*="acao=procedimento_trabalhar"]').first();
      var processCellIdx = -1;
      if (processRow.length) {
        processCellIdx = processRow.find("td").index(processRow.find('a[href*="acao=procedimento_trabalhar"]').first().closest("td"));
      }
      if (processCellIdx <= 0) return;
      var headRow = $table.find("thead tr").last();
      if (!headRow.length) {
        headRow = $table.find("tbody tr").not(".tableHeader, .infraCaption, .tablesorter-filter-row").has("th").first();
      }
      var processHead = headRow.find("th").eq(processCellIdx);
      if (!processHead.length) {
        processHead = headRow.find("th").last();
      }
      if (processHead.length) {
        $('<th class="tituloControle infraTh sticknoteHomeInsertedHead"></th>').insertBefore(processHead);
      }
      headRow.find("th").eq(0).addClass("sticknoteHomeCheckHead");
    });
    var detailedNoteColIdx = -1;
    var detailedTable = $("#tblProcessosDetalhado");
    if (detailedTable.length) {
      var detailedHeadRow = detailedTable.find("thead tr").last();
      if (!detailedHeadRow.length) {
        detailedHeadRow = detailedTable.find("tbody tr").has("th").first();
      }
      detailedHeadRow.find("th").each(function(i) {
        var label = $(this).text().replace(/\s+/g, " ").trim().toLowerCase();
        if (label.indexOf("anota\xE7\xE3o") !== -1 || label.indexOf("anotacao") !== -1) {
          detailedNoteColIdx = i;
          return false;
        }
      });
      if (detailedNoteColIdx >= 0) {
        detailedTable.find("tbody tr").not(".tableHeader, .infraCaption, .tablesorter-filter-row").has("td").each(function() {
          var noteCell = $(this).find("td").eq(detailedNoteColIdx);
          if (!noteCell.length) return;
          var noteText = noteCell.text().replace(/\u00a0/g, " ").trim();
          if (noteText === "") return;
          noteCell.addClass("sticknoteHomeDetailedNoteCell sticknoteHomeNoteCell");
          if (!noteCell.find(".sticknoteHomeInline").length) {
            noteCell.wrapInner('<div class="sticknoteHomeInline"></div>');
          }
        });
      }
    }
    getSticknoteHomeLinks().each(function() {
      var _this = $(this);
      var texttip = getSticknoteHomeText(_this);
      var processLink = _this.closest("tr").find('a[href*="acao=procedimento_trabalhar"]').eq(0);
      if (!processLink.length) {
        return;
      }
      if (typeof texttip === "undefined" || texttip.trim() == "") {
        return;
      }
      var table = processLink.closest("table");
      if (table.is("#tblProcessosDetalhado")) {
        return;
      }
      var iconCell = _this.closest("td");
      var noteCell = false;
      iconCell.addClass("sticknoteHomeIconCell").attr("data-sticknote-home-icon", "true").css({ "width": "", "min-width": "", "max-width": "" });
      noteCell = processLink.closest("td").prev(".sticknoteHomeInsertedCell");
      if (!noteCell.length) {
        noteCell = $('<td class="sticknoteHomeInsertedCell sticknoteHomeNoteCell"></td>').insertBefore(processLink.closest("td"));
      }
      var priority = getSticknoteHomePriority(_this);
      noteCell.find(".sticknoteHomeInline").remove();
      noteCell.prepend('<div class="sticknoteHomeInline ' + (priority ? "priority" : "") + '">' + formatDadosAnotacaoHome(texttip) + "</div>");
      if (typeof _this.attr("data-sticknote-priority") === "undefined") {
        loadSticknoteHomePriority(_this);
      }
    });
    tableProc.each(function() {
      var $table = $(this);
      if ($table.is("#tblProcessosDetalhado")) return;
      var iconColIdx = -1;
      var iconCellByClass = $table.find(".sticknoteHomeIconCell").first();
      if (iconCellByClass.length) {
        iconColIdx = iconCellByClass.closest("tr").find("td").index(iconCellByClass);
      } else {
        $table.find("tbody tr").each(function() {
          $(this).find("td").each(function(i) {
            if ($(this).attr("width") === "20%") {
              iconColIdx = i;
              return false;
            }
          });
          if (iconColIdx >= 0) return false;
        });
      }
      if (iconColIdx < 0) return;
      $table.find("tbody tr").each(function() {
        var cell = $(this).find("td").eq(iconColIdx);
        if (!cell.length) return;
        if (!cell.attr("data-sticknote-orig-width")) {
          cell.attr("data-sticknote-orig-width", cell.attr("width") || "");
        }
        cell.attr("width", "28");
      });
      $table.find("thead tr th[colspan], tbody tr.tableHeader th[colspan]").each(function() {
        var th = $(this);
        var colspan = parseInt(th.attr("colspan"), 10);
        if (!th.attr("data-sticknote-orig-colspan")) {
          th.attr("data-sticknote-orig-colspan", th.attr("colspan") || "");
        }
        if (!Number.isNaN(colspan)) {
          th.attr("colspan", colspan + 1);
        }
      });
    });
  }
  function initReplaceSticknoteHome(TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    if (typeof window.checkConfigValue !== "undefined") {
      if (checkConfigValue("mostraranotacaocontrole")) {
        replaceSticknoteHome();
        renderSticknoteHomeInline();
      }
    } else {
      setTimeout(function() {
        initReplaceSticknoteHome(TimeOut - 100);
        if (verifyConfigValue("debugpage")) console.log("Reload initReplaceSticknoteHome");
      }, 500);
    }
  }

  // src/features/anotacao-controle/index.js
  (function(win) {
    "use strict";
    win.SeiPro = win.SeiPro || {};
    win.SeiPro.features = win.SeiPro.features || {};
    win.SeiPro.features.anotacaoControle = {
      init: initReplaceSticknoteHome,
      render: renderSticknoteHomeInline,
      replace: replaceSticknoteHome
    };
  })(window);
})();
