/**
 * Quais itens o menu mostra para um documento ou para o processo, e o que cada um faz.
 *
 * Os itens do SEI (abrir, imprimir, bloco, cancelar, versões...) só aparecem quando a árvore os oferece: pelo
 * ENDEREÇO da ação (`acao=...`) nos links assinados do nó, pelo `src` do conteúdo, ou pelo nome da função do botão
 * sem endereço (`excluirDocumento`). Nunca pelo rótulo, que muda com a versão. Os itens locais (copiar, duplicar)
 * estão sempre aqui. Nada daqui faz requisição ao montar a lista: o que depende de rede (`Servicos`) só roda
 * quando o usuário escolhe o item.
 */
import type { DocumentoArvore } from "@nucleo/dominio/arvore";
import { linkDaAcao } from "@nucleo/links/links";
import {
  type DefItem,
  defPorNome,
  GRUPOS,
  type Grupo,
  ITENS_DOCUMENTO,
  ITENS_PROCESSO,
  NOME_MENU_AO_CLICAR,
  PADRAO_ICONES_ARVORE,
  PADRAO_MENU_DOCUMENTO,
  PADRAO_MENU_PROCESSO,
} from "./catalogo";
import {
  type Copia,
  copiaDoLink,
  copiaDoNome,
  copiaDoNomeComLink,
  copiaDoNumero,
  copiaDoNumeroComLink,
  linkPermanente,
  numeroSeiDoRotulo,
  soNumeros,
} from "./copiar";

export interface ItemMenu {
  id: string;
  /** Nome do legado (chave da personalização). */
  nome: string;
  grupo: Grupo;
  rotulo: string;
  icone: DefItem["icone"];
  executar(): void | Promise<void>;
  desativado?: boolean;
  /** Texto curto à direita (o motivo, quando desativado). */
  dica?: string;
  perigo?: boolean;
}

/** O que o menu faz no mundo: tudo o que mexe na página, na rede ou no legado passa por aqui (e é trocado nos testes). */
export interface Servicos {
  copiar(c: Copia, aviso: string): Promise<void>;
  abrirNoVisualizador(link: string): void;
  abrirEmNovaAba(link: string): void;
  baixar(link: string, nome: string): void;
  /** Duplica o documento no mesmo processo (núcleo, com prova de sucesso) e atualiza a árvore. */
  duplicar(numero: string, semMinuta: boolean): Promise<void>;
  /** "Deseja duplicar sem a denominação MINUTA?" → "remover", "manter" ou null (fechou). */
  perguntarMinuta(): Promise<"remover" | "manter" | null>;
  confirmar(texto: string, rotuloOk: string): Promise<boolean>;
  /** Lê uma das variáveis `var linkX = '...'` da tela do nó (um GET, só quando o usuário escolhe o item). */
  linkDaTela(urlDaTela: string, variavel: string): Promise<string | null>;
  /** Pede ao legado (mundo da página) uma das telas que ele ainda desenha: copiar para outro processo, envio de externo, ações em lote, personalizar. */
  legado(pedido: "copiar-para" | "enviar-externo" | "acoes-em-lote" | "personalizar", idDocumento?: string): void;
  alternarUrgencia(): Promise<void>;
  /** Clica o botão nativo da barra do visualizador, achado pelo nome da função do `onclick`. */
  clicarBotaoNativo(funcao: string): boolean;
  avisar(texto: string, ms?: number): void;
}

export interface OpcoesMenu {
  /** Nomes escolhidos pelo usuário, na ordem; null = nunca personalizou. */
  selecao: readonly string[] | null;
  /** Valor de `citacaodoc`. */
  citacao: unknown;
  /** Endereço do controlador (origem + caminho), sem a query. */
  base: string;
  idProcedimento: string;
  protocolo: string;
  linkProcesso: string;
  acoesProcesso: readonly string[];
  funcoesProcesso: readonly string[];
  /** O processo está aberto na unidade e o usuário pode incluir documento (a árvore oferece "Incluir Documento"). */
  podeIncluirDocumento: boolean;
  /** Opções gerais do SEI Pro: `uploaddocsexternos` e `acoesemlote`. */
  uploadLigado: boolean;
  loteLigado: boolean;
  servicos: Servicos;
}

/** O que o menu sabe do documento sob o mouse: o texto do nó na tela e, se a árvore o trouxe, os dados dele. */
export interface AlvoDocumento {
  id: string;
  /** Texto do nó na árvore (o que o usuário vê). */
  rotulo: string;
  dado: DocumentoArvore | null;
}

function ordenarPorGrupo(itens: ItemMenu[]): ItemMenu[] {
  return GRUPOS.flatMap((g) => itens.filter((i) => i.grupo === g));
}

/** As definições escolhidas pelo usuário, na ordem dele (nomes desconhecidos e o "ativar menu ao clicar" saem). */
export function definicoesEscolhidas(lista: readonly DefItem[], selecao: readonly string[] | null, padrao: readonly string[]): DefItem[] {
  const vistos = new Set<string>();
  const saida: DefItem[] = [];
  for (const nome of selecao ?? padrao) {
    if (nome === NOME_MENU_AO_CLICAR) continue;
    const d = defPorNome(lista, nome);
    if (d && !vistos.has(d.id)) {
      vistos.add(d.id);
      saida.push(d);
    }
  }
  return saida;
}

const primeiroLink = (links: readonly string[], acoes: readonly string[]): string | null => {
  for (const a of acoes) {
    const l = linkDaAcao([...links], a);
    if (l) return l;
  }
  return null;
};

function temFuncao(funcoes: readonly string[] | undefined, nomes: readonly string[]): string | null {
  return nomes.find((n) => funcoes?.includes(n)) ?? null;
}

/** Variável `var linkX` de cada botão sem endereço do documento. */
const VARIAVEL_DA_FUNCAO: Record<string, string> = {
  excluirDocumento: "linkExcluirDocumento",
  cienciaDocumento: "linkCienciaDocumento",
  assinarDocumento: "linkAssinarDocumento",
  editarConteudo: "linkEditarConteudo",
  enviarEmailDocumento: "linkDocumentoEnviarEmail",
  encaminharEmail: "linkEncaminharEmail",
  cienciaProcesso: "linkCienciaProcesso",
  reabrirProcesso: "linkReabrirProcesso",
  enviarEmailProcedimento: "linkProcedimentoEnviarEmail",
};

function nomeDoArquivo(a: AlvoDocumento): string {
  const t = a.rotulo.trim() || a.id;
  return a.dado?.externo ? t : `${t}.html`;
}

const COPIAS_COM_LINK: ReadonlySet<string> = new Set(["copiar-link", "copiar-numero-link", "copiar-nome-link"]);

/** Itens de copiar/duplicar de um documento, comuns ao menu e aos ícones fixos. */
function itemLocalDoDocumento(def: DefItem, alvo: AlvoDocumento, opc: OpcoesMenu): Pick<ItemMenu, "executar" | "desativado" | "dica"> {
  const s = opc.servicos;
  const dados = {
    rotulo: alvo.rotulo,
    citacaoOpcao: opc.citacao,
    linkDocumento: linkPermanente(opc.base, opc.idProcedimento, alvo.id),
  };
  switch (def.id) {
    case "copiar-numero":
      return { executar: () => s.copiar(copiaDoNumero(dados), "Número SEI copiado.") };
    case "copiar-nome":
      return { executar: () => s.copiar(copiaDoNome(dados), "Nome copiado.") };
    case "copiar-link":
      return { executar: () => s.copiar(copiaDoLink(dados), "Link copiado.") };
    case "copiar-numero-link":
      return { executar: () => s.copiar(copiaDoNumeroComLink(dados), "Número com link copiado.") };
    case "copiar-nome-link":
      return { executar: () => s.copiar(copiaDoNomeComLink(dados), "Nome com link copiado.") };
    case "duplicar":
    case "copiar-para": {
      const externo = alvo.dado?.externo === true;
      const cancelado = alvo.dado?.cancelado === true;
      const fechado = !opc.podeIncluirDocumento;
      // Anexo não se duplica, documento cancelado não tem mais conteúdo e documento que a árvore não trouxe (movido
      // de outro processo) não se acha para copiar: o item fica, desativado, com o motivo.
      const motivo = cancelado ? "cancelado" : externo ? "só documento do SEI" : !alvo.dado ? "indisponível" : undefined;
      if (def.id === "copiar-para") {
        return {
          desativado: Boolean(motivo) || undefined,
          dica: motivo,
          executar: () => s.legado("copiar-para", alvo.id),
        };
      }
      const bloqueio = motivo ?? (fechado ? "processo fechado" : undefined);
      return {
        desativado: Boolean(bloqueio) || undefined,
        dica: bloqueio,
        executar: async () => {
          const numero = alvo.dado?.numero || (alvo.rotulo.match(/(\d{5,})\)?\s*$/)?.[1] ?? "");
          if (!numero) return s.avisar("Não foi possível achar o número SEI deste documento.", 6000);
          let semMinuta = false;
          if (/minuta/i.test(alvo.rotulo)) {
            const r = await s.perguntarMinuta();
            if (!r) return;
            semMinuta = r === "remover";
          }
          await s.duplicar(numero, semMinuta);
        },
      };
    }
    default:
      return { executar: () => {} };
  }
}

/**
 * O item do menu para o documento, ou null quando o SEI não o oferece para este documento (ou o documento é de um
 * tipo em que a ação não faz sentido).
 */
export function itemDoDocumento(def: DefItem, alvo: AlvoDocumento, opc: OpcoesMenu): ItemMenu | null {
  const base = { id: def.id, nome: def.nome, grupo: def.grupo, rotulo: def.rotulo, icone: def.icone };
  const s = opc.servicos;
  const d = alvo.dado;
  const origem = def.origem;
  if (origem.tipo === "local") {
    // Nó que não é documento (processo anexado, sem número SEI): não há o que copiar nem duplicar.
    if (!(d?.numero || numeroSeiDoRotulo(alvo.rotulo))) return null;
    // Documento movido para outro processo (`id-processo`): o link permanente seria o do processo de origem.
    if (COPIAS_COM_LINK.has(def.id) && alvo.id.includes("-")) return null;
    return { ...base, ...itemLocalDoDocumento(def, alvo, opc) };
  }
  if (!d) return null;

  if (origem.tipo === "conteudo") {
    if (!d.src) return null;
    const link = d.src;
    if (def.id === "baixar") return { ...base, executar: () => s.baixar(link, nomeDoArquivo(alvo)) };
    return { ...base, executar: () => s.abrirEmNovaAba(link) };
  }

  if (origem.tipo === "acao") {
    const link = primeiroLink(d.acoes, origem.acoes);
    if (!link) return null;
    // Imprimir Web já abre em outra aba no SEI (target _blank); os demais são telas do visualizador.
    if (def.id === "imprimir-web") return { ...base, executar: () => s.abrirEmNovaAba(link) };
    return { ...base, executar: () => s.abrirNoVisualizador(link) };
  }

  // Botão sem endereço.
  const funcao = temFuncao(d.funcoes, origem.funcoes);
  if (!funcao) return null;
  const variavel = VARIAVEL_DA_FUNCAO[funcao];
  if (!variavel) return null;
  const abrir = async (modo: "visualizador" | "aba") => {
    const link = await s.linkDaTela(d.link, variavel);
    if (!link) return s.avisar("O SEI não devolveu o endereço desta ação. Abra o documento e use o botão da barra.", 6000);
    if (modo === "aba") s.abrirEmNovaAba(link);
    else s.abrirNoVisualizador(link);
  };
  switch (def.id) {
    case "excluir":
      return {
        ...base,
        perigo: true,
        executar: async () => {
          if (await s.confirmar(`Excluir o documento ${alvo.rotulo.trim()}?`, "Excluir")) await abrir("visualizador");
        },
      };
    case "ciencia":
      return { ...base, executar: () => abrir("visualizador") };
    case "editar":
      // Documento assinado perde a assinatura ao ser editado: a pergunta do SEI (editarConteudo) fica com o botão da barra.
      if (d.assinado || d.cancelado) return null;
      return { ...base, executar: () => abrir("aba") };
    default:
      return { ...base, executar: () => abrir("aba") };
  }
}

/** Itens do menu do documento: os escolhidos pelo usuário que valem para este documento, agrupados. */
export function itensDoDocumento(alvo: AlvoDocumento, opc: OpcoesMenu): ItemMenu[] {
  const itens: ItemMenu[] = [];
  for (const def of definicoesEscolhidas(ITENS_DOCUMENTO, opc.selecao, PADRAO_MENU_DOCUMENTO)) {
    const i = itemDoDocumento(def, alvo, opc);
    if (i) itens.push(i);
  }
  return ordenarPorGrupo(itens);
}

/** Os ícones fixos ao lado do documento (`configViewFlashDocArvorePro`): os que valem para este documento. */
export function iconesFixosDoDocumento(
  alvo: AlvoDocumento,
  opc: OpcoesMenu,
  selecao: readonly string[] | null,
): Array<ItemMenu & { modo: string }> {
  const saida: Array<ItemMenu & { modo: string }> = [];
  for (const def of definicoesEscolhidas(ITENS_DOCUMENTO, selecao, PADRAO_ICONES_ARVORE)) {
    if (!def.modo) continue;
    // O ícone de duplicar só vale em documento do SEI de um processo aberto (como no legado).
    if (def.id === "duplicar" && (alvo.dado?.externo !== false || !opc.podeIncluirDocumento)) continue;
    if (def.id === "nova-aba" && !alvo.dado?.src) continue;
    const i = itemDoDocumento(def, alvo, opc);
    if (i && !i.desativado) saida.push({ ...i, modo: def.modo });
  }
  return saida;
}

/** Itens do menu do processo (o número do processo no alto da árvore). */
export function itensDoProcesso(opc: OpcoesMenu): ItemMenu[] {
  const s = opc.servicos;
  const itens: ItemMenu[] = [];
  const copiaLink = linkPermanente(opc.base, opc.idProcedimento);
  for (const def of definicoesEscolhidas(ITENS_PROCESSO, opc.selecao, PADRAO_MENU_PROCESSO)) {
    const base = { id: def.id, nome: def.nome, grupo: def.grupo, rotulo: def.rotulo, icone: def.icone };
    const o = def.origem;
    if (o.tipo === "local") {
      switch (def.id) {
        case "p-copiar-numero":
          itens.push({ ...base, executar: () => s.copiar({ texto: opc.protocolo }, "Número do processo copiado.") });
          break;
        case "p-copiar-so-numero":
          itens.push({ ...base, executar: () => s.copiar({ texto: soNumeros(opc.protocolo) }, "Número copiado.") });
          break;
        case "p-copiar-link":
          itens.push({ ...base, executar: () => s.copiar({ texto: copiaLink }, "Link do processo copiado.") });
          break;
        case "p-upload":
          if (opc.uploadLigado) itens.push({ ...base, executar: () => s.legado("enviar-externo") });
          break;
        case "p-lote":
          if (opc.loteLigado) itens.push({ ...base, executar: () => s.legado("acoes-em-lote") });
          break;
        case "p-urgencia":
          itens.push({ ...base, executar: () => s.alternarUrgencia() });
          break;
      }
      continue;
    }
    if (o.tipo === "acao") {
      const link = primeiroLink(opc.acoesProcesso, o.acoes);
      if (link) itens.push({ ...base, executar: () => s.abrirNoVisualizador(link) });
      continue;
    }
    if (o.tipo === "funcao") {
      const funcao = temFuncao(opc.funcoesProcesso, o.funcoes);
      if (!funcao) continue;
      if (funcao === "incluirEmBloco") {
        itens.push({
          ...base,
          executar: () => {
            if (!s.clicarBotaoNativo(funcao)) s.avisar("Clique no número do processo para abri-lo e use este item de novo.", 6000);
          },
        });
        continue;
      }
      const variavel = VARIAVEL_DA_FUNCAO[funcao];
      if (!variavel) continue;
      itens.push({
        ...base,
        executar: async () => {
          const link = await s.linkDaTela(opc.linkProcesso, variavel);
          if (!link) return s.avisar("O SEI não devolveu o endereço desta ação. Abra o processo e use o botão da barra.", 6000);
          if (funcao === "enviarEmailProcedimento") s.abrirEmNovaAba(link);
          else s.abrirNoVisualizador(link);
        },
      });
    }
  }
  return ordenarPorGrupo(itens);
}
