/**
 * SEI DOM selectors named by intention (ADR-0003).
 *
 * The rest of the codebase asks for a role (info panel, command bar, …);
 * version branching stays here. Literals must not leak outside `src/sei/`.
 */
import { seiNamespace, seiVersion } from './namespace.js';

/** Process / tree info panel. */
export const INFO_PANEL = {
    novo: '#divArvoreInformacao',
    legado: '#divInformacao'
} as const;

/** Primary SEI navigation menu root. */
export const MAIN_MENU = {
    novo: '#infraMenu',
    legado: '#main-menu'
} as const;

/** Prefix that scopes the main menu (sidebar vs left column). */
export const MENU_SCOPE_PREFIX = {
    novo: '#divInfraSidebarMenu ',
    legado: '#divInfraAreaTelaE '
} as const;

/** Anchor used to download / open the document from the tree info area. */
export const TREE_DOWNLOAD_ANCHOR = {
    novo: 'a.ancoraVisualizacaoArvore',
    legado: 'a.ancoraArvoreDownload'
} as const;

/** Toolbar of action buttons (command bar). */
export const COMMAND_BAR = {
    novo: '.barraBotoesSEI',
    legado: '.infraBarraComandos'
} as const;

/** Left half of the system chrome bar. */
export const SYSTEM_BAR_LEFT = {
    novo: '#divInfraBarraSistemaPadraoE',
    legado: '#divInfraBarraSistemaE'
} as const;

/** Right half of the system chrome bar. */
export const SYSTEM_BAR_RIGHT = {
    novo: '#divInfraBarraSistemaPadraoD',
    legado: '#divInfraBarraSistemaD'
} as const;

/** Filename fragment for the "internal document" icon. */
export const INTERNAL_DOC_ICON = {
    novo: 'documento_interno.svg',
    legado: 'sei_documento_interno.gif'
} as const;

/** Container of process-list command buttons (≥ 4.1.0 on new SEI). */
export const PROCESS_COMMANDS = {
    desde410: '#divBotoesControleProcessos',
    legado: '#divComandos'
} as const;

/** Document visualization iframe element id (no `#`). */
export const VISUALIZATION_IFRAME_ID = {
    desde410: 'ifrConteudoVisualizacao',
    legado: 'ifrVisualizacao'
} as const;

/** Tree HTML iframe element id (no `#`). */
export const TREE_HTML_IFRAME_ID = {
    desde410: 'ifrVisualizacao',
    legado: 'ifrArvoreHtml'
} as const;

/** Document editor root (SEI 5 vs earlier). */
export const EDITOR_ROOT = {
    sei5: '.infra-editor__editor-completo',
    legado: '#frmEditor'
} as const;

/** Process control form on the home list. */
export const PROCESS_CONTROL_FORM = '#frmProcedimentoControlar' as const;

/** Process tables on procedimento_controlar. */
export const PROCESS_TABLE = {
    recebidos: '#tblProcessosRecebidos',
    gerados: '#tblProcessosGerados',
    detalhado: '#tblProcessosDetalhado',
    all: '#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado'
} as const;

/** Tree root in arvore_visualizar. */
export const TREE_ROOT = '#divArvore' as const;

/** Iframe body that hosts both process and document anchors. */
export const TREE_IFRAME_BODY = 'body.infraArvore' as const;

/** Readiness gate: populated children under the tree root. */
export const TREE_READY_GATE = TREE_ROOT;

/** Process tree form / panel mount host. */
export const TREE_PANEL_FORM = '#frmArvore' as const;

/** Fallback mount near andamento when `#frmArvore` is absent. */
export const TREE_ANDAMENTO = '#divConsultarAndamento' as const;

/** Document/process anchors inside the tree iframe. */
export const TREE_ANCHOR =
    'a.infraArvoreNo[target="ifrConteudoVisualizacao"], a.infraArvoreNo[target="ifrVisualizacao"]' as const;

/** Marcador select on SEI forms used by the info panel. */
export const TREE_PANEL_MARCADOR_SELECT = '#selMarcador' as const;

/** Atribuição select on SEI forms used by the info panel. */
export const TREE_PANEL_ATRIBUICAO_SELECT = '#selAtribuicao' as const;

/** Generic SEI infra table (marcador / acompanhamento rows). */
export const TREE_PANEL_INFRA_TABLE = 'table.infraTable' as const;

/** Document registration form. */
export const DOCUMENT_FORM = '#frmDocumentoCadastro' as const;

/** Institution name in the system bar. */
export const INSTITUTION_LABEL = {
    novo: '#divInfraBarraSistema h6.infraCorBarraSuperior',
    legado: '#divInfraBarraSuperior label'
} as const;

/** Current unit control (link on new SEI, select on legacy). */
export const UNIT_CONTROL = {
    novo: '#lnkInfraUnidade',
    legado: '#selInfraUnidades'
} as const;

/** System bar host used for theme / chrome hooks. */
export const SYSTEM_BAR_HOST = {
    novo: '#divInfraBarraSistemaPadrao',
    legado: '#divInfraBarraSistema'
} as const;

/** Localization / breadcrumb bar on list pages. */
export const LOCALIZATION_BAR = '#divInfraBarraLocalizacao' as const;

export type VersionFlags = {
    isNewSEI: boolean;
    version?: string | false | null;
};

export type ResolvedSelectors = {
    divInformacao: string;
    mainMenu: string;
    idMenu: string;
    ancoraArvoreDownload: string;
    infraBarraComandos: string;
    infraBarraS: string;
    nameDocInterno: string;
    divComandos: string;
    ifrVisualizacao_: string;
    $ifrVisualizacao: string;
    ifrArvoreHtml_: string;
    $ifrArvoreHtml: string;
    frmEditor: string;
    infraBarraSistemaD: string;
};

function pickVariant<T extends { novo: string; legado: string }>(
    pair: T,
    isNewSEI: boolean
): string {
    return isNewSEI ? pair.novo : pair.legado;
}

/**
 * Resolve intentional selectors for a SEI version snapshot.
 * Keeps the historical adapter key names for call-site compatibility.
 */
export function resolveSelectors(
    isNewSEI: boolean,
    version: string | false | null | undefined,
    isAtLeast: (version: string | false | null | undefined, target: string) => boolean
): ResolvedSelectors {
    const isSEI5 = !!(isNewSEI && version && isAtLeast(version, '5'));
    const gte410 = !!(isNewSEI && version && isAtLeast(version, '4.1.0'));
    const mainMenu = pickVariant(MAIN_MENU, isNewSEI);
    const ifrVisualizacao_ = gte410
        ? VISUALIZATION_IFRAME_ID.desde410
        : VISUALIZATION_IFRAME_ID.legado;
    const ifrArvoreHtml_ = gte410 ? TREE_HTML_IFRAME_ID.desde410 : TREE_HTML_IFRAME_ID.legado;

    return {
        divInformacao: pickVariant(INFO_PANEL, isNewSEI),
        mainMenu,
        idMenu: (isNewSEI ? MENU_SCOPE_PREFIX.novo : MENU_SCOPE_PREFIX.legado) + mainMenu,
        ancoraArvoreDownload: pickVariant(TREE_DOWNLOAD_ANCHOR, isNewSEI),
        infraBarraComandos: pickVariant(COMMAND_BAR, isNewSEI),
        infraBarraS: pickVariant(SYSTEM_BAR_LEFT, isNewSEI),
        nameDocInterno: pickVariant(INTERNAL_DOC_ICON, isNewSEI),
        divComandos: gte410 ? PROCESS_COMMANDS.desde410 : PROCESS_COMMANDS.legado,
        ifrVisualizacao_,
        $ifrVisualizacao: '#' + ifrVisualizacao_,
        ifrArvoreHtml_,
        $ifrArvoreHtml: '#' + ifrArvoreHtml_,
        frmEditor: isSEI5 ? EDITOR_ROOT.sei5 : EDITOR_ROOT.legado,
        infraBarraSistemaD: pickVariant(SYSTEM_BAR_RIGHT, isNewSEI)
    };
}

export function installSelectors() {
    function resolve(isNewSEI: boolean, version?: string | false | null): ResolvedSelectors {
        return resolveSelectors(!!isNewSEI, version, seiVersion().isAtLeast);
    }

    function current(): ResolvedSelectors {
        const flags = seiVersion().resolveVersionFlags() as VersionFlags;
        return resolve(!!flags.isNewSEI, flags.version);
    }

    const api = {
        resolve,
        current,
        INFO_PANEL,
        MAIN_MENU,
        MENU_SCOPE_PREFIX,
        TREE_DOWNLOAD_ANCHOR,
        COMMAND_BAR,
        SYSTEM_BAR_LEFT,
        SYSTEM_BAR_RIGHT,
        INTERNAL_DOC_ICON,
        PROCESS_COMMANDS,
        VISUALIZATION_IFRAME_ID,
        TREE_HTML_IFRAME_ID,
        EDITOR_ROOT,
        PROCESS_CONTROL_FORM,
        PROCESS_TABLE,
        TREE_ROOT,
        DOCUMENT_FORM,
        INSTITUTION_LABEL,
        UNIT_CONTROL,
        SYSTEM_BAR_HOST,
        LOCALIZATION_BAR
    };

    seiNamespace().selectors = api;
    return api;
}
