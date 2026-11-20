import { h } from "@comum/ui/dom";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { colunaDeFormulario, linhaDeCampo } from "../ui/formulario";
import { escaparHtml } from "../util/html";
import { imagemParaDataUri } from "../util/imagem";
import type { Contexto, Recurso } from "./tipos";

/**
 * Equacao LaTeX (porte de `latex.js`): a formula vira imagem pelo servico CodeCogs e a imagem e EMBUTIDA no
 * documento como data URI (o SEI nao deve depender de imagem hospedada fora). O preview mostra a imagem
 * remota e troca pela embutida quando a conversao termina; so insere com a embutida pronta. A conversao de
 * uma digitacao antiga que chega atrasada e ignorada. A formula vai no `alt`, escapada.
 */
const SERVICO = "https://latex.codecogs.com/png.latex?";
const GUIA = "https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX";
const EDITOR_VISUAL = "https://editor.codecogs.com/";

interface Aberto {
  texto: HTMLTextAreaElement;
  previa: HTMLElement;
  geracao: number;
  pronta: boolean;
  falhou: boolean;
}

export const recurso: Recurso = {
  id: "latex",
  globais(c: Contexto) {
    let aberto: Aberto | null = null;
    const converter = c.imagemParaDataUri ?? ((src: string) => imagemParaDataUri(c.win as Window & typeof globalThis, src));
    const avisar = (t: string) => avisarEditor(c.doc, t);

    /** Redesenha o preview a partir da caixa de texto (o `updatePreviewLatex` do legado). */
    function updatePreviewLatex(): void {
      const a = aberto;
      if (!a) return;
      const formula = a.texto.value;
      a.geracao += 1;
      const geracao = a.geracao;
      a.previa.replaceChildren();
      a.pronta = false;
      a.falhou = false;
      if (formula === "") return;
      const imagem = h("img", { src: `${SERVICO}${encodeURI(formula)}` });
      a.previa.append(imagem);
      converter(imagem.getAttribute("src") ?? "").then(
        (uri) => {
          if (aberto !== a || a.geracao !== geracao) return;
          imagem.setAttribute("src", uri);
          imagem.className = "img-base64";
          a.pronta = true;
        },
        () => {
          if (aberto === a && a.geracao === geracao) a.falhou = true;
        },
      );
    }

    function inserir(): boolean {
      const a = aberto;
      if (!a) return false;
      const formula = a.texto.value;
      if (formula === "") return (avisar("Digite a equação"), false);
      if (a.falhou) return (avisar("Não foi possível carregar a imagem da equação"), false);
      const imagem = a.previa.querySelector("img");
      if (!a.pronta || !imagem) return (avisar("Aguarde a equação carregar e tente de novo"), false);
      const ed = c.adaptador.getInstance();
      if (!ed) return false;
      const html = `<img class="img-base64" src="${escaparHtml(imagem.getAttribute("src") ?? "")}" alt="${escaparHtml(formula)}">`;
      c.adaptador.withEdit(ed, () => c.adaptador.insertHtml(ed, html));
      return true;
    }

    function openDialogLatex(this_: Element | null): void {
      if (!c.adaptador.getInstance(this_)) return;
      const texto = h("textarea", { id: "MathText", rows: "5" });
      texto.addEventListener("input", updatePreviewLatex);
      const previa = h("div", { id: "latexPreview", style: "text-align:center;margin:12px;min-height:24px;" });
      const dialogo = abrirDialogo(c.doc, {
        titulo: "Inserir Equação",
        aoFechar: () => {
          aberto = null;
        },
        conteudo: colunaDeFormulario(
          linhaDeCampo("Digite a equação no formato LaTeX/Mathematics:", texto),
          previa,
          h(
            "p",
            { style: "font-style:italic;font-size:12px;margin:0;" },
            "Consulte o ",
            h("a", { href: GUIA, target: "_blank", rel: "noopener noreferrer" }, "Guia de edição/Fórmulas TeX"),
            " para utilizar a linguagem LaTeX. Se preferir, utilize um ",
            h("a", { href: EDITOR_VISUAL, target: "_blank", rel: "noopener noreferrer" }, "editor visual de equações LaTeX"),
            ".",
          ),
          h(
            "div",
            { class: "spro-dialogo-rodape" },
            h(
              "button",
              {
                type: "button",
                class: "spro-botao primario",
                onclick: () => {
                  if (inserir()) dialogo.fechar();
                },
              },
              "Inserir",
            ),
          ),
        ),
      });
      aberto = { texto, previa, geracao: 0, pronta: false, falhou: false };
      const selecionado = String(c.win.getSelection?.() ?? "").trim();
      if (selecionado !== "") {
        texto.value = selecionado;
        updatePreviewLatex();
      }
    }

    /** Compat: o antigo registrava um CKEDITOR.dialog (inexistente no CK5); o dialogo agora abre em `openDialogLatex`. */
    function getDialogLatex(): void {}

    return { updatePreviewLatex, openDialogLatex, getDialogLatex };
  },
};
