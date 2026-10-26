/**
 * Os painéis abaixo da árvore, acompanhando a personalização AO VIVO: a chave geral da aba Painel monta ou tira todos, e a
 * lista de painéis escolhidos refaz a montagem (a loja guarda os dados: só carrega a fatia que ainda não veio). O que muda a
 * personalização pode ser a tela nova (barramento) ou o legado em outra janela (evento `storage`).
 */
import { restaurarBlocoInterno } from "../gantt/coleta";
import { paineisHabilitados } from "../modelo/paineis";
import type { NomeFatia } from "../modelo/tipos";
import { fatiasNecessarias, manterMontagem } from "./arvore";
import type { ContextoProcesso } from "./contexto";
import { ligarMarcaDoMenu } from "./menuTopo";
import { lerSelecao, painelLigado } from "./opcoes";
import { observarPersonalizacao } from "./personalizar/mudancas";

export interface OpcoesPaineisVivos {
  /** O título da aba também usa a especificação: a fatia `dadosProcesso` entra na carga. */
  comTitulo: boolean;
  /** Onde chega o evento `storage` das outras janelas (null nos testes). */
  janela: Pick<Window, "addEventListener" | "removeEventListener"> | null;
}

export function ligarPaineisVivos(ctx: ContextoProcesso, o: OpcoesPaineisVivos): { aplicar(): void; parar(): void } {
  let montagem: { parar(): void } | null = null;
  let marcaDoMenu: (() => void) | null = null;
  let primeira = true;
  /** Fatias que este quadro já pediu: trocar a personalização só carrega as que faltam (um painel com erro tem o "Tentar de novo" dele). */
  const pedidas = new Set<NomeFatia>();
  const aplicar = (): void => {
    montagem?.parar();
    montagem = null;
    if (!painelLigado(ctx.armazenamento)) return;
    ctx.habilitados = paineisHabilitados(lerSelecao(ctx.armazenamento));
    montagem = manterMontagem(ctx);
    marcaDoMenu ??= ligarMarcaDoMenu(ctx);
    const fatias = new Set(fatiasNecessarias(ctx));
    if (o.comTitulo && !ctx.sigiloso) fatias.add("dadosProcesso");
    // Só o que ainda não foi pedido: trocar a personalização não pode refazer as consultas do processo.
    for (const n of fatias) {
      if (pedidas.has(n)) continue;
      pedidas.add(n);
      ctx.recarregar(n);
    }
    // Histórico completo ainda válido no cache (coletado por clique há menos de 30 min): o Bloco Interno aparece sem rede.
    if (primeira) void restaurarBlocoInterno(ctx).catch(() => undefined);
    primeira = false;
  };
  aplicar();
  const sair = observarPersonalizacao(ctx.armazenamento, o.janela, (aba) => {
    if (aba === "painel") aplicar();
  });
  return {
    aplicar,
    parar() {
      sair();
      montagem?.parar();
      montagem = null;
      marcaDoMenu?.();
      marcaDoMenu = null;
    },
  };
}
