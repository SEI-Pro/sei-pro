import { criarAdaptador } from "../../src/adaptador";
import type { Versao } from "../../src/adaptador/tipos";
import {
  acharNumeros,
  contarPorNumero,
  LOTE_TETO,
  recurso as linkSeiLote,
  moldeProcesso,
  ordenarFila,
  type Padroes,
  PROCESSO_ANO_DV,
  regexNumeroSei,
  regexProcessoSei,
  tempos,
  trechoEmVolta,
} from "../../src/recursos/link-sei-lote";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, tique, usarDocumento } from "../dialogo";
import { criarCk4, criarCk5, type FalsoCk4, type FalsoCk5 } from "../falsos";
import { checar, igual, secao } from "../util";

// biome-ignore lint/suspicious/noExplicitAny: os falsos de CKEditor expoem so o que cada teste ajusta
type Livre = any;
type Fn = (...a: unknown[]) => unknown;

const PROCESSO_A = "50300.018905/2018-67";
const SEM_PADROES = (atual = "", tamanhos = [7, 8]): Padroes => ({
  tamanhos,
  processoAtual: atual,
  exemploProcesso: atual || "00000.000000/0000-00",
  documento: regexNumeroSei(tamanhos),
  processo: regexProcessoSei(atual ? [moldeProcesso(atual), PROCESSO_ANO_DV] : [PROCESSO_ANO_DV]),
});

// ---------------------------------------------------------------------------------------------------------------------
// Falsos de editor com varias secoes e um "servidor do SEI"
// ---------------------------------------------------------------------------------------------------------------------

/** Resposta do servidor para um numero: o protocolo achado ou a mensagem de erro do SEI. */
type Resposta = { id: string; formatado?: string } | { erro: string };

interface Opcoes {
  /** Paragrafos do corpo; `[[1234567]]` e um link que ja existe (id "pre"). */
  paragrafos: string[];
  /** Segunda secao editavel (CK4: instancia "txaEditor_2"; CK5: raiz "extra"). */
  extra?: string;
  /** Secao somente leitura com texto (CK4 `readOnly`; CK5 `rootsAttributes.somenteLeitura`). */
  leitura?: string;
  /** Segunda secao somente leitura marcada so pela classe `ck-read-only` do DOM (so CK5). */
  leituraPorClasse?: string;
  /** O corpo tambem e somente leitura (nao ha onde escrever). */
  tudoSomenteLeitura?: boolean;
}

interface Caso {
  versao: Versao;
  doc: Document;
  win: Livre;
  ctx: Contexto;
  g: Record<string, Fn>;
  servidor: Map<string, Resposta>;
  /** Numeros consultados/convertidos, na ordem em que o servidor foi chamado. */
  consultas: string[];
  recusas: number;
  alertas: string[];
  /** Links no corpo (id:texto), na ordem do documento. */
  links(): string[];
  /** Texto do corpo sem os links. */
  texto(): string;
  textoExtra(): string;
  dialogos(): HTMLElement[];
  aviso(): string;
  limparAvisos(): void;
  /** Dialogo CK4 que "nunca fecha" (`CKEDITOR.dialog.getCurrent()`), para o teste de limite de espera. */
  travarDialogoCk4(): { escondeu: number };
  fetchs: Array<{ url: string; corpo: string; metodo: string }>;
}

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function xmlResposta(numero: string, r: Resposta | undefined): string {
  if (!r) return `<?xml version="1.0" encoding="iso-8859-1"?><erros><erro descricao="Protocolo não encontrado."></erro></erros>`;
  if ("erro" in r) {
    return `<?xml version="1.0" encoding="iso-8859-1"?><erros><erro descricao='${r.erro}'></erro></erros>`;
  }
  return `<?xml version="1.0" encoding="iso-8859-1"?><complementos><complemento nome="IdProtocolo">${r.id}</complemento><complemento nome="ProtocoloFormatado">${r.formatado ?? numero}</complemento><complemento nome="Identificacao">Anexo</complemento></complementos>`;
}

// --- CK5: um model minimo (cada caractere e uma celula; o link e uma celula-objeto, como o `SEILink`) ---

interface Paragrafo {
  cels: Array<string | { nome: string; id: string; text: string }>;
}
const paragrafoCk5 = (texto: string): Paragrafo => {
  const cels: Paragrafo["cels"] = [];
  let resto = texto;
  for (let m = /\[\[(\d+)\]\]/.exec(resto); m; m = /\[\[(\d+)\]\]/.exec(resto)) {
    cels.push(...resto.slice(0, m.index));
    cels.push({ nome: "SEILink", id: "pre", text: m[1] as string });
    resto = resto.slice(m.index + m[0].length);
  }
  cels.push(...resto);
  return { cels };
};
const textoDoParagrafo = (p: Paragrafo) => p.cels.map((x) => (typeof x === "string" ? x : "·")).join("");

function montarCk5(o: Opcoes, base: Pick<Caso, "servidor" | "consultas" | "fetchs">) {
  const secoes = [
    { raiz: "main", label: "Corpo do Texto", html: "<p>x</p>", principal: true, somenteLeitura: !!o.tudoSomenteLeitura },
  ] as Array<{
    raiz: string;
    label: string;
    html: string;
    principal?: boolean;
    somenteLeitura?: boolean;
  }>;
  if (o.extra !== undefined) secoes.push({ raiz: "extra", label: "Extra", html: "<p>x</p>" });
  if (o.leitura !== undefined) secoes.push({ raiz: "cab", label: "Cabecalho", html: "<p>x</p>", somenteLeitura: true });
  if (o.leituraPorClasse !== undefined) secoes.push({ raiz: "tit", label: "Titulo", html: "<p>x</p>" });
  const ed: FalsoCk5 = criarCk5({ secoes });
  if (o.leituraPorClasse !== undefined) ed.elemento("tit").classList.add("ck-read-only");
  const inst = ed.instancia() as Livre;
  const raizes = new Map<string, Paragrafo[]>();
  raizes.set("main", o.paragrafos.map(paragrafoCk5));
  if (o.extra !== undefined) raizes.set("extra", [paragrafoCk5(o.extra)]);
  if (o.leitura !== undefined) raizes.set("cab", [paragrafoCk5(o.leitura)]);
  if (o.leituraPorClasse !== undefined) raizes.set("tit", [paragrafoCk5(o.leituraPorClasse)]);
  inst.model.document.getRootNames = () => [...raizes.keys()];
  inst.model.document.getRoot = (n: string) => raizes.get(n);
  inst.model.createRangeIn = (raiz: Paragrafo[]) => ({
    getItems: function* () {
      for (const p of raiz) {
        yield { is: (t: string) => t === "element" };
        let i = 0;
        while (i < p.cels.length) {
          if (typeof p.cels[i] !== "string") {
            i++;
            continue;
          }
          const ini = i;
          let data = "";
          while (i < p.cels.length && typeof p.cels[i] === "string") data += p.cels[i++];
          yield { is: (t: string) => t === "$textProxy", textNode: { parent: p }, startOffset: ini, data };
        }
      }
    },
  });
  inst.ui.getEditableElement = (n: string) => ed.elemento(n);
  const writer = {
    createPositionAt: (pai: Paragrafo, off: number) => ({ pai, off }),
    createRange: (a: { pai: Paragrafo; off: number }, b: { off: number }) => ({ a, b }),
    createElement: (nome: string, attrs: { id: string; text: string }) => ({ nome, ...attrs }),
    remove: (r: { a: { pai: Paragrafo; off: number }; b: { off: number } }) => {
      r.a.pai.cels.splice(r.a.off, r.b.off - r.a.off);
    },
    insert: (el: Paragrafo["cels"][number], pos: { pai: Paragrafo; off: number }) => {
      pos.pai.cels.splice(pos.off, 0, el);
    },
  };
  inst.model.change = (fn: (w: typeof writer) => unknown) => fn(writer);
  const win = ed.win as Livre;
  win.INFRA_EDITOR_CONFIG.sei = { urlBuscarProtocoloSei: "controlador_ajax.php?acao=protocolo" };
  const fetchFalso = (async (url: string, init: { method: string; body: string; headers: Record<string, string> }) => {
    const numero = decodeURIComponent(/idProtocoloDigitado=([^&]*)/.exec(init.body)?.[1] ?? "");
    base.consultas.push(numero);
    base.fetchs.push({ url, corpo: init.body, metodo: init.method });
    const r = base.servidor.get(numero);
    // iso-8859-1 de verdade: o acento do erro so volta certo se o recurso decodificar assim
    const bytes = Uint8Array.from(Buffer.from(xmlResposta(numero, r), "latin1"));
    return { arrayBuffer: async () => bytes.buffer };
  }) as unknown as typeof fetch;
  return {
    ed,
    fetch: fetchFalso,
    links: () =>
      (raizes.get("main") ?? []).flatMap((p) =>
        p.cels.filter((x) => typeof x !== "string").map((x) => `${(x as { id: string }).id}:${(x as { text: string }).text}`),
      ),
    texto: () => (raizes.get("main") ?? []).map(textoDoParagrafo).join("\n"),
    textoExtra: () => (raizes.get("extra") ?? []).map(textoDoParagrafo).join("\n"),
    travar: () => ({ escondeu: 0 }),
  };
}

// --- CK4: uma instancia por secao, o corpo e DOM de verdade; o dialogo nativo `linkseiDialog` e simulado ---

function montarCk4(o: Opcoes, base: Pick<Caso, "servidor" | "consultas" | "alertas">) {
  const html = (ps: string[]) => ps.map((p) => `<p>${esc(p).replace(/\[\[(\d+)\]\]/g, '<a id="pre" href="#">$1</a>')}</p>`).join("");
  const secoes: Array<{ nome: string; titulo: string; html: string; somenteLeitura?: boolean }> = [
    { nome: "txaEditor_1", titulo: "Corpo do Texto", html: html(o.paragrafos), somenteLeitura: !!o.tudoSomenteLeitura },
  ];
  if (o.extra !== undefined) secoes.push({ nome: "txaEditor_2", titulo: "Extra", html: html([o.extra]) });
  if (o.leitura !== undefined) secoes.push({ nome: "txaEditor_3", titulo: "Cabecalho", html: html([o.leitura]), somenteLeitura: true });
  const ed: FalsoCk4 = criarCk4({ secoes });
  const win = ed.win as Livre;
  const estado = { dialogoAberto: false, escondeu: 0 };
  class Faixa {
    no: Text | null = null;
    ini = 0;
    fim = 0;
    setStart(no: { $: Text }, off: number) {
      this.no = no.$;
      this.ini = off;
    }
    setEnd(_no: unknown, off: number) {
      this.fim = off;
    }
  }
  win.CKEDITOR.dom = {
    range: Faixa,
    text: class {
      constructor(readonly $: Text) {}
    },
  };
  win.CKEDITOR.dialog = {
    getCurrent: () =>
      estado.dialogoAberto
        ? {
            hide: () => {
              estado.escondeu += 1;
              estado.dialogoAberto = false;
            },
          }
        : null,
  };
  for (const nome of Object.keys(win.CKEDITOR.instances)) {
    const inst = win.CKEDITOR.instances[nome] as Livre;
    let faixa: Faixa | null = null;
    inst.getSelection = () => ({
      selectRanges: (r: Faixa[]) => {
        faixa = r[0] ?? null;
      },
    });
    inst.execCommand = (comando: string) => {
      inst.comandos.push([comando, null]);
      if (comando !== "linkseiDialog" || !faixa?.no) return;
      const no = faixa.no;
      const numero = (no.nodeValue ?? "").slice(faixa.ini, faixa.fim);
      base.consultas.push(numero);
      const r = base.servidor.get(numero);
      if (!r || "erro" in r) {
        // o SEI avisa com alert() nativo (desviado para uma lista durante o lote)
        const msg = r && "erro" in r ? r.erro : "Protocolo não encontrado.";
        base.alertas.push(msg);
        win.alert(msg);
        return;
      }
      const texto = no.nodeValue ?? "";
      const doc = no.ownerDocument as Document;
      const a = doc.createElement("a");
      a.setAttribute("id", `lnkSei${r.id}`);
      a.textContent = r.formatado ?? numero;
      no.nodeValue = texto.slice(0, faixa.ini);
      no.parentNode?.insertBefore(a, no.nextSibling);
      no.parentNode?.insertBefore(doc.createTextNode(texto.slice(faixa.fim)), a.nextSibling);
    };
  }
  const corpo = (n: string) => (win.CKEDITOR.instances[n] as Livre).corpo as HTMLElement;
  const semLinks = (el: HTMLElement) => {
    const copia = el.cloneNode(true) as HTMLElement;
    for (const a of copia.querySelectorAll("a")) a.remove();
    return copia.textContent ?? "";
  };
  return {
    ed,
    fetch: undefined,
    links: () => [...corpo("txaEditor_1").querySelectorAll("a")].map((a) => `${a.getAttribute("id")}:${a.textContent}`),
    texto: () => semLinks(corpo("txaEditor_1")),
    textoExtra: () => (o.extra !== undefined ? semLinks(corpo("txaEditor_2")) : ""),
    travar: () => {
      estado.dialogoAberto = true;
      return estado;
    },
  };
}

function montarCaso(versao: Versao, o: Opcoes): Caso {
  const servidor = new Map<string, Resposta>();
  const consultas: string[] = [];
  const alertas: string[] = [];
  const fetchs: Caso["fetchs"] = [];
  const m = versao === 5 ? montarCk5(o, { servidor, consultas, fetchs }) : montarCk4(o, { servidor, consultas, alertas });
  const doc = m.ed.doc;
  usarDocumento(doc);
  const win = m.ed.win as Livre;
  win.location = {
    search: "?id_procedimento=77&id_documento=88",
    href: "https://sei.exemplo.gov.br/sei/controlador.php?id_procedimento=77&id_documento=88",
  };
  const caso: Caso = {
    versao,
    doc,
    win,
    ctx: {
      adaptador: criarAdaptador(win),
      doc,
      win,
      base: "",
      checkOpcao: () => true,
      verifyOpcao: () => false,
      ...(m.fetch ? { fetch: m.fetch } : {}),
    },
    g: {},
    servidor,
    consultas,
    recusas: 0,
    alertas,
    links: m.links,
    texto: m.texto,
    textoExtra: m.textoExtra,
    dialogos: () => [...doc.querySelectorAll("dialog.spro-dialogo[open]")] as HTMLElement[],
    aviso: () => [...doc.querySelectorAll(".spro-aviso")].map((a) => a.textContent ?? "").join(" | "),
    limparAvisos: () => {
      for (const a of doc.querySelectorAll(".spro-aviso")) a.remove();
    },
    travarDialogoCk4: m.travar,
    fetchs,
  };
  caso.ctx.adaptador.aoRecusarEscrita(() => {
    caso.recusas += 1;
  });
  caso.g = linkSeiLote.globais(caso.ctx) as Record<string, Fn>;
  return caso;
}

/** Marca/desmarca como o navegador: propriedade e atributo (o linkedom so reflete o atributo). */
function marcar(el: HTMLInputElement, valor: boolean): void {
  (el as Livre).checked = valor;
  if (valor) el.setAttribute("checked", "checked");
  else el.removeAttribute("checked");
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  el.dispatchEvent(new Ev("change", { bubbles: true }));
}
const itens = (d: HTMLElement) => [...d.querySelectorAll("input.linkSeiLoteItem")] as HTMLInputElement[];
const marcados = (d: HTMLElement) =>
  itens(d)
    .filter((i) => i.hasAttribute("checked"))
    .map((i) => i.getAttribute("data-i"));

async function aguardar(cond: () => boolean, ms = 3000): Promise<boolean> {
  const fim = Date.now() + ms;
  while (!cond()) {
    if (Date.now() > fim) return false;
    await tique(3);
  }
  return true;
}

async function paraAMesa(c: Caso): Promise<void> {
  // espera o fim do lote: ou o aviso de sucesso, ou o dialogo de falhas
  await aguardar(() => /convertido/.test(c.aviso()) || !!c.doc.querySelector("#linkSeiLoteFalhas"));
}

// ---------------------------------------------------------------------------------------------------------------------

export async function verificarLinkSeiLote(): Promise<void> {
  secao("recurso link-sei-lote");
  const tempoOriginal = { ...tempos };
  Object.assign(tempos, { pausa: 1, assentar: 3, espia: 1, limiteDialogo: 25 });
  try {
    puras();
    for (const versao of [4, 5] as const) await porEditor(versao);
  } finally {
    Object.assign(tempos, tempoOriginal);
  }
}

function puras(): void {
  // ---- moldes e expressoes ----
  igual("molde: cada bloco de digitos vira \\d{n} e a pontuacao e escapada", moldeProcesso(PROCESSO_A), "\\d{5}\\.\\d{6}\\/\\d{4}-\\d{2}");
  igual("molde: letras e barras ficam literais (escapadas)", moldeProcesso("A1.2/3"), "A\\d{1}\\.\\d{1}\\/\\d{1}");
  const doc78 = regexNumeroSei([7, 8]);
  igual("documento: casa 7 e 8 digitos isolados", "SEI 1234567, 12345678".match(doc78), ["1234567", "12345678"]);
  checar(
    "documento: 9 digitos (ou 6) nao casam, nem pedaco de numero maior",
    !regexNumeroSei([7, 8]).test("123456789 e 123456 e a1234567"),
  );

  // ---- achar numeros ----
  let a = acharNumeros(`Ver SEI 1234567 e ${PROCESSO_A} e 12345678.`, SEM_PADROES());
  igual(
    "achar: documentos e processo, na ordem do texto, com posicoes",
    a.map((x) => [x.numero, x.tipo, x.proprio, x.inicio, x.fim]),
    [
      ["1234567", "documento", false, 8, 15],
      [PROCESSO_A, "processo", false, 18, 38],
      ["12345678", "documento", false, 41, 49],
    ],
  );
  a = acharNumeros(`Processo ${PROCESSO_A}.`, SEM_PADROES(PROCESSO_A));
  igual(
    "achar: o numero do proprio processo vem como `proprio`",
    a.map((x) => [x.numero, x.proprio]),
    [[PROCESSO_A, true]],
  );
  a = acharNumeros("Proc. 018.00002137/2023-41 e 3533908.4438.00000132/2025-57 e 99906.713-630.000032/2025-82", SEM_PADROES("", [7, 8]));
  igual(
    "achar: formatos de processo diferentes (ano-DV) e documento dentro do processo nao conta em separado",
    a.map((x) => [x.numero, x.tipo]),
    [
      ["018.00002137/2023-41", "processo"],
      ["3533908.4438.00000132/2025-57", "processo"],
      ["99906.713-630.000032/2025-82", "processo"],
    ],
  );
  a = acharNumeros("x108000.012345/2024-11 e 108000.012345/2024-11", SEM_PADROES());
  igual(
    "achar: borda impede casar o pedaco final de um numero maior",
    a.map((x) => [x.numero, x.inicio]),
    [["108000.012345/2024-11", 25]],
  );
  igual(
    "achar: molde do proprio processo cobre formato fora do comum (com letras)",
    acharNumeros("Proc AB-12.345/2020", SEM_PADROES("AB-12.345/2020")).length,
    1,
  );
  igual("achar: texto sem numero", acharNumeros("sem nada aqui 12 345", SEM_PADROES()), []);
  // lastIndex nao vaza entre chamadas
  const p = SEM_PADROES();
  igual(
    "achar: repetir a busca com o mesmo padrao da o mesmo resultado",
    [acharNumeros("1234567", p).length, acharNumeros("1234567", p).length],
    [1, 1],
  );

  // ---- trecho, contagem, fila ----
  igual("trecho: curto, sem reticencias", trechoEmVolta("ver 1234567 ok", 4, 11), "ver ‹1234567› ok".replace("‹", "‹"));
  const longo = `${"a ".repeat(30)}1234567${" b".repeat(30)}`;
  const tr = trechoEmVolta(longo, 60, 67);
  checar(
    "trecho: reticencias dos dois lados e no maximo 40 caracteres em cada",
    tr.startsWith("...") && tr.endsWith("...") && tr.includes("‹1234567›"),
    tr,
  );
  igual("trecho: espacos em branco seguidos viram um so", trechoEmVolta("a \n\n b 1234567 c   d", 7, 14), "a b ‹1234567› c d");
  igual("contar: por numero", contarPorNumero([{ numero: "1" }, { numero: "2" }, { numero: "1" }]), { "1": 2, "2": 1 });
  const no1 = {};
  const no2 = {};
  const fila = ordenarFila([
    { no: no1, inicio: 1 },
    { no: no2, inicio: 5 },
    { no: no1, inicio: 9 },
    { pai: no2, inicio: 2 },
  ] as Array<{ pai?: unknown; no?: unknown; inicio: number }>);
  igual(
    "fila: agrupa por no e vai de tras para a frente dentro de cada um",
    fila.map((x) => x.inicio),
    [9, 1, 5, 2],
  );
}

async function porEditor(versao: Versao): Promise<void> {
  const v = `[CK${versao}]`;
  const nome = (t: string) => `link-sei-lote ${v}: ${t}`;
  try {
    await cenarios(versao, nome);
  } catch (e) {
    checar(`link-sei-lote ${v}`, false, e instanceof Error ? (e.stack ?? e.message) : String(e));
  }
}

async function cenarios(versao: Versao, nome: (t: string) => string): Promise<void> {
  // ---- contrato ----
  {
    const c = montarCaso(versao, { paragrafos: ["x"] });
    igual(nome("globais do contrato"), Object.keys(c.g), ["converterNumerosSeiEmLotePro"]);
    igual(nome("id do recurso"), linkSeiLote.id, "link-sei-lote");
  }

  // ---- nada encontrado ----
  {
    const c = montarCaso(versao, { paragrafos: ["Sem numeros aqui, so 123456789 e 123456 e [[7654321]]."] });
    c.g.converterNumerosSeiEmLotePro?.(null);
    checar(
      nome("sem numero: avisa (7 ou 8 digitos, exemplo de processo, links ja feitos fora da conta) e nao abre dialogo"),
      /7 ou 8 dígitos/.test(c.aviso()) &&
        c.aviso().includes("00000.000000/0000-00") &&
        /já são link/.test(c.aviso()) &&
        c.dialogos().length === 0,
      c.aviso(),
    );
    // o exemplo e o numero do processo atual, quando se sabe
    c.win.dadosProcessoPro = {
      propProcesso: { txtProtocoloExibir: PROCESSO_A },
      listDocumentos: [{ nr_sei: "35276038" }, { nr_sei: "1234567" }],
    };
    c.limparAvisos();
    c.g.converterNumerosSeiEmLotePro?.(null);
    checar(
      nome("sem numero: mensagem usa os tamanhos dos documentos do processo e o numero do processo atual"),
      /7 ou 8 dígitos/.test(c.aviso()) && c.aviso().includes(`como ${PROCESSO_A}`),
      c.aviso(),
    );
  }

  // ---- fluxo completo: previa, marcar/desmarcar, converter ----
  {
    const c = montarCaso(versao, {
      paragrafos: [
        `Conforme SEI 1234567 e 12345678, processo ${PROCESSO_A}, CEP 123456789. Veja [[7654321]] e 1234567 de novo.`,
        "Outra linha com 2222222.",
      ],
    });
    c.servidor.set("1234567", { id: "4001" });
    c.servidor.set("12345678", { id: "4002" });
    c.servidor.set("2222222", { id: "4003" });
    c.servidor.set(PROCESSO_A, { id: "5001", formatado: PROCESSO_A });
    c.g.converterNumerosSeiEmLotePro?.(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    checar(nome("abre o dialogo da previa"), !!d, c.aviso());
    igual(nome("titulo do dialogo"), d.querySelector("h2")?.textContent, "Converter números SEI em links");
    checar(
      nome("ids preservados: caixa, marcar todos, desmarcar todos"),
      !!d.querySelector("#linkSeiLoteBox") && !!d.querySelector("#linkSeiLoteTodos") && !!d.querySelector("#linkSeiLoteNenhum"),
    );
    checar(nome("sem botao Cancelar"), ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")));
    // 1234567 (2x), 12345678, processo, 2222222 = 5; o 7654321 e link, o 123456789 nao casa
    igual(nome("5 ocorrencias (link existente e 9 digitos ficam de fora)"), itens(d).length, 5);
    igual(
      nome("data-i em ordem"),
      itens(d).map((i) => i.getAttribute("data-i")),
      ["0", "1", "2", "3", "4"],
    );
    igual(nome("todas marcadas"), marcados(d), ["0", "1", "2", "3", "4"]);
    const texto = d.querySelector("#linkSeiLoteBox")?.textContent ?? "";
    checar(
      nome("resumo da previa: contagem por tipo, tamanhos e recomendacao"),
      /Encontrei 5 números/.test(texto) && /4 de documento \(7 ou 8 dígitos/.test(texto) && /1 de processo/.test(texto),
      texto,
    );
    checar(nome("mostra o trecho com o numero entre aspas angulares"), texto.includes("‹1234567›"), texto);
    checar(nome("contador de marcados"), /5 de 5 marcados/.test(texto), texto);

    clicar(d, "Desmarcar todos");
    igual(nome("Desmarcar todos"), marcados(d), []);
    checar(nome("contador acompanha"), /0 de 5 marcados/.test(d.textContent ?? ""));
    clicar(d, "Marcar todos");
    igual(nome("Marcar todos"), marcados(d), ["0", "1", "2", "3", "4"]);
    marcar(itens(d)[2] as HTMLInputElement, false); // o processo
    checar(nome("desmarcar um por um"), /4 de 5 marcados/.test(d.textContent ?? ""));

    clicar(d, "Converter");
    checar(
      nome("Converter fecha a previa e avisa o andamento"),
      c.dialogos().length === 0 && /Convertendo 4 números/.test(c.aviso()),
      c.aviso(),
    );
    await paraAMesa(c);
    checar(nome("termina com o resumo de sucesso"), /4 números convertidos em link/.test(c.aviso()), c.aviso());
    // ordem do servidor: dentro do paragrafo, de tras para a frente (o 1234567 mais ao fim primeiro)
    igual(
      nome("consultas: cada numero marcado e uma ida ao servidor, de tras para a frente"),
      c.consultas.filter((n) => n !== "2222222").slice(0, 3),
      // CK5: um paragrafo so (do fim para o comeco); CK4: o texto antes do link vem primeiro (cada no e uma fila)
      versao === 5 ? ["1234567", "12345678", "1234567"] : ["12345678", "1234567", "1234567"],
    );
    const ls = c.links();
    checar(
      nome("links: 1234567 (2x), 12345678 e 2222222 convertidos; o link que ja existia continua"),
      ls.filter((x) => x.endsWith(":1234567")).length === 2 &&
        ls.some((x) => x.endsWith(":12345678")) &&
        ls.some((x) => x.endsWith(":2222222")) &&
        ls.includes("pre:7654321"),
      ls,
    );
    checar(nome("o numero desmarcado (processo) segue como texto"), c.texto().includes(PROCESSO_A), c.texto());
    checar(nome("o CEP de 9 digitos nao foi tocado"), c.texto().includes("123456789"), c.texto());
    checar(nome("nao sobra numero de documento convertido como texto"), !/\b(1234567|12345678|2222222)\b/.test(c.texto()), c.texto());
    if (versao === 5) {
      const f = c.fetchs.find((x) => x.corpo.includes("idProtocoloDigitado=12345678&")) as Caso["fetchs"][number];
      igual(
        nome("CK5: POST ao endereco do SEI, resolvido pela pagina"),
        [f.metodo, f.url],
        ["POST", "https://sei.exemplo.gov.br/sei/controlador_ajax.php?acao=protocolo"],
      );
      igual(
        nome("CK5: corpo leva numero, procedimento e documento da URL"),
        f.corpo,
        "idProtocoloDigitado=12345678&idProcedimento=77&idDocumento=88",
      );
      checar(
        nome("CK5: o link e o elemento SEILink (id lnkSei<IdProtocolo>)"),
        c.links().includes("lnkSei4002:12345678") && c.links().includes("lnkSei4001:1234567"),
        c.links(),
      );
    } else {
      const ed = c.win.CKEDITOR.instances.txaEditor_1;
      igual(
        nome("CK4: cada conversao abre o dialogo linkseiDialog"),
        ed.comandos.filter((x: unknown[]) => x[0] === "linkseiDialog").length,
        4,
      );
      checar(nome("CK4: a instancia recebeu o foco antes de cada conversao"), ed.focos >= 4, ed.focos);
    }
  }

  // ---- converter sem nada marcado fecha em silencio ----
  {
    const c = montarCaso(versao, { paragrafos: ["SEI 1234567"] });
    c.g.converterNumerosSeiEmLotePro?.(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    clicar(d, "Desmarcar todos");
    clicar(d, "Converter");
    await tique(20);
    checar(
      nome("nada marcado: fecha sem converter nem avisar"),
      c.dialogos().length === 0 && c.consultas.length === 0 && c.aviso() === "",
      c.aviso(),
    );
    igual(nome("nada marcado: texto intacto"), c.texto(), "SEI 1234567");
  }

  // ---- o numero do proprio processo vem desmarcado; tamanhos vem dos documentos do processo ----
  {
    const c = montarCaso(versao, { paragrafos: [`Proc ${PROCESSO_A} cita 1234567 e 12345678.`] });
    c.win.dadosProcessoPro = {
      propProcesso: { txtProtocoloExibir: PROCESSO_A },
      listDocumentos: [{ nr_sei: "1234567" }, { nr_sei: " 99 " }],
    };
    c.g.converterNumerosSeiEmLotePro?.(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    igual(nome("tamanhos dos documentos do processo: so 7 digitos; achou o processo e 1 documento"), itens(d).length, 2);
    igual(nome("o proprio processo vem desmarcado"), marcados(d), ["1"]);
    checar(nome("e e identificado como 'este processo'"), (d.textContent ?? "").includes("este processo"), d.textContent);
    checar(
      nome("explica que o proprio processo vem desmarcado e descreve so 7 digitos"),
      /O número deste próprio processo vem desmarcado/.test(d.textContent ?? "") && /\(7 dígitos/.test(d.textContent ?? ""),
      d.textContent,
    );
  }

  // ---- dados do processo ainda vazios: vale a copia da sessao (id_procedimento da URL) ----
  {
    const c = montarCaso(versao, { paragrafos: [`Proc ${PROCESSO_A}.`] });
    c.win.dadosProcessoPro = {};
    c.win.sessionStorageRestorePro = (chave: string) =>
      chave === "dadosSessionProcessoPro"
        ? [
            { propProcesso: { hdnIdProcedimento: 1, txtProtocoloExibir: "00000.000001/2000-01" } },
            { propProcesso: { hdnIdProcedimento: "77", hdnProtocoloFormatado: PROCESSO_A }, listDocumentos: [{ nr_sei: "12345678" }] },
          ]
        : null;
    c.g.converterNumerosSeiEmLotePro?.(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    igual(nome("sessao: o processo atual e o do id_procedimento da URL (vem desmarcado)"), [itens(d).length, marcados(d)], [1, []]);
  }

  // ---- falhas: o servidor recusa um numero ----
  {
    const c = montarCaso(versao, { paragrafos: ["Veja 1234567 e 7777777 e 7777777."] });
    c.servidor.set("1234567", { id: "4001" });
    c.servidor.set("7777777", { erro: "Protocolo não encontrado." });
    const original = () => "original";
    c.win.alert = original;
    c.g.converterNumerosSeiEmLotePro?.(null);
    clicar(dialogoAberto(c.doc) as HTMLElement, "Converter");
    await paraAMesa(c);
    const d = c.doc.querySelector("#linkSeiLoteFalhas");
    const painel = d?.closest("dialog") as HTMLElement | null;
    checar(nome("falha: abre o resumo com a lista dos que ficaram sem link"), !!d, c.aviso());
    checar(
      nome("falha: 'N de M convertidos' e cada falha com o motivo (CK5: uma por ocorrencia; CK4: uma por numero)"),
      /1 de 3 números convertidos/.test(painel?.textContent ?? "") &&
        (painel?.textContent ?? "").split("7777777").length === (versao === 5 ? 3 : 2) &&
        /Protocolo não encontrado\./.test(painel?.textContent ?? ""),
      painel?.textContent,
    );
    igual(nome("falha: o numero que o servidor aceitou virou link"), c.links().length, 1);
    checar(nome("falha: o que falhou segue como texto"), c.texto().includes("7777777"), c.texto());
    checar(nome("falha: o window.alert foi devolvido"), c.win.alert === original);
  }

  // ---- erro do servidor com acento e HTML hostil: sempre texto ----
  {
    const c = montarCaso(versao, { paragrafos: ["SEI 1234567"] });
    c.servidor.set("1234567", { erro: `Inexistente <img src=x onerror=alert(1)> não achado` });
    c.g.converterNumerosSeiEmLotePro?.(null);
    clicar(dialogoAberto(c.doc) as HTMLElement, "Converter");
    await paraAMesa(c);
    const painel = c.doc.querySelector("#linkSeiLoteFalhas")?.closest("dialog") as HTMLElement | null;
    checar(
      nome("motivo hostil: aparece como texto, sem criar elemento"),
      !!painel && !painel.querySelector("img") && /img src=x onerror=alert\(1\)/.test(painel.textContent ?? ""),
      painel?.innerHTML,
    );
    checar(
      nome("motivo com acento chega inteiro (iso-8859-1)"),
      versao === 4 || (painel?.textContent ?? "").includes("não achado"),
      painel?.textContent,
    );
  }

  // ---- texto do documento hostil: o trecho da previa e texto ----
  {
    const c = montarCaso(versao, { paragrafos: [`<img src=x onerror=alert(1)> 1234567 <script>alert("x")</script> "&amp;`] });
    c.g.converterNumerosSeiEmLotePro?.(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    checar(
      nome("documento hostil: a previa mostra o texto e nao cria elementos"),
      !!d &&
        !d.querySelector("img, script") &&
        // (o linkedom quebra o texto em varios nos nas entidades; no navegador e um so)
        (versao === 4 || (d.textContent ?? "").includes("<img src=x onerror=alert(1)>")),
      d?.innerHTML,
    );
    igual(nome("documento hostil: acha o numero"), itens(d).length, 1);
  }

  // ---- varias secoes: a editavel entra, a somente leitura nao ----
  {
    const c = montarCaso(versao, {
      paragrafos: ["Corpo 1111111"],
      extra: "Extra 2222222",
      leitura: "Cabecalho 3333333",
      leituraPorClasse: versao === 5 ? "Titulo 4444444" : undefined,
    });
    c.servidor.set("1111111", { id: "9001" });
    c.servidor.set("2222222", { id: "9002" });
    c.g.converterNumerosSeiEmLotePro?.(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    const t = d.textContent ?? "";
    checar(
      nome("secoes: varre as editaveis e ignora as somente leitura (cabecalho e titulo)"),
      itens(d).length === 2 && t.includes("1111111") && t.includes("2222222") && !t.includes("3333333") && !t.includes("4444444"),
      t,
    );
    clicar(d, "Converter");
    await paraAMesa(c);
    checar(nome("secoes: converte na secao de cada numero"), c.links().length === 1 && !c.textoExtra().includes("2222222"), [
      c.links(),
      c.textoExtra(),
    ]);
  }

  // ---- somente leitura: nada onde escrever ----
  {
    const c = montarCaso(versao, { paragrafos: ["SEI 1234567"], tudoSomenteLeitura: true });
    c.g.converterNumerosSeiEmLotePro?.(null);
    checar(nome("somente leitura: recusa a escrita e nao abre dialogo"), c.recusas === 1 && c.dialogos().length === 0 && c.aviso() === "", [
      c.recusas,
      c.aviso(),
    ]);
  }

  // ---- teto do lote ----
  {
    const numeros = Array.from({ length: LOTE_TETO + 5 }, (_, i) => String(1000000 + i));
    const c = montarCaso(versao, { paragrafos: [numeros.join(" ")] });
    c.g.converterNumerosSeiEmLotePro?.(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    igual(nome("teto: lista no maximo LOTE_TETO ocorrencias"), itens(d).length, LOTE_TETO);
    checar(
      nome("teto: avisa quantas ficaram de fora"),
      /primeiras 300 ocorrências.*5 restantes/.test(d.textContent ?? ""),
      d.textContent?.slice(0, 400),
    );
    // converter com o teto: as que ficaram de fora nao contam como falha
    clicar(d, "Desmarcar todos");
    marcar(itens(d)[0] as HTMLInputElement, true);
    c.servidor.set("1000000", { id: "1" });
    clicar(d, "Converter");
    await paraAMesa(c);
    checar(
      nome("teto: as nao listadas continuam texto e nao sao falha"),
      /1 número convertido em link/.test(c.aviso()) && !c.doc.querySelector("#linkSeiLoteFalhas"),
      c.aviso(),
    );
  }

  // ---- singular ----
  {
    const c = montarCaso(versao, { paragrafos: ["SEI 1234567"] });
    c.servidor.set("1234567", { id: "4001" });
    c.g.converterNumerosSeiEmLotePro?.(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    checar(nome("singular: 'Encontrei 1 número'"), /Encontrei 1 número neste texto/.test(d.textContent ?? ""), d.textContent);
    clicar(d, "Converter");
    checar(nome("singular: 'Convertendo 1 número...'"), /Convertendo 1 número\.\.\./.test(c.aviso()), c.aviso());
    await paraAMesa(c);
    checar(nome("singular: '1 número convertido em link.'"), /1 número convertido em link\./.test(c.aviso()), c.aviso());
  }

  // ---- uma conversao por vez ----
  {
    const c = montarCaso(versao, { paragrafos: ["SEI 1234567 e 7654321"] });
    c.servidor.set("1234567", { id: "4001" });
    c.servidor.set("7654321", { id: "4002" });
    c.g.converterNumerosSeiEmLotePro?.(null);
    clicar(dialogoAberto(c.doc) as HTMLElement, "Converter");
    c.limparAvisos();
    c.g.converterNumerosSeiEmLotePro?.(null);
    checar(nome("em andamento: nova chamada so avisa"), /conversão em andamento/.test(c.aviso()) && c.dialogos().length === 0, c.aviso());
    await paraAMesa(c);
    await tique(10);
    c.limparAvisos();
    c.g.converterNumerosSeiEmLotePro?.(null);
    checar(nome("terminado o lote, libera de novo (nada mais a converter)"), /Nenhum número/.test(c.aviso()), c.aviso());
  }

  if (versao === 5) {
    // ---- CK5: falhas de rede e respostas estranhas ----
    const rodar = async (prep: (c: Caso) => void) => {
      const c = montarCaso(5, { paragrafos: ["SEI 1234567"] });
      prep(c);
      c.g.converterNumerosSeiEmLotePro?.(null);
      clicar(dialogoAberto(c.doc) as HTMLElement, "Converter");
      await paraAMesa(c);
      return (c.doc.querySelector("#linkSeiLoteFalhas")?.closest("dialog")?.textContent ?? "") + c.aviso();
    };
    checar(
      nome("sem URL de consulta do SEI: falha com o motivo"),
      (
        await rodar((c) => {
          c.win.INFRA_EDITOR_CONFIG.sei = undefined;
        })
      ).includes("O SEI não expôs o endereço de consulta de protocolo"),
    );
    const t1 = await rodar((c) => {
      c.ctx.fetch = (async () => {
        throw new Error("sem rede");
      }) as unknown as typeof fetch;
    });
    checar(nome("falha de rede: 'Falha ao consultar o SEI'"), /Falha ao consultar o SEI: Error: sem rede/.test(t1), t1);
    const t2 = await rodar((c) => {
      c.ctx.fetch = (async () => ({
        arrayBuffer: async () => new TextEncoder().encode("<complementos></complementos>").buffer,
      })) as unknown as typeof fetch;
    });
    checar(nome("resposta sem IdProtocolo: motivo proprio"), /Resposta do SEI sem o identificador do protocolo/.test(t2), t2);
    const t3 = await rodar((c) => {
      c.ctx.fetch = (async () => ({
        arrayBuffer: async () => new TextEncoder().encode("<erros><erro></erro></erros>").buffer,
      })) as unknown as typeof fetch;
    });
    checar(nome("erro sem descricao: mensagem padrao"), /Protocolo não encontrado\./.test(t3), t3);
  } else {
    // ---- CK4: dialogo travado e varias secoes ----
    const c = montarCaso(4, { paragrafos: ["SEI 1234567"] });
    c.servidor.set("1234567", { erro: "O documento nao pertence a este processo." });
    const estado = c.travarDialogoCk4();
    c.g.converterNumerosSeiEmLotePro?.(null);
    clicar(dialogoAberto(c.doc) as HTMLElement, "Converter");
    await paraAMesa(c);
    checar(nome("dialogo nativo que nao fecha: o recurso o fecha apos o limite e segue"), estado.escondeu >= 1, estado);
    const painel = c.doc.querySelector("#linkSeiLoteFalhas")?.closest("dialog") as HTMLElement | null;
    checar(
      nome("o motivo vem do alert() recolhido (o SEI nao e interrompido)"),
      /O documento nao pertence a este processo\./.test(painel?.textContent ?? ""),
      painel?.textContent,
    );

    // sem CKEDITOR.dom: a falha e listada, nao derruba o lote
    const d2 = montarCaso(4, { paragrafos: ["SEI 1234567"] });
    d2.win.CKEDITOR.dom = undefined;
    d2.g.converterNumerosSeiEmLotePro?.(null);
    clicar(dialogoAberto(d2.doc) as HTMLElement, "Converter");
    await paraAMesa(d2);
    checar(
      nome("sem a API de ranges do CK4: lista a falha"),
      /CKEditor 4 indisponível/.test(d2.doc.querySelector("#linkSeiLoteFalhas")?.closest("dialog")?.textContent ?? ""),
    );
  }
}
