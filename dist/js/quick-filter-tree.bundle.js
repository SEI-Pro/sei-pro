(() => {
  // src/core/util.js
  function removeAcentos(str) {
    return typeof str !== "undefined" && str !== null && typeof str.normalize === "function" ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
  }
  function uniqPro(a) {
    return a.sort().filter(function(item, pos, ary) {
      return !pos || item !== ary[pos - 1];
    });
  }

  // src/shared/quickfilter/domain.js
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

  // src/shared/quickfilter/dom.js
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

  // src/features/quick-filter/tree.js
  var HIDDEN_CLASS = "seipro-quick-hidden";
  function shouldSkipNode(node) {
    if (!node || !node.parentNode) return true;
    const parent2 = node.parentNode;
    if (parent2.nodeType !== 1) return true;
    if (parent2.closest("script, style, noscript, textarea, title")) return true;
    if (parent2.closest("." + HIGHLIGHT_CLASS + ", ." + HIDDEN_CLASS)) return true;
    return false;
  }
  function applyTreeHighlight(value) {
    const tokens = getFilterTokens(value);
    const container = document.getElementById("divArvore") || document.body;
    if (!container) {
      clearHighlights(document.body);
      return;
    }
    applyHighlight(container, tokens, { shouldSkip: shouldSkipNode });
  }
  function apply(value) {
    document.querySelectorAll(".infraArvore." + HIDDEN_CLASS).forEach(function(el) {
      el.classList.remove(HIDDEN_CLASS);
    });
    applyTreeHighlight(value);
  }
  function getParentInput() {
    try {
      if (parent && parent.document) return parent.document.getElementById("txtPesquisaRapida");
    } catch (e) {
    }
    return null;
  }
  function initQuickFilterTree() {
    const input = getParentInput();
    if (!input) return;
    if (window.__SEI_PRO_QUICK_TREE_INPUT__) {
      window.__SEI_PRO_QUICK_TREE_INPUT__.removeEventListener("input", window.__SEI_PRO_QUICK_TREE_HANDLER__);
      window.__SEI_PRO_QUICK_TREE_INPUT__.removeEventListener("keydown", window.__SEI_PRO_QUICK_TREE_KEYDOWN__);
    }
    let debounceId = null;
    window.__SEI_PRO_QUICK_TREE_INPUT__ = input;
    window.__SEI_PRO_QUICK_TREE_HANDLER__ = function() {
      const value = input.value;
      clearTimeout(debounceId);
      debounceId = setTimeout(function() {
        apply(value);
      }, 120);
    };
    window.__SEI_PRO_QUICK_TREE_KEYDOWN__ = function(event) {
      if (event.key === "Escape") {
        input.value = "";
        clearTimeout(debounceId);
        apply("");
      }
    };
    input.addEventListener("input", window.__SEI_PRO_QUICK_TREE_HANDLER__);
    input.addEventListener("keydown", window.__SEI_PRO_QUICK_TREE_KEYDOWN__);
    apply(input.value || "");
  }

  // src/features/quick-filter/index-tree.js
  function isEnabled() {
    try {
      return typeof parent.checkConfigValue === "function" && parent.checkConfigValue("filtrarpaginapelapesquisarapida");
    } catch (e) {
      return false;
    }
  }
  function getParentInput2() {
    try {
      return parent && parent.document ? parent.document.getElementById("txtPesquisaRapida") : null;
    } catch (e) {
      return null;
    }
  }
  function observeTree() {
    const root = document.getElementById("divArvore");
    if (!root || root.__seiproQuickObserved) return;
    root.__seiproQuickObserved = true;
    let pending = false;
    const mo = new MutationObserver(function() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function() {
        pending = false;
        const input = getParentInput2();
        if (input && input.value) initQuickFilterTree();
      });
    });
    mo.observe(root, { childList: true, subtree: true });
  }
  (function boot() {
    if (!document.getElementById("divArvore")) return;
    if (window.__SEI_PRO_QUICK_FILTER_TREE_BOOTED__) return;
    window.__SEI_PRO_QUICK_FILTER_TREE_BOOTED__ = true;
    if (!isEnabled()) return;
    initQuickFilterTree();
    observeTree();
  })();
})();
