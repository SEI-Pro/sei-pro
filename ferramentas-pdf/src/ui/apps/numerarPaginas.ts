/**
 * Numerar paginas: numeracao de paginas ou de folhas, na posicao escolhida.
 */

import { el } from "@/ui/dom";
import { montarMoldura, type FerramentaMontada } from "@/ui/moldura";

export function montar(): FerramentaMontada {
  return montarMoldura({
    operacao: "numerarPaginas",
    titulo: "Numerar páginas",
    descricao: "Insira numeração de páginas ou de folhas, na posição que você escolher.",
    rotuloAcao: "Numerar documento",
    multiplo: false,
    zona: {
      titulo: "Solte o PDF aqui",
      apoio: "ou escolha o arquivo do seu computador",
      rotuloBotao: "Escolher PDF",
      ajuda:
        "Um documento por vez. Documento assinado digitalmente não deve ser alterado: a numeração invalidaria a assinatura.",
    },
    validar: (f) => (f.prontos.length !== 1 ? "Escolha um documento para numerar." : null),
    painelOpcoes: (_f, sincronizar) => {
      const posicao = el(
        "select",
        { class: "fpdf-campo", id: "num-posicao", onchange: () => sincronizar() },
        el("option", { value: "rodapeDireita", selected: true }, "Rodapé, à direita"),
        el("option", { value: "rodapeCentro" }, "Rodapé, ao centro"),
        el("option", { value: "rodapeEsquerda" }, "Rodapé, à esquerda"),
        el("option", { value: "cabecalhoDireita" }, "Cabeçalho, à direita"),
        el("option", { value: "cabecalhoCentro" }, "Cabeçalho, ao centro"),
        el("option", { value: "cabecalhoEsquerda" }, "Cabeçalho, à esquerda"),
      ) as HTMLSelectElement;

      const formato = el(
        "select",
        { class: "fpdf-campo", id: "num-formato", onchange: () => sincronizar() },
        el("option", { value: "numero", selected: true }, "1, 2, 3"),
        el("option", { value: "paginaDeTotal" }, "1 de 10"),
        el("option", { value: "folha" }, "Folha 1"),
      ) as HTMLSelectElement;

      const comecarEm = el("input", {
        type: "number",
        class: "fpdf-campo",
        id: "num-comecar",
        min: "0",
        value: "1",
      });

      const pularPrimeira = el("input", { type: "checkbox", id: "num-pular" });

      const raiz = el(
        "div",
        { class: "fpdf-opcoes" },
        el("div", { class: "fpdf-opcoes__linha" }, el("label", { for: "num-posicao" }, "Posição"), posicao),
        el("div", { class: "fpdf-opcoes__linha" }, el("label", { for: "num-formato" }, "Formato"), formato),
        el(
          "div",
          { class: "fpdf-opcoes__linha" },
          el("label", { for: "num-comecar" }, "Começar em"),
          comecarEm,
        ),
        el(
          "div",
          { class: "fpdf-opcoes__linha" },
          el(
            "div",
            { class: "fpdf-opcoes__caixa" },
            pularPrimeira,
            el("label", { for: "num-pular" }, "Não numerar a primeira página (capa)"),
          ),
        ),
      );

      return {
        raiz,
        valores: () => ({
          posicao: posicao.value,
          formato: formato.value,
          comecarEm: Number(comecarEm.value) || 1,
          pularPrimeira: pularPrimeira.checked,
        }),
        sincronizar: (desabilitado) => {
          for (const c of [posicao, formato, comecarEm, pularPrimeira]) {
            (c as HTMLInputElement).disabled = desabilitado;
          }
        },
      };
    },
  });
}
