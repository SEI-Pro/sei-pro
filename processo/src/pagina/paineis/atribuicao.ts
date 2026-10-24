import { h } from "@comum/ui/dom";
import type { DadoAtribuicao } from "../../modelo/dados";
import { textoComAtribuicao } from "../../modelo/texto";
import { corpoPorEstado, nota } from "../../ui/estados";
import { botaoDeAcao } from "../../ui/painel";
import { abrirModalAtribuicao } from "../modais/atribuicao";
import { copiavel, type DefPainel, fatia, linha } from "./comum";

/** Onde o processo está aberto e a quem a unidade o atribuiu. Lido da própria árvore: sem rede, aparece junto com ela. */
export const painelAtribuicao: DefPainel = {
  tipo: "responsaveis",
  titulo: "Atribuição",
  icone: "pessoa",
  desenhar(ctx) {
    const f = fatia<DadoAtribuicao>(ctx, "atribuicao");
    const minha = ctx.unidade.sigla.toLowerCase();
    return {
      estado: f.estado,
      desenho: {
        corpo: corpoPorEstado(
          f,
          () => ctx.recarregar("atribuicao"),
          (d) => {
            if (!d.linhas.length) return [nota(d.texto || "Processo sem andamento aberto.")];
            return d.linhas.map((l) => {
              const naoAtribuido = !l.usuario && !ctx.sigiloso;
              const podeEditar = d.editavel && l.unidade.toLowerCase() === minha;
              return linha(
                copiavel(ctx, l.texto),
                naoAtribuido ? h("span", { class: "spro-p-chip aviso" }, "não atribuído") : null,
                podeEditar
                  ? botaoDeAcao({
                      icone: "lapis",
                      rotulo: "Editar atribuição",
                      aoClicar: () =>
                        abrirModalAtribuicao(ctx, l, (nova) => {
                          const atual = ctx.loja.ler<DadoAtribuicao>("atribuicao");
                          if (!atual.dado) return;
                          // A árvore da tela não se refaz: a linha da minha unidade acompanha a troca.
                          const linhas = atual.dado.linhas.map((x) =>
                            x === l
                              ? { ...x, usuario: nova.usuario, nomeUsuario: nova.nome, texto: textoComAtribuicao(x.texto, nova.usuario) }
                              : x,
                          );
                          ctx.loja.definir<DadoAtribuicao>("atribuicao", {
                            estado: "pronto",
                            em: ctx.agora().getTime(),
                            dado: { ...atual.dado, linhas, usuario: nova.usuario },
                          });
                        }),
                    })
                  : null,
              );
            });
          },
          1,
        ),
      },
    };
  },
};
