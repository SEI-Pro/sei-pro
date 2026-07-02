(() => {
  // src/features/arvore-info/parse/inline-payload.js
  function extractNosAcoesHtml(scriptText) {
    var t = typeof scriptText === "string" ? scriptText : "";
    var m = t.match(/Nos\[0\]\.acoes\s*=\s*'([\s\S]*?)';/);
    if (!m) return null;
    return m[1].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\//g, "/");
  }
  function extractNosHtml(scriptText) {
    var t = typeof scriptText === "string" ? scriptText : "";
    if (t.indexOf("Nos[0].html = ") === -1) return null;
    var m = t.match(/Nos\[0\]\.html\s*=\s*'([^']+)'/);
    return m ? m[1] : null;
  }

  // src/features/arvore-info/parse/atribuicao.js
  function isAtribuicaoUnassigned(text, hasAncoraSigla) {
    var t = typeof text === "string" ? text : "";
    return !/atribuído para/i.test(t) && !!hasAncoraSigla;
  }

  // src/features/arvore-info/parse/marcador.js
  function parseAcaoRemoverId(onclickAttr) {
    var s = typeof onclickAttr === "string" ? onclickAttr : "";
    var m = s.match(/acaoRemover\('([^']+)'/);
    return m ? m[1] : null;
  }

  // src/core/texto.js
  function escapeComponent(str) {
    return escape(str).replace(/\+/g, "%2B");
  }
  var COMBINING_MARKS_RE = new RegExp("[\\u0300-\\u036f]", "g");

  // src/features/arvore-info/io.js
  var PAGE_CACHE_TTL_MS = 60 * 1e3;
  function createIo(deps) {
    var win = deps.win;
    var log = deps.log || function() {
    };
    var warn = deps.warn || function() {
    };
    var err = deps.err || function() {
    };
    var pageCache = /* @__PURE__ */ Object.create(null);
    function invalidatePage(url) {
      delete pageCache[url];
    }
    function fetchPage(url) {
      var entry = pageCache[url];
      if (entry && entry.expiresAt > Date.now()) return entry.promise;
      if (entry) log("fetchPage cache expired \u2192", url.split("?")[0]);
      else log("fetchPage \u2192", url.split("?")[0]);
      function tryOnce() {
        return fetch(url, { credentials: "include" }).then(function(r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.arrayBuffer();
        });
      }
      var promise = tryOnce().catch(function(e) {
        if (!/Failed to fetch|NetworkError/i.test(e.message)) throw e;
        return new Promise(function(res) {
          setTimeout(res, 500);
        }).then(tryOnce);
      }).then(function(buf) {
        var html = new TextDecoder("iso-8859-1").decode(buf);
        return new DOMParser().parseFromString(html, "text/html");
      }).catch(function(e) {
        err("fetchPage failed for", url, e.message);
        delete pageCache[url];
        throw e;
      });
      pageCache[url] = { promise, expiresAt: Date.now() + PAGE_CACHE_TTL_MS };
      return promise;
    }
    function submitForm(docA, overrides) {
      var form = docA.querySelector("form");
      if (!form) return Promise.reject(new Error("form not found in fetched page"));
      var action = form.getAttribute("action") || "";
      var absAction = new URL(action, docA.baseURI || win.location.href).href;
      var parts = [];
      function appendField(name, value) {
        parts.push(escapeComponent(name) + "=" + escapeComponent(value != null ? String(value) : ""));
      }
      var inputs = form.querySelectorAll("input, textarea, select, button");
      var submitEl = null;
      inputs.forEach(function(el) {
        var name = el.getAttribute("name");
        var type = (el.getAttribute("type") || el.type || "").toLowerCase();
        if (el.tagName === "BUTTON" && (type === "submit" || type === "") || el.tagName === "INPUT" && type === "submit") {
          if (!submitEl && name) submitEl = el;
          return;
        }
        if (!name) return;
        if (overrides.hasOwnProperty(name)) return;
        if (type === "checkbox" || type === "radio") {
          if (el.checked || el.getAttribute("checked") !== null) appendField(name, el.value || "on");
        } else if (el.tagName === "SELECT") {
          var sel = el.querySelector("option[selected]") || el.options[el.selectedIndex];
          if (sel) appendField(name, sel.value);
        } else {
          appendField(name, el.value != null ? el.value : "");
        }
      });
      if (submitEl) {
        appendField(submitEl.getAttribute("name"), submitEl.value || submitEl.textContent.trim() || "Salvar");
        log("submitForm: including submit button", submitEl.getAttribute("name"));
      } else {
        warn("submitForm: no named submit button found \u2014 server may reject");
      }
      Object.keys(overrides).forEach(function(k) {
        var v = overrides[k];
        if (v === false || v == null) return;
        appendField(k, v === true ? "on" : v);
      });
      log("submitForm \u2192", absAction.split("?")[0]);
      return fetch(absAction, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=ISO-8859-1" },
        body: parts.join("&")
      }).then(function(r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.arrayBuffer();
      }).then(function(buf) {
        return new DOMParser().parseFromString(new TextDecoder("iso-8859-1").decode(buf), "text/html");
      });
    }
    return { fetchPage, invalidatePage, submitForm };
  }

  // src/features/arvore-info/dom/confirm.js
  function forceTrueConfirm(winObj) {
    if (!winObj) return;
    var alwaysTrue = function() {
      return true;
    };
    try {
      winObj.confirm = alwaysTrue;
    } catch (_) {
    }
    try {
      Object.defineProperty(winObj, "confirm", {
        configurable: true,
        writable: true,
        value: alwaysTrue
      });
    } catch (_) {
    }
    try {
      if (typeof winObj.eval === "function") {
        winObj.eval("window.confirm = function () { return true; };");
      }
    } catch (_) {
    }
    try {
      if (winObj.top && winObj.top !== winObj) {
        winObj.top.confirm = alwaysTrue;
      }
    } catch (_) {
    }
  }

  // src/features/arvore-info/parse/consulta.js
  function acessoLabel(value, hipoteseText) {
    if (value == null || value === "") return "";
    var map = { "0": "P\xFAblico", "1": "Restrito", "2": "Sigiloso" };
    var txt = map[value] || value;
    if (value === "1" && hipoteseText) txt += ": " + hipoteseText;
    return txt;
  }
  function splitInteressado(name) {
    var n = typeof name === "string" ? name : "";
    var parts = n.indexOf("(") !== -1 ? n.split("(").map(function(s) {
      return s.trim().replace(")", "");
    }) : [n];
    return parts.filter(function(p) {
      return p;
    });
  }

  // src/features/arvore-info/sections/consulta.js
  function getAcessoText(docA) {
    var rdo = docA.querySelector('input[name="rdoNivelAcesso"]:checked');
    var hipoteseText = "";
    if (rdo && rdo.value === "1") {
      var hipSel = docA.getElementById("selHipoteseLegal");
      var hipOpt = hipSel && (hipSel.querySelector("option[selected]") || hipSel.options && hipSel.options[hipSel.selectedIndex]);
      if (hipOpt && hipOpt.textContent.trim()) hipoteseText = hipOpt.textContent.trim();
    }
    return { text: acessoLabel(rdo ? rdo.value : null, hipoteseText), element: rdo };
  }
  function getInteressadosTexts(docA) {
    var opts = docA.querySelectorAll("#selInteressadosProcedimento option, #selInteressados option");
    var items = [];
    for (var i = 0; i < opts.length; i++) {
      var name = (opts[i].textContent || "").trim();
      if (!name) continue;
      splitInteressado(name).forEach(function(part) {
        items.push(part);
      });
    }
    return items;
  }
  function installConsultaSection(ctx) {
    var doc = ctx.doc;
    var intPanel = ctx.intPanel, tipoPanel = ctx.tipoPanel, acessoPanel = ctx.acessoPanel, assuntosPanel = ctx.assuntosPanel, obsPanel = ctx.obsPanel;
    var findToolbarLink = ctx.findToolbarLink, fetchPage = ctx.fetchPage, invalidatePage = ctx.invalidatePage;
    var refreshers = ctx.refreshers, sectionEnabled = ctx.sectionEnabled;
    var log = ctx.log, warn = ctx.warn, report = ctx.report;
    var intBody = intPanel.querySelector(".seipro-interessados-body");
    var consultaUrl = findToolbarLink("procedimento_alterar") || findToolbarLink("procedimento_consultar");
    if (!consultaUrl) {
      warn("infoarvore_interessados: consulta link not found");
      intBody.innerHTML = '<span style="opacity:0.6">(indispon\xEDvel)</span>';
      tipoPanel.querySelector(".seipro-tipo-body").innerHTML = '<span style="opacity:0.6">(indispon\xEDvel)</span>';
      acessoPanel.querySelector(".seipro-acesso-body").innerHTML = '<span style="opacity:0.6">(indispon\xEDvel)</span>';
      assuntosPanel.querySelector(".seipro-assuntos-body").innerHTML = '<span style="opacity:0.6">(indispon\xEDvel)</span>';
      obsPanel.querySelector(".seipro-obs-body").innerHTML = '<span style="opacity:0.6">(indispon\xEDvel)</span>';
      refreshers.consulta = function() {
        var msg = '<span style="opacity:0.6">(indispon\xEDvel)</span>';
        intBody.innerHTML = msg;
        tipoPanel.querySelector(".seipro-tipo-body").innerHTML = msg;
        acessoPanel.querySelector(".seipro-acesso-body").innerHTML = msg;
        assuntosPanel.querySelector(".seipro-assuntos-body").innerHTML = msg;
        obsPanel.querySelector(".seipro-obs-body").innerHTML = msg;
      };
      return;
    }
    function setSectionText(panelBody, text, emptyText) {
      panelBody.innerHTML = "";
      if (text) {
        var a = doc.createElement("a");
        a.className = "newLink seipro-copy";
        a.style.cssText = "cursor:pointer;max-width:calc(100% - 70px);";
        a.textContent = text;
        panelBody.appendChild(a);
      } else {
        panelBody.innerHTML = '<span style="opacity:0.6">' + (emptyText || "(indispon\xEDvel)") + "</span>";
      }
    }
    function appendCopyRow(panelBody, text) {
      var row = doc.createElement("div");
      var a = doc.createElement("a");
      a.className = "newLink seipro-copy";
      a.style.cssText = "cursor:pointer;display:block;max-width:calc(100% - 70px);";
      a.textContent = text;
      row.appendChild(a);
      panelBody.appendChild(row);
    }
    function getSelectedOptionText(docA, selector) {
      var el = docA.querySelector(selector);
      var opt = el && (el.querySelector("option[selected]") || el.options && el.options[el.selectedIndex]);
      return {
        element: el,
        text: opt ? opt.textContent.trim() : ""
      };
    }
    function getOptionTexts(docA, selector) {
      var nodes = docA.querySelectorAll(selector);
      var items = [];
      nodes.forEach(function(o) {
        var txt = (o.textContent || "").trim();
        if (txt) items.push(txt);
      });
      return items;
    }
    function renderConsultaSections(docC) {
      var tipoBody = tipoPanel.querySelector(".seipro-tipo-body");
      var tipoData = getSelectedOptionText(docC, "#selTipoProcedimento");
      var tipoName = tipoData.text;
      setSectionText(tipoBody, tipoName, "(indispon\xEDvel)");
      if (!tipoName) report("infoarvore_consulta: Tipo de Processo unavailable in fetched form", { hasSelTipo: !!tipoData.element });
      var acessoBody = acessoPanel.querySelector(".seipro-acesso-body");
      var acessoData = getAcessoText(docC);
      var acessoTxt = acessoData.text;
      setSectionText(acessoBody, acessoTxt, "(indispon\xEDvel)");
      if (!acessoTxt) report("infoarvore_consulta: N\xEDvel de Acesso unavailable", { hasRdo: !!acessoData.element });
      var assBody = assuntosPanel.querySelector(".seipro-assuntos-body");
      var assOpts = getOptionTexts(docC, "#selAssuntos option");
      assBody.innerHTML = "";
      if (!assOpts.length) {
        assBody.innerHTML = '<span style="opacity:0.6">(sem assuntos)</span>';
      } else {
        assOpts.forEach(function(txt) {
          appendCopyRow(assBody, txt);
        });
      }
      var obsBody = obsPanel.querySelector(".seipro-obs-body");
      var obsTA = docC.getElementById("txaObservacoes");
      var obsVal = obsTA ? (obsTA.value || obsTA.textContent || "").trim() : "";
      setSectionText(obsBody, obsVal, "(sem observa\xE7\xF5es)");
      if (obsBody.firstChild && obsVal) obsBody.firstChild.style.whiteSpace = "pre-wrap";
      var opts = getInteressadosTexts(docC);
      intBody.innerHTML = "";
      if (!opts.length) {
        intBody.innerHTML = '<span style="opacity:0.6">(sem interessados)</span>';
        log("infoarvore_interessados: empty");
        return;
      }
      opts.forEach(function(part) {
        appendCopyRow(intBody, part);
      });
      log('infoarvore_consulta: tipo="' + tipoName + '" acesso="' + acessoTxt + '" assuntos=' + assOpts.length + " obs.len=" + obsVal.length);
      log("infoarvore_interessados: populated", opts.length, "interessado(s)");
    }
    function renderConsulta() {
      invalidatePage(consultaUrl);
      fetchPage(consultaUrl).then(function(docC) {
        renderConsultaSections(docC);
      }).catch(function(e) {
        var msg = '<span class="infoAlerta">(falha ao carregar)</span>';
        intBody.innerHTML = msg;
        tipoPanel.querySelector(".seipro-tipo-body").innerHTML = msg;
        acessoPanel.querySelector(".seipro-acesso-body").innerHTML = msg;
        assuntosPanel.querySelector(".seipro-assuntos-body").innerHTML = msg;
        obsPanel.querySelector(".seipro-obs-body").innerHTML = msg;
        report('infoarvore_consulta: fetch failed \u2014 5 sections (Tipo/Acesso/Assuntos/Obs/Interessados) shown as "(falha ao carregar)"', { error: e.message, url: consultaUrl });
      });
    }
    refreshers.consulta = renderConsulta;
    var consultaSections = ["interessados", "tipo_procedimento", "nivel_acesso", "assuntos", "observacoes"];
    if (consultaSections.some(sectionEnabled)) renderConsulta();
    else log("infoarvore_consulta: skipped (all 5 dependent sections disabled by user)");
  }

  // src/features/arvore-info/sections/acompanhamento.js
  function parseAcompItems(docA) {
    var rows = docA.querySelectorAll("table.infraTable tr");
    var items = [];
    for (var r = 1; r < rows.length; r++) {
      var tds = rows[r].querySelectorAll("td");
      if (tds.length < 3) continue;
      var acompId = null;
      var exLink = rows[r].querySelector('a[onclick*="acaoExcluir"]');
      if (exLink) {
        var idM = exLink.getAttribute("onclick").match(/acaoExcluir\((\d+)/);
        if (idM) acompId = idM[1];
      }
      if (!acompId) {
        var chk = rows[r].querySelector('input[type="checkbox"][name*="chk"]');
        if (chk) acompId = chk.value;
      }
      items.push({
        id: acompId,
        grupo: (tds[1].textContent || "").trim(),
        obs: (tds[2].textContent || "").trim(),
        user: tds[3] ? (tds[3].textContent || "").trim() : "",
        date: tds[4] ? (tds[4].textContent || "").trim() : ""
      });
    }
    return items;
  }
  function installAcompanhamentoSection(ctx) {
    var doc = ctx.doc, acompPanel = ctx.acompPanel;
    var findToolbarLink = ctx.findToolbarLink, getToolbarLinks = ctx.getToolbarLinks;
    var fetchPage = ctx.fetchPage, invalidatePage = ctx.invalidatePage, submitViaIframe = ctx.submitViaIframe;
    var refreshSection = ctx.refreshSection, refreshers = ctx.refreshers, sectionEnabled = ctx.sectionEnabled;
    var log = ctx.log, warn = ctx.warn, err = ctx.err, report = ctx.report;
    var acompBody = acompPanel.querySelector(".seipro-acomp-body");
    var acompUrl = findToolbarLink("acompanhamento_gerenciar") || findToolbarLink("acompanhamento_listar") || findToolbarLink("acompanhamento_cadastrar") || findToolbarLink("acompanhamento_alterar");
    function renderAcompItemRow(it) {
      var row = doc.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:6px;margin-bottom:4px;";
      var txt = it.obs + (it.grupo ? (it.obs ? " " : "") + "(" + it.grupo + ")" : "");
      var a = doc.createElement("a");
      a.className = "newLink seipro-copy";
      a.style.cssText = "cursor:pointer;flex:1;white-space:pre-wrap;";
      a.textContent = txt || "(em acompanhamento)";
      row.appendChild(a);
      if (it.id) {
        var btn = doc.createElement("a");
        btn.className = "newLink";
        btn.title = "Remover acompanhamento especial";
        btn.style.cssText = "cursor:pointer;color:#c00;flex-shrink:0;";
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.addEventListener("click", function() {
          if (btn.style.opacity === "0.4") return;
          btn.style.opacity = "0.4";
          btn.style.pointerEvents = "none";
          submitViaIframe(acompUrl, function(w, d2) {
            var removeLink = Array.from(d2.querySelectorAll('a[onclick*="acaoExcluir"]')).find(function(a2) {
              var oc = a2.getAttribute("onclick") || "";
              return oc.indexOf("acaoExcluir(" + it.id) !== -1 || oc.indexOf("acaoExcluir('" + it.id + "'") !== -1;
            });
            if (removeLink) {
              removeLink.click();
            } else if (typeof w.acaoExcluir === "function") {
              w.acaoExcluir(it.id, it.obs || it.grupo || "");
            } else {
              var chks = d2.querySelectorAll('input[type="checkbox"]');
              for (var c = 0; c < chks.length; c++) {
                chks[c].checked = chks[c].value == it.id;
              }
              var f = d2.querySelector("form");
              if (f) f.submit();
            }
          }).then(function() {
            refreshSection("acomp", "post-remove acomp");
          }).catch(function(e) {
            err("acomp remove:", e.message);
            btn.style.opacity = "1";
            btn.style.pointerEvents = "";
          });
        });
        row.appendChild(btn);
      }
      return row;
    }
    function renderAcomp() {
      invalidatePage(acompUrl);
      acompBody.innerHTML = '<span style="opacity:0.6">carregando\u2026</span>';
      fetchPage(acompUrl).then(function(docA) {
        var items = parseAcompItems(docA);
        acompBody.innerHTML = "";
        if (!items.length) {
          acompBody.innerHTML = '<span style="opacity:0.6">(n\xE3o est\xE1 em acompanhamento especial)</span>';
          return;
        }
        items.forEach(function(it) {
          acompBody.appendChild(renderAcompItemRow(it));
        });
      }).catch(function(e) {
        acompBody.innerHTML = '<span class="infoAlerta">(falha ao carregar)</span>';
        report("infoarvore_acomp: fetch failed", { error: e.message, url: acompUrl });
      });
    }
    refreshers.acomp = renderAcomp;
    if (!acompUrl) {
      acompBody.innerHTML = '<span style="opacity:0.6">(indispon\xEDvel)</span>';
      var names = getToolbarLinks().map(function(l) {
        return (l.url.match(/acao=([^&]+)/) || [])[1];
      }).filter(Boolean);
      warn("infoarvore_acomp: no acompanhamento_* toolbar link. Toolbar actions:", names.join(", "));
    } else if (sectionEnabled("acompanhamento_especial")) renderAcomp();
    else log("infoarvore_acomp: skipped (section disabled by user)");
  }

  // src/features/arvore-info/sections/marcador.js
  function parseMarcadorItems(docM) {
    var items = [];
    var rows = docM.querySelectorAll("table.infraTable tr");
    for (var r = 1; r < rows.length; r++) {
      var tds = rows[r].querySelectorAll("td");
      if (tds.length < 4) continue;
      var img = tds[1].querySelector("img");
      var remA = rows[r].querySelector('a[onclick*="acaoRemover"]');
      var remMatch = remA ? parseAcaoRemoverId(remA.getAttribute("onclick")) : null;
      var tagA = tds[1].querySelector("a[title]");
      items.push({
        id: remMatch,
        iconSrc: img ? img.getAttribute("src") : null,
        tag: tagA && tagA.getAttribute("title") || (tds[1].textContent || "").trim(),
        note: (tds[2].textContent || "").trim(),
        user: (tds[3].textContent || "").trim()
      });
    }
    if (!items.length) {
      var sel = docM.getElementById("selMarcador");
      var ta = docM.getElementById("txaTexto");
      var opt = sel && (sel.querySelector("option[selected]") || sel.options && sel.options[sel.selectedIndex]);
      var tag = opt ? opt.textContent.trim() : "";
      var note = ta ? ta.value || ta.textContent || "" : "";
      if (tag || note) items.push({ id: null, iconSrc: opt && (opt.getAttribute("data-imagesrc") || opt.dataset.imagesrc), tag, note, user: "" });
    }
    return items;
  }
  function installMarcadorSection(ctx) {
    var doc = ctx.doc, marcPanel = ctx.marcPanel;
    var findToolbarLink = ctx.findToolbarLink, fetchPage = ctx.fetchPage, invalidatePage = ctx.invalidatePage;
    var submitViaIframe = ctx.submitViaIframe, refreshSection = ctx.refreshSection, refreshers = ctx.refreshers;
    var sectionEnabled = ctx.sectionEnabled, log = ctx.log, warn = ctx.warn, err = ctx.err, report = ctx.report;
    var marcadorUrl = findToolbarLink("andamento_marcador_gerenciar");
    function renderMarcadorItemRow(it) {
      var row = doc.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:6px;margin-bottom:4px;";
      var lbl = doc.createElement("span");
      lbl.style.flex = "1";
      if (it.iconSrc) {
        var im = doc.createElement("img");
        im.src = it.iconSrc;
        im.style.cssText = "width:14px;vertical-align:middle;margin-right:6px;";
        lbl.appendChild(im);
      }
      var s = doc.createElement("strong");
      s.textContent = it.tag;
      lbl.appendChild(s);
      if (it.note) {
        var n = doc.createElement("div");
        n.style.cssText = "opacity:0.8;margin-left:20px;";
        n.textContent = it.note;
        lbl.appendChild(n);
      }
      row.appendChild(lbl);
      if (it.id) {
        var rmBtn = doc.createElement("a");
        rmBtn.className = "newLink";
        rmBtn.title = "Remover marcador";
        rmBtn.style.cssText = "cursor:pointer;color:#c00;flex-shrink:0;";
        rmBtn.innerHTML = '<i class="fas fa-times"></i>';
        rmBtn.addEventListener("click", function() {
          if (rmBtn.style.opacity === "0.4") return;
          rmBtn.style.opacity = "0.4";
          rmBtn.style.pointerEvents = "none";
          submitViaIframe(marcadorUrl, function(w, d2) {
            var removeLink = Array.from(d2.querySelectorAll('a[onclick*="acaoRemover"]')).find(function(a) {
              var oc = a.getAttribute("onclick") || "";
              return oc.indexOf("acaoRemover('" + it.id + "'") !== -1;
            });
            if (removeLink) {
              forceTrueConfirm(w);
              removeLink.click();
            } else if (typeof w.acaoRemover === "function") {
              forceTrueConfirm(w);
              w.acaoRemover(it.id, it.tag || "");
            } else {
              var hdn = d2.getElementById("hdnInfraItemId");
              if (hdn) hdn.value = it.id;
              var f = d2.getElementById("frmGerenciarMarcador") || d2.querySelector("form");
              if (f) f.submit();
            }
          }).then(function() {
            refreshSection("marcador", "post-remove marcador");
          }).catch(function(e) {
            err("marcador remove:", e.message);
            rmBtn.style.opacity = "1";
            rmBtn.style.pointerEvents = "";
          });
        });
        row.appendChild(rmBtn);
      }
      return row;
    }
    if (!marcadorUrl) {
      warn('infoarvore_marcador: toolbar link not found \u2014 section will stay as "carregando"');
      marcPanel.querySelector(".seipro-marcador-body").innerHTML = '<span style="opacity:0.6">(sem marcador)</span>';
      return;
    }
    function renderMarcador() {
      invalidatePage(marcadorUrl);
      marcPanel.querySelector(".seipro-marcador-body").innerHTML = '<span style="opacity:0.6">carregando\u2026</span>';
      fetchPage(marcadorUrl).then(function(docM) {
        var items = parseMarcadorItems(docM);
        var bd = marcPanel.querySelector(".seipro-marcador-body");
        bd.innerHTML = "";
        if (!items.length) {
          bd.innerHTML = '<span style="opacity:0.6">(sem marcador)</span>';
          return;
        }
        items.forEach(function(it) {
          bd.appendChild(renderMarcadorItemRow(it));
        });
      }).catch(function(e) {
        marcPanel.querySelector(".seipro-marcador-body").innerHTML = '<span class="infoAlerta">(falha ao carregar marcador)</span>';
        report("infoarvore_marcador: fetch failed", { error: e.message, url: marcadorUrl });
      });
    }
    refreshers.marcador = renderMarcador;
    if (sectionEnabled("marcador")) renderMarcador();
    else log("infoarvore_marcador: skipped (section disabled by user)");
  }

  // src/features/arvore-info/sections/atribuicao.js
  function parseAtribuicaoItemsFromDoc(docR) {
    var newResp = [];
    var scrs = docR.querySelectorAll("script:not([src])");
    for (var i = 0; i < scrs.length; i++) {
      var txt = scrs[i].textContent || "";
      var raw = extractNosHtml(txt);
      if (raw === null) continue;
      raw.split("<br />").forEach(function(frag) {
        var tmp = docR.createElement("div");
        tmp.innerHTML = frag;
        var text = tmp.textContent.trim();
        if (text) newResp.push({ text, unassigned: isAtribuicaoUnassigned(text, tmp.querySelector("a.ancoraSigla")) });
      });
      break;
    }
    return newResp;
  }
  function createAtribuicaoSection(ctx) {
    var doc = ctx.doc, win = ctx.win;
    var findToolbarLink = ctx.findToolbarLink, fetchPage = ctx.fetchPage, invalidatePage = ctx.invalidatePage;
    var submitViaIframe = ctx.submitViaIframe, log = ctx.log, err = ctx.err, report = ctx.report;
    function renderRows(body, items) {
      body.innerHTML = "";
      if (!items.length) {
        body.innerHTML = '<span class="infoAlerta">(sem respons\xE1veis)</span>';
        return;
      }
      items.forEach(function(r) {
        var row = doc.createElement("div");
        var a = doc.createElement("a");
        a.className = "newLink seipro-copy";
        a.style.cursor = "pointer";
        a.style.maxWidth = "calc(100% - 70px)";
        a.textContent = r.text + (r.unassigned ? " " : "");
        if (r.unassigned) {
          var alert2 = doc.createElement("span");
          alert2.className = "infoAlerta";
          alert2.textContent = "(n\xE3o atribu\xEDdo)";
          a.appendChild(alert2);
        }
        row.appendChild(a);
        body.appendChild(row);
      });
    }
    function editInline(panel) {
      var atribUrl = findToolbarLink("procedimento_atribuicao_cadastrar");
      if (!atribUrl) {
        report("inline atrib: toolbar link not found \u2014 edit Atribui\xE7\xE3o disabled", { sought: "procedimento_atribuicao_cadastrar" });
        return;
      }
      var body = panel.querySelector(".infoDadosArvore");
      var savedHTML = body.innerHTML;
      body.innerHTML = '<span style="opacity:0.6">carregando formul\xE1rio\u2026</span>';
      invalidatePage(atribUrl);
      fetchPage(atribUrl).then(function(docA) {
        var srcSel = docA.querySelector("#selAtribuicao");
        if (!srcSel) {
          err("inline atrib: #selAtribuicao not found");
          body.innerHTML = savedHTML;
          return;
        }
        var wrap = doc.createElement("div");
        wrap.style.cssText = "display:flex;flex-direction:column;gap:6px;";
        var sel = doc.createElement("select");
        sel.style.cssText = "width:100%;padding:4px;";
        Array.prototype.forEach.call(srcSel.options, function(o) {
          var opt = doc.createElement("option");
          opt.value = o.value;
          opt.textContent = o.text;
          if (o.selected) opt.selected = true;
          sel.appendChild(opt);
        });
        var btnRow = doc.createElement("div");
        btnRow.style.cssText = "display:flex;gap:6px;justify-content:flex-end;";
        var btnSave = doc.createElement("button");
        btnSave.type = "button";
        btnSave.className = "newLink";
        btnSave.textContent = "Salvar";
        btnSave.style.cssText = "cursor:pointer;padding:2px 10px;";
        var btnCancel = doc.createElement("button");
        btnCancel.type = "button";
        btnCancel.className = "newLink";
        btnCancel.textContent = "Cancelar";
        btnCancel.style.cssText = "cursor:pointer;padding:2px 10px;";
        btnRow.appendChild(btnCancel);
        btnRow.appendChild(btnSave);
        wrap.appendChild(sel);
        wrap.appendChild(btnRow);
        body.innerHTML = "";
        body.appendChild(wrap);
        btnCancel.addEventListener("click", function() {
          body.innerHTML = savedHTML;
        });
        btnSave.addEventListener("click", function() {
          btnSave.disabled = true;
          btnCancel.disabled = true;
          btnSave.textContent = "salvando\u2026";
          submitViaIframe(atribUrl, { selAtribuicao: sel.value }).then(function() {
            log("inline atrib: saved, re-rendering respons\xE1veis");
            invalidatePage(win.location.href);
            return fetchPage(win.location.href).then(function(docR) {
              var newResp = parseAtribuicaoItemsFromDoc(docR);
              renderRows(body, newResp);
              var pencilA = panel.querySelector('.seipro-edit[data-mode="responsaveis"]');
              if (pencilA) pencilA.dataset.text = newResp[0] && newResp[0].text || "";
            });
          }).catch(function(e) {
            err("inline atrib submit:", e.message);
            body.innerHTML = savedHTML;
            report("inline atrib: submit failed \u2014 reverted to previous value");
          });
        });
      }).catch(function(e) {
        err("inline atrib fetch:", e.message);
        body.innerHTML = savedHTML;
      });
    }
    return { renderRows, editInline, parseFromDoc: parseAtribuicaoItemsFromDoc };
  }

  // src/features/arvore-info/dom/caret.js
  function createCaret(deps) {
    var doc = deps.doc;
    var win = deps.win;
    function placeCaretAtEnd(el) {
      el.focus();
      var range = doc.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = win.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    function getCaretCharOffset(el) {
      try {
        var sel = win.getSelection();
        if (!sel || !sel.rangeCount) return null;
        var r = sel.getRangeAt(0);
        if (!el.contains(r.startContainer)) return null;
        var lines = Array.prototype.slice.call(el.children);
        if (!lines.length) {
          if (r.startContainer.nodeType === 3) return r.startOffset;
          return (el.textContent || "").length;
        }
        var count = 0;
        for (var i = 0; i < lines.length; i++) {
          if (i > 0) count += 1;
          var lineDiv = lines[i];
          var inThisLine = lineDiv === r.startContainer || lineDiv.contains(r.startContainer);
          if (!inThisLine) {
            count += (lineDiv.textContent || "").length;
            continue;
          }
          if (r.startContainer === lineDiv) {
            for (var c = 0; c < r.startOffset && c < lineDiv.childNodes.length; c++) {
              count += (lineDiv.childNodes[c].textContent || "").length;
            }
            return count;
          }
          var walker = doc.createTreeWalker(lineDiv, NodeFilter.SHOW_TEXT, null, false);
          var node;
          while (node = walker.nextNode()) {
            if (node === r.startContainer) return count + r.startOffset;
            count += node.nodeValue.length;
          }
          return count;
        }
        return count;
      } catch (e) {
        return null;
      }
    }
    function setCaretCharOffset(el, target) {
      if (target == null || target < 0) {
        placeCaretAtEnd(el);
        return;
      }
      el.focus();
      try {
        var lines = Array.prototype.slice.call(el.children);
        if (!lines.length) {
          placeCaretAtEnd(el);
          return;
        }
        var count = 0;
        for (var i = 0; i < lines.length; i++) {
          if (i > 0) count += 1;
          var lineDiv = lines[i];
          var lineLen = (lineDiv.textContent || "").length;
          if (target <= count + lineLen) {
            var within = target - count;
            var walker = doc.createTreeWalker(lineDiv, NodeFilter.SHOW_TEXT, null, false);
            var node, acc = 0;
            while (node = walker.nextNode()) {
              var len = node.nodeValue.length;
              if (within <= acc + len) {
                var range = doc.createRange();
                range.setStart(node, within - acc);
                range.collapse(true);
                var sel = win.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                return;
              }
              acc += len;
            }
            var r2 = doc.createRange();
            r2.selectNodeContents(lineDiv);
            r2.collapse(true);
            var s2 = win.getSelection();
            s2.removeAllRanges();
            s2.addRange(r2);
            return;
          }
          count += lineLen;
        }
        placeCaretAtEnd(el);
      } catch (e) {
        placeCaretAtEnd(el);
      }
    }
    return { placeCaretAtEnd, getCaretCharOffset, setCaretCharOffset };
  }

  // src/features/arvore-info/parse/anotacao.js
  function stripChecklistMarker(text) {
    var t = typeof text === "string" ? text : "";
    return t.replace(/^\[[ X]\]\s*/, "");
  }
  function parseAnotLinePrefix(raw) {
    var r = typeof raw === "string" ? raw : "";
    if (r.indexOf("[X]") === 0) return { check: true, checked: true, rest: r.slice(3).trim() };
    if (r.indexOf("[ ]") === 0) return { check: true, checked: false, rest: r.slice(3).trim() };
    return { check: false, checked: false, rest: r };
  }

  // src/features/arvore-info/sections/anotacao.js
  function installAnotacaoSection(ctx) {
    var doc = ctx.doc, win = ctx.win;
    var fetchPage = ctx.fetchPage, invalidatePage = ctx.invalidatePage, submitForm = ctx.submitForm;
    var refreshers = ctx.refreshers, sectionEnabled = ctx.sectionEnabled;
    var anotPanel = ctx.anotPanel, findToolbarLink = ctx.findToolbarLink;
    var log = ctx.log, warn = ctx.warn, err = ctx.err, report = ctx.report;
    var normalizeMojibakeUtf8 = ctx.normalizeMojibakeUtf8;
    function anotLineFromDom(container) {
      var lines = [];
      var children = container.children.length ? container.children : [container];
      Array.prototype.forEach.call(children, function(el) {
        if (el.tagName === "BR") {
          lines.push("");
          return;
        }
        var text = (el.textContent || "").replace(/\s+$/, "");
        if (!text) {
          lines.push("");
          return;
        }
        var prefix = el.classList.contains("stickNoteChecked") ? "[X] " : el.classList.contains("stickNoteCheck") ? "[ ] " : "";
        lines.push(prefix + stripChecklistMarker(text));
      });
      while (lines.length && lines[lines.length - 1] === "") lines.pop();
      return lines.join("\n");
    }
    function anotDomFromLine(container, line) {
      container.innerHTML = "";
      if (!line) {
        var emptyDiv = doc.createElement("div");
        emptyDiv.appendChild(doc.createElement("br"));
        container.appendChild(emptyDiv);
        return;
      }
      line.split("\n").forEach(function(raw) {
        var div = doc.createElement("div");
        if (!raw) {
          div.appendChild(doc.createElement("br"));
          container.appendChild(div);
          return;
        }
        var parsed = parseAnotLinePrefix(raw);
        if (parsed.check && parsed.checked) div.classList.add("stickNoteCheck", "stickNoteChecked");
        else if (parsed.check) div.classList.add("stickNoteCheck");
        div.textContent = parsed.rest;
        container.appendChild(div);
      });
    }
    var anotBody = anotPanel.querySelector(".seipro-anot-body");
    var anotUrl = findToolbarLink("anotacao_registrar") || findToolbarLink("acao=anotacao_");
    if (!anotUrl) {
      warn("infoarvore_anotacoes: toolbar link not found");
      anotBody.innerHTML = '<span style="opacity:0.6">(indispon\xEDvel)</span>';
    } else {
      refreshers.anotacoes = function() {
        invalidatePage(anotUrl);
        renderAnotacao(anotUrl);
      };
      if (sectionEnabled("anotacoes")) renderAnotacao(anotUrl);
      else log("infoarvore_anotacoes: skipped (section disabled by user)");
    }
    function readAnotacaoData(docA) {
      var ta = docA.getElementById("txaDescricao");
      var pri = docA.getElementById("chkSinPrioridade");
      return {
        text: normalizeMojibakeUtf8(ta ? ta.value || ta.textContent || "" : ""),
        priority: !!(pri && (pri.checked || pri.getAttribute("checked") !== null))
      };
    }
    function renderAnotacao(url) {
      fetchPage(url).then(function(docA) {
        var data = readAnotacaoData(docA);
        buildAnotUI(url, data.text, data.priority);
        log("infoarvore_anotacoes: loaded (priority=" + data.priority + ", len=" + data.text.length + ")");
      }).catch(function(e) {
        anotBody.innerHTML = '<span class="infoAlerta">(falha ao carregar anota\xE7\xE3o)</span>';
        report("infoarvore_anotacoes: fetch failed", { error: e.message, url: anotUrl });
      });
    }
    function saveAnotacaoToServer(url, line, priority, onDone, onFail) {
      invalidatePage(url);
      fetchPage(url).then(function(docA) {
        return submitForm(docA, { txaDescricao: line, chkSinPrioridade: priority ? "on" : false });
      }).then(function() {
        invalidatePage(url);
        if (typeof onDone === "function") onDone();
      }).catch(function(e) {
        if (typeof onFail === "function") onFail(e);
      });
    }
    function createPresetRankIconHtml(barCount, act, label) {
      var bars = barCount === 2 ? [
        '<rect x="5.2" y="6.4" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect>',
        '<rect x="5.2" y="11.9" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect>'
      ].join("") : [
        '<rect x="5.2" y="4.9" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect>',
        '<rect x="5.2" y="9.2" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect>',
        '<rect x="5.2" y="13.5" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect>'
      ].join("");
      return '<i class="seipro-anot-btn seipro-anot-preset" data-act="' + act + '" title="' + label + '" aria-label="' + label + '" role="button" style="cursor:pointer;color:#666;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;line-height:1;font-size:0;"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" style="width:30px;height:30px;display:block;pointer-events:none;"><circle cx="10" cy="10" r="8.2" fill="none" stroke="currentColor" stroke-width="1.25"></circle>' + bars + "</svg></i>";
    }
    function createAnotacaoStaticUI(initialText, initialPriority, stamp) {
      var editor = doc.createElement("div");
      editor.className = "seipro-anot-editor";
      editor.setAttribute("contenteditable", "false");
      editor.style.cssText = "min-height:24px;padding:6px;border:1px solid transparent;border-radius:4px;white-space:pre-wrap;max-width:100%;outline:none;";
      editor.dataset.original = initialText;
      editor.dataset.priority = initialPriority ? "1" : "0";
      anotDomFromLine(editor, initialText);
      if (!initialText) editor.innerHTML = '<div style="opacity:0.5;font-style:italic;">(sem anota\xE7\xE3o \u2014 clique em \u270F\uFE0F para adicionar)</div>';
      if (initialPriority) editor.style.borderLeft = "3px solid #d33";
      decorateReadonly(editor);
      var actions = doc.createElement("div");
      actions.className = "seipro-anot-actions";
      actions.style.cssText = "margin-top:6px;display:flex;gap:10px;align-items:center;font-size:90%;";
      actions.innerHTML = '<i class="fas fa-edit azulColor seipro-anot-btn" data-act="edit"  title="Editar" style="cursor:pointer;"></i><i class="fas fa-save azulColor seipro-anot-btn" data-act="save"  title="Salvar" style="cursor:pointer;display:none;"></i><i class="fas fa-times-circle seipro-anot-btn" data-act="cancel"  title="Cancelar" style="cursor:pointer;color:#888;display:none;"></i><i class="fas fa-check-square azulColor seipro-anot-btn" data-act="check"  title="Alternar checklist na linha" style="cursor:pointer;display:none;"></i><i class="fas fa-calendar-plus azulColor seipro-anot-btn" data-act="date"  title="Inserir data" style="cursor:pointer;"></i><input type="date" class="seipro-anot-date-input" style="display:none;"><i class="fas fa-exclamation-circle seipro-anot-btn" data-act="prio"  title="Prioridade" style="cursor:pointer;color:' + (initialPriority ? "#d33" : "#888") + ';"></i><span class="seipro-anot-presets" style="display:inline-flex;gap:6px;align-items:center;margin-left:6px;">' + createPresetRankIconHtml(2, "preset-chefia", "Adicionar: Aguardando a assinatura da chefia imediata") + createPresetRankIconHtml(3, "preset-superintendente", "Adicionar: Aguardando a assinatura do superintendente") + '</span><span class="seipro-anot-count" style="margin-left:auto;font-size:85%;color:#888;"></span><i class="fas fa-trash-alt seipro-anot-btn" data-act="remove"  title="Remover" style="cursor:pointer;color:#a33;"></i><i class="fas fa-thumbs-up seipro-anot-btn" data-act="remove-confirm"  title="Confirmar remo\xE7\xE3o" style="cursor:pointer;color:#393;display:none;"></i><i class="fas fa-thumbs-down seipro-anot-btn" data-act="remove-cancel"  title="Cancelar" style="cursor:pointer;color:#888;display:none;"></i>';
      var stampEl = doc.createElement("div");
      stampEl.style.cssText = "font-size:80%;color:#666;margin-top:4px;";
      if (stamp && stamp.user) {
        var when = new Date(stamp.at);
        stampEl.innerHTML = '<i class="far fa-user" style="margin-right:4px;"></i>por <strong>' + stamp.user + "</strong> em " + when.toLocaleString("pt-BR");
      }
      return { editor, actions, stampEl };
    }
    function buildAnotUI(url, initialText, initialPriority, opts) {
      opts = opts || {};
      anotBody.innerHTML = "";
      anotBody.classList.toggle("seipro-anot-priority", initialPriority);
      var idProc = (win.location.href.match(/id_procedimento=(\d+)/) || [])[1];
      var stampKey = "seiProAnotStamp_" + idProc;
      var userSEI = (function() {
        try {
          return win.parent && win.parent.userSEI;
        } catch (e) {
          return "";
        }
      })() || "";
      if (opts.justSaved) {
        try {
          win.localStorage.setItem(stampKey, JSON.stringify({ user: userSEI, at: Date.now() }));
        } catch (e) {
        }
      }
      var stamp = null;
      try {
        stamp = JSON.parse(win.localStorage.getItem(stampKey) || "null");
      } catch (e) {
      }
      var ui = createAnotacaoStaticUI(initialText, initialPriority, stamp);
      var editor = ui.editor;
      var actions = ui.actions;
      var stampEl = ui.stampEl;
      anotBody.appendChild(editor);
      anotBody.appendChild(actions);
      if (stamp) anotBody.appendChild(stampEl);
      var savedSelectionRange = null;
      function saveEditorSelection() {
        try {
          var sel = win.getSelection();
          if (!sel || !sel.rangeCount) return;
          var range = sel.getRangeAt(0);
          if (!range || !range.commonAncestorContainer || !editor.contains(range.commonAncestorContainer)) return;
          savedSelectionRange = range.cloneRange();
        } catch (e) {
        }
      }
      function restoreEditorSelection() {
        try {
          if (!savedSelectionRange) return false;
          var sel = win.getSelection();
          if (!sel) return false;
          sel.removeAllRanges();
          sel.addRange(savedSelectionRange);
          editor.focus();
          return true;
        } catch (e) {
          return false;
        }
      }
      function setMode(editing) {
        editor.setAttribute("contenteditable", editing ? "true" : "false");
        editor.style.border = editing ? "1px dashed #bfa500" : "1px solid transparent";
        actions.querySelector("[data-act=edit]").style.display = editing ? "none" : "";
        actions.querySelector("[data-act=save]").style.display = editing ? "" : "none";
        actions.querySelector("[data-act=cancel]").style.display = editing ? "" : "none";
        actions.querySelector("[data-act=check]").style.display = editing ? "" : "none";
        if (editing) {
          if (!editor.dataset.original) {
            editor.innerHTML = "";
            var d = doc.createElement("div");
            d.appendChild(doc.createElement("br"));
            editor.appendChild(d);
          } else {
            anotDomFromLine(editor, editor.dataset.original);
          }
          editor.focus();
        } else {
          anotDomFromLine(editor, editor.dataset.original);
          decorateReadonly(editor);
        }
        updateDirtyIndicator();
      }
      function isDirty() {
        var cur = anotLineFromDom(editor);
        return cur !== editor.dataset.original;
      }
      function updateDirtyIndicator() {
        var saveBtn = actions.querySelector("[data-act=save]");
        var dot = saveBtn.querySelector(".seipro-anot-dirty");
        if (editor.getAttribute("contenteditable") === "true" && isDirty()) {
          if (!dot) {
            dot = doc.createElement("span");
            dot.className = "seipro-anot-dirty";
            dot.style.cssText = "display:inline-block;width:6px;height:6px;border-radius:50%;background:#e69a00;margin-left:2px;vertical-align:top;";
            saveBtn.appendChild(dot);
          }
        } else if (dot) {
          dot.remove();
        }
      }
      function updateCount() {
        var cur = (editor.textContent || "").length;
        var max = 500;
        var c = actions.querySelector(".seipro-anot-count");
        c.textContent = cur >= max ? "limite atingido" : max - cur + " restantes";
        c.style.color = cur >= max ? "#d33" : "#888";
      }
      var autoSaveTimer = null;
      editor.addEventListener("input", function() {
        updateCount();
        updateDirtyIndicator();
        if (autoSaveTimer) clearTimeout(autoSaveTimer);
        if (editor.getAttribute("contenteditable") === "true") {
          autoSaveTimer = setTimeout(function() {
            if (isDirty()) {
              log("anotacao: auto-save");
              doSave({ keepEditing: true, caretOffset: getCaretCharOffset(editor) });
            }
          }, 5e3);
        }
      });
      editor.addEventListener("mouseup", saveEditorSelection);
      editor.addEventListener("keyup", saveEditorSelection);
      editor.addEventListener("keydown", function(ev) {
        if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
          ev.preventDefault();
          doSave();
        } else if ((ev.ctrlKey || ev.metaKey) && (ev.key === "s" || ev.key === "S")) {
          ev.preventDefault();
          doSave({ keepEditing: true });
        } else if (ev.key === "Escape") {
          ev.preventDefault();
          anotDomFromLine(editor, editor.dataset.original);
          setMode(false);
        }
      });
      editor.addEventListener("paste", function(ev) {
        ev.preventDefault();
        var text = (ev.clipboardData || win.clipboardData).getData("text/plain");
        doc.execCommand("insertText", false, text);
      });
      actions.addEventListener("mousedown", function() {
        saveEditorSelection();
      });
      actions.addEventListener("click", function(ev) {
        var btn = ev.target.closest("[data-act]");
        if (!btn) return;
        var act = btn.dataset.act;
        log("anotacao action:", act);
        if (act === "edit") {
          setMode(true);
          updateCount();
          return;
        }
        if (act === "cancel") {
          anotDomFromLine(editor, editor.dataset.original);
          setMode(false);
          return;
        }
        if (act === "save") {
          doSave();
          return;
        }
        if (act === "remove") {
          toggleRemoveConfirm(true);
          return;
        }
        if (act === "remove-cancel") {
          toggleRemoveConfirm(false);
          return;
        }
        if (act === "remove-confirm") {
          doRemove();
          return;
        }
        if (act === "prio") {
          togglePriority();
          return;
        }
        if (act === "preset-chefia") {
          applyPresetText("Aguardando a assinatura da chefia imediata");
          return;
        }
        if (act === "preset-superintendente") {
          applyPresetText("Aguardando a assinatura do superintendente");
          return;
        }
        if (act === "check") {
          toggleChecklistOnSelection();
          return;
        }
        if (act === "date") {
          toggleDateInput();
          return;
        }
      });
      editor.addEventListener("click", function(ev) {
        if (editor.getAttribute("contenteditable") === "true") return;
        var line = ev.target.closest("div");
        if (!line || line === editor) return;
        if (!line.classList.contains("stickNoteCheck")) return;
        line.classList.toggle("stickNoteChecked");
        var newLine = anotLineFromDom(editor);
        persist(newLine, editor.dataset.priority === "1", "check");
      });
      editor.addEventListener("dblclick", function(ev) {
        if (editor.getAttribute("contenteditable") === "true") return;
        setMode(true);
        updateCount();
        try {
          var range = doc.caretRangeFromPoint ? doc.caretRangeFromPoint(ev.clientX, ev.clientY) : null;
          if (range) {
            var sel = doc.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          } else {
            placeCaretAtEnd(editor);
          }
        } catch (e) {
          placeCaretAtEnd(editor);
        }
      });
      function toggleRemoveConfirm(show) {
        actions.querySelector("[data-act=remove]").style.display = show ? "none" : "";
        actions.querySelector("[data-act=remove-confirm]").style.display = show ? "" : "none";
        actions.querySelector("[data-act=remove-cancel]").style.display = show ? "" : "none";
      }
      function togglePriority() {
        var newPri = editor.dataset.priority !== "1";
        if (editor.getAttribute("contenteditable") === "true") {
          editor.dataset.priority = newPri ? "1" : "0";
          actions.querySelector("[data-act=prio]").style.color = newPri ? "#d33" : "#888";
          editor.style.borderLeft = newPri ? "3px solid #d33" : "";
        } else {
          persist(editor.dataset.original, newPri, "priority");
        }
      }
      function applyPresetText(text) {
        var base = editor.getAttribute("contenteditable") === "true" ? anotLineFromDom(editor) : editor.dataset.original || "";
        base = base ? base.replace(/\s+$/, "") : "";
        var next = base ? base + "\n" + text : text;
        persist(next.slice(0, 500), editor.dataset.priority === "1", "preset", false);
      }
      function toggleChecklistOnSelection() {
        if (!restoreEditorSelection()) saveEditorSelection();
        var sel = doc.getSelection();
        var line = null;
        if (sel && sel.anchorNode) {
          line = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentNode;
        }
        if (!line || line === editor || !editor.contains(line)) {
          line = editor.querySelector("div");
        }
        while (line && line.parentNode !== editor) line = line.parentNode;
        if (!line) return;
        if (line.classList.contains("stickNoteChecked")) {
          line.classList.remove("stickNoteChecked", "stickNoteCheck");
        } else if (line.classList.contains("stickNoteCheck")) {
          line.classList.add("stickNoteChecked");
        } else {
          line.classList.add("stickNoteCheck");
        }
      }
      function toggleDateInput() {
        var input = actions.querySelector(".seipro-anot-date-input");
        if (input.style.display === "none") {
          input.style.display = "";
          input.value = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
          input.focus();
        } else {
          input.style.display = "none";
          var v = input.value;
          if (!v) return;
          var parts = v.split("-");
          var formatted = parts[2] + "/" + parts[1] + "/" + parts[0];
          if (editor.getAttribute("contenteditable") !== "true") setMode(true);
          var sel = doc.getSelection();
          if (sel && editor.contains(sel.anchorNode)) doc.execCommand("insertText", false, " " + formatted);
          else {
            editor.appendChild(doc.createTextNode(" " + formatted));
          }
          editor.focus();
        }
      }
      function doSave(opts2) {
        opts2 = opts2 || {};
        var line = anotLineFromDom(editor).slice(0, 500);
        persist(line, editor.dataset.priority === "1", "save", opts2.keepEditing, opts2.caretOffset);
      }
      function doRemove() {
        persist("", false, "remove", false);
      }
      function persist(line, priority, kind, keepEditing, caretOffset) {
        actions.querySelectorAll("i").forEach(function(i) {
          i.style.pointerEvents = "none";
          i.style.opacity = "0.5";
        });
        saveAnotacaoToServer(url, line, priority, function() {
          log("infoarvore_anotacoes: " + kind + " ok (priority=" + priority + ", len=" + line.length + ")");
          buildAnotUI(url, line, priority, { justSaved: true, keepEditing, caretOffset });
        }, function(e) {
          actions.querySelectorAll("i").forEach(function(i) {
            i.style.pointerEvents = "";
            i.style.opacity = "";
          });
          report("infoarvore_anotacoes: " + kind + " failed", { error: e.message, kind });
          alert("Falha ao salvar anota\xE7\xE3o: " + e.message);
        });
      }
      updateCount();
      if (opts.keepEditing) {
        setMode(true);
        if (typeof opts.caretOffset === "number" && opts.caretOffset >= 0) setCaretCharOffset(editor, opts.caretOffset);
        else placeCaretAtEnd(editor);
      }
    }
    var _caret = createCaret({ doc, win });
    function placeCaretAtEnd(el) {
      return _caret.placeCaretAtEnd(el);
    }
    function getCaretCharOffset(el) {
      return _caret.getCaretCharOffset(el);
    }
    function setCaretCharOffset(el, target) {
      return _caret.setCaretCharOffset(el, target);
    }
    function decorateReadonly(editor) {
      var today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      Array.prototype.forEach.call(editor.children, function(div) {
        if (!div.textContent) return;
        var txt = div.textContent;
        var dm = txt.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
        if (dm) {
          var d = new Date(+dm[3], +dm[2] - 1, +dm[1]);
          if (!isNaN(d) && d < today) {
            div.style.background = "#fac3c4";
            div.title = "Data vencida";
          }
        }
        var pnRe = /(\d{5}\.?\d{6}\/?\d{4}-?\d{2})/g;
        if (pnRe.test(txt)) {
          var walker = doc.createTreeWalker(div, NodeFilter.SHOW_TEXT, null, false);
          var targets = [];
          while (walker.nextNode()) targets.push(walker.currentNode);
          targets.forEach(function(node) {
            var parts = node.nodeValue.split(/(\d{5}\.?\d{6}\/?\d{4}-?\d{2})/g);
            if (parts.length < 2) return;
            var frag = doc.createDocumentFragment();
            parts.forEach(function(part) {
              if (/^\d{5}\.?\d{6}\/?\d{4}-?\d{2}$/.test(part)) {
                var a = doc.createElement("a");
                a.href = win.location.origin + win.location.pathname.replace(/\/sei\/.*$/, "/sei/") + "#" + part;
                a.target = "_blank";
                a.textContent = part;
                a.style.color = "#0066cc";
                frag.appendChild(a);
              } else {
                frag.appendChild(doc.createTextNode(part));
              }
            });
            node.parentNode.replaceChild(frag, node);
          });
        }
      });
    }
  }

  // src/features/arvore-info/index.js
  (function(win, doc) {
    "use strict";
    if (win.__SEI_PRO_TREE_BOOT__) {
      console.warn("[SeiProTree] already booted \u2014 skipping");
      return;
    }
    win.__SEI_PRO_TREE_BOOT__ = true;
    var TAG = "[SeiProTree]";
    var DONE_ATTR = "data-seipro-done";
    var TREE_ROOT_SEL = "body.infraArvore";
    var TREE_READY_GATE_SEL = "#divArvore";
    var ANCHOR_SEL = 'a.infraArvoreNo[target="ifrConteudoVisualizacao"], a.infraArvoreNo[target="ifrVisualizacao"]';
    var PARENT_READY_TIMEOUT = 6e3;
    var TREE_READY_TIMEOUT = 2e4;
    function log() {
      console.log.apply(console, [TAG].concat([].slice.call(arguments)));
    }
    function warn() {
      console.warn.apply(console, [TAG].concat([].slice.call(arguments)));
    }
    function err() {
      console.error.apply(console, [TAG].concat([].slice.call(arguments)));
    }
    function reportContext() {
      var ctx = { url: "", frame: "", idProc: "", host: "" };
      try {
        ctx.url = (win.location && win.location.href || "").split("?")[0];
        ctx.frame = win.name || "" || (win === win.top ? "top" : "iframe");
        ctx.host = win.location && win.location.hostname || "";
        var m = (win.location && win.location.href || "").match(/[?&]id_procedimento=(\d+)/);
        if (m) ctx.idProc = m[1];
      } catch (e) {
      }
      return ctx;
    }
    function report(reason, detail) {
      var ctx = reportContext();
      console.error.call(console, TAG, "[REPORT]", reason, "| ctx=" + JSON.stringify(ctx) + (detail !== void 0 ? " | detail=" + (typeof detail === "string" ? detail : JSON.stringify(detail)) : ""));
    }
    function normalizeMojibakeUtf8(value) {
      var core = win.SeiPro && win.SeiPro.core && win.SeiPro.core.texto;
      if (core && typeof core.normalizeMojibakeUtf8 === "function") {
        return core.normalizeMojibakeUtf8(value);
      }
      value = typeof value === "string" ? value : "";
      if (!value) return value;
      if (!/(?:[\u00C2\u00C3][\u0080-\u00BF]|\u00E2[\u0080-\u00BF]{2})/.test(value)) {
        return value;
      }
      try {
        return decodeURIComponent(escape(value));
      } catch (err2) {
        if (typeof TextDecoder !== "undefined" && typeof Uint8Array !== "undefined") {
          try {
            return new TextDecoder("utf-8").decode(Uint8Array.from(value, function(ch) {
              return ch.charCodeAt(0);
            }));
          } catch (err22) {
          }
        }
      }
      return value;
    }
    function waitFor(name, predicate, root, timeoutMs) {
      return new Promise(function(resolve, reject) {
        var v = predicate();
        if (v) {
          log(name, "ready (sync)");
          return resolve(v);
        }
        var timer = setTimeout(function() {
          mo.disconnect();
          err(name, "timeout after", timeoutMs, "ms");
          reject(new Error(name + " timeout"));
        }, timeoutMs);
        var mo = new MutationObserver(function() {
          var r = predicate();
          if (r) {
            clearTimeout(timer);
            mo.disconnect();
            log(name, "ready (observed)");
            resolve(r);
          }
        });
        mo.observe(root || doc.documentElement, { childList: true, subtree: true });
      });
    }
    function treeReady() {
      return waitFor("treeReady", function() {
        var root = doc.querySelector(TREE_ROOT_SEL);
        if (!root) return null;
        var gate = doc.querySelector(TREE_READY_GATE_SEL);
        if (gate && !gate.querySelector(ANCHOR_SEL)) return null;
        if (!root.querySelector(ANCHOR_SEL)) return null;
        return root;
      }, null, TREE_READY_TIMEOUT);
    }
    function stubParent() {
      return {
        __stub: true,
        checkConfigValue: function() {
          return true;
        },
        verifyConfigValue: function() {
          return false;
        }
      };
    }
    function parentReady() {
      var start = Date.now();
      try {
        if (win.parent && win.parent.SeiProReady && typeof win.parent.SeiProReady.then === "function") {
          return win.parent.SeiProReady.then(function() {
            log("parentReady via SeiProReady promise after", Date.now() - start, "ms");
            return win.parent;
          });
        }
      } catch (e) {
        warn("parentReady cross-origin error, using stub:", e.message);
        return Promise.resolve(stubParent());
      }
      try {
        if (win.parent && win.parent.document && !win.parent.document.getElementById("ifrArvore")) {
          log("parentReady: parent is not trabalhar context \u2014 using stub (silent degrade)");
          return Promise.resolve(stubParent());
        }
      } catch (e) {
        log("parentReady: parent inaccessible (cross-origin) \u2014 using stub");
        return Promise.resolve(stubParent());
      }
      try {
        if (win.parent && typeof win.parent.checkConfigValue === "function") {
          log("parentReady via checkConfigValue s\xEDncrono (sem SeiProReady, sem polling)");
          return Promise.resolve(win.parent);
        }
      } catch (e) {
        warn("parentReady cross-origin error, using stub:", e.message);
        return Promise.resolve(stubParent());
      }
      warn("parent.SeiProReady missing \u2014 polling for checkConfigValue (250ms intervals, timeout=" + PARENT_READY_TIMEOUT + "ms)");
      return new Promise(function(resolve) {
        (function probe() {
          try {
            if (win.parent && typeof win.parent.checkConfigValue === "function") {
              log("parentReady via fallback probe after", Date.now() - start, "ms");
              return resolve(win.parent);
            }
          } catch (e) {
            warn("parentReady cross-origin in probe, using stub:", e.message);
            return resolve(stubParent());
          }
          if (Date.now() - start > PARENT_READY_TIMEOUT) {
            warn("parentReady timeout after", PARENT_READY_TIMEOUT, "ms \u2014 degrading to stub parent (panels still mount, user prefs ignored)");
            return resolve(stubParent());
          }
          setTimeout(probe, 250);
        })();
      });
    }
    var features = [];
    function register(feature) {
      if (!feature || !feature.id || typeof feature.enrich !== "function") {
        err("register: invalid feature", feature);
        return;
      }
      features.push(feature);
    }
    win.SeiProTree = { register, features };
    var PROCESSED_KEYS = win.__SEI_PRO_TREE_PROCESSED_KEYS__ || (win.__SEI_PRO_TREE_PROCESSED_KEYS__ = /* @__PURE__ */ Object.create(null));
    function hasDone(el, id) {
      return (el.getAttribute(DONE_ATTR) || "").split(" ").indexOf(id) !== -1;
    }
    function markDone(el, id) {
      var cur = el.getAttribute(DONE_ATTR) || "";
      el.setAttribute(DONE_ATTR, cur ? cur + " " + id : id);
    }
    function anchorKey(el) {
      if (!el) return "";
      return [
        el.getAttribute("id") || "",
        el.getAttribute("href") || "",
        el.getAttribute("target") || ""
      ].join("|");
    }
    function isProcessed(el) {
      var key = anchorKey(el);
      return !!(key && PROCESSED_KEYS[key]);
    }
    function markProcessed(el) {
      var key = anchorKey(el);
      if (key) PROCESSED_KEYS[key] = true;
    }
    function runPipeline(ctx, anchors, label) {
      var applied = {};
      for (var i = 0; i < features.length; i++) {
        var f = features[i];
        if (!ctx.enabled[f.id]) continue;
        applied[f.id] = 0;
      }
      for (var j = 0; j < anchors.length; j++) {
        var a = anchors[j];
        if (isProcessed(a)) continue;
        for (var i2 = 0; i2 < features.length; i2++) {
          var f2 = features[i2];
          if (!ctx.enabled[f2.id]) continue;
          if (hasDone(a, f2.id)) continue;
          try {
            f2.enrich(a, ctx);
            markDone(a, f2.id);
            applied[f2.id] = (applied[f2.id] || 0) + 1;
          } catch (e) {
            err("feature", f2.id, "threw on", a.id, e);
          }
        }
        markProcessed(a);
      }
      log("pipeline", label || "", "\u2014 anchors:", anchors.length, "applied:", applied);
    }
    function observeTree(root, onBatch) {
      var pending = false;
      var queued = /* @__PURE__ */ new Set();
      var mo = new MutationObserver(function(records) {
        for (var i = 0; i < records.length; i++) {
          var r = records[i];
          for (var j = 0; j < r.addedNodes.length; j++) {
            var n = r.addedNodes[j];
            if (n.nodeType !== 1) continue;
            if (n.matches && n.matches(ANCHOR_SEL)) queued.add(n);
            if (n.querySelectorAll) n.querySelectorAll(ANCHOR_SEL).forEach(function(a) {
              queued.add(a);
            });
          }
        }
        if (pending || queued.size === 0) return;
        pending = true;
        requestAnimationFrame(function() {
          pending = false;
          var batch = Array.from(queued);
          queued.clear();
          batch = batch.filter(function(a) {
            return !isProcessed(a);
          });
          if (batch.length === 0) return;
          log("observer batch \u2014", batch.length, "new anchor(s)");
          onBatch(batch);
        });
      });
      mo.observe(root, { childList: true, subtree: true });
      return mo;
    }
    Promise.all([treeReady(), parentReady()]).then(function(r) {
      var root = r[0], parent = r[1];
      var enabled = features.reduce(function(acc, f) {
        try {
          acc[f.id] = f.enabled ? !!f.enabled(parent) : true;
        } catch (e) {
          err("feature.enabled threw for", f.id, e);
          acc[f.id] = false;
        }
        if (!acc[f.id]) log("feature disabled:", f.id);
        return acc;
      }, {});
      var ctx = { parent, enabled };
      features.forEach(function(f) {
        if (ctx.enabled[f.id] && typeof f.initOnce === "function") {
          try {
            f.initOnce(ctx);
          } catch (e) {
            err("initOnce threw for", f.id, e);
          }
        }
      });
      runPipeline(ctx, Array.from(root.querySelectorAll(ANCHOR_SEL)), "initial");
      observeTree(root, function(batch) {
        runPipeline(ctx, batch, "incremental");
      });
      try {
        win.parent.dispatchEvent(new win.parent.CustomEvent("sei-pro-arvore-ready", {
          detail: { href: win.location.href, loop: false, anchors: root.querySelectorAll(ANCHOR_SEL).length, features: Object.keys(enabled).filter(function(k) {
            return enabled[k];
          }) }
        }));
      } catch (e) {
        warn("could not dispatch sei-pro-arvore-ready:", e.message);
      }
    }).catch(function(e) {
      err("boot aborted:", e.message);
    });
    register({
      id: "duaslinhas",
      enabled: function(p) {
        return typeof p.verifyConfigValue === "function" && p.verifyConfigValue("duaslinhas");
      },
      enrich: function(a) {
        if (a.nextElementSibling && a.nextElementSibling.classList.contains("breackline_doc")) return;
        var text = a.textContent.trim();
        var idx = text.lastIndexOf(" ");
        if (idx === -1) return;
        var tail = text.slice(idx + 1);
        if (!tail) return;
        var span = doc.createElement("span");
        span.className = "breackline_doc";
        span.innerHTML = '<br><span style="font-size:9pt;opacity:0.75">' + tail.replace(/[<>&]/g, function(c) {
          return { "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c];
        }) + "</span>";
        a.textContent = text.slice(0, idx);
        a.parentNode.insertBefore(span, a.nextSibling);
      }
    });
    register({
      id: "numerar_documentos",
      enabled: function(p) {
        return typeof p.verifyConfigValue === "function" && p.verifyConfigValue("numerar_documentos");
      },
      initOnce: function() {
        this._counter = 0;
      },
      enrich: function(a) {
        if (a.previousElementSibling && a.previousElementSibling.classList.contains("numericDocsPro")) return;
        this._counter = (this._counter || 0) + 1;
        var span = doc.createElement("span");
        span.className = "numericDocsPro";
        span.setAttribute("data-count", String(this._counter));
        span.textContent = this._counter + ". ";
        span.style.opacity = "0.6";
        span.style.fontSize = "0.85em";
        a.parentNode.insertBefore(span, a);
      }
    });
    register({
      id: "urgente",
      enabled: function() {
        return true;
      },
      enrich: function(a) {
        if (a.textContent.indexOf("(URGENTE)") === -1) return;
        a.classList.add("urgentePro");
        if (a.querySelector("div.urgentePro")) return;
        var d = doc.createElement("div");
        d.className = "urgentePro";
        a.insertBefore(d, a.firstChild);
      }
    });
    register({
      id: "tag",
      enrich: function(a) {
        a.classList.add("seipro-tagged");
      }
    });
    var io = createIo({ win, log, warn, err });
    var fetchPage = io.fetchPage;
    var invalidatePage = io.invalidatePage;
    var submitForm = io.submitForm;
    win.SeiProTree.fetchPage = fetchPage;
    var _toolbarLinksCache = null;
    function getToolbarLinks() {
      if (_toolbarLinksCache) return _toolbarLinksCache;
      var links = [];
      var scripts = doc.querySelectorAll("script:not([src])");
      for (var i = 0; i < scripts.length; i++) {
        var t = scripts[i].textContent || "";
        var html = extractNosAcoesHtml(t);
        if (html === null) continue;
        var tmp = doc.createElement("div");
        tmp.innerHTML = html;
        var anchors = tmp.querySelectorAll('a[href*="controlador.php?acao="]');
        for (var j = 0; j < anchors.length; j++) {
          var href = anchors[j].getAttribute("href");
          if (!href || href === "#") continue;
          var img = anchors[j].querySelector("img");
          links.push({ name: img ? img.getAttribute("title") : "", url: href });
        }
        break;
      }
      if (!links.length && win.Nos && win.Nos[0] && win.Nos[0].acoes) {
        var tmp2 = doc.createElement("div");
        tmp2.innerHTML = win.Nos[0].acoes;
        var anchors2 = tmp2.querySelectorAll('a[href*="controlador.php?acao="]');
        for (var k = 0; k < anchors2.length; k++) {
          var href2 = anchors2[k].getAttribute("href");
          if (!href2 || href2 === "#") continue;
          var img2 = anchors2[k].querySelector("img");
          links.push({ name: img2 ? img2.getAttribute("title") : "", url: href2 });
        }
        if (links.length) log("toolbar links from window.Nos fallback:", links.length);
      }
      if (!links.length) {
        report('getToolbarLinks: no action links found \u2014 Nos[0].acoes missing or unparseable. Panel sections depending on toolbar links will show "(indispon\xEDvel)".');
      }
      _toolbarLinksCache = links;
      log("toolbar links parsed:", links.length);
      return links;
    }
    function findToolbarLink(hrefFragment) {
      var links = getToolbarLinks();
      for (var i = 0; i < links.length; i++) {
        if (links[i].url && links[i].url.indexOf(hrefFragment) !== -1) return links[i].url;
      }
      var a = doc.querySelector('a[href*="' + hrefFragment + '"]');
      return a ? a.href : null;
    }
    register({
      id: "infoarvore",
      enabled: function(p) {
        return typeof p.checkConfigValue === "function" && p.checkConfigValue("infoarvore");
      },
      initOnce: function(ctx) {
        var p = ctx.parent;
        var frmArvore = doc.getElementById("frmArvore") || doc.getElementById("divConsultarAndamento") && doc.getElementById("divConsultarAndamento").parentNode || doc.body;
        if (!frmArvore) {
          report("infoarvore: no mount target found \u2014 panel cannot mount");
          return;
        }
        log("infoarvore: mount target =", frmArvore.id || frmArvore.tagName);
        if (frmArvore.querySelector(".panelDadosArvore")) {
          log("infoarvore: panel already mounted \u2014 skip");
          return;
        }
        var sectionLabels = {
          "responsaveis": "Atribui\xE7\xE3o",
          "marcador": "Marcador",
          "interessados": "Interessados",
          "anotacoes": "Anota\xE7\xF5es",
          "acompanhamento_especial": "Acompanhamento Especial",
          "tipo_procedimento": "Tipo de Procedimento",
          "nivel_acesso": "N\xEDvel de Acesso",
          "assuntos": "Assuntos",
          "observacoes": "Observa\xE7\xF5es"
        };
        var enabledSet = (function() {
          var raw2 = null;
          try {
            raw2 = typeof win.localStorageRestorePro === "function" ? win.localStorageRestorePro("configViewFlashPanelArvorePro") : null;
          } catch (e) {
          }
          if (!raw2 || Array.isArray(raw2) && raw2.length === 0) return null;
          var s = {};
          raw2.forEach(function(entry) {
            var n = Array.isArray(entry) ? entry[0] : entry;
            if (n) s[n] = true;
          });
          return s;
        })();
        function sectionEnabled(type) {
          if (!enabledSet) return true;
          var label = sectionLabels[type];
          return label ? !!enabledSet[label] : true;
        }
        log("infoarvore: section filter =", enabledSet ? Object.keys(enabledSet).join(",") : "all (default)");
        var responsaveis = [];
        var scripts = doc.querySelectorAll("script:not([src])");
        for (var i = 0; i < scripts.length; i++) {
          var txt = scripts[i].textContent || "";
          var raw = extractNosHtml(txt);
          if (raw === null) continue;
          raw.split("<br />").forEach(function(frag) {
            var tmp = doc.createElement("div");
            tmp.innerHTML = frag;
            var text = tmp.textContent.trim();
            if (text) responsaveis.push({ text, unassigned: isAtribuicaoUnassigned(text, tmp.querySelector("a.ancoraSigla")) });
          });
          break;
        }
        log("infoarvore: parsed", responsaveis.length, "respons\xE1vel(is) from inline scripts");
        var atribSection = createAtribuicaoSection({
          doc,
          win,
          findToolbarLink,
          fetchPage,
          invalidatePage,
          submitViaIframe,
          log,
          err,
          report
        });
        var panel = doc.createElement("div");
        panel.className = "panelDadosArvore";
        panel.dataset.type = "responsaveis";
        panel.innerHTML = '<label class="newLink panelArvoreHead" style="margin-bottom:10px;display:block;">  <i class="fas fa-user-tie azulColor iconDadosProcesso"></i> Atribui\xE7\xE3o:  <i class="fas fa-chevron-down azulColor seipro-toggle" style="float:right;cursor:pointer;margin-right:20px;"></i></label><div class="infoDadosArvore"></div>';
        var body = panel.querySelector(".infoDadosArvore");
        atribSection.renderRows(body, responsaveis);
        var marcPanel = doc.createElement("div");
        marcPanel.className = "panelDadosArvore";
        marcPanel.dataset.type = "marcador";
        marcPanel.innerHTML = '<label class="newLink panelArvoreHead" style="margin-bottom:10px;display:block;">  <i class="fas fa-bookmark azulColor iconDadosProcesso"></i> Marcador:  <i class="fas fa-chevron-down azulColor seipro-toggle" style="float:right;cursor:pointer;margin-right:20px;"></i></label><div class="infoDadosArvore seipro-marcador-body"><span style="opacity:0.6">carregando\u2026</span></div>';
        var intPanel = doc.createElement("div");
        intPanel.className = "panelDadosArvore";
        intPanel.dataset.type = "interessados";
        intPanel.innerHTML = '<label class="newLink panelArvoreHead" style="margin-bottom:10px;display:block;">  <i class="fas fa-users azulColor iconDadosProcesso"></i> Interessados:  <i class="fas fa-chevron-down azulColor seipro-toggle" style="float:right;cursor:pointer;margin-right:20px;"></i></label><div class="infoDadosArvore seipro-interessados-body"><span style="opacity:0.6">carregando\u2026</span></div>';
        function mkSection(type, icon, title, bodyClass) {
          var el = doc.createElement("div");
          el.className = "panelDadosArvore";
          el.dataset.type = type;
          el.innerHTML = '<label class="newLink panelArvoreHead" style="margin-bottom:10px;display:block;">  <i class="fas ' + icon + ' azulColor iconDadosProcesso"></i> ' + title + '  <i class="fas fa-chevron-down azulColor seipro-toggle" style="float:right;cursor:pointer;margin-right:20px;"></i></label><div class="infoDadosArvore ' + bodyClass + '"><span style="opacity:0.6">carregando\u2026</span></div>';
          return el;
        }
        var anotPanel = mkSection("anotacoes", "fa-sticky-note", "Anota\xE7\xE3o:", "seipro-anot-body");
        var acompPanel = mkSection("acompanhamento_especial", "fa-eye", "Acompanhamento Especial:", "seipro-acomp-body");
        var tipoPanel = mkSection("tipo_procedimento", "fa-inbox", "Tipo de Processo:", "seipro-tipo-body");
        var acessoPanel = mkSection("nivel_acesso", "fa-lock", "N\xEDvel de Acesso:", "seipro-acesso-body");
        var assuntosPanel = mkSection("assuntos", "fa-bookmark", "Assuntos:", "seipro-assuntos-body");
        var obsPanel = mkSection("observacoes", "fa-comment-alt", "Observa\xE7\xF5es desta unidade:", "seipro-obs-body");
        [anotPanel, panel, marcPanel, acompPanel, tipoPanel, intPanel, acessoPanel, assuntosPanel, obsPanel].forEach(function(p2) {
          if (sectionEnabled(p2.dataset.type)) frmArvore.appendChild(p2);
        });
        log("infoarvore: panel mounted (" + frmArvore.querySelectorAll(".panelDadosArvore").length + " sections)");
        var refreshers = {};
        var sectionRefreshMap = {
          responsaveis: "responsaveis",
          marcador: "marcador",
          tipo_procedimento: "consulta",
          nivel_acesso: "consulta",
          interessados: "consulta",
          assuntos: "consulta",
          observacoes: "consulta",
          acompanhamento_especial: "acomp",
          anotacoes: "anotacoes",
          consulta: "consulta",
          acomp: "acomp"
        };
        function resolveRefreshKey(name) {
          return sectionRefreshMap[name] || name;
        }
        function refreshAll(reason) {
          var names = Object.keys(refreshers);
          log("infoarvore: refreshing (" + (reason || "manual") + ") \u2014 " + names.length + " section(s)");
          names.forEach(function(n) {
            try {
              refreshers[n]();
            } catch (e) {
              err("refresh " + n + ":", e.message);
            }
          });
        }
        function refreshSection(name, reason) {
          var key = resolveRefreshKey(name);
          if (!refreshers[key]) {
            report("refreshSection: no refresher named " + name + " (resolved=" + key + ")");
            return;
          }
          log("infoarvore: refreshing " + name + " -> " + key + " (" + (reason || "manual") + ")");
          try {
            refreshers[key]();
          } catch (e) {
            err("refresh " + key + ":", e.message);
          }
        }
        function addHeadBtn(panel2, mode, icon, title, extraData) {
          var head = panel2.querySelector(".panelArvoreHead");
          var a = doc.createElement("a");
          a.className = "newLink seipro-edit";
          a.style.cssText = "cursor:pointer;float:right;margin-right:8px;";
          a.dataset.mode = mode;
          a.title = title || "Editar";
          a.innerHTML = '<i class="fas ' + icon + '"></i>';
          if (extraData) Object.keys(extraData).forEach(function(k) {
            a.dataset[k] = extraData[k];
          });
          head.appendChild(a);
          return a;
        }
        frmArvore.addEventListener("click", function(ev) {
          var t = ev.target;
          var toggle = t.closest && t.closest(".seipro-toggle");
          if (toggle) {
            var pn = toggle.closest(".panelDadosArvore");
            var bd = pn && pn.querySelector(".infoDadosArvore");
            if (!bd) return;
            var hidden = bd.style.display === "none";
            bd.style.display = hidden ? "" : "none";
            toggle.classList.toggle("fa-chevron-down", hidden);
            toggle.classList.toggle("fa-chevron-right", !hidden);
            return;
          }
          var editA = t.closest && t.closest(".seipro-edit");
          if (editA) {
            ev.preventDefault();
            ev.stopPropagation();
            var mode = editA.dataset.mode;
            log("edit click: mode=" + mode);
            if (mode === "responsaveis") {
              atribSection.editInline(panel);
              return;
            }
            if (mode === "marcador") {
              var marcGerUrl = findToolbarLink("andamento_marcador_gerenciar");
              if (!marcGerUrl) {
                err("inline marcador: toolbar link missing");
                return;
              }
              var fields = [
                { kind: "select", label: "Marcador", srcSelector: "#selMarcador", name: "selMarcador" },
                { kind: "textarea", label: "Observa\xE7\xE3o (opcional)", srcSelector: "#txaTexto", name: "txaTexto" }
              ];
              invalidatePage(marcGerUrl);
              fetchPage(marcGerUrl).then(function(docM) {
                var addUrl = marcGerUrl;
                if (!docM.querySelector("#selMarcador")) {
                  var btnAdd = docM.querySelector("#btnAdicionar");
                  var oc = btnAdd && btnAdd.getAttribute("onclick") || "";
                  var m = oc.match(/['"]([^'"]*controlador\.php[^'"]*acao=andamento_marcador_cadastrar[^'"]*)['"]/);
                  if (m) {
                    try {
                      addUrl = new URL(m[1], p.location.href).href;
                    } catch (e) {
                      addUrl = m[1];
                    }
                    log("marcador: using add URL from btnAdicionar");
                  } else {
                    err("marcador: could not extract add URL from listing");
                    return;
                  }
                }
                openInlineEditor(marcPanel, addUrl, fields, function() {
                  refreshSection("marcador", "post-add");
                });
              }).catch(function(e) {
                err("marcador prefetch:", e.message);
              });
              return;
            }
            if (mode === "tipo_procedimento") {
              editTipoInline(tipoPanel);
              return;
            }
            if (mode === "acompanhamento_especial") {
              editAcompInline(acompPanel);
              return;
            }
            err('edit: unhandled mode "' + mode + '" \u2014 no inline editor');
            return;
          }
          var copyA = t.closest && t.closest(".seipro-copy");
          if (copyA) {
            var text = copyA.textContent.trim();
            if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function(e) {
              err("clipboard:", e.message);
            });
            else if (typeof p.copyTextThis === "function") p.copyTextThis(copyA);
          }
        });
        var atribText = responsaveis[0] && responsaveis[0].text || "";
        addHeadBtn(panel, "responsaveis", "fa-edit", "Editar atribui\xE7\xE3o", { text: atribText });
        addHeadBtn(marcPanel, "marcador", "fa-edit", "Editar marcador");
        addHeadBtn(acompPanel, "acompanhamento_especial", "fa-edit", "Editar acompanhamento especial");
        addHeadBtn(tipoPanel, "tipo_procedimento", "fa-edit", "Editar tipo de processo");
        function submitViaIframe(url, valuesOrFn) {
          return new Promise(function(resolve, reject) {
            var hostDoc = p.document;
            var ifr = hostDoc.createElement("iframe");
            ifr.style.cssText = "display:none;position:absolute;width:0;height:0;border:0;";
            ifr.id = "seipro-submit-frame-" + Date.now();
            ifr.setAttribute("sandbox", "allow-same-origin allow-forms allow-scripts allow-modals");
            var loads = 0;
            var timeout = setTimeout(function() {
              try {
                ifr.remove();
              } catch (e) {
              }
              reject(new Error("submitViaIframe: timeout"));
            }, 15e3);
            ifr.addEventListener("load", function() {
              loads++;
              if (loads === 1) {
                try {
                  var ifrDoc = ifr.contentDocument;
                  var ifrWin2 = ifr.contentWindow;
                  if (typeof valuesOrFn === "function") {
                    try {
                      ifrWin2.confirm = function() {
                        return true;
                      };
                    } catch (_) {
                    }
                    valuesOrFn(ifrWin2, ifrDoc);
                  } else {
                    var values = valuesOrFn;
                    Object.keys(values).forEach(function(id) {
                      if (id.indexOf("sel") === 0) {
                        var hdnId = "hdnId" + id.replace("sel", "");
                        var hdn = ifrDoc.getElementById(hdnId);
                        if (hdn) {
                          hdn.value = values[id];
                        }
                      }
                      var el = ifrDoc.getElementById(id);
                      if (!el) {
                        return;
                      }
                      if (el.tagName === "SELECT") {
                        el.value = values[id];
                      } else if (el.type === "checkbox" || el.type === "radio") {
                        el.checked = !!values[id];
                      } else {
                        el.value = values[id];
                      }
                    });
                    var submitBtn = ifrDoc.querySelector("button[type=submit], input[type=submit]") || ifrDoc.querySelector("#sbmSalvar") || ifrDoc.querySelector("button[name=btnSalvar], input[name=btnSalvar]") || ifrDoc.querySelector("button[name=sbmSalvar], input[name=sbmSalvar]");
                    if (!submitBtn) throw new Error("no submit button in form");
                    submitBtn.click();
                  }
                } catch (e) {
                  clearTimeout(timeout);
                  try {
                    ifr.remove();
                  } catch (_) {
                  }
                  reject(e);
                }
              } else {
                clearTimeout(timeout);
                try {
                  ifr.remove();
                } catch (e) {
                }
                resolve();
              }
            });
            ifr.src = url;
            hostDoc.body.appendChild(ifr);
          });
        }
        function openInlineEditor(panel2, formUrl, fields, onSaved) {
          var body2 = panel2.querySelector(".infoDadosArvore");
          var savedHTML = body2.innerHTML;
          body2.innerHTML = '<span style="opacity:0.6">carregando formul\xE1rio\u2026</span>';
          invalidatePage(formUrl);
          fetchPage(formUrl).then(function(docA) {
            var wrap = doc.createElement("div");
            wrap.style.cssText = "display:flex;flex-direction:column;gap:6px;";
            var inputs = {};
            fields.forEach(function(f) {
              var src = docA.querySelector(f.srcSelector);
              if (!src) {
                report("inline editor: missing source field in fetched form", { selector: f.srcSelector, formUrl });
                return;
              }
              var label = doc.createElement("label");
              label.textContent = f.label;
              label.style.cssText = "font-size:11px;opacity:0.7;";
              wrap.appendChild(label);
              var el;
              if (f.kind === "select") {
                el = doc.createElement("select");
                el.style.cssText = "width:100%;padding:4px;";
                Array.prototype.forEach.call(src.options, function(o) {
                  var opt = doc.createElement("option");
                  opt.value = o.value;
                  opt.textContent = o.text;
                  if (o.selected) opt.selected = true;
                  el.appendChild(opt);
                });
              } else {
                el = doc.createElement("textarea");
                el.style.cssText = "width:100%;padding:4px;min-height:50px;";
                el.value = src.value || src.textContent || "";
              }
              wrap.appendChild(el);
              inputs[f.name] = el;
            });
            var btnRow = doc.createElement("div");
            btnRow.style.cssText = "display:flex;gap:6px;justify-content:flex-end;margin-top:4px;";
            var btnCancel = doc.createElement("button");
            btnCancel.type = "button";
            btnCancel.className = "newLink";
            btnCancel.textContent = "Cancelar";
            btnCancel.style.cssText = "cursor:pointer;padding:2px 10px;";
            var btnSave = doc.createElement("button");
            btnSave.type = "button";
            btnSave.className = "newLink";
            btnSave.textContent = "Salvar";
            btnSave.style.cssText = "cursor:pointer;padding:2px 10px;";
            btnRow.appendChild(btnCancel);
            btnRow.appendChild(btnSave);
            wrap.appendChild(btnRow);
            body2.innerHTML = "";
            body2.appendChild(wrap);
            btnCancel.addEventListener("click", function() {
              body2.innerHTML = savedHTML;
            });
            btnSave.addEventListener("click", function() {
              btnSave.disabled = true;
              btnCancel.disabled = true;
              btnSave.textContent = "salvando\u2026";
              var values = {};
              Object.keys(inputs).forEach(function(k) {
                values[k] = inputs[k].value;
              });
              submitViaIframe(formUrl, values).then(function() {
                log("inline editor saved:", Object.keys(values).join(","));
                setTimeout(function() {
                  try {
                    onSaved && onSaved();
                  } catch (e) {
                    err("onSaved:", e.message);
                  }
                }, 400);
              }).catch(function(e) {
                err("inline submit:", e.message);
                body2.innerHTML = savedHTML;
                report("inline editor: submit failed \u2014 reverted to previous value");
              });
            });
          }).catch(function(e) {
            err("inline fetch:", e.message);
            body2.innerHTML = savedHTML;
          });
        }
        function editTipoInline(panel2) {
          var url = findToolbarLink("procedimento_alterar");
          if (!url) {
            report("inline tipo: toolbar link missing \u2014 edit Tipo de Processo disabled", { sought: "procedimento_alterar" });
            return;
          }
          openInlineEditor(panel2, url, [
            { kind: "select", label: "Tipo de Processo", srcSelector: "#selTipoProcedimento", name: "selTipoProcedimento" }
          ], function() {
            refreshSection("tipo_procedimento", "post-edit tipo");
          });
        }
        function editAcompInline(panel2) {
          var gerUrl = findToolbarLink("acompanhamento_gerenciar");
          if (!gerUrl) {
            report("inline acomp: toolbar link missing \u2014 edit Acompanhamento Especial disabled", { sought: "acompanhamento_gerenciar" });
            return;
          }
          var fields = [
            { kind: "select", label: "Grupo", srcSelector: "#selGrupoAcompanhamento", name: "selGrupoAcompanhamento" },
            { kind: "textarea", label: "Observa\xE7\xE3o", srcSelector: "#txaObservacao", name: "txaObservacao" }
          ];
          invalidatePage(gerUrl);
          fetchPage(gerUrl).then(function(docA) {
            var addUrl = gerUrl;
            if (!docA.querySelector("#selGrupoAcompanhamento")) {
              var btnAdd = docA.querySelector("#btnAdicionar");
              var oc = btnAdd && btnAdd.getAttribute("onclick") || "";
              var m = oc.match(/['"]([^'"]*controlador\.php[^'"]*acao=acompanhamento_cadastrar[^'"]*)['"]/);
              if (m) {
                try {
                  addUrl = new URL(m[1], p.location.href).href;
                } catch (e) {
                  addUrl = m[1];
                }
                log("acomp: using add URL from btnAdicionar");
              } else {
                err("acomp: could not extract add URL from listing");
                return;
              }
            }
            openInlineEditor(panel2, addUrl, fields, function() {
              refreshSection("acomp", "post-add");
            });
          }).catch(function(e) {
            err("acomp prefetch:", e.message);
          });
        }
        function editNivelInline_unused(panel2) {
          var url = findToolbarLink("procedimento_alterar");
          if (!url) {
            err("inline nivel: toolbar link missing");
            return;
          }
          var body2 = panel2.querySelector(".infoDadosArvore");
          var savedHTML = body2.innerHTML;
          body2.innerHTML = '<span style="opacity:0.6">carregando\u2026</span>';
          invalidatePage(url);
          fetchPage(url).then(function(docF) {
            var current = "1";
            ["optPublico", "optRestrito", "optSigiloso"].forEach(function(id) {
              var r = docF.getElementById(id);
              if (r && r.checked) current = r.value;
            });
            var wrap = doc.createElement("div");
            wrap.style.cssText = "display:flex;flex-direction:column;gap:6px;";
            var sel = doc.createElement("select");
            sel.style.cssText = "width:100%;padding:4px;";
            [["0", "P\xFAblico"], ["1", "Restrito"]].forEach(function(it) {
              var opt = doc.createElement("option");
              opt.value = it[0];
              opt.textContent = it[1];
              if (it[0] === current) opt.selected = true;
              sel.appendChild(opt);
            });
            var btnRow = doc.createElement("div");
            btnRow.style.cssText = "display:flex;gap:6px;justify-content:flex-end;margin-top:4px;";
            var btnCancel = doc.createElement("button");
            btnCancel.type = "button";
            btnCancel.className = "newLink";
            btnCancel.textContent = "Cancelar";
            btnCancel.style.cssText = "cursor:pointer;padding:2px 10px;";
            var btnSave = doc.createElement("button");
            btnSave.type = "button";
            btnSave.className = "newLink";
            btnSave.textContent = "Salvar";
            btnSave.style.cssText = "cursor:pointer;padding:2px 10px;";
            btnRow.appendChild(btnCancel);
            btnRow.appendChild(btnSave);
            wrap.appendChild(sel);
            wrap.appendChild(btnRow);
            body2.innerHTML = "";
            body2.appendChild(wrap);
            btnCancel.addEventListener("click", function() {
              body2.innerHTML = savedHTML;
            });
            btnSave.addEventListener("click", function() {
              btnSave.disabled = true;
              btnCancel.disabled = true;
              btnSave.textContent = "salvando\u2026";
              var newVal = sel.value;
              submitViaIframe(url, function(w, d2) {
                var idMap = { "0": "optPublico", "1": "optRestrito", "2": "optSigiloso" };
                var radio = d2.getElementById(idMap[newVal]);
                if (radio) {
                  radio.checked = true;
                  try {
                    radio.dispatchEvent(new w.Event("change", { bubbles: true }));
                  } catch (_) {
                  }
                } else {
                  warn("nivel: radio not found for value " + newVal);
                }
                var btn = d2.querySelector("button[type=submit], input[type=submit]") || d2.querySelector("#sbmSalvar") || d2.querySelector("button[name=btnSalvar], input[name=btnSalvar]") || d2.querySelector("button[name=sbmSalvar], input[name=sbmSalvar]");
                if (btn) btn.click();
                else err("nivel: submit button not found");
              }).then(function() {
                log("inline nivel: saved");
                refreshSection("consulta", "post-edit nivel");
              }).catch(function(e) {
                err("inline nivel submit:", e.message);
                body2.innerHTML = savedHTML;
              });
            });
          }).catch(function(e) {
            err("inline nivel fetch:", e.message);
            body2.innerHTML = savedHTML;
          });
        }
        installMarcadorSection({
          doc,
          marcPanel,
          findToolbarLink,
          fetchPage,
          invalidatePage,
          submitViaIframe,
          refreshSection,
          refreshers,
          sectionEnabled,
          log,
          warn,
          err,
          report
        });
        installConsultaSection({
          doc,
          intPanel,
          tipoPanel,
          acessoPanel,
          assuntosPanel,
          obsPanel,
          findToolbarLink,
          fetchPage,
          invalidatePage,
          refreshers,
          sectionEnabled,
          log,
          warn,
          report
        });
        installAcompanhamentoSection({
          doc,
          acompPanel,
          findToolbarLink,
          getToolbarLinks,
          fetchPage,
          invalidatePage,
          submitViaIframe,
          refreshSection,
          refreshers,
          sectionEnabled,
          log,
          warn,
          err,
          report
        });
        installAnotacaoSection({
          doc,
          win,
          fetchPage,
          invalidatePage,
          submitForm,
          refreshers,
          sectionEnabled,
          anotPanel,
          findToolbarLink,
          log,
          warn,
          err,
          report,
          normalizeMojibakeUtf8
        });
      },
      enrich: function() {
      }
    });
  })(window, document);
})();
