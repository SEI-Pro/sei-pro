/**
 * Imagem para PDF: fotos e digitalizacoes JPG ou PNG num PDF unico.
 *
 * As imagens NAO passam pelo diagnostico de PDF -- seria erro garantido, porque
 * elas nao sao PDF. Dai `diagnosticarComoPdf: false`.
 */

import { el } from "@/ui/dom";
import { montarMoldura, type FerramentaMontada } from "@/ui/moldura";

export function montar(): FerramentaMontada {
  return montarMoldura({
    operacao: "imagemParaPdf",
    titulo: "Imagem para PDF",
    descricao: "Converta fotos e digitalizações JPG ou PNG em um PDF único.",
    rotuloAcao: "Gerar PDF",
    aceita: "image/jpeg,image/png,.jpg,.jpeg,.png",
    diagnosticarComoPdf: false,
    zona: {
      titulo: "Solte as imagens aqui",
      apoio: "ou escolha os arquivos do seu computador",
      rotuloBotao: "Escolher imagens",
      ajuda: "Aceita JPG e PNG. Cada imagem vira uma página, na ordem da lista.",
    },
    validar: (f) => (f.prontos.length === 0 ? "Escolha pelo menos uma imagem." : null),
    painelOpcoes: (_f, sincronizar) => {
      const tamanho = el(
        "select",
        { class: "fpdf-campo", id: "img-tamanho", onchange: () => sincronizar() },
        el("option", { value: "a4", selected: true }, "A4"),
        el("option", { value: "carta" }, "Carta"),
        el("option", { value: "ajustar" }, "Do tamanho da imagem"),
      ) as HTMLSelectElement;

      const margem = el("input", {
        type: "number",
        class: "fpdf-campo",
        id: "img-margem",
        min: "0",
        max: "50",
        value: "10",
      });
      const nome = el("input", {
        type: "text",
        class: "fpdf-campo",
        id: "img-nome",
        placeholder: "documento",
      });

      const linhaMargem = el(
        "div",
        { class: "fpdf-opcoes__linha" },
        el("label", { for: "img-margem" }, "Margem (mm)"),
        margem,
      );

      const raiz = el(
        "div",
        { class: "fpdf-opcoes" },
        el(
          "div",
          { class: "fpdf-opcoes__linha" },
          el("label", { for: "img-tamanho" }, "Tamanho da página"),
          tamanho,
        ),
        linhaMargem,
        el(
          "div",
          { class: "fpdf-opcoes__linha" },
          el("label", { for: "img-nome" }, "Nome do arquivo"),
          nome,
        ),
      );

      return {
        raiz,
        valores: () => ({
          tamanhoPagina: tamanho.value,
          margemMm: Number(margem.value) || 0,
          nomeSaida: nome.value.trim() || undefined,
        }),
        sincronizar: (desabilitado) => {
          // Margem so faz sentido quando a página tem tamanho fixo.
          linhaMargem.hidden = tamanho.value === "ajustar";
          tamanho.disabled = desabilitado;
          margem.disabled = desabilitado;
          nome.disabled = desabilitado;
        },
      };
    },
  });
}
