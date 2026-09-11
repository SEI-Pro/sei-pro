/**
 * Escolha de documentos do processo aberto no SEI.
 *
 * `<dialog>` nativo em vez de janela de biblioteca: traz foco preso, fechamento
 * por Esc e `::backdrop` sem carregar nada. A extensao embarca jQuery UI, mas
 * usa-lo aqui custaria peso para reimplementar o que o navegador ja faz.
 */

import { el, repor } from "@/ui/dom";

export interface DocumentoEscolhivel {
  id: string;
  nome: string;
  numero?: string;
}

export interface OpcoesEscolha {
  /**
   * Só um documento pode ser escolhido.
   *
   * É o caso do Tarjar, que trabalha um documento por vez: trazer um segundo
   * substituiria o primeiro sem aviso, e perder marcações já feitas é pior do
   * que pedir para repetir a operação.
   */
  unico?: boolean;
}

export function escolherDocumentosDoProcesso(
  docs: DocumentoEscolhivel[],
  opcoes: OpcoesEscolha = {},
): Promise<{ id: string; nome: string }[]> {
  return new Promise((resolver) => {
    const marcados = new Set<string>();

    const lista = el(
      "ul",
      { class: "fpdf-escolher__lista" },
      ...docs.map((doc) => {
        const id = `doc-${doc.id}`;
        const caixa = el("input", {
          type: opcoes.unico ? "radio" : "checkbox",
          name: opcoes.unico ? "documento-escolhido" : undefined,
          id,
          onchange: (ev: Event) => {
            const alvo = ev.target as HTMLInputElement;
            if (opcoes.unico) marcados.clear();
            if (alvo.checked) marcados.add(doc.id);
            else marcados.delete(doc.id);
            atualizarContagem();
          },
        });
        return el(
          "li",
          {},
          caixa,
          el(
            "label",
            { for: id },
            el("span", { class: "fpdf-escolher__nome" }, doc.nome),
            // O número só aparece quando o nome ainda não o traz: o SEI já
            // costuma incluí-lo no próprio título do documento, e repetir
            // produzia "Anexo - Cadastro e-mail (3009576) (3009576)".
            doc.numero && !doc.nome.includes(doc.numero)
              ? el("span", { class: "fpdf-escolher__numero" }, ` (${doc.numero})`)
              : null,
          ),
        );
      }),
    );

    const contagem = el("span", { class: "fpdf-escolher__contagem" });
    const confirmar = el(
      "button",
      {
        type: "button",
        class: "fpdf-botao fpdf-botao--primario",
        disabled: true,
        onclick: () => {
          const escolhidos = docs
            .filter((d) => marcados.has(d.id))
            .map((d) => ({ id: d.id, nome: d.nome }));
          fechar(escolhidos);
        },
      },
      opcoes.unico ? "Trazer documento" : "Trazer selecionados",
    );

    function atualizarContagem() {
      repor(
        contagem,
        marcados.size === 0
          ? opcoes.unico
            ? "Escolha um documento"
            : "Nenhum documento marcado"
          : opcoes.unico
            ? "1 documento escolhido"
            : `${marcados.size} de ${docs.length} marcados`,
      );
      confirmar.disabled = marcados.size === 0;
    }

    const dialogo = el(
      "dialog",
      { class: "fpdf-escolher" },
      el(
        "form",
        { method: "dialog" },
        el(
          "header",
          { class: "fpdf-escolher__cabecalho" },
          el("h3", {}, "Documentos do processo"),
          el(
            "p",
            {},
            opcoes.unico
              ? "Estão listados os documentos externos em PDF. Escolha um: o arquivo é lido direto do SEI, nesta máquina."
              : "Estão listados os documentos externos em PDF. Os arquivos são lidos direto do SEI, nesta máquina.",
          ),
        ),
        lista,
        el(
          "footer",
          { class: "fpdf-escolher__rodape" },
          contagem,
          el(
            "button",
            { type: "button", class: "fpdf-botao fpdf-botao--texto", onclick: () => fechar([]) },
            "Cancelar",
          ),
          confirmar,
        ),
      ),
    );

    function fechar(resposta: { id: string; nome: string }[]) {
      dialogo.close();
      dialogo.remove();
      resolver(resposta);
    }

    // Esc fecha o <dialog> sozinho; sem este tratador a promessa nunca resolve.
    dialogo.addEventListener("cancel", () => fechar([]));

    document.body.appendChild(dialogo);
    atualizarContagem();
    dialogo.showModal();
  });
}
