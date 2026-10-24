/** Os estados de um painel que não é "pronto com dados": carregando, erro com nova tentativa, vazio. */
import { type Filho, h, icone } from "@comum/ui/dom";
import type { Fatia } from "../modelo/tipos";

export function esqueleto(linhas = 2): HTMLElement {
  return h(
    "div",
    { class: "spro-p-esqueleto", "aria-busy": "true", "aria-label": "Carregando" },
    ...Array.from({ length: linhas }, (_, i) =>
      h("span", { class: "spro-p-barra", style: i === linhas - 1 && linhas > 1 ? "width:62%" : undefined }),
    ),
  );
}

export function erroComRetry(mensagem: string, aoTentar: () => void): HTMLElement {
  return h(
    "div",
    { class: "spro-p-erro", role: "alert" },
    h("span", { class: "spro-p-erro-texto" }, icone("alerta", 13), mensagem || "Não foi possível carregar."),
    h("button", { type: "button", class: "spro-p-link", onclick: aoTentar }, "Tentar de novo"),
  );
}

export function vazio(texto: string, ...extras: Filho[]): HTMLElement {
  return h("div", { class: "spro-p-vazio" }, texto, ...extras);
}

export function nota(texto: string): HTMLElement {
  return h("div", { class: "spro-p-nota" }, texto);
}

/**
 * Escolhe o que o corpo mostra para o estado da fatia:
 *  - sem dado e carregando: esqueleto; sem dado e erro: "Tentar de novo";
 *  - com dado (pronto, desatualizado ou erro ao atualizar): o dado, e no erro um aviso de nova tentativa embaixo.
 */
export function corpoPorEstado<T>(f: Fatia<T>, aoTentar: () => void, desenhar: (dado: T) => Filho[], linhasEsqueleto = 2): Filho[] {
  if (f.dado === undefined) {
    return f.estado === "erro" ? [erroComRetry(f.erro ?? "", aoTentar)] : [esqueleto(linhasEsqueleto)];
  }
  const corpo = desenhar(f.dado);
  return f.estado === "erro"
    ? [...corpo, erroComRetry(f.erro ? `Não foi possível atualizar: ${f.erro}` : "Não foi possível atualizar.", aoTentar)]
    : corpo;
}
