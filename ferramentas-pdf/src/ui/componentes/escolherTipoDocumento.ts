/**
 * Escolha do tipo de documento com que o arquivo entra no processo.
 *
 * Só aparece quando o SEI Pro NÃO consegue deduzir o tipo: o nome do arquivo
 * não começa por um tipo, não há tipo padrão configurado e o órgão não tem
 * "Anexo". Antes, nesse caso, o documento entrava com o primeiro tipo da lista
 * do SEI -- "Abaixo-Assinado", no SEI SP -- sem ninguém ter escolhido.
 *
 * Mesmo desenho do `escolherDocumentos`: `<dialog>` nativo, com foco preso e Esc
 * de graça. Esc e "Cancelar envio" dão no mesmo: nada é enviado.
 */

import type { TipoDocumentoSei } from "@/plataforma/ponteSei";
import { el } from "@/ui/dom";

/**
 * Pergunta o tipo. Devolve o `valor` do tipo escolhido, ou nulo se o usuário
 * desistir.
 *
 * `preSelecionado` é a escolha anterior desta sessão: quem divide um arquivo em
 * cinco partes responde a mesma coisa cinco vezes, e a pergunta já vem com a
 * resposta dada -- basta confirmar.
 */
export function escolherTipoDocumento(
  nomeArquivo: string,
  tipos: TipoDocumentoSei[],
  preSelecionado?: string,
): Promise<string | null> {
  return new Promise((resolver) => {
    const campo = el(
      "select",
      {
        class: "fpdf-campo",
        id: "fpdf-tipo-documento",
        onchange: () => {
          confirmar.disabled = campo.value === "";
        },
      },
      el("option", { value: "" }, "Escolha o tipo"),
      ...tipos.map((t) => el("option", { value: t.valor }, t.nome)),
    ) as HTMLSelectElement;
    // Só pré-seleciona o que ESTA lista oferece: a escolha anterior pode ser de
    // outro processo, em outra unidade, com outros tipos.
    if (preSelecionado && tipos.some((t) => t.valor === preSelecionado)) {
      campo.value = preSelecionado;
    }

    const confirmar = el(
      "button",
      {
        type: "button",
        class: "fpdf-botao fpdf-botao--primario",
        disabled: true,
        onclick: () => fechar(campo.value || null),
      },
      "Enviar ao processo",
    );

    const dialogo = el(
      "dialog",
      { class: "fpdf-escolher" },
      el(
        "form",
        { method: "dialog" },
        el(
          "header",
          { class: "fpdf-escolher__cabecalho" },
          el("h3", {}, "Tipo do documento"),
          el(
            "p",
            {},
            "O nome do arquivo ",
            el("strong", {}, nomeArquivo),
            " não começa por um tipo de documento, e não há tipo padrão nem Anexo para usar. Escolha o tipo com que ele entra no processo.",
          ),
        ),
        el(
          "div",
          { class: "fpdf-opcoes__linha" },
          el("label", { for: "fpdf-tipo-documento" }, "Tipo"),
          campo,
        ),
        el(
          "footer",
          { class: "fpdf-escolher__rodape" },
          el(
            "button",
            { type: "button", class: "fpdf-botao fpdf-botao--texto", onclick: () => fechar(null) },
            "Cancelar envio",
          ),
          confirmar,
        ),
      ),
    );

    let fechado = false;
    function fechar(resposta: string | null) {
      if (fechado) return;
      fechado = true;
      dialogo.close();
      dialogo.remove();
      resolver(resposta);
    }

    // Esc fecha o <dialog> sozinho; sem este tratador a promessa nunca resolve.
    dialogo.addEventListener("cancel", () => fechar(null));

    document.body.appendChild(dialogo);
    confirmar.disabled = campo.value === "";
    dialogo.showModal();
    campo.focus();
  });
}
