/** Os painéis que saem do formulário “Consultar/Alterar Processo”: especificação, tipo, nível, interessados, assuntos e observações. */
import { h, icone } from "@comum/ui/dom";
import type { NivelAcesso } from "@nucleo/dominio/arvore";
import type { DadoProcesso } from "../../modelo/dados";
import { alternarMarca, type MarcaEspecificacao, observacoesVisiveis, partesDoInteressado, temMarca } from "../../modelo/texto";
import { corpoPorEstado, nota, vazio } from "../../ui/estados";
import type { AcaoPainel } from "../../ui/painel";
import { avisarNoTopo, ICONE_DO_NIVEL, mensagemDeErro, ROTULO_DO_NIVEL } from "../comum";
import type { ContextoProcesso } from "../contexto";
import { abrirModalProcessosDoInteressado } from "../modais/interessado";
import {
  abrirModalAssuntos,
  abrirModalEspecificacao,
  abrirModalInteressados,
  abrirModalNivel,
  abrirModalObservacoes,
  abrirModalTipo,
} from "../modais/processo";
import { copiavel, type DefPainel, fatia, linha, notaIndisponivel } from "./comum";

const dadoDe = (ctx: ContextoProcesso) => {
  const d = fatia<DadoProcesso>(ctx, "dadosProcesso").dado;
  return d?.disponivel ? d.valor : null;
};

/** Pode editar: o processo está aberto na unidade e não é sigiloso. */
const editavel = (ctx: ContextoProcesso): boolean => !ctx.sigiloso && Boolean(dadoDe(ctx)?.editavel);

export async function alternarMarcaDoProcesso(ctx: ContextoProcesso, marca: MarcaEspecificacao): Promise<void> {
  const d = dadoDe(ctx);
  if (!d) return;
  const ligar = !temMarca(d.especificacao, marca);
  try {
    const r = await ctx.op.alterarProcesso({ especificacao: alternarMarca(d.especificacao, marca).slice(0, 100) });
    avisarNoTopo(
      ctx,
      r.aplicado
        ? marca === "URGENTE"
          ? ligar
            ? "Marca de urgência adicionada."
            : "Marca de urgência removida."
          : ligar
            ? "Marca de trancamento adicionada."
            : "Marca de trancamento removida."
        : r.resumo,
    );
  } catch (e) {
    avisarNoTopo(ctx, mensagemDeErro(e), 7000);
  }
  ctx.recarregar("dadosProcesso");
}

function comDados(
  ctx: ContextoProcesso,
  desenhar: (d: DadoProcesso & { disponivel: true }) => ReturnType<typeof corpoPorEstado>,
  linhas = 2,
) {
  const f = fatia<DadoProcesso>(ctx, "dadosProcesso");
  return corpoPorEstado(
    f,
    () => ctx.recarregar("dadosProcesso"),
    (d) => (d.disponivel ? desenhar(d) : [notaIndisponivel(d.motivo, "Este dado")]),
    linhas,
  );
}

export const painelDescricao: DefPainel = {
  tipo: "descricao",
  titulo: "Especificação",
  icone: "documento",
  desenhar(ctx) {
    const f = fatia<DadoProcesso>(ctx, "dadosProcesso");
    const d = dadoDe(ctx);
    const acoes: AcaoPainel[] = [];
    if (d && editavel(ctx)) {
      acoes.push({
        icone: "alerta",
        rotulo: temMarca(d.especificacao, "URGENTE") ? "Remover a marca de urgência" : "Marcar como urgente",
        ativa: temMarca(d.especificacao, "URGENTE"),
        aoClicar: () => void alternarMarcaDoProcesso(ctx, "URGENTE"),
      });
      if (ctx.usaTrancado)
        acoes.push({
          icone: "cadeado",
          rotulo: temMarca(d.especificacao, "TRANCADO") ? "Remover o trancamento" : "Trancar para peticionamento intercorrente",
          ativa: temMarca(d.especificacao, "TRANCADO"),
          aoClicar: () => void alternarMarcaDoProcesso(ctx, "TRANCADO"),
        });
      acoes.push({
        icone: "lapis",
        rotulo: "Editar especificação",
        aoClicar: () => abrirModalEspecificacao(ctx, { especificacao: d.especificacao, observacoes: d.observacoes, nivel: d.nivel }),
      });
    }
    return {
      estado: f.estado,
      desenho: {
        acoes,
        corpo: comDados(ctx, (v) => [
          linha(
            copiavel(
              ctx,
              v.valor.especificacao || "(sem especificação)",
              `${temMarca(v.valor.especificacao, "URGENTE") ? "urgente" : ""} ${temMarca(v.valor.especificacao, "TRANCADO") ? "trancado" : ""}`.trim(),
            ),
          ),
        ]),
      },
    };
  },
};

export const painelTipo: DefPainel = {
  tipo: "tipo_procedimento",
  titulo: "Tipo de Processo",
  icone: "pasta",
  desenhar(ctx) {
    // O tipo já vem na árvore: aparece sem esperar o formulário.
    const d = dadoDe(ctx);
    const tipo = d?.tipo || ctx.arv.tipo;
    return {
      estado: "pronto",
      desenho: {
        acoes: d && editavel(ctx) ? [{ icone: "lapis", rotulo: "Editar tipo de processo", aoClicar: () => abrirModalTipo(ctx, tipo) }] : [],
        corpo: [linha(copiavel(ctx, tipo || "(não informado)"))],
      },
    };
  },
};

export const painelNivel: DefPainel = {
  tipo: "nivel_acesso",
  titulo: "Nível de Acesso",
  icone: "cadeado",
  desenhar(ctx) {
    const d = dadoDe(ctx);
    const nivel: NivelAcesso = d?.nivel ?? ctx.arv.nivel;
    const hipotese = d ? d.hipotese : ctx.arv.hipotese;
    const texto =
      nivel === "restrito" ? `Restrito${hipotese ? `: ${hipotese}` : ""}` : nivel === "sigiloso" ? "Sigiloso" : ROTULO_DO_NIVEL.publico;
    return {
      estado: "pronto",
      desenho: {
        acoes:
          d && editavel(ctx) && nivel !== "sigiloso"
            ? [{ icone: "lapis", rotulo: "Editar nível de acesso", aoClicar: () => abrirModalNivel(ctx) }]
            : [],
        corpo: [
          linha(
            h("span", { class: `spro-p-nivel ${nivel}`, "aria-hidden": "true" }, icone(ICONE_DO_NIVEL[nivel], 13)),
            copiavel(ctx, texto),
          ),
        ],
      },
    };
  },
};

export const painelInteressados: DefPainel = {
  tipo: "interessados",
  titulo: "Interessados",
  icone: "pessoa",
  desenhar(ctx) {
    const f = fatia<DadoProcesso>(ctx, "dadosProcesso");
    return {
      estado: f.estado,
      desenho: {
        acoes:
          dadoDe(ctx) && editavel(ctx)
            ? [{ icone: "lapis", rotulo: "Editar interessados", aoClicar: () => abrirModalInteressados(ctx) }]
            : [],
        corpo: comDados(ctx, (v) =>
          v.valor.interessados.length
            ? v.valor.interessados.map((nome, i) => {
                const doCadastro = v.valor.interessadosItens?.[i];
                const id = doCadastro && doCadastro.texto === nome ? doCadastro.id : undefined;
                return h(
                  "div",
                  { class: "spro-p-linha interessado" },
                  ...partesDoInteressado(nome).map((p) => copiavel(ctx, p)),
                  h(
                    "button",
                    {
                      type: "button",
                      class: "spro-p-acao spro-p-proc-do-interessado",
                      "aria-label": `Processos de ${nome}`,
                      onclick: () =>
                        abrirModalProcessosDoInteressado(ctx, {
                          nome,
                          ...(id ? { id } : {}),
                          ...(v.valor.idTipo ? { tipo: v.valor.idTipo } : {}),
                          ...(v.valor.tipo ? { tipoNome: v.valor.tipo } : {}),
                        }),
                    },
                    icone("busca", 14),
                  ),
                );
              })
            : [vazio("Sem interessados.")],
        ),
      },
    };
  },
};

export const painelAssuntos: DefPainel = {
  tipo: "assuntos",
  titulo: "Assuntos",
  icone: "etiqueta",
  desenhar(ctx) {
    const f = fatia<DadoProcesso>(ctx, "dadosProcesso");
    return {
      estado: f.estado,
      desenho: {
        acoes:
          dadoDe(ctx) && editavel(ctx)
            ? [{ icone: "lapis", rotulo: "Editar assuntos", aoClicar: () => abrirModalAssuntos(ctx) }]
            : [],
        corpo: comDados(ctx, (v) =>
          v.valor.assuntos.length ? v.valor.assuntos.map((a) => linha(copiavel(ctx, a))) : [vazio("Sem assuntos.")],
        ),
      },
    };
  },
};

export const painelObservacoes: DefPainel = {
  tipo: "observacoes",
  titulo: "Observações",
  icone: "nota",
  desenhar(ctx) {
    const f = fatia<DadoProcesso>(ctx, "dadosProcesso");
    const d = dadoDe(ctx);
    return {
      estado: f.estado,
      desenho: {
        acoes:
          d && editavel(ctx)
            ? [
                {
                  icone: "lapis",
                  rotulo: "Editar observações desta unidade",
                  aoClicar: () =>
                    abrirModalObservacoes(ctx, { especificacao: d.especificacao, observacoes: d.observacoes, nivel: d.nivel }),
                },
              ]
            : [],
        corpo: comDados(ctx, (v) => {
          const lista = observacoesVisiveis(v.valor.observacoes, ctx.unidade.sigla, v.valor.observacoesOutras ?? []);
          return lista.length ? lista.map((o) => linha(copiavel(ctx, `${o.unidade}: ${o.observacao}`))) : [nota("Sem observações.")];
        }),
      },
    };
  },
};
