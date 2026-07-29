/**
 * Projetos — model normalization (projeto / etapa).
 * Preserves legacy field names for backend compatibility.
 */
import { emptyDateSentinel, formatDateTime, isEmptyDate, parseDate } from './datas.js';

let _seq = 1;
export function nextLocalId(prefix = '') {
    return Number(String(Date.now()).slice(-8) + String(_seq++).padStart(3, '0'));
}

export function resetLocalIdSeq() {
    _seq = 1;
}

function num(v, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}

function str(v, fallback = '') {
    return v == null ? fallback : String(v);
}

function bool(v, fallback = true) {
    if (v == null) return fallback;
    if (typeof v === 'boolean') return v;
    if (v === 'true' || v === 1 || v === '1') return true;
    if (v === 'false' || v === 0 || v === '0') return false;
    return !!v;
}

/** Normalize predecessor list; falls back to scalar id_dependencia. */
export function normalizePredecessoras(etapa) {
    if (Array.isArray(etapa.predecessoras) && etapa.predecessoras.length) {
        return etapa.predecessoras.map((p) => ({
            id_etapa: num(p.id_etapa),
            tipo: ['FS', 'SS', 'FF', 'SF'].includes(p.tipo) ? p.tipo : 'FS',
            lag_dias: num(p.lag_dias, 0)
        })).filter((p) => p.id_etapa);
    }
    const dep = num(etapa.id_dependencia, 0);
    if (dep) return [{ id_etapa: dep, tipo: 'FS', lag_dias: 0 }];
    return [];
}

export function normalizeEtapa(raw = {}, idProjeto = 0) {
    const id_etapa = num(raw.id_etapa) || nextLocalId('e');
    const predecessoras = normalizePredecessoras(raw);
    const id_dependencia = predecessoras.length ? predecessoras[0].id_etapa : (num(raw.id_dependencia, 0) || false);
    return {
        id_etapa,
        id_projeto: num(raw.id_projeto, idProjeto) || idProjeto,
        nome_etapa: str(raw.nome_etapa, 'Nova etapa'),
        id_dependencia,
        predecessoras,
        data_inicio_programado: isEmptyDate(raw.data_inicio_programado)
            ? emptyDateSentinel()
            : formatDateTime(raw.data_inicio_programado),
        data_fim_programado: isEmptyDate(raw.data_fim_programado)
            ? emptyDateSentinel()
            : formatDateTime(raw.data_fim_programado),
        data_inicio_execucao: isEmptyDate(raw.data_inicio_execucao)
            ? emptyDateSentinel()
            : formatDateTime(raw.data_inicio_execucao),
        data_fim_execucao: isEmptyDate(raw.data_fim_execucao)
            ? emptyDateSentinel()
            : formatDateTime(raw.data_fim_execucao),
        data_inicio_progresso_automatico: isEmptyDate(raw.data_inicio_progresso_automatico)
            ? emptyDateSentinel()
            : formatDateTime(raw.data_inicio_progresso_automatico),
        data_fim_progresso_automatico: isEmptyDate(raw.data_fim_progresso_automatico)
            ? emptyDateSentinel()
            : formatDateTime(raw.data_fim_progresso_automatico),
        progresso_execucao: Math.max(0, Math.min(100, num(raw.progresso_execucao, 0))),
        macroetapa: str(raw.macroetapa),
        responsavel: str(raw.responsavel),
        grupo: str(raw.grupo),
        etiqueta: str(raw.etiqueta),
        checklist: Array.isArray(raw.checklist) ? raw.checklist : (raw.checklist || []),
        observacoes: str(raw.observacoes),
        documento_relacionado: str(raw.documento_relacionado),
        id_documento_sei: raw.id_documento_sei || false,
        documento_sei: str(raw.documento_sei),
        id_demandas: raw.id_demandas || [],
        id_demandas_titles: raw.id_demandas_titles || [],
        data_pausa: isEmptyDate(raw.data_pausa) ? emptyDateSentinel() : formatDateTime(raw.data_pausa),
        data_retomada: isEmptyDate(raw.data_retomada) ? emptyDateSentinel() : formatDateTime(raw.data_retomada),
        marco: bool(raw.marco, false),
        calendario: raw.calendario === 'util' ? 'util' : 'corrido'
    };
}

export function normalizeProjeto(raw = {}) {
    const id_projeto = num(raw.id_projeto) || nextLocalId('p');
    const etapas = Array.isArray(raw.etapas)
        ? raw.etapas.map((e) => normalizeEtapa(e, id_projeto))
        : [];
    return {
        id_projeto,
        nome_projeto: str(raw.nome_projeto, 'Novo projeto'),
        id_tipo_projeto: num(raw.id_tipo_projeto, 0),
        nome_tipo_projeto: str(raw.nome_tipo_projeto),
        processo_sei: raw.processo_sei || false,
        id_procedimento: raw.id_procedimento || false,
        ativo: bool(raw.ativo, true),
        sigla_unidade: str(raw.sigla_unidade),
        id_unidade: num(raw.id_unidade, 0),
        etapas,
        projetos_compartilhados: Array.isArray(raw.projetos_compartilhados)
            ? raw.projetos_compartilhados
            : []
    };
}

export function defaultStore() {
    return {
        version: 1,
        projetos: [],
        tipos_projetos: [],
        updated_at: formatDateTime(new Date())
    };
}

export function findProjeto(projetos, id) {
    const idn = num(id);
    return (projetos || []).find((p) => p.id_projeto === idn) || null;
}

export function findEtapa(projeto, idEtapa) {
    if (!projeto || !Array.isArray(projeto.etapas)) return null;
    const idn = num(idEtapa);
    return projeto.etapas.find((e) => e.id_etapa === idn) || null;
}

export function cloneProjetoDeep(projeto, overrides = {}) {
    const base = normalizeProjeto(JSON.parse(JSON.stringify(projeto || {})));
    const id_projeto = overrides.id_projeto || nextLocalId('p');
    base.id_projeto = id_projeto;
    if (overrides.nome_projeto) base.nome_projeto = overrides.nome_projeto;
    else base.nome_projeto = (base.nome_projeto || 'Projeto') + ' (copia)';
    const idMap = new Map();
    base.etapas = base.etapas.map((e) => {
        const novo = nextLocalId('e');
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

export function validateEtapaDates(etapa) {
    const start = parseDate(etapa.data_inicio_programado);
    const end = parseDate(etapa.data_fim_programado);
    if (!start || !end) return { ok: false, error: 'Datas programadas obrigatorias' };
    if (end.getTime() < start.getTime()) return { ok: false, error: 'Fim anterior ao inicio' };
    return { ok: true };
}

export function tiposFromProjetos(projetos) {
    const map = new Map();
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
