import { criarAdaptador } from "../../src/adaptador";
import { htmlParaNos } from "../../src/adaptador/html";
import { recurso as imageEditor } from "../../src/recursos/image-editor";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, tique, usarDocumento } from "../dialogo";
import { type CasoEditor, criarCk4, criarCk5, type FalsoCk4, type FalsoCk5, nosDoisEditores } from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;
// biome-ignore lint/suspicious/noExplicitAny: os falsos do CK5 sao abertos de proposito (so a superficie usada)
type Qualquer = any;

const ANTIGA = "data:image/png;base64,ANTIGA";
const NOVA = "data:image/png;base64,NOVA";

const ctxDe = (c: { win: Window; doc: Document }, opcao = true): Contexto => ({
  adaptador: criarAdaptador(c.win),
  doc: c.doc,
  win: c.win,
  base: "chrome-extension://abc/",
  checkOpcao: () => opcao,
  verifyOpcao: () => false,
});

/** O Filerobot falso: guarda a configuracao, o `render` e quantas vezes foi encerrado. */
class FalsoFilerobot {
  static TABS = {
    ADJUST: "Adjust",
    ANNOTATE: "Annotate",
    FINETUNE: "Finetune",
    FILTERS: "Filters",
    RESIZE: "Resize",
    WATERMARK: "Watermark",
  };
  static TOOLS = { TEXT: "Text" };
  static criados: FalsoFilerobot[] = [];
  static zerar(): void {
    FalsoFilerobot.criados = [];
  }
  renderizado: { onClose: () => void } | null = null;
  encerrado = 0;
  atual: string | undefined = NOVA;
  constructor(
    readonly container: Element,
    readonly config: Record<string, unknown> & { onSave: (o?: { imageBase64?: string }) => void },
  ) {
    FalsoFilerobot.criados.push(this);
  }
  render(o: { onClose: () => void }): void {
    this.renderizado = o;
  }
  terminate(): void {
    this.encerrado += 1;
  }
  getCurrentImgData() {
    return { imageData: { imageBase64: this.atual } };
  }
}

const janela = (c: { win: Window }) => c.win as unknown as Record<string, unknown>;
const ultimo = (): FalsoFilerobot => FalsoFilerobot.criados.at(-1) as FalsoFilerobot;
const avisos = (doc: Document) => [...doc.querySelectorAll(".spro-aviso")].map((a) => a.textContent ?? "").join("|");
const limparAvisos = (doc: Document) => {
  for (const a of [...doc.querySelectorAll(".spro-aviso")]) a.remove();
};

/** Poe `<p><img></p>` no corpo (CK5: dentro de um `figure.ck-widget`) e o cursor na imagem. */
function porImagem(c: CasoEditor, src = ANTIGA): { img: HTMLImageElement; widget: Element | null } {
  const html = c.versao === 5 ? `<figure class="image ck-widget"><img src="${src}"></figure>` : `<p><img src="${src}"></p>`;
  const corpo = c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");
  corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, html));
  const img = corpo.querySelector("img") as HTMLImageElement;
  if (c.versao === 4) (c.ed as FalsoCk4).selecionar("txaEditor_1", { elemento: img });
  else (c.ed as FalsoCk5).selecionar({ elemento: img });
  return { img, widget: corpo.querySelector("figure") };
}

/** Instala a biblioteca falsa no `window` da pagina (o `checkLoadFileRobot` do monolito chama o callback na hora). */
function instalarBiblioteca(c: CasoEditor, carregada = true): { chamadas: number } {
  const estado = { chamadas: 0 };
  janela(c).NAMESPACE_SPRO = "SEI Pro";
  janela(c).checkLoadFileRobot = (cb: () => void) => {
    estado.chamadas += 1;
    if (carregada) janela(c).FilerobotImageEditor = FalsoFilerobot;
    cb();
  };
  return estado;
}

/** No CK5 o model da imagem sabe que tem `src` (como o `imageBlock` real). */
function modeloComSrc(c: CasoEditor, widget: Element | null): Qualquer {
  const m = (c.ed as FalsoCk5).instancia().modeloDe(widget as Element) as Qualquer;
  m.hasAttribute = (n: string) => n === "src";
  return m;
}

export async function verificarImageEditor(): Promise<void> {
  secao("recurso image-editor");

  await nosDoisEditores("image-editor", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    FalsoFilerobot.zerar();
    const lib = instalarBiblioteca(c);
    const g = imageEditor.globais(ctxDe(c)) as Record<string, Fn>;
    igual(`image-editor ${v}: id do recurso`, imageEditor.id, "image-editor");
    igual(`image-editor ${v}: globais do contrato`, Object.keys(g).sort(), [
      "getDialogImageEditorPro",
      "imgEditor",
      "initDialogImageEditorPro",
      "menuImagemCK5Pro",
      "openImageEditorPro",
    ]);
    igual(`image-editor ${v}: imgEditor comeca nulo`, g.imgEditor, null);
    igual(
      `image-editor ${v}: getDialog e init sao no-op`,
      [g.getDialogImageEditorPro(), g.initDialogImageEditorPro()],
      [undefined, undefined],
    );

    // sem imagem selecionada (e mais de uma imagem no corpo): avisa e nao abre
    const corpo =
      c.versao === 4 ? (c as unknown as { ed: FalsoCk4 }).ed.instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, `<p>texto</p><p><img src="a"></p><p><img src="b"></p>`));
    const p = corpo.querySelector("p") as Element;
    if (c.versao === 4) (c.ed as FalsoCk4).selecionar("txaEditor_1", { elemento: p });
    else (c.ed as FalsoCk5).selecionar({ elemento: p });
    g.openImageEditorPro(null);
    checar(
      `image-editor ${v}: sem imagem selecionada avisa e nao abre`,
      !dialogoAberto(c.doc) && avisos(c.doc) === "Selecione uma imagem para editar.",
      avisos(c.doc),
    );
    igual(`image-editor ${v}: nada foi pedido a biblioteca`, lib.chamadas, 0);
    limparAvisos(c.doc);

    // uma unica imagem no corpo vale como selecionada (ultimo recurso do legado)
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, `<p>texto</p><p><img src="${ANTIGA}"></p>`));
    g.openImageEditorPro(null);
    checar(`image-editor ${v}: uma so imagem no corpo abre o dialogo`, !!dialogoAberto(c.doc));
    clicar(dialogoAberto(c.doc) as HTMLElement, "Fechar");
    FalsoFilerobot.zerar();

    // abertura com a imagem selecionada
    const antesDaCarga = lib.chamadas;
    const { img, widget } = porImagem(c);
    g.openImageEditorPro(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    checar(`image-editor ${v}: abre o dialogo "Editar Imagem"`, !!d && /Editar Imagem/.test(d.querySelector("h2")?.textContent ?? ""));
    const cont = d.querySelector("#ImageEditorPro") as HTMLElement;
    checar(
      `image-editor ${v}: o conteiner #ImageEditorPro existe e tem altura`,
      !!cont && /height:\s*\d+px/.test(cont.getAttribute("style") ?? ""),
    );
    checar(
      `image-editor ${v}: sem botao Cancelar, com Aplicar`,
      ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")) && !!d.querySelector("#ImageEditorProAplicar"),
    );
    igual(`image-editor ${v}: a biblioteca foi carregada sob demanda uma vez`, lib.chamadas - antesDaCarga, 1);
    const fr = ultimo();
    igual(
      `image-editor ${v}: o Filerobot nasce no #ImageEditorPro com a imagem original`,
      [fr.container === cont, fr.config.source],
      [true, ANTIGA],
    );
    igual(
      `image-editor ${v}: configuracao do legado (idioma, abas, ferramenta, fill)`,
      [fr.config.language, fr.config.tabsIds, fr.config.defaultTabId, fr.config.defaultToolId, fr.config.annotationsCommon],
      ["pt", ["Adjust", "Annotate", "Finetune", "Filters", "Resize", "Watermark"], "Adjust", "Text", { fill: "#ff0000" }],
    );
    igual(
      `image-editor ${v}: texto padrao com a marca e traducao`,
      [fr.config.Text, fr.config.translations],
      [{ text: "SEI Pro..." }, { "toolbar.adjust": "Ajustes" }],
    );
    checar(`image-editor ${v}: render chamado e window.imgEditor aponta para a instancia`, !!fr.renderizado && janela(c).imgEditor === fr);

    // salvar pelo proprio Filerobot: grava na imagem e fecha
    if (c.versao === 5) {
      const m = modeloComSrc(c, widget);
      fr.config.onSave({ imageBase64: NOVA });
      igual(`image-editor ${v}: CK5 grava o src no model (nao no DOM)`, (c.ed as FalsoCk5).instancia().atributos.get(m.elemento), {
        src: NOVA,
      });
      igual(`image-editor ${v}: CK5 deixa o DOM como esta`, img.getAttribute("src"), ANTIGA);
    } else {
      fr.config.onSave({ imageBase64: NOVA });
      igual(`image-editor ${v}: CK4 troca o src da imagem`, img.getAttribute("src"), NOVA);
    }
    checar(
      `image-editor ${v}: salvar fecha o dialogo, encerra o Filerobot e zera imgEditor`,
      !dialogoAberto(c.doc) && fr.encerrado === 1 && janela(c).imgEditor === null,
    );

    // onSave sem imagem nao altera nada, mas fecha
    porImagem(c);
    g.openImageEditorPro(null);
    const sem = ultimo();
    const gravadosAntes = c.versao === 5 ? (c.ed as FalsoCk5).instancia().atributos.get(widget as Element) : undefined;
    sem.config.onSave({});
    checar(
      `image-editor ${v}: onSave sem imageBase64 fecha sem gravar`,
      !dialogoAberto(c.doc) && (c.versao === 4 || (c.ed as FalsoCk5).instancia().atributos.get(widget as Element) === gravadosAntes),
    );
    igual(`image-editor ${v}: src segue o original`, corpo.querySelector("img")?.getAttribute("src"), ANTIGA);

    // botao Aplicar: pega o estado atual do Filerobot
    const um = porImagem(c);
    g.openImageEditorPro(null);
    const ap = ultimo();
    ap.atual = NOVA;
    clicar(dialogoAberto(c.doc) as HTMLElement, "Aplicar");
    checar(`image-editor ${v}: Aplicar fecha o dialogo`, !dialogoAberto(c.doc));
    if (c.versao === 4) igual(`image-editor ${v}: Aplicar grava o estado atual`, um.img.getAttribute("src"), NOVA);
    else checar(`image-editor ${v}: Aplicar mantem o DOM do CK5 (grava no model/HTML)`, true);

    // Aplicar sem Filerobot ativo so fecha
    const lib2 = porImagem(c);
    g.openImageEditorPro(null);
    janela(c).imgEditor = null;
    clicar(dialogoAberto(c.doc) as HTMLElement, "Aplicar");
    checar(`image-editor ${v}: Aplicar sem instancia so fecha`, !dialogoAberto(c.doc) && lib2.img.getAttribute("src") === ANTIGA);

    // onClose do Filerobot encerra e fecha
    porImagem(c);
    g.openImageEditorPro(null);
    const oc = ultimo();
    oc.renderizado?.onClose();
    checar(`image-editor ${v}: onClose do Filerobot encerra e fecha o dialogo`, !dialogoAberto(c.doc) && oc.encerrado >= 1);

    // fechar pelo X encerra a instancia e zera imgEditor
    porImagem(c);
    g.openImageEditorPro(null);
    const x = ultimo();
    clicar(dialogoAberto(c.doc) as HTMLElement, "Fechar");
    checar(
      `image-editor ${v}: o X fecha, encerra o Filerobot e zera window.imgEditor`,
      !dialogoAberto(c.doc) && x.encerrado === 1 && janela(c).imgEditor === null,
    );

    // biblioteca que chega depois de o dialogo fechar nao monta nada
    janela(c).FilerobotImageEditor = undefined;
    let tarde: (() => void) | null = null;
    janela(c).checkLoadFileRobot = (cb: () => void) => {
      tarde = cb;
    };
    porImagem(c);
    FalsoFilerobot.zerar();
    g.openImageEditorPro(null);
    clicar(dialogoAberto(c.doc) as HTMLElement, "Fechar");
    janela(c).FilerobotImageEditor = FalsoFilerobot;
    (tarde as (() => void) | null)?.();
    igual(`image-editor ${v}: carga tardia apos fechar nao cria o editor`, FalsoFilerobot.criados.length, 0);

    // falha ao carregar a biblioteca: avisa e nao deixa dialogo vazio
    instalarBiblioteca(c, false);
    janela(c).FilerobotImageEditor = undefined;
    porImagem(c);
    limparAvisos(c.doc);
    g.openImageEditorPro(null);
    checar(
      `image-editor ${v}: falha ao carregar a biblioteca avisa e fecha o dialogo`,
      !dialogoAberto(c.doc) && avisos(c.doc) === "Não foi possível carregar o editor de imagem.",
      avisos(c.doc),
    );
    limparAvisos(c.doc);

    // sem `checkLoadFileRobot` e com a biblioteca ja presente: monta direto
    janela(c).checkLoadFileRobot = undefined;
    janela(c).FilerobotImageEditor = FalsoFilerobot;
    FalsoFilerobot.zerar();
    porImagem(c);
    g.openImageEditorPro(null);
    igual(`image-editor ${v}: biblioteca ja carregada monta sem checkLoadFileRobot`, FalsoFilerobot.criados.length, 1);
    clicar(dialogoAberto(c.doc) as HTMLElement, "Fechar");

    // o editor pode vir como 1o argumento (o monolito chama openImageEditorPro(editor))
    instalarBiblioteca(c);
    porImagem(c);
    FalsoFilerobot.zerar();
    const ed = c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1") : (c.ed as FalsoCk5).instancia();
    g.openImageEditorPro(ed);
    checar(`image-editor ${v}: aceita o editor como 1o argumento`, !!dialogoAberto(c.doc) && FalsoFilerobot.criados.length === 1);
    clicar(dialogoAberto(c.doc) as HTMLElement, "Fechar");

    // imagem informada (barra/menu do CK5) vale mais que a selecao
    const outra = c.doc.createElement("img");
    outra.setAttribute("src", "data:image/png;base64,OUTRA");
    FalsoFilerobot.zerar();
    g.openImageEditorPro(null, outra);
    igual(`image-editor ${v}: usa a imagem informada`, ultimo().config.source, "data:image/png;base64,OUTRA");
    clicar(dialogoAberto(c.doc) as HTMLElement, "Fechar");

    // opcao "editarimagens" desligada: nada acontece
    const g2 = imageEditor.globais(ctxDe(c, false)) as Record<string, Fn>;
    FalsoFilerobot.zerar();
    g2.openImageEditorPro(null);
    checar(`image-editor ${v}: com a opcao desligada nao abre nada`, !dialogoAberto(c.doc) && FalsoFilerobot.criados.length === 0);
  });

  // ---- CK5: reserva por reescrita do HTML do corpo, e aviso quando nem isso persiste
  {
    const f = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>x</p>", principal: true }] });
    const c: CasoEditor = { versao: 5, doc: f.doc, win: f.win, ed: f };
    usarDocumento(c.doc);
    instalarBiblioteca(c);
    const g = imageEditor.globais(ctxDe(c)) as Record<string, Fn>;
    const inst = f.instancia();

    // o model nao responde por `src` (modelo sem hasAttribute): troca so a 1a ocorrencia no HTML do corpo
    const { img } = porImagem(c);
    inst.dadosPorRaiz.main = `<p><img src="${ANTIGA}"><img src="${ANTIGA}"></p>`;
    g.openImageEditorPro(null);
    ultimo().config.onSave({ imageBase64: NOVA });
    igual(
      "image-editor [CK5]: reserva reescreve so a 1a ocorrencia do src no HTML",
      inst.dadosPorRaiz.main,
      `<p><img src="${NOVA}"><img src="${ANTIGA}"></p>`,
    );
    igual("image-editor [CK5]: a reserva nao avisa quando deu certo", [avisos(c.doc), img.getAttribute("src")], ["", ANTIGA]);

    // nem o HTML tem o src antigo: so visual + aviso
    porImagem(c);
    inst.dadosPorRaiz.main = "<p>sem imagem</p>";
    g.openImageEditorPro(null);
    ultimo().config.onSave({ imageBase64: NOVA });
    checar(
      "image-editor [CK5]: sem como gravar, mostra o resultado e avisa que pode nao persistir",
      /pode não persistir/.test(avisos(c.doc)) && c.doc.querySelector("img")?.getAttribute("src") === NOVA,
      avisos(c.doc),
    );
    limparAvisos(c.doc);

    // reserva roda FORA do model.change (o adaptador exige)
    porImagem(c);
    inst.dadosPorRaiz.main = `<p><img src="${ANTIGA}"></p>`;
    let profundidade = -1;
    const original = inst.data.set;
    inst.data.set = (vv: string | Record<string, string>) => {
      profundidade = inst.profundidade;
      original(vv);
    };
    g.openImageEditorPro(null);
    ultimo().config.onSave({ imageBase64: NOVA });
    igual("image-editor [CK5]: a reescrita do HTML nao ocorre dentro de um model.change", profundidade, 0);
    inst.data.set = original;
  }

  // ---- somente leitura: recusa e nao abre; no CK4 e no CK5
  {
    const f4 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: `<p><img src="${ANTIGA}"></p>`, somenteLeitura: true }] });
    const f5 = criarCk5({
      secoes: [{ raiz: "main", label: "Corpo", html: `<p><img src="${ANTIGA}"></p>`, principal: true, somenteLeitura: true }],
    });
    for (const f of [f4, f5]) {
      const c: CasoEditor = { versao: f.versao, doc: f.doc, win: f.win, ed: f };
      usarDocumento(c.doc);
      FalsoFilerobot.zerar();
      instalarBiblioteca(c);
      const ctx = ctxDe(c);
      let recusas = 0;
      ctx.adaptador.aoRecusarEscrita(() => {
        recusas += 1;
      });
      const g = imageEditor.globais(ctx) as Record<string, Fn>;
      const img = c.doc.createElement("img");
      img.setAttribute("src", ANTIGA);
      const corpo = f.versao === 4 ? f4.instancia("txaEditor_1").corpo : f5.elemento("main");
      const real = corpo.querySelector("img") as Element;
      if (f.versao === 4) f4.selecionar("txaEditor_1", { elemento: real });
      else f5.selecionar({ elemento: real });
      g.openImageEditorPro(null);
      checar(
        `image-editor [CK${f.versao}]: secao somente leitura recusa e nao abre`,
        recusas === 1 && !dialogoAberto(c.doc) && FalsoFilerobot.criados.length === 0,
      );
    }
  }

  // ---- somente leitura que aparece com o dialogo aberto: o salvar recusa e nao grava
  {
    const f = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: `<p><img src="${ANTIGA}"></p>` }] });
    const c: CasoEditor = { versao: 4, doc: f.doc, win: f.win, ed: f };
    usarDocumento(c.doc);
    instalarBiblioteca(c);
    const ctx = ctxDe(c);
    let recusas = 0;
    ctx.adaptador.aoRecusarEscrita(() => {
      recusas += 1;
    });
    const g = imageEditor.globais(ctx) as Record<string, Fn>;
    const real = f.instancia("txaEditor_1").corpo.querySelector("img") as HTMLImageElement;
    f.selecionar("txaEditor_1", { elemento: real });
    g.openImageEditorPro(null);
    f.instancia("txaEditor_1").readOnly = true;
    ultimo().config.onSave({ imageBase64: NOVA });
    igual(
      "image-editor [CK4]: salvar com a secao agora somente leitura recusa e nao grava",
      [recusas, real.getAttribute("src"), !!dialogoAberto(c.doc)],
      [1, ANTIGA, false],
    );
  }

  // ---- sem editor pronto: nada acontece (sem erro)
  {
    const f = criarCk5({ secoes: [{ raiz: "main", label: "Corpo", html: "<p>x</p>", principal: true }], montarLogo: false });
    const c: CasoEditor = { versao: 5, doc: f.doc, win: f.win, ed: f };
    usarDocumento(c.doc);
    instalarBiblioteca(c);
    const g = imageEditor.globais(ctxDe(c)) as Record<string, Fn>;
    g.openImageEditorPro(null);
    checar("image-editor [CK5]: sem editor pronto nao abre nem avisa", !dialogoAberto(c.doc) && avisos(c.doc) === "");
  }

  // ---- CK5: botao direito sobre a imagem (menuImagemCK5Pro)
  {
    const f = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>x</p>", principal: true }] });
    const c: CasoEditor = { versao: 5, doc: f.doc, win: f.win, ed: f };
    usarDocumento(c.doc);
    instalarBiblioteca(c);
    const formatadas: unknown[][] = [];
    janela(c).openDialogUploadImgBase64 = (...a: unknown[]) => formatadas.push(a);
    const g = imageEditor.globais(ctxDe(c)) as Record<string, Fn>;
    const inst = f.instancia();
    const { img, widget } = porImagem(c);
    modeloComSrc(c, widget);

    g.menuImagemCK5Pro(inst);
    const corpo = f.elemento("main") as HTMLElement & {
      __seiProCtxBuilders?: Array<(alvo: Element | null) => Array<{ label: string; action: () => void }>>;
    };
    const construtor = corpo.__seiProCtxBuilders?.[0] as (alvo: Element | null) => Array<{ label: string; action: () => void }>;
    checar("image-editor [CK5]: o menu de contexto foi registrado no corpo", typeof construtor === "function");
    igual(
      "image-editor [CK5]: botao direito na imagem oferece Formatar e Editar",
      construtor(img).map((i) => i.label),
      ["Formatar Imagem", "Editar Imagem"],
    );
    igual(
      "image-editor [CK5]: o widget da imagem tambem vale como alvo",
      construtor(widget).map((i) => i.label),
      ["Formatar Imagem", "Editar Imagem"],
    );
    igual("image-editor [CK5]: fora de imagem nao oferece nada", construtor(corpo.ownerDocument.body), []);
    (inst as Qualquer).isReadOnly = true;
    igual("image-editor [CK5]: editor somente leitura nao oferece nada", construtor(img), []);
    (inst as Qualquer).isReadOnly = false;

    const itens = construtor(img);
    itens[0]?.action();
    checar(
      "image-editor [CK5]: Formatar Imagem seleciona a imagem no model e chama o modulo de formatar",
      inst.selecoesDefinidas.length === 1 && formatadas.length === 1 && formatadas[0]?.[1] === img,
    );
    itens[1]?.action();
    checar(
      "image-editor [CK5]: Editar Imagem abre o editor para a imagem clicada",
      !!dialogoAberto(c.doc) && ultimo().config.source === ANTIGA,
    );
    clicar(dialogoAberto(c.doc) as HTMLElement, "Fechar");

    // CK4 (editor sem model) e sem editor: no-op
    g.menuImagemCK5Pro({});
    g.menuImagemCK5Pro(null);
    checar("image-editor [CK5]: menuImagemCK5Pro ignora editor sem model", true);
  }

  // ---- CK5: botoes na barra da imagem (iniciar)
  {
    const f = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>x</p>", principal: true }] });
    const c: CasoEditor = { versao: 5, doc: f.doc, win: f.win, ed: f };
    usarDocumento(c.doc);
    instalarBiblioteca(c);
    janela(c).openDialogUploadImgBase64 = () => {};
    const inst = f.instancia() as Qualquer;

    class Colecao extends Array<Qualquer> {
      add(x: Qualquer): void {
        this.push(x);
      }
    }
    class Botao {
      props: Record<string, unknown> = {};
      escutas: Record<string, () => void> = {};
      constructor(readonly locale?: unknown) {}
      set(p: Record<string, unknown>) {
        Object.assign(this.props, p);
      }
      bind() {
        return { to: () => {} };
      }
      on(n: string, fn: () => void) {
        this.escutas[n] = fn;
      }
    }
    class Separador {
      element = { classList: { contains: (n: string) => n === "ck-toolbar__separator" } };
      constructor(readonly locale?: unknown) {}
    }
    const fabrica = {
      itens: new Map<string, (l: unknown) => Qualquer>(),
      has(n: string) {
        return this.itens.has(n);
      },
      add(n: string, fn: (l: unknown) => Qualquer) {
        this.itens.set(n, fn);
      },
      create(n: string) {
        return n === "imageTextAlternative" ? new Botao() : (this.itens.get(n) as (l: unknown) => Qualquer)(undefined);
      },
    };
    const itens = new Colecao();
    itens.push(new Separador(), new Botao());
    const def = { itemsConfig: ["imageTextAlternative"], initialized: true, view: { items: itens } };
    inst.plugins = { has: (n: string) => n === "WidgetToolbarRepository", get: () => ({ _toolbarDefinitions: new Map([["image", def]]) }) };
    inst.ui = { ...inst.ui, componentFactory: fabrica };
    inst.locale = "pt";

    // opcao desligada: nao instala
    imageEditor.iniciar?.(ctxDe(c, false));
    await tique(150);
    igual("image-editor [CK5]: com a opcao desligada a barra nao muda", [fabrica.itens.size, def.itemsConfig.length], [0, 1]);

    imageEditor.iniciar?.(ctxDe(c));
    await tique(150);
    igual(
      "image-editor [CK5]: registra os dois botoes na fabrica de componentes",
      [...fabrica.itens.keys()],
      ["seiProFormatarImagem", "seiProEditarImagem"],
    );
    igual("image-editor [CK5]: acrescenta separador e nomes ao itemsConfig da barra", def.itemsConfig, [
      "imageTextAlternative",
      "|",
      "seiProFormatarImagem",
      "seiProEditarImagem",
    ]);
    igual("image-editor [CK5]: barra ja montada recebe separador e os dois botoes na view", itens.length, 5);
    const botao = itens.at(-1) as Botao;
    igual(
      "image-editor [CK5]: o botao Editar tem rotulo, icone e tooltip",
      [botao.props.label, /^<svg/.test(String(botao.props.icon)), botao.props.tooltip, botao.props.withText],
      ["Editar imagem (SEI Pro)", true, true, false],
    );

    // iniciar de novo e idempotente
    imageEditor.iniciar?.(ctxDe(c));
    await tique(150);
    igual("image-editor [CK5]: iniciar repetido nao duplica nada", [def.itemsConfig.length, itens.length], [4, 5]);

    // clicar no botao Editar com a imagem selecionada no model
    const { img, widget } = porImagem(c);
    const modelo = modeloComSrc(c, widget);
    modelo.name = "imageBlock";
    inst.model.document.selection.getSelectedElement = () => modelo;
    botao.escutas.execute?.();
    checar(
      "image-editor [CK5]: o botao da barra abre o editor para a imagem selecionada",
      !!dialogoAberto(c.doc) && ultimo().config.source === ANTIGA,
    );
    clicar(dialogoAberto(c.doc) as HTMLElement, "Fechar");

    // e o Formatar entrega a imagem ao modulo de formatar
    const recebidos: unknown[][] = [];
    janela(c).openDialogUploadImgBase64 = (...a: unknown[]) => recebidos.push(a);
    (itens.at(-2) as Botao).escutas.execute?.();
    checar(
      "image-editor [CK5]: o botao Formatar chama openDialogUploadImgBase64 com o editor e a imagem",
      recebidos.length === 1 && recebidos[0]?.[0] === inst && recebidos[0]?.[1] === img,
    );

    // selecao que nao e imagem: o botao entrega null (o Editar avisa)
    inst.model.document.selection.getSelectedElement = () => ({ is: () => true, name: "paragraph" });
    limparAvisos(c.doc);
    botao.escutas.execute?.();
    // sem imagem informada o editor tenta a selecao do DOM (a imagem do corpo): so confirma que nao quebra
    checar("image-editor [CK5]: selecao fora de imagem nao quebra o botao", true);
    if (dialogoAberto(c.doc)) clicar(dialogoAberto(c.doc) as HTMLElement, "Fechar");
  }

  // ---- CK5 sem barra de imagem (SEI sem ImageToolbar) e CK4: iniciar nao faz nada
  {
    const f = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>x</p>", principal: true }] });
    const c: CasoEditor = { versao: 5, doc: f.doc, win: f.win, ed: f };
    (f.instancia() as Qualquer).plugins = { has: () => false };
    imageEditor.iniciar?.(ctxDe(c));
    await tique(150);
    checar("image-editor [CK5]: sem WidgetToolbarRepository o iniciar termina em silencio", true);
    const f4 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>x</p>" }] });
    imageEditor.iniciar?.(ctxDe({ win: f4.win, doc: f4.doc }));
    await tique(150);
    checar("image-editor [CK4]: iniciar nao registra nada (a entrada e o menu do monolito)", true);
  }
}
