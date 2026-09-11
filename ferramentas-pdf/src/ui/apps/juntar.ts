/**
 * Juntar PDF: varios documentos em um so, na ordem definida pelo usuario.
 */

import { montarMoldura, type FerramentaMontada } from "@/ui/moldura";
import { el } from "@/ui/dom";

export function montar(): FerramentaMontada {
  return montarMoldura({
    operacao: "juntar",
    titulo: "Juntar PDF",
    descricao:
      "Una vários PDFs em um documento só, na ordem que você definir. Tudo acontece nesta máquina.",
    rotuloAcao: "Juntar documentos",
    nomeZip: "documentos-unidos",
    zona: {
      titulo: "Solte os PDFs aqui",
      apoio: "ou escolha os arquivos do seu computador",
      rotuloBotao: "Escolher PDFs",
      ajuda:
        "Aceita vários arquivos. Use as setas da lista para definir a ordem em que eles vão aparecer no documento final.",
    },
    validar: (f) =>
      f.prontos.length < 2 ? "Escolha pelo menos dois documentos para juntar." : null,
    painelOpcoes: (f, sincronizar) => {
      const inverter = el(
        "button",
        {
          type: "button",
          class: "fpdf-botao fpdf-botao--secundario",
          onclick: () => {
            f.inverterOrdem();
            sincronizar();
          },
        },
        "Inverter ordem",
      );
      const nome = el("input", {
        type: "text",
        class: "fpdf-campo",
        id: "juntar-nome",
        placeholder: "documento-unido",
      });
      const raiz = el(
        "div",
        { class: "fpdf-opcoes" },
        el(
          "div",
          { class: "fpdf-opcoes__linha" },
          el("label", { for: "juntar-nome" }, "Nome do arquivo final"),
          nome,
        ),
        el("div", { class: "fpdf-opcoes__linha" }, inverter),
      );
      return {
        raiz,
        valores: () => ({ nomeSaida: nome.value.trim() || undefined }),
        sincronizar: (desabilitado) => {
          inverter.disabled = desabilitado;
          nome.disabled = desabilitado;
        },
      };
    },
  });
}
