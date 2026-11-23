import { h } from "@comum/ui/dom";
import { abrirDialogo } from "./abrir";
import { sincronizarControles } from "./formulario";

/**
 * Ponte para os modulos legados do editor (`dist/js/modules/editor/*.js`): o mesmo contrato do `openDialog` do adaptador
 * (`{ id, title, html, width, buttons, onOpen, onClose }`, com `$box` nos ganchos), mas desenhado com a moldura e o kit do
 * `sei-comum`. O modulo so troca o HTML pelo markup do kit (`spro-form`, `spro-grupo`, `spro-campo`...) e o resto da
 * logica (`$box.find('#id')`) segue valendo. O HTML deve vir de quem ja o sanitizou (`sanitizeHTML`); aqui ele so e lido
 * num documento inerte e, por seguranca, perde `<script>` e atributos `on*` antes de entrar na pagina.
 */

interface BotaoLegado {
  text?: string;
  primary?: boolean;
  click?: (this: unknown, box: unknown) => void;
}

export interface DefLegado {
  id?: string;
  title?: string;
  html?: string;
  width?: number | string;
  buttons?: BotaoLegado[] | Record<string, (this: unknown) => void>;
  onOpen?: (box: unknown) => void;
  onClose?: () => void;
}

type JQuery = (el: unknown) => Record<string, unknown>;

let sequencia = 0;
const abertos = new Map<string, { fechar(): void }>();

function normalizarBotoes(b: DefLegado["buttons"]): BotaoLegado[] {
  if (!b) return [];
  if (Array.isArray(b)) return b;
  return Object.entries(b).map(([text, click]) => ({ text, click: () => click.call(null) }));
}

/** Tira o que executa codigo: `<script>` e atributos `on*`. */
function limpar(raiz: Element): void {
  for (const s of [...raiz.querySelectorAll("script")]) s.remove();
  for (const el of [raiz, ...raiz.querySelectorAll("*")]) {
    for (const a of [...el.attributes]) if (/^on/i.test(a.name)) el.removeAttribute(a.name);
  }
}

/** Liga o que o markup do kit pede de JS: controle deslizante, codigo da cor e abas (`[data-spro-abas]`). */
export function ligar(raiz: ParentNode): void {
  sincronizarControles(raiz);
  for (const el of raiz.querySelectorAll<HTMLInputElement>("input.spro-intervalo")) {
    if (el.getAttribute("data-spro-ligado")) continue;
    el.setAttribute("data-spro-ligado", "1");
    el.addEventListener("input", () => sincronizarControles(el.parentElement ?? raiz));
  }
  for (const el of raiz.querySelectorAll<HTMLInputElement>(".spro-cor > input[type='color']")) {
    if (el.getAttribute("data-spro-ligado")) continue;
    el.setAttribute("data-spro-ligado", "1");
    for (const ev of ["input", "change"]) el.addEventListener(ev, () => sincronizarControles(el.parentElement ?? raiz));
  }
  for (const abas of raiz.querySelectorAll<HTMLElement>("[data-spro-abas]")) {
    if (abas.getAttribute("data-spro-ligado")) continue;
    abas.setAttribute("data-spro-ligado", "1");
    const botoes = [...abas.querySelectorAll<HTMLElement>("[role='tab'][data-aba]")];
    const paineis = [...abas.querySelectorAll<HTMLElement>("[data-painel]")];
    const selecionar = (id: string) => {
      for (const b of botoes) {
        const ativa = b.getAttribute("data-aba") === id;
        b.setAttribute("aria-selected", String(ativa));
        b.setAttribute("tabindex", ativa ? "0" : "-1");
      }
      for (const p of paineis) {
        if (p.getAttribute("data-painel") === id) p.removeAttribute("hidden");
        else p.setAttribute("hidden", "");
      }
    };
    botoes.forEach((b, i) => {
      b.addEventListener("click", () => selecionar(b.getAttribute("data-aba") ?? ""));
      b.addEventListener("keydown", (ev) => {
        const tecla = (ev as KeyboardEvent).key;
        const passo = tecla === "ArrowRight" ? 1 : tecla === "ArrowLeft" ? -1 : 0;
        const alvo = botoes[(i + passo + botoes.length) % botoes.length];
        if (!passo || !alvo) return;
        ev.preventDefault();
        selecionar(alvo.getAttribute("data-aba") ?? "");
        alvo.focus();
      });
    });
    const inicial = botoes.find((b) => b.getAttribute("aria-selected") === "true") ?? botoes[0];
    if (inicial) selecionar(inicial.getAttribute("data-aba") ?? "");
  }
}

/** Abre o dialogo no formato novo com o contrato do `openDialog` legado. Devolve o `$box` (jQuery, se houver) do corpo. */
export function abrirHtml(win: Window, doc: Document, def: DefLegado): unknown {
  const id = def.id ?? `seiProDialog_${++sequencia}`;
  abertos.get(id)?.fechar();
  const corpo = h("div", { id, class: "spro-form spro-legado" });
  const analisado = new (win as unknown as { DOMParser: typeof DOMParser }).DOMParser().parseFromString(
    `<!doctype html><html><body>${def.html ?? ""}</body></html>`,
    "text/html",
  );
  limpar(analisado.body);
  corpo.append(...[...analisado.body.childNodes].map((n) => doc.importNode(n, true)));

  const jq = ((win as unknown as { jQuery?: JQuery; $?: JQuery }).jQuery ?? (win as unknown as { $?: JQuery }).$) as JQuery | undefined;
  const box: Record<string, unknown> | HTMLElement = jq ? jq(corpo) : corpo;
  const fecharPeloBox = () => dialogo.fechar();
  // `$box.dialog('close')` dos modulos antigos: o jQuery UI nao esta por tras, entao o metodo e este
  (box as Record<string, unknown>).dialog = (cmd?: unknown) => {
    if (cmd === "close" || cmd === "destroy") fecharPeloBox();
    return box;
  };

  const botoes = normalizarBotoes(def.buttons);
  const rodape = botoes.length
    ? h(
        "div",
        { class: "spro-dialogo-rodape" },
        ...botoes.map((b) =>
          h(
            "button",
            { type: "button", class: b.primary ? "spro-botao primario" : "spro-botao", onclick: () => b.click?.call(corpo, box) },
            b.text ?? "",
          ),
        ),
      )
    : null;
  const largura = typeof def.width === "number" ? def.width : undefined;
  const dialogo = abrirDialogo(doc, {
    titulo: def.title ?? "",
    ...(largura ? { largura } : {}),
    conteudo: h("div", {}, corpo, rodape),
    aoFechar: () => {
      abertos.delete(id);
      def.onClose?.();
    },
  });
  abertos.set(id, dialogo);
  ligar(corpo);
  def.onOpen?.(box);
  return box;
}
