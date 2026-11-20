import { esconder, mostrar } from "../util/dom";
import { operacoesDeParagrafo } from "../util/paragrafos";
import type { Contexto, Recurso } from "./tipos";

/**
 * Alinhar texto (porte de `align.js`): troca a classe de estilo SEI do(s) paragrafo(s) da selecao dentro da
 * mesma familia (normal / Tabela / Maiusculas); paragrafo fora das familias recebe `text-align` inline.
 * No CK5 o estilo e o atributo `estilo` do model (o legado mudava o DOM, que o CK5 nao grava).
 */
type Modo = "left" | "center" | "right" | "justify";

const FAMILIAS: Array<Record<Modo, string>> = [
  { left: "Texto_Alinhado_Esquerda", center: "Texto_Centralizado", right: "Texto_Alinhado_Direita", justify: "Texto_Justificado" },
  {
    left: "Tabela_Texto_Alinhado_Esquerda",
    center: "Tabela_Texto_Centralizado",
    right: "Tabela_Texto_Alinhado_Direita",
    justify: "Tabela_Texto_Justificado",
  },
  {
    left: "Texto_Alinhado_Esquerda_Maiusc",
    center: "Texto_Centralizado_Maiusculas",
    right: "Texto_Alinhado_Direita_Maiusc",
    justify: "Texto_Justificado_Maiusculas",
  },
];

/** A classe-alvo se `atual` pertence a uma familia; null se nao pertence (cai no `text-align` inline). */
function classeAlvo(atual: string, modo: Modo): string | null {
  const familia = FAMILIAS.find((f) => Object.values(f).includes(atual));
  return familia ? familia[modo] : null;
}

/** Acha o dropdown `.divAlignText` do botao: pelo `.cke_top` (CK4), por um ancestral que o contenha (CK5) ou pelo documento. */
function acharDropdown(botao: Element | null, doc: Document): HTMLElement | null {
  const noTopo = botao?.closest(".cke_top")?.querySelector<HTMLElement>(".divAlignText");
  if (noTopo) return noTopo;
  for (let pai = botao?.parentElement ?? null; pai; pai = pai.parentElement) {
    const d = pai.querySelector<HTMLElement>(".divAlignText");
    if (d) return d;
  }
  return doc.querySelector<HTMLElement>(".divAlignText");
}

export const recurso: Recurso = {
  id: "align",
  globais(c: Contexto) {
    const ops = operacoesDeParagrafo(c);
    return {
      setAlignText(this_: Element | null, modo: Modo) {
        const ed = c.adaptador.getInstance(this_);
        if (!ed || c.adaptador.somenteLeitura(ed)) return;
        const ps = ops.selecionados(ed);
        if (!ps.length) return;
        c.adaptador.withEdit(ed, () => {
          for (const p of ps) {
            const alvo = classeAlvo(ops.classeDeEstilo(ed, p), modo);
            if (alvo) ops.definirClasse(ed, p, alvo);
            else ops.definirTextAlign(ed, p, modo);
          }
        });
      },

      /** Abre/fecha o dropdown de alinhamento (botao `.getAlignButtom`). */
      openAlignText(this_: Element | null) {
        if (!this_) return;
        const dropdown = acharDropdown(this_, c.doc);
        if (this_.classList.contains("cke_button_on")) {
          this_.classList.replace("cke_button_on", "cke_button_off");
          if (dropdown) esconder(dropdown);
        } else {
          this_.classList.remove("cke_button_off");
          this_.classList.add("cke_button_on");
          if (dropdown) mostrar(dropdown);
        }
      },

      /** Fecha o dropdown (chamado no blur/boot do editor): reseta os botoes e esconde os dropdowns. */
      closeAlignText() {
        for (const b of c.doc.querySelectorAll(".getAlignButtom")) {
          b.classList.remove("cke_button_on");
          b.classList.add("cke_button_off");
        }
        for (const d of c.doc.querySelectorAll<HTMLElement>(".divAlignText")) d.style.display = "none";
      },
    };
  },
};
