/**
 * O legado marca o item “Processo” do menu da árvore com `urgentePro`/`trancadoPro` quando a especificação
 * traz (URGENTE)/(TRANCADO). Como a especificação agora vem da loja, a marca também sai daqui, e acompanha as
 * edições (o legado só a refazia com os dados do iframe oculto).
 */
import { h } from "@comum/ui/dom";
import type { DadoProcesso } from "../modelo/dados";
import { temMarca } from "../modelo/texto";
import type { ContextoProcesso } from "./contexto";

const SELETOR = '#topmenu a[target="ifrVisualizacao"][href*="controlador.php?acao=arvore_visualizar"]';

function aplicar(doc: Document, classe: string, ligada: boolean): void {
  for (const a of doc.querySelectorAll(SELETOR)) {
    a.classList.toggle(classe, ligada);
    const marca = [...a.children].find((c) => c.classList.contains(classe));
    if (ligada && !marca) a.prepend(h("div", { class: classe }));
    if (!ligada) for (const c of [...a.children]) if (c.classList.contains(classe)) c.remove();
  }
}

export function ligarMarcaDoMenu(ctx: ContextoProcesso): () => void {
  if (ctx.sigiloso) return () => {};
  const atualizar = () => {
    const d = ctx.loja.ler<DadoProcesso>("dadosProcesso").dado;
    if (!d?.disponivel) return;
    aplicar(ctx.doc, "urgentePro", temMarca(d.valor.especificacao, "URGENTE"));
    if (ctx.usaTrancado) aplicar(ctx.doc, "trancadoPro", temMarca(d.valor.especificacao, "TRANCADO"));
  };
  const parar = ctx.loja.aoMudar((n) => {
    if (n === "dadosProcesso") atualizar();
  });
  atualizar();
  return parar;
}
