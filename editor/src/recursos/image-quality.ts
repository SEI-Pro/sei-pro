import { h } from "@comum/ui/dom";
import { abrirDialogo } from "../ui/abrir";
import { atualizarValor, dica, formulario, grupo, intervalo } from "../ui/formulario";
import type { Contexto, Recurso } from "./tipos";

/**
 * Reduzir qualidade das imagens (porte de `image-quality.js`): um controle de 1 a 100% e, ao aplicar, a compressao do
 * monolito (`qualityImages`, via canvas) roda sobre todas as imagens do corpo do documento. O valor inicial e a
 * qualidade configurada (`qualidadeImagens`, 60 por padrao).
 */

interface Monolito {
  qualidadeImagens?: unknown;
  qualityImages?(origem: Element, destino: Element, qualidade: number): void;
}

/** Qualidade padrao em % (1 a 100), a partir da configuracao do monolito. */
export function qualidadePadrao(configurada: unknown): number {
  const q = Number.parseInt(String(configurada ?? ""), 10);
  if (Number.isNaN(q)) return 60;
  return Math.min(100, Math.max(1, q));
}

export const recurso: Recurso = {
  id: "image-quality",
  globais(c: Contexto) {
    const A = c.adaptador;
    const w = c.win as unknown as Monolito;

    function openDialogBatchImgQuality(this_: Element | null): void {
      const ed = A.getInstance(this_);
      if (!ed) return;
      const faixa = intervalo({ id: "batchImgQualityRange", min: 1, max: 100, step: 1, value: qualidadePadrao(w.qualidadeImagens) });
      faixa.addEventListener("input", () => atualizarValor(raiz, "batchImgQualityRange", `${faixa.value}%`));
      const aplicar = h(
        "button",
        {
          type: "button",
          class: "spro-botao primario",
          onclick: () => {
            const qualidade = Number(faixa.value);
            A.withEdit(ed, () => {
              for (const img of A.findInBody(ed, "img")) w.qualityImages?.(img, img, qualidade * 0.01);
            });
            dialogo.fechar();
          },
        },
        "Aplicar",
      );
      const raiz = formulario(
        grupo("Qualidade da imagem", { para: "batchImgQualityRange", valor: `${faixa.value}%` }, faixa),
        dica("Qualidade menor deixa o arquivo mais leve, com mais perda de nitidez. Vale para todas as imagens do documento."),
        h("div", { class: "spro-dialogo-rodape" }, aplicar),
      );
      const dialogo = abrirDialogo(c.doc, { titulo: "Reduzir qualidade das imagens", largura: 460, conteudo: raiz });
    }

    return {
      openDialogBatchImgQuality,
      /** Compat com o `initFunctions` do legado: o dialogo agora abre sob demanda. */
      getDialogBatchImgQuality: () => {},
    };
  },
};
