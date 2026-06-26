(() => {
  // src/dom/index.js
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  // src/core/util.js
  function removeAcentos(str) {
    return typeof str !== "undefined" && str !== null && typeof str.normalize === "function" ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
  }
  function uniqPro(a) {
    return a.sort().filter(function(item, pos, ary) {
      return !pos || item !== ary[pos - 1];
    });
  }

  // src/core/quickfilter.js
  function normalizeFilterText(text) {
    text = typeof text === "string" ? text : "";
    text = removeAcentos(text.toLowerCase());
    return text.replace(/\s+/g, " ").trim();
  }
  function getFilterTokens(text) {
    var query = normalizeFilterText(text);
    return query === "" ? [] : uniqPro(query.split(" ").filter(function(token) {
      return token !== "";
    }));
  }
  function getNormalizedIndexMap(text) {
    var normalized = "";
    var map = [];
    for (var i = 0; i < text.length; i++) {
      var normalizedChar = removeAcentos(text.charAt(i).toLowerCase());
      if (typeof normalizedChar !== "string") normalizedChar = text.charAt(i).toLowerCase();
      for (var j = 0; j < normalizedChar.length; j++) {
        normalized += normalizedChar.charAt(j);
        map.push(i);
      }
    }
    return { normalized, map };
  }
  function mergeHighlightRanges(ranges) {
    if (!ranges.length) return [];
    ranges.sort(function(a, b) {
      return a.start - b.start || a.end - b.end;
    });
    var merged = [ranges[0]];
    for (var i = 1; i < ranges.length; i++) {
      var current = ranges[i];
      var last = merged[merged.length - 1];
      if (current.start <= last.end) {
        last.end = Math.max(last.end, current.end);
      } else {
        merged.push(current);
      }
    }
    return merged;
  }
  function buildHighlightRanges(text, tokens) {
    if (!tokens.length || !text) return [];
    var mapData = getNormalizedIndexMap(text);
    var normalized = mapData.normalized;
    var indexMap = mapData.map;
    var ranges = [];
    tokens.forEach(function(token) {
      var startIndex = 0;
      while (startIndex < normalized.length) {
        var foundIndex = normalized.indexOf(token, startIndex);
        if (foundIndex === -1) break;
        var rawStart = indexMap[foundIndex];
        var rawEndIndex = foundIndex + token.length - 1;
        var rawEnd = indexMap[rawEndIndex] + 1;
        ranges.push({ start: rawStart, end: rawEnd });
        startIndex = foundIndex + token.length;
      }
    });
    return mergeHighlightRanges(ranges);
  }

  // src/core/quickfilter-dom.js
  var HIGHLIGHT_CLASS = "seipro-quick-highlight";
  function resolveDoc(scope) {
    if (scope && scope.ownerDocument) return scope.ownerDocument;
    if (scope && scope.nodeType === 9) return scope;
    return typeof document !== "undefined" ? document : null;
  }
  function clearHighlights(scope) {
    var doc = resolveDoc(scope);
    if (!doc) return;
    var root = scope || doc.body;
    if (!root || typeof root.querySelectorAll !== "function") return;
    var spans = root.querySelectorAll("." + HIGHLIGHT_CLASS);
    for (var i = 0; i < spans.length; i++) {
      var span = spans[i];
      if (span.parentNode) {
        span.parentNode.replaceChild(doc.createTextNode(span.textContent), span);
      }
    }
    if (typeof root.normalize === "function") root.normalize();
  }
  function highlightTextNode(node, tokens) {
    var text = node.nodeValue;
    if (!text || !text.trim()) return;
    var ranges = buildHighlightRanges(text, tokens);
    if (!ranges.length) return;
    var doc = node.ownerDocument || (typeof document !== "undefined" ? document : null);
    if (!doc) return;
    var fragment = doc.createDocumentFragment();
    var cursor = 0;
    ranges.forEach(function(range) {
      if (range.start > cursor) {
        fragment.appendChild(doc.createTextNode(text.slice(cursor, range.start)));
      }
      var span = doc.createElement("span");
      span.className = HIGHLIGHT_CLASS;
      span.textContent = text.slice(range.start, range.end);
      fragment.appendChild(span);
      cursor = range.end;
    });
    if (cursor < text.length) {
      fragment.appendChild(doc.createTextNode(text.slice(cursor)));
    }
    if (node.parentNode) node.parentNode.replaceChild(fragment, node);
  }
  function applyHighlight(container, tokens, options) {
    options = options || {};
    if (!container) return;
    var doc = resolveDoc(container);
    if (!doc || typeof doc.createTreeWalker !== "function") return;
    clearHighlights(container);
    if (!tokens || !tokens.length) return;
    var shouldSkip = typeof options.shouldSkip === "function" ? options.shouldSkip : function() {
      return false;
    };
    var walker = doc.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        return shouldSkip(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (var i = 0; i < nodes.length; i++) highlightTextNode(nodes[i], tokens);
  }

  // src/features/quick-filter/domain.js
  function buildRowHaystack(rawSegments) {
    const segments = [];
    const seen = /* @__PURE__ */ Object.create(null);
    for (let i = 0; i < rawSegments.length; i++) {
      const value = normalizeFilterText(String(rawSegments[i] || "").replace(/ /g, " "));
      if (value === "" || seen[value]) continue;
      seen[value] = true;
      segments.push(value);
    }
    return segments.join(" ");
  }
  function rowMatchesTokens(haystack, tokens) {
    if (!tokens || tokens.length === 0) return true;
    return tokens.every(function(token) {
      return haystack.indexOf(token) !== -1;
    });
  }

  // src/features/quick-filter/list.js
  var HIDDEN_CLASS = "seipro-quick-hidden";
  var CONTROL_TABLES = "#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado";
  var rowTextCache = typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : null;
  function buildRowText(rowEl) {
    if (rowTextCache && rowTextCache.has(rowEl)) return rowTextCache.get(rowEl);
    const raw = [];
    raw.push(rowEl.textContent);
    rowEl.querySelectorAll("a, span, td, th, img").forEach(function(elem) {
      raw.push(elem.textContent);
      raw.push(elem.getAttribute("title"));
      raw.push(elem.getAttribute("aria-label"));
      raw.push(elem.getAttribute("alt"));
      raw.push(elem.getAttribute("data-tagname"));
      const onmouseover = elem.getAttribute("onmouseover");
      if (onmouseover) {
        raw.push(onmouseover);
        pushTooltip(raw, window.extractTooltipToArray, onmouseover);
        pushTooltip(raw, window.extractGroupTableTooltipToArray, onmouseover);
        pushTooltip(raw, window.extractAllTextBetweenQuotes, onmouseover);
      }
    });
    const result = buildRowHaystack(raw);
    if (rowTextCache) rowTextCache.set(rowEl, result);
    return result;
  }
  function pushTooltip(raw, fn, source) {
    if (typeof fn !== "function") return;
    const out = fn(source);
    if (Array.isArray(out)) for (let i = 0; i < out.length; i++) raw.push(out[i]);
  }
  function getProcessRows(table) {
    return Array.prototype.filter.call(
      table.querySelectorAll("tbody tr"),
      function(tr) {
        return !tr.classList.contains("tableHeader") && !tr.classList.contains("tagintable") && !tr.classList.contains("infraCaption");
      }
    );
  }
  function updateHeaders(table) {
    let currentHeader = null;
    let hasVisibleRows = false;
    table.querySelectorAll("tbody tr").forEach(function(row) {
      if (row.classList.contains("tableHeader") || row.classList.contains("tagintable")) {
        if (currentHeader !== null) currentHeader.classList.toggle(HIDDEN_CLASS, !hasVisibleRows);
        currentHeader = row;
        hasVisibleRows = false;
        return;
      }
      if (!row.classList.contains(HIDDEN_CLASS) && row.offsetParent !== null) hasVisibleRows = true;
    });
    if (currentHeader !== null) currentHeader.classList.toggle(HIDDEN_CLASS, !hasVisibleRows);
  }
  function applyTableFilter(value) {
    const tokens = getFilterTokens(value);
    document.querySelectorAll(CONTROL_TABLES).forEach(function(table) {
      getProcessRows(table).forEach(function(row) {
        const matches = rowMatchesTokens(buildRowText(row), tokens);
        row.classList.toggle(HIDDEN_CLASS, !matches);
      });
      updateHeaders(table);
    });
  }
  function highlightContainer() {
    return document.getElementById("divInfraAreaTelaD") || document.getElementById("divInfraAreaTela") || document.body;
  }
  function shouldSkipNode(node) {
    if (!node || !node.parentNode) return true;
    const parent = node.parentNode;
    if (parent.nodeType !== 1) return true;
    if (parent.closest("#navInfraBarraNavegacao, #divInfraBarraSistema, #frmProtocoloPesquisaRapida, #divInfraSidebarMenu, #divInfraBarraLocalizacao")) return true;
    if (parent.closest("." + HIGHLIGHT_CLASS + ", ." + HIDDEN_CLASS)) return true;
    const tag = (parent.tagName || "").toLowerCase();
    if (!tag) return true;
    if (["script", "style", "textarea", "input", "select", "option", "button", "noscript"].indexOf(tag) !== -1) return true;
    if (parent.closest('[contenteditable="true"]')) return true;
    return !node.nodeValue || !node.nodeValue.trim();
  }
  function applyPageHighlight(value) {
    const tokens = getFilterTokens(value);
    const container = highlightContainer();
    if (!container) {
      clearHighlights(document);
      return;
    }
    applyHighlight(container, tokens, { shouldSkip: shouldSkipNode });
  }
  function apply(value) {
    if (document.querySelector(CONTROL_TABLES)) applyTableFilter(value);
    applyPageHighlight(value);
  }
  function initQuickFilterList() {
    const input = document.getElementById("txtPesquisaRapida");
    if (!input || input.dataset.seiproQuickFilterBound) return;
    input.dataset.seiproQuickFilterBound = "1";
    input.setAttribute("title", "Digite para filtrar a p\xE1gina atual. Enter mant\xE9m a pesquisa r\xE1pida nativa.");
    let debounceId = null;
    input.addEventListener("input", function() {
      const value = this.value;
      clearTimeout(debounceId);
      debounceId = setTimeout(function() {
        apply(value);
      }, 120);
    });
    input.addEventListener("keydown", function(event) {
      if (event.key === "Escape") {
        this.value = "";
        clearTimeout(debounceId);
        applyTableFilter("");
        clearHighlights(document);
      }
    });
    if (input.value) apply(input.value);
  }

  // src/features/quick-filter/index-list.js
  function isEnabled() {
    try {
      return typeof checkConfigValue === "function" && checkConfigValue("filtrarpaginapelapesquisarapida");
    } catch (e) {
      return false;
    }
  }
  (function boot() {
    if (window.__SEI_PRO_QUICK_FILTER_LIST_BOOTED__) return;
    window.__SEI_PRO_QUICK_FILTER_LIST_BOOTED__ = true;
    ready(function() {
      if (!isEnabled()) return;
      initQuickFilterList();
      setTimeout(function() {
        if (isEnabled()) initQuickFilterList();
      }, 500);
    });
  })();
})();
