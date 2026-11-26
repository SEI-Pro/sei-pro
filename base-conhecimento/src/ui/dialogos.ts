/**
 * Diálogos do módulo no visual do SEI (Shadow DOM): texto (nomear/renomear),
 * confirmação e escolha de pasta.
 *
 * Acessibilidade: `role="dialog"`/`aria-modal`/`aria-labelledby`, foco inicial,
 * Tab preso (respeitando o retargeting do Shadow DOM), Escape cancela e o foco
 * volta ao elemento de origem. Nada de `window.prompt`/`confirm`.
 */

import { caminhoDaPasta, type PastaExibida } from "../arvore/mesclar";

export interface Dialogos {
  pedirTexto(rotulo: string, valorInicial?: string): Promise<string | null>;
  confirmar(texto: string): Promise<boolean>;
  perguntar(texto: string, rotuloOk: string, rotuloNao: string): Promise<boolean>;
  escolherPasta(pastas: PastaExibida[], atual: string | null, numerar?: boolean): Promise<{ pasta: string | null } | null>;
  destruir(): void;
}

interface Botao<T> {
  rotulo: string;
  primario?: boolean;
  valor: () => T;
}

/** O elemento focado de verdade, descendo por shadow roots (o document.activeElement é retargetado). */
export function elementoAtivoProfundo(doc: Pick<Document, "activeElement">): HTMLElement | null {
  let el = doc.activeElement as HTMLElement | null;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement as HTMLElement;
  return el;
}

/** Próximo foco no ciclo do Tab dentro do modal; null = deixa o navegador seguir (está no meio). */
export function proximoFoco(focaveis: HTMLElement[], atual: HTMLElement | null, shift: boolean): HTMLElement | null {
  if (!focaveis.length) return null;
  const i = atual ? focaveis.indexOf(atual) : -1;
  if (i === -1) return shift ? (focaveis[focaveis.length - 1] ?? null) : (focaveis[0] ?? null);
  if (shift && i === 0) return focaveis[focaveis.length - 1] ?? null;
  if (!shift && i === focaveis.length - 1) return focaveis[0] ?? null;
  return null;
}

/** A escolha viva do `<select>` (o atributo `selected` é só o valor de partida). */
export function pastaDoSelect(select: Pick<HTMLSelectElement, "value">): { pasta: string | null } {
  return { pasta: select.value === "" ? null : select.value };
}

export function criarDialogos(o: { doc?: Document; css?: string } = {}): Dialogos {
  const doc = o.doc ?? document;
  const host = doc.createElement("div");
  host.className = "spro-bc-dialogos";
  const raiz = host.attachShadow({ mode: "open" });
  if (o.css) {
    const estilo = doc.createElement("style");
    estilo.textContent = o.css;
    raiz.appendChild(estilo);
  }
  const overlay = doc.createElement("div");
  overlay.className = "overlay";
  overlay.hidden = true;
  raiz.appendChild(overlay);
  (doc.body ?? doc.documentElement).appendChild(host);

  let numero = 0;
  let focoAnterior: HTMLElement | null = null;

  /** Foco inicial: campo em formulários; "Cancelar" em confirmações (ação destrutiva). */
  type FocoInicial = "campo" | "cancelar";

  function abrir<T>(
    titulo: string,
    conteudo: HTMLElement,
    botoes: Array<Botao<T>>,
    cancelar: T,
    focoInicial: FocoInicial = "campo",
  ): Promise<T> {
    if (!overlay.hidden) return Promise.resolve(cancelar);
    overlay.replaceChildren();

    const caixa = doc.createElement("div");
    caixa.className = "caixa";
    caixa.setAttribute("role", "dialog");
    caixa.setAttribute("aria-modal", "true");
    caixa.tabIndex = -1;

    const idTitulo = `spro-bc-dlg-titulo-${++numero}`;
    const h = doc.createElement("h2");
    h.id = idTitulo;
    h.className = "titulo-dialogo";
    h.textContent = titulo;
    caixa.setAttribute("aria-labelledby", idTitulo);

    const fechar = doc.createElement("button");
    fechar.type = "button";
    fechar.className = "fechar";
    fechar.setAttribute("aria-label", "Fechar");
    fechar.textContent = "×";

    const corpo = doc.createElement("div");
    corpo.className = "corpo";
    corpo.append(conteudo);

    const rodape = doc.createElement("div");
    rodape.className = "rodape";

    overlay.hidden = false;
    focoAnterior = elementoAtivoProfundo(doc);

    return new Promise<T>((resolve) => {
      let aberto = true;
      const terminar = (valor: T): void => {
        if (!aberto) return;
        aberto = false;
        overlay.hidden = true;
        overlay.replaceChildren();
        focoAnterior?.focus?.();
        resolve(valor);
      };

      for (const b of botoes) {
        const btn = doc.createElement("button");
        btn.type = "button";
        btn.className = b.primario ? "botao primario" : "botao";
        btn.textContent = b.rotulo;
        btn.addEventListener("click", () => terminar(b.valor()));
        rodape.append(btn);
      }

      fechar.addEventListener("click", () => terminar(cancelar));
      caixa.append(h, fechar, corpo, rodape);

      caixa.addEventListener("keydown", (ev) => {
        const e = ev as KeyboardEvent;
        if (e.key === "Escape") {
          ev.preventDefault();
          terminar(cancelar);
          return;
        }
        if (e.key === "Enter" && (ev.target as HTMLElement | null)?.tagName === "INPUT") {
          ev.preventDefault();
          (caixa.querySelector(".botao.primario") as HTMLElement | null)?.click();
          return;
        }
        if (e.key === "Tab") {
          const focaveis = [...caixa.querySelectorAll<HTMLElement>("button, input, select, a[href]")].filter(
            (el) => !el.hasAttribute("disabled"),
          );
          const ativo = ((raiz as ShadowRoot).activeElement as HTMLElement | null) ?? elementoAtivoProfundo(doc);
          const destino = proximoFoco(focaveis, ativo, e.shiftKey);
          if (destino) {
            ev.preventDefault();
            destino.focus();
          }
        }
      });

      overlay.appendChild(caixa);
      const alvo = (
        focoInicial === "cancelar" ? rodape.querySelector(".botao") : caixa.querySelector("input, select, .botao.primario")
      ) as HTMLElement | null;
      alvo?.focus();
    });
  }

  return {
    pedirTexto(rotulo, valorInicial = "") {
      const label = doc.createElement("label");
      const id = `spro-bc-nome-${++numero}`;
      label.htmlFor = id;
      label.setAttribute("for", id);
      label.className = "rotulo";
      label.textContent = rotulo;
      const input = doc.createElement("input");
      input.type = "text";
      input.id = id;
      input.className = "campo";
      input.value = valorInicial;
      const corpo = doc.createElement("div");
      corpo.append(label, input);
      return abrir<string | null>(
        rotulo,
        corpo,
        [
          { rotulo: "Cancelar", valor: () => null },
          { rotulo: "OK", primario: true, valor: () => input.value },
        ],
        null,
      );
    },

    confirmar(texto) {
      const p = doc.createElement("p");
      p.className = "mensagem";
      p.textContent = texto;
      return abrir<boolean>(
        "Confirmar",
        p,
        [
          { rotulo: "Cancelar", valor: () => false },
          { rotulo: "Confirmar", primario: true, valor: () => true },
        ],
        false,
        "cancelar",
      );
    },

    perguntar(texto, rotuloOk, rotuloNao) {
      const p = doc.createElement("p");
      p.className = "mensagem";
      p.textContent = texto;
      return abrir<boolean>(
        "Confirmação",
        p,
        [
          { rotulo: rotuloNao, valor: () => false },
          { rotulo: rotuloOk, primario: true, valor: () => true },
        ],
        false,
        "cancelar",
      );
    },

    escolherPasta(pastas, atual, numerar = false) {
      const label = doc.createElement("label");
      const id = `spro-bc-pasta-${++numero}`;
      label.htmlFor = id;
      label.setAttribute("for", id);
      label.className = "rotulo";
      label.textContent = "Pasta de destino";
      const select = doc.createElement("select");
      select.id = id;
      select.className = "campo";
      const opcoes: Array<{ valor: string; texto: string; atual: boolean }> = [{ valor: "", texto: "Sem pasta", atual: atual === null }];
      const indexar = (lista: PastaExibida[]): void => {
        for (const p of lista) {
          opcoes.push({ valor: p.id, texto: caminhoDaPasta(pastas, p.id, numerar), atual: p.id === atual });
          indexar(p.filhas);
        }
      };
      indexar(pastas);
      for (const o of opcoes) {
        const opt = doc.createElement("option");
        opt.value = o.valor;
        opt.textContent = o.texto;
        if (o.atual) opt.setAttribute("selected", "");
        select.append(opt);
      }
      const corpo = doc.createElement("div");
      corpo.append(label, select);
      return abrir<{ pasta: string | null } | null>(
        "Mover para qual pasta?",
        corpo,
        [
          { rotulo: "Cancelar", valor: () => null },
          { rotulo: "Mover", primario: true, valor: () => pastaDoSelect(select) },
        ],
        null,
      );
    },

    destruir() {
      overlay.hidden = true;
      host.remove();
    },
  };
}
