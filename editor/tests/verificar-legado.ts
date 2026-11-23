import { abrirHtml, ligar } from "../src/ui/legado";
import { dialogoAberto, usarDocumento } from "./dialogo";
import { checar, igual, instalarDom, secao } from "./util";

type Ev = new (tipo: string, init?: Record<string, unknown>) => Event;

export function verificarLegado(): void {
  secao("ui legado: abrirHtml (ponte do openDialog antigo)");
  const doc = instalarDom();
  usarDocumento(doc);
  const win = doc.defaultView as unknown as Window;
  const E = (win as unknown as { Event: Ev }).Event;
  const log: string[] = [];

  const box = abrirHtml(win, doc, {
    id: "dlgTeste",
    title: "Titulo do modulo",
    width: 700,
    html: '<div class="spro-grupo"><input id="campoX" class="spro-campo"></div><script>x</script><img src="a" onerror="x()"><button onclick="x()" id="b">b</button>',
    buttons: [
      { text: "Aplicar", primary: true, click: (b) => log.push(`aplicar:${(b as HTMLElement).id}`) },
      { text: "Outro", click: () => log.push("outro") },
    ],
    onOpen: (b) => log.push(`abriu:${(b as HTMLElement).id}`),
    onClose: () => log.push("fechou"),
  }) as HTMLElement & { dialog?: (c?: unknown) => unknown };
  const d = dialogoAberto(doc) as HTMLElement;
  checar("abre o dialogo novo (spro-dialogo) com o titulo", !!d && d.querySelector("h2")?.textContent === "Titulo do modulo");
  checar("o corpo leva o id pedido, e o HTML entra", box.id === "dlgTeste" && !!d.querySelector("#dlgTeste #campoX"));
  checar(
    "seguranca: sem <script> e sem atributos on*",
    !d.querySelector("script") && !d.querySelector("[onerror]") && !d.querySelector("[onclick]"),
  );
  igual("largura pedida", /760|700/.test(d.getAttribute("style") ?? ""), true);
  igual("onOpen recebe o $box", log, ["abriu:dlgTeste"]);
  const botoes = [...d.querySelectorAll(".spro-dialogo-rodape button")];
  igual(
    "botoes no rodape; o primario destacado",
    botoes.map((b) => [b.textContent, b.className]),
    [
      ["Aplicar", "spro-botao primario"],
      ["Outro", "spro-botao"],
    ],
  );
  botoes[0]?.dispatchEvent(new E("click", { bubbles: true }));
  igual("clicar chama o gancho com o $box", log.at(-1), "aplicar:dlgTeste");
  checar("nao ha botao Cancelar", !botoes.some((b) => /cancelar/i.test(b.textContent ?? "")));

  // reabrir com o mesmo id fecha o anterior
  abrirHtml(win, doc, { id: "dlgTeste", title: "Outro", html: "<p>2</p>", onClose: () => log.push("fechou2") });
  igual("mesmo id: o anterior fecha e so ha um dialogo", [log.includes("fechou"), doc.querySelectorAll("dialog").length], [true, 1]);

  // $box.dialog('close') (modulos antigos)
  const b3 = abrirHtml(win, doc, { id: "dlg3", html: "<p>3</p>", onClose: () => log.push("fechou3") }) as {
    dialog: (c: string) => unknown;
  };
  b3.dialog("close");
  checar("$box.dialog('close') fecha e avisa", log.includes("fechou3"));
  for (const aberto of doc.querySelectorAll("dialog")) (aberto as unknown as { close(): void }).close();
  checar("nenhum dialogo ficou aberto", !dialogoAberto(doc));

  // botoes no formato objeto do jQuery UI
  abrirHtml(win, doc, { id: "dlg4", html: "<p>4</p>", buttons: { Salvar: () => log.push("salvar") } });
  const dlg4 = dialogoAberto(doc) as HTMLElement;
  (dlg4.querySelector(".spro-dialogo-rodape button") as HTMLElement).dispatchEvent(new E("click", { bubbles: true }));
  igual("botoes em formato objeto (jQuery UI) tambem funcionam", log.at(-1), "salvar");
  (dlg4.querySelector("button[aria-label='Fechar']") as HTMLElement).dispatchEvent(new E("click", { bubbles: true }));

  // ligar: abas, intervalo e cor
  abrirHtml(win, doc, {
    id: "dlg5",
    html:
      '<div data-spro-abas><div role="tablist"><button type="button" role="tab" data-aba="a" aria-selected="true">A</button><button type="button" role="tab" data-aba="b" aria-selected="false">B</button></div><div data-painel="a">pa</div><div data-painel="b">pb</div></div>' +
      '<input type="range" class="spro-intervalo" id="r" min="0" max="10" value="5"><label class="spro-cor"><input type="color" value="#112233"><span class="spro-cor-hex">x</span></label>',
  });
  const e = dialogoAberto(doc) as HTMLElement;
  const abaB = e.querySelector('[data-aba="b"]') as HTMLElement;
  checar(
    "abas: a primeira ativa, a outra oculta",
    !e.querySelector('[data-painel="a"]')?.hasAttribute("hidden") && e.querySelector('[data-painel="b"]')?.hasAttribute("hidden") === true,
  );
  abaB.dispatchEvent(new E("click", { bubbles: true }));
  checar(
    "abas: clicar troca o painel",
    e.querySelector('[data-painel="a"]')?.hasAttribute("hidden") === true &&
      !e.querySelector('[data-painel="b"]')?.hasAttribute("hidden") &&
      abaB.getAttribute("aria-selected") === "true",
  );
  igual("intervalo: --p inicial (5 de 0..10 = 50%)", (e.querySelector("#r") as HTMLElement).style.getPropertyValue("--p"), "50%");
  igual("cor: o codigo aparece", e.querySelector(".spro-cor-hex")?.textContent, "#112233");
  // ligar e idempotente
  ligar(e);
  checar(
    "ligar de novo nao duplica os ouvintes (marca data-spro-ligado)",
    (e.querySelector("#r") as HTMLElement).getAttribute("data-spro-ligado") === "1",
  );
}
