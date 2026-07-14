(() => {
  // src/dom/index.js
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }
  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }
  function el(tag, props, children) {
    const node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function(key) {
        const value = props[key];
        if (value == null) return;
        if (key === "className") {
          node.className = value;
          return;
        }
        if (key === "class") {
          node.className = value;
          return;
        }
        if (key === "textContent" || key === "text") {
          node.textContent = value;
          return;
        }
        if (key === "innerHTML" || key === "html") {
          node.innerHTML = value;
          return;
        }
        if (key === "style" && typeof value === "object") {
          Object.keys(value).forEach(function(p) {
            node.style[p] = value[p];
          });
          return;
        }
        if (key === "dataset" && typeof value === "object") {
          Object.keys(value).forEach(function(d) {
            node.dataset[d] = value[d];
          });
          return;
        }
        if (key === "on" && typeof value === "object") {
          Object.keys(value).forEach(function(t) {
            node.addEventListener(t, value[t]);
          });
          return;
        }
        node.setAttribute(key, value);
      });
    }
    appendChildren(node, children);
    return node;
  }
  function appendChildren(node, children) {
    if (children == null) return node;
    const list = Array.isArray(children) ? children : [children];
    list.forEach(function(c) {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }
  function remove(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

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
    var match = label.match(/^Anota(?:ç|c)(?:ã|a)o\s*\/\s*([\s\S]*?)\s+\/\s+(.*?)\s+em\s+\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}$/i);
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

  // src/features/anotacao-controle/domain.js
  function buildSticknoteHomeRecord(id_protocolo, texttip, usertip) {
    if (!id_protocolo) {
      return false;
    }
    return {
      id_protocolo,
      usertip: typeof usertip === "string" ? usertip : "",
      texttip: normalizeSticknoteHomeText(texttip)
    };
  }
  function sticknoteChecklistClass(item) {
    if (!item.isItem) {
      return "";
    }
    return item.checked ? ' class="stickNoteCheck stickNoteChecked"' : ' class="stickNoteCheck"';
  }
  function buildChecklistTooltipHtml(texttip) {
    return texttip.split("\n").map(function(v) {
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
  }

  // src/features/anotacao-controle/io.js
  function fetchSticknotePriority(href) {
    return fetch(href, { credentials: "same-origin" }).then(function(response) {
      return response.text();
    }).then(function(html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var checkbox = doc.querySelector("#chkSinPrioridade");
      return checkbox ? checkbox.checked : false;
    });
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
  var PROCESS_TABLES_SEL = "#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado";
  var NON_DATA_ROW_SEL = ".tableHeader, .tagintable, .infraCaption, .tablesorter-filter-row";
  function processTables() {
    return qsa(PROCESS_TABLES_SEL);
  }
  function findIn(tables, selector) {
    return tables.reduce(function(acc, table) {
      return acc.concat(qsa(selector, table));
    }, []);
  }
  function unwrap(node) {
    var parent = node.parentNode;
    if (!parent) return;
    while (node.firstChild) parent.insertBefore(node.firstChild, node);
    parent.removeChild(node);
  }
  function wrapInner(node, className) {
    var wrapper = document.createElement("div");
    wrapper.className = className;
    while (node.firstChild) wrapper.appendChild(node.firstChild);
    node.appendChild(wrapper);
  }
  function clampToTwoLines(card) {
    if (!card || !card.parentNode) return;
    var cs = window.getComputedStyle(card);
    var lineHeight = parseFloat(cs.lineHeight);
    if (!lineHeight || isNaN(lineHeight)) lineHeight = (parseFloat(cs.fontSize) || 12) * 1.35;
    var twoLines = Math.round(lineHeight * 2 + (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0));
    if (card.scrollHeight <= twoLines + 1) return;
    var collapsed = true;
    var icon = el("i", { className: "fas fa-chevron-down" });
    function apply() {
      if (collapsed) {
        card.style.maxHeight = twoLines + "px";
        card.style.overflow = "hidden";
        icon.className = "fas fa-chevron-down";
        toggle.title = "Ver anota\xE7\xE3o completa";
      } else {
        card.style.maxHeight = "";
        card.style.overflow = "";
        icon.className = "fas fa-chevron-up";
        toggle.title = "Recolher anota\xE7\xE3o";
      }
    }
    var toggle = el("span", {
      className: "seipro-sticknote-toggle",
      title: "Ver anota\xE7\xE3o completa",
      on: { click: function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        collapsed = !collapsed;
        apply();
      } }
    }, icon);
    apply();
    card.appendChild(toggle);
  }
  function resolveSticknoteHomeParsed(link) {
    var ariaLabel = link.getAttribute("aria-label");
    if (ariaLabel) {
      var parsed = parseSticknoteHomeLabel(ariaLabel);
      if (parsed) {
        return { text: normalizeMojibakeUtf82(parsed.text), user: normalizeMojibakeUtf82(parsed.user) };
      }
    }
    var tooltip = link.getAttribute("onmouseover");
    tooltip = tooltip != null ? tooltip.split("'") : false;
    if (tooltip) {
      return { text: normalizeMojibakeUtf82(tooltip[1] || ""), user: normalizeMojibakeUtf82(tooltip[3] || "") };
    }
    return false;
  }
  function replaceSticknoteHome() {
    var arraySticknoteHome = [];
    findIn(processTables(), 'a[href*="acao=anotacao_registrar"]').forEach(function(link) {
      var parsed = resolveSticknoteHomeParsed(link);
      if (parsed && parsed.text) {
        var href = link.getAttribute("href");
        var id_protocolo = href != null ? getParamsUrlPro(href).id_protocolo : false;
        var texttip = normalizeSticknoteHomeText(parsed.text);
        var usertip = parsed.user || "";
        var _return = buildChecklistTooltipHtml(texttip);
        link.setAttribute("onmouseover", "return infraTooltipMostrar(" + JSON.stringify(_return) + "," + JSON.stringify(usertip) + ");");
        link.setAttribute("data-sticknote-text", texttip);
        link.setAttribute("data-sticknote-user", usertip);
        if (id_protocolo) {
          arraySticknoteHome.push(buildSticknoteHomeRecord(id_protocolo, texttip, usertip));
        }
      }
    });
    setOptionsPro("arraySticknoteHome", arraySticknoteHome);
  }
  function formatDadosAnotacaoHome(value) {
    value = normalizeSticknoteHomeText(value);
    if (value === "") {
      return "";
    }
    if (value.indexOf("\n") === -1) {
      var single = parseSticknoteChecklistLine(value);
      return "<div" + sticknoteChecklistClass(single) + ">" + replaceTextToProcessoSEI(single.text) + "</div>";
    }
    var result = "";
    value.split("\n").forEach(function(v, i) {
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
    return findIn(processTables(), 'a[href*="acao=anotacao_registrar"]');
  }
  function getSticknoteHomeText(link) {
    var texttip = link.getAttribute("data-sticknote-text");
    if (texttip != null) {
      return normalizeSticknoteHomeText(texttip);
    }
    var parsed = resolveSticknoteHomeParsed(link);
    if (parsed && parsed.text) {
      return normalizeSticknoteHomeText(parsed.text);
    }
    return "";
  }
  function getSticknoteHomePriority(link) {
    var priority = link.getAttribute("data-sticknote-priority");
    if (priority != null) {
      return priority === "true";
    }
    return false;
  }
  function loadSticknoteHomePriority(link) {
    var href = link.getAttribute("href");
    if (!href || link.getAttribute("data-sticknote-priority-loading") === "true") {
      return;
    }
    link.setAttribute("data-sticknote-priority-loading", "true");
    fetchSticknotePriority(href).then(function(priority) {
      link.setAttribute("data-sticknote-priority", priority ? "true" : "false");
      scheduleRenderSticknoteHomeInline();
    }).catch(function() {
    }).finally(function() {
      link.removeAttribute("data-sticknote-priority-loading");
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
    var tableProc = processTables();
    findIn(tableProc, ".seipro-sticknote-toggle").forEach(remove);
    findIn(tableProc, ".seipro-sticknote-detailed-note-cell .seipro-sticknote-card").forEach(unwrap);
    findIn(tableProc, ".seipro-sticknote-card").forEach(remove);
    tableProc.forEach(function(t) {
      t.classList.remove("seipro-sticknote-layout");
    });
    findIn(tableProc, ".seipro-sticknote-inserted-cell").forEach(remove);
    findIn(tableProc, ".seipro-sticknote-inserted-head").forEach(remove);
    findIn(tableProc, ".seipro-sticknote-check-cell").forEach(function(e) {
      e.classList.remove("seipro-sticknote-check-cell");
    });
    findIn(tableProc, ".seipro-sticknote-check-head").forEach(function(e) {
      e.classList.remove("seipro-sticknote-check-head");
    });
    findIn(tableProc, ".seipro-sticknote-icon-cell").forEach(function(e) {
      e.classList.remove("seipro-sticknote-icon-cell");
    });
    findIn(tableProc, ".seipro-sticknote-detailed-note-cell").forEach(function(e) {
      e.classList.remove("seipro-sticknote-detailed-note-cell", "seipro-sticknote-note-cell");
    });
    findIn(tableProc, ".seipro-sticknote-process-cell").forEach(function(e) {
      e.classList.remove("seipro-sticknote-process-cell");
    });
    findIn(tableProc, 'td[data-sticknote-home-icon="true"]').forEach(function(td) {
      td.removeAttribute("data-sticknote-home-icon");
      td.style.width = "";
      td.style.minWidth = "";
      td.style.maxWidth = "";
    });
    findIn(tableProc, "td[data-sticknote-orig-width]").forEach(function(td) {
      var orig = td.getAttribute("data-sticknote-orig-width");
      if (orig) td.setAttribute("width", orig);
      else td.removeAttribute("width");
      td.removeAttribute("data-sticknote-orig-width");
    });
    findIn(tableProc, "thead tr th[data-sticknote-orig-colspan], tr.tableHeader th[data-sticknote-orig-colspan]").forEach(function(th) {
      var orig = th.getAttribute("data-sticknote-orig-colspan");
      if (orig) th.setAttribute("colspan", orig);
      else th.removeAttribute("colspan");
      th.removeAttribute("data-sticknote-orig-colspan");
    });
    if (!verifyConfigValue("mostraranotacaocontrole")) {
      return;
    }
    tableProc.forEach(function(t) {
      t.classList.add("seipro-sticknote-layout");
    });
    tableProc.forEach(function(table) {
      qsa("tbody tr", table).filter(function(tr) {
        return !tr.matches(NON_DATA_ROW_SEL);
      }).filter(function(tr) {
        return qs('a[href*="acao=procedimento_trabalhar"]', tr);
      }).forEach(function(tr) {
        var td = qsa("td", tr)[0];
        if (td) td.classList.add("seipro-sticknote-check-cell");
      });
    });
    findIn(tableProc, 'a[href*="acao=procedimento_trabalhar"]').forEach(function(processLink) {
      var table = processLink.closest("table");
      var processCell = processLink.closest("td");
      if (!processCell) return;
      processCell.classList.add("seipro-sticknote-process-cell");
      if (!(table && table.matches("#tblProcessosDetalhado"))) {
        var noteTd = el("td", { className: "seipro-sticknote-inserted-cell seipro-sticknote-note-cell" });
        processCell.parentNode.insertBefore(noteTd, processCell);
      }
    });
    tableProc.forEach(function(table) {
      if (table.matches("#tblProcessosDetalhado")) return;
      var processRow = qsa("tbody tr", table).filter(function(tr) {
        return !tr.matches(".tableHeader, .infraCaption, .tablesorter-filter-row");
      }).filter(function(tr) {
        return qs('a[href*="acao=procedimento_trabalhar"]', tr);
      })[0];
      var processCellIdx = -1;
      if (processRow) {
        var firstProcA = qs('a[href*="acao=procedimento_trabalhar"]', processRow);
        var pc = firstProcA ? firstProcA.closest("td") : null;
        processCellIdx = pc ? qsa("td", processRow).indexOf(pc) : -1;
      }
      if (processCellIdx <= 0) return;
      var theadRows = qsa("thead tr", table);
      var headRow = theadRows.length ? theadRows[theadRows.length - 1] : null;
      if (!headRow) {
        headRow = qsa("tbody tr", table).filter(function(tr) {
          return !tr.matches(".tableHeader, .infraCaption, .tablesorter-filter-row");
        }).filter(function(tr) {
          return qs("th", tr);
        })[0] || null;
      }
      if (!headRow) return;
      var ths = qsa("th", headRow);
      var processHead = ths[processCellIdx] || ths[ths.length - 1];
      if (processHead) {
        var th = el("th", { className: "tituloControle infraTh seipro-sticknote-inserted-head" });
        processHead.parentNode.insertBefore(th, processHead);
      }
      var firstTh = qsa("th", headRow)[0];
      if (firstTh) firstTh.classList.add("seipro-sticknote-check-head");
    });
    var detailedNoteColIdx = -1;
    var detailedTable = qs("#tblProcessosDetalhado");
    if (detailedTable) {
      var dHeadRows = qsa("thead tr", detailedTable);
      var detailedHeadRow = dHeadRows.length ? dHeadRows[dHeadRows.length - 1] : null;
      if (!detailedHeadRow) {
        detailedHeadRow = qsa("tbody tr", detailedTable).filter(function(tr) {
          return qs("th", tr);
        })[0] || null;
      }
      if (detailedHeadRow) {
        var dths = qsa("th", detailedHeadRow);
        for (var d = 0; d < dths.length; d++) {
          var label = (dths[d].textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
          if (label.indexOf("anota\xE7\xE3o") !== -1 || label.indexOf("anotacao") !== -1) {
            detailedNoteColIdx = d;
            break;
          }
        }
      }
      if (detailedNoteColIdx >= 0) {
        qsa("tbody tr", detailedTable).filter(function(tr) {
          return !tr.matches(".tableHeader, .infraCaption, .tablesorter-filter-row");
        }).filter(function(tr) {
          return qs("td", tr);
        }).forEach(function(tr) {
          var noteCell = qsa("td", tr)[detailedNoteColIdx];
          if (!noteCell) return;
          var noteText = (noteCell.textContent || "").replace(/ /g, " ").trim();
          if (noteText === "") return;
          noteCell.classList.add("seipro-sticknote-detailed-note-cell", "seipro-sticknote-note-cell");
          if (!qs(".seipro-sticknote-card", noteCell)) {
            wrapInner(noteCell, "seipro-sticknote-card");
          }
          clampToTwoLines(qs(".seipro-sticknote-card", noteCell));
        });
      }
    }
    getSticknoteHomeLinks().forEach(function(link) {
      var texttip = getSticknoteHomeText(link);
      var tr = link.closest("tr");
      var processLink = tr ? qs('a[href*="acao=procedimento_trabalhar"]', tr) : null;
      if (!processLink) {
        return;
      }
      if (texttip == null || texttip.trim() === "") {
        return;
      }
      var table = processLink.closest("table");
      if (table && table.matches("#tblProcessosDetalhado")) {
        return;
      }
      var iconCell = link.closest("td");
      if (iconCell) {
        iconCell.classList.add("seipro-sticknote-icon-cell");
        iconCell.setAttribute("data-sticknote-home-icon", "true");
        iconCell.style.width = "";
        iconCell.style.minWidth = "";
        iconCell.style.maxWidth = "";
      }
      var processCell = processLink.closest("td");
      var noteCell = processCell ? processCell.previousElementSibling : null;
      if (!(noteCell && noteCell.matches(".seipro-sticknote-inserted-cell"))) {
        noteCell = el("td", { className: "seipro-sticknote-inserted-cell seipro-sticknote-note-cell" });
        processCell.parentNode.insertBefore(noteCell, processCell);
      }
      var priority = getSticknoteHomePriority(link);
      qsa(".seipro-sticknote-card", noteCell).forEach(remove);
      var inline = el("div", {
        className: "seipro-sticknote-card " + (priority ? "seipro-sticknote-card--priority" : ""),
        innerHTML: formatDadosAnotacaoHome(texttip)
      });
      noteCell.insertBefore(inline, noteCell.firstChild);
      clampToTwoLines(inline);
      if (link.getAttribute("data-sticknote-priority") == null) {
        loadSticknoteHomePriority(link);
      }
    });
    tableProc.forEach(function(table) {
      if (table.matches("#tblProcessosDetalhado")) return;
      var iconColIdx = -1;
      var iconCellByClass = qs(".seipro-sticknote-icon-cell", table);
      if (iconCellByClass) {
        var iconRow = iconCellByClass.closest("tr");
        iconColIdx = iconRow ? qsa("td", iconRow).indexOf(iconCellByClass) : -1;
      } else {
        var rows = qsa("tbody tr", table);
        for (var r = 0; r < rows.length && iconColIdx < 0; r++) {
          var tds = qsa("td", rows[r]);
          for (var c = 0; c < tds.length; c++) {
            if (tds[c].getAttribute("width") === "20%") {
              iconColIdx = c;
              break;
            }
          }
        }
      }
      if (iconColIdx < 0) return;
      qsa("tbody tr", table).forEach(function(tr) {
        var cell = qsa("td", tr)[iconColIdx];
        if (!cell) return;
        if (!cell.getAttribute("data-sticknote-orig-width")) {
          cell.setAttribute("data-sticknote-orig-width", cell.getAttribute("width") || "");
        }
        cell.setAttribute("width", "28");
      });
      qsa("thead tr th[colspan], tbody tr.tableHeader th[colspan]", table).forEach(function(th) {
        var colspan = parseInt(th.getAttribute("colspan"), 10);
        if (!th.getAttribute("data-sticknote-orig-colspan")) {
          th.setAttribute("data-sticknote-orig-colspan", th.getAttribute("colspan") || "");
        }
        if (!Number.isNaN(colspan)) {
          th.setAttribute("colspan", String(colspan + 1));
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
