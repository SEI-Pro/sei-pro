/**
 * Atividades — adaptadores públicos e integração com Projetos.
 *
 * Domínio compartilhado fica em shared/nomenclatura.js e domain.js; esta
 * camada preserva somente as assinaturas globais que o SEI legado consome.
 */
import {
    getAppsScriptUrlAtiv as domainGetAppsScriptUrlAtiv,
    getLabIdTables as domainGetLabIdTables,
    getNumMonthsBetween2Dates as domainGetNumMonthsBetween2Dates
} from './domain.js';
import { getName as sharedGetName, getNameGenre as sharedGetNameGenre } from '../../shared/nomenclatura.js';

export function getName(ref_nomenclatura, name_default, singular = true, with_article = false, capitalize = false) {
    return sharedGetName(ref_nomenclatura, name_default, singular, with_article, capitalize);
}

export function getNameGenre(ref_nomenclatura, string_male, string_female) {
    return sharedGetNameGenre(ref_nomenclatura, string_male, string_female);
}

export function getAppsScriptUrlAtiv() {
    return domainGetAppsScriptUrlAtiv({
        getSEIProAppsScriptUrl: typeof globalThis.getSEIProAppsScriptUrl === 'function'
            ? globalThis.getSEIProAppsScriptUrl
            : undefined,
        fallbackUrl: typeof globalThis.SEI_PRO_APPS_SCRIPT_URL !== 'undefined'
            ? globalThis.SEI_PRO_APPS_SCRIPT_URL
            : undefined
    });
}

export function getLabIdTables(type) {
    return domainGetLabIdTables(type);
}

export function getNumMonthsBetween2Dates(value) {
    return domainGetNumMonthsBetween2Dates(value, { moment: globalThis.moment });
}

/**
 * Ponte transitória entre Atividades e Projetos. A feature não importa a
 * implementação de Projetos; o contrato permanece explícito e tolerante ao
 * carregamento independente das duas entries.
 */
export function syncProjetosFeatureFromAtividades(projetos, opts = {}) {
    var list = Array.isArray(projetos) ? projetos : [];
    var tipos = opts.tipos || null;
    try {
        if (typeof replaceProjetos === 'function' && list.length) {
            replaceProjetos(list, tipos);
        }
    } catch (e) { /* feature may not be loaded yet */ }
    try {
        if (typeof initProjetos === 'function') {
            initProjetos(opts.mode || 'refresh', list, opts.id_projeto);
        } else if (typeof refreshProjetosPanel === 'function') {
            refreshProjetosPanel();
        }
    } catch (e2) { /* noop */ }
    if (opts.id_projeto && typeof selectProjetoTab === 'function') {
        setTimeout(function () { selectProjetoTab(opts.id_projeto); }, 200);
    }
}
