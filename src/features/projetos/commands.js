/**
 * Projetos — commands / permissions helpers.
 */
import { globalRef } from '../../core/global.js';
import { hasLocalCapacidade } from './store.js';
import { hasRemoteBackend } from './io.js';
import { findProjeto } from './domain/model.js';
import { listProjetos } from './store.js';

export function checkPermissionProjeto(value) {
    if (!value) return true;
    if (!hasRemoteBackend()) return true;
    try {
        const feature = globalRef.SeiPro && globalRef.SeiPro.features && globalRef.SeiPro.features.atividades;
        const api = feature && feature.api;
        const state = api && api.state && typeof api.state.get === 'function' ? api.state.get() : {};
        if (state.arrayConfigAtivUnidade &&
            value.sigla_unidade &&
            state.arrayConfigAtivUnidade.sigla_unidade === value.sigla_unidade) {
            return true;
        }
        // Shared edit right
        const shares = value.projetos_compartilhados || [];
        const login = (globalRef.userSEI || '').toLowerCase();
        return shares.some((s) =>
            String(s.usuario || '').toLowerCase() === login &&
            (s.permissao === 'edicao' || s.permissao === 'escrita' || s.permissao === 'admin')
        );
    } catch (e) {
        return true;
    }
}

function getAtividadesCheckCapacidade() {
    const feature = globalRef.SeiPro && globalRef.SeiPro.features && globalRef.SeiPro.features.atividades;
    const api = feature && feature.api;
    if (api && api.queries && typeof api.queries.checkCapacidade === 'function') return api.queries.checkCapacidade;
    if (api && api.commands && typeof api.commands.checkCapacidade === 'function') return api.commands.checkCapacidade;
    return null;
}

export function checkCapacidadeProjeto(name) {
    const check = getAtividadesCheckCapacidade();
    if (check && hasRemoteBackend()) {
        try { return !!check(name); } catch (e) { /* fallthrough */ }
    }
    return hasLocalCapacidade(name);
}

export function valueProjeto(id) {
    return findProjeto(listProjetos(), id);
}
