/**
 * API pública do `sei-nucleo`.
 *
 * Tudo o que outro código (o agente, e no futuro o legado do SEI Pro) pode
 * usar sai daqui. O bundle IIFE expõe o mesmo conteúdo em `window.SeiNucleo`.
 */

export { Sei, lerContexto, lerIdUnidade, lerVersao, type ContextoSei, type Localizado } from "./sei";
export { ErroSei, comoErroSei, ehErroSei, type CodigoErro } from "./sessao/erros";
export { criarHttp, verificarPagina, type Http, type Pagina, type Arquivo, type OpcoesHttp } from "./sessao/http";
export { codificarLatin1, decodificarLatin1, paraLatin1Seguro } from "./sessao/codificacao";
export { definirAnalisador } from "./sessao/dom";
export { Formulario, lerLupa, serializarLupa, urlContem, normalizar, type ItemLupa, type Opcao } from "./formulario/formulario";
export { linkDoMenu, linksAssinados, linkDaAcao, parametros, semAssinaturas } from "./links/links";
export { abrirArvore, lerArvore, acaoNaArvore, type Arvore, type DocumentoArvore, type NivelAcesso } from "./dominio/arvore";
export { consultarProcesso, alterarProcesso, concluirProcesso, reabrirProcesso, type Processo, type AlteracaoProcesso } from "./dominio/processo";
export {
  definirAnotacao,
  registrarAndamento,
  atribuirProcesso,
  definirAcompanhamento,
  definirMarcador,
  marcadoresDoProcesso,
  type MarcadorProcesso,
} from "./dominio/acoesProcesso";
export {
  acoesDoPainel,
  blocoInternoDoHistorico,
  lerAcompanhamento,
  lerAnotacao,
  lerAtribuicaoDaPagina,
  lerFormularioDoProcesso,
  lerMarcadoresDoProcesso,
  lerOpcoesAcompanhamento,
  lerOpcoesAtribuicao,
  lerOpcoesMarcador,
  lerRelacionados,
  type AcoesDoPainel,
  type FormularioDoProcesso,
  type MarcadorDoPainel,
  type OpcaoLista,
  type AcompanhamentoProcesso,
  type AnotacaoProcesso,
  type AtribuicaoDaPagina,
  type LinhaAtribuicao,
  type ProcessoRelacionado,
} from "./dominio/painelProcesso";
export {
  acrescentarAoCache,
  andamentos,
  andamentosDaArvore,
  andamentosDoLink,
  coletarHistorico,
  coletarHistoricoDaArvore,
  lerHistorico,
  type Andamento,
  type CacheHistorico,
  type HistoricoColetado,
  type OpcoesColeta,
  type TipoHistorico,
} from "./dominio/historico";
export {
  calcularPassagens,
  dataISODe,
  isoDoRelogio,
  relogioDe,
  relogioDoISO,
  JANELA_REMESSA_MS,
  ROTULOS,
  type DocumentoDaPassagem,
  type FimPassagem,
  type InicioPassagem,
  type Passagem,
} from "./dominio/passagens";
export { lerCaixaDaPagina, lerLinhaCaixa, listarCaixa, type ProcessoNaCaixa } from "./dominio/caixa";
export {
  localizarDocumento,
  lerConteudo,
  alterarDocumento,
  criarDocumento,
  duplicarDocumento,
  tiposDocumento,
  tipoDoDocumento,
  pesquisarContatos,
  pesquisarAssuntos,
  type AlteracaoDocumento,
  type ConteudoDocumento,
  type NovoDocumento,
  type TipoDocumento,
} from "./dominio/documento";
export { moverDocumento, resolverProcessoDestino, type ProcessoDestino } from "./dominio/moverDocumento";
export { gerarPdfDocumentos, type PdfGerado } from "./dominio/pdfProcesso";
export type { OpcoesEscrita, ResultadoEscrita } from "./dominio/escrita";
export { aplicarModo, linkAutoCompletar, type AlteracaoLista, type ModoLista } from "./dominio/lupas";
export { abrirEditor, editarConteudo, lerEditor, textoDoHtml, type EdicaoConteudo, type EditorDocumento, type SecaoEditor } from "./dominio/editor";
export { Pseudonimos, type Categoria, type OpcoesAnonimizacao } from "./privacidade/anonimizar";
export { listarOpcoes, type ListaOpcoes, type OpcaoSei } from "./dominio/opcoes";
export { enviarProcesso, assinarDocumento, type Envio, type Assinatura } from "./dominio/tramitacao";
export { excluirDocumento, cancelarDocumento, cancelarAssinatura, darCiencia } from "./dominio/acoesDocumento";
export {
  pesquisar,
  pesquisarProcessosDoInteressado,
  type CriteriosInteressado,
  type CriteriosPesquisa,
  type PaginaDeProcessos,
  type ResultadoPesquisa,
} from "./dominio/pesquisa";
export {
  criarArmazemTextoPadrao,
  type ArmazemTextoPadrao,
  type ConferenciaGravacao,
  type ResultadoGravacao,
  type SeiDoTexto,
  type TextoLocalizado,
} from "./dominio/textoPadrao";
export {
  incluirProcessosEmBlocoInterno,
  listarBlocosInternosParaProcessos,
  type BlocoInterno,
  type ResultadoInclusao,
} from "./dominio/blocoProcessos";
