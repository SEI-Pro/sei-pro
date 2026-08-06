(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/core/global.js
  var globalRef = typeof window !== "undefined" ? window : globalThis;
  function getSeiPro() {
    globalRef.SeiPro = globalRef.SeiPro || {};
    globalRef.SeiPro.core = globalRef.SeiPro.core || {};
    globalRef.SeiPro.sei = globalRef.SeiPro.sei || {};
    globalRef.SeiPro.features = globalRef.SeiPro.features || {};
    globalRef.SeiPro.state = globalRef.SeiPro.state || {};
    return globalRef.SeiPro;
  }
  function aliasGlobal(name, value) {
    if (typeof globalRef[name] === "undefined") {
      globalRef[name] = value;
    }
  }

  // src/core/serial.js
  function isJson(str2) {
    try {
      JSON.parse(str2);
    } catch (e) {
      return false;
    }
    return true;
  }

  // src/features/projetos/domain/datas.js
  var EMPTY = "0000-00-00 00:00:00";
  var EMPTY_DATE = "0000-00-00";
  function isEmptyDate(value) {
    if (value == null || value === "") return true;
    const s = String(value).trim();
    return s === EMPTY || s === EMPTY_DATE || s.startsWith("0000-00-00");
  }
  function parseDate(value) {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
    }
    if (value == null || value === "") return null;
    if (typeof value === "number") {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    const s = String(value).trim();
    if (isEmptyDate(s)) return null;
    const local = s.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (local) {
      return new Date(+local[1], +local[2] - 1, +local[3], +local[4], +local[5], +(local[6] || 0));
    }
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (m) {
      return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
    }
    const br = s.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (br) {
      return new Date(+br[3], +br[2] - 1, +br[1], +(br[4] || 0), +(br[5] || 0), +(br[6] || 0));
    }
    const fallback = new Date(s);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }
  function pad(n, w = 2) {
    return String(n).padStart(w, "0");
  }
  function formatDateTime(value) {
    const d = parseDate(value);
    if (!d) return EMPTY;
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }
  function formatDate(value) {
    const d = parseDate(value);
    if (!d) return "";
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function formatDateTimeLocal(value) {
    const d = parseDate(value);
    if (!d) return "";
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }
  function formatDisplay(value, withTime = false) {
    const d = parseDate(value);
    if (!d) return "";
    const base = pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
    if (!withTime) return base;
    return base + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }
  function today() {
    const n = /* @__PURE__ */ new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function startOfDay(value) {
    const d = parseDate(value);
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function addDays(value, days) {
    const d = parseDate(value);
    if (!d) return null;
    const out = new Date(d.getTime());
    out.setDate(out.getDate() + days);
    return out;
  }
  function diffDays(start, end) {
    const a = startOfDay(start);
    const b = startOfDay(end);
    if (!a || !b) return 0;
    return Math.round((b.getTime() - a.getTime()) / 864e5);
  }
  function isSameDay(a, b) {
    const x = startOfDay(a);
    const y = startOfDay(b);
    if (!x || !y) return false;
    return x.getTime() === y.getTime();
  }
  function minDate(a, b) {
    const x = parseDate(a);
    const y = parseDate(b);
    if (!x) return y;
    if (!y) return x;
    return x.getTime() <= y.getTime() ? x : y;
  }
  function maxDate(a, b) {
    const x = parseDate(a);
    const y = parseDate(b);
    if (!x) return y;
    if (!y) return x;
    return x.getTime() >= y.getTime() ? x : y;
  }
  function emptyDateSentinel() {
    return EMPTY;
  }

  // src/features/projetos/domain/model.js
  var _seq = 1;
  function nextLocalId(prefix = "") {
    return Number(String(Date.now()).slice(-8) + String(_seq++).padStart(3, "0"));
  }
  function resetLocalIdSeq() {
    _seq = 1;
  }
  function num(v, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  function str(v, fallback = "") {
    return v == null ? fallback : String(v);
  }
  function bool(v, fallback = true) {
    if (v == null) return fallback;
    if (typeof v === "boolean") return v;
    if (v === "true" || v === 1 || v === "1") return true;
    if (v === "false" || v === 0 || v === "0") return false;
    return !!v;
  }
  function normalizePredecessoras(etapa) {
    if (Array.isArray(etapa.predecessoras) && etapa.predecessoras.length) {
      return etapa.predecessoras.map((p) => ({
        id_etapa: num(p.id_etapa),
        tipo: ["FS", "SS", "FF", "SF"].includes(p.tipo) ? p.tipo : "FS",
        lag_dias: num(p.lag_dias, 0)
      })).filter((p) => p.id_etapa);
    }
    const dep = num(etapa.id_dependencia, 0);
    if (dep) return [{ id_etapa: dep, tipo: "FS", lag_dias: 0 }];
    return [];
  }
  function normalizeEtapa(raw = {}, idProjeto = 0) {
    const id_etapa = num(raw.id_etapa) || nextLocalId("e");
    const predecessoras = normalizePredecessoras(raw);
    const id_dependencia = predecessoras.length ? predecessoras[0].id_etapa : num(raw.id_dependencia, 0) || false;
    return {
      id_etapa,
      id_projeto: num(raw.id_projeto, idProjeto) || idProjeto,
      nome_etapa: str(raw.nome_etapa, "Nova etapa"),
      id_dependencia,
      predecessoras,
      data_inicio_programado: isEmptyDate(raw.data_inicio_programado) ? emptyDateSentinel() : formatDateTime(raw.data_inicio_programado),
      data_fim_programado: isEmptyDate(raw.data_fim_programado) ? emptyDateSentinel() : formatDateTime(raw.data_fim_programado),
      data_inicio_execucao: isEmptyDate(raw.data_inicio_execucao) ? emptyDateSentinel() : formatDateTime(raw.data_inicio_execucao),
      data_fim_execucao: isEmptyDate(raw.data_fim_execucao) ? emptyDateSentinel() : formatDateTime(raw.data_fim_execucao),
      data_inicio_progresso_automatico: isEmptyDate(raw.data_inicio_progresso_automatico) ? emptyDateSentinel() : formatDateTime(raw.data_inicio_progresso_automatico),
      data_fim_progresso_automatico: isEmptyDate(raw.data_fim_progresso_automatico) ? emptyDateSentinel() : formatDateTime(raw.data_fim_progresso_automatico),
      progresso_execucao: Math.max(0, Math.min(100, num(raw.progresso_execucao, 0))),
      macroetapa: str(raw.macroetapa),
      responsavel: str(raw.responsavel),
      grupo: str(raw.grupo),
      etiqueta: str(raw.etiqueta),
      checklist: Array.isArray(raw.checklist) ? raw.checklist : raw.checklist || [],
      observacoes: str(raw.observacoes),
      documento_relacionado: str(raw.documento_relacionado),
      id_documento_sei: raw.id_documento_sei || false,
      documento_sei: str(raw.documento_sei),
      id_demandas: raw.id_demandas || [],
      id_demandas_titles: raw.id_demandas_titles || [],
      data_pausa: isEmptyDate(raw.data_pausa) ? emptyDateSentinel() : formatDateTime(raw.data_pausa),
      data_retomada: isEmptyDate(raw.data_retomada) ? emptyDateSentinel() : formatDateTime(raw.data_retomada),
      marco: bool(raw.marco, false),
      calendario: raw.calendario === "util" ? "util" : "corrido"
    };
  }
  function normalizeProjeto(raw = {}) {
    const id_projeto = num(raw.id_projeto) || nextLocalId("p");
    const etapas = Array.isArray(raw.etapas) ? raw.etapas.map((e) => normalizeEtapa(e, id_projeto)) : [];
    return {
      id_projeto,
      nome_projeto: str(raw.nome_projeto, "Novo projeto"),
      id_tipo_projeto: num(raw.id_tipo_projeto, 0),
      nome_tipo_projeto: str(raw.nome_tipo_projeto),
      processo_sei: raw.processo_sei || false,
      id_procedimento: raw.id_procedimento || false,
      ativo: bool(raw.ativo, true),
      sigla_unidade: str(raw.sigla_unidade),
      id_unidade: num(raw.id_unidade, 0),
      etapas,
      projetos_compartilhados: Array.isArray(raw.projetos_compartilhados) ? raw.projetos_compartilhados : []
    };
  }
  function defaultStore() {
    return {
      version: 1,
      projetos: [],
      tipos_projetos: [],
      updated_at: formatDateTime(/* @__PURE__ */ new Date())
    };
  }
  function findProjeto(projetos, id) {
    const idn = num(id);
    return (projetos || []).find((p) => p.id_projeto === idn) || null;
  }
  function findEtapa(projeto, idEtapa) {
    if (!projeto || !Array.isArray(projeto.etapas)) return null;
    const idn = num(idEtapa);
    return projeto.etapas.find((e) => e.id_etapa === idn) || null;
  }
  function cloneProjetoDeep(projeto, overrides = {}) {
    const base = normalizeProjeto(JSON.parse(JSON.stringify(projeto || {})));
    const id_projeto = overrides.id_projeto || nextLocalId("p");
    base.id_projeto = id_projeto;
    if (overrides.nome_projeto) base.nome_projeto = overrides.nome_projeto;
    else base.nome_projeto = (base.nome_projeto || "Projeto") + " (copia)";
    const idMap = /* @__PURE__ */ new Map();
    base.etapas = base.etapas.map((e) => {
      const novo = nextLocalId("e");
      idMap.set(e.id_etapa, novo);
      return { ...e, id_etapa: novo, id_projeto };
    });
    base.etapas = base.etapas.map((e) => {
      const pred = (e.predecessoras || []).map((p) => ({
        ...p,
        id_etapa: idMap.get(p.id_etapa) || p.id_etapa
      }));
      return {
        ...e,
        predecessoras: pred,
        id_dependencia: pred.length ? pred[0].id_etapa : false
      };
    });
    base.ativo = true;
    return base;
  }
  function validateEtapaDates(etapa) {
    const start = parseDate(etapa.data_inicio_programado);
    const end = parseDate(etapa.data_fim_programado);
    if (!start || !end) return { ok: false, error: "Datas programadas obrigatorias" };
    if (end.getTime() < start.getTime()) return { ok: false, error: "Fim anterior ao inicio" };
    return { ok: true };
  }
  function tiposFromProjetos(projetos) {
    const map = /* @__PURE__ */ new Map();
    for (const p of projetos || []) {
      if (p.id_tipo_projeto && !map.has(p.id_tipo_projeto)) {
        map.set(p.id_tipo_projeto, {
          id_tipo_projeto: p.id_tipo_projeto,
          nome_tipo_projeto: p.nome_tipo_projeto || String(p.id_tipo_projeto)
        });
      }
    }
    return [...map.values()];
  }

  // src/features/projetos/seed.js
  function buildDemoProjetos(now = today()) {
    const t0 = addDays(now, -14);
    const p1 = normalizeProjeto({
      id_projeto: 9001,
      nome_projeto: "Demo \u2014 Modernizacao SEI Pro",
      id_tipo_projeto: 1,
      nome_tipo_projeto: "Interno",
      ativo: true,
      sigla_unidade: "DEMO",
      etapas: [
        {
          id_etapa: 1,
          nome_etapa: "Levantamento de requisitos",
          macroetapa: "Planejamento",
          responsavel: "Ana",
          grupo: "Produto",
          data_inicio_programado: formatDateTime(t0),
          data_fim_programado: formatDateTime(addDays(t0, 4)),
          data_inicio_execucao: formatDateTime(t0),
          data_fim_execucao: formatDateTime(addDays(t0, 5)),
          progresso_execucao: 100,
          calendario: "util"
        },
        {
          id_etapa: 2,
          nome_etapa: "Arquitetura e prototipo",
          macroetapa: "Planejamento",
          responsavel: "Bruno",
          id_dependencia: 1,
          predecessoras: [{ id_etapa: 1, tipo: "FS", lag_dias: 0 }],
          data_inicio_programado: formatDateTime(addDays(t0, 5)),
          data_fim_programado: formatDateTime(addDays(t0, 12)),
          progresso_execucao: 60,
          data_inicio_progresso_automatico: formatDateTime(addDays(t0, 5)),
          data_fim_progresso_automatico: formatDateTime(addDays(t0, 12)),
          calendario: "util"
        },
        {
          id_etapa: 3,
          nome_etapa: "Migracao do modulo Projetos",
          macroetapa: "Execucao",
          responsavel: "Ana",
          id_dependencia: 2,
          predecessoras: [{ id_etapa: 2, tipo: "FS", lag_dias: 0 }],
          data_inicio_programado: formatDateTime(addDays(t0, 13)),
          data_fim_programado: formatDateTime(addDays(t0, 27)),
          progresso_execucao: 35,
          calendario: "util"
        },
        {
          id_etapa: 4,
          nome_etapa: "Marco \u2014 Go-live interno",
          macroetapa: "Entrega",
          responsavel: "Bruno",
          marco: true,
          id_dependencia: 3,
          predecessoras: [{ id_etapa: 3, tipo: "FS", lag_dias: 0 }],
          data_inicio_programado: formatDateTime(addDays(t0, 28)),
          data_fim_programado: formatDateTime(addDays(t0, 28)),
          progresso_execucao: 0,
          calendario: "util"
        },
        {
          id_etapa: 5,
          nome_etapa: "Documentacao e smoke test",
          macroetapa: "Entrega",
          responsavel: "Carla",
          id_dependencia: 3,
          predecessoras: [{ id_etapa: 3, tipo: "SS", lag_dias: 2 }],
          data_inicio_programado: formatDateTime(addDays(t0, 20)),
          data_fim_programado: formatDateTime(addDays(t0, 30)),
          progresso_execucao: 10,
          calendario: "corrido"
        }
      ]
    });
    const p2 = normalizeProjeto({
      id_projeto: 9002,
      nome_projeto: "Demo \u2014 Capacitacao da equipe",
      id_tipo_projeto: 2,
      nome_tipo_projeto: "Capacitacao",
      ativo: true,
      sigla_unidade: "DEMO",
      etapas: [
        {
          id_etapa: 11,
          nome_etapa: "Material de apoio",
          macroetapa: "Preparacao",
          responsavel: "Carla",
          data_inicio_programado: formatDateTime(addDays(now, -7)),
          data_fim_programado: formatDateTime(addDays(now, 3)),
          progresso_execucao: 80
        },
        {
          id_etapa: 12,
          nome_etapa: "Oficina pratica",
          macroetapa: "Execucao",
          responsavel: "Ana",
          id_dependencia: 11,
          predecessoras: [{ id_etapa: 11, tipo: "FS", lag_dias: 1 }],
          data_inicio_programado: formatDateTime(addDays(now, 4)),
          data_fim_programado: formatDateTime(addDays(now, 5)),
          progresso_execucao: 0
        }
      ]
    });
    return [p1, p2];
  }
  function demoTipos() {
    return [
      { id_tipo_projeto: 1, nome_tipo_projeto: "Interno" },
      { id_tipo_projeto: 2, nome_tipo_projeto: "Capacitacao" }
    ];
  }

  // src/features/projetos/store.js
  var STORE_KEY = "configDataProjetosPro";
  var storeState = null;
  var storeLastRaw = null;
  function getStoreProjetos() {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw === storeLastRaw && storeState !== null) return storeState;
    const parsed = raw && isJson(raw) ? JSON.parse(raw) : false;
    if (parsed && Array.isArray(parsed.projetos)) {
      storeState = {
        version: parsed.version || 1,
        projetos: parsed.projetos.map((p) => normalizeProjeto(p)),
        tipos_projetos: parsed.tipos_projetos || tiposFromProjetos(parsed.projetos),
        updated_at: parsed.updated_at || formatDateTime(/* @__PURE__ */ new Date()),
        seeded: !!parsed.seeded
      };
    } else {
      storeState = defaultStore();
    }
    storeLastRaw = raw;
    return storeState;
  }
  function persistStoreProjetos(store) {
    storeState = store || getStoreProjetos();
    storeState.updated_at = formatDateTime(/* @__PURE__ */ new Date());
    storeLastRaw = JSON.stringify(storeState);
    localStorage.setItem(STORE_KEY, storeLastRaw);
    return storeState;
  }
  function ensureDemoSeed(force = false) {
    const store = getStoreProjetos();
    if (!force && store.projetos.length > 0) return store;
    if (!force && store.seeded) return store;
    store.projetos = buildDemoProjetos();
    store.tipos_projetos = demoTipos();
    store.seeded = true;
    return persistStoreProjetos(store);
  }
  function listProjetos() {
    return getStoreProjetos().projetos.slice();
  }
  function replaceProjetos(projetos, tipos) {
    const store = getStoreProjetos();
    store.projetos = (projetos || []).map((p) => normalizeProjeto(p));
    if (tipos) store.tipos_projetos = tipos;
    else store.tipos_projetos = tiposFromProjetos(store.projetos);
    return persistStoreProjetos(store);
  }
  function ok(return_row, extra = {}) {
    return { status: 1, return_row, ...extra };
  }
  function err(msg) {
    return { status: 0, status_txt: msg || "Erro ao processar projeto" };
  }
  function dispatchProjetoAction(param = {}) {
    const action = param.action;
    const store = getStoreProjetos();
    if (action === "save_projeto") {
      const projeto = normalizeProjeto({
        id_projeto: 0,
        nome_projeto: param.nome_projeto,
        id_tipo_projeto: param.id_tipo_projeto,
        nome_tipo_projeto: param.nome_tipo_projeto,
        processo_sei: param.processo_sei,
        id_procedimento: param.id_procedimento,
        ativo: true,
        sigla_unidade: param.sigla_unidade || "",
        etapas: []
      });
      projeto.id_projeto = nextLocalId("p");
      store.projetos.push(projeto);
      store.tipos_projetos = tiposFromProjetos(store.projetos);
      persistStoreProjetos(store);
      return ok([projeto], { id_projeto: projeto.id_projeto });
    }
    if (action === "edit_projeto") {
      const p = findProjeto(store.projetos, param.id_projeto);
      if (!p) return err("Projeto nao encontrado");
      p.nome_projeto = param.nome_projeto || p.nome_projeto;
      p.id_tipo_projeto = param.id_tipo_projeto != null ? Number(param.id_tipo_projeto) : p.id_tipo_projeto;
      p.nome_tipo_projeto = param.nome_tipo_projeto || p.nome_tipo_projeto;
      p.processo_sei = param.processo_sei !== void 0 ? param.processo_sei : p.processo_sei;
      p.id_procedimento = param.id_procedimento !== void 0 ? param.id_procedimento : p.id_procedimento;
      persistStoreProjetos(store);
      return ok([p], { id_projeto: p.id_projeto });
    }
    if (action === "save_etapa" || action === "save_projeto_etapa") {
      const p = findProjeto(store.projetos, param.id_projeto);
      if (!p) return err("Projeto nao encontrado");
      const etapa = normalizeEtapa({
        ...param,
        id_etapa: 0,
        id_projeto: p.id_projeto
      }, p.id_projeto);
      etapa.id_etapa = nextLocalId("e");
      const v = validateEtapaDates(etapa);
      if (!v.ok) return err(v.error);
      p.etapas.push(etapa);
      persistStoreProjetos(store);
      return ok([p], { id_projeto: p.id_projeto, id_etapa: etapa.id_etapa });
    }
    if (action === "update_projeto_etapa" || action === "edit_etapa") {
      const p = findProjeto(store.projetos, param.id_projeto);
      if (!p) return err("Projeto nao encontrado");
      const e = findEtapa(p, param.id_etapa);
      if (!e) return err("Etapa nao encontrada");
      const fields = [
        "nome_etapa",
        "id_dependencia",
        "predecessoras",
        "data_inicio_programado",
        "data_fim_programado",
        "data_inicio_execucao",
        "data_fim_execucao",
        "data_inicio_progresso_automatico",
        "data_fim_progresso_automatico",
        "progresso_execucao",
        "macroetapa",
        "responsavel",
        "grupo",
        "etiqueta",
        "checklist",
        "observacoes",
        "documento_relacionado",
        "id_documento_sei",
        "documento_sei",
        "id_demandas",
        "marco",
        "calendario",
        "data_pausa",
        "data_retomada"
      ];
      for (const f of fields) {
        if (param[f] !== void 0) e[f] = param[f];
      }
      const normalized = normalizeEtapa(e, p.id_projeto);
      Object.assign(e, normalized);
      persistStoreProjetos(store);
      return ok([p], { id_projeto: p.id_projeto, id_etapa: e.id_etapa });
    }
    if (action === "delete_projeto_etapa") {
      const p = findProjeto(store.projetos, param.id_projeto);
      if (!p) return err("Projeto nao encontrado");
      p.etapas = p.etapas.filter((e) => e.id_etapa !== Number(param.id_etapa));
      persistStoreProjetos(store);
      return ok([p], { id_projeto: p.id_projeto });
    }
    if (action === "delete_projeto") {
      store.projetos = store.projetos.filter((p) => p.id_projeto !== Number(param.id_projeto));
      persistStoreProjetos(store);
      return ok([], { id_projeto: param.id_projeto });
    }
    if (action === "clone_projeto") {
      const p = findProjeto(store.projetos, param.id_projeto);
      if (!p) return err("Projeto nao encontrado");
      const clone = cloneProjetoDeep(p);
      store.projetos.push(clone);
      persistStoreProjetos(store);
      return ok([clone], { id_projeto: clone.id_projeto });
    }
    if (action === "archive_projeto") {
      const p = findProjeto(store.projetos, param.id_projeto);
      if (!p) return err("Projeto nao encontrado");
      p.ativo = param.ativo != null ? !!param.ativo : !p.ativo;
      persistStoreProjetos(store);
      return ok([p], { id_projeto: p.id_projeto });
    }
    if (action === "share_projeto") {
      const p = findProjeto(store.projetos, param.id_projeto);
      if (!p) return err("Projeto nao encontrado");
      p.projetos_compartilhados = Array.isArray(param.projetos_compartilhados) ? param.projetos_compartilhados : p.projetos_compartilhados || [];
      persistStoreProjetos(store);
      return ok([p], { id_projeto: p.id_projeto });
    }
    if (action === "import_projeto") {
      try {
        const projeto = normalizeProjeto(param.projeto || param);
        projeto.id_projeto = nextLocalId("p");
        store.projetos.push(projeto);
        persistStoreProjetos(store);
        return ok([projeto], { id_projeto: projeto.id_projeto });
      } catch (e) {
        return err(e.message || "Falha ao importar");
      }
    }
    return err("Acao desconhecida: " + action);
  }
  function installProjetosStore() {
    const ns2 = getSeiPro().features.projetos || (getSeiPro().features.projetos = {});
    ns2.store = {
      getStoreProjetos,
      persistStoreProjetos,
      ensureDemoSeed,
      listProjetos,
      replaceProjetos,
      dispatchProjetoAction
    };
    return ns2.store;
  }
  var LOCAL_CAPACIDADES = [
    "view_projetos",
    "save_projeto",
    "edit_projeto",
    "save_projeto_etapa",
    "update_projeto_etapa",
    "delete_projeto",
    "delete_projeto_etapa",
    "clone_projeto",
    "archive_projeto",
    "share_projeto"
  ];
  function hasLocalCapacidade(name) {
    return LOCAL_CAPACIDADES.includes(name);
  }

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
  function on(target, type, selectorOrHandler, maybeHandler) {
    const delegated = typeof selectorOrHandler === "string";
    const selector = delegated ? selectorOrHandler : null;
    const handler = delegated ? maybeHandler : selectorOrHandler;
    function listener(event) {
      if (!delegated) {
        return handler.call(target, event);
      }
      const match = event.target && event.target.closest ? event.target.closest(selector) : null;
      if (match && target.contains(match)) {
        return handler.call(match, event, match);
      }
    }
    target.addEventListener(type, listener);
    return function off() {
      target.removeEventListener(type, listener);
    };
  }
  function ready(fn) {
    if (typeof document === "undefined") {
      fn();
      return;
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      setTimeout(fn, 0);
    }
  }

  // src/shared/ui/tabs.js
  function createTabs(root, opts = {}) {
    if (!root) throw new Error("createTabs: root required");
    const o = Object.assign({ onChange: null, selected: null }, opts);
    let tablist = root.querySelector('[role="tablist"]');
    const panels = [];
    if (Array.isArray(o.items) && o.items.length) {
      root.innerHTML = "";
      root.classList.add("seipro-tabs");
      tablist = document.createElement("div");
      tablist.setAttribute("role", "tablist");
      tablist.className = "seipro-tabs__list";
      root.appendChild(tablist);
      o.items.forEach((item, i) => {
        const tab = document.createElement("button");
        tab.type = "button";
        tab.setAttribute("role", "tab");
        tab.id = "seipro-tab-" + item.id;
        tab.setAttribute("aria-controls", "seipro-panel-" + item.id);
        tab.setAttribute("aria-selected", i === 0 ? "true" : "false");
        tab.tabIndex = i === 0 ? 0 : -1;
        tab.className = "seipro-tabs__tab";
        tab.textContent = item.label;
        tab.dataset.tabId = String(item.id);
        tablist.appendChild(tab);
        const panel = document.createElement("div");
        panel.setAttribute("role", "tabpanel");
        panel.id = "seipro-panel-" + item.id;
        panel.setAttribute("aria-labelledby", tab.id);
        panel.className = "seipro-tabs__panel";
        panel.hidden = i !== 0;
        if (typeof item.content === "string") panel.innerHTML = item.content;
        else if (item.content instanceof Node) panel.appendChild(item.content);
        root.appendChild(panel);
        panels.push(panel);
      });
    } else {
      root.classList.add("seipro-tabs");
      if (!tablist) {
        tablist = document.createElement("div");
        tablist.setAttribute("role", "tablist");
        tablist.className = "seipro-tabs__list";
        root.insertBefore(tablist, root.firstChild);
      }
      root.querySelectorAll('[role="tabpanel"]').forEach((p) => panels.push(p));
    }
    const tabs = () => [...tablist.querySelectorAll('[role="tab"]')];
    function select(id) {
      const idStr = String(id);
      tabs().forEach((tab) => {
        const on2 = tab.dataset.tabId === idStr || tab.getAttribute("aria-controls") === "seipro-panel-" + idStr;
        tab.setAttribute("aria-selected", on2 ? "true" : "false");
        tab.tabIndex = on2 ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on2;
      });
      if (typeof o.onChange === "function") o.onChange(idStr);
    }
    function onKey(ev) {
      const list = tabs();
      const i = list.indexOf(ev.target);
      if (i < 0) return;
      let next = i;
      if (ev.key === "ArrowRight") next = (i + 1) % list.length;
      else if (ev.key === "ArrowLeft") next = (i - 1 + list.length) % list.length;
      else if (ev.key === "Home") next = 0;
      else if (ev.key === "End") next = list.length - 1;
      else return;
      ev.preventDefault();
      list[next].focus();
      select(list[next].dataset.tabId);
    }
    function onClick(ev) {
      const tab = ev.target.closest('[role="tab"]');
      if (!tab || !tablist.contains(tab)) return;
      select(tab.dataset.tabId);
    }
    tablist.addEventListener("click", onClick);
    tablist.addEventListener("keydown", onKey);
    const initial = o.selected || tabs()[0] && tabs()[0].dataset.tabId;
    if (initial) select(initial);
    return {
      select,
      selected: () => {
        const t = tabs().find((x) => x.getAttribute("aria-selected") === "true");
        return t ? t.dataset.tabId : null;
      },
      destroy() {
        tablist.removeEventListener("click", onClick);
        tablist.removeEventListener("keydown", onKey);
      }
    };
  }

  // src/features/projetos/domain/calendario.js
  function easterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = (h + l - 7 * m + 114) % 31 + 1;
    return new Date(year, month - 1, day);
  }
  function holidayEntry(date, label) {
    return { date: startOfDay(date), label, iso: formatDate(date) };
  }
  function holidaysBr(year) {
    const easter = easterSunday(year);
    return [
      holidayEntry(new Date(year, 0, 1), "Ano Novo"),
      holidayEntry(addDays(easter, -48), "Carnaval"),
      holidayEntry(addDays(easter, -47), "Carnaval"),
      holidayEntry(addDays(easter, -2), "Paixao de Cristo"),
      holidayEntry(easter, "Pascoa"),
      holidayEntry(new Date(year, 3, 21), "Tiradentes"),
      holidayEntry(addDays(easter, 60), "Corpus Christi"),
      holidayEntry(new Date(year, 4, 1), "Dia do Trabalho"),
      holidayEntry(new Date(year, 8, 7), "Independencia"),
      holidayEntry(new Date(year, 9, 12), "Nossa Senhora Aparecida"),
      holidayEntry(new Date(year, 10, 2), "Finados"),
      holidayEntry(new Date(year, 10, 15), "Proclamacao da Republica"),
      holidayEntry(new Date(year, 10, 20), "Consciencia Negra"),
      holidayEntry(new Date(year, 11, 25), "Natal")
    ];
  }
  function holidaysBetween(start, end, extra = []) {
    const a = startOfDay(start);
    const b = startOfDay(end);
    if (!a || !b) return [];
    const from = a.getTime() <= b.getTime() ? a : b;
    const to = a.getTime() <= b.getTime() ? b : a;
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    for (let y = from.getFullYear(); y <= to.getFullYear(); y++) {
      for (const h of holidaysBr(y)) {
        if (h.date.getTime() >= from.getTime() && h.date.getTime() <= to.getTime() && !seen.has(h.iso)) {
          seen.add(h.iso);
          out.push(h);
        }
      }
    }
    for (const e of extra || []) {
      const d = parseDate(e.date || e.feriado_data || e);
      if (!d) continue;
      const iso = formatDate(d);
      if (d.getTime() >= from.getTime() && d.getTime() <= to.getTime() && !seen.has(iso)) {
        seen.add(iso);
        out.push(holidayEntry(d, e.label || e.nome_feriado || e.dia || "Feriado"));
      }
    }
    return out.sort((x, y) => x.date - y.date);
  }
  function isWeekend(date) {
    const d = startOfDay(date);
    if (!d) return false;
    const day = d.getDay();
    return day === 0 || day === 6;
  }
  function isHoliday(date, holidayList) {
    const d = startOfDay(date);
    if (!d) return false;
    const iso = formatDate(d);
    return (holidayList || []).some((h) => (h.iso || formatDate(h.date || h)) === iso);
  }
  function isBusinessDay(date, holidayList) {
    return !isWeekend(date) && !isHoliday(date, holidayList);
  }
  function nextBusinessDay(date, holidayList) {
    let d = startOfDay(date);
    if (!d) return null;
    let guard = 0;
    while (!isBusinessDay(d, holidayList) && guard < 3660) {
      d = addDays(d, 1);
      guard++;
    }
    return d;
  }
  function addBusinessDays(start, n, holidayList) {
    let d = nextBusinessDay(start, holidayList);
    if (!d) return null;
    const steps = Math.max(0, Math.floor(n));
    for (let i = 0; i < steps; i++) {
      d = nextBusinessDay(addDays(d, 1), holidayList);
    }
    return d;
  }
  function countBusinessDays(start, end, holidayList) {
    let a = startOfDay(start);
    let b = startOfDay(end);
    if (!a || !b) return 0;
    if (a.getTime() > b.getTime()) {
      const t = a;
      a = b;
      b = t;
    }
    let count = 0;
    let cur = a;
    while (cur.getTime() <= b.getTime()) {
      if (isBusinessDay(cur, holidayList)) count++;
      cur = addDays(cur, 1);
    }
    return count;
  }
  function ganttHolidayOptions(rangeStart, rangeEnd, opts = {}) {
    const list = holidaysBetween(rangeStart, rangeEnd, opts.extra || []);
    const highlight = {};
    highlight["var(--g-weekend-highlight-color)"] = "weekend";
    highlight["var(--g-holiday-highlight-color, #ffecb3)"] = list.map((h) => ({
      date: h.iso,
      label: h.label
    }));
    const ignore = opts.ignoreNonBusiness ? ["weekend", ...list.map((h) => h.iso)] : [];
    return {
      holidays: highlight,
      ignore,
      is_weekend: (d) => isWeekend(d),
      holidayList: list
    };
  }

  // src/features/projetos/domain/progress.js
  function autoProgressPercent(start, end, now = today()) {
    const a = parseDate(start);
    const b = parseDate(end);
    const n = parseDate(now) || today();
    if (!a || !b) return 0;
    if (b.getTime() <= a.getTime()) return n >= b ? 100 : 0;
    if (n <= a) return 0;
    if (n >= b) return 100;
    const total = b.getTime() - a.getTime();
    const done = n.getTime() - a.getTime();
    return Math.max(0, Math.min(100, Math.round(done / total * 100)));
  }
  function effectiveProgress(etapa, now = today()) {
    const stored = Math.max(0, Math.min(100, Number(etapa.progresso_execucao) || 0));
    const hasAuto = !isEmptyDate(etapa.data_inicio_progresso_automatico) && isEmptyDate(etapa.data_fim_execucao) && stored < 100;
    if (!hasAuto) return { progress: stored, auto: false, changed: false };
    const pct = autoProgressPercent(
      etapa.data_inicio_progresso_automatico,
      etapa.data_fim_progresso_automatico,
      now
    );
    if (pct < 0 || pct === stored) return { progress: stored, auto: true, changed: false };
    return { progress: pct, auto: true, changed: pct !== stored };
  }
  function barStatus(etapa, opts = {}) {
    const now = parseDate(opts.now) || today();
    const start = parseDate(etapa.data_inicio_programado);
    const end = parseDate(etapa.data_fim_programado);
    const progress = opts.progress != null ? opts.progress : effectiveProgress(etapa, now).progress;
    if (etapa.marco) return "milestone";
    if (!isEmptyDate(etapa.data_fim_execucao)) return "complete";
    if (opts.executedBar) return "executed";
    if (progress < 100 && end && end < now) return "delay";
    if (start && end && now >= start && now <= end) return "ongoing";
    if (etapa.critico) return "critical";
    return "inday";
  }
  function baselineDeviation(etapa) {
    const plannedEnd = parseDate(etapa.data_fim_programado);
    const actualEnd = parseDate(etapa.data_fim_execucao);
    if (!plannedEnd || !actualEnd || isEmptyDate(etapa.data_fim_execucao)) {
      return { days: null, late: false, early: false };
    }
    const days = diffDays(plannedEnd, actualEnd);
    return { days, late: days > 0, early: days < 0 };
  }
  function expectedProgress(etapa, now = today()) {
    return autoProgressPercent(etapa.data_inicio_programado, etapa.data_fim_programado, now);
  }
  function deadlineAlerts(etapas, opts = {}) {
    const now = parseDate(opts.now) || today();
    const warnDays = opts.warnDays == null ? 3 : opts.warnDays;
    const alerts = [];
    for (const e of etapas || []) {
      if (!isEmptyDate(e.data_fim_execucao)) continue;
      const end = parseDate(e.data_fim_programado);
      if (!end) continue;
      const daysLeft = diffDays(now, end);
      const progress = effectiveProgress(e, now).progress;
      if (daysLeft < 0 && progress < 100) {
        alerts.push({
          level: "overdue",
          id_etapa: e.id_etapa,
          id_projeto: e.id_projeto,
          nome_etapa: e.nome_etapa,
          days: daysLeft,
          message: "Etapa atrasada em " + Math.abs(daysLeft) + " dia(s)"
        });
      } else if (daysLeft >= 0 && daysLeft <= warnDays && progress < 100) {
        alerts.push({
          level: "warning",
          id_etapa: e.id_etapa,
          id_projeto: e.id_projeto,
          nome_etapa: e.nome_etapa,
          days: daysLeft,
          message: "Prazo em " + daysLeft + " dia(s)"
        });
      }
    }
    return alerts;
  }

  // src/features/projetos/domain/schedule.js
  function durationDays(etapa, holidayList) {
    const start = startOfDay(etapa.data_inicio_programado);
    const end = startOfDay(etapa.data_fim_programado);
    if (!start || !end) return etapa.marco ? 0 : 1;
    if (etapa.marco) return 0;
    if (etapa.calendario === "util") {
      return Math.max(1, countBusinessDays(start, end, holidayList));
    }
    return Math.max(1, diffDays(start, end) + 1);
  }
  function endFromStart(start, duration, calendario, holidayList) {
    if (duration <= 0) return start;
    if (calendario === "util") {
      return addBusinessDays(start, duration - 1, holidayList);
    }
    return addDays(start, duration - 1);
  }
  function constraintDate(pred, tipo, lag, holidayList) {
    const pStart = startOfDay(pred.data_inicio_programado);
    const pEnd = startOfDay(pred.data_fim_programado);
    if (!pStart || !pEnd) return null;
    let base;
    if (tipo === "SS") base = pStart;
    else if (tipo === "FF" || tipo === "SF") base = pEnd;
    else base = addDays(pEnd, 1);
    if (lag) {
      base = addDays(base, lag);
    }
    return base;
  }
  function topologicalSort(etapas) {
    const byId = new Map((etapas || []).map((e) => [e.id_etapa, e]));
    const indeg = /* @__PURE__ */ new Map();
    const adj = /* @__PURE__ */ new Map();
    for (const e of byId.values()) {
      indeg.set(e.id_etapa, 0);
      adj.set(e.id_etapa, []);
    }
    for (const e of byId.values()) {
      for (const p of normalizePredecessoras(e)) {
        if (!byId.has(p.id_etapa)) continue;
        adj.get(p.id_etapa).push(e.id_etapa);
        indeg.set(e.id_etapa, (indeg.get(e.id_etapa) || 0) + 1);
      }
    }
    const q = [...indeg.entries()].filter(([, d]) => d === 0).map(([id]) => id);
    const order = [];
    while (q.length) {
      const id = q.shift();
      order.push(id);
      for (const n of adj.get(id) || []) {
        indeg.set(n, indeg.get(n) - 1);
        if (indeg.get(n) === 0) q.push(n);
      }
    }
    if (order.length !== byId.size) {
      const leftover = [...byId.keys()].filter((id) => !order.includes(id));
      return { order: order.map((id) => byId.get(id)), cycle: leftover };
    }
    return { order: order.map((id) => byId.get(id)), cycle: null };
  }
  function computeSchedule(etapas, opts = {}) {
    const list = (etapas || []).map((e) => ({ ...e, predecessoras: normalizePredecessoras(e) }));
    if (!list.length) {
      return { etapas: [], criticalIds: [], projectFinish: null, cycle: null };
    }
    const rangeStart = list.reduce((min, e) => {
      const d = parseDate(e.data_inicio_programado);
      return !d || min && d >= min ? min || d : d;
    }, null);
    const rangeEnd = list.reduce((max, e) => {
      const d = parseDate(e.data_fim_programado);
      return !d || max && d <= max ? max || d : d;
    }, null);
    const holidayList = opts.holidayList || holidaysBetween(
      rangeStart || /* @__PURE__ */ new Date(),
      addDays(rangeEnd || /* @__PURE__ */ new Date(), 365) || /* @__PURE__ */ new Date()
    );
    const { order, cycle } = topologicalSort(list);
    if (cycle) {
      return {
        etapas: list.map((e) => ({ ...e, folga: null, critico: false })),
        criticalIds: [],
        projectFinish: null,
        cycle
      };
    }
    const byId = new Map(order.map((e) => [e.id_etapa, { ...e }]));
    for (const e of order) {
      const cur = byId.get(e.id_etapa);
      const dur = durationDays(cur, holidayList);
      cur._duration = dur;
      let es = startOfDay(cur.data_inicio_programado);
      for (const p of cur.predecessoras) {
        const pred = byId.get(p.id_etapa);
        if (!pred) continue;
        const c = constraintDate(pred, p.tipo, p.lag_dias, holidayList);
        if (c && (!es || c.getTime() > es.getTime())) es = c;
      }
      if (!es) es = startOfDay(/* @__PURE__ */ new Date());
      if (cur.calendario === "util") {
        while (!isBusinessDay(es, holidayList)) es = addDays(es, 1);
      }
      const ef = endFromStart(es, dur, cur.calendario, holidayList);
      cur._es = es;
      cur._ef = ef;
    }
    let projectFinish = null;
    for (const e of byId.values()) {
      if (!projectFinish || e._ef.getTime() > projectFinish.getTime()) projectFinish = e._ef;
    }
    const rev = [...order].reverse();
    for (const e of rev) {
      const cur = byId.get(e.id_etapa);
      let lf = projectFinish;
      for (const other of byId.values()) {
        for (const p of other.predecessoras) {
          if (p.id_etapa !== cur.id_etapa) continue;
          const succEs = other._es;
          if (p.tipo === "FS") {
            const cand = addDays(succEs, -1 - (p.lag_dias || 0));
            if (!lf || cand.getTime() < lf.getTime()) lf = cand;
          } else if (p.tipo === "SS") {
            const cand = addDays(succEs, -(p.lag_dias || 0));
            const candLf = endFromStart(cand, cur._duration, cur.calendario, holidayList);
            if (!lf || candLf.getTime() < lf.getTime()) lf = candLf;
          } else if (p.tipo === "FF" || p.tipo === "SF") {
            const cand = addDays(other._ef, -(p.lag_dias || 0));
            if (!lf || cand.getTime() < lf.getTime()) lf = cand;
          }
        }
      }
      if (!lf) lf = projectFinish;
      const ls = cur._duration <= 0 ? lf : cur.calendario === "util" ? (() => {
        let d = lf;
        let left = cur._duration - 1;
        while (left > 0) {
          d = addDays(d, -1);
          if (isBusinessDay(d, holidayList)) left--;
        }
        while (!isBusinessDay(d, holidayList)) d = addDays(d, -1);
        return d;
      })() : addDays(lf, -(cur._duration - 1));
      cur._lf = lf;
      cur._ls = ls;
      cur.folga = diffDays(cur._es, cur._ls);
      cur.critico = cur.folga === 0;
    }
    const criticalIds = [...byId.values()].filter((e) => e.critico).map((e) => e.id_etapa);
    const enriched = order.map((e) => {
      const cur = byId.get(e.id_etapa);
      return {
        ...cur,
        data_inicio_programado: formatDateTime(cur._es),
        data_fim_programado: formatDateTime(cur._ef),
        folga: cur.folga,
        critico: cur.critico
      };
    });
    return {
      etapas: enriched,
      criticalIds,
      projectFinish: projectFinish ? formatDateTime(projectFinish) : null,
      cycle: null
    };
  }
  function cascadeMove(etapas, idEtapa, newStart, newEnd, opts = {}) {
    const list = (etapas || []).map((e) => ({ ...e, predecessoras: normalizePredecessoras(e) }));
    const target = list.find((e) => e.id_etapa === Number(idEtapa));
    if (!target) return list;
    const oldStart = startOfDay(target.data_inicio_programado);
    const ns2 = startOfDay(newStart) || oldStart;
    const ne = startOfDay(newEnd) || startOfDay(target.data_fim_programado);
    const delta = oldStart ? diffDays(oldStart, ns2) : 0;
    target.data_inicio_programado = formatDateTime(ns2);
    target.data_fim_programado = formatDateTime(ne);
    if (!opts.moveDependencies) return list;
    const { order } = topologicalSort(list);
    const byId = new Map(list.map((e) => [e.id_etapa, e]));
    const holidayList = opts.holidayList || [];
    for (const e of order) {
      if (e.id_etapa === target.id_etapa) continue;
      const cur = byId.get(e.id_etapa);
      let minStart = startOfDay(cur.data_inicio_programado);
      for (const p of cur.predecessoras) {
        const pred = byId.get(p.id_etapa);
        if (!pred) continue;
        const c = constraintDate(pred, p.tipo, p.lag_dias, holidayList);
        if (c && (!minStart || c.getTime() > minStart.getTime())) minStart = c;
      }
      const curStart = startOfDay(cur.data_inicio_programado);
      if (minStart && curStart && minStart.getTime() > curStart.getTime()) {
        const shift = diffDays(curStart, minStart);
        cur.data_inicio_programado = formatDateTime(minStart);
        cur.data_fim_programado = formatDateTime(addDays(startOfDay(cur.data_fim_programado), shift));
      } else if (delta && opts.shiftAll) {
        cur.data_inicio_programado = formatDateTime(addDays(curStart, delta));
        cur.data_fim_programado = formatDateTime(addDays(startOfDay(cur.data_fim_programado), delta));
      }
    }
    return list;
  }
  function macroetapaSummaries(etapas) {
    const groups = /* @__PURE__ */ new Map();
    for (const e of etapas || []) {
      const key = (e.macroetapa || "").trim() || "(sem macroetapa)";
      if (!groups.has(key)) {
        groups.set(key, {
          macroetapa: key,
          etapas: [],
          data_inicio: null,
          data_fim: null,
          progresso: 0,
          critico: false
        });
      }
      groups.get(key).etapas.push(e);
    }
    const out = [];
    for (const g of groups.values()) {
      let start = null;
      let end = null;
      let progSum = 0;
      let durSum = 0;
      let critico = false;
      for (const e of g.etapas) {
        const s = parseDate(e.data_inicio_programado);
        const f = parseDate(e.data_fim_programado);
        if (s && (!start || s < start)) start = s;
        if (f && (!end || f > end)) end = f;
        const d = Math.max(1, diffDays(s, f) + 1);
        progSum += (e.progresso_execucao || 0) * d;
        durSum += d;
        if (e.critico) critico = true;
      }
      out.push({
        macroetapa: g.macroetapa,
        data_inicio_programado: start ? formatDateTime(start) : null,
        data_fim_programado: end ? formatDateTime(end) : null,
        progresso_execucao: durSum ? Math.round(progSum / durSum) : 0,
        critico,
        count: g.etapas.length
      });
    }
    return out;
  }
  function groupByResponsavel(projetos) {
    const map = /* @__PURE__ */ new Map();
    for (const p of projetos || []) {
      for (const e of p.etapas || []) {
        const key = (e.responsavel || "").trim() || "(sem responsavel)";
        if (!map.has(key)) map.set(key, []);
        map.get(key).push({ ...e, nome_projeto: p.nome_projeto, id_projeto: p.id_projeto });
      }
    }
    return [...map.entries()].map(([responsavel, etapas]) => ({ responsavel, etapas }));
  }

  // src/features/projetos/domain/filters.js
  function sortProjetos(projetos, { includeArquivados: includeArquivados2 = false, idTipo = null } = {}) {
    let list = Array.isArray(projetos) ? projetos.slice() : [];
    if (idTipo != null && idTipo !== "" && idTipo !== false) {
      const idn = Number(idTipo);
      list = list.filter((p) => p.id_tipo_projeto === idn);
    }
    if (!includeArquivados2) {
      list = list.filter((p) => p.ativo !== false);
    }
    return list.sort((a, b) => String(a.nome_projeto || "").localeCompare(String(b.nome_projeto || ""), "pt-BR"));
  }
  function sortEtapas(etapas, orderBy = "data_inicio") {
    const list = Array.isArray(etapas) ? etapas.slice() : [];
    if (orderBy === "nome_etapa") {
      return list.sort((a, b) => String(a.nome_etapa || "").localeCompare(String(b.nome_etapa || ""), "pt-BR"));
    }
    if (orderBy === "id_etapa") {
      return list.sort((a, b) => (a.id_etapa || 0) - (b.id_etapa || 0));
    }
    return list.sort((a, b) => {
      const aa = parseDate(a.data_inicio_programado);
      const bb = parseDate(b.data_inicio_programado);
      if (!aa && !bb) return 0;
      if (!aa) return 1;
      if (!bb) return -1;
      return aa - bb;
    });
  }
  function findProjetoById(projetos, id) {
    const idn = Number(id);
    return (projetos || []).find((p) => p.id_projeto === idn) || null;
  }
  function findEtapaById(projeto, idEtapa) {
    if (!projeto || !Array.isArray(projeto.etapas)) return null;
    const idn = Number(idEtapa);
    return projeto.etapas.find((e) => e.id_etapa === idn) || null;
  }
  function findEtapaNome(projetos, idEtapa) {
    const idn = Number(idEtapa);
    for (const p of projetos || []) {
      const e = (p.etapas || []).find((x) => x.id_etapa === idn);
      if (e) return e.nome_etapa;
    }
    return "";
  }
  function tiposOptions(projetos, tipos = []) {
    const map = /* @__PURE__ */ new Map();
    for (const t of tipos || []) {
      if (t && t.id_tipo_projeto) map.set(t.id_tipo_projeto, t);
    }
    for (const p of projetos || []) {
      if (p.id_tipo_projeto && !map.has(p.id_tipo_projeto)) {
        map.set(p.id_tipo_projeto, {
          id_tipo_projeto: p.id_tipo_projeto,
          nome_tipo_projeto: p.nome_tipo_projeto || String(p.id_tipo_projeto)
        });
      }
    }
    return [...map.values()].sort(
      (a, b) => String(a.nome_tipo_projeto).localeCompare(String(b.nome_tipo_projeto), "pt-BR")
    );
  }
  function filterEtapas(etapas, filter = {}) {
    return (etapas || []).filter((e) => {
      if (filter.responsavel && e.responsavel !== filter.responsavel) return false;
      if (filter.macroetapa && e.macroetapa !== filter.macroetapa) return false;
      if (filter.grupo && e.grupo !== filter.grupo) return false;
      if (filter.etiqueta) {
        const tags = String(e.etiqueta || "").split(/[;,]/).map((t) => t.trim()).filter(Boolean);
        if (!tags.includes(filter.etiqueta)) return false;
      }
      if (filter.critico && !e.critico) return false;
      if (filter.atraso) {
        const end = parseDate(e.data_fim_programado);
        if (!end || end >= /* @__PURE__ */ new Date() || e.progresso_execucao >= 100) return false;
      }
      if (filter.q) {
        const q = String(filter.q).toLowerCase();
        const hay = [e.nome_etapa, e.responsavel, e.macroetapa, e.grupo, e.observacoes].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }
  function uniqueFieldValues(etapas, field) {
    const set = /* @__PURE__ */ new Set();
    for (const e of etapas || []) {
      const v = (e[field] || "").trim();
      if (v) set.add(v);
    }
    return [...set].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }
  function flattenEtapas(projetos) {
    const out = [];
    for (const p of projetos || []) {
      for (const e of p.etapas || []) {
        out.push({
          ...e,
          id_projeto: p.id_projeto,
          nome_projeto: p.nome_projeto,
          sigla_unidade: p.sigla_unidade
        });
      }
    }
    return out;
  }
  function exportProjetoJson(projeto) {
    return JSON.parse(JSON.stringify(projeto || {}));
  }
  function exportEtapasCsv(etapas) {
    const cols = [
      "id_projeto",
      "nome_projeto",
      "id_etapa",
      "nome_etapa",
      "macroetapa",
      "responsavel",
      "data_inicio_programado",
      "data_fim_programado",
      "progresso_execucao",
      "critico",
      "folga"
    ];
    const esc = (v) => {
      const s = v == null ? "" : String(v);
      return /["\n,;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const lines = [cols.join(";")];
    for (const e of etapas || []) {
      lines.push(cols.map((c) => esc(e[c])).join(";"));
    }
    return lines.join("\n");
  }
  function importProjetoJson(text) {
    const data = typeof text === "string" ? JSON.parse(text) : text;
    if (!data || typeof data !== "object") throw new Error("JSON invalido");
    if (!data.nome_projeto && !data.etapas) throw new Error("Formato de projeto nao reconhecido");
    return data;
  }

  // src/features/projetos/gantt-adapter.js
  function depIds(etapa) {
    const preds = normalizePredecessoras(etapa);
    return preds.map((p) => String(p.id_etapa));
  }
  function projetoToGanttTasks(projeto, opts = {}) {
    let etapas = sortEtapas(projeto.etapas || [], opts.orderBy || "data_inicio");
    let criticalIds = /* @__PURE__ */ new Set();
    if (opts.applySchedule !== false) {
      const scheduled = computeSchedule(etapas);
      etapas = scheduled.etapas;
      criticalIds = new Set(scheduled.criticalIds || []);
    }
    const rangeStart = etapas.reduce((min, e) => {
      const d = parseDate(e.data_inicio_programado);
      return !d || min && d < min ? d || min : min;
    }, null);
    const rangeEnd = etapas.reduce((max, e) => {
      const d = parseDate(e.data_fim_programado);
      return !d || max && d > max ? d || max : max;
    }, null);
    const holidayOpts = ganttHolidayOptions(
      rangeStart || /* @__PURE__ */ new Date(),
      rangeEnd || /* @__PURE__ */ new Date(),
      { ignoreNonBusiness: !!opts.ignoreNonBusiness }
    );
    const tasks = [];
    if (opts.showMacro) {
      for (const m of macroetapaSummaries(etapas)) {
        if (!m.data_inicio_programado || !m.data_fim_programado) continue;
        tasks.push({
          id: "macro_" + m.macroetapa,
          name: m.macroetapa,
          start: formatDate(m.data_inicio_programado),
          end: formatDate(m.data_fim_programado),
          progress: m.progresso_execucao,
          dependencies: [],
          custom_class: "seipro-projetos-bar--macro" + (m.critico ? " seipro-projetos-bar--critical" : ""),
          _meta: { kind: "macro", macroetapa: m.macroetapa }
        });
      }
    }
    for (const e of etapas) {
      const { progress } = effectiveProgress(e);
      const status = barStatus({ ...e, critico: criticalIds.has(e.id_etapa) || e.critico }, { progress });
      const start = formatDate(e.data_inicio_programado);
      const end = formatDate(e.data_fim_programado);
      if (!start || !end) continue;
      tasks.push({
        id: String(e.id_etapa),
        name: e.nome_etapa,
        start,
        end,
        progress,
        dependencies: depIds(e),
        custom_class: "seipro-projetos-bar--" + status,
        expected_progress: expectedProgress(e),
        _meta: {
          kind: "etapa",
          etapa: e,
          id_projeto: projeto.id_projeto,
          critico: criticalIds.has(e.id_etapa) || !!e.critico,
          folga: e.folga
        }
      });
      if (opts.showExecucao && !isEmptyDate(e.data_inicio_execucao) && !isEmptyDate(e.data_fim_execucao)) {
        tasks.push({
          id: String(e.id_etapa) + "_exec",
          name: e.nome_etapa + " (execucao)",
          start: formatDate(e.data_inicio_execucao),
          end: formatDate(e.data_fim_execucao),
          progress,
          dependencies: [String(e.id_etapa)],
          custom_class: "seipro-projetos-bar--executed",
          _meta: { kind: "executed", etapa: e, id_projeto: projeto.id_projeto }
        });
      }
    }
    return { tasks, holidayOpts, etapas, criticalIds: [...criticalIds] };
  }
  function portfolioToGanttTasks(projetos) {
    const tasks = [];
    for (const p of projetos || []) {
      if (!p.etapas || !p.etapas.length) continue;
      const starts = p.etapas.map((e) => parseDate(e.data_inicio_programado)).filter(Boolean);
      const ends = p.etapas.map((e) => parseDate(e.data_fim_programado)).filter(Boolean);
      if (!starts.length || !ends.length) continue;
      const start = new Date(Math.min(...starts.map((d) => d.getTime())));
      const end = new Date(Math.max(...ends.map((d) => d.getTime())));
      const prog = Math.round(
        p.etapas.reduce((s, e) => s + (e.progresso_execucao || 0), 0) / p.etapas.length
      );
      tasks.push({
        id: "proj_" + p.id_projeto,
        name: p.nome_projeto,
        start: formatDate(start),
        end: formatDate(end),
        progress: prog,
        dependencies: [],
        custom_class: "seipro-projetos-bar--portfolio",
        _meta: { kind: "projeto", projeto: p }
      });
    }
    return tasks;
  }
  function taskDatesToEtapaPatch(task) {
    const start = parseDate(task._start || task.start);
    const end = parseDate(task._end || task.end);
    return {
      id_etapa: Number(String(task.id).replace(/_exec$/, "")),
      data_inicio_programado: start,
      data_fim_programado: end,
      progresso_execucao: task.progress
    };
  }
  function buildGanttOptions({ editable = true, holidayOpts = {}, onClick, onDateChange, onProgressChange, popup } = {}) {
    return {
      language: "pt-BR",
      view_mode: "Month",
      view_mode_select: true,
      today_button: true,
      container_height: "auto",
      scroll_to: "today",
      bar_height: 18,
      bar_corner_radius: 3,
      padding: 16,
      move_dependencies: true,
      show_expected_progress: true,
      readonly: !editable,
      readonly_dates: !editable,
      readonly_progress: !editable,
      holidays: holidayOpts.holidays,
      ignore: holidayOpts.ignore || [],
      popup_on: "click",
      popup: popup || void 0,
      on_click: onClick,
      on_date_change: onDateChange,
      on_progress_change: onProgressChange
    };
  }

  // src/features/projetos/templates.js
  function panelShellHtml() {
    return '<div class="panelHomePro seipro-projetos" id="projetosGantt" style="display:inline-block;width:100%;">  <div class="infraBarraLocalizacao titlePanelHome seipro-projetos__title">    <i class="fa fa-tasks azulColor" style="margin:0 5px;font-size:1.1em;"></i> Projetos    <button type="button" class="newLink seipro-projetos__toggle" data-act="toggle-panel" title="Recolher/mostrar" aria-label="Recolher painel">      <i class="fas fa-minus-square cinzaColor"></i>    </button>  </div>  <div id="projetosGanttDiv" class="seipro-projetos__body" style="width:100%;display:inline-table;">    <div class="seipro-projetos__toolbar" id="projetosProActions">      <button type="button" class="newLink" data-act="add-projeto" title="Adicionar projeto"><i class="fas fa-plus"></i></button>      <button type="button" class="newLink" data-act="open-filter" title="Relatorio filtrado"><i class="fas fa-filter"></i></button>      <button type="button" class="newLink" data-act="open-portfolio" title="Visao de portfolio"><i class="fas fa-th-large"></i></button>      <button type="button" class="newLink" data-act="open-responsavel" title="Por responsavel"><i class="fas fa-users"></i></button>      <button type="button" class="newLink" data-act="toggle-arquivados" title="Mostrar arquivados"><i class="fas fa-archive"></i></button>      <button type="button" class="newLink" data-act="export-json" title="Exportar JSON"><i class="fas fa-file-export"></i></button>      <button type="button" class="newLink" data-act="import-json" title="Importar JSON"><i class="fas fa-file-import"></i></button>      <button type="button" class="newLink" data-act="refresh" title="Atualizar"><i class="fas fa-sync-alt"></i></button>      <label class="seipro-projetos__tipo-label">Tipo         <select id="selectTipoProjetoPro" class="infraText seipro-projetos__tipo" data-act="filter-tipo"></select>      </label>    </div>    <div id="projetosAlerts" class="seipro-projetos__alerts" aria-live="polite"></div>    <div id="projetosTabs" class="seipro-projetos__tabs"></div>  </div></div>';
  }
  function emptyStateHtml() {
    return '<div class="seipro-projetos__empty">  <p>Nenhum projeto ainda. Clique em <strong>+</strong> para criar, ou use os dados de demonstracao.</p>  <button type="button" class="newLink" data-act="seed-demo">Carregar demonstracao</button></div>';
  }
  function projetoFormHtml(projeto = {}, tipos = []) {
    const opts = ['<option value="">\u2014</option>'].concat(tipos.map((t) => {
      const sel = Number(projeto.id_tipo_projeto) === Number(t.id_tipo_projeto) ? " selected" : "";
      return '<option value="' + t.id_tipo_projeto + '"' + sel + ">" + escapeHtml(t.nome_tipo_projeto) + "</option>";
    }));
    return '<form class="seipro-projetos-form seiProForm" data-form="projeto">  <input type="hidden" name="id_projeto" value="' + (projeto.id_projeto || 0) + '">  <table style="width:100%;font-size:10pt;">    <tr><td class="label"><label>Nome</label></td>        <td class="required"><input class="infraText" name="nome_projeto" required value="' + escapeAttr(projeto.nome_projeto || "") + '"></td></tr>    <tr><td class="label"><label>Tipo</label></td>        <td><select class="infraText" name="id_tipo_projeto">' + opts.join("") + '</select></td></tr>    <tr><td class="label"><label>Processo SEI</label></td>        <td><input class="infraText" name="processo_sei" value="' + escapeAttr(projeto.processo_sei || "") + '"></td></tr>  </table></form>';
  }
  function etapaFormHtml(etapa = {}, projeto = {}) {
    const deps = (projeto.etapas || []).filter((e) => e.id_etapa !== etapa.id_etapa).map((e) => {
      const sel = Number(etapa.id_dependencia) === Number(e.id_etapa) ? " selected" : "";
      return '<option value="' + e.id_etapa + '"' + sel + ">" + escapeHtml(e.nome_etapa) + "</option>";
    });
    return '<form class="seipro-projetos-form seiProForm" data-form="etapa">  <input type="hidden" name="id_projeto" value="' + (projeto.id_projeto || 0) + '">  <input type="hidden" name="id_etapa" value="' + (etapa.id_etapa || 0) + '">  <table style="width:100%;font-size:10pt;">    <tr><td class="label"><label>Nome</label></td>        <td class="required"><input class="infraText" name="nome_etapa" required value="' + escapeAttr(etapa.nome_etapa || "") + '"></td></tr>    <tr><td class="label"><label>Inicio programado</label></td>        <td class="required"><input type="datetime-local" name="data_inicio_programado" required></td></tr>    <tr><td class="label"><label>Fim programado</label></td>        <td class="required"><input type="datetime-local" name="data_fim_programado" required></td></tr>    <tr><td class="label"><label>Predecessora (FS)</label></td>        <td><select class="infraText" name="id_dependencia"><option value="">\u2014</option>' + deps.join("") + '</select></td></tr>    <tr><td class="label"><label>Macroetapa</label></td>        <td><input class="infraText" name="macroetapa" value="' + escapeAttr(etapa.macroetapa || "") + '"></td></tr>    <tr><td class="label"><label>Responsavel</label></td>        <td><input class="infraText" name="responsavel" value="' + escapeAttr(etapa.responsavel || "") + '"></td></tr>    <tr><td class="label"><label>Grupo</label></td>        <td><input class="infraText" name="grupo" value="' + escapeAttr(etapa.grupo || "") + '"></td></tr>    <tr><td class="label"><label>Etiquetas</label></td>        <td><input class="infraText" name="etiqueta" id="proj_etiqueta" value="' + escapeAttr(etapa.etiqueta || "") + '"></td></tr>    <tr><td class="label"><label>Calendario</label></td>        <td><select class="infraText" name="calendario">              <option value="corrido"' + (etapa.calendario !== "util" ? " selected" : "") + '>Dias corridos</option>              <option value="util"' + (etapa.calendario === "util" ? " selected" : "") + '>Dias uteis (feriados BR)</option>            </select></td></tr>    <tr><td class="label"><label>Marco</label></td>        <td><label><input type="checkbox" name="marco" value="1"' + (etapa.marco ? " checked" : "") + '> Entrega / prazo legal</label></td></tr>    <tr><td class="label"><label>Progresso %</label></td>        <td><input type="number" min="0" max="100" class="infraText" name="progresso_execucao" value="' + (etapa.progresso_execucao || 0) + '"></td></tr>    <tr><td class="label"><label>Observacoes</label></td>        <td><textarea class="infraText" name="observacoes" rows="3">' + escapeHtml(etapa.observacoes || "") + "</textarea></td></tr>  </table></form>";
  }
  function popupDetailsHtml(etapa, meta = {}) {
    const dev = baselineDeviation(etapa);
    const rows = [
      ["Responsavel", etapa.responsavel || "\u2014"],
      ["Macroetapa", etapa.macroetapa || "\u2014"],
      ["Programado", formatDisplay(etapa.data_inicio_programado, true) + " \u2192 " + formatDisplay(etapa.data_fim_programado, true)],
      ["Progresso", (meta.progress != null ? meta.progress : etapa.progresso_execucao) + "%"],
      ["Folga", meta.folga != null ? meta.folga + " dia(s)" : etapa.folga != null ? etapa.folga + " dia(s)" : "\u2014"],
      ["Critico", meta.critico || etapa.critico ? "Sim" : "Nao"],
      ["Desvio", dev.days == null ? "\u2014" : dev.days + " dia(s)"]
    ];
    return '<table class="seipro-projetos-popup">' + rows.map(
      (r) => "<tr><th>" + r[0] + "</th><td>" + escapeHtml(String(r[1])) + "</td></tr>"
    ).join("") + "</table>";
  }
  function a11yTableHtml(etapas) {
    const head = "<thead><tr><th>Etapa</th><th>Inicio</th><th>Fim</th><th>%</th><th>Responsavel</th><th>Critico</th></tr></thead>";
    const body = (etapas || []).map(
      (e) => "<tr><td>" + escapeHtml(e.nome_etapa) + "</td><td>" + escapeHtml(formatDisplay(e.data_inicio_programado)) + "</td><td>" + escapeHtml(formatDisplay(e.data_fim_programado)) + "</td><td>" + (e.progresso_execucao || 0) + "</td><td>" + escapeHtml(e.responsavel || "") + "</td><td>" + (e.critico ? "Sim" : "") + "</td></tr>"
    ).join("");
    return '<table class="seipro-projetos-a11y infraTable">' + head + "<tbody>" + body + "</tbody></table>";
  }
  function shareTableHtml(shares = []) {
    const rows = (shares || []).map(
      (s, i) => '<tr data-index="' + i + '"><td contenteditable="true" data-field="usuario">' + escapeHtml(s.usuario || "") + '</td><td contenteditable="true" data-field="permissao">' + escapeHtml(s.permissao || "leitura") + '</td><td><button type="button" class="newLink" data-act="share-remove" data-index="' + i + '"><i class="fas fa-trash"></i></button></td></tr>'
    ).join("");
    return '<div class="seipro-projetos-share">  <table class="infraTable" id="seiproProjetosShareTable"><thead><tr><th>Usuario</th><th>Permissao</th><th></th></tr></thead>  <tbody>' + rows + '</tbody></table>  <button type="button" class="newLink" data-act="share-add"><i class="fas fa-plus"></i> Adicionar</button></div>';
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }
  function elFromHtml(html) {
    const wrap = el("div", { html });
    return wrap.firstElementChild || wrap;
  }

  // src/features/projetos/io.js
  function hasRemoteBackend() {
    return !!(globalRef.urlServerAtiv && globalRef.userHashAtiv);
  }
  function getAtividadesServer() {
    const api = globalRef.SeiPro && globalRef.SeiPro.features && globalRef.SeiPro.features.atividades;
    if (api && typeof api.getServerAtividades === "function") return api.getServerAtividades;
    if (typeof globalRef.getServerAtividades === "function") return globalRef.getServerAtividades;
    return null;
  }
  function runProjetoAction(param, localDispatch) {
    const server = getAtividadesServer();
    if (hasRemoteBackend() && server) {
      return new Promise((resolve) => {
        try {
          server(param, param.action);
          resolve({ status: 1, remote: true });
        } catch (e) {
          resolve(localDispatch(param));
        }
      });
    }
    return Promise.resolve(localDispatch(param));
  }

  // src/features/projetos/view/helpers.js
  var ganttLoading = null;
  function getAtividadesCheckCapacidade() {
    const api = globalRef.SeiPro && globalRef.SeiPro.features && globalRef.SeiPro.features.atividades;
    if (api && typeof api.checkCapacidade === "function") return api.checkCapacidade;
    if (typeof globalRef.checkCapacidade === "function") return globalRef.checkCapacidade;
    return null;
  }
  function can(name) {
    const check = getAtividadesCheckCapacidade();
    if (check && hasRemoteBackend()) {
      try {
        return !!check(name);
      } catch (e) {
      }
    }
    return hasLocalCapacidade(name);
  }
  function formToObject(form) {
    const data = {};
    new FormData(form).forEach((v, k) => {
      data[k] = v;
    });
    if (form.querySelector('[name="marco"]')) {
      data.marco = !!form.querySelector('[name="marco"]').checked;
    }
    return data;
  }
  function act(action, param) {
    return runProjetoAction({ action, ...param }, dispatchProjetoAction);
  }
  function escapeText(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function downloadText(filename, text, mime) {
    const blob = new Blob([text], { type: mime || "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function getExtensionUrl() {
    if (typeof globalRef.getUrlExtension === "function") return globalRef.getUrlExtension("");
    if (globalRef.URL_SPRO) return globalRef.URL_SPRO;
    try {
      return chrome.runtime.getURL("");
    } catch (e) {
      return "";
    }
  }
  function loadStyle(href) {
    if (typeof globalRef.loadStylePro === "function") {
      globalRef.loadStylePro(href);
      return;
    }
    if (document.querySelector('link[href="' + href + '"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
  function loadGanttLib() {
    if (globalRef.Gantt) return Promise.resolve(globalRef.Gantt);
    if (ganttLoading) return ganttLoading;
    const base = getExtensionUrl();
    loadStyle(base + "css/frappe-gantt.css");
    ganttLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = base + "js/lib/frappe-gantt.js";
      s.onload = () => resolve(globalRef.Gantt);
      s.onerror = () => reject(new Error("Falha ao carregar frappe-gantt"));
      document.head.appendChild(s);
    });
    return ganttLoading;
  }

  // src/shared/ui/modal.js
  function openModal({ title = "", content = "", width = 600, buttons, onOpen, onClose, className = "" } = {}) {
    document.querySelectorAll(".seipro-modal").forEach((m) => m.remove());
    const previouslyFocused = document.activeElement;
    const overlay = document.createElement("div");
    overlay.className = "seipro-modal " + className;
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:100000;display:flex;align-items:center;justify-content:center;";
    const box = document.createElement("div");
    box.className = "dialogBoxDiv seipro-modal-box";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.style.cssText = "background:#fff;border-radius:6px;box-shadow:0 8px 30px rgba(0,0,0,.3);max-width:95vw;max-height:95vh;overflow:auto;width:" + width + "px;";
    const head = document.createElement("div");
    head.className = "seipro-modal-head";
    head.style.cssText = "display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #eee;font-weight:bold;";
    const titleElement = document.createElement("span");
    titleElement.className = "seipro-modal-title";
    titleElement.id = `seipro-modal-title-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    titleElement.textContent = title;
    box.setAttribute("aria-labelledby", titleElement.id);
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "seipro-modal-close";
    closeButton.setAttribute("data-modal-close", "");
    closeButton.setAttribute("aria-label", "Fechar");
    closeButton.style.cssText = "cursor:pointer;color:#888;border:0;background:transparent;padding:4px;";
    closeButton.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
    head.append(titleElement, closeButton);
    const body = document.createElement("div");
    body.className = "seipro-modal-body";
    body.style.cssText = "padding:14px;";
    const btnRow = document.createElement("div");
    btnRow.className = "seipro-modal-buttons";
    btnRow.style.cssText = "display:flex;gap:8px;justify-content:flex-end;padding:10px 14px;border-top:1px solid #eee;";
    box.append(head, body, btnRow);
    overlay.appendChild(box);
    if (typeof content === "string") body.innerHTML = content;
    else if (content instanceof Node) body.appendChild(content);
    const ref = { el: overlay, body, close };
    let onKey;
    let closed = false;
    function close() {
      if (closed) return;
      closed = true;
      document.removeEventListener("keydown", onKey, true);
      if (typeof onClose === "function") {
        try {
          onClose(ref);
        } catch (e) {
        }
      }
      overlay.remove();
      if (previouslyFocused && typeof previouslyFocused.focus === "function" && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    }
    function focusableElements() {
      return Array.from(box.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
    }
    onKey = (ev) => {
      if (ev.key === "Escape") {
        ev.stopPropagation();
        close();
        return;
      }
      if (ev.key !== "Tab") return;
      const focusable = focusableElements();
      if (!focusable.length) {
        ev.preventDefault();
        box.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (ev.shiftKey && document.activeElement === first) {
        ev.preventDefault();
        last.focus();
      } else if (!ev.shiftKey && document.activeElement === last) {
        ev.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay || ev.target.closest("[data-modal-close]")) close();
    });
    (buttons || [{ text: "Fechar", onClick: (r) => r.close() }]).forEach((b) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "newLink " + (b.class || "");
      btn.textContent = b.text;
      btn.style.cssText = "cursor:pointer;padding:4px 12px;";
      btn.addEventListener("click", () => b.onClick(ref));
      btnRow.appendChild(btn);
    });
    document.body.appendChild(overlay);
    if (typeof onOpen === "function") onOpen(ref);
    const initialFocus = body.querySelector(
      "[autofocus], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href]"
    ) || focusableElements()[0];
    if (document.activeElement === previouslyFocused) {
      if (initialFocus) initialFocus.focus();
      else {
        box.tabIndex = -1;
        box.focus();
      }
    }
    return ref;
  }

  // src/features/projetos/view/projeto-form.js
  function openProjetoForm(projeto, { onSaved } = {}) {
    const store = getStoreProjetos();
    const isEdit = !!(projeto && projeto.id_projeto);
    openModal({
      title: isEdit ? "Editar projeto" : "Novo projeto",
      width: 520,
      content: projetoFormHtml(projeto || {}, store.tipos_projetos || tiposOptions(store.projetos)),
      buttons: [
        {
          text: "Salvar",
          class: "infraButton",
          onClick(ref) {
            const form = ref.body.querySelector("form");
            if (!form.checkValidity()) {
              form.reportValidity();
              return;
            }
            const data = formToObject(form);
            const action = isEdit ? "edit_projeto" : "save_projeto";
            act(action, data).then(() => {
              ref.close();
              if (typeof onSaved === "function") onSaved();
            });
          }
        },
        { text: "Cancelar", onClick: (r) => r.close() }
      ]
    });
  }

  // src/shared/ui/tags-input.js
  function createTagsInput(input, opts = {}) {
    const o = Object.assign({
      delimiter: ";",
      placeholder: "Adicionar",
      minChars: 1,
      maxChars: 100,
      limit: 0,
      unique: true,
      removeWithBackspace: true,
      source: [],
      // array de sugestões ou função () => array
      renderLabel: null,
      // (tag) => HTML do conteúdo da pill (sem o x)
      onAdd: null,
      onRemove: null,
      onChange: null
    }, opts);
    const doc = o.doc || input.ownerDocument || document;
    const dropRoot = o.dropdownRoot || doc.body;
    let tags = String(input.value || "").split(o.delimiter).map((t) => t.trim()).filter(Boolean);
    const wrap = doc.createElement("div");
    wrap.className = "seipro-tagsinput";
    wrap.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;align-items:center;border:1px solid #ccc;border-radius:4px;padding:3px;min-height:28px;";
    const inner = doc.createElement("input");
    inner.type = "text";
    inner.placeholder = o.placeholder;
    inner.className = "seipro-tagsinput-entry";
    inner.style.cssText = "border:0;outline:0;flex:1;min-width:80px;font-size:inherit;background:transparent;";
    input.style.display = "none";
    input.insertAdjacentElement("afterend", wrap);
    const dropdown = doc.createElement("div");
    dropdown.className = "seipro-tagsinput-suggest";
    dropdown.style.cssText = "position:absolute;z-index:100001;background:#fff;border:1px solid #ccc;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,.15);max-height:160px;overflow:auto;display:none;font-size:11px;";
    dropRoot.appendChild(dropdown);
    function sync() {
      input.value = tags.join(o.delimiter);
      if (typeof o.onChange === "function") o.onChange(tags.slice(), input);
    }
    function pill(tag) {
      const el2 = doc.createElement("span");
      el2.className = "tag seipro-tag";
      el2.style.cssText = "display:inline-flex;align-items:center;gap:3px;background:#eef;border-radius:3px;padding:1px 6px;";
      el2.innerHTML = typeof o.renderLabel === "function" ? o.renderLabel(tag) : escapeText2(tag);
      const x = doc.createElement("i");
      x.className = "fas fa-times seipro-tag-remove";
      x.style.cssText = "cursor:pointer;font-size:.8em;opacity:.7;";
      x.addEventListener("click", () => remove(tag));
      el2.appendChild(x);
      el2.dataset.tag = tag;
      return el2;
    }
    function render() {
      wrap.querySelectorAll(".seipro-tag").forEach((n) => n.remove());
      tags.forEach((t) => wrap.insertBefore(pill(t), inner));
    }
    function add(raw) {
      const tag = String(raw || "").trim();
      if (tag.length < o.minChars || tag.length > o.maxChars) return false;
      if (o.unique && tags.indexOf(tag) !== -1) return false;
      if (o.limit > 0 && tags.length >= o.limit) return false;
      tags.push(tag);
      render();
      sync();
      if (typeof o.onAdd === "function") o.onAdd(tag, tags.slice());
      return true;
    }
    function remove(tag) {
      const i = tags.indexOf(tag);
      if (i === -1) return;
      tags.splice(i, 1);
      render();
      sync();
      if (typeof o.onRemove === "function") o.onRemove(tag, tags.slice());
    }
    function sources() {
      return (typeof o.source === "function" ? o.source() : o.source) || [];
    }
    function hideSuggest() {
      dropdown.style.display = "none";
      dropdown.innerHTML = "";
    }
    function showSuggest() {
      const q = inner.value.trim().toLowerCase();
      if (!q) return hideSuggest();
      const matches = sources().filter((s) => String(s).toLowerCase().indexOf(q) !== -1 && tags.indexOf(String(s)) === -1).slice(0, 8);
      if (!matches.length) return hideSuggest();
      dropdown.innerHTML = "";
      matches.forEach((m) => {
        const item = doc.createElement("div");
        item.textContent = m;
        item.style.cssText = "padding:4px 8px;cursor:pointer;";
        item.addEventListener("mousedown", (e) => {
          e.preventDefault();
          add(m);
          inner.value = "";
          hideSuggest();
        });
        dropdown.appendChild(item);
      });
      const r = inner.getBoundingClientRect();
      dropdown.style.left = r.left + (doc.defaultView ? doc.defaultView.scrollX : 0) + "px";
      dropdown.style.top = r.bottom + (doc.defaultView ? doc.defaultView.scrollY : 0) + "px";
      dropdown.style.minWidth = r.width + "px";
      dropdown.style.display = "block";
    }
    inner.addEventListener("input", showSuggest);
    inner.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === o.delimiter) {
        e.preventDefault();
        if (inner.value.trim()) {
          add(inner.value);
          inner.value = "";
          hideSuggest();
        }
      } else if (e.key === "Backspace" && inner.value === "" && o.removeWithBackspace && tags.length) {
        remove(tags[tags.length - 1]);
      }
    });
    inner.addEventListener("blur", () => {
      setTimeout(hideSuggest, 150);
      if (inner.value.trim()) {
        add(inner.value);
        inner.value = "";
      }
    });
    wrap.addEventListener("click", () => inner.focus());
    wrap.appendChild(inner);
    render();
    return {
      getTags: () => tags.slice(),
      add,
      remove,
      destroy() {
        hideSuggest();
        dropdown.remove();
        wrap.remove();
        input.style.display = "";
      }
    };
  }
  function escapeText2(s) {
    return String(s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]);
  }

  // src/features/projetos/view/etapa-form.js
  function openEtapaForm(projeto, etapa, { onSaved } = {}) {
    const isEdit = !!(etapa && etapa.id_etapa);
    return openModal({
      title: isEdit ? "Editar etapa" : "Nova etapa",
      width: 560,
      content: etapaFormHtml(etapa || {}, projeto),
      onOpen(modal) {
        const form = modal.body.querySelector("form");
        if (etapa) {
          const s = form.querySelector('[name="data_inicio_programado"]');
          const e = form.querySelector('[name="data_fim_programado"]');
          if (s) s.value = formatDateTimeLocal(etapa.data_inicio_programado);
          if (e) e.value = formatDateTimeLocal(etapa.data_fim_programado);
        }
        const tagInput = form.querySelector("#proj_etiqueta");
        if (tagInput) createTagsInput(tagInput, { delimiter: ";" });
      },
      buttons: [
        {
          text: "Salvar",
          class: "infraButton",
          onClick(modal) {
            const form = modal.body.querySelector("form");
            if (!form.checkValidity()) {
              form.reportValidity();
              return;
            }
            const data = formToObject(form);
            data.data_inicio_programado = formatDateTime(data.data_inicio_programado);
            data.data_fim_programado = formatDateTime(data.data_fim_programado);
            data.progresso_execucao = Number(data.progresso_execucao) || 0;
            if (data.id_dependencia) {
              data.predecessoras = [{ id_etapa: Number(data.id_dependencia), tipo: "FS", lag_dias: 0 }];
            } else {
              data.predecessoras = [];
              data.id_dependencia = false;
            }
            const action = isEdit ? "update_projeto_etapa" : "save_etapa";
            act(action, data).then(() => {
              modal.close();
              if (typeof onSaved === "function") onSaved();
            });
          }
        },
        { text: "Cancelar", onClick: (r) => r.close() }
      ]
    });
  }

  // src/features/projetos/view/popup.js
  function buildPopup(ctx, { onSaved } = {}) {
    const task = ctx.task;
    const meta = task._meta || {};
    if (meta.kind !== "etapa") {
      ctx.set_title(task.name);
      ctx.set_subtitle(meta.kind || "");
      return;
    }
    const etapa = meta.etapa;
    const { progress } = effectiveProgress(etapa);
    ctx.set_title(etapa.nome_etapa);
    ctx.set_subtitle(etapa.macroetapa || "");
    ctx.set_details(popupDetailsHtml(etapa, { progress, critico: meta.critico, folga: meta.folga }));
    if (can("update_projeto_etapa")) {
      ctx.add_action('<i class="fas fa-edit"></i> Editar', () => {
        const p = findProjeto(listProjetos(), meta.id_projeto);
        if (p) openEtapaForm(p, etapa, { onSaved });
      });
    }
    if (can("delete_projeto_etapa")) {
      ctx.add_action('<i class="fas fa-trash"></i> Excluir', () => {
        if (!confirm("Excluir esta etapa?")) return;
        act("delete_projeto_etapa", { id_projeto: meta.id_projeto, id_etapa: etapa.id_etapa }).then(() => {
          if (typeof onSaved === "function") onSaved();
        });
      });
    }
  }

  // src/features/projetos/view/share.js
  function openShare(projeto, { onSaved } = {}) {
    let shares = (projeto.projetos_compartilhados || []).map((s) => ({ ...s }));
    openModal({
      title: "Compartilhar \u2014 " + projeto.nome_projeto,
      width: 520,
      content: shareTableHtml(shares),
      onOpen(modal) {
        modal.body.addEventListener("click", (ev) => {
          const btn = ev.target.closest("[data-act]");
          if (!btn) return;
          if (btn.dataset.act === "share-add") {
            shares.push({ usuario: "", permissao: "leitura" });
            modal.body.querySelector(".seipro-projetos-share").outerHTML = shareTableHtml(shares);
          }
          if (btn.dataset.act === "share-remove") {
            shares.splice(Number(btn.dataset.index), 1);
            modal.body.querySelector(".seipro-projetos-share").outerHTML = shareTableHtml(shares);
          }
        });
        modal.body.addEventListener("focusout", (ev) => {
          const cell = ev.target.closest("[data-field]");
          if (!cell) return;
          const tr = cell.closest("tr");
          const i = Number(tr.dataset.index);
          if (shares[i]) shares[i][cell.dataset.field] = cell.textContent.trim();
        });
      },
      buttons: [
        {
          text: "Salvar",
          onClick(modal) {
            qsa("#seiproProjetosShareTable tbody tr", modal.body).forEach((tr, i) => {
              shares[i] = {
                usuario: tr.querySelector('[data-field="usuario"]').textContent.trim(),
                permissao: tr.querySelector('[data-field="permissao"]').textContent.trim()
              };
            });
            act("share_projeto", { id_projeto: projeto.id_projeto, projetos_compartilhados: shares }).then(() => {
              modal.close();
              if (typeof onSaved === "function") onSaved();
            });
          }
        },
        { text: "Fechar", onClick: (r) => r.close() }
      ]
    });
  }

  // src/features/projetos/view/report.js
  function openFilterReport() {
    const all = flattenEtapas(listProjetos());
    openModal({
      title: "Relatorio filtrado",
      width: 720,
      content: '<div class="seipro-projetos-report"><label>Responsavel <input class="infraText" data-filter="responsavel"></label> <label>Macroetapa <input class="infraText" data-filter="macroetapa"></label> <label><input type="checkbox" data-filter="critico"> So criticos</label> <label><input type="checkbox" data-filter="atraso"> Atrasados</label><div class="seipro-projetos-report__out"></div><button type="button" class="newLink" data-act="export-csv">Exportar CSV</button></div>',
      onOpen(modal) {
        const out = modal.body.querySelector(".seipro-projetos-report__out");
        function run() {
          const filter = {};
          qsa("[data-filter]", modal.body).forEach((el2) => {
            if (el2.type === "checkbox") filter[el2.dataset.filter] = el2.checked;
            else if (el2.value.trim()) filter[el2.dataset.filter] = el2.value.trim();
          });
          const rows = filterEtapas(all, filter);
          out.innerHTML = a11yTableHtml(rows);
          out._rows = rows;
        }
        modal.body.addEventListener("input", run);
        modal.body.addEventListener("change", run);
        modal.body.addEventListener("click", (ev) => {
          if (ev.target.closest('[data-act="export-csv"]')) {
            const csv = exportEtapasCsv(out._rows || all);
            downloadText("projetos-relatorio.csv", csv, "text/csv");
          }
        });
        run();
      },
      buttons: [{ text: "Fechar", onClick: (r) => r.close() }]
    });
  }

  // src/features/projetos/view/portfolio.js
  function openPortfolio({ includeArquivados: includeArquivados2 = false } = {}) {
    const tasks = portfolioToGanttTasks(sortProjetos(listProjetos(), { includeArquivados: includeArquivados2 }));
    openModal({
      title: "Portfolio de projetos",
      width: 900,
      content: '<div id="seiproPortfolioGantt" class="seipro-projetos__gantt"></div>',
      onOpen(modal) {
        const host = modal.body.querySelector("#seiproPortfolioGantt");
        const svg = document.createElement("svg");
        svg.id = "gantt_portfolio";
        host.appendChild(svg);
        loadGanttLib().then((Gantt) => {
          if (!Gantt || !tasks.length) {
            host.innerHTML = "<p>Nenhum projeto para exibir.</p>";
            return;
          }
          new Gantt("#gantt_portfolio", tasks, buildGanttOptions({ editable: false }));
        });
      },
      buttons: [{ text: "Fechar", onClick: (r) => r.close() }]
    });
  }
  function openResponsavelView() {
    const groups = groupByResponsavel(listProjetos());
    const html = groups.map(
      (g) => "<h4>" + escapeText(g.responsavel) + " (" + g.etapas.length + ")</h4>" + a11yTableHtml(g.etapas)
    ).join("") || "<p>Sem dados.</p>";
    openModal({
      title: "Visao por responsavel",
      width: 800,
      content: '<div class="seipro-projetos-responsavel">' + html + "</div>",
      buttons: [{ text: "Fechar", onClick: (r) => r.close() }]
    });
  }

  // src/features/projetos/view/panel.js
  var ganttInstances = /* @__PURE__ */ new Map();
  var tabsApi = null;
  var includeArquivados = false;
  var selectedTipo = "";
  var showExecucao = true;
  function mountPoint() {
    return qs("#divInfraAreaTelaD") || qs("#divInfraBarraLocalizacao") || qs("#divInfraAreaTela") || document.body;
  }
  function orderPanel(node) {
    if (typeof globalRef.orderDivPanel === "function") {
      try {
        globalRef.orderDivPanel(node.outerHTML, "", "projetosGantt");
        return qs("#projetosGantt");
      } catch (e) {
      }
    }
    const host = mountPoint();
    const old = qs("#projetosGantt");
    if (old) old.remove();
    host.appendChild(node);
    return node;
  }
  function refresh() {
    refreshProjetosPanel();
  }
  function renderGantt(container, projeto) {
    const host = container.querySelector(".seipro-projetos__gantt");
    const a11y = container.querySelector(".seipro-projetos__a11y");
    if (!host) return;
    host.innerHTML = "";
    const svg = document.createElement("svg");
    svg.id = "gantt_" + projeto.id_projeto;
    svg.className = "svg_gantt";
    host.appendChild(svg);
    const { tasks, holidayOpts, etapas } = projetoToGanttTasks(projeto, {
      showExecucao,
      showMacro: true,
      applySchedule: true,
      ignoreNonBusiness: false
    });
    if (a11y) a11y.innerHTML = a11yTableHtml(etapas);
    loadGanttLib().then((Gantt) => {
      if (!Gantt) return;
      const editable = can("update_projeto_etapa");
      const options = buildGanttOptions({
        editable,
        holidayOpts,
        popup: (ctx) => buildPopup(ctx, { onSaved: refresh }),
        onDateChange(task, start, end) {
          if (!confirm("Reprogramar etapa e dependentes?")) {
            refresh();
            return;
          }
          const patch = taskDatesToEtapaPatch({ ...task, _start: start, _end: end });
          act("update_projeto_etapa", {
            id_projeto: projeto.id_projeto,
            id_etapa: patch.id_etapa,
            data_inicio_programado: formatDateTime(patch.data_inicio_programado),
            data_fim_programado: formatDateTime(patch.data_fim_programado)
          }).then(refresh);
        },
        onProgressChange(task, progress) {
          act("update_projeto_etapa", {
            id_projeto: projeto.id_projeto,
            id_etapa: Number(String(task.id).replace(/_exec$/, "")),
            progresso_execucao: progress
          });
        }
      });
      const g = new Gantt("#" + svg.id, tasks, options);
      ganttInstances.set(projeto.id_projeto, g);
    }).catch((err2) => {
      host.innerHTML = '<p class="seipro-projetos__error">Nao foi possivel carregar o Gantt: ' + String(err2.message || err2) + "</p>";
    });
  }
  function renderAlerts(root, projetos) {
    const box = root.querySelector("#projetosAlerts");
    if (!box) return;
    const alerts = deadlineAlerts(flattenEtapas(projetos));
    if (!alerts.length) {
      box.innerHTML = "";
      box.hidden = true;
      return;
    }
    box.hidden = false;
    box.innerHTML = alerts.slice(0, 8).map(
      (a) => '<div class="seipro-projetos__alert seipro-projetos__alert--' + a.level + '">' + escapeText(a.nome_etapa) + ": " + escapeText(a.message) + "</div>"
    ).join("");
  }
  function fillTipoSelect(root, projetos) {
    const sel = root.querySelector("#selectTipoProjetoPro");
    if (!sel) return;
    const tipos = tiposOptions(projetos, getStoreProjetos().tipos_projetos);
    sel.innerHTML = '<option value="">Todos</option>' + tipos.map(
      (t) => '<option value="' + t.id_tipo_projeto + '"' + (String(selectedTipo) === String(t.id_tipo_projeto) ? " selected" : "") + ">" + escapeText(t.nome_tipo_projeto) + "</option>"
    ).join("");
  }
  function renderTabs(root, projetos) {
    const host = root.querySelector("#projetosTabs");
    if (!host) return;
    ganttInstances.clear();
    if (tabsApi) {
      try {
        tabsApi.destroy();
      } catch (e) {
      }
      tabsApi = null;
    }
    if (!projetos.length) {
      host.innerHTML = emptyStateHtml();
      return;
    }
    const items = projetos.map((p) => {
      const toolbar = '<div class="seipro-projetos__proj-toolbar">' + (can("save_projeto_etapa") ? '<button type="button" class="newLink" data-act="add-etapa" data-id_projeto="' + p.id_projeto + '" title="Adicionar etapa"><i class="fas fa-plus-circle"></i></button>' : "") + (can("edit_projeto") ? '<button type="button" class="newLink" data-act="edit-projeto" data-id_projeto="' + p.id_projeto + '" title="Editar"><i class="fas fa-edit"></i></button>' : "") + (can("clone_projeto") ? '<button type="button" class="newLink" data-act="clone-projeto" data-id_projeto="' + p.id_projeto + '" title="Clonar"><i class="fas fa-clone"></i></button>' : "") + (can("archive_projeto") ? '<button type="button" class="newLink" data-act="archive-projeto" data-id_projeto="' + p.id_projeto + '" title="Arquivar"><i class="fas fa-archive"></i></button>' : "") + (can("share_projeto") ? '<button type="button" class="newLink" data-act="share-projeto" data-id_projeto="' + p.id_projeto + '" title="Compartilhar"><i class="fas fa-share-square"></i></button>' : "") + (can("delete_projeto") ? '<button type="button" class="newLink" data-act="delete-projeto" data-id_projeto="' + p.id_projeto + '" title="Excluir"><i class="fas fa-trash"></i></button>' : "") + (!p.ativo ? '<span class="seipro-projetos__tag">ARQUIVADO</span>' : "") + "</div>";
      const content = toolbar + '<div class="seipro-projetos__gantt"></div><details class="seipro-projetos__a11y-wrap"><summary>Tabela acessivel</summary><div class="seipro-projetos__a11y"></div></details>';
      return {
        id: String(p.id_projeto),
        label: p.nome_projeto + (p.sigla_unidade ? " [" + p.sigla_unidade + "]" : ""),
        content
      };
    });
    tabsApi = createTabs(host, {
      items,
      onChange(id) {
        const p = findProjeto(projetos, id);
        const panel2 = host.querySelector("#seipro-panel-" + id);
        if (p && panel2) renderGantt(panel2, p);
      }
    });
    const first = projetos[0];
    const panel = host.querySelector("#seipro-panel-" + first.id_projeto);
    if (panel) renderGantt(panel, first);
  }
  function refreshProjetosPanel() {
    const root = qs("#projetosGantt");
    if (!root) return;
    const projetos = sortProjetos(listProjetos(), {
      includeArquivados,
      idTipo: selectedTipo || null
    });
    fillTipoSelect(root, listProjetos());
    renderAlerts(root, projetos);
    renderTabs(root, projetos);
  }
  function onPanelClick(ev) {
    const btn = ev.target.closest("[data-act]");
    if (!btn) return;
    const root = qs("#projetosGantt");
    if (!root || !root.contains(btn)) return;
    const actName = btn.dataset.act;
    const id = Number(btn.dataset.id_projeto);
    if (actName === "toggle-panel") {
      const body = qs("#projetosGanttDiv");
      if (body) body.style.display = body.style.display === "none" ? "inline-table" : "none";
      return;
    }
    if (actName === "add-projeto") return openProjetoForm(null, { onSaved: refresh });
    if (actName === "edit-projeto") {
      const p = findProjeto(listProjetos(), id);
      if (p) openProjetoForm(p, { onSaved: refresh });
      return;
    }
    if (actName === "add-etapa") {
      const p = findProjeto(listProjetos(), id);
      if (p) openEtapaForm(p, {}, { onSaved: refresh });
      return;
    }
    if (actName === "clone-projeto") {
      act("clone_projeto", { id_projeto: id }).then(refresh);
      return;
    }
    if (actName === "archive-projeto") {
      act("archive_projeto", { id_projeto: id }).then(refresh);
      return;
    }
    if (actName === "delete-projeto") {
      if (!confirm("Excluir este projeto?")) return;
      act("delete_projeto", { id_projeto: id }).then(refresh);
      return;
    }
    if (actName === "share-projeto") {
      const p = findProjeto(listProjetos(), id);
      if (p) openShare(p, { onSaved: refresh });
      return;
    }
    if (actName === "open-filter") return openFilterReport();
    if (actName === "open-portfolio") return openPortfolio({ includeArquivados });
    if (actName === "open-responsavel") return openResponsavelView();
    if (actName === "toggle-arquivados") {
      includeArquivados = !includeArquivados;
      refresh();
      return;
    }
    if (actName === "refresh") return refresh();
    if (actName === "seed-demo") {
      ensureDemoSeed(true);
      refresh();
      return;
    }
    if (actName === "export-json") {
      downloadText("projetos.json", JSON.stringify(listProjetos(), null, 2), "application/json");
      return;
    }
    if (actName === "import-json") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json,.json";
      input.onchange = () => {
        const file = input.files && input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = importProjetoJson(String(reader.result));
            if (Array.isArray(data)) {
              data.forEach((p) => act("import_projeto", { projeto: exportProjetoJson(p) }));
            } else {
              act("import_projeto", { projeto: exportProjetoJson(data) });
            }
            setTimeout(refresh, 50);
          } catch (e) {
            alert(e.message || "Falha ao importar");
          }
        };
        reader.readAsText(file);
      };
      input.click();
    }
  }
  function onPanelChange(ev) {
    const sel = ev.target.closest("#selectTipoProjetoPro");
    if (!sel) return;
    selectedTipo = sel.value;
    refresh();
  }
  function setProjetosPanel() {
    ensureDemoSeed(false);
    let root = qs("#projetosGantt");
    if (!root) {
      root = elFromHtml(panelShellHtml());
      root = orderPanel(root) || qs("#projetosGantt") || root;
    }
    refreshProjetosPanel();
  }
  function initProjetosPanel(timeout = 9e3) {
    if (timeout <= 0) return;
    if (qs("#ifrArvore") && window !== window.top) return;
    try {
      const enabled = typeof globalRef.checkConfigValue === "function" ? globalRef.checkConfigValue("gerenciarprojetos") : typeof globalRef.verifyConfigValue === "function" ? globalRef.verifyConfigValue("gerenciarprojetos") : true;
      if (!enabled) return;
    } catch (e) {
    }
    if (!document.body) {
      setTimeout(() => initProjetosPanel(timeout - 100), 100);
      return;
    }
    setProjetosPanel();
  }
  function bindProjetosPanel(root = document) {
    on(root, "click", onPanelClick);
    on(root, "change", onPanelChange);
  }
  function installProjetosView() {
    bindProjetosPanel(document);
    ready(() => {
      setTimeout(() => initProjetosPanel(), 400);
    });
  }
  function initProjetos(mode, arrayProjetos, queryIdProjeto) {
    let list = arrayProjetos;
    if (!Array.isArray(list)) {
      const cfg = globalRef.arrayConfigAtividades;
      list = cfg && Array.isArray(cfg.projetos) ? cfg.projetos : null;
    }
    if (Array.isArray(list) && list.length) {
      const cfg = globalRef.arrayConfigAtividades;
      replaceProjetos(list, cfg && cfg.tipos_projetos);
    }
    if (mode === "refresh" || mode === "update" || qs("#projetosGantt")) {
      refreshProjetosPanel();
    } else {
      initProjetosPanel();
    }
    if (queryIdProjeto) {
      setTimeout(() => selectProjetoTab(queryIdProjeto), 250);
    }
  }
  function setProjetos(mode, arrayProjetos, queryIdProjeto) {
    initProjetos(mode, arrayProjetos, queryIdProjeto);
  }
  function selectProjetoTab(idProjeto) {
    const id = String(idProjeto);
    if (tabsApi && typeof tabsApi.select === "function") {
      tabsApi.select(id);
      return;
    }
    const btn = qs('#projetosTabs [role="tab"][data-tab-id="' + id + '"]');
    if (btn) btn.click();
  }

  // src/features/projetos/boot.js
  function bootProjetos(timeout = 9e3) {
    installProjetosStore();
    if (timeout <= 0) return;
    const enabled = (() => {
      try {
        if (typeof globalRef.checkConfigValue === "function") return !!globalRef.checkConfigValue("gerenciarprojetos");
        if (typeof globalRef.verifyConfigValue === "function") return !!globalRef.verifyConfigValue("gerenciarprojetos");
      } catch (e) {
      }
      return true;
    })();
    if (!enabled) return;
    if (window.frameElement) return;
    ensureDemoSeed(false);
    try {
      initProjetosPanel(timeout);
    } catch (e) {
      setTimeout(() => bootProjetos(timeout - 200), 200);
    }
  }
  function refreshAfterAtividades(arrayProjetos) {
    if (Array.isArray(arrayProjetos)) replaceProjetos(arrayProjetos);
    refreshProjetosPanel();
  }

  // src/features/projetos/commands.js
  function checkPermissionProjeto(value) {
    if (!value) return true;
    if (!hasRemoteBackend()) return true;
    try {
      if (typeof globalRef.arrayConfigAtivUnidade !== "undefined" && globalRef.arrayConfigAtivUnidade && value.sigla_unidade && globalRef.arrayConfigAtivUnidade.sigla_unidade === value.sigla_unidade) {
        return true;
      }
      const shares = value.projetos_compartilhados || [];
      const login = (globalRef.userSEI || "").toLowerCase();
      return shares.some(
        (s) => String(s.usuario || "").toLowerCase() === login && (s.permissao === "edicao" || s.permissao === "escrita" || s.permissao === "admin")
      );
    } catch (e) {
      return true;
    }
  }

  // src/features/projetos/legacy-api.js
  var legacy = {
    initProjetos,
    setProjetos,
    initProjetosPanel,
    setProjetosPanel,
    refreshProjetosPanel,
    selectProjetoTab,
    bootProjetos,
    refreshAfterAtividades,
    openProjetoForm,
    openEtapaForm,
    dispatchProjetoAction,
    ensureDemoSeed,
    getStoreProjetos,
    listProjetos,
    replaceProjetos,
    checkPermissionProjeto,
    // Legacy names still referenced from atividades / inline remnants
    saveProjeto: (el2) => openProjetoForm(),
    saveEtapa: (el2) => {
      const id = el2 && el2.dataset ? Number(el2.dataset.id_projeto) : 0;
      const p = listProjetos().find((x) => x.id_projeto === id);
      if (p) openEtapaForm(p, {});
    },
    openProjetoConfig: () => openProjetoForm(),
    openFilterProjeto: () => {
      const btn = document.querySelector('#projetosGantt [data-act="open-filter"]');
      if (btn) btn.click();
    }
  };
  function installProjetosLegacyApi() {
    Object.keys(legacy).forEach((name) => aliasGlobal(name, legacy[name]));
    aliasGlobal("loadProjetosPro", true);
  }

  // src/features/projetos/domain/index.js
  var domain_exports = {};
  __export(domain_exports, {
    addBusinessDays: () => addBusinessDays,
    addDays: () => addDays,
    autoProgressPercent: () => autoProgressPercent,
    barStatus: () => barStatus,
    baselineDeviation: () => baselineDeviation,
    cascadeMove: () => cascadeMove,
    cloneProjetoDeep: () => cloneProjetoDeep,
    computeSchedule: () => computeSchedule,
    countBusinessDays: () => countBusinessDays,
    deadlineAlerts: () => deadlineAlerts,
    defaultStore: () => defaultStore,
    diffDays: () => diffDays,
    effectiveProgress: () => effectiveProgress,
    emptyDateSentinel: () => emptyDateSentinel,
    expectedProgress: () => expectedProgress,
    exportEtapasCsv: () => exportEtapasCsv,
    exportProjetoJson: () => exportProjetoJson,
    filterEtapas: () => filterEtapas,
    findEtapa: () => findEtapa,
    findEtapaById: () => findEtapaById,
    findEtapaNome: () => findEtapaNome,
    findProjeto: () => findProjeto,
    findProjetoById: () => findProjetoById,
    flattenEtapas: () => flattenEtapas,
    formatDate: () => formatDate,
    formatDateTime: () => formatDateTime,
    formatDateTimeLocal: () => formatDateTimeLocal,
    formatDisplay: () => formatDisplay,
    ganttHolidayOptions: () => ganttHolidayOptions,
    groupByResponsavel: () => groupByResponsavel,
    holidaysBetween: () => holidaysBetween,
    holidaysBr: () => holidaysBr,
    importProjetoJson: () => importProjetoJson,
    isBusinessDay: () => isBusinessDay,
    isEmptyDate: () => isEmptyDate,
    isHoliday: () => isHoliday,
    isSameDay: () => isSameDay,
    isWeekend: () => isWeekend,
    macroetapaSummaries: () => macroetapaSummaries,
    maxDate: () => maxDate,
    minDate: () => minDate,
    nextBusinessDay: () => nextBusinessDay,
    nextLocalId: () => nextLocalId,
    normalizeEtapa: () => normalizeEtapa,
    normalizePredecessoras: () => normalizePredecessoras,
    normalizeProjeto: () => normalizeProjeto,
    parseDate: () => parseDate,
    resetLocalIdSeq: () => resetLocalIdSeq,
    sortEtapas: () => sortEtapas,
    sortProjetos: () => sortProjetos,
    startOfDay: () => startOfDay,
    tiposFromProjetos: () => tiposFromProjetos,
    tiposOptions: () => tiposOptions,
    today: () => today,
    topologicalSort: () => topologicalSort,
    uniqueFieldValues: () => uniqueFieldValues,
    validateEtapaDates: () => validateEtapaDates
  });

  // src/features/projetos/index.js
  var ns = getSeiPro().features.projetos || (getSeiPro().features.projetos = {});
  ns.domain = domain_exports;
  installProjetosStore();
  installProjetosLegacyApi();
  installProjetosView();
  bootProjetos();
})();
