import { h } from "@comum/ui/dom";
import { type DadoBlocoInterno, historicoVale } from "../../modelo/dados";
import { nota } from "../../ui/estados";
import { copiavel, type DefPainel, fatia, linha } from "./comum";

/**
 * Bloco interno não tem leitura barata e sem efeito colateral: só sai do histórico completo. Decisão do autor:
 * o painel mostra o bloco quando o histórico completo está em cache (30 min, coletado por clique) e, senão,
 * apenas um link discreto “Carregar do histórico” (que coleta, com progresso). Nada coleta sozinho.
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
    const aviso = h("span", { class: "spro-p-nota", hidden: true }, "Não foi possível carregar o histórico do processo.");
    const pedir = h("button", { type: "button", class: "spro-p-link discreto" }, "Carregar do histórico");
    pedir.addEventListener("click", () => {
      if (pedir.disabled) return;
      pedir.disabled = true;
      aviso.hidden = true;
      pedir.textContent = "Carregando…";
      void ctx
        .aoPedirHistorico((feito, total) => {
          pedir.textContent = `Carregando… página ${feito} de ${total}`;
        })
        .then((ok) => {
          // Com a coleta pronta a fatia mudou e o painel já foi redesenhado; este botão só importa quando falhou.
          pedir.disabled = false;
          pedir.textContent = "Carregar do histórico";
          aviso.hidden = ok;
        });
    });
    return { estado: "pronto", desenho: { corpo: [h("div", { class: "spro-p-linha" }, pedir, aviso)] } };
  },
};
