import { h } from "@comum/ui/dom";
import type { MarcadorDoPainel, OpcaoLista } from "@nucleo/dominio/painelProcesso";
import { comporTextoMarcador, separarTextoMarcador } from "../../modelo/texto";
import { tagMarcador } from "../../ui/tagMarcador";
import type { ContextoProcesso } from "../contexto";
import { abrirDialogo, botaoPrimario, campo, escolhaComBusca, interruptor, preencher, rodape } from "./comum";
import { opcoesDeMarcadores } from "./opcoes";

const hojeIso = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Adiciona um marcador ao processo ou edita o texto/prazo de um que já está nele. */
export function abrirModalMarcador(ctx: ContextoProcesso, item?: MarcadorDoPainel): void {
  const lugar = h("div", { class: "spro-p-modal-lugar" });
  const d = abrirDialogo(ctx, {
    titulo: item ? "Editar marcador" : "Adicionar marcador",
    icone: "etiqueta",
    largura: 520,
    conteudo: [lugar],
  });
  montar(ctx, d, lugar, item);
}

function montar(ctx: ContextoProcesso, d: ReturnType<typeof abrirDialogo>, lugar: HTMLElement, item?: MarcadorDoPainel): void {
  const atual = item ? separarTextoMarcador(item.texto) : { prazo: null, texto: "" };
  let opcoes: OpcaoLista[] = [];
  const lista = escolhaComBusca({
    rotulo: "Marcador",
    vazio: "Escolher um marcador…",
    dicaBusca: "Buscar marcador…",
    limite: 150,
    carregar: async () => {
      opcoes = await ctx.op.opcoesMarcador();
      return opcoesDeMarcadores(opcoes, ctx.topo);
    },
    valor: () => (item ? opcoes.find((o) => o.texto === item.nome)?.valor : undefined),
  });

  const controlar = interruptor("Controlar prazo", Boolean(atual.prazo), (v) => (linhasPrazo.hidden = !v));
  const vencimento = interruptor("Controlar vencimento (“Até”)", Boolean(atual.prazo?.vencimento), () => {});
  const data = h("input", { type: "date", class: "spro-campo", "aria-label": "Data do prazo" });
  data.value = atual.prazo?.data ?? hojeIso(ctx.agora());
  const hora = h("input", { type: "time", class: "spro-campo", "aria-label": "Hora do prazo" });
  hora.value = atual.prazo?.hora ?? "23:59";
  const linhasPrazo = h(
    "div",
    { class: "spro-p-grade", hidden: !atual.prazo },
    vencimento.el,
    h("div", { class: "spro-p-par" }, data, hora),
  );
  const texto = h("textarea", { class: "spro-campo", rows: "3", maxlength: "200", placeholder: "Texto do marcador (opcional)" });
  texto.value = atual.texto;

  const salvar = botaoPrimario("Salvar", () => void enviar());
  const enviar = async () => {
    const escolhido = opcoes.find((o) => o.valor === lista.valor());
    if (!escolhido) {
      d.erro("Escolha um marcador.");
      return;
    }
    if (controlar.input.checked && !data.value) {
      d.erro("Informe a data do prazo.");
      return;
    }
    const final = comporTextoMarcador({
      prazo: controlar.input.checked ? { data: data.value, hora: hora.value || "23:59", vencimento: vencimento.input.checked } : null,
      texto: texto.value,
    });
    const ok = await d.gravar(async () => {
      // Trocar o marcador de um item existente = tirar o antigo e pôr o novo.
      if (item && escolhido.texto !== item.nome) await ctx.op.desmarcar(item.nome);
      return ctx.op.marcar({ marcador: escolhido.texto, texto: final });
    }, [salvar]);
    // Mesmo com falha no meio (tirou o antigo e não pôs o novo) o painel precisa refletir o que o SEI tem.
    ctx.recarregar("marcador");
    return ok;
  };
  preencher(
    lugar,
    campo("Marcador", lista.el),
    item
      ? h(
          "p",
          { class: "spro-p-nota spro-p-nota-marcador" },
          tagMarcador(item.icone, 13, ctx.topo),
          ` Atual: ${item.nome}. Escolher outro troca o marcador.`,
        )
      : null,
    controlar.el,
    linhasPrazo,
    campo("Texto", texto),
    rodape(salvar),
  );
}
