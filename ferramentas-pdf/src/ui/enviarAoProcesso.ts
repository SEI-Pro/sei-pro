/**
 * Devolver um arquivo ao processo, perguntando o tipo quando for preciso.
 *
 * Todas as ferramentas que enviam ao SEI passam por aqui, e não direto pela
 * ponte. O motivo é o `SEI_TIPO_INDEFINIDO`: quando o nome do arquivo não diz o
 * tipo e o órgão não tem "Anexo", a ponte RECUSA em vez de escolher às cegas, e
 * alguém precisa perguntar ao usuário. Com a pergunta num lugar só, nenhuma
 * ferramenta nova nasce caindo no erro -- nem voltando a enviar com o primeiro
 * tipo da lista.
 *
 * A pergunta acontece ENTRE dois pedidos à ponte, e não dentro de um: o pedido
 * que recusou já terminou, então o prazo do envio não corre enquanto o usuário
 * escolhe. E a recusa acontece antes do upload -- nada subiu ainda.
 */

import {
  ErroPonte,
  type AoProgredir,
  type PonteSei,
  type SaidaParaSei,
  type TipoDocumentoSei,
} from "@/plataforma/ponteSei";
import { ponte } from "@/ui/contexto";

export type PerguntarTipo = (
  nomeArquivo: string,
  tipos: TipoDocumentoSei[],
  preSelecionado?: string,
) => Promise<string | null>;

/** Última escolha desta página, para já vir marcada na próxima pergunta. */
let ultimoTipo: string | undefined;

async function perguntarPeloDialogo(
  ...args: Parameters<PerguntarTipo>
): ReturnType<PerguntarTipo> {
  const { escolherTipoDocumento } = await import("@/ui/componentes/escolherTipoDocumento");
  return escolherTipoDocumento(...args);
}

export async function enviarAoProcesso(
  saida: SaidaParaSei,
  aoProgredir?: AoProgredir,
  // Injetáveis só para o teste, que roda sem DOM e sem SEI.
  dependencias: { ponte?: () => PonteSei; perguntar?: PerguntarTipo } = {},
): Promise<{ id: string }> {
  const daPonte = dependencias.ponte ?? ponte;
  const perguntar = dependencias.perguntar ?? perguntarPeloDialogo;

  try {
    return await daPonte().enviarAoProcesso(saida, aoProgredir);
  } catch (e) {
    const { codigo, tipos } = e as { codigo?: string; tipos?: TipoDocumentoSei[] };
    if (codigo !== "SEI_TIPO_INDEFINIDO" || !tipos?.length) throw e;

    const escolhido = await perguntar(saida.nome, tipos, ultimoTipo);
    if (!escolhido) throw new ErroPonte("SEI_ENVIO_CANCELADO");
    ultimoTipo = escolhido;

    // Uma pergunta só. Se o SEI recusar de novo (o tipo sumiu da lista entre
    // um pedido e outro), o erro sobe com a mensagem dele, em vez de a
    // pergunta se repetir em volta.
    return daPonte().enviarAoProcesso({ ...saida, tipoDocumentoId: escolhido }, aoProgredir);
  }
}
