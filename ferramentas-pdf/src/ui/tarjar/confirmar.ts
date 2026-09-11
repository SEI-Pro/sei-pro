/**
 * Confirmacao antes de aplicar as tarjas.
 *
 * Existe porque a operacao e IRREVERSIVEL no arquivo gerado: o texto tarjado
 * deixa de existir nele. Nao da para "destarjar" depois. O documento original
 * na maquina do usuario continua intacto, e o dialogo diz isso -- e o que
 * evita tanto o susto quanto a falsa sensacao de que da para desfazer.
 */

import { el } from "@/ui/dom";

export interface DadosConfirmacao {
  quantidade: number;
  temAssinatura: boolean;
  paginasSemTexto: number[];
}

export function confirmarTarja(dados: DadosConfirmacao): Promise<boolean> {
  return new Promise((resolver) => {
    const avisos: HTMLElement[] = [];

    if (dados.temAssinatura) {
      // Nao e detalhe: um documento assinado que volta ao processo tarjado tem
      // a assinatura invalidada, e quem receber vai tratar isso como defeito.
      avisos.push(
        el(
          "p",
          { class: "fpdf-confirmar__aviso" },
          "Este documento tem assinatura digital. Tarjar altera o arquivo e INVALIDA a assinatura. O documento gerado será uma cópia sem valor de assinatura -- o original continua intacto no seu computador.",
        ),
      );
    }

    if (dados.paginasSemTexto.length > 0) {
      avisos.push(
        el(
          "p",
          { class: "fpdf-confirmar__aviso" },
          `${dados.paginasSemTexto.length} página(s) sem texto extraível não foram analisadas automaticamente. Confira se há dados sensíveis nelas antes de prosseguir.`,
        ),
      );
    }

    const dialogo = el(
      "dialog",
      { class: "fpdf-confirmar" },
      el(
        "form",
        { method: "dialog" },
        el("h3", {}, `Aplicar ${dados.quantidade} ${dados.quantidade === 1 ? "tarja" : "tarjas"}?`),
        el(
          "p",
          {},
          "As páginas com tarja serão reconstruídas e o texto suprimido deixará de existir no arquivo gerado. Não é um retângulo por cima: não há como recuperar o conteúdo depois.",
        ),
        el(
          "p",
          {},
          "O arquivo original no seu computador não é alterado.",
        ),
        ...avisos,
        el(
          "footer",
          { class: "fpdf-confirmar__rodape" },
          el(
            "button",
            { type: "button", class: "fpdf-botao fpdf-botao--texto", onclick: () => fechar(false) },
            "Cancelar",
          ),
          el(
            "button",
            { type: "button", class: "fpdf-botao fpdf-botao--primario", onclick: () => fechar(true) },
            "Aplicar tarjas",
          ),
        ),
      ),
    );

    function fechar(resposta: boolean) {
      dialogo.close();
      dialogo.remove();
      resolver(resposta);
    }

    dialogo.addEventListener("cancel", () => fechar(false));
    document.body.appendChild(dialogo);
    dialogo.showModal();
  });
}
