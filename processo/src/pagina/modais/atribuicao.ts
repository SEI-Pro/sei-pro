import { h } from "@comum/ui/dom";
import type { LinhaAtribuicao } from "@nucleo/dominio/painelProcesso";
import type { ContextoProcesso } from "../contexto";
import { abrirDialogo, botaoPrimario, listaComBusca, rodape } from "./comum";

export interface AtribuicaoGravada {
  /** Login do usuário atribuído; null = atribuição removida. */
  usuario: string | null;
  nome?: string;
}

/** Atribuir o processo a um usuário da unidade (lista com busca), ou tirar a atribuição. */
export function abrirModalAtribuicao(ctx: ContextoProcesso, linha: LinhaAtribuicao, aoGravar: (a: AtribuicaoGravada) => void): void {
  const lugar = h("div", { class: "spro-p-modal-lugar" }, h("p", { class: "spro-p-nota" }, "Carregando a lista de usuários…"));
  const d = abrirDialogo(ctx, { titulo: "Atribuição do processo", icone: "pessoa", conteudo: [lugar] });
  void ctx.op
    .opcoesAtribuicao()
    .then(({ opcoes, atual }) => {
      if (!d.el.isConnected) return;
      const doUsuario = linha.usuario
        ? opcoes.find((o) => o.texto.split(" - ")[0]?.trim().toLowerCase() === linha.usuario?.toLowerCase())?.valor
        : undefined;
      const lista = listaComBusca(opcoes, atual ?? doUsuario, "usuários da unidade");
      const salvar = botaoPrimario("Salvar", () => void enviar(lista.valor(), salvar, remover));
      const remover = h("button", { type: "button", class: "spro-botao perigo spro-esquerda" }, "Remover atribuição");
      const enviar = async (valor: string | null, ...botoes: HTMLButtonElement[]) => {
        if (valor === "") {
          d.erro("Escolha um usuário.");
          return;
        }
        const op = valor === null ? undefined : opcoes.find((o) => o.valor === valor);
        const ok = await d.gravar(() => ctx.op.atribuir(valor), botoes);
        if (ok) {
          const [login = "", ...nome] = (op?.texto ?? "").split(" - ");
          aoGravar(valor === null ? { usuario: null } : { usuario: login.trim(), nome: nome.join(" - ").trim() });
        }
      };
      remover.addEventListener("click", () => void enviar(null, salvar, remover));
      lugar.replaceChildren(h("p", { class: "spro-p-nota" }, "Atribuir para:"), lista.el, rodape(linha.usuario ? remover : null, salvar));
    })
    .catch((e) => {
      d.erro(e instanceof Error ? e.message : "Não foi possível carregar a lista de usuários.");
      lugar.replaceChildren();
    });
}
