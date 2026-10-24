import { h } from "@comum/ui/dom";
import { type DadoBlocoInterno, historicoVale } from "../../modelo/dados";
import { nota } from "../../ui/estados";
import { copiavel, type DefPainel, fatia, linha } from "./comum";

/**
 * Bloco interno não tem leitura barata e sem efeito colateral: só sai do histórico completo. Decisão do autor:
 * o painel mostra o bloco quando o histórico completo está em cache (30 min, coletado por clique) e, senão,
 * apenas um link discreto “Carregar do histórico”. Nada coleta sozinho.
 */
export const painelBlocoInterno: DefPainel = {
  tipo: "bloco_interno",
  titulo: "Bloco Interno",
  icone: "camadas",
  desenhar(ctx) {
    const f = fatia<DadoBlocoInterno>(ctx, "blocoInterno");
    const d = f.dado;
    if (d && historicoVale(d.coletadoEm, ctx.agora().getTime())) {
      return { estado: "pronto", desenho: { corpo: [linha(d.descricao ? copiavel(ctx, d.descricao) : nota("Nenhum bloco localizado."))] } };
    }
    const aviso = h("span", { class: "spro-p-nota", hidden: true }, "A coleta do histórico ainda não está disponível nesta versão.");
    const pedir = h("button", { type: "button", class: "spro-p-link discreto" }, "Carregar do histórico");
    pedir.addEventListener("click", () => {
      void ctx.aoPedirHistorico().then((ok) => {
        aviso.hidden = ok;
      });
    });
    return { estado: "pronto", desenho: { corpo: [h("div", { class: "spro-p-linha" }, pedir, aviso)] } };
  },
};
