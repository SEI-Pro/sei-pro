/**
 * API pública do `sei-nucleo`.
 *
 * Tudo o que outro código (o agente, e no futuro o legado do SEI Pro) pode
 * usar sai daqui. O bundle IIFE expõe o mesmo conteúdo em `window.SeiNucleo`.
 */

export { Sei, lerContexto, lerVersao, type ContextoSei, type Localizado } from "./sei";
export { ErroSei, comoErroSei, ehErroSei, type CodigoErro } from "./sessao/erros";
export { criarHttp, verificarPagina, type Http, type Pagina, type Arquivo, type OpcoesHttp } from "./sessao/http";
export { codificarLatin1, decodificarLatin1, paraLatin1Seguro } from "./sessao/codificacao";
export { definirAnalisador } from "./sessao/dom";
export { Formulario, lerLupa, serializarLupa, urlContem, normalizar, type ItemLupa, type Opcao } from "./formulario/formulario";
export { linksAssinados, linkDaAcao, parametros, semAssinaturas } from "./links/links";
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
export { andamentos, type Andamento, type TipoHistorico } from "./dominio/historico";
export { listarCaixa, type ProcessoNaCaixa } from "./dominio/caixa";
export {
  localizarDocumento,
  lerConteudo,
  alterarDocumento,
  criarDocumento,
  tiposDocumento,
  type ConteudoDocumento,
  type NovoDocumento,
  type TipoDocumento,
} from "./dominio/documento";
export type { OpcoesEscrita, ResultadoEscrita } from "./dominio/escrita";
export { abrirEditor, editarConteudo, lerEditor, textoDoHtml, type EdicaoConteudo, type EditorDocumento, type SecaoEditor } from "./dominio/editor";
export { Pseudonimos, type Categoria, type OpcoesAnonimizacao } from "./privacidade/anonimizar";
export { listarOpcoes, type ListaOpcoes, type OpcaoSei } from "./dominio/opcoes";
