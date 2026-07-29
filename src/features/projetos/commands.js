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
        if (typeof globalRef.arrayConfigAtivUnidade !== 'undefined' &&
            globalRef.arrayConfigAtivUnidade &&
            value.sigla_unidade &&
            globalRef.arrayConfigAtivUnidade.sigla_unidade === value.sigla_unidade) {
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

export function checkCapacidadeProjeto(name) {
    if (typeof globalRef.checkCapacidade === 'function' && hasRemoteBackend()) {
        try { return !!globalRef.checkCapacidade(name); } catch (e) { /* fallthrough */ }
    }
    return hasLocalCapacidade(name);
}

export function valueProjeto(id) {
    return findProjeto(listProjetos(), id);
}
