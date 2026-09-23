/**
 * Desfazer o que o agente fez.
 *
 * O medo de um agente que escreve é o que trava a adoção — e no SEI boa parte
 * das ações tem inversa exata (reabrir, cancelar disponibilização, retirar do
 * bloco, devolver o marcador que havia antes). Aqui fica o mapa dessas
 * inversas, montado a partir do que a ferramenta recebeu e do que o SEI
 * respondeu (`mudancas`, com o valor ANTES).
 *
 * Regra da casa: na dúvida, NÃO oferecer. Um "desfazer" que não desfaz é pior
 * que nenhum, e há ações — enviar processo, assinar, excluir — cuja reversão
 * mexe no trabalho de outras pessoas ou simplesmente não existe.
 */

export interface AcaoFeita {
  id: string;
  tool: string;
  rotulo: string;
  args: Record<string, unknown>;
  resultado: ResultadoDeEscrita;
  quando: number;
  /** Já desfeita nesta conversa. */
  desfeita?: boolean;
}

export interface ResultadoDeEscrita {
  alvo?: string;
  mudancas?: Array<{ campo: string; antes: string; depois: string }>;
  resumo?: string;
  aplicado?: boolean;
  dados?: Record<string, unknown>;
}

export interface Inversa {
  /** Operações da ponte que desfazem — uma por alvo, como as ferramentas fazem. */
  passos: Array<{ op: string; args: Record<string, unknown> }>;
  /** O que o usuário vai ler no botão e na confirmação. */
  rotulo: string;
}

/** Um passo por processo: as operações da ponte são singulares. */
const porProcesso = (op: string, processos: string[], extra: Record<string, unknown> = {}): Array<{ op: string; args: Record<string, unknown> }> =>
  processos.map((processo) => ({ op, args: { processo, ...extra, aplicar: true } }));

const texto = (v: unknown): string => (typeof v === "string" ? v : "");
const lista = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : typeof v === "string" && v ? [v] : []);

/** Valor que um campo tinha antes da ação, pelo que o SEI devolveu. */
function antesDe(r: ResultadoDeEscrita, campo: RegExp): string | undefined {
  return r.mudancas?.find((m) => campo.test(m.campo))?.antes;
}

/**
 * A inversa de uma ação, ou `null` quando não existe uma que devolva o
 * processo ao estado anterior sem efeito colateral.
 */
export function inversaDe(tool: string, args: Record<string, unknown>, r: ResultadoDeEscrita): Inversa | null {
  const processos = lista(args.processos ?? args.processo);
  switch (tool) {
    case "processo_concluir":
      return processos.length ? { passos: porProcesso("processo.reabrir", processos), rotulo: `Reabrir ${processos.join(", ")}` } : null;
    case "processo_reabrir":
      return processos.length ? { passos: porProcesso("processo.concluir", processos), rotulo: `Concluir de novo ${processos.join(", ")}` } : null;

    case "processo_marcador": {
      // Tinha outro marcador antes? Devolve. Não tinha? Remove o que foi posto.
      const antes = antesDe(r, /marcador/i);
      if (args.remover === true) {
        return antes ? { passos: porProcesso("processo.marcador", processos, { marcador: antes }), rotulo: `Devolver o marcador "${antes}"` } : null;
      }
      return antes
        ? { passos: porProcesso("processo.marcador", processos, { marcador: antes }), rotulo: `Voltar ao marcador "${antes}"` }
        : { passos: porProcesso("processo.marcador", processos, { marcador: texto(args.marcador), remover: true }), rotulo: `Tirar o marcador "${texto(args.marcador)}"` };
    }

    case "processo_anotacao": {
      const antes = antesDe(r, /anota/i) ?? "";
      return { passos: porProcesso("processo.anotacao", processos, { texto: antes }), rotulo: antes ? "Voltar à anotação anterior" : "Apagar a anotação" };
    }

    case "processo_atribuir": {
      const antes = antesDe(r, /atribu/i) ?? "";
      return { passos: porProcesso("processo.atribuir", processos, antes ? { usuario: antes } : {}), rotulo: antes ? `Devolver a atribuição a ${antes}` : "Tirar a atribuição" };
    }

    // Acompanhamento especial: o núcleo ainda não sabe REMOVER, só incluir e
    // alterar. Oferecer um desfazer que não remove seria mentira.
    case "processo_acompanhamento":
      return null;

    case "bloco_incluir": {
      const docs = lista(args.documentos);
      return docs.length
        ? { passos: [{ op: "bloco.retirar", args: { bloco: texto(args.bloco), itens: docs, aplicar: true } }], rotulo: `Retirar ${docs.join(", ")} do bloco ${texto(args.bloco)}` }
        : null;
    }
    case "bloco_retirar": {
      const itens = lista(args.itens);
      return itens.length
        ? { passos: [{ op: "bloco.incluir", args: { bloco: texto(args.bloco), documentos: itens, aplicar: true } }], rotulo: `Pôr ${itens.join(", ")} de volta no bloco ${texto(args.bloco)}` }
        : null;
    }
    case "bloco_disponibilizar":
      return { passos: [{ op: "bloco.mudar", args: { bloco: texto(args.bloco), acao: "cancelar", aplicar: true } }], rotulo: `Cancelar a disponibilização do bloco ${texto(args.bloco)}` };
    case "bloco_concluir":
      return { passos: [{ op: "bloco.mudar", args: { bloco: texto(args.bloco), acao: "reabrir", aplicar: true } }], rotulo: `Reabrir o bloco ${texto(args.bloco)}` };
    case "bloco_reabrir":
      return { passos: [{ op: "bloco.mudar", args: { bloco: texto(args.bloco), acao: "concluir", aplicar: true } }], rotulo: `Concluir de novo o bloco ${texto(args.bloco)}` };
    case "bloco_criar": {
      const numero = texto(r.dados?.bloco);
      return numero ? { passos: [{ op: "bloco.mudar", args: { bloco: numero, acao: "excluir", aplicar: true } }], rotulo: `Excluir o bloco ${numero}` } : null;
    }

    case "documento_criar": {
      const numero = texto(r.dados?.numero) || texto(r.alvo);
      // Documento assinado não se exclui: aí o caminho é cancelar, que é outra coisa.
      return numero && !r.dados?.assinado ? { passos: [{ op: "documento.excluir", args: { numero, aplicar: true } }], rotulo: `Excluir o documento ${numero}` } : null;
    }

    default:
      // processo_enviar (a outra unidade já recebeu), documento_assinar,
      // documento_excluir, documento_cancelar, processo_andamento (o histórico
      // do SEI não se apaga) e as demais não têm inversa honesta.
      return null;
  }
}

/** Por que uma ação não pode ser desfeita, para o usuário não ficar procurando o botão. */
export function motivoSemDesfazer(tool: string): string {
  if (tool === "processo_enviar") return "o processo já está na outra unidade";
  if (tool === "documento_assinar") return "assinatura não se apaga, só se cancela com justificativa";
  if (tool === "documento_excluir" || tool === "documento_cancelar") return "a exclusão e o cancelamento são definitivos no SEI";
  if (tool === "processo_andamento") return "o histórico do processo não se apaga";
  if (tool === "documento_editar" || tool === "editor_escrever") return "o conteúdo anterior está na versão do documento no SEI";
  if (tool === "processo_acompanhamento") return "o agente ainda não sabe retirar do acompanhamento especial";
  return "";
}
