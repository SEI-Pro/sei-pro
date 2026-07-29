/**
 * Projetos — local-first store (localStorage write-through).
 *
 * Resolves the 12 projeto actions locally. When a remote atividades backend is
 * available, io.js can sync; until then the panel works offline with demo seed.
 */
import { getSeiPro } from '../../core/global.js';
import { isJson } from '../../core/serial.js';
import {
    cloneProjetoDeep,
    defaultStore,
    findEtapa,
    findProjeto,
    normalizeEtapa,
    normalizeProjeto,
    nextLocalId,
    tiposFromProjetos,
    validateEtapaDates
} from './domain/model.js';
import { formatDateTime } from './domain/datas.js';
import { buildDemoProjetos, demoTipos } from './seed.js';

const STORE_KEY = 'configDataProjetosPro';
let storeState = null;
let storeLastRaw = null;

export function getStoreProjetos() {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw === storeLastRaw && storeState !== null) return storeState;
    const parsed = (raw && isJson(raw)) ? JSON.parse(raw) : false;
    if (parsed && Array.isArray(parsed.projetos)) {
        storeState = {
            version: parsed.version || 1,
            projetos: parsed.projetos.map((p) => normalizeProjeto(p)),
            tipos_projetos: parsed.tipos_projetos || tiposFromProjetos(parsed.projetos),
            updated_at: parsed.updated_at || formatDateTime(new Date()),
            seeded: !!parsed.seeded
        };
    } else {
        storeState = defaultStore();
    }
    storeLastRaw = raw;
    return storeState;
}

export function persistStoreProjetos(store) {
    storeState = store || getStoreProjetos();
    storeState.updated_at = formatDateTime(new Date());
    storeLastRaw = JSON.stringify(storeState);
    localStorage.setItem(STORE_KEY, storeLastRaw);
    return storeState;
}

/** Ensure demo data exists once (local-first smoke). */
export function ensureDemoSeed(force = false) {
    const store = getStoreProjetos();
    if (!force && store.projetos.length > 0) return store;
    if (!force && store.seeded) return store;
    store.projetos = buildDemoProjetos();
    store.tipos_projetos = demoTipos();
    store.seeded = true;
    return persistStoreProjetos(store);
}

export function listProjetos() {
    return getStoreProjetos().projetos.slice();
}

export function replaceProjetos(projetos, tipos) {
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
    return { status: 0, status_txt: msg || 'Erro ao processar projeto' };
}

/**
 * Dispatch a projeto action locally (same action names as getServerAtividades).
 */
export function dispatchProjetoAction(param = {}) {
    const action = param.action;
    const store = getStoreProjetos();

    if (action === 'save_projeto') {
        const projeto = normalizeProjeto({
            id_projeto: 0,
            nome_projeto: param.nome_projeto,
            id_tipo_projeto: param.id_tipo_projeto,
            nome_tipo_projeto: param.nome_tipo_projeto,
            processo_sei: param.processo_sei,
            id_procedimento: param.id_procedimento,
            ativo: true,
            sigla_unidade: param.sigla_unidade || '',
            etapas: []
        });
        projeto.id_projeto = nextLocalId('p');
        store.projetos.push(projeto);
        store.tipos_projetos = tiposFromProjetos(store.projetos);
        persistStoreProjetos(store);
        return ok([projeto], { id_projeto: projeto.id_projeto });
    }

    if (action === 'edit_projeto') {
        const p = findProjeto(store.projetos, param.id_projeto);
        if (!p) return err('Projeto nao encontrado');
        p.nome_projeto = param.nome_projeto || p.nome_projeto;
        p.id_tipo_projeto = param.id_tipo_projeto != null ? Number(param.id_tipo_projeto) : p.id_tipo_projeto;
        p.nome_tipo_projeto = param.nome_tipo_projeto || p.nome_tipo_projeto;
        p.processo_sei = param.processo_sei !== undefined ? param.processo_sei : p.processo_sei;
        p.id_procedimento = param.id_procedimento !== undefined ? param.id_procedimento : p.id_procedimento;
        persistStoreProjetos(store);
        return ok([p], { id_projeto: p.id_projeto });
    }

    if (action === 'save_etapa' || action === 'save_projeto_etapa') {
        const p = findProjeto(store.projetos, param.id_projeto);
        if (!p) return err('Projeto nao encontrado');
        const etapa = normalizeEtapa({
            ...param,
            id_etapa: 0,
            id_projeto: p.id_projeto
        }, p.id_projeto);
        etapa.id_etapa = nextLocalId('e');
        const v = validateEtapaDates(etapa);
        if (!v.ok) return err(v.error);
        p.etapas.push(etapa);
        persistStoreProjetos(store);
        return ok([p], { id_projeto: p.id_projeto, id_etapa: etapa.id_etapa });
    }

    if (action === 'update_projeto_etapa' || action === 'edit_etapa') {
        const p = findProjeto(store.projetos, param.id_projeto);
        if (!p) return err('Projeto nao encontrado');
        const e = findEtapa(p, param.id_etapa);
        if (!e) return err('Etapa nao encontrada');
        const fields = [
            'nome_etapa', 'id_dependencia', 'predecessoras', 'data_inicio_programado',
            'data_fim_programado', 'data_inicio_execucao', 'data_fim_execucao',
            'data_inicio_progresso_automatico', 'data_fim_progresso_automatico',
            'progresso_execucao', 'macroetapa', 'responsavel', 'grupo', 'etiqueta',
            'checklist', 'observacoes', 'documento_relacionado', 'id_documento_sei',
            'documento_sei', 'id_demandas', 'marco', 'calendario', 'data_pausa', 'data_retomada'
        ];
        for (const f of fields) {
            if (param[f] !== undefined) e[f] = param[f];
        }
        const normalized = normalizeEtapa(e, p.id_projeto);
        Object.assign(e, normalized);
        persistStoreProjetos(store);
        return ok([p], { id_projeto: p.id_projeto, id_etapa: e.id_etapa });
    }

    if (action === 'delete_projeto_etapa') {
        const p = findProjeto(store.projetos, param.id_projeto);
        if (!p) return err('Projeto nao encontrado');
        p.etapas = p.etapas.filter((e) => e.id_etapa !== Number(param.id_etapa));
        persistStoreProjetos(store);
        return ok([p], { id_projeto: p.id_projeto });
    }

    if (action === 'delete_projeto') {
        store.projetos = store.projetos.filter((p) => p.id_projeto !== Number(param.id_projeto));
        persistStoreProjetos(store);
        return ok([], { id_projeto: param.id_projeto });
    }

    if (action === 'clone_projeto') {
        const p = findProjeto(store.projetos, param.id_projeto);
        if (!p) return err('Projeto nao encontrado');
        const clone = cloneProjetoDeep(p);
        store.projetos.push(clone);
        persistStoreProjetos(store);
        return ok([clone], { id_projeto: clone.id_projeto });
    }

    if (action === 'archive_projeto') {
        const p = findProjeto(store.projetos, param.id_projeto);
        if (!p) return err('Projeto nao encontrado');
        p.ativo = param.ativo != null ? !!param.ativo : !p.ativo;
        persistStoreProjetos(store);
        return ok([p], { id_projeto: p.id_projeto });
    }

    if (action === 'share_projeto') {
        const p = findProjeto(store.projetos, param.id_projeto);
        if (!p) return err('Projeto nao encontrado');
        p.projetos_compartilhados = Array.isArray(param.projetos_compartilhados)
            ? param.projetos_compartilhados
            : (p.projetos_compartilhados || []);
        persistStoreProjetos(store);
        return ok([p], { id_projeto: p.id_projeto });
    }

    if (action === 'import_projeto') {
        try {
            const projeto = normalizeProjeto(param.projeto || param);
            projeto.id_projeto = nextLocalId('p');
            store.projetos.push(projeto);
            persistStoreProjetos(store);
            return ok([projeto], { id_projeto: projeto.id_projeto });
        } catch (e) {
            return err(e.message || 'Falha ao importar');
        }
    }

    return err('Acao desconhecida: ' + action);
}

export function installProjetosStore() {
    const ns = getSeiPro().features.projetos || (getSeiPro().features.projetos = {});
    ns.store = {
        getStoreProjetos,
        persistStoreProjetos,
        ensureDemoSeed,
        listProjetos,
        replaceProjetos,
        dispatchProjetoAction
    };
    return ns.store;
}

/** Local-first: always allow capacities when no remote backend. */
export const LOCAL_CAPACIDADES = [
    'view_projetos',
    'save_projeto',
    'edit_projeto',
    'save_projeto_etapa',
    'update_projeto_etapa',
    'delete_projeto',
    'delete_projeto_etapa',
    'clone_projeto',
    'archive_projeto',
    'share_projeto'
];

export function hasLocalCapacidade(name) {
    return LOCAL_CAPACIDADES.includes(name);
}
