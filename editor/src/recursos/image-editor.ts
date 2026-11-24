import { h } from "@comum/ui/dom";
import type { Editor } from "../adaptador";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { modeloDe } from "../util/ck5";
import type { Contexto, Recurso } from "./tipos";

/**
 * Editar imagem (porte de `image-editor.js`): abre o Filerobot Image Editor sobre a imagem selecionada no corpo do documento e,
 * ao salvar, troca o `src` da imagem pela imagem editada (data URL). A biblioteca e carregada sob demanda por
 * `checkLoadFileRobot` (global do `sei-functions-pro.js`, consumido por `c.win`). No CK4 basta mudar o DOM do iframe; no CK5
 * o `src` e gravado no model (mudar o DOM seria desfeito na reconciliacao), com a reescrita do HTML do corpo como reserva.
 * No SEI 5 a entrada e a barra da imagem (botao "Editar imagem") e o botao direito sobre ela; no CK4 o menu e do monolito.
 */

// biome-ignore lint/suspicious/noExplicitAny: o CKEditor 5 do SEI nao tem tipos; so os membros usados abaixo importam
type Qualquer = any;

interface FilerobotInstancia {
  render(o: { onClose: (motivo?: unknown) => void }): void;
  terminate?(): void;
  getCurrentImgData?(): { imageData?: { imageBase64?: string } } | undefined;
}
interface FilerobotClasse {
  new (container: Element, config: Record<string, unknown>): FilerobotInstancia;
  TABS: Record<string, string>;
  TOOLS: Record<string, string>;
}

/** O que o monolito deixa em `window` (disponivel no clique, nao na carga). */
interface Monolito {
  checkLoadFileRobot?: (callback: () => void) => void;
  FilerobotImageEditor?: FilerobotClasse;
  NAMESPACE_SPRO?: string;
  openDialogUploadImgBase64?: (editor: unknown, img?: Element | null) => void;
  imgEditor?: FilerobotInstancia | null;
  innerHeight?: number;
  innerWidth?: number;
}

const ICONE_EDITAR_IMAGEM =
  '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M2.5 3h11A1.5 1.5 0 0 1 15 4.5V8h-1.5V4.5h-11v8.2l3.1-3.1a.75.75 0 0 1 1.06 0l2 2-1.06 1.06L6.13 11.2 2.5 14.83v.67H8V17H2.5A1.5 1.5 0 0 1 1 15.5v-11A1.5 1.5 0 0 1 2.5 3z"/>' +
  '<circle cx="10.5" cy="6.8" r="1.3"/>' +
  '<path d="M16.4 9.6l1.99 2a.75.75 0 0 1 0 1.06l-5.3 5.3a.75.75 0 0 1-.4.2l-2.4.4a.5.5 0 0 1-.57-.57l.4-2.4a.75.75 0 0 1 .2-.4l5.3-5.3a.75.75 0 0 1 1.06 0zm-.53 1.6l-4.6 4.6-.2 1.13 1.13-.2 4.6-4.6-.93-.93z"/>' +
  "</svg>";
const ICONE_FORMATAR_IMAGEM =
  '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M2.5 3h11A1.5 1.5 0 0 1 15 4.5V9h-1.5V4.5h-11v8.2l3.1-3.1a.75.75 0 0 1 1.06 0l2 2-1.06 1.06L6.13 11.2 2.5 14.83v.67H9V17H2.5A1.5 1.5 0 0 1 1 15.5v-11A1.5 1.5 0 0 1 2.5 3z"/>' +
  '<circle cx="10.5" cy="6.8" r="1.3"/>' +
  '<path d="M11 11h8v1.5h-8zM11 14h8v1.5h-8zM11 17h8v1.5h-8z"/>' +
  '<path d="M13 10h1.5v3.5H13zM16.5 13h1.5v3.5h-1.5zM13.5 16h1.5v3.5h-1.5z"/>' +
  "</svg>";

const SELETOR_IMAGEM_SELECIONADA = ".ck-widget_selected img, .image_selected img, img.ck-widget_selected";

function criar(c: Contexto) {
  const A = c.adaptador;
  const M = c.win as unknown as Monolito;
  const avisar = (t: string) => avisarEditor(c.doc, t);

  /** Acoes de imagem do SEI Pro no SEI 5 (barra da imagem e botao direito). */
  const ACOES_IMAGEM_CK5 = [
    {
      nome: "seiProFormatarImagem",
      label: "Formatar imagem (SEI Pro)",
      rotuloMenu: "Formatar Imagem",
      icone: ICONE_FORMATAR_IMAGEM,
      executar: (ed: Editor, img: Element | null) => {
        if (typeof M.openDialogUploadImgBase64 === "function") M.openDialogUploadImgBase64(ed, img);
      },
    },
    {
      nome: "seiProEditarImagem",
      label: "Editar imagem (SEI Pro)",
      rotuloMenu: "Editar Imagem",
      icone: ICONE_EDITAR_IMAGEM,
      executar: (_ed: Editor, img: Element | null) => openImageEditorPro(null, img),
    },
  ];

  /** O `<img>` selecionado, igual nas duas versoes: pela selecao, depois o widget marcado (CK5) e, por fim, a unica imagem do corpo. */
  function resolveSelectedImagePro(ed: Editor): HTMLImageElement | null {
    const el = A.getSelectionElement(ed);
    if (el) {
      if (el.tagName?.toLowerCase() === "img") return el as HTMLImageElement;
      const dentro = el.querySelector?.("img");
      if (dentro) return dentro as HTMLImageElement;
      const figura = el.closest?.("figure, .image, .image-inline, .ck-widget");
      const daFigura = figura?.querySelector("img");
      if (daFigura) return daFigura as HTMLImageElement;
    }
    try {
      const marcada = A.findInBody(ed, SELETOR_IMAGEM_SELECIONADA);
      if (marcada.length) return marcada[0] as HTMLImageElement;
    } catch {
      // sem corpo: segue para o ultimo recurso
    }
    try {
      const todas = A.findInBody(ed, "img");
      if (todas.length === 1) return todas[0] as HTMLImageElement;
    } catch {
      // sem corpo
    }
    return null;
  }

  /** CK5: grava o `src` no model da imagem (imageInline/imageBlock achado pelo widget). false se nao achou. */
  function gravarNoModeloCk5(ed: Qualquer, img: Element, novo: string): boolean {
    try {
      const widget = img.closest(".ck-widget");
      const modelo = widget ? modeloDe(ed, widget) : null;
      if (modelo?.hasAttribute("src")) {
        ed.model.change((w: Qualquer) => w.setAttribute("src", novo, modelo));
        return true;
      }
    } catch {
      // cai na reescrita do HTML
    }
    return false;
  }

  /** Troca o `src` da imagem original pelo da editada (DOM no CK4; model no CK5, com o HTML do corpo como reserva). */
  function applyEditedSrcPro(ed: Editor, img: Element | null, antigo: string, novo: string): void {
    if (!img || !novo) return;
    if (A.versao !== 5) {
      A.withEdit(ed, () => img.setAttribute("src", novo));
      return;
    }
    let gravou = false;
    A.withEdit(ed, () => {
      gravou = gravarNoModeloCk5(ed, img, novo);
    });
    if (gravou) return;
    // reserva: troca so a primeira ocorrencia do src antigo no HTML do corpo (fora do `model.change`, como o adaptador exige)
    let feito = false;
    try {
      A.transformBodyHtml(ed, (html) => {
        if (typeof html !== "string" || !antigo) return html;
        const i = html.indexOf(antigo);
        if (i === -1) return html;
        feito = true;
        return html.slice(0, i) + novo + html.slice(i + antigo.length);
      });
    } catch {
      // sem como reescrever
    }
    if (!feito) {
      try {
        img.setAttribute("src", novo); // so visual: nao persiste no model do CK5
      } catch {
        // imagem ja descartada
      }
      avisar("A imagem foi editada, mas a gravação no SEI 5 pode não persistir. Verifique antes de salvar.");
    }
  }

  /** Abre o Filerobot num dialogo sobre a imagem selecionada (ou a informada). `this_` pode ser o elemento clicado ou o proprio editor. */
  function openImageEditorPro(this_?: unknown, imgInformada?: Element | null): void {
    if (!c.checkOpcao("editarimagens")) return;
    const ref = this_ as { nodeType?: number } | null | undefined;
    const ed =
      ref && typeof ref === "object" && ref.nodeType === undefined ? (ref as Editor) : A.getInstance((ref as Element | null) ?? null);
    if (!ed) return;

    const img = imgInformada || resolveSelectedImagePro(ed);
    const antigo = img?.getAttribute("src");
    if (!img || typeof antigo !== "string") {
      avisar("Selecione uma imagem para editar.");
      return;
    }
    if (A.somenteLeitura(ed)) {
      A.recusarEscrita();
      return;
    }

    const largura = Math.max(320, Math.min((M.innerWidth || 905) - 5, 900));
    // o que cabe na janela descontando o titulo e o botao do dialogo (~170px)
    const altura = Math.max(320, Math.min((M.innerHeight || 700) - 170, 900));
    let fechado = false;
    let modal: { fechar(): void } | null = null;
    const fechar = () => modal?.fechar();

    const aplicarEFechar = (novo: string | undefined) => {
      if (novo) {
        if (A.somenteLeitura(ed)) A.recusarEscrita();
        else applyEditedSrcPro(ed, img, antigo, novo);
      }
      fechar();
    };

    const container = h("div", { id: "ImageEditorPro", style: `width:100%;height:${altura}px;` });
    const aplicar = h(
      "button",
      {
        type: "button",
        id: "ImageEditorProAplicar",
        class: "spro-botao primario",
        onclick: () => {
          // equivale ao OK original: o estado atual do Filerobot vai para a imagem selecionada
          const ativo = M.imgEditor;
          if (!ativo || typeof ativo.getCurrentImgData !== "function") return fechar();
          aplicarEFechar(ativo.getCurrentImgData()?.imageData?.imageBase64);
        },
      },
      "Aplicar",
    );
    modal = abrirDialogo(c.doc, {
      titulo: "Editar Imagem",
      conteudo: h(
        "div",
        { style: `width:min(${largura}px,calc(100vw - 80px));` },
        container,
        h("div", { class: "spro-barra fim" }, aplicar),
      ),
      aoFechar: () => {
        fechado = true;
        try {
          M.imgEditor?.terminate?.();
        } catch {
          // ja encerrado
        }
        M.imgEditor = null;
      },
    });

    const aoCarregar = () => {
      if (fechado) return;
      const Filerobot = M.FilerobotImageEditor;
      if (typeof Filerobot === "undefined") {
        fechar();
        avisar("Não foi possível carregar o editor de imagem.");
        return;
      }
      const { TABS, TOOLS } = Filerobot;
      const instancia = new Filerobot(container, {
        source: antigo,
        onSave: (editada?: { imageBase64?: string }) => aplicarEFechar(editada?.imageBase64),
        annotationsCommon: { fill: "#ff0000" },
        Text: { text: `${M.NAMESPACE_SPRO ?? ""}...` },
        translations: { "toolbar.adjust": "Ajustes" },
        language: "pt",
        tabsIds: [TABS.ADJUST, TABS.ANNOTATE, TABS.FINETUNE, TABS.FILTERS, TABS.RESIZE, TABS.WATERMARK],
        defaultTabId: TABS.ADJUST,
        defaultToolId: TOOLS.TEXT,
        loadableDesignState: false,
        observePluginContainerSize: true,
      });
      instancia.render({
        onClose: () => {
          try {
            instancia.terminate?.();
          } catch {
            // ja encerrado
          }
          fechar();
        },
      });
      M.imgEditor = instancia;
      // garante a altura do container depois que o Filerobot monta
      setTimeout(() => {
        container.style.height = `${altura}px`;
      }, 500);
    };

    if (typeof M.checkLoadFileRobot === "function") M.checkLoadFileRobot(aoCarregar);
    else aoCarregar();
  }

  /** CK5: um `<img>` do DOM -> selecionado no model (o botao direito nao muda a selecao do CK5). */
  function selecionarImagemCK5(ed: Qualquer, img: Element): void {
    try {
      const widget = img.closest(".ck-widget");
      const modelo = widget ? modeloDe(ed, widget) : null;
      if (modelo) ed.model.change((w: Qualquer) => w.setSelection(modelo, "on"));
    } catch {
      // sem mapeamento: a acao segue com a imagem do clique
    }
  }

  /** CK5: o `<img>` da imagem selecionada no model (a da barra da imagem), ou null. */
  function imagemSelecionadaCK5(ed: Qualquer): Element | null {
    const el = ed.model.document.selection.getSelectedElement();
    if (!el?.is("element") || !/^image/.test(el.name)) return null;
    const vista = ed.editing.mapper.toViewElement(el);
    const dom: Element | null = vista ? ed.editing.view.domConverter.mapViewToDom(vista) : null;
    if (!dom) return null;
    return dom.tagName === "IMG" ? dom : dom.querySelector("img");
  }

  /**
   * CK5: botoes "Formatar imagem" e "Editar imagem" na barra que aparece ao clicar na imagem. A barra e montada pelo
   * WidgetToolbarRepository a partir de `itemsConfig` na primeira exibicao: registra os componentes e acrescenta os nomes;
   * se a barra ja foi montada, os botoes entram direto na view.
   */
  function instalarBotaoBarraImagemCK5(ed: Qualquer): boolean {
    if (!ed?.ui || !ed.plugins?.has("WidgetToolbarRepository")) return false;
    const repositorio = ed.plugins.get("WidgetToolbarRepository");
    const def = repositorio._toolbarDefinitions?.get("image");
    if (!def) return false;
    const fabrica = ed.ui.componentFactory;
    const primeira = ACOES_IMAGEM_CK5[0];
    if (!primeira || fabrica.has(primeira.nome)) return true;

    // o ButtonView nao e global no SEI 5: usa a classe do botao nativo de texto alternativo
    let Botao: Qualquer = null;
    try {
      Botao = fabrica.create("imageTextAlternative").constructor;
    } catch {
      // sem o botao nativo
    }
    if (!Botao) return false;

    for (const acao of ACOES_IMAGEM_CK5) {
      fabrica.add(acao.nome, (locale: unknown) => {
        const b = new Botao(locale);
        b.set({ label: acao.label, icon: acao.icone, tooltip: true, withText: false });
        b.bind("isEnabled").to(ed, "isReadOnly", (somenteLeitura: boolean) => !somenteLeitura);
        b.on("execute", () => acao.executar(ed, imagemSelecionadaCK5(ed)));
        return b;
      });
    }
    const nomes = ACOES_IMAGEM_CK5.map((a) => a.nome);

    if (Array.isArray(def.itemsConfig) && !def.itemsConfig.includes(nomes[0])) def.itemsConfig.push("|", ...nomes);
    if (def.initialized && def.view?.items) {
      // separador: reaproveita a classe de um separador ja presente na barra
      let separador: Qualquer = null;
      for (const it of def.view.items as Iterable<Qualquer>) {
        if (it.element?.classList.contains("ck-toolbar__separator")) {
          separador = it;
          break;
        }
      }
      if (separador) {
        try {
          def.view.items.add(new separador.constructor(ed.locale));
        } catch {
          // sem separador: so os botoes
        }
      }
      for (const n of nomes) def.view.items.add(fabrica.create(n));
    }
    return true;
  }

  /** Botao direito sobre a imagem no SEI 5 (chamado por `editImgPro` do monolito quando nao ha `editor.contextMenu`). */
  function menuImagemCK5Pro(ed: Qualquer): void {
    if (!ed?.model) return;
    A.addContextMenu(ed, (alvo) => {
      const el = alvo && (alvo.nodeType === 1 ? alvo : alvo.parentElement);
      const widget = el?.closest?.(".ck-widget");
      const img = el?.tagName === "IMG" ? el : (widget?.querySelector("img") ?? null);
      if (!img || ed.isReadOnly) return [];
      return ACOES_IMAGEM_CK5.map((acao) => ({
        label: acao.rotuloMenu,
        action: () => {
          selecionarImagemCK5(ed, img);
          acao.executar(ed, img);
        },
      }));
    });
  }

  function getDialogImageEditorPro(): void {
    // o CKEDITOR.dialog de antes virou o dialogo sob demanda de `openImageEditorPro`
  }

  function globais(): Record<string, unknown> {
    return {
      /** Instancia ativa do Filerobot (o monolito declara o nome; o legado o mantinha em `window`). */
      imgEditor: null,
      openImageEditorPro,
      /** Compat com o `initFunctions` do legado: o dialogo agora abre sob demanda, so a opcao e verificada. */
      initDialogImageEditorPro: () => {
        if (c.checkOpcao("editarimagens")) getDialogImageEditorPro();
      },
      getDialogImageEditorPro,
      menuImagemCK5Pro,
    };
  }

  /** SEI 5: quando o editor estiver pronto, poe os botoes na barra da imagem. */
  function iniciar(): void {
    A.waitReady(30000)
      .then((ed) => {
        if (A.versao !== 5 || !c.checkOpcao("editarimagens")) return;
        instalarBotaoBarraImagemCK5(ed);
      })
      .catch(() => {});
  }

  return { globais, iniciar };
}

export const recurso: Recurso = {
  id: "image-editor",
  globais: (c: Contexto) => criar(c).globais(),
  iniciar: (c: Contexto) => criar(c).iniciar(),
};
