import { h } from "@comum/ui/dom";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { colunaDeFormulario, linhaDeCampo } from "../ui/formulario";
import { editarLink, removerLink } from "../util/links";
import { urlHttpValida } from "../util/url";
import { URL_EXECUTAVEL } from "./ghs-unlock";
import type { Contexto, Recurso } from "./tipos";

/**
 * Edicao de links (porte de `link-pro.js`): ao clicar num link http(s) aparece um balao com Abrir, Copiar,
 * Editar e Remover. O legado inseria o balao DENTRO do documento (e gravava `data-reflinkpro` nele), o que o CK5
 * nao aceita e sujava o HTML salvo; aqui o balao e um elemento flutuante da pagina do editor e o documento nao
 * recebe nada. No CK5 editar/remover vao pelo model (o link e um atributo de texto `linkHref`). A URL digitada
 * nunca pode ter esquema executavel (`javascript:` etc.).
 */
const ESTILO_BALAO =
  "position:fixed;z-index:2147483000;display:flex;gap:10px;align-items:center;max-width:90%;padding:6px 12px;font:13px sans-serif;background:#fff;color:#1155cc;border:1px solid #ccc;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.2);";

interface Estado {
  balao: { el: HTMLElement; link: HTMLAnchorElement } | null;
}
const estados = new WeakMap<Contexto, Estado>();
const estadoDe = (c: Contexto): Estado => {
  const existente = estados.get(c);
  if (existente) return existente;
  const novo: Estado = { balao: null };
  estados.set(c, novo);
  return novo;
};

const encurtar = (url: string) => (url.length > 50 ? `${url.replace(/^(.{50}[^\s]*).*/, "$1")}...` : url);

function criar(c: Contexto) {
  const estado = estadoDe(c);
  const avisar = (t: string) => avisarEditor(c.doc, t);

  /** Fecha o balao; sem `forcar` respeita o mouse em cima dele (o legado so fechava se nao estivesse com hover). */
  function ocultar(forcar: boolean): void {
    const b = estado.balao;
    if (!b) return;
    if (!forcar) {
      let sobre = false;
      try {
        sobre = b.el.matches(":hover");
      } catch {
        sobre = false;
      }
      if (sobre) return;
    }
    b.el.remove();
    estado.balao = null;
  }

  function linkAtual(): HTMLAnchorElement | null {
    if (estado.balao) return estado.balao.link;
    const ed = c.adaptador.getInstance();
    const el = ed ? c.adaptador.getSelectionElement(ed) : null;
    return (el?.closest("a[href]") as HTMLAnchorElement | null) ?? null;
  }

  async function copiar(url: string): Promise<void> {
    try {
      await (c.areaDeTransferencia ?? c.win.navigator.clipboard).writeText(url);
      avisar("Link copiado!");
    } catch {
      avisar("Não foi possível copiar o link");
    }
  }

  function showLinkTips(alvo: Element | null, _doc?: unknown): void {
    ocultar(true);
    const link = alvo?.closest?.("a[href]") as HTMLAnchorElement | null;
    const url = link?.getAttribute("href") ?? "";
    if (!link || !urlHttpValida(url)) return;

    const abrir = h(
      "a",
      {
        href: url,
        target: "_blank",
        rel: "noopener noreferrer",
        title: link.textContent ?? "",
        style: "color:inherit;text-decoration:underline;",
      },
      h("strong", {}, encurtar(url)),
    );
    const acao = (classe: string, texto: string, fazer: () => void) =>
      h(
        "button",
        {
          type: "button",
          class: classe,
          title: texto,
          style: "background:none;border:0;color:#777;cursor:pointer;font:inherit;padding:0 2px;text-decoration:underline;",
          onclick: fazer,
        },
        texto,
      );
    const el = h(
      "div",
      { class: "linkDisplayPro", style: ESTILO_BALAO },
      abrir,
      acao("spro-copiar", "Copiar", () => void copiar(url)),
      acao("spro-editar", "Editar", () => openDialogLinkPro()),
      acao("spro-remover", "Remover", () => removeLinkPro()),
    );
    c.doc.body.append(el);
    estado.balao = { el, link };

    // posicao: logo abaixo do link; o documento do CK4 e um iframe, entao soma o deslocamento dele
    const caixa = link.getBoundingClientRect?.();
    if (caixa) {
      const quadro = link.ownerDocument.defaultView?.frameElement?.getBoundingClientRect?.();
      const largura = el.getBoundingClientRect?.().width ?? 0;
      const esquerda = Math.max(8, Math.min(caixa.left + (quadro?.left ?? 0), (c.win.innerWidth || 0) - largura - 8));
      el.style.left = `${esquerda}px`;
      el.style.top = `${caixa.bottom + (quadro?.top ?? 0) + 4}px`;
    }
  }

  function removeLinkPro(_ref?: unknown, _idEditor?: unknown): void {
    const link = linkAtual();
    if (!link) return;
    removerLink(c, link);
    ocultar(true);
  }

  function openLinkPro(_ref?: unknown, _idEditor?: unknown): void {
    const url = linkAtual()?.getAttribute("href");
    if (url && urlHttpValida(url)) c.win.open(url, "_blank", "noopener,noreferrer");
  }

  function copyLinkPro(_ref?: unknown, _idEditor?: unknown): void {
    const url = linkAtual()?.getAttribute("href");
    if (url) void copiar(url);
  }

  function openDialogLinkPro(): void {
    const link = linkAtual();
    if (!link) return;
    const campoNome = h("input", { type: "text", id: "linkProNome", autocomplete: "off" });
    const campoUrl = h("input", { type: "text", id: "linkProUrl", placeholder: "https://", autocomplete: "off", spellcheck: "false" });
    campoNome.value = link.textContent ?? "";
    campoUrl.value = link.getAttribute("href") ?? "";
    const dialogo = abrirDialogo(c.doc, {
      titulo: "Editar link",
      conteudo: colunaDeFormulario(
        linhaDeCampo("Texto do link", campoNome),
        linhaDeCampo("Endereço (URL)", campoUrl),
        h(
          "div",
          { class: "spro-dialogo-rodape" },
          h(
            "button",
            {
              type: "button",
              class: "spro-botao primario",
              onclick: () => {
                const url = campoUrl.value.trim();
                const nome = campoNome.value.trim() || url;
                if (url === "") return avisar("Digite um link");
                if (URL_EXECUTAVEL.test(url)) return avisar("O link informado é inválido.");
                if (editarLink(c, link, nome, url)) {
                  ocultar(true);
                  dialogo.fechar();
                }
              },
            },
            "Salvar",
          ),
        ),
      ),
    });
  }

  /** No CK5 o evento e ligado aqui (documento da pagina); no CK4 o monolito o liga no iframe de cada secao. */
  function iniciar(): void {
    if (c.adaptador.versao !== 5) return;
    c.doc.addEventListener(
      "mousedown",
      (ev) => {
        const alvo = ev.target as Element | null;
        if (!alvo || estado.balao?.el.contains(alvo)) return;
        const link = alvo.closest?.("a[href]");
        if (link && alvo.closest(".ck-editor__editable_inline") && c.checkOpcao("editarlinks")) showLinkTips(link);
        else ocultar(false);
      },
      true,
    );
  }

  const globais = {
    showLinkTips,
    hideLinkTips: (_doc?: unknown) => ocultar(false),
    openLinkPro,
    removeLinkPro,
    copyLinkPro,
    editLinkPro: (_idEditor?: unknown) => openDialogLinkPro(),
    openDialogLinkPro,
    /** Compat: o antigo registrava um CKEDITOR.dialog; o dialogo agora abre em `openDialogLinkPro`. */
    getDialogLinkPro: () => {},
  };
  return { globais, iniciar };
}

export const recurso: Recurso = {
  id: "link-pro",
  globais: (c: Contexto) => criar(c).globais,
  iniciar: (c: Contexto) => criar(c).iniciar(),
};
