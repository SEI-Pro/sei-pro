/**
 * Config schema — single source of truth (ADR-0009 / Phase 2).
 *
 * Inventory summary (see keys-inventory.md):
 * - verify/check/getConfigValue literals in src/: 69
 * - options.html data-name: 73
 * - opcoes_funcoes.csv: 72
 * - schema keys: 74 (HTML ∪ CSV ∪ llmProvedoresExternos ∪ bugReportOptIn)
 * - discrepancy vs CSV: +2 (llmProvedoresExternos, bugReportOptIn); CSV keys all present
 * - ADR-0009 cited 79 code keys; re-scan finds 69 literals (+ background/local extras)
 */

export type ConfigValueType = 'boolean' | 'string' | 'number';

export interface ConfigSchemaEntry {
    type: ConfigValueType;
    default: boolean | string | number;
    feature?: string;
    label?: string;
    page?: string;
    /** Where the value is persisted. Default: configGeral inside sync dataValues. */
    storage?: 'configGeral' | 'local';
    /** Options UI host section id for schema-generated rows. */
    optionsSection?: string;
}

export const CONFIG_SCHEMA = {
    acoesemlote: {
        type: 'boolean',
        default: false,
        feature: "docs-lote",
        label: "Ações em Lote",
        page: "ACOESEMLOTE.md",
    },
    agruparlista: {
        type: 'boolean',
        default: false,
        feature: "lista-agrupamento",
        label: "Agrupar lista de processos por marcadores, tipo, responsável ou ponto de controle",
        page: "AGRUPAR.md",
    },
    atalhopublicacoeseletronicas: {
        type: 'boolean',
        default: false,
        feature: "menus-rapidos",
        label: "Atalho para Publicações Eletrônicas",
    },
    autopreenchersenha: {
        type: 'boolean',
        default: true,
        feature: "login",
        label: "Autopreencher senha no login (SEI ≥ 4.0)",
        page: "AUTOPREENCHERSENHA.md",
    },
    bugReportOptIn: {
        type: 'boolean',
        default: false,
        feature: "telemetry",
        label: "Permitir envio automático de relatórios de erro (opt-in)",
        storage: "local",
        optionsSection: "privacy",
    },
    certidaosigilo: {
        type: 'boolean',
        default: false,
        feature: "acoes-capa",
        label: "Gerar Certidão de Documento Oficial com Sigilo",
        page: "CERTIDAOSIGILO.md",
    },
    certidaosigilo_nomedoc: {
        type: 'string',
        default: "Certidão",
        feature: "acoes-capa",
        label: "Nome do tipo de documento do SEI da Certidão",
    },
    citacaodoc: {
        type: 'string',
        default: "",
        feature: "editor-captcha",
        label: "Formato da citação de documento",
    },
    combinacaoteclas: {
        type: 'string',
        default: "",
        feature: "editor-captcha",
        label: "Combinação de teclas de atalho para o editor de documentos",
    },
    comparardocumentos: {
        type: 'boolean',
        default: false,
        feature: "docs-lote",
        label: "Comparador de Documentos",
        page: "COMPARARDOCUMENTOS.md",
    },
    contadoricone: {
        type: 'boolean',
        default: false,
        feature: "lista-processos",
        label: "Contador de processos não recebidos no ícone do SEI",
        page: "CONTADORPROCESSOICONE.md",
    },
    coresmarcadores: {
        type: 'boolean',
        default: false,
        feature: "cores-marcadores",
        label: "Permitir cores personalizadas em Marcadores",
        page: "CORESMARCADORES.md",
    },
    debugpage: {
        type: 'boolean',
        default: false,
        feature: "chrome-ui",
        label: "Ativar debug",
    },
    disablequery: {
        type: 'boolean',
        default: false,
        feature: "chrome-ui",
        label: "Desativar consultas adicionais",
    },
    ditado: {
        type: 'boolean',
        default: false,
        feature: "editor-captcha",
        label: "Ditado no editor de documentos",
        page: "DITADO.md",
    },
    documentosemlote: {
        type: 'boolean',
        default: false,
        feature: "docs-lote",
        label: "Documentos em Lote",
        page: "DOCUMENTOSEMLOTE.md",
    },
    duaslinhas: {
        type: 'boolean',
        default: false,
        feature: "arvore",
        label: "Dividir as informações do documento na árvore do processo em duas linhas",
        page: "DIVIDIRLINHASARVORE.md",
    },
    editarimagens: {
        type: 'boolean',
        default: false,
        feature: "midia-documentos",
        label: "Envio, formatação e edição avançada de imagens no editor de documentos",
        page: "EDITARIMAGENS.md",
    },
    editarlinks: {
        type: 'boolean',
        default: false,
        feature: "url-amigavel",
        label: "Abrir, editar e remover hiperlinks no editor de documentos",
        page: "ABRIRLINKS.md",
    },
    escrivainterativa: {
        type: 'boolean',
        default: false,
        feature: "editor-captcha",
        label: "Escrita interativa no editor de documentos (digite # ou @ para ativar menu rápido)",
        page: "ESCRITAINTERATIVA.md",
    },
    especificaprocesso: {
        type: 'boolean',
        default: false,
        feature: "lista-processos",
        label: "Mostrar especificação do processo na tabela de controle de processos",
        page: "ESPECIFICACAOPROCESSO.md",
    },
    estilolegistica: {
        type: 'boolean',
        default: false,
        feature: "legis",
        label: "Manter o estilo de parágrafo original ao aplicar a formatação de enumeração normativa (legística)",
        page: "LEGISTICA.md",
    },
    ferramentasia: {
        type: 'boolean',
        default: false,
        feature: "ai",
        label: "Ferramentas de Inteligência Artificial",
        page: "FERRAMENTASIA.md",
    },
    filtrarpaginapelapesquisarapida: {
        type: 'boolean',
        default: true,
        feature: "lista-processos",
        label: "Filtrar a página pelo campo de pesquisa rápida",
    },
    filtroporatribuicao: {
        type: 'boolean',
        default: false,
        feature: "lista-processos",
        label: "Filtro por atribuição",
    },
    gerenciaratividades: {
        type: 'boolean',
        default: false,
        feature: "atividades",
        label: "Gerenciar Atividades",
    },
    gerenciarformularios: {
        type: 'boolean',
        default: false,
        feature: "dialogs-host",
        label: "Gerenciar Formulários",
    },
    gerenciarmonitorados: {
        type: 'boolean',
        default: true,
        feature: "monitorados",
        label: "Processos Monitorados",
        page: "FAVORITOS.md",
    },
    gerenciarprazos: {
        type: 'boolean',
        default: false,
        feature: "controlar-prazos",
        label: "Controlar Prazos",
        page: "PRAZOS.md",
    },
    gerenciarprescricoes: {
        type: 'boolean',
        default: false,
        feature: "atividades",
        label: "Gerenciar Prescrições Processuais",
    },
    gerenciarprojetos: {
        type: 'boolean',
        default: false,
        feature: "projetos",
        label: "Gerenciar Projetos",
        page: "PROJETOS.md",
    },
    historicoproc: {
        type: 'boolean',
        default: false,
        feature: "historico-processos",
        label: "Histórico de processos visitados",
        page: "HISTORICOPROC.md",
    },
    indicadorglobalblocoassinatura: {
        type: 'boolean',
        default: false,
        feature: "notificacoes-processo",
        label: "Indicador global de blocos de assinatura",
    },
    infoarvore: {
        type: 'boolean',
        default: true,
        feature: "arvore-info",
        label: "Informações adicionais na árvore do processo",
        page: "INFOARVORE.md",
    },
    linhanumerada: {
        type: 'boolean',
        default: false,
        feature: "visualizacao",
        label: "Visualizar parágrafos numerados no visualizador de documentos",
        page: "PARAGRAFOSNUMERADOS.md",
    },
    llmProvedoresExternos: {
        type: 'boolean',
        default: true,
        feature: "ai",
        label: "Permitir provedores de IA externos (nuvem)",
    },
    marcar_naolido: {
        type: 'boolean',
        default: true,
        feature: "nao-lido",
        label: "Permitir marcar processos como \"Não Visualizado\"",
        page: "NAOLIDO.md",
    },
    menurapido: {
        type: 'boolean',
        default: false,
        feature: "menus-rapidos",
        label: "Menu rápido na árvore de documentos",
        page: "MENURAPIDO.md",
    },
    menususpenso: {
        type: 'boolean',
        default: false,
        feature: "chrome-ui",
        label: "Menu Suspenso",
        page: "MENUSUSPENSO.md",
    },
    monitoradosacimacontrole: {
        type: 'boolean',
        default: false,
        feature: "monitorados",
        label: "Mover Processos Monitorados para cima do Controle de Processos",
    },
    mostraranotacaocontrole: {
        type: 'boolean',
        default: true,
        feature: "anotacao-controle",
        label: "Mostrar anotação do processo na tela de controle de processos",
    },
    movericone: {
        type: 'boolean',
        default: false,
        feature: "arvore",
        label: "Mover ícone de excluir documentos para o final da lista",
        page: "MOVERICONE.md",
    },
    naoassinados: {
        type: 'boolean',
        default: false,
        feature: "midia-documentos",
        label: "Alertar sobre documentos não assinados ao enviar um processo",
        page: "DOCSNAOASSINADOS.md",
    },
    natjus: {
        type: 'boolean',
        default: false,
        feature: "dialogs-host",
        label: "Pesquisa NatJus",
    },
    newdocdefault: {
        type: 'boolean',
        default: false,
        feature: "chrome-ui",
        label: "Selecionar valores padronizados ao inserir um novo processo ou documento",
        page: "VALDEFAULT.md",
    },
    newdocespec: {
        type: 'string',
        default: "",
        feature: "chrome-ui",
        label: "Especificações padronizadas",
    },
    newdocformat: {
        type: 'string',
        default: "",
        feature: "chrome-ui",
        label: "Formato do documento externo",
    },
    newdocname: {
        type: 'string',
        default: "",
        feature: "chrome-ui",
        label: "Nome padrão do documento externo na árvore",
    },
    newdocnivel: {
        type: 'boolean',
        default: false,
        feature: "chrome-ui",
        label: "Marcar nível do processo ou documento como público",
        page: "DOCPUBLICO.md",
    },
    newdocobs: {
        type: 'string',
        default: "",
        feature: "chrome-ui",
        label: "Observações padronizadas",
    },
    newdocsigilo: {
        type: 'string',
        default: "",
        feature: "chrome-ui",
        label: "Hipótese legal do documento",
    },
    newdoctoday: {
        type: 'boolean',
        default: false,
        feature: "chrome-ui",
        label: "Inserir a data de hoje no campo data do documento",
    },
    newproc_selfunidade: {
        type: 'boolean',
        default: false,
        feature: "chrome-ui",
        label: "Ao criar novos processos, adicionar sua unidade como interessada",
    },
    nomesusuarios: {
        type: 'boolean',
        default: false,
        feature: "lista-processos",
        label: "Mostrar nomes de usuários na tabela de controle de processos",
        page: "NOMESUSUARIOS.md",
    },
    notificacaonovoprocesso: {
        type: 'boolean',
        default: false,
        feature: "lista-processos",
        label: "Notificar quando surgirem novos processos não visualizados",
    },
    numerar_documentos: {
        type: 'boolean',
        default: false,
        feature: "arvore",
        label: "Numerar documentos na árvore do processo",
        page: "NUMERARDOCSARVORE.md",
    },
    ocultarpaginacaosuperior: {
        type: 'boolean',
        default: false,
        feature: "lista-processos",
        label: "Ocultar paginação superior dos processos",
    },
    ordenarmenu: {
        type: 'boolean',
        default: false,
        feature: "menus-rapidos",
        label: "Ordenar Itens do Menu",
    },
    ordernartabela: {
        type: 'boolean',
        default: false,
        feature: "tabelas-arquivos",
        label: "Ordenar tabelas ao clicar no seu cabeçalho",
        page: "ORDENARTABELA.md",
    },
    qualidadeimagens: {
        type: 'number',
        default: 60,
        feature: "midia-documentos",
        label: "Reduzir a qualidade das imagens inseridas nos documentos (%)",
        page: "QUALIDADEIMAGENS.md",
    },
    removepaginacao: {
        type: 'boolean',
        default: false,
        feature: "lista-processos",
        label: "Remover paginação de processos e tabelas",
        page: "REMOVEPAGINACAO.md",
    },
    resizearvore: {
        type: 'boolean',
        default: false,
        feature: "arvore",
        label: "Redimensionar automaticamente a árvore do processo pela sua largura total",
        page: "RESIZEARVORE.md",
    },
    revisaotexto: {
        type: 'boolean',
        default: false,
        feature: "ai",
        label: "Revisão de texto no editor de documentos",
        page: "REVISARDOC.md",
    },
    rolageminfinita: {
        type: 'boolean',
        default: false,
        feature: "lista-processos",
        label: "Rolagem infinita na pesquisa de processos",
        page: "ROLAGEMINFINITA.md",
    },
    salvamentoautomatico: {
        type: 'number',
        default: 5,
        feature: "editor-captcha",
        label: "Intervalo em minutos para o salvamento automático",
        page: "SALVAMENTOAUTOMATICO.md",
    },
    selecaointeligenteblocoassinatura: {
        type: 'boolean',
        default: false,
        feature: "notificacoes-processo",
        label: "Seleção inteligente dentro do bloco de assinatura",
    },
    sincronizarprocessos: {
        type: 'boolean',
        default: false,
        feature: "historico-processos",
        label: "Sincronizar Base de Processos",
    },
    sortbeforeupload: {
        type: 'boolean',
        default: false,
        feature: "arvore",
        label: "Ordenar documentos na árvore antes de enviar (Não enviar automaticamente)",
    },
    substituiselecao: {
        type: 'boolean',
        default: false,
        feature: "editor-captcha",
        label: "Utilizar caixas de seleção inteligentes",
        page: "SUBSTITUIRSELECAO.md",
    },
    teclasatalho: {
        type: 'boolean',
        default: false,
        feature: "editor-captcha",
        label: "Adicionar teclas de atalhos no editor de documentos",
        page: "TECLASATALHO.md",
    },
    trocaunidade: {
        type: 'boolean',
        default: false,
        feature: "chrome-ui",
        label: "Trocar unidades utilizando caixas de seleção (SEI ≥ 4.0)",
    },
    uploaddocsexternos: {
        type: 'boolean',
        default: true,
        feature: "arvore",
        label: "Enviar Múltiplos Documentos Externos",
        page: "UPLOADDOCS.md",
    },
    urlamigavel: {
        type: 'boolean',
        default: false,
        feature: "url-amigavel",
        label: "Utilizar endereços amigáveis em processos e documentos",
        page: "URLAMIGAVEL.md",
    },
    visualizarzip: {
        type: 'boolean',
        default: false,
        feature: "arvore",
        label: "Pré-visualizar conteúdo e baixar arquivos específicos de documentos ZIP",
    },
} as const satisfies Record<string, ConfigSchemaEntry>;

export type ConfigKey = keyof typeof CONFIG_SCHEMA;

export function isConfigKey(name: string): name is ConfigKey {
    return Object.prototype.hasOwnProperty.call(CONFIG_SCHEMA, name);
}

export function getSchemaEntry(key: string): ConfigSchemaEntry | undefined {
    return isConfigKey(key) ? (CONFIG_SCHEMA[key] as ConfigSchemaEntry) : undefined;
}

/** Boolean keys whose schema default is true (options UI + checkConfigValue). */
export function getDefaultEnabledConfigKeys(): ConfigKey[] {
    return (Object.keys(CONFIG_SCHEMA) as ConfigKey[]).filter((key) => {
        const entry = CONFIG_SCHEMA[key] as ConfigSchemaEntry;
        return entry.type === 'boolean' && entry.default === true;
    });
}

export function listSchemaEntriesForOptionsSection(section: string): Array<{ key: ConfigKey; entry: ConfigSchemaEntry }> {
    return (Object.keys(CONFIG_SCHEMA) as ConfigKey[])
        .map((key) => ({ key, entry: CONFIG_SCHEMA[key] as ConfigSchemaEntry }))
        .filter((item) => item.entry.optionsSection === section);
}
