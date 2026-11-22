/**
 * Um link que faz papel de botao (`<a role="button" tabindex="0">`) so responde ao clique. Para o teclado valer
 * tambem (Enter e Espaco, como num botao de verdade), espalhe o resultado nas propriedades do elemento:
 * `h("a", { role: "button", tabindex: "0", ...comoBotao(fazer) }, "texto")`.
 */
export function comoBotao(fazer: (ev: Event) => void): { onclick: (ev: Event) => void; onkeydown: (ev: Event) => void } {
  return {
    onclick: fazer,
    onkeydown: (ev: Event) => {
      const tecla = (ev as KeyboardEvent).key;
      if (tecla !== "Enter" && tecla !== " ") return;
      ev.preventDefault();
      fazer(ev);
    },
  };
}
