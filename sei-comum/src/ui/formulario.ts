/**
 * Construtores do kit de formulário dos diálogos (o CSS está em `formulario.css`, junto do `base.css`).
 * Tudo por `h()`: rótulos, dicas e opções entram como TEXTO, nunca como HTML.
 *
 * O `grupo()` é a peça central: rótulo (com valor ao vivo opcional), controle e dica. Ele põe a classe de campo
 * nos controles e envolve o `<select>` no seletor com a seta, então quem monta o diálogo só descreve o conteúdo.
 */
import { type Filho, h, icone } from "./dom";

export type Opcao = readonly [valor: string, rotulo: string];

/** Coluna de grupos do diálogo, com o espaçamento certo entre eles. */
export function formulario(...filhos: Filho[]): HTMLElement {
  return h("div", { class: "spro-form" }, ...filhos);
}

/** Grade responsiva (colunas que cabem; `duas` e `tres` fixam o número e viram uma coluna em tela estreita). */
export function grade(colunas: "auto" | "duas" | "tres", ...filhos: Filho[]): HTMLElement {
  return h("div", { class: colunas === "auto" ? "spro-grade" : `spro-grade ${colunas}` }, ...filhos);
}

/** Parágrafo de apoio, em cinza (`Filho[]` aceita links). */
export function dica(...filhos: Filho[]): HTMLElement {
  return h("p", { class: "spro-dica" }, ...filhos);
}

export interface OpcoesGrupo {
  /** `id` do controle: liga o rótulo ao campo (clicar no texto foca o campo). */
  para?: string;
  /** Texto de apoio abaixo do controle. */
  dica?: Filho;
  /** Marca o rótulo com "(opcional)". */
  opcional?: boolean;
  /** Valor ao vivo ao lado do rótulo (`140 px`); atualize com `atualizarValor`. */
  valor?: string;
  /** Ocupa a grade inteira. */
  largo?: boolean;
}

const TIPOS_DE_CAMPO = new Set(["text", "number", "date", "url", "search", "password", "email", "tel", "file", ""]);

/** Põe a classe de campo no controle e envolve o `<select>` simples no seletor com seta. */
function prepararControle(c: Node): Node {
  if (c.nodeType !== 1) return c;
  const el = c as HTMLElement;
  const tag = el.tagName;
  if (tag === "SELECT") {
    el.classList.add("spro-campo");
    return el.hasAttribute("multiple") ? el : h("div", { class: "spro-seletor" }, el);
  }
  if (tag === "TEXTAREA") el.classList.add("spro-campo");
  else if (tag === "INPUT" && TIPOS_DE_CAMPO.has(el.getAttribute("type") ?? "")) el.classList.add("spro-campo");
  return el;
}

/** Rótulo + controle(s) + dica, numa unidade que a grade e a coluna sabem alinhar. */
export function grupo(rotulo: string | null, o: OpcoesGrupo, ...controles: Node[]): HTMLElement {
  const texto: Filho[] = [rotulo ?? ""];
  if (o.opcional) texto.push(" ", h("span", { class: "spro-opcional" }, "(opcional)"));
  const cabeca = rotulo
    ? h(
        o.para ? "label" : "div",
        { class: "spro-rotulo", ...(o.para ? { for: o.para } : {}) },
        h("span", {}, ...texto),
        o.valor !== undefined ? h("span", { class: "spro-valor", ...(o.para ? { "data-valor-de": o.para } : {}) }, o.valor) : null,
      )
    : null;
  return h(
    "div",
    { class: o.largo ? "spro-grupo spro-largo" : "spro-grupo" },
    cabeca,
    ...controles.map(prepararControle),
    o.dica ? h("p", { class: "spro-dica" }, o.dica) : null,
  );
}

/** Troca o valor mostrado ao lado do rótulo (o `data-valor-de` é o `id` do controle). */
export function atualizarValor(raiz: ParentNode, id: string, texto: string): void {
  const el = raiz.querySelector<HTMLElement>(`[data-valor-de="${id}"]`);
  if (el) el.textContent = texto;
}

// ---------- Controles ----------

/** Campo com um prefixo fixo dentro (`# nome`). O `input` ganha a classe de campo; devolve o contêiner. */
export function campoComPrefixo(input: HTMLInputElement, prefixo: string): HTMLElement {
  input.classList.add("spro-campo");
  return h("div", { class: "spro-sufixo spro-prefixo" }, h("span", {}, prefixo), input);
}

/** Campo com um sufixo fixo dentro (`80 %`, `px`). O `input` ganha a classe de campo; devolve o contêiner. */
export function campoComSufixo(input: HTMLInputElement, sufixo: string): HTMLElement {
  input.classList.add("spro-campo");
  return h("div", { class: "spro-sufixo" }, input, h("span", {}, sufixo));
}

function pintarIntervalo(el: HTMLInputElement): void {
  const min = Number(el.getAttribute("min") ?? 0);
  const max = Number(el.getAttribute("max") ?? 100);
  const pct = max > min ? ((Number(el.value) - min) / (max - min)) * 100 : 0;
  el.style.setProperty("--p", `${Math.min(100, Math.max(0, pct))}%`);
}

/** Controle deslizante com a parte preenchida na cor de destaque (`--p` acompanha o valor). */
export function intervalo(attrs: { id: string; min: number; max: number; step: number; value?: string | number }): HTMLInputElement {
  const el = h("input", {
    type: "range",
    class: "spro-intervalo",
    id: attrs.id,
    min: String(attrs.min),
    max: String(attrs.max),
    step: String(attrs.step),
    ...(attrs.value !== undefined ? { value: String(attrs.value) } : {}),
  });
  pintarIntervalo(el);
  el.addEventListener("input", () => pintarIntervalo(el));
  return el;
}

/** Caixa de marcação (ou opção) com o texto ao lado; clicar no texto marca. Devolve o `label` (o `input` fica dentro). */
export function caixa(attrs: Record<string, string | boolean | undefined>, rotulo: Filho, tipo: "checkbox" | "radio" = "checkbox"): HTMLElement {
  return h("label", { class: "spro-caixa" }, h("input", { type: tipo, ...attrs }), h("span", {}, rotulo));
}

function pintarCor(el: HTMLInputElement): void {
  const hex = el.parentElement?.querySelector(".spro-cor-hex");
  if (hex) hex.textContent = el.value;
}

/** Seletor de cor: amostra redonda e o código ao lado. Devolve o `label` (o `input` fica dentro). */
export function corCampo(attrs: { id: string; value: string; "aria-label"?: string }): HTMLElement {
  const el = h("input", { type: "color", ...attrs });
  const raiz = h("label", { class: "spro-cor" }, el, h("span", { class: "spro-cor-hex" }, attrs.value));
  el.addEventListener("input", () => pintarCor(el));
  el.addEventListener("change", () => pintarCor(el));
  return raiz;
}

/** Refaz o visual dos controles depois de mudar valores por código (`campo.value = ...`), que não dispara `input`. */
export function sincronizarControles(raiz: ParentNode): void {
  for (const el of raiz.querySelectorAll<HTMLInputElement>("input.spro-intervalo")) pintarIntervalo(el);
  for (const el of raiz.querySelectorAll<HTMLInputElement>(".spro-cor > input[type='color']")) pintarCor(el);
}

/** Botão com cara de texto (ações secundárias: "Opções avançadas", "Restaurar padrões"). */
export function botaoTexto(rotulo: string, aoClicar: () => void, o: { id?: string; expansivel?: boolean } = {}): HTMLButtonElement {
  const b = h(
    "button",
    { type: "button", class: "spro-botao-texto", ...(o.id ? { id: o.id } : {}), ...(o.expansivel ? { "aria-expanded": "false" } : {}) },
    rotulo,
    o.expansivel ? icone("chevron", 14) : null,
  );
  b.addEventListener("click", () => {
    if (o.expansivel) b.setAttribute("aria-expanded", String(b.getAttribute("aria-expanded") !== "true"));
    aoClicar();
  });
  return b;
}

/** Painel para as opções avançadas (fundo suave, borda, espaçamento próprio). */
export function painel(attrs: Record<string, string | undefined>, ...filhos: Filho[]): HTMLElement {
  return h("div", { class: "spro-painel", ...attrs }, ...filhos);
}

/** Área da prévia (QR, equação): centralizada, com texto de "vazio" e, opcionalmente, fundo xadrez para transparência. */
export function previa(attrs: Record<string, string | undefined>, o: { vazio?: string; xadrez?: boolean } = {}): HTMLElement {
  return h("div", { class: o.xadrez ? "spro-previa xadrez" : "spro-previa", ...(o.vazio ? { "data-vazio": o.vazio } : {}), ...attrs });
}

// ---------- Abas ----------

export interface ControleAbas {
  /** A barra de abas (já com papéis e teclado). */
  barra: HTMLElement;
  /** Um painel por aba, na ordem; o chamador os põe no diálogo logo abaixo da barra. */
  paineis: HTMLElement[];
  selecionar(id: string): void;
}

/**
 * Abas no estilo do segmentado: setas movem entre elas, a inativa sai da ordem do Tab e cada painel recebe o
 * `aria-labelledby`. Os `id`s ficam `${prefixo}Tab_${aba}` e `${prefixo}Painel_${aba}`.
 */
export function criarAbas(
  prefixo: string,
  abas: ReadonlyArray<readonly [id: string, rotulo: string]>,
  conteudos: Record<string, HTMLElement>,
  aoSelecionar?: (id: string) => void,
): ControleAbas {
  const botoes = new Map<string, HTMLElement>();
  const paineis = new Map<string, HTMLElement>();
  const selecionar = (id: string): void => {
    for (const [aba] of abas) {
      const ativa = aba === id;
      botoes.get(aba)?.setAttribute("aria-selected", String(ativa));
      botoes.get(aba)?.setAttribute("tabindex", ativa ? "0" : "-1");
      if (ativa) paineis.get(aba)?.removeAttribute("hidden");
      else paineis.get(aba)?.setAttribute("hidden", "");
    }
    aoSelecionar?.(id);
  };
  const barra = h("div", { class: "spro-segmentado largo", role: "tablist" });
  abas.forEach(([id, rotulo], i) => {
    const b = h(
      "button",
      {
        type: "button",
        role: "tab",
        id: `${prefixo}Tab_${id}`,
        "aria-controls": `${prefixo}Painel_${id}`,
        "aria-selected": "false",
        tabindex: "-1",
        onclick: () => selecionar(id),
        onkeydown: (ev: Event) => {
          const tecla = (ev as KeyboardEvent).key;
          const passo = tecla === "ArrowRight" ? 1 : tecla === "ArrowLeft" ? -1 : 0;
          const destino = abas[(i + passo + abas.length) % abas.length]?.[0];
          if (!passo || !destino) return;
          ev.preventDefault();
          selecionar(destino);
          botoes.get(destino)?.focus();
        },
      },
      rotulo,
    );
    botoes.set(id, b);
    barra.append(b);
    paineis.set(
      id,
      h("div", { role: "tabpanel", id: `${prefixo}Painel_${id}`, "aria-labelledby": `${prefixo}Tab_${id}`, hidden: "" }, conteudos[id]),
    );
  });
  return { barra, paineis: [...paineis.values()], selecionar };
}
