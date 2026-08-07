/**
 * Identify SEI page / extension context from a URL (ADR-0003 fatia 1.2).
 *
 * Mapping follows content_script purposes in manifest.base.json — the `acao=`
 * query param (and a few path patterns) decide which context owns the page.
 */
import { seiNamespace } from './namespace.js';
import type { IdentifiedPageContext } from '../types/architecture.js';

export type SeiPageContext = IdentifiedPageContext;

export type SeiPageIdentity = {
    url: string;
    acao: string | null;
    acaoOrigem: string | null;
    /** Primary context for the page (most specific). */
    context: SeiPageContext;
    /** All contexts whose manifest matches would cover this URL. */
    contexts: SeiPageContext[];
    isSipLogin: boolean;
};

const LISTA_ACOES = new Set([
    'procedimento_trabalhar',
    'procedimento_controlar',
    'rel_bloco_protocolo_listar',
    'bloco_interno_listar',
    'procedimento_sobrestado_listar',
    'contato_listar',
    'bloco_reuniao_listar',
    'bloco_assinatura_listar',
    'acompanhamento_listar'
]);

const EDITOR_ACOES = new Set([
    'editor_montar',
    'texto_padrao_interno_alterar',
    'secao_modelo_alterar',
    'texto_padrao_interno_cadastrar'
]);

function readQueryParam(url: string, key: string): string | null {
    try {
        const parsed = new URL(url, 'https://sei.local');
        const value = parsed.searchParams.get(key);
        return value === null || value === '' ? null : value;
    } catch {
        const match = url.match(new RegExp('[?&]' + key + '=([^&#]*)'));
        if (!match) return null;
        try {
            const raw = match[1] ?? '';
            return decodeURIComponent(raw.replace(/\+/g, ' ')) || null;
        } catch {
            return match[1] ?? null;
        }
    }
}

function isSipLoginPath(url: string): boolean {
    return /\/sip\/login\.php/i.test(url) || /login\.php/i.test(url);
}

/**
 * Contexts that a content_script block in the manifest would load for this URL.
 * Order: most specific first for `context`.
 */
export function contextsForUrl(url: string): SeiPageContext[] {
    const acao = readQueryParam(url, 'acao');
    const acaoOrigem = readQueryParam(url, 'acaoOrigem') || readQueryParam(url, 'acao_origem');
    const contexts: SeiPageContext[] = [];

    if (isSipLoginPath(url) || acao === 'documento_assinar') {
        contexts.push('login');
    }
    if (EDITOR_ACOES.has(acao || '')) {
        contexts.push('editor');
    }
    if (acao === 'arvore_visualizar' || acao === 'arvore_processar_html') {
        contexts.push('arvore');
    }
    if (
        acao === 'documento_visualizar' ||
        acao === 'arvore_processar_html' ||
        (acao === 'documento_visualizar' && acaoOrigem === 'procedimento_visualizar')
    ) {
        contexts.push('documento');
    }
    if (acao === 'procedimento_visualizar') {
        contexts.push('visualizacao');
    }
    if (LISTA_ACOES.has(acao || '')) {
        contexts.push('lista');
    }
    // Broad "all pages" block covers controlador.php?acao=* (and sei/sip shells)
    if (acao || /\/sei\//i.test(url) || /\/sip\//i.test(url)) {
        contexts.push('all');
    }
    // db bundle also matches login/sei shells
    if (isSipLoginPath(url) || /\/sei\//i.test(url)) {
        contexts.push('db');
    }

    return contexts.length > 0 ? contexts : ['unknown'];
}

function primaryContext(contexts: SeiPageContext[]): SeiPageContext {
    const priority: SeiPageContext[] = [
        'editor',
        'documento',
        'arvore',
        'visualizacao',
        'lista',
        'login',
        'db',
        'all',
        'unknown'
    ];
    for (const candidate of priority) {
        if (contexts.includes(candidate)) return candidate;
    }
    return 'unknown';
}

export function identifyPage(url: string): SeiPageIdentity {
    const acao = readQueryParam(url, 'acao');
    const acaoOrigem = readQueryParam(url, 'acao_origem') || readQueryParam(url, 'acaoOrigem');
    const contexts = contextsForUrl(url);
    return {
        url,
        acao,
        acaoOrigem,
        context: primaryContext(contexts),
        contexts,
        isSipLogin: isSipLoginPath(url)
    };
}

export function installPages() {
    const api = { identifyPage, contextsForUrl };
    seiNamespace().pages = api;
    return api;
}
