/**
 * Barra de progresso do processamento.
 *
 * NAO APARECE ANTES DE 400 ms. Uma operacao que termina em 80 ms faria a barra
 * piscar e deslocar o conteudo abaixo dela -- o usuario ve um tremor e nao
 * entende o que aconteceu. Abaixo do limiar, o processamento simplesmente
 * termina.
 */

import { el, repor } from "@/ui/dom";

const ATRASO_MS = 400;

export interface Progresso {
  raiz: HTMLElement;
  sincronizar(props: { processando: boolean; feito: number; total: number }): void;
  destruir(): void;
}

export function criarProgresso(aoCancelar: () => void): Progresso {
  const barra = el("div", { class: "fpdf-progresso__barra" });
  const texto = el("span", { class: "fpdf-progresso__texto" });
  const trilho = el(
    "div",
    {
      class: "fpdf-progresso__trilho",
      role: "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
    },
    barra,
  );

  const raiz = el(
    "div",
    { class: "fpdf-progresso", hidden: true },
    trilho,
    el(
      "div",
      { class: "fpdf-progresso__rodape" },
      texto,
      el(
        "button",
        { type: "button", class: "fpdf-botao fpdf-botao--texto", onclick: aoCancelar },
        "Cancelar",
      ),
    ),
  );

  let temporizador: number | null = null;

  function esconder() {
    if (temporizador !== null) {
      clearTimeout(temporizador);
      temporizador = null;
    }
    raiz.hidden = true;
  }

  return {
    raiz,
    sincronizar({ processando, feito, total }) {
      if (!processando) {
        esconder();
        return;
      }
      if (raiz.hidden && temporizador === null) {
        temporizador = window.setTimeout(() => {
          raiz.hidden = false;
          temporizador = null;
        }, ATRASO_MS);
      }

      const indeterminado = total <= 0;
      trilho.classList.toggle("fpdf-progresso__trilho--indeterminado", indeterminado);
      if (indeterminado) {
        trilho.removeAttribute("aria-valuenow");
        barra.style.width = "100%";
        repor(texto, "Processando...");
      } else {
        const pct = Math.min(100, Math.round((feito / total) * 100));
        trilho.setAttribute("aria-valuenow", String(pct));
        barra.style.width = `${pct}%`;
        repor(texto, `${feito} de ${total} (${pct}%)`);
      }
    },
    destruir: esconder,
  };
}
