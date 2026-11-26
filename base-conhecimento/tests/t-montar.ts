import { areaMemoria } from "@comum/armazenamento/area";
import type { ArmazemTexto } from "@comum/sincronia/controlePagina";
import { disparar } from "../../sei-comum/tests/util";
import { itensDaPagina } from "../src/nucleo/itens";
import { consentimentoBase } from "../src/pagina/consentir";
import { type DepsMontar, montar, quandoDomPronto, telaAtual } from "../src/pagina/montar";
import { CHAVE_INTENCAO, gravarIntencao } from "../src/pagina/novaEmContexto";
import { MIME_ARRASTO, type PayloadArrasto, serializarArrasto } from "../src/ui/arrasto";
import type { AcaoAviso } from "../src/ui/aviso";
import { checar, docFixture, paginaFixture, teste } from "./util";

const URL_RETORNO =
  "https://sei.exemplo.gov.br/sei/controlador.php?acao=base_conhecimento_listar&acao_origem=base_conhecimento_cadastrar&id_base_conhecimento=42&resultado=1";

const IDENT = { host: "sei.exemplo.gov.br", unidade: "110000108" };
const URL_LISTAR = "https://sei.exemplo.gov.br/sei/controlador.php?acao=base_conhecimento_listar";

function armazemVazio(): ArmazemTexto {
  return {
    async ler() {
      return null;
    },
    async gravar() {},
    async gravarConferindo() {
      return { gravado: true };
    },
    async localizar() {
      return null;
    },
    async excluir() {
      return false;
    },
  };
}

function deps(over: Partial<DepsMontar> = {}): DepsMontar {
  return {
    doc: docFixture("base_conhecimento_listar.html"),
    url: URL_LISTAR,
    area: areaMemoria(),
    sync: areaMemoria(),
    ident: IDENT,
    contexto: { login: "usuario.teste", nome: "Fulano de Tal", unidade: { id: IDENT.unidade, sigla: "Sinst" } },
    lerItens: async () => itensDaPagina(paginaFixture("base_conhecimento_listar.html")),
    armazem: () => armazemVazio(),
    perguntar: async () => true,
    pedirTexto: async () => "Fiscalizacao",
    confirmar: async () => true,
    escolherPasta: async () => ({ pasta: null }),
    avisar: () => {},
    idDispositivo: "d1",
    cssPainel: "",
    numerar: false,
    janela: new EventTarget(),
    docEventos: Object.assign(new EventTarget(), { visibilityState: "visible" as DocumentVisibilityState }),
    agora: () => 100,
    ...over,
  };
}

const sombra = (doc: Document): DocumentFragment =>
  (doc.querySelector(".spro-bc-host") as HTMLElement).shadowRoot as unknown as DocumentFragment;

async function esperar(): Promise<void> {
  for (let i = 0; i < 10; i++) await new Promise((r) => setTimeout(r, 0));
}

await teste("telaAtual identifica as telas certas", () => {
  checar("listar", telaAtual(URL_LISTAR) === "listar");
  checar("pesquisar", telaAtual("https://sei.exemplo.gov.br/sei/controlador.php?acao=base_conhecimento_pesquisar") === "pesquisar");
  checar("outra", telaAtual("https://sei.exemplo.gov.br/sei/controlador.php?acao=procedimento_controlar") === null);
  checar("cadastrar", telaAtual("https://sei.exemplo.gov.br/sei/controlador.php?acao=base_conhecimento_cadastrar") === "cadastrar");
  checar("sem url", telaAtual("nao-e-url") === null);
});

await teste("montar pinta painel, coluna, botao e caption da tela", async () => {
  const d = deps();
  const desfazer = await montar(d);
  checar("painel", d.doc.querySelector(".spro-bc-host") !== null);
  const ths = [...d.doc.querySelectorAll("table.infraTable thead th")].map((t) => (t.textContent ?? "").trim());
  checar("coluna pasta", ths[1] === "Pasta");
  checar("botao pastas", d.doc.querySelector("#btnSproPastas") !== null);
  checar("caption", (d.doc.querySelector("caption.infraCaption")?.textContent ?? "").endsWith("(3 registros):"));
  desfazer();
  checar("painel removido", d.doc.querySelector(".spro-bc-host") === null);
  checar("botao removido", d.doc.querySelector("#btnSproPastas") === null);
});

await teste("montar devolve a tela nativa quando a leitura falha", async () => {
  const d = deps({
    lerItens: async () => {
      throw new Error("sem lista");
    },
  });
  const desfazer = await montar(d);
  checar("sem painel", d.doc.querySelector(".spro-bc-host") === null);
  desfazer();
});

await teste("nova pasta pede o Entendi, aparece na arvore e avisa", async () => {
  const avisos: string[] = [];
  const d = deps({ avisar: (t) => avisos.push(t) });
  const desfazer = await montar(d);
  const s = sombra(d.doc);
  disparar(s.querySelector('[aria-label="Nova pasta"]') as Element, "click");
  await esperar();
  checar(
    "pasta criada",
    [...s.querySelectorAll(".pasta")].some((b) => b.textContent?.startsWith("Fiscalizacao")),
  );
  checar("consentimento ligado", (await consentimentoBase(d.sync, IDENT.host, "usuario.teste", IDENT.unidade).estado()) === "ligado");
  checar("aviso de sucesso", avisos.includes("Pasta criada."));
  desfazer();
});

await teste("sem o Entendi nao cria pasta", async () => {
  const d = deps({ perguntar: async () => false });
  const desfazer = await montar(d);
  const s = sombra(d.doc);
  disparar(s.querySelector('[aria-label="Nova pasta"]') as Element, "click");
  await esperar();
  checar("nenhuma pasta", s.querySelectorAll(".pasta:not(.sem-pasta)").length === 0);
  checar("consentimento nao ligado", (await consentimentoBase(d.sync, IDENT.host, "usuario.teste", IDENT.unidade).estado()) !== "ligado");
  desfazer();
});

await teste("quandoDomPronto espera o DOMContentLoaded quando a pagina esta carregando", () => {
  let chamou = 0;
  const ouvintes: Array<() => void> = [];
  const doc = {
    readyState: "loading",
    addEventListener: (tipo: string, fn: () => void) => {
      if (tipo === "DOMContentLoaded") ouvintes.push(fn);
    },
  } as unknown as Pick<Document, "readyState" | "addEventListener">;
  quandoDomPronto(doc, () => chamou++);
  checar("nao roda antes", chamou === 0);
  for (const f of ouvintes) f();
  checar("roda depois", chamou === 1);
  let direto = 0;
  const pronto = { readyState: "complete", addEventListener: () => undefined } as unknown as Pick<
    Document,
    "readyState" | "addEventListener"
  >;
  quandoDomPronto(pronto, () => direto++);
  checar("roda na hora quando pronta", direto === 1);
});

await teste("vinculo mais recente para pasta removida nao derruba a montagem", async () => {
  const d = deps();
  await d.area.gravar({
    "base-conhecimento/pastas/p1": { id: "p1", nome: "Antiga", pai: null, ordem: "a0", atualizadoEm: 1, dispositivo: "d1", removidoEm: 2 },
    "base-conhecimento/vinculos/40": { id: "40", titulo: "TITULO ANTIGO", pasta: "p1", ordem: "a0", atualizadoEm: 9, dispositivo: "d1" },
  });
  const desfazer = await montar(d);
  const s = sombra(d.doc);
  checar("painel montou", s.querySelector(".pasta") !== null);
  checar(
    "item caiu em Sem pasta",
    [...s.querySelectorAll(".item .rotulo")].some((r) => r.textContent === "PROCEDIMENTO DE EXEMPLO A"),
  );
  const vinculo = (await d.area.obter("base-conhecimento/vinculos/40"))["base-conhecimento/vinculos/40"] as {
    pasta: string | null;
    titulo: string;
  };
  checar("vinculo corrigido para Sem pasta", vinculo.pasta === null && vinculo.titulo === "PROCEDIMENTO DE EXEMPLO A");
  desfazer();
});

await teste("arvore recebida por sincronia aparece sem recarregar", async () => {
  const d = deps();
  const desfazer = await montar(d);
  await d.area.gravar({
    "base-conhecimento/pastas/p9": { id: "p9", nome: "Chegou de fora", pai: null, ordem: "a0", atualizadoEm: 50, dispositivo: "dX" },
  });
  await esperar();
  checar(
    "pasta nova na arvore",
    [...sombra(d.doc).querySelectorAll(".pasta")].some((b) => b.textContent?.startsWith("Chegou de fora")),
  );
  desfazer();
});

await teste("status indisponivel mostra aviso e bloqueia escrita", async () => {
  const avisos: string[] = [];
  const d = deps({ avisar: (t) => avisos.push(t) });
  await d.area.gravar({
    "base-conhecimento/sync/tp/unidade": { estado: "indisponivel", quando: 1, pendente: false, mensagem: "Indisponível nesta unidade." },
  });
  const desfazer = await montar(d);
  const s = sombra(d.doc);
  checar("aviso visivel", s.querySelector(".aviso")?.textContent === "Indisponível nesta unidade.");
  disparar(s.querySelector('[aria-label="Nova pasta"]') as Element, "click");
  await esperar();
  checar("nenhuma pasta criada", s.querySelectorAll(".pasta:not(.sem-pasta)").length === 0);
  checar("aviso ao tentar escrever", avisos.length >= 1);
  desfazer();
});

await teste("desfazer devolve a tabela nativa (sem a coluna Pasta)", async () => {
  const d = deps();
  const antes = d.doc.querySelectorAll("table.infraTable thead th").length;
  const desfazer = await montar(d);
  desfazer();
  checar("th removido", d.doc.querySelectorAll("table.infraTable thead th").length === antes);
  checar("sem celulas", d.doc.querySelectorAll(".spro-cel-pasta").length === 0);
  checar("sem marcas", d.doc.querySelectorAll("[data-spro-agrupador]").length === 0);
});

await teste("mover item para a pasta e lista-lo na pasta selecionada", async () => {
  const d = deps({
    escolherPasta: async (pastas) => ({ pasta: pastas[0]?.id ?? null }),
  });
  const desfazer = await montar(d);
  const s = sombra(d.doc);
  disparar(s.querySelector('[aria-label="Nova pasta"]') as Element, "click");
  await esperar();
  const acharPasta = (): Element | undefined =>
    [...s.querySelectorAll(".pasta:not(.sem-pasta)")].find((b) => b.textContent?.startsWith("Fiscalizacao"));
  checar("pasta criada", acharPasta() !== undefined);
  const mover = [...s.querySelectorAll(".item button")].find((b) => b.textContent === "Mover para…") as Element | undefined;
  checar("mover disponivel para item sem pasta", mover !== undefined);
  if (mover) disparar(mover, "click");
  await esperar();
  const pasta = acharPasta();
  if (pasta) disparar(pasta, "click");
  await esperar();
  checar(
    "item listado dentro da pasta",
    [...s.querySelectorAll(".filhas.itens .item .rotulo")].some((r) => r.textContent === "PROCEDIMENTO DE EXEMPLO A"),
  );
  checar("caption com 1 registro", (d.doc.querySelector("caption.infraCaption")?.textContent ?? "").endsWith("(1 registro):"));
  desfazer();
});

await teste("pastas existentes comecam recolhidas", async () => {
  const d = deps();
  await d.area.gravar({
    "base-conhecimento/pastas/p1": { id: "p1", nome: "Fiscalizacao", pai: null, ordem: "a0", atualizadoEm: 1, dispositivo: "d1" },
    "base-conhecimento/vinculos/40": {
      id: "40",
      titulo: "PROCEDIMENTO DE EXEMPLO A",
      pasta: "p1",
      ordem: "a0",
      atualizadoEm: 2,
      dispositivo: "d1",
    },
  });
  const desfazer = await montar(d);
  const s = sombra(d.doc);
  const chevron = s.querySelector('[aria-label="Expandir pasta Fiscalizacao"]');
  checar("chegou recolhida", chevron?.getAttribute("aria-expanded") === "false");
  checar("item nao aparece na arvore recolhida", s.querySelector(".filhas.itens") === null);
  desfazer();
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

function soltar(el: Element, payload: PayloadArrasto): void {
  el.dispatchEvent(eventoCom(el, "drop", { dataTransfer: dtFake(MIME_ARRASTO, serializarArrasto(payload)) }));
}

function linhaDaPasta(doc: Document, nome: string): HTMLElement | undefined {
  const s = sombra(doc);
  const b = [...s.querySelectorAll(".pasta")].find((x) => x.textContent?.startsWith(nome)) as HTMLElement | undefined;
  return b?.parentElement as HTMLElement | undefined;
}

async function chavesDaArea(area: import("@comum/armazenamento/area").Area): Promise<string[]> {
  return (await area.chaves?.()) ?? Object.keys(await area.obter(null));
}

await teste("soltar item confirma com titulo e caminho e move", async () => {
  const textos: string[] = [];
  const d = deps({
    confirmar: async (t) => {
      textos.push(t);
      return true;
    },
  });
  await d.area.gravar({
    "base-conhecimento/pastas/p1": { id: "p1", nome: "Fiscalizacao", pai: null, ordem: "a0", atualizadoEm: 1, dispositivo: "d1" },
  });
  const desfazer = await montar(d);
  const linha = linhaDaPasta(d.doc, "Fiscalizacao");
  checar("linha existe", linha !== undefined);
  if (linha) soltar(linha, { tipo: "item", agrupador: "40" });
  await esperar();
  checar(
    "confirmou com titulo e caminho",
    textos.some((t) => t.includes("PROCEDIMENTO DE EXEMPLO A") && t.includes("Fiscalizacao")),
  );
  const vinculo = (await d.area.obter("base-conhecimento/vinculos/40"))["base-conhecimento/vinculos/40"] as
    | { pasta: string | null }
    | undefined;
  checar("vinculo movido", vinculo?.pasta === "p1");
  desfazer();
});

await teste("soltar pasta enfatiza que e pasta e move com confirmacao", async () => {
  const textos: string[] = [];
  const d = deps({
    confirmar: async (t) => {
      textos.push(t);
      return true;
    },
  });
  await d.area.gravar({
    "base-conhecimento/pastas/p1": { id: "p1", nome: "Pai", pai: null, ordem: "a0", atualizadoEm: 1, dispositivo: "d1" },
    "base-conhecimento/pastas/p2": { id: "p2", nome: "Filha", pai: null, ordem: "a1", atualizadoEm: 2, dispositivo: "d1" },
  });
  const desfazer = await montar(d);
  const linhaPai = linhaDaPasta(d.doc, "Pai");
  checar("linha pai", linhaPai !== undefined);
  if (linhaPai) soltar(linhaPai, { tipo: "pasta", id: "p2" });
  await esperar();
  checar(
    "texto enfatiza pasta",
    textos.some((t) => t.includes("PASTA") && t.includes("Filha")),
  );
  const p2 = (await d.area.obter("base-conhecimento/pastas/p2"))["base-conhecimento/pastas/p2"] as { pai: string | null } | undefined;
  checar("pai aplicado", p2?.pai === "p1");
  desfazer();
});

await teste("cancelar a confirmacao nao move", async () => {
  const d = deps({ confirmar: async () => false });
  await d.area.gravar({
    "base-conhecimento/pastas/p1": { id: "p1", nome: "Fiscalizacao", pai: null, ordem: "a0", atualizadoEm: 1, dispositivo: "d1" },
  });
  const desfazer = await montar(d);
  const linha = linhaDaPasta(d.doc, "Fiscalizacao");
  if (linha) soltar(linha, { tipo: "item", agrupador: "40" });
  await esperar();
  checar("sem vinculo", (await d.area.obter("base-conhecimento/vinculos/40"))["base-conhecimento/vinculos/40"] === undefined);
  desfazer();
});

await teste("pasta em descendente e recusada com aviso", async () => {
  const avisos: string[] = [];
  let confirmou = 0;
  const d = deps({
    avisar: (t) => avisos.push(t),
    confirmar: async () => {
      confirmou++;
      return true;
    },
  });
  await d.area.gravar({
    "base-conhecimento/pastas/p1": { id: "p1", nome: "Pai", pai: null, ordem: "a0", atualizadoEm: 1, dispositivo: "d1" },
    "base-conhecimento/pastas/p2": { id: "p2", nome: "Filha", pai: "p1", ordem: "a0", atualizadoEm: 2, dispositivo: "d1" },
  });
  const desfazer = await montar(d);
  const s = sombra(d.doc);
  const chevron = s.querySelector('[aria-label="Expandir pasta Pai"]') as Element | null;
  checar("pai recolhido", chevron !== null);
  if (chevron) disparar(chevron, "click");
  await esperar();
  const linhaFilha = linhaDaPasta(d.doc, "Filha");
  checar("filha visivel", linhaFilha !== undefined);
  if (linhaFilha) soltar(linhaFilha, { tipo: "pasta", id: "p1" });
  await esperar();
  checar("avisou", avisos.length >= 1);
  checar("nao confirmou", confirmou === 0);
  const p1 = (await d.area.obter("base-conhecimento/pastas/p1"))["base-conhecimento/pastas/p1"] as { pai: string | null } | undefined;
  checar("pai intacto", p1?.pai === null);
  desfazer();
});

await teste("nova pasta nasce filha da selecionada e expande o pai", async () => {
  const d = deps({ pedirTexto: async () => "Filha" });
  await d.area.gravar({
    "base-conhecimento/pastas/p1": { id: "p1", nome: "Pai", pai: null, ordem: "a0", atualizadoEm: 1, dispositivo: "d1" },
  });
  const desfazer = await montar(d);
  const s = sombra(d.doc);
  const botao = [...s.querySelectorAll(".pasta")].find((b) => b.textContent?.startsWith("Pai")) as Element;
  disparar(botao, "click");
  await esperar();
  disparar(s.querySelector('[aria-label="Nova pasta"]') as Element, "click");
  await esperar();
  const chave = (await chavesDaArea(d.area)).find((k) => k.startsWith("base-conhecimento/pastas/") && k !== "base-conhecimento/pastas/p1");
  checar("nova pasta criada", chave !== undefined);
  const nova = (await d.area.obter(chave ?? ""))[chave ?? ""] as { pai: string | null; nome: string } | undefined;
  checar("filha de p1", nova?.pai === "p1" && nova?.nome === "Filha");
  checar("pai expandido", s.querySelector('[aria-label="Recolher pasta Pai"]') !== null);
  desfazer();
});

await teste("menu Mover para da pasta move com confirmacao de pasta", async () => {
  const textos: string[] = [];
  const d = deps({
    escolherPasta: async () => ({ pasta: "p1" }),
    confirmar: async (t) => {
      textos.push(t);
      return true;
    },
  });
  await d.area.gravar({
    "base-conhecimento/pastas/p1": { id: "p1", nome: "Pai", pai: null, ordem: "a0", atualizadoEm: 1, dispositivo: "d1" },
    "base-conhecimento/pastas/p2": { id: "p2", nome: "Filha", pai: null, ordem: "a1", atualizadoEm: 2, dispositivo: "d1" },
  });
  const desfazer = await montar(d);
  const s = sombra(d.doc);
  const filha = [...s.querySelectorAll(".pasta")].find((b) => b.textContent?.startsWith("Filha")) as HTMLElement;
  const li = filha.closest("li") as HTMLElement;
  const menu = li.querySelector('[aria-label="Ações da pasta"]') as HTMLElement;
  menu.click();
  const mover = [...li.querySelectorAll(".acoes button")].find((b) => b.textContent === "Mover para…") as HTMLElement;
  checar("botao mover existe", mover !== undefined);
  if (mover) disparar(mover, "click");
  await esperar();
  checar(
    "confirmou pasta",
    textos.some((t) => t.includes("PASTA") && t.includes("Filha")),
  );
  const p2 = (await d.area.obter("base-conhecimento/pastas/p2"))["base-conhecimento/pastas/p2"] as { pai: string | null } | undefined;
  checar("moveu via menu", p2?.pai === "p1");
  desfazer();
});

await teste("numerar ligado chega ao painel e ao dialogo, sem gravar numeros", async () => {
  const numerarRecebido: Array<boolean | undefined> = [];
  const d = deps({
    numerar: true,
    escolherPasta: async (_pastas, _atual, numerar) => {
      numerarRecebido.push(numerar);
      return null;
    },
  });
  await d.area.gravar({
    "base-conhecimento/pastas/p1": { id: "p1", nome: "Fiscalizacao", pai: null, ordem: "a0", atualizadoEm: 1, dispositivo: "d1" },
    "base-conhecimento/pastas/p2": { id: "p2", nome: "Talentos", pai: null, ordem: "a1", atualizadoEm: 2, dispositivo: "d1" },
  });
  const desfazer = await montar(d);
  const s = sombra(d.doc);
  const textos = [...s.querySelectorAll(".pasta")].map((b) => b.textContent ?? "");
  checar(
    "primeira raiz numerada",
    textos.some((t) => t.startsWith("1. Fiscalizacao")),
  );
  checar(
    "segunda raiz numerada",
    textos.some((t) => t.startsWith("2. Talentos")),
  );
  const gravada = (await d.area.obter("base-conhecimento/pastas/p1"))["base-conhecimento/pastas/p1"] as { nome?: string } | undefined;
  checar("dado gravado sem numero", gravada?.nome === "Fiscalizacao");
  const raiz = [...s.querySelectorAll(".pasta")].find((b) => b.textContent?.startsWith("1. Fiscalizacao")) as HTMLElement;
  const li = raiz.closest("li") as HTMLElement;
  (li.querySelector('[aria-label="Ações da pasta"]') as HTMLElement).click();
  const mover = [...li.querySelectorAll(".acoes button")].find((b) => b.textContent === "Mover para…") as HTMLElement;
  mover.click();
  await esperar();
  checar("dialogo recebeu numerar", numerarRecebido[0] === true);
  desfazer();
});

const PASTA_P1 = { id: "p1", nome: "Fiscalizacao", pai: null, ordem: "a0", atualizadoEm: 1, dispositivo: "d1" };
/** Na fixture, a versão 42 pertence ao agrupador estável 40 (o vínculo vive pelo agrupador). */
const AGRUPADOR_42 = "40";

function capturarAvisos(): { avisos: Array<{ texto: string; acao?: AcaoAviso }>; avisar: (t: string, a?: AcaoAviso) => void } {
  const avisos: Array<{ texto: string; acao?: AcaoAviso }> = [];
  return { avisos, avisar: (texto, acao) => avisos.push({ texto, acao }) };
}

const vinculoDaArea = async (d: DepsMontar, agrupador: string): Promise<{ pasta?: string; removidoEm?: number } | undefined> => {
  const chave = `base-conhecimento/vinculos/${agrupador}`;
  return (await d.area.obter(chave))[chave] as { pasta?: string; removidoEm?: number } | undefined;
};

await teste("retorno da criacao organiza o item na pasta da intencao", async () => {
  const { avisos, avisar } = capturarAvisos();
  const d = deps({ url: URL_RETORNO, avisar });
  await d.area.gravar({ "base-conhecimento/pastas/p1": PASTA_P1 });
  await consentimentoBase(d.sync, IDENT.host, "usuario.teste", IDENT.unidade).definir("ligado");
  await gravarIntencao(d.area, IDENT, "p1", "1. Fiscalizacao", 100);
  const desfazer = await montar(d);
  checar("vinculo na pasta", (await vinculoDaArea(d, AGRUPADOR_42))?.pasta === "p1");
  checar(
    "aviso de sucesso com desfazer",
    avisos.some((a) => a.texto === 'Documento criado em "1. Fiscalizacao".' && a.acao?.rotulo === "Desfazer"),
  );
  checar("intencao limpa", !(CHAVE_INTENCAO in (await d.area.obter(CHAVE_INTENCAO))));
  desfazer();
});

await teste("desfazer devolve o item a Sem pasta", async () => {
  const { avisos, avisar } = capturarAvisos();
  const d = deps({ url: URL_RETORNO, avisar });
  await d.area.gravar({ "base-conhecimento/pastas/p1": PASTA_P1 });
  await consentimentoBase(d.sync, IDENT.host, "usuario.teste", IDENT.unidade).definir("ligado");
  await gravarIntencao(d.area, IDENT, "p1", "Fiscalizacao", 100);
  const desfazer = await montar(d);
  const acao = avisos.find((a) => a.acao?.rotulo === "Desfazer")?.acao;
  checar("tem desfazer", acao !== undefined);
  acao?.fazer();
  await esperar();
  checar("lapide no vinculo", (await vinculoDaArea(d, AGRUPADOR_42))?.removidoEm !== undefined);
  desfazer();
});

await teste("retorno com id fora da lista avisa e limpa a intencao", async () => {
  const { avisos, avisar } = capturarAvisos();
  const d = deps({ url: URL_RETORNO.replace("id_base_conhecimento=42", "id_base_conhecimento=99"), avisar });
  await d.area.gravar({ "base-conhecimento/pastas/p1": PASTA_P1 });
  await gravarIntencao(d.area, IDENT, "p1", "Fiscalizacao", 100);
  const desfazer = await montar(d);
  checar(
    "aviso",
    avisos.some((a) => a.texto === "O documento criado não foi localizado na lista; organize-o manualmente."),
  );
  checar("intencao limpa", !(CHAVE_INTENCAO in (await d.area.obter(CHAVE_INTENCAO))));
  checar("nada gravado", (await vinculoDaArea(d, AGRUPADOR_42)) === undefined);
  desfazer();
});

await teste("item ja organizado por colega nao e sobrescrito", async () => {
  const { avisos, avisar } = capturarAvisos();
  const d = deps({ url: URL_RETORNO, avisar });
  await d.area.gravar({
    "base-conhecimento/pastas/p1": PASTA_P1,
    "base-conhecimento/pastas/p2": { id: "p2", nome: "Colega", pai: null, ordem: "a1", atualizadoEm: 1, dispositivo: "d1" },
    "base-conhecimento/vinculos/40": {
      id: "40",
      titulo: "PROCEDIMENTO DE EXEMPLO A",
      pasta: "p2",
      ordem: "a0",
      atualizadoEm: 1,
      dispositivo: "d1",
    },
  });
  await gravarIntencao(d.area, IDENT, "p1", "Fiscalizacao", 100);
  const desfazer = await montar(d);
  checar("continua em p2", (await vinculoDaArea(d, AGRUPADOR_42))?.pasta === "p2");
  checar("intencao limpa", !(CHAVE_INTENCAO in (await d.area.obter(CHAVE_INTENCAO))));
  checar("sem aviso", avisos.length === 0);
  desfazer();
});

await teste("sem consentimento oferece Entendi e organizar (aceitar associa)", async () => {
  const { avisos, avisar } = capturarAvisos();
  const d = deps({ url: URL_RETORNO, avisar });
  await d.area.gravar({ "base-conhecimento/pastas/p1": PASTA_P1 });
  await gravarIntencao(d.area, IDENT, "p1", "Fiscalizacao", 100);
  const desfazer = await montar(d);
  const acao = avisos.find((a) => a.acao?.rotulo === "Entendi e organizar")?.acao;
  checar("aviso com a acao", acao !== undefined);
  checar("nada gravado antes de aceitar", (await vinculoDaArea(d, AGRUPADOR_42)) === undefined);
  acao?.fazer();
  await esperar();
  checar("associou depois do Entendi", (await vinculoDaArea(d, AGRUPADOR_42))?.pasta === "p1");
  checar("intencao limpa", !(CHAVE_INTENCAO in (await d.area.obter(CHAVE_INTENCAO))));
  desfazer();
});

await teste("sem consentimento: recusar o Entendi nao associa e limpa a intencao", async () => {
  const { avisos, avisar } = capturarAvisos();
  const d = deps({ url: URL_RETORNO, avisar, perguntar: async () => false });
  await d.area.gravar({ "base-conhecimento/pastas/p1": PASTA_P1 });
  await gravarIntencao(d.area, IDENT, "p1", "Fiscalizacao", 100);
  const desfazer = await montar(d);
  const acao = avisos.find((a) => a.acao?.rotulo === "Entendi e organizar")?.acao;
  checar("aviso com a acao", acao !== undefined);
  acao?.fazer();
  await esperar();
  checar("nada gravado", (await vinculoDaArea(d, AGRUPADOR_42)) === undefined);
  checar("intencao limpa", !(CHAVE_INTENCAO in (await d.area.obter(CHAVE_INTENCAO))));
  desfazer();
});

await teste("pasta da intencao removida: avisa e nao grava", async () => {
  const { avisos, avisar } = capturarAvisos();
  const d = deps({ url: URL_RETORNO, avisar });
  await d.area.gravar({ "base-conhecimento/pastas/p2": { ...PASTA_P1, id: "p2", nome: "Outra" } });
  await consentimentoBase(d.sync, IDENT.host, "usuario.teste", IDENT.unidade).definir("ligado");
  await gravarIntencao(d.area, IDENT, "p1", "Fiscalizacao", 100);
  const desfazer = await montar(d);
  checar(
    "aviso",
    avisos.some((a) => a.texto === "A pasta escolhida não existe mais; o documento ficou em Sem pasta."),
  );
  checar("nada gravado", (await vinculoDaArea(d, AGRUPADOR_42)) === undefined);
  desfazer();
});

await teste("lista comum limpa a intencao sem aviso", async () => {
  const { avisos, avisar } = capturarAvisos();
  const d = deps({ avisar });
  await d.area.gravar({ "base-conhecimento/pastas/p1": PASTA_P1 });
  await gravarIntencao(d.area, IDENT, "p1", "Fiscalizacao", 100);
  const desfazer = await montar(d);
  checar("intencao limpa", !(CHAVE_INTENCAO in (await d.area.obter(CHAVE_INTENCAO))));
  checar("sem aviso", avisos.length === 0);
  desfazer();
});

await teste("Nova com pasta selecionada grava a intencao e a volta usa o caminho numerado", async () => {
  const d = deps({ numerar: true });
  await d.area.gravar({ "base-conhecimento/pastas/p1": PASTA_P1 });
  const desfazer = await montar(d);
  disparar(d.doc.querySelector("#btnNova") as Element, "click");
  await esperar();
  checar("sem selecao nao captura", !(CHAVE_INTENCAO in (await d.area.obter(CHAVE_INTENCAO))));
  const pasta = [...sombra(d.doc).querySelectorAll(".pasta")].find((b) => b.textContent?.startsWith("1. Fiscalizacao")) as HTMLElement;
  disparar(pasta, "click");
  await esperar();
  disparar(d.doc.querySelector("#btnNova") as Element, "click");
  await esperar();
  const bruto = (await d.area.obter(CHAVE_INTENCAO))[CHAVE_INTENCAO] as { pastaId?: string; caminho?: string } | undefined;
  checar("pasta da intencao", bruto?.pastaId === "p1");
  checar("caminho numerado no clique", bruto?.caminho === "1. Fiscalizacao");
  desfazer();

  const { avisos, avisar } = capturarAvisos();
  await consentimentoBase(d.sync, IDENT.host, "usuario.teste", IDENT.unidade).definir("ligado");
  const d2 = deps({ url: URL_RETORNO, area: d.area, sync: d.sync, numerar: true, avisar });
  const desfazer2 = await montar(d2);
  checar("vinculo na pasta", (await vinculoDaArea(d2, AGRUPADOR_42))?.pasta === "p1");
  checar(
    "aviso com o caminho numerado",
    avisos.some((a) => a.texto === 'Documento criado em "1. Fiscalizacao".'),
  );
  desfazer2();
});

await teste("Entendi e organizar nao sobrescreve vinculo de colega criado depois", async () => {
  const { avisos, avisar } = capturarAvisos();
  const d = deps({ url: URL_RETORNO, avisar });
  await d.area.gravar({ "base-conhecimento/pastas/p1": PASTA_P1 });
  await gravarIntencao(d.area, IDENT, "p1", "Fiscalizacao", 100);
  const desfazer = await montar(d);
  const acao = avisos.find((a) => a.acao?.rotulo === "Entendi e organizar")?.acao;
  checar("acao presente", acao !== undefined);
  await d.area.gravar({
    "base-conhecimento/pastas/p2": { ...PASTA_P1, id: "p2", nome: "Colega", ordem: "a1" },
    "base-conhecimento/vinculos/40": {
      id: "40",
      titulo: "PROCEDIMENTO DE EXEMPLO A",
      pasta: "p2",
      ordem: "a0",
      atualizadoEm: 500,
      dispositivo: "d2",
    },
  });
  acao?.fazer();
  await esperar();
  checar("continua na pasta do colega", (await vinculoDaArea(d, AGRUPADOR_42))?.pasta === "p2");
  checar("sem lapide", (await vinculoDaArea(d, AGRUPADOR_42))?.removidoEm === undefined);
  checar("intencao limpa", !(CHAVE_INTENCAO in (await d.area.obter(CHAVE_INTENCAO))));
  desfazer();
});

await teste("Desfazer nao apaga a reorganizacao feita por um colega depois", async () => {
  const { avisos, avisar } = capturarAvisos();
  const d = deps({ url: URL_RETORNO, avisar });
  await d.area.gravar({ "base-conhecimento/pastas/p1": PASTA_P1 });
  await consentimentoBase(d.sync, IDENT.host, "usuario.teste", IDENT.unidade).definir("ligado");
  await gravarIntencao(d.area, IDENT, "p1", "Fiscalizacao", 100);
  const desfazer = await montar(d);
  const acao = avisos.find((a) => a.acao?.rotulo === "Desfazer")?.acao;
  checar("tem desfazer", acao !== undefined);
  await d.area.gravar({
    "base-conhecimento/pastas/p2": { ...PASTA_P1, id: "p2", nome: "Colega", ordem: "a1" },
    "base-conhecimento/vinculos/40": {
      id: "40",
      titulo: "PROCEDIMENTO DE EXEMPLO A",
      pasta: "p2",
      ordem: "a0",
      atualizadoEm: 500,
      dispositivo: "d2",
    },
  });
  acao?.fazer();
  await esperar();
  checar("continua em p2", (await vinculoDaArea(d, AGRUPADOR_42))?.pasta === "p2");
  checar("sem lapide", (await vinculoDaArea(d, AGRUPADOR_42))?.removidoEm === undefined);
  checar(
    "aviso explica",
    avisos.some((a) => a.texto === "A organização deste documento mudou; nada foi desfeito."),
  );
  desfazer();
});

await teste("modo lista nao captura intencao ao clicar em Nova", async () => {
  const d = deps();
  await d.area.gravar({ "base-conhecimento/pastas/p1": PASTA_P1, spro_bc_modo: "lista" });
  const desfazer = await montar(d);
  await esperar();
  disparar(d.doc.querySelector("#btnNova") as Element, "click");
  await esperar();
  checar("sem intencao", !(CHAVE_INTENCAO in (await d.area.obter(CHAVE_INTENCAO))));
  desfazer();
});

await teste("falha de storage na intencao nao derruba o montar", async () => {
  const base = areaMemoria();
  const area = {
    ...base,
    async obter(chaves?: string | string[] | null) {
      if (chaves === CHAVE_INTENCAO) throw new Error("storage falhou");
      return base.obter(chaves);
    },
  };
  const d = deps({ area, url: URL_RETORNO, numerar: true });
  const desfazer = await montar(d);
  checar("painel montado", d.doc.querySelector(".spro-bc-host") !== null);
  desfazer();
  checar("limpeza removeu o painel", d.doc.querySelector(".spro-bc-host") === null);
});

await teste("montar le a intencao na area da aba, nao na area geral", async () => {
  const { avisos, avisar } = capturarAvisos();
  const intencaoAba = areaMemoria();
  const d = deps({ url: URL_RETORNO, intencao: intencaoAba, avisar });
  await d.area.gravar({ "base-conhecimento/pastas/p1": PASTA_P1 });
  await consentimentoBase(d.sync, IDENT.host, "usuario.teste", IDENT.unidade).definir("ligado");
  await gravarIntencao(intencaoAba, IDENT, "p1", "1. Fiscalizacao", 100);
  const desfazer = await montar(d);
  checar("vinculo na pasta", (await vinculoDaArea(d, AGRUPADOR_42))?.pasta === "p1");
  checar(
    "aviso com desfazer",
    avisos.some((a) => a.acao?.rotulo === "Desfazer"),
  );
  checar("intencao limpa na area da aba", !(CHAVE_INTENCAO in (await intencaoAba.obter(CHAVE_INTENCAO))));
  desfazer();
});

await teste("montar nao seleciona pasta sozinho e a tabela mostra tudo", async () => {
  const d = deps();
  await d.area.gravar({
    "base-conhecimento/pastas/p1": PASTA_P1,
    "base-conhecimento/pastas/p2": { ...PASTA_P1, id: "p2", nome: "Talentos", ordem: "a1" },
  });
  const desfazer = await montar(d);
  checar("nada selecionado", sombra(d.doc).querySelector('[aria-current="true"]') === null);
  const visiveis = [...d.doc.querySelectorAll("tr[data-spro-agrupador]")].filter((tr) => (tr as HTMLElement).style.display !== "none");
  checar("todas as linhas visiveis", visiveis.length === 3);
  desfazer();
});

await teste("ordenar a tabela nao seleciona pasta", async () => {
  const d = deps();
  await d.area.gravar({ "base-conhecimento/pastas/p1": PASTA_P1 });
  const desfazer = await montar(d);
  disparar(d.doc.querySelector("table.infraTable") as Element, "sortEnd");
  await esperar();
  checar("continua sem selecao", sombra(d.doc).querySelector('[aria-current="true"]') === null);
  desfazer();
});

await teste("excluir pasta avisa que subpastas vao junto e os itens ficam no SEI", async () => {
  const textos: string[] = [];
  const d = deps({
    confirmar: async (t) => {
      textos.push(t);
      return false;
    },
  });
  await d.area.gravar({
    "base-conhecimento/pastas/p1": PASTA_P1,
    "base-conhecimento/pastas/p2": { ...PASTA_P1, id: "p2", nome: "Sub", pai: "p1", ordem: "a0" },
  });
  const desfazer = await montar(d);
  const s = sombra(d.doc);
  const raiz = [...s.querySelectorAll(".pasta")].find((b) => b.textContent?.startsWith("Fiscalizacao")) as HTMLElement;
  const li = raiz.closest("li") as HTMLElement;
  (li.querySelector('[aria-label="Ações da pasta"]') as HTMLElement).click();
  const excluir = [...li.querySelectorAll(".acoes button")].find((b) => b.textContent === "Excluir") as HTMLElement;
  excluir.click();
  await esperar();
  checar(
    "confirmacao cita subpastas e o SEI",
    textos.some((t) => t.includes("e as subpastas") && t.includes("continuam no SEI") && t.includes("Sem pasta")),
  );
  desfazer();
});

await teste("interruptor do painel grava a preferencia de numerar", async () => {
  const d = deps();
  await d.area.gravar({ "base-conhecimento/pastas/p1": PASTA_P1 });
  const desfazer = await montar(d);
  const caixa = sombra(d.doc).querySelector(".numerar input") as HTMLInputElement;
  checar("desmarcado no padrao", !caixa.checked);
  caixa.checked = true;
  disparar(caixa, "change");
  await esperar();
  checar("gravou sim", (await d.area.obter("spro_bc_numerar")).spro_bc_numerar === "sim");
  desfazer();
});
