/**
 * Construcao de DOM.
 *
 * POR QUE NAO HTML EM STRING. Nome de arquivo escolhido pelo usuario aparece na
 * tela o tempo todo aqui -- e esta página roda no contexto da extensao, com
 * acesso a `chrome.*`. Montar marcacao por concatenacao significa que um
 * arquivo chamado `<img onerror=...>.pdf` executa codigo numa página
 * privilegiada. Com estas funcoes, todo texto entra por `textContent` e a
 * classe inteira de defeito deixa de existir -- sem depender de alguem lembrar
 * de sanitizar.
 */

type Filho = Node | string | number | null | undefined | false;

type Atributos = {
  class?: string;
  id?: string;
  title?: string;
  hidden?: boolean;
  disabled?: boolean;
  html?: never;
  dataset?: Record<string, string | undefined>;
  estilo?: Partial<CSSStyleDeclaration>;
} & Record<string, unknown>;

/**
 * Cria um elemento.
 *
 *   el("button", { class: "btn", onclick: aoClicar }, "Juntar")
 *
 * Chave que comeca com `on` vira listener; `dataset` e `estilo` sao objetos;
 * qualquer outra vira atributo. Filho string SEMPRE vira texto, nunca HTML.
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  atributos: Atributos = {},
  ...filhos: Filho[]
): HTMLElementTagNameMap[K] {
  const no = document.createElement(tag);

  for (const [chave, valor] of Object.entries(atributos)) {
    if (valor === undefined || valor === null || valor === false) continue;

    if (chave.startsWith("on") && typeof valor === "function") {
      no.addEventListener(chave.slice(2), valor as EventListener);
      continue;
    }
    if (chave === "dataset") {
      for (const [d, v] of Object.entries(valor as Record<string, string>)) {
        if (v !== undefined) no.dataset[d] = v;
      }
      continue;
    }
    if (chave === "estilo") {
      Object.assign(no.style, valor);
      continue;
    }
    if (chave === "class") {
      no.className = String(valor);
      continue;
    }
    // `hidden`, `disabled`, `checked`, `value`: propriedades, nao atributos --
    // atributo nao reflete estado depois que o usuario interage.
    if (chave in no && typeof valor !== "string") {
      (no as unknown as Record<string, unknown>)[chave] = valor;
      continue;
    }
    no.setAttribute(chave, String(valor));
  }

  anexar(no, ...filhos);
  return no;
}

/** Acrescenta filhos, tratando string como TEXTO. */
export function anexar(pai: Node, ...filhos: Filho[]): void {
  for (const filho of filhos) {
    if (filho === null || filho === undefined || filho === false) continue;
    pai.appendChild(
      typeof filho === "string" || typeof filho === "number"
        ? document.createTextNode(String(filho))
        : filho,
    );
  }
}

/** Esvazia um elemento. */
export function limpar(no: Node): void {
  while (no.firstChild) no.removeChild(no.firstChild);
}

/** Substitui todo o conteudo de um elemento. */
export function repor(pai: Node, ...filhos: Filho[]): void {
  limpar(pai);
  anexar(pai, ...filhos);
}

/**
 * Icone do Font Awesome, que a extensao ja embarca.
 *
 * `aria-hidden` porque icone sozinho nao e conteudo: quem usa leitor de tela
 * precisa do texto ao lado, nao do nome da fonte.
 */
export function icone(classes: string): HTMLElement {
  const i = document.createElement("i");
  i.className = classes;
  i.setAttribute("aria-hidden", "true");
  return i;
}

/** Texto so para leitor de tela. Depende de `.sr-only` no CSS. */
export function apenasLeitorDeTela(texto: string): HTMLElement {
  return el("span", { class: "sr-only" }, texto);
}
