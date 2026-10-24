/**
 * Catálogo do menu da árvore: os itens do documento e do processo, com o NOME de cada um igual ao do legado
 * (`iconsFlashDocMenu`, `iconsFlashMenu`, `iconsFlashDocArvore` em sei-functions-pro.js). O nome é a chave da
 * personalização do usuário (`configViewFlashDocMenuPro` e companhia guardam `[["Copiar número SEI"], ...]`),
 * então não pode mudar. Quem decide se o SEI oferece o item é o ENDEREÇO da ação (`acao=...`) ou o nome da função
 * do botão sem endereço (`excluirDocumento`), nunca o rótulo.
 *
 * Este arquivo só cita endereços de ação como DADO (para casar com os links que a árvore já traz): nada aqui busca
 * nada. O `build.mjs` o libera do portão dos endereços que gravam "Processo recebido" por isso.
 */
import type { NomeIcone } from "@comum/ui/dom";

export type Grupo = "Copiar" | "Abrir" | "Acoes";
export const GRUPOS: readonly Grupo[] = ["Copiar", "Abrir", "Acoes"];
export const ROTULO_DO_GRUPO: Record<Grupo, string> = { Copiar: "Copiar", Abrir: "Abrir", Acoes: "A\u00E7\u00F5es" };

/** Como o item se apoia na árvore: sempre disponível (local) ou só quando o SEI oferece. */
export type Origem =
  | { tipo: "local" }
  /** Endereço (`acao=...`) na barra de ações do documento/processo. */
  | { tipo: "acao"; acoes: readonly string[] }
  /** O conteúdo do documento (`documento_visualizar` ou `documento_download_anexo`), que vem do `src` do nó. */
  | { tipo: "conteudo" }
  /** Botão sem endereço: o nome da função do `onclick` (excluirDocumento, cienciaDocumento...). */
  | { tipo: "funcao"; funcoes: readonly string[] };

export interface DefItem {
  /** Identificador estável do item (não é o nome da personalização). */
  id: string;
  /** Nome do legado: chave da personalização do usuário. */
  nome: string;
  /** Texto no menu (o `alt` do legado quando havia). */
  rotulo: string;
  grupo: Grupo;
  icone: NomeIcone;
  origem: Origem;
  /** Modo do ícone fixo ao lado do documento (`iconsFlashDocArvore`), quando o item pode virar um. */
  modo?: string;
}

const local: Origem = { tipo: "local" };
const acao = (...acoes: string[]): Origem => ({ tipo: "acao", acoes });
const funcao = (...funcoes: string[]): Origem => ({ tipo: "funcao", funcoes });

/** Itens do documento, na ordem do legado. */
export const ITENS_DOCUMENTO: readonly DefItem[] = [
  {
    id: "copiar-numero",
    nome: "Copiar número SEI",
    rotulo: "Copiar número SEI",
    grupo: "Copiar",
    icone: "copiar",
    origem: local,
    modo: "copy",
  },
  {
    id: "copiar-nome",
    nome: "Copiar nome do documento",
    rotulo: "Copiar nome do documento",
    grupo: "Copiar",
    icone: "documento",
    origem: local,
    modo: "name",
  },
  {
    id: "copiar-link",
    nome: "Copiar link do documento",
    rotulo: "Copiar link do documento",
    grupo: "Copiar",
    icone: "link",
    origem: local,
    modo: "link",
  },
  {
    id: "copiar-numero-link",
    nome: "Copiar número com link",
    rotulo: "Copiar número com link",
    grupo: "Copiar",
    icone: "link",
    origem: local,
    modo: "numberlink",
  },
  {
    id: "copiar-nome-link",
    nome: "Copiar nome com link",
    rotulo: "Copiar nome com link",
    grupo: "Copiar",
    icone: "link",
    origem: local,
    modo: "namelink",
  },
  {
    id: "duplicar",
    nome: "Duplicar documento",
    rotulo: "Duplicar documento",
    grupo: "Acoes",
    icone: "duplicar",
    origem: local,
    modo: "clone",
  },
  {
    id: "copiar-para",
    nome: "Copiar para...",
    rotulo: "Copiar para outro processo",
    grupo: "Acoes",
    icone: "saida",
    origem: local,
    modo: "copyto",
  },
  {
    id: "imprimir-web",
    nome: "Imprimir Web",
    rotulo: "Imprimir Web",
    grupo: "Abrir",
    icone: "imprimir",
    origem: acao("documento_imprimir_web"),
  },
  {
    id: "nova-aba",
    nome: "Visualizar em nova aba",
    rotulo: "Visualizar em nova aba",
    grupo: "Abrir",
    icone: "novaAba",
    origem: { tipo: "conteudo" },
    modo: "view",
  },
  { id: "baixar", nome: "Baixar documento", rotulo: "Baixar documento", grupo: "Abrir", icone: "baixar", origem: { tipo: "conteudo" } },
  {
    id: "consultar",
    nome: "Consultar documento",
    rotulo: "Consultar documento",
    grupo: "Abrir",
    icone: "olho",
    origem: acao("documento_alterar", "documento_alterar_recebido", "documento_consultar", "documento_consultar_recebido"),
  },
  {
    id: "versoes",
    nome: "Versões do documento",
    rotulo: "Versões do documento",
    grupo: "Abrir",
    icone: "historico",
    origem: acao("documento_versao_listar"),
  },
  { id: "bloco", nome: "Incluir em bloco", rotulo: "Incluir em bloco", grupo: "Acoes", icone: "camadas", origem: acao("bloco_escolher") },
  {
    id: "cancelar",
    nome: "Cancelar documento",
    rotulo: "Cancelar documento",
    grupo: "Acoes",
    icone: "cancelar",
    origem: acao("documento_cancelar"),
  },
  {
    id: "circular",
    nome: "Gerar circular",
    rotulo: "Gerar circular",
    grupo: "Acoes",
    icone: "atualizar",
    origem: acao("documento_gerar_circular"),
  },
  {
    id: "assinatura-externa",
    nome: "Assinatura externa",
    rotulo: "Assinatura externa",
    grupo: "Acoes",
    icone: "caneta",
    origem: acao("assinatura_externa_gerenciar"),
  },
  {
    id: "excluir",
    nome: "Excluir documento",
    rotulo: "Excluir documento",
    grupo: "Acoes",
    icone: "lixeira",
    origem: funcao("excluirDocumento"),
  },
  { id: "editar", nome: "Editar documento", rotulo: "Editar documento", grupo: "Acoes", icone: "lapis", origem: funcao("editarConteudo") },
  {
    id: "assinar",
    nome: "Assinar documento",
    rotulo: "Assinar documento",
    grupo: "Acoes",
    icone: "caneta",
    origem: funcao("assinarDocumento"),
  },
  {
    id: "favorito",
    nome: "Adicionar aos favoritos",
    rotulo: "Adicionar aos favoritos",
    grupo: "Acoes",
    icone: "estrela",
    origem: acao("protocolo_modelo_gerenciar", "protocolo_modelo_cadastrar"),
  },
  { id: "ciencia", nome: "Ciência", rotulo: "Ciência", grupo: "Acoes", icone: "check", origem: funcao("cienciaDocumento") },
  {
    id: "email",
    nome: "Enviar por e-mail",
    rotulo: "Enviar por e-mail",
    grupo: "Acoes",
    icone: "email",
    origem: funcao("enviarEmailDocumento", "encaminharEmail"),
  },
  {
    id: "mover",
    nome: "Mover p/ outro processo",
    rotulo: "Mover p/ outro processo",
    grupo: "Acoes",
    icone: "mover",
    origem: acao("documento_mover"),
  },
  {
    id: "intimacao",
    nome: "Intimação eletrônica",
    rotulo: "Intimação eletrônica",
    grupo: "Acoes",
    icone: "sino",
    origem: acao("md_pet_intimacao_cadastrar"),
  },
];

/** Itens do processo (menu do número do processo, no alto da árvore). */
export const ITENS_PROCESSO: readonly DefItem[] = [
  {
    id: "p-copiar-numero",
    nome: "Copiar número do processo",
    rotulo: "Copiar número do processo",
    grupo: "Copiar",
    icone: "copiar",
    origem: local,
  },
  {
    id: "p-copiar-so-numero",
    nome: "Copiar somente o número",
    rotulo: "Copiar somente o número",
    grupo: "Copiar",
    icone: "teclado",
    origem: local,
  },
  {
    id: "p-copiar-link",
    nome: "Copiar link do processo",
    rotulo: "Copiar link do processo",
    grupo: "Copiar",
    icone: "link",
    origem: local,
  },
  { id: "p-upload", nome: "Enviar Documento Externo", rotulo: "Enviar Documento Externo", grupo: "Acoes", icone: "subir", origem: local },
  { id: "p-lote", nome: "Ações em Lote", rotulo: "Ações em Lote", grupo: "Acoes", icone: "ajustes", origem: local },
  {
    id: "p-urgencia",
    nome: "Adicionar ou Remover Urgência",
    rotulo: "Adicionar/Remover Urgência",
    grupo: "Acoes",
    icone: "alerta",
    origem: local,
  },
  {
    id: "p-incluir-doc",
    nome: "Incluir Documento",
    rotulo: "Incluir Novo Documento",
    grupo: "Acoes",
    icone: "mais",
    origem: acao("documento_escolher_tipo"),
  },
  {
    id: "p-alterar",
    nome: "Consultar/Alterar Processo",
    rotulo: "Consultar/Alterar Processo",
    grupo: "Abrir",
    icone: "lapis",
    origem: acao("procedimento_alterar", "procedimento_consultar"),
  },
  {
    id: "p-relacionado",
    nome: "Iniciar Processo Relacionado",
    rotulo: "Iniciar Proc. Relacionado",
    grupo: "Acoes",
    icone: "atualizar",
    origem: acao("procedimento_escolher_tipo_relacionado"),
  },
  {
    id: "p-acompanhamento",
    nome: "Acompanhamento Especial",
    rotulo: "Acompanhamento Especial",
    grupo: "Abrir",
    icone: "olho",
    origem: acao("acompanhamento_gerenciar"),
  },
  {
    id: "p-enviar",
    nome: "Enviar Processo",
    rotulo: "Enviar Processo",
    grupo: "Acoes",
    icone: "saida",
    origem: acao("procedimento_enviar"),
  },
  {
    id: "p-andamento",
    nome: "Atualizar Andamento",
    rotulo: "Atualizar Andamento",
    grupo: "Acoes",
    icone: "atualizar",
    origem: acao("procedimento_atualizar_andamento"),
  },
  {
    id: "p-atribuir",
    nome: "Atribuir Processo",
    rotulo: "Atribuir Processo",
    grupo: "Acoes",
    icone: "pessoa",
    origem: acao("procedimento_atribuicao_cadastrar"),
  },
  {
    id: "p-duplicar",
    nome: "Duplicar Processo",
    rotulo: "Duplicar Processo",
    grupo: "Acoes",
    icone: "duplicar",
    origem: acao("procedimento_duplicar"),
  },
  {
    id: "p-relacionamentos",
    nome: "Relacionamentos do Processo",
    rotulo: "Relacionamentos do Processo",
    grupo: "Abrir",
    icone: "camadas",
    origem: acao("procedimento_relacionar"),
  },
  {
    id: "p-acesso-externo",
    nome: "Gerenciar Disponibilizações de Acesso Externo",
    rotulo: "Gerenciar Acesso Externo",
    grupo: "Abrir",
    icone: "pessoa",
    origem: acao("acesso_externo_gerenciar"),
  },
  { id: "p-anotacoes", nome: "Anotações", rotulo: "Anotações", grupo: "Abrir", icone: "nota", origem: acao("anotacao_registrar") },
  {
    id: "p-sobrestar",
    nome: "Sobrestar Processo",
    rotulo: "Sobrestar Processo",
    grupo: "Acoes",
    icone: "relogio",
    origem: acao("procedimento_sobrestar"),
  },
  {
    id: "p-anexar",
    nome: "Anexar Processo",
    rotulo: "Anexar Processo",
    grupo: "Acoes",
    icone: "alca",
    origem: acao("procedimento_anexar"),
  },
  {
    id: "p-pdf",
    nome: "Gerar Arquivo PDF do Processo",
    rotulo: "Gerar Arquivo PDF",
    grupo: "Abrir",
    icone: "baixar",
    origem: acao("procedimento_gerar_pdf"),
  },
  {
    id: "p-zip",
    nome: "Gerar Arquivo ZIP do Processo",
    rotulo: "Gerar Arquivo ZIP",
    grupo: "Abrir",
    icone: "baixar",
    origem: acao("procedimento_gerar_zip"),
  },
  {
    id: "p-ponto-controle",
    nome: "Gerenciar Ponto de Controle",
    rotulo: "Gerenciar Ponto de Controle",
    grupo: "Abrir",
    icone: "calendario",
    origem: acao("ponto_controle_gerenciar", "controle_prazo_definir"),
  },
  {
    id: "p-marcador",
    nome: "Gerenciar Marcador",
    rotulo: "Gerenciar Marcador",
    grupo: "Abrir",
    icone: "etiqueta",
    origem: acao("andamento_marcador_gerenciar"),
  },
  {
    id: "p-concluir",
    nome: "Concluir Processo",
    rotulo: "Concluir/Reabrir Processo",
    grupo: "Acoes",
    icone: "check",
    origem: acao("procedimento_concluir"),
  },
  { id: "p-ciencia", nome: "Ciência", rotulo: "Ciência", grupo: "Acoes", icone: "check", origem: funcao("cienciaProcesso") },
  {
    id: "p-correspondencia",
    nome: "Enviar Correspondência Eletrônica",
    rotulo: "Enviar Correspondência",
    grupo: "Acoes",
    icone: "email",
    origem: funcao("enviarEmailProcedimento"),
  },
  {
    id: "p-bloco",
    nome: "Incluir em Bloco",
    rotulo: "Incluir em Bloco",
    grupo: "Acoes",
    icone: "camadas",
    origem: funcao("incluirEmBloco"),
  },
  {
    id: "p-reabrir",
    nome: "Reabrir Processo",
    rotulo: "Concluir/Reabrir Processo",
    grupo: "Acoes",
    icone: "restaurar",
    origem: funcao("reabrirProcesso"),
  },
  {
    id: "p-ordenar",
    nome: "Ordenar Árvore do Processo",
    rotulo: "Ordenar Árvore",
    grupo: "Acoes",
    icone: "ordenar",
    origem: acao("arvore_ordenar"),
  },
];

/** Entrada de configuração que liga o clique no lugar do passar o mouse (vem junto da lista do menu do documento). */
export const NOME_MENU_AO_CLICAR = "Ativar menu ao clicar";

/** O que o usuário vê enquanto não personalizar (os mesmos padrões do legado). */
export const PADRAO_MENU_DOCUMENTO: readonly string[] = [
  "Copiar número SEI",
  "Copiar nome do documento",
  "Copiar link do documento",
  "Duplicar documento",
  "Copiar para...",
];
export const PADRAO_MENU_PROCESSO: readonly string[] = [
  "Copiar número do processo",
  "Copiar link do processo",
  "Enviar Documento Externo",
  "Ações em Lote",
  "Atribuir Processo",
  "Adicionar ou Remover Urgência",
];
export const PADRAO_ICONES_ARVORE: readonly string[] = ["Copiar número SEI", "Copiar link do documento", "Duplicar documento"];

/**
 * Nomes que o legado gravou/aceitou com outra grafia. "Add/Remover Urgência" era o `alt` do item, que o legado usava
 * como padrão sem nunca achá-lo pelo nome (o item sumia); "Ações em lote" foi renomeado.
 */
const ALIAS: Record<string, string> = {
  "Add/Remover Urgência": "Adicionar ou Remover Urgência",
  "Ações em lote": "Ações em Lote",
};
export const nomeCanonico = (nome: string): string => ALIAS[nome] ?? nome;

export function defPorNome(lista: readonly DefItem[], nome: string): DefItem | undefined {
  const n = nomeCanonico(nome);
  return lista.find((d) => d.nome === n);
}

/** Modos dos ícones fixos e o item que cada um executa. */
export function defPorModo(modo: string): DefItem | undefined {
  return ITENS_DOCUMENTO.find((d) => d.modo === modo);
}

/** Itens que o usuário pode pôr como ícone fixo ao lado do documento (`iconsFlashDocArvore`). */
export const NOMES_ICONES_FIXOS: readonly string[] = ITENS_DOCUMENTO.filter((d) => d.modo).map((d) => d.nome);
