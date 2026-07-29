/**
 * Projetos — selection / sort / report filters (replaces jmespath usage).
 */
import { parseDate } from './datas.js';

export function sortProjetos(projetos, { includeArquivados = false, idTipo = null } = {}) {
    let list = Array.isArray(projetos) ? projetos.slice() : [];
    if (idTipo != null && idTipo !== '' && idTipo !== false) {
        const idn = Number(idTipo);
        list = list.filter((p) => p.id_tipo_projeto === idn);
    }
    if (!includeArquivados) {
        list = list.filter((p) => p.ativo !== false);
    }
    return list.sort((a, b) => String(a.nome_projeto || '').localeCompare(String(b.nome_projeto || ''), 'pt-BR'));
}

export function sortEtapas(etapas, orderBy = 'data_inicio') {
    const list = Array.isArray(etapas) ? etapas.slice() : [];
    if (orderBy === 'nome_etapa') {
        return list.sort((a, b) => String(a.nome_etapa || '').localeCompare(String(b.nome_etapa || ''), 'pt-BR'));
    }
    if (orderBy === 'id_etapa') {
        return list.sort((a, b) => (a.id_etapa || 0) - (b.id_etapa || 0));
    }
    // data_inicio (default)
    return list.sort((a, b) => {
        const aa = parseDate(a.data_inicio_programado);
        const bb = parseDate(b.data_inicio_programado);
        if (!aa && !bb) return 0;
        if (!aa) return 1;
        if (!bb) return -1;
        return aa - bb;
    });
}

export function findProjetoById(projetos, id) {
    const idn = Number(id);
    return (projetos || []).find((p) => p.id_projeto === idn) || null;
}

export function findEtapaById(projeto, idEtapa) {
    if (!projeto || !Array.isArray(projeto.etapas)) return null;
    const idn = Number(idEtapa);
    return projeto.etapas.find((e) => e.id_etapa === idn) || null;
}

export function findEtapaNome(projetos, idEtapa) {
    const idn = Number(idEtapa);
    for (const p of projetos || []) {
        const e = (p.etapas || []).find((x) => x.id_etapa === idn);
        if (e) return e.nome_etapa;
    }
    return '';
}

export function tiposOptions(projetos, tipos = []) {
    const map = new Map();
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
    return [...map.values()].sort((a, b) =>
        String(a.nome_tipo_projeto).localeCompare(String(b.nome_tipo_projeto), 'pt-BR')
    );
}

/**
 * Filter etapas for report: { responsavel, macroetapa, grupo, etiqueta, critico, atraso }.
 */
export function filterEtapas(etapas, filter = {}) {
    return (etapas || []).filter((e) => {
        if (filter.responsavel && e.responsavel !== filter.responsavel) return false;
        if (filter.macroetapa && e.macroetapa !== filter.macroetapa) return false;
        if (filter.grupo && e.grupo !== filter.grupo) return false;
        if (filter.etiqueta) {
            const tags = String(e.etiqueta || '').split(/[;,]/).map((t) => t.trim()).filter(Boolean);
            if (!tags.includes(filter.etiqueta)) return false;
        }
        if (filter.critico && !e.critico) return false;
        if (filter.atraso) {
            const end = parseDate(e.data_fim_programado);
            if (!end || end >= new Date() || e.progresso_execucao >= 100) return false;
        }
        if (filter.q) {
            const q = String(filter.q).toLowerCase();
            const hay = [e.nome_etapa, e.responsavel, e.macroetapa, e.grupo, e.observacoes]
                .join(' ')
                .toLowerCase();
            if (!hay.includes(q)) return false;
        }
        return true;
    });
}

export function uniqueFieldValues(etapas, field) {
    const set = new Set();
    for (const e of etapas || []) {
        const v = (e[field] || '').trim();
        if (v) set.add(v);
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

/** Flatten all etapas from projetos with projeto meta. */
export function flattenEtapas(projetos) {
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

/** Export projeto to plain JSON (deep clone, normalized). */
export function exportProjetoJson(projeto) {
    return JSON.parse(JSON.stringify(projeto || {}));
}

/** Export etapas as CSV string. */
export function exportEtapasCsv(etapas) {
    const cols = [
        'id_projeto', 'nome_projeto', 'id_etapa', 'nome_etapa', 'macroetapa', 'responsavel',
        'data_inicio_programado', 'data_fim_programado', 'progresso_execucao', 'critico', 'folga'
    ];
    const esc = (v) => {
        const s = v == null ? '' : String(v);
        return /["\n,;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const lines = [cols.join(';')];
    for (const e of etapas || []) {
        lines.push(cols.map((c) => esc(e[c])).join(';'));
    }
    return lines.join('\n');
}

/** Parse JSON import; returns projeto object or throws. */
export function importProjetoJson(text) {
    const data = typeof text === 'string' ? JSON.parse(text) : text;
    if (!data || typeof data !== 'object') throw new Error('JSON invalido');
    if (!data.nome_projeto && !data.etapas) throw new Error('Formato de projeto nao reconhecido');
    return data;
}
