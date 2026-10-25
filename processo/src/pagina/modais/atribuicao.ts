import { h } from "@comum/ui/dom";
import type { LinhaAtribuicao } from "@nucleo/dominio/painelProcesso";
import type { ContextoProcesso } from "../contexto";
import { abrirDialogo, botaoPrimario, campo, escolhaComBusca, rodape } from "./comum";
import { opcoesDeUsuarios, separarUsuario } from "./opcoes";

export interface AtribuicaoGravada {
  /** Login do usuário atribuído; null = atribuição removida. */
  usuario: string | null;
  nome?: string;
}

/** Atribuir o processo a um usuário da unidade (seletor com busca por login e nome), ou tirar a atribuição. */
export function abrirModalAtribuicao(ctx: ContextoProcesso, linha: LinhaAtribuicao, aoGravar: (a: AtribuicaoGravada) => void): void {
  let atualDoSei: string | undefined;
  const usuarios = escolhaComBusca({
    rotulo: "Usuário da unidade",
    vazio: "Escolher um usuário…",
    dicaBusca: "Buscar por login ou nome…",
    limite: 150,
    resumo: (_mostradas, achadas, total) => (achadas === total ? `${total} usuários na unidade` : `${achadas} de ${total} usuários`),
    carregar: async () => {
      const { opcoes, atual } = await ctx.op.opcoesAtribuicao();
      const doUsuario = linha.usuario
        ? opcoes.find((o) => separarUsuario(o.texto).login.toLowerCase() === linha.usuario?.toLowerCase())?.valor
        : undefined;
      atualDoSei = atual ?? doUsuario;
      return opcoesDeUsuarios(opcoes);
    },
    valor: () => atualDoSei,
  });
  const salvar = botaoPrimario("Salvar", () => void enviar(usuarios.valor(), salvar, remover));
  const remover = h("button", { type: "button", class: "spro-botao perigo spro-esquerda" }, "Remover atribuição");
  const enviar = async (valor: string | null, ...botoes: HTMLButtonElement[]) => {
    if (valor === "") {
      d.erro("Escolha um usuário.");
      return;
    }
    const op = valor === null ? undefined : usuarios.opcoes().find((o) => o.valor === valor);
    const ok = await d.gravar(() => ctx.op.atribuir(valor), botoes);
    if (ok) aoGravar(valor === null ? { usuario: null } : { usuario: op?.rotulo ?? "", nome: op?.complemento ?? "" });
  };
  remover.addEventListener("click", () => void enviar(null, salvar, remover));
  const d = abrirDialogo(ctx, {
    titulo: "Atribuição do processo",
    icone: "pessoa",
    conteudo: [
      h(
        "div",
        { class: "spro-p-modal-lugar" },
        campo("Atribuir para", usuarios.el, linha.usuario ? `Hoje: ${linha.usuario}` : undefined),
        rodape(linha.usuario ? remover : null, salvar),
      ),
    ],
  });
}
