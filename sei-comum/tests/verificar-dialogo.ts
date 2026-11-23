import { baixar, criarAbrirModal, criarConfirmar, escolherArquivo } from "../src/ui/dialogo";
import { h } from "../src/ui/dom";
import { botao, checar, disparar, instalarDom, secao, tique } from "./util";

type Proto = Record<string, unknown>;

/** `<dialog>` do navegador: o linkedom não tem showModal/close/open (o protótipo é o de todo elemento). */
function fingirDialogos(doc: Document): () => void {
  const proto = Object.getPrototypeOf(doc.createElement("dialog")) as Proto;
  const Ev = (doc.defaultView as unknown as { Event: typeof Event }).Event;
  proto.showModal = function (this: HTMLElement) {
    this.setAttribute("open", "");
  };
  proto.close = function (this: HTMLElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Ev("close"));
  };
  Object.defineProperty(proto, "open", {
    configurable: true,
    get(this: HTMLElement) {
      return this.hasAttribute("open");
    },
  });
  return () => {
    for (const k of ["showModal", "close", "open"]) Reflect.deleteProperty(proto, k);
  };
}

export async function verificarDialogo(): Promise<void> {
  secao("dialogo: abrir e fechar");
  const doc = instalarDom();
  const restaurar = fingirDialogos(doc);
  const ganchos: string[] = [];
  const abrirModal = criarAbrirModal({ aoAbrir: () => ganchos.push("abriu"), aoFechar: () => ganchos.push("fechou") });
  const campo = h("input", { type: "text" });
  let focado = false;
  campo.focus = () => {
    focado = true;
  };
  let fechouNoApp = 0;
  const hostil = '<img src=x onerror="alert(1)">';
  const m = abrirModal({ titulo: hostil, conteudo: h("div", {}, campo), icone: "nuvem", aoFechar: () => fechouNoApp++ });
  const dlg = doc.querySelector("dialog.spro-dialogo");
  checar("abre um dialog modal no body", dlg?.hasAttribute("open") === true && dlg.parentElement === doc.body);
  checar("titulo hostil aparece como texto", dlg?.querySelector("h2")?.textContent === hostil && !dlg.querySelector("img"));
  checar("rotulo acessivel e icone", dlg?.getAttribute("aria-label") === hostil && !!dlg.querySelector(".spro-dialogo-icone svg"));
  checar("foco no primeiro campo do corpo", focado);
  checar("gancho de abrir antes de mostrar", ganchos.join() === "abriu");
  m.fechar();
  checar(
    "fechar tira da pagina e avisa o painel e o app",
    !doc.querySelector("dialog") && ganchos.join() === "abriu,fechou" && fechouNoApp === 1,
  );
  m.fechar();
  checar("fechar de novo nao faz nada", fechouNoApp === 1);
  abrirModal({ titulo: "X", conteudo: h("p", {}, "oi") });
  botao(doc.body, "Fechar")!.click();
  checar("o X do cabecalho fecha", !doc.querySelector("dialog"));
  const largo = abrirModal({ titulo: "Largo", conteudo: h("p", {}, "oi"), largura: 760 });
  checar("largura: o dialogo usa a largura pedida, limitada a tela", /min\(760px,\s*calc\(100vw - 24px\)\)/.test(doc.querySelector("dialog")?.getAttribute("style") ?? ""));
  largo.fechar();
  abrirModal({ titulo: "Padrao", conteudo: h("p", {}, "oi") });
  checar("sem largura pedida, o dialogo fica com a largura do CSS", !doc.querySelector("dialog")?.getAttribute("style"));
  botao(doc.body, "Fechar")!.click();

  secao("dialogo: confirmar");
  const confirmar = criarConfirmar(abrirModal);
  const sim = confirmar("Apagar o projeto?", "Apagar");
  botao(doc.body, "Apagar")!.click();
  checar("botao de confirmar (rotulo proprio): true", (await sim) === true && !doc.querySelector("dialog"));
  const nao = confirmar("Apagar?");
  botao(doc.body, "Cancelar")!.click();
  checar("cancelar: false", (await nao) === false);
  const esc = confirmar("Apagar?");
  (doc.querySelector("dialog") as HTMLDialogElement).close();
  checar("Esc (close do navegador): false", (await esc) === false);
  const padrao = confirmar("Texto <b>do</b> usuario");
  checar(
    "rotulo padrao Confirmar, texto como texto",
    !!botao(doc.body, "Confirmar") && doc.querySelector("dialog p")?.textContent === "Texto <b>do</b> usuario",
  );
  checar("padrao continua Cancelar no botao de desistir", !!botao(doc.body, "Cancelar") && !botao(doc.body, "Voltar"));
  botao(doc.body, "Confirmar")!.click();
  await padrao;
  const volta = confirmar("Cancelar a assinatura de 1 documento?", "Executar", "Voltar");
  checar("rotulo proprio do botao de desistir", !!botao(doc.body, "Voltar") && !botao(doc.body, "Cancelar"));
  botao(doc.body, "Voltar")!.click();
  checar("Voltar: false", (await volta) === false && !doc.querySelector("dialog"));
  restaurar();

  secao("dialogo: baixar e escolher arquivo");
  const docB = instalarDom();
  const urlOriginal = { criar: URL.createObjectURL, revogar: URL.revokeObjectURL };
  const blobs: Blob[] = [];
  const revogados: string[] = [];
  URL.createObjectURL = (b: Blob | MediaSource) => {
    blobs.push(b as Blob);
    return "blob:teste/1";
  };
  URL.revokeObjectURL = (u: string) => {
    revogados.push(u);
  };
  let anchor: HTMLAnchorElement | null = null;
  let cliques = 0;
  const anexar = docB.body.append.bind(docB.body);
  docB.body.append = (...nos: Array<Node | string>) => {
    anchor = nos[0] as HTMLAnchorElement;
    anchor.addEventListener("click", () => cliques++);
    anexar(...nos);
  };
  baixar("projetos.csv", "a;b", "text/csv;charset=utf-8", 5);
  const a = anchor as HTMLAnchorElement | null;
  checar(
    "link com o nome e o endereco do blob, clicado e retirado",
    a?.getAttribute("download") === "projetos.csv" && a.getAttribute("href") === "blob:teste/1" && cliques === 1 && !a.isConnected,
  );
  checar("conteudo e tipo", (await blobs[0]?.text()) === "a;b" && blobs[0]?.type === "text/csv;charset=utf-8");
  await tique(20);
  checar("libera o endereco depois", revogados.join() === "blob:teste/1");
  URL.createObjectURL = urlOriginal.criar;
  URL.revokeObjectURL = urlOriginal.revogar;

  const proto = Object.getPrototypeOf(docB.createElement("input")) as Proto;
  const cliqueOriginal = proto.click;
  let entrada: HTMLInputElement | null = null;
  proto.click = function (this: HTMLElement) {
    if (this.localName === "input") entrada = this as HTMLInputElement;
  };
  const escolhido = escolherArquivo(".json");
  const i = entrada as HTMLInputElement | null;
  checar("input de arquivo com o filtro pedido", i?.getAttribute("type") === "file" && i.getAttribute("accept") === ".json");
  if (i) {
    Object.defineProperty(i, "files", { value: [{ text: async () => '{"ok":true}' }] });
    disparar(i, "change");
  }
  checar("devolve o texto do arquivo", (await escolhido) === '{"ok":true}');
  const cancelado = escolherArquivo();
  if (entrada) disparar(entrada as HTMLInputElement, "cancel");
  checar("cancelar: null", (await cancelado) === null);
  proto.click = cliqueOriginal;
}
