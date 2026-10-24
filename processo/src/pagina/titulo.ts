/**
 * Título da aba/janela do processo: "<especificação> | SEI - Processo <número>", o mesmo formato do legado
 * (`updateTitlePage`, modo "processo"). Sai do que a loja já tem (cache ou a leitura do formulário do processo), sem o
 * iframe oculto. A janela de topo é quem tem o `<title>`: o quadro da árvore o grava lá (mesma origem).
 *
 * Divergências do legado: processo sem especificação fica "SEI - Processo <número>" (o legado deixava " | SEI - ..."
 * com a barra sobrando) e processo sigiloso não é tocado (a especificação dele não vai para a tela nem para o título).
 */
import type { DadoProcesso } from "../modelo/dados";
import type { ContextoProcesso } from "./contexto";

export function montarTitulo(especificacao: string, protocolo: string): string {
  const esp = especificacao.replace(/\s+/g, " ").trim();
  return esp ? `${esp} | SEI - Processo ${protocolo}` : `SEI - Processo ${protocolo}`;
}

type DepsTitulo = Pick<ContextoProcesso, "topo" | "loja" | "protocolo" | "sigiloso" | "consultasDesativadas">;

/** Mantém o título da janela de topo com a especificação do processo. Devolve o desligador. */
export function ligarTitulo(ctx: DepsTitulo): () => void {
  if (ctx.sigiloso || ctx.consultasDesativadas) return () => undefined;
  const aplicar = (): void => {
    const d = ctx.loja.ler<DadoProcesso>("dadosProcesso").dado;
    if (!d || !d.disponivel) return;
    const titulo = montarTitulo(d.valor.especificacao, ctx.protocolo);
    if (ctx.topo.title !== titulo) ctx.topo.title = titulo;
  };
  const parar = ctx.loja.aoMudar((n) => {
    if (n === "dadosProcesso") aplicar();
  });
  aplicar();
  return parar;
}
