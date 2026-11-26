import { readFileSync } from "node:fs";
import { disparar } from "../../sei-comum/tests/util";
import type { PastaExibida } from "../src/arvore/mesclar";
import type { Vinculo } from "../src/arvore/modelo";
import type { ItemBase } from "../src/nucleo/tipos";
import { lerArrasto, MIME_ARRASTO, serializarArrasto } from "../src/ui/arrasto";
import { montarPainel } from "../src/ui/painel";
import { checar, docDe, teste } from "./util";

const CSS = readFileSync(new URL("../src/ui/painel.css", import.meta.url), "utf8");

const item = (
  agrupador: string,
  titulo: string,
  visualizar = "controlador.php?acao=base_conhecimento_visualizar&id_base_conhecimento=42",
): ItemBase => ({
  agrupador,
  id: agrupador,
  titulo,
  gerador: "usuario.teste",
  dataGeracao: "01/01/2026 10:00:00",
  liberado: true,
  visualizar,
});
const pasta = (id: string, nome: string, filhas: PastaExibida[] = [], contagem = 0): PastaExibida => ({
  id,
  nome,
  pai: null,
  ordem: "a0",
  filhas,
  contagem,
});
const vinculo = (id: string, titulo: string): Vinculo => ({
  id,
  titulo,
  pasta: null,
  ordem: "a0",
  atualizadoEm: 1,
  dispositivo: "d1",
});

function painel() {
  const chamadas: Array<{ acao: string; args: unknown[] }> = [];
  const registrar =
    (acao: string) =>
    (...args: unknown[]) => {
      chamadas.push({ acao, args });
    };
  (globalThis as { document?: Document }).document = docDe("<html><body></body></html>");
  const doc = globalThis.document as Document;
  const p = montarPainel(
    {
      aoSelecionar: registrar("aoSelecionar"),
      aoAlternarPasta: registrar("aoAlternarPasta"),
      aoNovaPasta: registrar("aoNovaPasta"),
      aoRenomear: registrar("aoRenomear"),
      aoExcluir: registrar("aoExcluir"),
      aoMoverPasta: registrar("aoMoverPasta"),
      aoMoverItem: registrar("aoMoverItem"),
      aoRemoverItem: registrar("aoRemoverItem"),
      aoBuscar: registrar("aoBuscar"),
      aoSoltar: registrar("aoSoltar"),
      aoNumerar: registrar("aoNumerar"),
    },
    { doc, css: CSS },
  );
  doc.body.appendChild(p.host);
  return { p, chamadas, raiz: p.host.shadowRoot as unknown as DocumentFragment };
}

const notinhas = pasta("p2", "Notas", [], 1);
const estado = {
  pastas: [pasta("p1", "Fiscalizacao", [notinhas], 0), pasta("p3", "Talentos", [], 0)],
  semPasta: [item("40", "PROCEDIMENTO A")],
  orfaos: [vinculo("99", "ITEM QUE SUMIU")],
  selecionada: "p2",
  busca: "",
  itensPorPasta: {},
  recolhidas: new Set<string>(),
  numerar: false,
};

function porTexto(raiz: DocumentFragment, seletor: string, texto: string): HTMLElement | undefined {
  return [...raiz.querySelectorAll(seletor)].find((e) => e.textContent === texto) as HTMLElement | undefined;
}

await teste("painel renderiza pastas aninhadas, contagens e Sem pasta", () => {
  const { p, raiz } = painel();
  p.render(estado);
  const pastas = [...raiz.querySelectorAll(".pasta")].map((b) => b.textContent ?? "");
  checar("duas raizes", pastas.some((t) => t.startsWith("Fiscalizacao")) && pastas.some((t) => t.startsWith("Talentos")));
  checar("subpasta aninhada", raiz.querySelector(".filhas .pasta")?.textContent?.includes("Notas") === true);
  checar(
    "contagem",
    [...raiz.querySelectorAll(".contagem")].some((c) => c.textContent === "(1)"),
  );
  checar("Sem pasta com item", raiz.querySelector(".item .rotulo")?.textContent === "PROCEDIMENTO A");
});

await teste("com numerar ligado o nome mostra a ordem e o estado nao muda", () => {
  const { p, raiz } = painel();
  const notas = { ...notinhas, pai: "p1" };
  const arvore = [pasta("p1", "Fiscalizacao", [notas], 0)];
  p.render({ ...estado, pastas: arvore, numerar: true });
  const textos = [...raiz.querySelectorAll(".pasta")].map((b) => b.textContent ?? "");
  checar("raiz numerada", textos[0]?.startsWith("1. Fiscalizacao") === true);
  checar("filha numerada", textos[1]?.startsWith("1.1. Notas") === true);
  checar("estado intacto", arvore[0]?.nome === "Fiscalizacao" && notas.nome === "Notas");
});

await teste("pasta selecionada tem aria-current e o botao nova pasta tem rotulo", () => {
  const { p, raiz } = painel();
  p.render(estado);
  checar("aria-current", raiz.querySelector('.pasta[aria-current="true"]')?.textContent?.includes("Notas") === true);
  checar("aria-label do botao", raiz.querySelector('[aria-label="Nova pasta"]') !== null);
});

await teste("icone e decorativo (aria-hidden) e nao e img", () => {
  const { p, raiz } = painel();
  p.render(estado);
  checar("svg aria-hidden", raiz.querySelector('svg[aria-hidden="true"]') !== null);
  checar("nenhuma img", raiz.querySelector("img") === null);
});

await teste("titulo com markup e renderizado como texto puro", () => {
  const { p, raiz } = painel();
  p.render({ ...estado, semPasta: [item("41", "<b>injetado</b>")], orfaos: [] });
  const rotulo = [...raiz.querySelectorAll(".item .rotulo")].find((r) => r.textContent === "<b>injetado</b>");
  checar("texto puro", rotulo !== undefined && rotulo.children.length === 0);
});

await teste("acoes chamam os callbacks certos", () => {
  const { p, chamadas, raiz } = painel();
  p.render(estado);
  const primeiro = raiz.querySelector(".pasta") as HTMLElement;
  disparar(primeiro, "click");
  checar(
    "selecionar",
    chamadas.some((c) => c.acao === "aoSelecionar" && c.args[0] === "p1"),
  );
  disparar(raiz.querySelector('[aria-label="Nova pasta"]') as Element, "click");
  checar(
    "nova pasta na raiz (sem selecao no painel)",
    chamadas.some((c) => c.acao === "aoNovaPasta" && c.args[0] === "p2"),
  );
  disparar(raiz.querySelector('[aria-label="Ações da pasta"]') as Element, "click");
  const excluir = porTexto(raiz, ".acoes button", "Excluir");
  checar("botao excluir existe", excluir !== undefined);
  if (excluir) disparar(excluir, "click");
  checar(
    "excluir chamado",
    chamadas.some((c) => c.acao === "aoExcluir"),
  );
});

await teste("item move e orfao esquece", () => {
  const { p, chamadas, raiz } = painel();
  p.render(estado);
  const mover = [...raiz.querySelectorAll(".item button")].find((b) => b.textContent === "Mover para…") as HTMLElement | undefined;
  checar("botao mover existe", mover !== undefined);
  if (mover) disparar(mover, "click");
  checar(
    "mover item",
    chamadas.some((c) => c.acao === "aoMoverItem" && c.args[0] === "40"),
  );
  const esquecer = porTexto(raiz, "button", "esquecer");
  checar("botao esquecer existe", esquecer !== undefined);
  if (esquecer) disparar(esquecer, "click");
  checar(
    "esquecer orfao",
    chamadas.some((c) => c.acao === "aoRemoverItem" && c.args[0] === "99"),
  );
});

await teste("busca filtra e devolve o texto", () => {
  const { p, chamadas, raiz } = painel();
  p.render(estado);
  const busca = raiz.querySelector("input") as HTMLInputElement;
  busca.value = "Tal";
  disparar(busca, "input");
  checar(
    "buscar chamado",
    chamadas.some((c) => c.acao === "aoBuscar" && c.args[0] === "Tal"),
  );
});

await teste("destruir remove o host e o css tem alvo de 44px e tokens aprovados", () => {
  const { p } = painel();
  p.destruir();
  checar("host removido", p.host.parentNode === null);
  checar("min-height 44", CSS.includes("min-height: 44px"));
  checar("token de texto", CSS.includes("#212529"));
  checar("token de azul SEI", CSS.includes("#155f9b"));
});

await teste("aviso de indisponivel aparece como status", () => {
  const { p, raiz } = painel();
  p.render({ ...estado, aviso: "Indisponível nesta unidade." });
  checar("aviso", raiz.querySelector('.aviso[role="status"]')?.textContent === "Indisponível nesta unidade.");
});

await teste("pasta recolhida esconde filhos e o chevron alterna sem selecionar", () => {
  const { p, chamadas, raiz } = painel();
  p.render({ ...estado, recolhidas: new Set(["p1"]) });
  checar("sem filhos visiveis", raiz.querySelector(".filhas .pasta") === null);
  const chevron = raiz.querySelector('[aria-label="Expandir pasta Fiscalizacao"]');
  checar("chevron existe", chevron !== null);
  checar("aria-expanded false", chevron?.getAttribute("aria-expanded") === "false");
  if (chevron) disparar(chevron, "click");
  checar(
    "alterna sem selecionar",
    chamadas.some((c) => c.acao === "aoAlternarPasta" && c.args[0] === "p1"),
  );
  checar("nao selecionou", !chamadas.some((c) => c.acao === "aoSelecionar"));
});

await teste("pasta expandida mostra aria-expanded true e rotulo de recolher", () => {
  const { p, raiz } = painel();
  p.render({ ...estado, recolhidas: new Set() });
  const chevron = raiz.querySelector(`[aria-label="Recolher pasta Fiscalizacao"]`);
  checar("filhos visiveis", raiz.querySelector(".filhas .pasta") !== null);
  checar("aria-expanded true", chevron?.getAttribute("aria-expanded") === "true");
});

await teste("documentos dentro da pasta aparecem com link para o SEI", () => {
  const { p, chamadas, raiz } = painel();
  p.render({
    ...estado,
    selecionada: "p3",
    itensPorPasta: { p3: [item("50", "DOC DA PASTA")] },
  });
  const link = [...raiz.querySelectorAll(".filhas.itens .item a.rotulo")].find(
    (a) => a.textContent === "DOC DA PASTA",
  ) as HTMLAnchorElement;
  checar("link do documento", link !== undefined);
  checar("href do visualizar", (link?.getAttribute("href") ?? "").includes("base_conhecimento_visualizar"));
  checar("nova aba", link?.getAttribute("target") === "_blank");
  const mover = [...raiz.querySelectorAll(".filhas.itens .item button")].find((b) => b.textContent === "Mover para…") as HTMLElement;
  checar("mover no documento da pasta", mover !== undefined);
  if (mover) disparar(mover, "click");
  checar(
    "move documento da pasta",
    chamadas.some((c) => c.acao === "aoMoverItem" && c.args[0] === "50"),
  );
});

function eventoCom(el: Element, tipo: string, extra: Record<string, unknown>): Event {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  const ev = new Ev(tipo, { bubbles: true, cancelable: true });
  Object.assign(ev, extra);
  return ev;
}

function dtFake(mime = MIME_ARRASTO, valor = ""): DataTransfer {
  const dados: Record<string, string> = {};
  if (mime) dados[mime] = valor;
  return {
    setData: (t: string, v: string) => {
      dados[t] = v;
    },
    getData: (t: string) => dados[t] ?? "",
  } as unknown as DataTransfer;
}

await teste("pastas e documentos sao arrastaveis e pastas aceitam soltar", () => {
  const { p, chamadas, raiz } = painel();
  p.render({ ...estado, itensPorPasta: { p1: [item("41", "DOC")] }, recolhidas: new Set() });

  const fiscal = [...raiz.querySelectorAll(".pasta")].find((b) => b.textContent?.startsWith("Fiscalizacao")) as HTMLElement;
  checar("pasta arrastavel", fiscal.getAttribute("draggable") === "true");
  const dt = dtFake();
  fiscal.dispatchEvent(eventoCom(fiscal, "dragstart", { dataTransfer: dt }));
  checar("payload da pasta", lerArrasto(dt)?.tipo === "pasta");

  const itemEl = raiz.querySelector(".filhas.itens .item") as HTMLElement;
  checar("documento arrastavel", itemEl.getAttribute("draggable") === "true");
  const dtItem = dtFake();
  itemEl.dispatchEvent(eventoCom(itemEl, "dragstart", { dataTransfer: dtItem }));
  checar("payload do documento", lerArrasto(dtItem)?.tipo === "item");

  const talentos = [...raiz.querySelectorAll(".pasta")].find((b) => b.textContent?.startsWith("Talentos")) as HTMLElement;
  const linha = talentos.parentElement as HTMLElement;
  const over = eventoCom(linha, "dragover", { dataTransfer: dtFake() });
  linha.dispatchEvent(over);
  checar("dragover impede o padrao e marca alvo", over.defaultPrevented && linha.classList.contains("alvo"));

  const drop = eventoCom(linha, "drop", { dataTransfer: dtFake(MIME_ARRASTO, serializarArrasto({ tipo: "item", agrupador: "40" })) });
  linha.dispatchEvent(drop);
  checar(
    "soltou item na pasta",
    chamadas.some((c) => c.acao === "aoSoltar" && c.args[1] === "p3"),
  );
  checar("destaque removido", !linha.classList.contains("alvo"));
});

await teste("Sem pasta aceita soltar pasta", () => {
  const { p, chamadas, raiz } = painel();
  p.render(estado);
  const sem = raiz.querySelector(".sem-pasta") as HTMLElement;
  const linha = sem.parentElement as HTMLElement;
  linha.dispatchEvent(eventoCom(linha, "drop", { dataTransfer: dtFake(MIME_ARRASTO, serializarArrasto({ tipo: "pasta", id: "p1" })) }));
  checar(
    "destino nulo",
    chamadas.some((c) => c.acao === "aoSoltar" && c.args[1] === null),
  );
});

await teste("menu da pasta tem Mover para e chama aoMoverPasta", () => {
  const { p, chamadas, raiz } = painel();
  p.render(estado);
  const menu = raiz.querySelector('[aria-label="Ações da pasta"]') as HTMLElement;
  menu.click();
  const mover = [...raiz.querySelectorAll(".acoes button")].find((b) => b.textContent === "Mover para…") as HTMLElement;
  checar("botao mover pasta", mover !== undefined);
  if (mover) disparar(mover, "click");
  checar(
    "chamou aoMoverPasta",
    chamadas.some((c) => c.acao === "aoMoverPasta" && c.args[0] === "p1"),
  );
  checar("data-pasta-id no chevron", raiz.querySelector('[data-pasta-id="p1"].chevron') !== null);
});

await teste("busca por documento mantem a pasta que o contem", () => {
  const { p, raiz } = painel();
  p.render({
    ...estado,
    busca: "PROCEDIMENTO B",
    recolhidas: new Set<string>(),
    itensPorPasta: { p2: [item("41", "PROCEDIMENTO B")] },
  });
  const pastas = [...raiz.querySelectorAll(".pasta")].map((b) => b.textContent ?? "");
  checar(
    "pasta com documento aparece",
    pastas.some((t) => t.startsWith("Fiscalizacao")),
  );
  checar(
    "filha com o documento aparece",
    pastas.some((t) => t.startsWith("Notas")),
  );
  checar("pasta sem correspondencia some", !pastas.some((t) => t.startsWith("Talentos")));
});

await teste("painel tem o interruptor de numerar refletindo o estado", () => {
  const { p, chamadas, raiz } = painel();
  p.render({ ...estado, numerar: true });
  const caixa = raiz.querySelector(".numerar input") as HTMLInputElement;
  checar("marcado quando ligado", caixa?.checked === true);
  caixa.checked = false;
  disparar(caixa, "change");
  checar(
    "callback recebe o novo valor",
    chamadas.some((c) => c.acao === "aoNumerar" && c.args[0] === false),
  );
});
