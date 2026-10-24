/** Atributo no <html> que cede a peça correspondente do legado (marcado em document_start). */
export const ATRIBUTO_PAINEIS = "data-seipro-processo-paineis";
export const ATRIBUTO_MENU = "data-seipro-processo-menu";
export const ATRIBUTO_CAPA = "data-seipro-processo-capa";
export const ATRIBUTO_GANTT = "data-seipro-processo-gantt";
/** Na JANELA DE TOPO do processo (onde o legado roda): o legado deixa de montar o título da aba (`updateTitlePage`, modo processo). */
export const ATRIBUTO_TITULO = "data-seipro-processo-titulo";
/** Na JANELA DE TOPO do processo: o legado deixa de verificar os documentos não assinados no Enviar Processo (`initCheckNaoAssinados`). */
export const ATRIBUTO_AVISO = "data-seipro-processo-aviso";
/** Opção do legado (liga/desliga, ligada por padrão): o aviso de documentos não assinados ao enviar o processo. */
export const OPCAO_NAO_ASSINADOS = "naoassinados";
/** Evento no documento do quadro da árvore: o legado (link da capa) e a capa nova pedem a abertura do Gantt por ele. */
export const EVENTO_ABRIR_GANTT = "spro-processo-gantt-abrir";
/**
 * A capa (quadro do visualizador) fala com o quadro da árvore por eventos no documento da árvore, sem dados no evento
 * (o `detail` não atravessa mundos isolados): o pedido é só o nome. O que precisa voltar vai em atributos do <html> da árvore.
 *  - pedir: carrega as fatias que a capa lê (dadosProcesso, marcador) se ainda não vieram;
 *  - calcular: coleta o histórico completo (progresso/erro em `ATRIBUTO_COLETA`); cancelar: para a coleta.
 */
export const EVENTO_CAPA_PEDIR = "spro-processo-capa-pedir";
export const EVENTO_CAPA_CALCULAR = "spro-processo-capa-calcular";
export const EVENTO_CAPA_CANCELAR = "spro-processo-capa-cancelar";
/** No <html> da árvore: "coletando:<feito>/<total>", "erro:<mensagem>" ou ausente (nada em curso). */
export const ATRIBUTO_COLETA = "data-spro-capa-coleta";

/** Opção do legado (`dataValues`, numérica): dias sem sair da unidade para a capa avisar. 0 desliga. */
export const OPCAO_PROCESSO_PARADO = "processoparado";
export const LIMITE_PARADO_PADRAO = 15;
/** Opção do legado (`dataValues`, liga/desliga, ligada por padrão): a barra de filtro acima da árvore. */
export const OPCAO_FILTRO_ARVORE = "filtroarvore";

/** Teto do cache: cota do chrome.storage.local é dividida com Favoritos, Histórico e Agente. */
export const MAX_PROCESSOS_CACHE = 200;
export const MAX_BYTES_CACHE = 2 * 1024 * 1024;
/** Uma entrada maior que isto não vai para o cache (a fatia segue em memória). */
export const MAX_BYTES_ENTRADA = 64 * 1024;
/** A cada quantas gravações o cache confere o teto de bytes (a contagem é conferida sempre). */
export const PODA_A_CADA = 25;

export const TENTATIVAS_PADRAO = 2;
export const ESPERA_TENTATIVA_MS = 400;

export const prefixoCache = "processo/";
export const chaveCache = (escopo: string, id: string): string => `${prefixoCache}${escopo}/${id}`;
/** host|login com as duas partes: só com elas o cache é gravado. */
export const escopoValido = (escopo: string): boolean => {
  const i = escopo.indexOf("|");
  return i > 0 && i < escopo.length - 1;
};

/** Histórico completo do processo (coletado por clique): chave própria, para não estourar o limite da entrada dos painéis. */
export const prefixoHistorico = "processo-historico/";
export const chaveHistorico = (escopo: string, id: string): string => `${prefixoHistorico}${escopo}/${id}`;
/** Uma entrada maior que isto não vai para o cache (o histórico segue em memória). */
export const MAX_BYTES_HISTORICO = 900 * 1024;
export const MAX_PROCESSOS_HISTORICO = 12;
/** O histórico guardado serve de base da atualização incremental por este tempo, mesmo vencido (ele só “vale” por 30 min). */
export const GUARDA_HISTORICO_MS = 24 * 60 * 60 * 1000;
