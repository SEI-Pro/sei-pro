/**
 * Avisos do módulo no visual do SEI (Shadow DOM): barra azul no topo direito,
 * texto branco, botão de fechar, auto-fechamento.
 *
 * Acessibilidade: `role="status"` + `aria-live="polite"`; fechar com rótulo;
 * contraste AA com o azul de cabeçalho do SEI (`#155f9b`).
 */

export interface AcaoAviso {
  rotulo: string;
  fazer(): void;
}

export interface Avisos {
  avisar(texto: string, acao?: AcaoAviso): void;
  destruir(): void;
}

export function criarAvisos(o: { doc?: Document; css?: string; duracaoMs?: number } = {}): Avisos {
  const doc = o.doc ?? document;
  const duracao = o.duracaoMs ?? 7000;

  const host = doc.createElement("div");
  host.className = "spro-bc-avisos";
  const raiz = host.attachShadow({ mode: "open" });
  if (o.css) {
    const estilo = doc.createElement("style");
    estilo.textContent = o.css;
    raiz.appendChild(estilo);
  }
  const lista = doc.createElement("div");
  lista.className = "lista";
  raiz.appendChild(lista);
  (doc.body ?? doc.documentElement).appendChild(host);

  const timers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
  const remover = (el: HTMLElement): void => {
    const t = timers.get(el);
    if (t !== undefined) clearTimeout(t);
    timers.delete(el);
    el.remove();
  };

  return {
    avisar(texto, acao) {
      const aviso = doc.createElement("div");
      aviso.className = "aviso";
      aviso.setAttribute("role", "status");
      aviso.setAttribute("aria-live", "polite");
      const span = doc.createElement("span");
      span.className = "texto";
      span.textContent = texto;
      const fechar = doc.createElement("button");
      fechar.type = "button";
      fechar.className = "fechar";
      fechar.setAttribute("aria-label", "Fechar aviso");
      fechar.textContent = "×";
      fechar.addEventListener("click", () => remover(aviso));
      aviso.append(span);
      if (acao) {
        const botao = doc.createElement("button");
        botao.type = "button";
        botao.className = "botao-acao";
        botao.setAttribute("aria-label", acao.rotulo);
        botao.textContent = acao.rotulo;
        botao.addEventListener("click", () => {
          remover(aviso);
          acao.fazer();
        });
        aviso.append(botao);
      }
      aviso.append(fechar);
      lista.appendChild(aviso);
      // Com ação, o aviso espera a pessoa: só sai ao agir ou fechar.
      if (!acao) {
        timers.set(
          aviso,
          setTimeout(() => remover(aviso), duracao),
        );
      }
    },
    destruir() {
      for (const t of timers.values()) clearTimeout(t);
      timers.clear();
      host.remove();
    },
  };
}
