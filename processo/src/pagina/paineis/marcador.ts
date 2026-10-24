import { h, icone } from "@comum/ui/dom";
import type { MarcadorDoPainel } from "@nucleo/dominio/painelProcesso";
import type { DadoMarcador } from "../../modelo/dados";
import { dataBrasileira, prazoNativoDaPagina, separarTextoMarcador, situacaoDoPrazo } from "../../modelo/texto";
import { corpoPorEstado, vazio } from "../../ui/estados";
import { botaoDeAcao } from "../../ui/painel";
import { avisarNoTopo } from "../comum";
import type { ContextoProcesso } from "../contexto";
import { confirmar } from "../modais/comum";
import { abrirModalMarcador } from "../modais/marcador";
import { copiavel, type DefPainel, fatia, linha } from "./comum";

function chipPrazo(ctx: ContextoProcesso, texto: string): HTMLElement | null {
  const { prazo } = separarTextoMarcador(texto);
  if (!prazo) return null;
  const s = situacaoDoPrazo(prazo, ctx.agora());
  return h(
    "span",
    { class: `spro-p-chip ${s.nivel}` },
    icone("relogio", 11),
    `${prazo.vencimento ? "até " : ""}${dataBrasileira(prazo)} · ${s.rotulo}`,
  );
}

async function remover(ctx: ContextoProcesso, m: MarcadorDoPainel): Promise<void> {
  if (!(await confirmar(ctx, `Remover o marcador “${m.nome}” deste processo?`, "Remover"))) return;
  try {
    const r = await ctx.op.desmarcar(m.nome);
    avisarNoTopo(ctx, r.resumo);
  } catch (e) {
    avisarNoTopo(ctx, e instanceof Error ? e.message : "Não foi possível remover o marcador.", 7000);
  }
  ctx.recarregar("marcador");
}

function itemMarcador(ctx: ContextoProcesso, m: MarcadorDoPainel, editavel: boolean): HTMLElement {
  const { texto } = separarTextoMarcador(m.texto);
  const img = m.icone ? h("img", { class: "spro-p-marcador-icone", src: m.icone, alt: "" }) : icone("etiqueta", 14);
  return linha(
    h(
      "div",
      { class: "spro-p-marcador" },
      copiavel(ctx, m.nome, "forte", img),
      chipPrazo(ctx, m.texto),
      texto ? copiavel(ctx, texto, "suave") : null,
    ),
    editavel && m.id
      ? h(
          "span",
          { class: "spro-p-acoes-linha" },
          botaoDeAcao({ icone: "lapis", rotulo: `Editar o marcador ${m.nome}`, aoClicar: () => abrirModalMarcador(ctx, m) }),
          botaoDeAcao({ icone: "lixeira", rotulo: `Remover o marcador ${m.nome}`, perigo: true, aoClicar: () => void remover(ctx, m) }),
        )
      : null,
  );
}

export const painelMarcador: DefPainel = {
  tipo: "marcador",
  titulo: "Marcador",
  icone: "etiqueta",
  desenhar(ctx) {
    const f = fatia<DadoMarcador>(ctx, "marcador");
    const nativo = prazoNativoDaPagina(ctx.arv.pagina.html);
    return {
      estado: f.estado,
      desenho: {
        acoes: f.dado?.editavel ? [{ icone: "mais", rotulo: "Adicionar marcador", aoClicar: () => abrirModalMarcador(ctx) }] : [],
        corpo: [
          ...corpoPorEstado(
            f,
            () => ctx.recarregar("marcador"),
            (d) => (d.itens.length ? d.itens.map((m) => itemMarcador(ctx, m, d.editavel)) : [vazio("Sem marcador.")]),
          ),
          nativo
            ? h(
                "div",
                { class: "spro-p-prazo-nativo" },
                h(
                  "span",
                  { class: `spro-p-chip ${nativo.nivel === "concluido" ? "ok" : nativo.nivel}` },
                  icone("relogio", 11),
                  `Prazo do SEI: ${nativo.data} (${nativo.estado})`,
                ),
              )
            : null,
        ],
      },
    };
  },
};
