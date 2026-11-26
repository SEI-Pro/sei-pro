/** Um item (procedimento) da Base de Conhecimento da unidade, como aparece na lista. */
export interface ItemBase {
  /** id_base_conhecimento_agrupador: estável entre versões; é a chave do vínculo. */
  agrupador: string;
  /** id_base_conhecimento da versão atual. */
  id: string;
  /** Texto da coluna "Descrição" (entidades HTML já decodificadas). */
  titulo: string;
  /** Login da coluna "Usuário Gerador" ("" quando vazia). */
  gerador: string;
  /** "dd/mm/aaaa hh:mm:ss" como vem na célula ("" quando vazia). */
  dataGeracao: string;
  /** true quando as colunas de liberação estão preenchidas. */
  liberado: boolean;
  /** href do link base_conhecimento_visualizar (link assinado da sessão). */
  visualizar: string;
}
