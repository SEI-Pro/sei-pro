/**
 * O que a tela "Personalizar menu rápido" mostra: as quatro abas (Processo, Documentos, Árvore, Painel) com os itens na
 * MESMA ordem e com os MESMOS nomes do legado (`iconsFlashMenu`, `iconsFlashDocMenu`, `iconsFlashDocArvore`,
 * `iconsFlashPanelArvore` em sei-functions-pro.js). O nome do item é a chave que a personalização grava
 * (`[["Copiar número SEI"],...]`), então não pode mudar; um teste compara este catálogo com o legado.
 *
 * Só dados: nenhum DOM aqui. O que é padrão (a lista que vale enquanto o usuário não personalizar) vem do catálogo do
 * menu (`menuDoc/catalogo.ts`) e de `modelo/paineis.ts`: um só lugar por assunto.
 */
import { SELECAO_PADRAO } from "../../modelo/paineis";
import type { NomeGlifoMenu } from "../../ui/glifosMenu";
import {
  defPorNome,
  ITENS_DOCUMENTO,
  ITENS_PROCESSO,
  NOME_MENU_AO_CLICAR,
  PADRAO_ICONES_ARVORE,
  PADRAO_MENU_DOCUMENTO,
  PADRAO_MENU_PROCESSO,
  ROTULO_DO_GRUPO,
} from "../menuDoc/catalogo";

export type IdAba = "processo" | "documentos" | "arvore" | "painel";
/** O `<bloco>` de `optionsFlashMenu_<bloco>` (a chave geral da aba). */
export type BlocoGeral = "menuproc" | "menudoc" | "iconstree" | "panelinfo";

export interface ItemPersonalizar {
  /** Nome do legado: a chave gravada. */
  nome: string;
  glifo: NomeGlifoMenu;
  /** Descrição curta, quando o nome sozinho não diz o bastante. */
  dica?: string;
  /** Grupo do menu em que o item aparece (Copiar, Abrir, Ações), só nas abas de menu. */
  grupo?: string;
}

export interface DefAba {
  id: IdAba;
  /** Rótulo da aba. */
  rotulo: string;
  glifo: NomeGlifoMenu;
  /** Título grande da aba, o mesmo do legado. */
  titulo: string;
  /** Uma linha sobre o que a aba controla. */
  descricao: string;
  /** Chave do localStorage com a lista (`[["nome"],...]`). */
  chave: string;
  bloco: BlocoGeral;
  /** Rótulo acessível da chave geral. */
  rotuloGeral: string;
  itens: readonly ItemPersonalizar[];
  /** A lista que vale enquanto o usuário não personalizar. */
  padrao: readonly string[];
  /** A ordem importa (o menu e os ícones seguem a ordem escolhida); nos painéis a ordem é fixa. */
  ordenavel: boolean;
}

export const CHAVE_LISTA_PROCESSO = "configViewFlashMenuPro";
export const CHAVE_LISTA_DOCUMENTOS = "configViewFlashDocMenuPro";
export const CHAVE_LISTA_ARVORE = "configViewFlashDocArvorePro";
export const CHAVE_LISTA_PAINEL = "configViewFlashPanelArvorePro";

type Bruto = readonly [string, NomeGlifoMenu, string?];

const processo: readonly Bruto[] = [
  ["Copiar número do processo", "direitos"],
  ["Copiar somente o número", "letraC"],
  ["Copiar link do processo", "link"],
  ["Enviar Documento Externo", "subir", "Precisa da opção de envio de documentos externos"],
  ["Ações em Lote", "engrenagem", "Precisa da opção Ações em lote"],
  ["Adicionar ou Remover Urgência", "alerta", "Põe ou tira o (URGENTE) da especificação"],
  ["Incluir Documento", "documentoTexto"],
  ["Consultar/Alterar Processo", "documentoAssinado"],
  ["Iniciar Processo Relacionado", "sincronizar"],
  ["Acompanhamento Especial", "olho"],
  ["Enviar Processo", "compartilhar"],
  ["Atualizar Andamento", "globo"],
  ["Atribuir Processo", "usuarios"],
  ["Duplicar Processo", "copia"],
  ["Relacionamentos do Processo", "relacionar"],
  ["Gerenciar Disponibilizações de Acesso Externo", "usuarioGravata"],
  ["Anotações", "nota"],
  ["Sobrestar Processo", "pausa"],
  ["Anexar Processo", "clipe"],
  ["Gerar Arquivo PDF do Processo", "pdf"],
  ["Gerar Arquivo ZIP do Processo", "zip"],
  ["Gerenciar Ponto de Controle", "bandeira"],
  ["Gerenciar Marcador", "etiquetas"],
  ["Concluir Processo", "pastaAberta"],
  ["Ciência", "joia"],
  ["Enviar Correspondência Eletrônica", "envelope"],
  ["Incluir em Bloco", "camadas"],
  ["Reabrir Processo", "pastaAberta"],
  ["Ordenar Árvore do Processo", "ordenar"],
];

const documentos: readonly Bruto[] = [
  ["Copiar número SEI", "direitos"],
  ["Copiar nome do documento", "documentoTexto"],
  ["Copiar link do documento", "link"],
  ["Duplicar documento", "copia"],
  ["Copiar para...", "encaminhar", "Abre a janela de copiar para outro processo"],
  ["Imprimir Web", "imprimir"],
  ["Visualizar em nova aba", "janelas"],
  ["Baixar documento", "baixar"],
  ["Consultar documento", "usuarios"],
  ["Incluir em bloco", "livro"],
  ["Cancelar documento", "proibido"],
  ["Versões do documento", "ramificacao"],
  ["Gerar circular", "circulo"],
  ["Assinatura externa", "documentoAssinado"],
  ["Excluir documento", "lixeira"],
  ["Editar documento", "lapis"],
  ["Assinar documento", "caneta"],
  ["Adicionar aos favoritos", "estrela"],
  ["Ciência", "joia"],
  ["Enviar por e-mail", "arroba"],
  ["Mover p/ outro processo", "pastaSeta"],
  ["Intimação eletrônica", "megafone"],
  ["Copiar número com link", "circuloSeta"],
  ["Copiar nome com link", "linkExterno"],
];

const arvore: readonly Bruto[] = [
  ["Copiar número SEI", "direitos"],
  ["Copiar nome do documento", "documentoTexto"],
  ["Copiar link do documento", "link"],
  ["Duplicar documento", "copia"],
  ["Copiar para...", "encaminhar", "Copiar documento para outro processo"],
  ["Copiar número com link", "circuloSeta"],
  ["Copiar nome com link", "linkExterno"],
  ["Visualizar em nova aba", "janelas"],
];

const painel: readonly Bruto[] = [
  ["Anotações", "nota", "Notas do processo, logo abaixo de Consultar Andamento"],
  ["Atribuição", "usuarioGravata", "Quem está com o processo na unidade"],
  ["Tipo de Procedimento", "caixa", "O tipo do processo"],
  ["Marcador", "etiquetas", "Os marcadores do processo na unidade"],
  ["Nível de Acesso", "cadeado", "Público, restrito ou sigiloso"],
  ["Interessados", "usuarios", "Quem é interessado no processo"],
  ["Assuntos", "favorito", "Os assuntos do processo"],
  ["Observações", "balao", "As observações da unidade"],
  ["Bloco Interno", "livro", "Os blocos internos que incluem o processo"],
  ["Acompanhamento Especial", "olho", "O acompanhamento especial do processo"],
];

function itens(lista: readonly Bruto[], defs: "processo" | "documento" | null): ItemPersonalizar[] {
  return lista.map(([nome, glifo, dica]) => {
    const def =
      defs === "processo" ? defPorNome(ITENS_PROCESSO, nome) : defs === "documento" ? defPorNome(ITENS_DOCUMENTO, nome) : undefined;
    return {
      nome,
      glifo,
      ...(dica ? { dica } : {}),
      ...(def ? { grupo: ROTULO_DO_GRUPO[def.grupo] } : {}),
    };
  });
}

export const ABAS: readonly DefAba[] = [
  {
    id: "processo",
    rotulo: "Processo",
    glifo: "pastaAberta",
    titulo: "Menu rápido do processo",
    descricao: "O menu que abre no número do processo, no alto da árvore.",
    chave: CHAVE_LISTA_PROCESSO,
    bloco: "menuproc",
    rotuloGeral: "Menu rápido do processo",
    itens: itens(processo, "processo"),
    padrao: PADRAO_MENU_PROCESSO,
    ordenavel: true,
  },
  {
    id: "documentos",
    rotulo: "Documentos",
    glifo: "documentoTexto",
    titulo: "Menu rápido dos documentos",
    descricao: "O menu que abre no ícone de cada documento. O que depende do SEI só aparece quando ele oferece a ação para o documento.",
    chave: CHAVE_LISTA_DOCUMENTOS,
    bloco: "menudoc",
    rotuloGeral: "Menu rápido dos documentos",
    itens: itens(documentos, "documento"),
    padrao: PADRAO_MENU_DOCUMENTO,
    ordenavel: true,
  },
  {
    id: "arvore",
    rotulo: "Árvore",
    glifo: "arvore",
    titulo: "Ícones rápidos na árvore",
    descricao: "Os ícones que ficam ao lado do nome de cada documento, na ordem escolhida.",
    chave: CHAVE_LISTA_ARVORE,
    bloco: "iconstree",
    rotuloGeral: "Ícones rápidos na árvore",
    itens: itens(arvore, null),
    padrao: PADRAO_ICONES_ARVORE,
    ordenavel: true,
  },
  {
    id: "painel",
    rotulo: "Painel",
    glifo: "informacao",
    titulo: "Painel de Informações na árvore",
    descricao: "Os painéis que aparecem abaixo da árvore do processo.",
    chave: CHAVE_LISTA_PAINEL,
    bloco: "panelinfo",
    rotuloGeral: "Painel de Informações na árvore",
    itens: itens(painel, null),
    padrao: SELECAO_PADRAO,
    ordenavel: false,
  },
];

export const aba = (id: IdAba): DefAba => ABAS.find((a) => a.id === id) ?? (ABAS[0] as DefAba);

/** A entrada que liga o clique no lugar do passar o mouse: mora na lista do menu do documento, mas não é um item do menu. */
export const ITEM_MENU_AO_CLICAR = {
  nome: NOME_MENU_AO_CLICAR,
  glifo: "cursor",
  dica: "Abre o menu ao clicar no ícone do documento, em vez de ao passar o mouse",
} as const satisfies ItemPersonalizar;
