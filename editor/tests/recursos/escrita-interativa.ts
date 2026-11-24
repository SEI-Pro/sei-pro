import { criarAdaptador } from "../../src/adaptador";
import {
  consultaValida,
  criarEscritaInterativa,
  detectarGatilho,
  type EscritaInterativa,
  escaparHtml,
  recurso as escrita,
  type ItemEscrita,
  normalizar,
} from "../../src/recursos/escrita-interativa";
import type { Contexto } from "../../src/recursos/tipos";
import { criarCk4, criarCk5, nosDoisEditores } from "../falsos";
import { checar, disparar, igual, secao, tique } from "../util";

// biome-ignore lint/suspicious/noExplicitAny: os falsos e os globais do monolito sao dinamicos
type Qualquer = any;

type Opcoes = Record<string, boolean>;

const ctxDe = (c: { win: Window; doc: Document }, opcoes: Opcoes = { escrivainterativa: true }): Contexto => ({
  adaptador: criarAdaptador(c.win),
  doc: c.doc,
  win: c.win,
  base: "chrome-extension://abc/",
  checkOpcao: () => true,
  verifyOpcao: (n) => opcoes[n] ?? false,
});

/** Silencia e conta os avisos do modulo. */
function capturarAvisos<T>(fn: () => T): { resultado: T; avisos: string[] } {
  const avisos: string[] = [];
  const original = console.warn;
  console.warn = (...a: unknown[]) => {
    avisos.push(a.map(String).join(" "));
  };
  try {
    return { resultado: fn(), avisos };
  } finally {
    console.warn = original;
  }
}

// ---------------------------------------------------------------- CK4 cru

/** Nos de texto de `raiz`, em ordem de documento. */
function textosDe(raiz: Node): Node[] {
  const out: Node[] = [];
  const anda = (n: Node) => {
    if (n.nodeType === 3) out.push(n);
    else for (const f of Array.from(n.childNodes)) anda(f);
  };
  anda(raiz);
  return out;
}

/** Texto de `bloco` ate o cursor (`no`, `off`). */
function textoAte(bloco: Node, no: Node, off: number): string {
  let s = "";
  let parar = false;
  const anda = (n: Node) => {
    if (parar) return;
    if (n === no) {
      if (n.nodeType === 3) s += (n as Text).data.slice(0, off);
      else
        for (const f of Array.from(n.childNodes).slice(0, off))
          s += textosDe(f)
            .map((t) => (t as Text).data)
            .join("");
      parar = true;
      return;
    }
    if (n.nodeType === 3) s += (n as Text).data;
    else for (const f of Array.from(n.childNodes)) anda(f);
  };
  anda(bloco);
  return s;
}

interface Selecionado {
  inicio: [Node, number];
  fim: [Node, number];
}

/** Um CK4 com a superficie crua que a escrita interativa usa (selecao, intervalos, iframe), em cima do falso comum. */
function montarCk4(html = "<p></p>", opcoes: Opcoes = { escrivainterativa: true }, somenteLeitura = false) {
  const ed = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html, somenteLeitura }] });
  const inst = ed.instancia("txaEditor_1") as Qualquer;
  const win = ed.win as Qualquer;
  win.CKEDITOR.POSITION_AFTER_START = 3;
  win.CKEDITOR.dom.node = class {
    constructor(readonly $: Node) {}
  };
  win.innerHeight = 800;
  win.innerWidth = 1200;
  const escutasPagina: Array<{ tipo: string; fn: () => void }> = [];
  win.addEventListener = (tipo: string, fn: () => void) => {
    escutasPagina.push({ tipo, fn });
  };
  const e = {
    bloco: inst.corpo.querySelector("p") as Element,
    cursor: null as { no: Node; off: number } | null,
    semRange: false,
    colapsada: true,
    selecionados: [] as Selecionado[],
    escutasIframe: [] as Array<{ tipo: string; fn: () => void }>,
    escutasEditor: [] as string[],
    retangulos: [{ right: 100, top: 10, bottom: 30, width: 5, height: 20 }] as Qualquer[],
    semSelecaoIframe: false,
  };
  const intervalo = (): Qualquer => ({
    collapsed: e.colapsada,
    clone: () => intervalo(),
    startPath: () => ({ block: e.bloco }),
    setStartAt: () => {},
    cloneContents: () => ({ $: { textContent: e.cursor ? textoAte(e.bloco, e.cursor.no, e.cursor.off) : "" } }),
  });
  inst.getSelection = () => ({ getRanges: () => (e.semRange || !e.cursor ? [] : [intervalo()]) });
  inst.createRange = () => {
    const r: Qualquer = {
      setStart(n: Qualquer, o: number) {
        r.i = [n.$, o];
      },
      setEnd(n: Qualquer, o: number) {
        r.f = [n.$, o];
      },
      select() {
        e.selecionados.push({ inicio: r.i, fim: r.f });
      },
    };
    return r;
  };
  const cursorNativo = () => e.cursor as { no: Node; off: number };
  inst.window = {
    $: {
      getSelection: () =>
        e.semSelecaoIframe
          ? { rangeCount: 0 }
          : {
              rangeCount: 1,
              getRangeAt: () => ({
                startContainer: cursorNativo().no,
                startOffset: cursorNativo().off,
                endContainer: cursorNativo().no,
                endOffset: cursorNativo().off,
                cloneRange: () => ({
                  startContainer: cursorNativo().no,
                  startOffset: cursorNativo().off,
                  setStart(no: Node, off: number) {
                    this.startContainer = no;
                    this.startOffset = off;
                  },
                  getClientRects: () => e.retangulos,
                }),
              }),
            },
      frameElement: { getBoundingClientRect: () => ({ left: 10, top: 20 }) },
      document: {
        body: e.bloco,
        createTreeWalker: (raiz: Node) => {
          const lista = textosDe(raiz);
          const w: Qualquer = {
            currentNode: null,
            previousNode() {
              const i = lista.indexOf(w.currentNode);
              if (i <= 0) return null;
              w.currentNode = lista[i - 1];
              return w.currentNode;
            },
          };
          return w;
        },
        createRange: () => {
          const r: Qualquer = {
            setStart(n: Node, o: number) {
              r.startContainer = n;
              r.startOffset = o;
            },
            setEnd(n: Node, o: number) {
              r.endContainer = n;
              r.endOffset = o;
            },
          };
          return r;
        },
      },
      addEventListener: (tipo: string, fn: () => void) => {
        e.escutasIframe.push({ tipo, fn });
      },
    },
  };
  const onOriginal = inst.on.bind(inst);
  inst.on = (ev: string, fn: () => void) => {
    e.escutasEditor.push(ev);
    onOriginal(ev, fn);
  };
  const ctx = ctxDe(ed, opcoes);
  return { ed, inst, win, ctx, e, escutasPagina, opcoes };
}

type Ck4 = ReturnType<typeof montarCk4>;

/** O texto coberto por uma selecao (dentro de um so no), ou so o que vem depois do inicio quando `ate` e falso. */
function trecho(s: Selecionado | undefined, ate = true): string {
  if (!s) return "<sem selecao>";
  return (s.inicio[0] as Text).data.slice(s.inicio[1], ate ? s.fim[1] : undefined);
}

/** Escreve o paragrafo (texto e `<b>`) e poe o cursor no fim do ultimo no de texto (ou no `off` dado). */
function escrever(k: Ck4, ...partes: Array<string | [string]>): Node[] {
  const p = k.e.bloco;
  while (p.firstChild) p.removeChild(p.firstChild);
  const nos: Node[] = [];
  for (const parte of partes) {
    if (typeof parte === "string") {
      const t = p.ownerDocument.createTextNode(parte);
      p.append(t);
      nos.push(t);
    } else {
      const b = p.ownerDocument.createElement("b");
      const t = p.ownerDocument.createTextNode(parte[0]);
      b.append(t);
      p.append(b);
      nos.push(t);
    }
  }
  const ultimo = nos[nos.length - 1] as Text;
  k.e.cursor = { no: ultimo, off: ultimo.data.length };
  return nos;
}

const lista = (k: Ck4): Element | null => k.ed.doc.querySelector("ul.seipro-escrita-lista");
const linhas = (k: Ck4): Element[] => [...k.ed.doc.querySelectorAll("ul.seipro-escrita-lista li")];
const textosLista = (k: Ck4): string[] => linhas(k).map((li) => (li.textContent ?? "").trim());
const ativo = (k: Ck4): number => linhas(k).findIndex((li) => li.classList.contains("ativo"));

const DADOS: Array<[string?, string?] | null> = [
  ["Número do Processo", "<b>00001.000001/2024-11</b>"],
  ["Interessado", "Fulano de Tal"],
  ["Número de Documentos", "3"],
  null,
  ["", "sem rotulo"],
  ["Sem valor", ""],
];

function instalarPagina(win: Qualquer, extra: Qualquer = {}): void {
  win.arrayDadosEditor = () => DADOS;
  win.dadosProcessoPro = {
    listDocumentos: [
      { id_protocolo: "111", documento: "Despacho", nr_sei: "0123456" },
      { id_protocolo: "222", documento: "Anexo sem numero", nr_sei: "" },
    ],
  };
  win.getCitacaoDoc = () => "SEI nº ";
  win.getConfigValue = () => undefined;
  Object.assign(win, extra);
}

const UNIDADES = [
  { id: "10", descricao: "SFIS - Superintendencia de Fiscalizacao" },
  { id: "11", descricao: "GAB - Gabinete SFIS" },
  { id: "12", descricao: "SF - Secretaria Fiscal" },
  { id: "13", descricao: "ASSFIS - Assessoria" },
  { id: "", descricao: "SEM ID - descartada" },
  { id: "14", descricao: "" },
];

export async function verificarEscritaInterativa(): Promise<void> {
  // ============================================================ contrato
  secao("recurso escrita-interativa: contrato");
  {
    const k = montarCk4();
    igual("id do recurso", escrita.id, "escrita-interativa");
    checar("tem iniciar", typeof escrita.iniciar === "function");
    const g = escrita.globais(k.ctx);
    igual("globais: so SeiProEscritaInterativa", Object.keys(g), ["SeiProEscritaInterativa"]);
    const api = g.SeiProEscritaInterativa as EscritaInterativa;
    igual("API: chaves", Object.keys(api).sort(), [
      "buscar",
      "ck4AoDigitar",
      "ck4Fechar",
      "ck4Tecla",
      "detectarGatilho",
      "instalarCK5",
      "provedores",
    ]);
    igual("API: provedores '#' e '@'", Object.keys(api.provedores).sort(), ["#", "@"]);
    checar("globais devolve a mesma instancia por contexto", (escrita.globais(k.ctx).SeiProEscritaInterativa as unknown) === api);
    checar("API.detectarGatilho e o do nucleo", api.detectarGatilho === detectarGatilho);
  }

  // ============================================================ nucleo puro
  secao("recurso escrita-interativa: detectarGatilho");
  igual("'#' sozinho no inicio", detectarGatilho("#"), { marcador: "#", consulta: "", inicio: 0 });
  igual("'@' sozinho no inicio", detectarGatilho("@"), { marcador: "@", consulta: "", inicio: 0 });
  igual("consulta depois do marcador", detectarGatilho("ver #proc"), { marcador: "#", consulta: "proc", inicio: 4 });
  igual("consulta com espaco no meio e permitida", detectarGatilho("#numero do"), { marcador: "#", consulta: "numero do", inicio: 0 });
  igual("nbsp na consulta vira espaco", detectarGatilho("#a b"), { marcador: "#", consulta: "a b", inicio: 0 });
  igual("e-mail nao e gatilho ('@' colado em letra)", detectarGatilho("fulano@orgao.gov.br"), null);
  igual("'#' no meio de palavra nao e gatilho", detectarGatilho("abc#def"), null);
  igual("espaco logo depois do marcador cancela", detectarGatilho("# abc"), null);
  igual("nbsp logo depois do marcador cancela", detectarGatilho("# abc"), null);
  igual("quebra de linha na consulta cancela", detectarGatilho("#abc\ndef"), null);
  igual("consulta com 40 caracteres passa", detectarGatilho(`#${"a".repeat(40)}`)?.consulta.length, 40);
  igual("consulta com 41 caracteres cancela", detectarGatilho(`#${"a".repeat(41)}`), null);
  igual("abre-parenteses antes vale", detectarGatilho("(#ab")?.inicio, 1);
  igual("colchete antes vale", detectarGatilho("[@ab")?.marcador, "@");
  igual("aspas retas antes valem", detectarGatilho('"#ab')?.marcador, "#");
  igual("aspas curvas antes valem", detectarGatilho("“#ab")?.marcador, "#");
  igual("nbsp antes vale", detectarGatilho("x #ab")?.consulta, "ab");
  igual("o gatilho mais proximo do cursor vence ('@' depois de '#')", detectarGatilho("#a @b")?.marcador, "@");
  igual("o gatilho mais proximo do cursor vence ('#' depois de '@')", detectarGatilho("@a #b")?.marcador, "#");
  igual("so o ULTIMO marcador de cada tipo conta", detectarGatilho("#a #b")?.consulta, "b");
  igual("o '#' invalido mais a frente nao anula o '@' valido", detectarGatilho("@abc x#")?.marcador, "@");
  igual("vazio", detectarGatilho(""), null);
  igual("sem marcador", detectarGatilho("texto comum"), null);
  igual("indefinido vira vazio", detectarGatilho(undefined as unknown as string), null);
  igual("marcadores customizados", detectarGatilho("x $ab", ["$"])?.consulta, "ab");
  igual("so os marcadores pedidos", detectarGatilho("#ab", ["@"]), null);
  igual("texto hostil: nao e interpretado", detectarGatilho("<img src=x onerror=alert(1)> #<b>")?.consulta, "<b>");

  secao("recurso escrita-interativa: utilitarios puros");
  igual("consultaValida: texto comum", consultaValida("abc"), true);
  igual("consultaValida: vazio vale", consultaValida(""), true);
  igual("consultaValida: espaco no inicio nao", consultaValida(" a"), false);
  igual("consultaValida: nbsp no inicio nao", consultaValida(" a"), false);
  igual("consultaValida: quebra de linha nao", consultaValida("a\nb"), false);
  igual("consultaValida: acima de 40 nao", consultaValida("a".repeat(41)), false);
  igual("consultaValida: nao-texto nao", consultaValida(42), false);
  igual("normalizar: tira acento e baixa a caixa", normalizar("Ação É"), "acao e");
  igual("normalizar: nulo vira vazio", normalizar(null), "");
  igual("escaparHtml: escapa & < > e aspas", escaparHtml(`<a href="x">&</a>`), "&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;");
  igual("escaparHtml: nulo vira vazio", escaparHtml(undefined), "");

  // ============================================================ provedor '#'
  secao("recurso escrita-interativa: provedor '#' (campos do processo)");
  {
    const k = montarCk4();
    instalarPagina(k.win);
    const api = criarEscritaInterativa(k.ctx).api;
    const todos = await api.buscar("#", "");
    igual(
      "sem consulta: dados validos + documentos, na ordem",
      todos.map((i) => i.rotulo),
      ["Número do Processo", "Interessado", "Número de Documentos", "Despacho (0123456)", "Anexo sem numero"],
    );
    igual(
      "ids sequenciais '#seiproN'",
      todos.map((i) => i.id),
      ["#seipro0", "#seipro1", "#seipro2", "#seipro3", "#seipro4"],
    );
    igual(
      "tipos",
      todos.map((i) => i.tipo),
      ["dado", "dado", "dado", "documento", "documento"],
    );
    igual("seiPro 'campo' e text = rotulo", [todos[0]?.seiPro, todos[0]?.text], ["campo", "Número do Processo"]);
    igual("valor do dado vai como HTML", todos[0]?.html, "<b>00001.000001/2024-11</b>");
    igual(
      "documento com numero SEI: titulo + citacao + link",
      todos[3]?.html,
      'Despacho&nbsp;(SEI nº <span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei111" style="text-indent:0;">0123456</a></span>)',
    );
    igual(
      "documento sem numero SEI (citacao 3): so o link com o nome",
      todos[4]?.html,
      '<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei222" style="text-indent:0;">Anexo sem numero</a></span>',
    );
    k.win.getConfigValue = (n: string) => (n === "citacaodoc" ? "citacaodoc_4" : undefined);
    igual(
      "citacaodoc_4: documento sem numero tambem leva titulo + citacao",
      (await api.buscar("#", "anexo"))[0]?.html,
      'Anexo sem numero&nbsp;(SEI nº <span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei222" style="text-indent:0;">Anexo sem numero</a></span>)',
    );
    k.win.getConfigValue = () => undefined;
    igual(
      "filtro ignora acento e caixa",
      (await api.buscar("#", "NUMERO")).map((i) => i.rotulo),
      ["Número do Processo", "Número de Documentos", "Anexo sem numero"],
    );
    igual(
      "sem prefixo: ordem original preservada",
      (await api.buscar("#", "do")).map((i) => i.rotulo),
      ["Número do Processo", "Interessado", "Número de Documentos"],
    );
    igual("sem resultado", await api.buscar("#", "zzzz"), []);
    igual(
      "ids refeitos depois do filtro",
      (await api.buscar("#", "numero")).map((i) => i.id),
      ["#seipro0", "#seipro1", "#seipro2"],
    );

    // ordenacao: prefixo antes de "contem"
    k.win.arrayDadosEditor = () => [
      ["Processo anterior", "a"],
      ["Numero do processo", "b"],
      ["Processo", "c"],
    ];
    k.win.dadosProcessoPro = { listDocumentos: [] };
    igual(
      "ordem por relevancia: quem COMECA com a consulta primeiro (estavel)",
      (await api.buscar("#", "proc")).map((i) => i.rotulo),
      ["Processo anterior", "Processo", "Numero do processo"],
    );

    // limite de 60
    k.win.arrayDadosEditor = () => Array.from({ length: 100 }, (_, i) => [`Campo ${i}`, `v${i}`] as [string, string]);
    igual("limite de 60 itens", (await api.buscar("#", "")).length, 60);

    // texto hostil e escapes
    k.win.arrayDadosEditor = () => [];
    k.win.dadosProcessoPro = {
      listDocumentos: [{ id_protocolo: '1"><script>x</script>', documento: "<img src=x onerror=alert(1)>", nr_sei: "9" }],
    };
    const hostil = (await api.buscar("#", ""))[0] as ItemEscrita;
    igual("hostil: o rotulo e so texto", hostil.rotulo, "<img src=x onerror=alert(1)> (9)");
    checar("hostil: o HTML do item nao tem <img nem <script", !/<img|<script/i.test(hostil.html), hostil.html);
    // textoParaHtmlPro do monolito, quando existe, e quem escapa
    k.win.textoParaHtmlPro = (t: string) => `[${t}]`;
    checar("usa textoParaHtmlPro do monolito quando existe", (await api.buscar("#", ""))[0]?.html.includes("[9]") === true);
    k.win.textoParaHtmlPro = undefined;

    // falhas de terceiros nao derrubam
    k.win.arrayDadosEditor = () => {
      throw new Error("falhou");
    };
    k.win.dadosProcessoPro = { listDocumentos: [{ id_protocolo: "1", documento: "Oficio", nr_sei: "5" }] };
    const falha = capturarAvisos(() => api.buscar("#", ""));
    igual(
      "arrayDadosEditor que lanca: os documentos continuam",
      (await falha.resultado).map((i) => i.rotulo),
      ["Oficio (5)"],
    );
    checar(
      "... e avisa no console",
      falha.avisos.some((a) => a.includes("dados do processo")),
    );

    k.win.arrayDadosEditor = undefined;
    k.win.dadosProcessoPro = undefined;
    igual("sem arrayDadosEditor nem documentos: lista vazia", await api.buscar("#", ""), []);
    k.win.dadosProcessoPro = { listDocumentos: [null, { id_protocolo: "1" }] };
    igual("documento nulo ou sem nome e ignorado", await api.buscar("#", ""), []);
    k.win.dadosProcessoPro = { listDocumentos: [{ id_protocolo: "7", documento: "Sem nr" }] };
    igual("nr_sei ausente conta como vazio", (await api.buscar("#", ""))[0]?.rotulo, "Sem nr");
  }

  // ============================================================ buscar (portas)
  secao("recurso escrita-interativa: buscar (portas de entrada)");
  {
    const k = montarCk4();
    instalarPagina(k.win);
    const api = criarEscritaInterativa(k.ctx).api;
    igual("marcador desconhecido", await api.buscar("$", "a"), []);
    igual("consulta invalida (comeca com espaco)", await api.buscar("#", " a"), []);
    igual("consulta longa demais", await api.buscar("#", "a".repeat(41)), []);
    igual("consulta nao-texto", await api.buscar("#", 5), []);
    k.opcoes.escrivainterativa = false;
    igual("opcao desligada: nada, mesmo com dados", await api.buscar("#", ""), []);
    k.opcoes.escrivainterativa = true;
    checar("opcao ligada de novo: volta a responder", (await api.buscar("#", "")).length > 0);
    // opcao e lida a cada consulta
    const k2 = montarCk4();
    instalarPagina(k2.win);
    k2.ctx.verifyOpcao = () => {
      throw new Error("sem config");
    };
    igual("verifyOpcao que lanca conta como desligada", await criarEscritaInterativa(k2.ctx).api.buscar("#", ""), []);
  }

  // ============================================================ provedor '@'
  secao("recurso escrita-interativa: provedor '@' (unidades)");
  {
    const k = montarCk4();
    instalarPagina(k.win);
    const chamadas: string[] = [];
    k.win.getInteressadosProcesso = (q: string, cb: (l: unknown) => void) => {
      chamadas.push(q);
      cb(UNIDADES);
    };
    const api = criarEscritaInterativa(k.ctx).api;
    igual("consulta curta (1 letra) nao vai ao servidor", await api.buscar("@", "s"), []);
    checar("... e nao consultou", !chamadas.includes("s"));
    const itens = await api.buscar("@", "sfis");
    igual(
      "ordena por relevancia da sigla: igual, comeca, contem, resto; empate por sigla mais curta",
      itens.map((i) => i.sigla),
      ["SFIS", "ASSFIS", "SF", "GAB"],
    );
    igual("itens sem id ou sem descricao sao descartados", itens.length, 4);
    const sfis = itens[0] as ItemEscrita;
    igual(
      "campos do item",
      [sfis.id, sfis.seiPro, sfis.idUnidade, sfis.sigla, sfis.nome, sfis.rank],
      ["@seipro10", "unidade", "10", "SFIS", "Superintendencia de Fiscalizacao", 0],
    );
    igual(
      "html: ancora interessadoSeiPro com data-id",
      sfis.html,
      '<span class="ancoraSei interessadoSeiPro" data-id="10" style="text-indent:0px;">SFIS - Superintendencia de Fiscalizacao</span>',
    );
    const n = chamadas.length;
    await api.buscar("@", "SFIS");
    igual("mesma consulta (sem acento/caixa) vem do cache", chamadas.length, n);
    await api.buscar("@", "sf");
    igual("outra consulta vai ao servidor", chamadas.length, n + 1);
    igual("'@' dentro da consulta nao busca", await api.buscar("@", "ab@cd"), []);

    // aquecimento no '@' sozinho: uma unica vez
    await api.buscar("@", "");
    await api.buscar("@", "");
    igual("'@' sem consulta aquece UMA vez (consulta vazia ao servidor)", chamadas.filter((q) => q === "").length, 1);
    k.win.linkPesquisaInteressado = "ja descoberto";
    const k3 = montarCk4();
    instalarPagina(k3.win);
    const c3: string[] = [];
    k3.win.getInteressadosProcesso = (q: string, cb: (l: unknown) => void) => {
      c3.push(q);
      cb([]);
    };
    k3.win.linkPesquisaInteressado = "http://x";
    await criarEscritaInterativa(k3.ctx).api.buscar("@", "");
    igual("com o link do autocompletar ja descoberto, nao aquece", c3, []);

    // limite de 30
    const muitas = Array.from({ length: 50 }, (_, i) => ({ id: String(i + 1), descricao: `U${i} - Nome ${i}` }));
    k.win.getInteressadosProcesso = (_q: string, cb: (l: unknown) => void) => cb(muitas);
    igual("limite de 30 unidades", (await api.buscar("@", "nome")).length, 30);

    // hostil
    k.win.getInteressadosProcesso = (_q: string, cb: (l: unknown) => void) =>
      cb([{ id: '1"><script>', descricao: "<img src=x onerror=1> - <b>x</b>" }]);
    const h = (await api.buscar("@", "img"))[0] as ItemEscrita;
    checar("hostil: o html da unidade nao tem tag crua", !/<img|<script|<b>/.test(h.html), h.html);
    checar("hostil: o id fica escapado no data-id", h.html.includes('data-id="1&quot;&gt;&lt;script&gt;"'), h.html);
  }

  secao("recurso escrita-interativa: provedor '@' (falhas do servidor)");
  {
    const mk = (corpo: (q: string, cb: (l: unknown) => void) => void, tempo = 30) => {
      const k = montarCk4();
      instalarPagina(k.win);
      if (corpo) k.win.getInteressadosProcesso = corpo;
      return { k, api: criarEscritaInterativa(k.ctx, { tempoLimiteUnidadesMs: tempo }).api };
    };
    {
      const { api } = mk(() => {});
      igual("servidor que nunca responde: vazio no tempo limite", await api.buscar("@", "sfis"), []);
    }
    {
      let cb2: ((l: unknown) => void) | null = null;
      const { api } = mk((_q, cb) => {
        cb2 = cb;
      }, 10);
      const r = api.buscar("@", "sfis");
      await tique(40);
      igual("depois do tempo limite o resultado e vazio", await r, []);
      (cb2 as unknown as (l: unknown) => void)(UNIDADES);
    }
    {
      const { api } = mk(() => {
        throw new Error("rede");
      });
      igual("getInteressadosProcesso que lanca: vazio", await api.buscar("@", "sfis"), []);
    }
    {
      const { api } = mk((_q, cb) => cb("nao e lista"));
      igual("resposta que nao e lista: vazio", await api.buscar("@", "sfis"), []);
    }
    {
      let n = 0;
      const { api } = mk((_q, cb) => {
        n += 1;
        cb(n === 1 ? [] : UNIDADES);
      });
      await api.buscar("@", "sfis");
      igual("resposta vazia nao e cacheada (tenta de novo)", (await api.buscar("@", "sfis")).length, 4);
    }
    {
      let n = 0;
      const { api } = mk((_q, cb) => {
        n += 1;
        cb(UNIDADES);
        cb([]);
      });
      igual("callback chamado duas vezes: vale a primeira", (await api.buscar("@", "sfis")).length, 4);
      igual("... uma consulta", n, 1);
    }
    {
      const k = montarCk4();
      instalarPagina(k.win);
      igual("sem getInteressadosProcesso na pagina: vazio", await criarEscritaInterativa(k.ctx).api.buscar("@", "sfis"), []);
    }
  }

  // ============================================================ CK4: lista propria
  secao("recurso escrita-interativa: CK4 - abrir, navegar e escolher");
  {
    const k = montarCk4();
    instalarPagina(k.win);
    const api = criarEscritaInterativa(k.ctx).api;
    escrever(k, "ver #");
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("'#' abre a lista no documento da pagina (fora do iframe)", lista(k) !== null && k.ed.doc.body.contains(lista(k)));
    igual("itens listados", textosLista(k), [
      "Número do Processo",
      "Interessado",
      "Número de Documentos",
      "Despacho (0123456)",
      "Anexo sem numero",
    ]);
    igual("primeiro item ativo", ativo(k), 0);
    checar("a lista fica fora do corpo do editor", !k.inst.corpo.querySelector(".seipro-escrita-lista"));
    checar("o CSS e injetado uma vez", k.ed.doc.querySelectorAll("#seipro-escrita-css").length === 1);
    checar(
      "a lista e posicionada abaixo do cursor (top = frame.top + bottom + 4)",
      (lista(k) as HTMLElement).style.top === "54px",
      (lista(k) as HTMLElement).style.top,
    );
    checar(
      "... e a esquerda no fim do cursor (frame.left + right)",
      (lista(k) as HTMLElement).style.left === "110px",
      (lista(k) as HTMLElement).style.left,
    );
    const primeiro = linhas(k)[0] as Element;
    checar(
      "item tem icone de hashtag e texto",
      !!primeiro.querySelector("i.fa-hashtag") && !!primeiro.querySelector("span.seipro-escrita-texto"),
    );
    checar("documento tem icone de arquivo", !!linhas(k)[3]?.querySelector("i.fa-file-alt"));

    igual("seta para baixo consome a tecla", api.ck4Tecla(k.inst, 40), true);
    igual("... e destaca o segundo", ativo(k), 1);
    api.ck4Tecla(k.inst, 38);
    api.ck4Tecla(k.inst, 38);
    igual("seta para cima do primeiro volta ao ultimo", ativo(k), 4);
    api.ck4Tecla(k.inst, 40);
    igual("seta para baixo do ultimo volta ao primeiro", ativo(k), 0);
    igual("tecla comum nao e consumida", api.ck4Tecla(k.inst, 65), false);
    igual("tecla de outro editor nao e consumida", api.ck4Tecla({}, 40), false);

    api.ck4Tecla(k.inst, 40);
    const antes = k.inst.snapshots;
    k.inst.eventosDisparados.length = 0;
    escrever(k, "ver #");
    igual("Enter escolhe o item ativo e consome a tecla", api.ck4Tecla(k.inst, 13), true);
    igual("insere o HTML do item + nbsp", k.inst.inseridos.at(-1), "Fulano de Tal&nbsp;");
    checar("a lista fecha ao escolher", lista(k) === null);
    igual(
      "a selecao cobre o '#' e a consulta (1 + 0 caracteres)",
      k.e.selecionados.map((s) => [(s.inicio[0] as Text).data.slice(s.inicio[1], s.fim[1])]),
      [["#"]],
    );
    checar("snapshot antes e depois", k.inst.snapshots - antes === 2, k.inst.snapshots - antes);
    const ev = k.inst.eventosDisparados as string[];
    igual(
      "undo agrupado: save, lock, (insere), unlock, save",
      ev.filter((x) => /Snapshot/.test(x)),
      ["saveSnapshot", "lockSnapshot", "unlockSnapshot", "saveSnapshot"],
    );
    checar("foco volta ao editor", k.inst.focos >= 1);
    igual("depois de fechada, tecla nao e consumida", api.ck4Tecla(k.inst, 13), false);
  }

  secao("recurso escrita-interativa: CK4 - filtro, Tab, Esc e clique");
  {
    const k = montarCk4();
    instalarPagina(k.win);
    const api = criarEscritaInterativa(k.ctx).api;
    escrever(k, "#numero");
    api.ck4AoDigitar(k.inst);
    await tique();
    igual("digitar filtra a lista", textosLista(k), ["Número do Processo", "Número de Documentos", "Anexo sem numero"]);
    igual("Tab tambem escolhe", api.ck4Tecla(k.inst, 9), true);
    igual(
      "... o item filtrado, com a selecao de '#numero' (7 caracteres)",
      [k.inst.inseridos.at(-1), k.e.selecionados.length],
      ["<b>00001.000001/2024-11</b>&nbsp;", 1],
    );
    igual("... selecao cobre '#numero'", trecho(k.e.selecionados[0]), "#numero");

    escrever(k, "#abc");
    api.ck4AoDigitar(k.inst);
    await tique();
    igual("'#' com consulta sem resultado mostra a linha 'vazio'", textosLista(k), ["Nenhum resultado encontrado"]);
    checar("a linha vazia nao e um item (sem data-i)", linhas(k)[0]?.getAttribute("data-i") === null);
    igual("Enter na lista vazia fecha e NAO consome a tecla", api.ck4Tecla(k.inst, 13), false);
    checar("... lista fechada", lista(k) === null);

    escrever(k, "ver #");
    api.ck4AoDigitar(k.inst);
    await tique();
    igual("Esc consome e fecha", api.ck4Tecla(k.inst, 27), true);
    checar("... sem lista", lista(k) === null);

    // clique escolhe; mouseover destaca
    escrever(k, "#");
    api.ck4AoDigitar(k.inst);
    await tique();
    disparar(linhas(k)[2] as Element, "mouseover");
    igual("mouseover destaca o item", ativo(k), 2);
    const n = k.inst.inseridos.length;
    disparar(linhas(k)[1] as Element, "mousedown");
    igual("mousedown escolhe o item clicado", [k.inst.inseridos.length, k.inst.inseridos.at(-1)], [n + 1, "Fulano de Tal&nbsp;"]);
    checar("... e fecha a lista", lista(k) === null);
  }

  secao("recurso escrita-interativa: CK4 - '@' unidades e gatilhos que nao abrem");
  {
    const k = montarCk4();
    instalarPagina(k.win);
    k.win.getInteressadosProcesso = (_q: string, cb: (l: unknown) => void) => cb(UNIDADES);
    const api = criarEscritaInterativa(k.ctx).api;
    escrever(k, "enviar a @sf");
    api.ck4AoDigitar(k.inst);
    await tique();
    igual("'@sf' lista as unidades por relevancia", textosLista(k).length, 4);
    checar(
      "unidade tem icone de predio e sigla em negrito",
      !!linhas(k)[0]?.querySelector("i.fa-building") && linhas(k)[0]?.querySelector("b")?.textContent === "SF",
    );
    checar(
      "a descricao completa e o title",
      ((linhas(k)[0] as Element).querySelector(".seipro-escrita-texto") as HTMLElement).title.startsWith("SF - "),
    );
    api.ck4Tecla(k.inst, 13);
    checar(
      "escolher a unidade insere a ancora interessadoSeiPro",
      String(k.inst.inseridos.at(-1)).startsWith('<span class="ancoraSei interessadoSeiPro" data-id="12"'),
      k.inst.inseridos.at(-1),
    );
    igual("... com nbsp no fim", String(k.inst.inseridos.at(-1)).endsWith("</span>&nbsp;"), true);

    escrever(k, "@");
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("'@' sozinho nao abre lista vazia", lista(k) === null);
    escrever(k, "@s");
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("'@s' (curto) nao abre", lista(k) === null);
    k.win.getInteressadosProcesso = (_q: string, cb: (l: unknown) => void) => cb([]);
    escrever(k, "@zzzz");
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("'@' sem unidade nao abre lista vazia", lista(k) === null);
    escrever(k, "fulano@orgao");
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("e-mail nao abre", lista(k) === null);
    escrever(k, "texto comum");
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("sem marcador nao abre", lista(k) === null);
  }

  secao("recurso escrita-interativa: CK4 - bordas (editor, opcao, selecao, somente leitura)");
  {
    const k = montarCk4();
    instalarPagina(k.win);
    const api = criarEscritaInterativa(k.ctx).api;
    const { avisos } = capturarAvisos(() => api.ck4AoDigitar(null));
    checar("editor ausente: nao lanca nem avisa", avisos.length === 0);
    escrever(k, "#");
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("lista aberta", lista(k) !== null);
    k.opcoes.escrivainterativa = false;
    api.ck4AoDigitar(k.inst);
    checar("opcao desligada fecha a lista aberta", lista(k) === null);
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("... e nao abre de novo", lista(k) === null);
    k.opcoes.escrivainterativa = true;

    k.e.colapsada = false;
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("selecao NAO vazia (nao colapsada): nao abre", lista(k) === null);
    k.e.colapsada = true;
    k.e.semRange = true;
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("sem intervalo: nao abre", lista(k) === null);
    k.e.semRange = false;
    const original = k.inst.getSelection;
    k.inst.getSelection = () => {
      throw new Error("sem selecao");
    };
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("getSelection que lanca: nao abre nem lanca", lista(k) === null);
    k.inst.getSelection = original;

    k.e.semSelecaoIframe = true;
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("sem selecao nativa no iframe (sem retangulo): nao deixa lista pendurada", lista(k) === null);
    k.e.semSelecaoIframe = false;

    k.inst.readOnly = true;
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("secao somente leitura: nao abre", lista(k) === null);
    k.inst.readOnly = false;
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("editavel de novo: abre", lista(k) !== null);

    // retangulo vazio (cursor sem largura): usa o caractere anterior; sem retangulos nenhum: cai no elemento
    k.e.retangulos = [];
    (k.e.bloco as Qualquer).getBoundingClientRect = () => ({ right: 50, top: 5, bottom: 25 });
    api.ck4Fechar();
    escrever(k, "ver #a");
    api.ck4AoDigitar(k.inst);
    await tique();
    checar(
      "sem retangulo do cursor: usa o do elemento pai do texto",
      lista(k) !== null && (lista(k) as HTMLElement).style.top === "49px",
      (lista(k) as HTMLElement | null)?.style.top,
    );
    api.ck4Fechar();
    (k.e.bloco as Qualquer).getBoundingClientRect = () => {
      throw new Error("sem layout");
    };
    escrever(k, "ver #b");
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("sem nenhum retangulo (a medida lanca): fecha a lista em vez de deixa-la solta", lista(k) === null);
    checar("ck4Fechar fecha", lista(k) === null);
    api.ck4Fechar();
  }

  secao("recurso escrita-interativa: CK4 - o ultimo resultado vence (corrida)");
  {
    const k = montarCk4();
    instalarPagina(k.win);
    const pend: Array<{ q: string; cb: (l: unknown) => void }> = [];
    k.win.getInteressadosProcesso = (q: string, cb: (l: unknown) => void) => pend.push({ q, cb });
    const api = criarEscritaInterativa(k.ctx).api;
    escrever(k, "@sf");
    api.ck4AoDigitar(k.inst);
    escrever(k, "@sfi");
    api.ck4AoDigitar(k.inst);
    await tique();
    igual(
      "duas consultas pendentes",
      pend.map((p) => p.q),
      ["sf", "sfi"],
    );
    pend[1]?.cb([{ id: "1", descricao: "SFI - segunda" }]);
    await tique();
    igual("a segunda abre a lista", textosLista(k), ["SFI — segunda"]);
    pend[0]?.cb([{ id: "2", descricao: "SF - primeira" }]);
    await tique();
    igual("a primeira (tardia) NAO sobrescreve", textosLista(k), ["SFI — segunda"]);

    // mesma consulta de novo: nao refaz
    const n = pend.length;
    api.ck4AoDigitar(k.inst);
    await tique();
    igual("mesmo gatilho/consulta/posicao: nao consulta de novo", pend.length, n);
    // digitou outra coisa enquanto a resposta nao chegou: fechar invalida a pendente
    escrever(k, "@sfix");
    api.ck4AoDigitar(k.inst);
    escrever(k, "sem marcador");
    api.ck4AoDigitar(k.inst);
    pend.at(-1)?.cb([{ id: "3", descricao: "SFIX - terceira" }]);
    await tique();
    checar("resposta que chega depois de o gatilho sumir e descartada", lista(k) === null);
  }

  secao("recurso escrita-interativa: CK4 - selecao do trecho a trocar");
  {
    const k = montarCk4();
    instalarPagina(k.win);
    const api = criarEscritaInterativa(k.ctx).api;
    // o gatilho atravessa dois nos de texto: "ver #" + <b>nu</b>
    const nos = escrever(k, "ver #", ["nu"]);
    k.e.cursor = { no: nos[1] as Node, off: 2 };
    api.ck4AoDigitar(k.inst);
    await tique();
    igual("gatilho atravessando nos: lista aberta com o filtro", textosLista(k), [
      "Número do Processo",
      "Número de Documentos",
      "Anexo sem numero",
    ]);
    api.ck4Tecla(k.inst, 13);
    const s = k.e.selecionados[0] as Selecionado;
    igual("a selecao comeca no '#' do no anterior", [(s.inicio[0] as Text).data, s.inicio[1]], ["ver #", 4]);
    igual("... e termina no cursor", [(s.fim[0] as Text).data, s.fim[1]], ["nu", 2]);

    // cursor posto em elemento (apos o ultimo filho): desce ate o texto
    const k2 = montarCk4();
    instalarPagina(k2.win);
    const api2 = criarEscritaInterativa(k2.ctx).api;
    escrever(k2, "ver #");
    k2.e.cursor = { no: k2.e.bloco, off: 1 };
    api2.ck4AoDigitar(k2.inst);
    await tique();
    checar("cursor em elemento: lista abre", lista(k2) !== null);
    api2.ck4Tecla(k2.inst, 13);
    igual("... e a selecao cobre o '#'", k2.e.selecionados.length, 1);
    igual("... texto trocado", trecho(k2.e.selecionados[0], false), "#");

    // sem texto antes do cursor para cobrir a consulta: nao insere
    const k3 = montarCk4();
    instalarPagina(k3.win);
    const api3 = criarEscritaInterativa(k3.ctx).api;
    const nos3 = escrever(k3, "#abc");
    api3.ck4AoDigitar(k3.inst);
    await tique();
    k3.e.cursor = { no: nos3[0] as Node, off: 1 };
    api3.ck4Tecla(k3.inst, 13);
    igual("cursor deslocado (so 1 caractere antes, consulta pede 4): nao insere nada", k3.inst.inseridos.length, 0);

    // sem selecao nativa na hora de escolher
    const k4 = montarCk4();
    instalarPagina(k4.win);
    const api4 = criarEscritaInterativa(k4.ctx).api;
    escrever(k4, "#");
    api4.ck4AoDigitar(k4.inst);
    await tique();
    k4.e.semSelecaoIframe = true;
    api4.ck4Tecla(k4.inst, 13);
    igual("sem selecao nativa ao escolher: nao insere", k4.inst.inseridos.length, 0);

    // secao fica somente leitura entre abrir e escolher: o adaptador recusa a escrita
    const k5 = montarCk4();
    instalarPagina(k5.win);
    const api5 = criarEscritaInterativa(k5.ctx).api;
    escrever(k5, "#");
    api5.ck4AoDigitar(k5.inst);
    await tique();
    let recusas = 0;
    k5.ctx.adaptador.aoRecusarEscrita(() => {
      recusas += 1;
    });
    k5.inst.readOnly = true;
    api5.ck4Tecla(k5.inst, 13);
    igual("somente leitura ao escolher: nada e inserido", k5.inst.inseridos.length, 0);
    igual("... e a recusa e avisada", recusas, 1);
  }

  secao("recurso escrita-interativa: CK4 - ligacao idempotente e fechamentos");
  {
    const k = montarCk4();
    instalarPagina(k.win);
    const api = criarEscritaInterativa(k.ctx).api;
    escrever(k, "#");
    api.ck4AoDigitar(k.inst);
    api.ck4AoDigitar(k.inst);
    api.ck4AoDigitar(k.inst);
    await tique();
    igual("ouvintes do editor: blur e destroy, uma vez cada", k.e.escutasEditor.filter((x) => x === "blur" || x === "destroy").sort(), [
      "blur",
      "destroy",
    ]);
    igual("rolagem do iframe: um so ouvinte", k.e.escutasIframe.filter((x) => x.tipo === "scroll").length, 1);
    igual("rolagem da pagina: um so ouvinte", k.escutasPagina.filter((x) => x.tipo === "scroll").length, 1);
    checar("a bandeira legada _seiProEscrita fica no editor", k.inst._seiProEscrita === true);
    // segundo editor (outra instancia): liga o seu, mas a pagina so uma vez
    const k2 = montarCk4();
    instalarPagina(k2.win);

    k.inst.fire("blur");
    checar("blur do editor fecha a lista", lista(k) === null);
    escrever(k, "#");
    api.ck4AoDigitar(k.inst);
    await tique();
    checar("reabre", lista(k) !== null);
    k.inst.fire("destroy");
    checar("destroy do editor fecha a lista", lista(k) === null);
    api.ck4AoDigitar(k.inst);
    await tique();
    k.e.escutasIframe.find((x) => x.tipo === "scroll")?.fn();
    checar("rolagem do iframe fecha a lista", lista(k) === null);
    api.ck4AoDigitar(k.inst);
    await tique();
    k.escutasPagina.find((x) => x.tipo === "scroll")?.fn();
    checar("rolagem da pagina fecha a lista", lista(k) === null);
    k.escutasPagina.find((x) => x.tipo === "scroll")?.fn();

    // iframe sem janela: nao quebra a ligacao
    const k6 = montarCk4();
    instalarPagina(k6.win);
    k6.inst.window = undefined;
    escrever(k6, "#");
    const r = capturarAvisos(() => criarEscritaInterativa(k6.ctx).api.ck4AoDigitar(k6.inst));
    checar("editor sem janela do iframe: nao lanca", r.avisos.length === 0);
  }

  secao("recurso escrita-interativa: CK4 - posicao quando falta espaco");
  {
    const k = montarCk4();
    instalarPagina(k.win);
    const api = criarEscritaInterativa(k.ctx).api;
    const proto = Object.getPrototypeOf(k.ed.doc.createElement("ul"));
    Object.defineProperty(proto, "offsetHeight", { configurable: true, get: () => 300 });
    Object.defineProperty(proto, "offsetWidth", { configurable: true, get: () => 500 });
    try {
      k.e.retangulos = [{ right: 100, top: 700, bottom: 720, width: 5, height: 20 }];
      escrever(k, "#");
      api.ck4AoDigitar(k.inst);
      await tique();
      const el = lista(k) as HTMLElement;
      // frame.top 20: top 720, bottom 740; 740+4+300 > 800 e 720-4-300 > 0 => acima do cursor
      checar("sem espaco abaixo: abre ACIMA do cursor", el.style.top === "416px", el.style.top);
      api.ck4Fechar();
      k.win.innerWidth = 400;
      k.e.retangulos = [{ right: 600, top: 10, bottom: 30, width: 5, height: 20 }];
      api.ck4AoDigitar(k.inst);
      await tique();
      checar(
        "sem espaco a direita: nunca passa de 4px a esquerda (minimo)",
        (lista(k) as HTMLElement).style.left === "4px",
        (lista(k) as HTMLElement).style.left,
      );
    } finally {
      Reflect.deleteProperty(proto, "offsetHeight");
      Reflect.deleteProperty(proto, "offsetWidth");
    }
  }

  // ============================================================ CK5
  secao("recurso escrita-interativa: CK5 - instalacao no plugin Mention");
  {
    /** MentionUI falso: configuracoes por marcador, o TextWatcher e a vista com prioridade de ouvintes. */
    const montarMention = (opts: { comArroba?: boolean; limite?: number; semApi?: boolean; semView?: boolean } = {}) => {
      const k = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>texto</p>", principal: true }] });
      const ctx = ctxDe(k);
      const log = {
        watchers: [] as unknown[],
        removidoMarcador: 0,
        inseridos: [] as Qualquer[],
        selecao: [] as unknown[],
        foco: 0,
        erro: false,
      };
      const handlers: Array<{ ev: string; fn: (e: Qualquer, d: Qualquer) => void; prioridade: string }> = [];
      const nativo = {
        feedCallback: (_q: string) => [{ id: "@ano@", text: "@ano@" }],
        itemRenderer: (i: Qualquer) => `nativo:${i.id}`,
        dropdownLimit: opts.limite,
      };
      const configs = new Map<string, Qualquer>(opts.comArroba === false ? [] : [["@", nativo]]);
      const mui: Qualquer = {
        _mentionsConfigurations: configs,
        _setupTextWatcher: (m: unknown) => log.watchers.push(m),
        _mentionsView: {
          on: (ev: string, fn: (e: Qualquer, d: Qualquer) => void, o: { priority: string }) =>
            handlers.push({ ev, fn, prioridade: o?.priority }),
        },
        _hideUIAndRemoveMarker: () => {
          log.removidoMarcador += 1;
        },
      };
      if (opts.semApi) delete mui._setupTextWatcher;
      if (opts.semView) delete mui._mentionsView;
      let marcador: Qualquer = { getStart: () => "ini" };
      const writer = {
        createText: (t: string) => ({ texto: t }),
        setSelection: (s: unknown) => log.selecao.push(s),
      };
      const inst = k.instancia() as Qualquer;
      inst.plugins = { has: (n: string) => n === "MentionUI", get: () => mui };
      inst.config = { get: (n: string) => (n === "mention.dropdownLimit" ? 25 : undefined) };
      inst.model.createRange = (a: unknown, b: unknown) => ({ a, b });
      inst.model.createPositionAt = (p: unknown) => ({ p });
      inst.model.markers.get = (n: string) => (n === "mention" ? marcador : null);
      inst.model.document.selection.focus = "foco";
      inst.model.insertContent = (conteudo: unknown, pos: unknown) => {
        if (log.erro) throw new Error("falha do modelo");
        log.inseridos.push({ conteudo, pos });
        return { end: `fim${log.inseridos.length}` };
      };
      const change = inst.model.change;
      inst.model.change = (fn: (w: typeof writer) => unknown) => {
        change(() => 0);
        return fn(writer);
      };
      inst.data.toModel = (v: unknown, ctxo: string) => ({ modelo: v, ctxo });
      inst.data.processor.toView = (h: string) => ({ visao: h });
      inst.editing.view.focus = () => {
        log.foco += 1;
      };
      return { k, ctx, mui, inst, log, handlers, configs, writer, semMarcador: () => (marcador = null) };
    };

    {
      const m = montarMention({ limite: 10 });
      instalarPagina(m.k.win, { getInteressadosProcesso: (_q: string, cb: (l: unknown) => void) => cb(UNIDADES) });
      const api = criarEscritaInterativa(m.ctx).api;
      igual("instalarCK5 devolve true", api.instalarCK5(m.inst), true);
      checar("marca o MentionUI como instalado (_seiProEscrita)", m.mui._seiProEscrita === true);
      igual("TextWatcher com os dois marcadores, uma vez", m.log.watchers, [
        [
          { marker: "@", minimumCharacters: 0 },
          { marker: "#", minimumCharacters: 0 },
        ],
      ]);
      igual("marcador '#' registrado", [m.configs.get("#").marker, m.configs.get("#").dropdownLimit], ["#", 60]);
      igual("dropdownLimit do '@' sobe para 40 (30 unidades + 10 nativas)", m.configs.get("@").dropdownLimit, 40);
      const feed = await m.configs.get("@").feedCallback("sfis");
      igual(
        "feed '@': variaveis do SEI primeiro, depois as unidades",
        feed.map((i: Qualquer) => i.id),
        ["@ano@", "@seipro10", "@seipro13", "@seipro12", "@seipro11"],
      );
      igual(
        "feed '#': campos do processo",
        (await m.configs.get("#").feedCallback("inter")).map((i: Qualquer) => i.rotulo),
        ["Interessado"],
      );
      igual("renderizador: item do SEI 5 segue o renderizador nativo", m.configs.get("@").itemRenderer({ id: "@ano@" }), "nativo:@ano@");
      const el = m.configs.get("@").itemRenderer(feed[1]) as HTMLElement;
      checar(
        "renderizador: item do SEI Pro vira elemento seipro-escrita-item",
        el.classList.contains("seipro-escrita-item") && el.classList.contains("seipro-escrita-unidade"),
      );
      checar("CSS injetado na pagina", m.k.doc.getElementById("seipro-escrita-css") !== null);
      igual("renderizador do '#' sem item do SEI Pro devolve o id", m.configs.get("#").itemRenderer({ id: "x" }), "x");

      igual("instalar de novo e idempotente (true)", api.instalarCK5(m.inst), true);
      igual("... sem registrar o watcher outra vez", m.log.watchers.length, 1);
      igual("... nem outro ouvinte de execute", m.handlers.length, 1);
      igual("ouvinte de execute com prioridade 'highest'", [m.handlers[0]?.ev, m.handlers[0]?.prioridade], ["execute", "highest"]);
      igual("CSS injetado uma vez", m.k.doc.querySelectorAll("#seipro-escrita-css").length, 1);

      // opcao desligada: so as variaveis nativas
      m.ctx.verifyOpcao = () => false;
      igual(
        "opcao desligada: o feed '@' devolve so as variaveis nativas",
        (await m.configs.get("@").feedCallback("sfis")).map((i: Qualquer) => i.id),
        ["@ano@"],
      );
      igual("opcao desligada: o feed '#' vem vazio", await m.configs.get("#").feedCallback(""), []);
    }
    {
      const m = montarMention({ comArroba: false });
      instalarPagina(m.k.win);
      const api = criarEscritaInterativa(m.ctx).api;
      igual("sem marcador '@' nativo: instala", api.instalarCK5(m.inst), true);
      igual("... cria o '@' proprio", [m.configs.get("@").marker, m.configs.get("@").dropdownLimit], ["@", 30]);
      igual("... renderizador sem anterior devolve o id", m.configs.get("@").itemRenderer({ id: "q" }), "q");
      igual("... feed '@' so com unidades (sem servidor: vazio)", await m.configs.get("@").feedCallback("sfis"), []);
    }
    {
      const m = montarMention({ limite: 100 });
      instalarPagina(m.k.win);
      criarEscritaInterativa(m.ctx).api.instalarCK5(m.inst);
      igual("dropdownLimit nativo maior que 40 e mantido", m.configs.get("@").dropdownLimit, 100);
      const m2 = montarMention();
      instalarPagina(m2.k.win);
      criarEscritaInterativa(m2.ctx).api.instalarCK5(m2.inst);
      igual("sem dropdownLimit nativo: usa o da config do editor (25) e sobe ao minimo", m2.configs.get("@").dropdownLimit, 40);
      const m3 = montarMention({ limite: 0 });
      m3.inst.config.get = () => undefined;
      instalarPagina(m3.k.win);
      criarEscritaInterativa(m3.ctx).api.instalarCK5(m3.inst);
      igual("sem nenhum limite: 40", m3.configs.get("@").dropdownLimit, 40);
    }
    {
      const m = montarMention();
      const api = criarEscritaInterativa(m.ctx).api;
      igual("editor nulo: false", api.instalarCK5(null), false);
      igual("editor sem plugins: false", api.instalarCK5({}), false);
      igual("editor sem MentionUI: false", api.instalarCK5({ plugins: { has: () => false } }), false);
      m.mui._setupTextWatcher = undefined;
      const r = capturarAvisos(() => api.instalarCK5(m.inst));
      igual("MentionUI sem a API esperada: false", r.resultado, false);
      checar(
        "... com aviso",
        r.avisos.some((a) => a.includes("MentionUI sem a API esperada")),
      );
      checar("... e nao marca como instalado", m.mui._seiProEscrita === undefined);
      const m2 = montarMention({ semView: true });
      igual("MentionUI sem a vista: false", capturarAvisos(() => criarEscritaInterativa(m2.ctx).api.instalarCK5(m2.inst)).resultado, false);
    }

    secao("recurso escrita-interativa: CK5 - escolha de um item");
    {
      const m = montarMention();
      instalarPagina(m.k.win, { htmlLinksProtocoloEditorPro: (h: string) => `LINKS(${h})` });
      const api = criarEscritaInterativa(m.ctx).api;
      api.instalarCK5(m.inst);
      const executar = (item: Qualquer) => {
        const evt = {
          parou: false,
          stop() {
            this.parou = true;
          },
        };
        m.handlers[0]?.fn(evt, { item });
        return evt;
      };
      const nativo = executar({ id: "@ano@" });
      igual("item nativo do SEI: nao interfere (nao para o evento)", [nativo.parou, m.log.inseridos.length], [false, 0]);
      igual(
        "evento sem dados: nao interfere",
        (() => {
          const e = {
            parou: false,
            stop() {
              this.parou = true;
            },
          };
          m.handlers[0]?.fn(e, undefined);
          return e.parou;
        })(),
        false,
      );

      const evt = executar({ seiPro: "campo", html: "<b>valor</b>", rotulo: "Campo" });
      igual("item do SEI Pro: para o evento (o SEI nao tenta buscar a variavel)", evt.parou, true);
      igual("fecha o balao e remove o marcador", m.log.removidoMarcador, 1);
      igual("insere o HTML (passado pelo tratamento de links do monolito) no intervalo do marcador ate o foco", m.log.inseridos[0], {
        conteudo: { modelo: { visao: "LINKS(<b>valor</b>)" }, ctxo: "$block" },
        pos: { a: { p: "ini" }, b: { p: "foco" } },
      });
      igual("depois do item entra um espaco", m.log.inseridos[1]?.conteudo, { texto: " " });
      igual("... na posicao final do item inserido", m.log.inseridos[1]?.pos, "fim1");
      igual("a selecao vai para depois do espaco", m.log.selecao, ["fim2"]);
      igual("o foco volta ao editor", m.log.foco, 1);
      igual("tudo num model.change (um passo de desfazer)", m.inst.mudancas, 1);

      m.log.erro = true;
      const r = capturarAvisos(() => executar({ seiPro: "unidade", html: "<span>u</span>", rotulo: "U" }));
      checar(
        "falha do model: avisa, nao lanca, e devolve o foco",
        r.avisos.some((a) => a.includes("falha ao inserir")) && m.log.foco === 2,
      );
      m.log.erro = false;

      m.semMarcador();
      const antes = m.log.inseridos.length;
      const sem = executar({ seiPro: "campo", html: "x", rotulo: "x" });
      igual("sem marcador 'mention' no model: para o evento mas nao insere", [sem.parou, m.log.inseridos.length], [true, antes]);

      // sem htmlLinksProtocoloEditorPro: o HTML vai como esta
      const m2 = montarMention();
      instalarPagina(m2.k.win);
      criarEscritaInterativa(m2.ctx).api.instalarCK5(m2.inst);
      m2.handlers[0]?.fn({ stop() {} }, { item: { seiPro: "campo", html: "<i>h</i>" } });
      igual("sem tratamento de links: HTML cru do item", m2.log.inseridos[0]?.conteudo, { modelo: { visao: "<i>h</i>" }, ctxo: "$block" });
    }
  }

  // ============================================================ iniciar
  secao("recurso escrita-interativa: iniciar (liga o CK5 sozinho)");
  await nosDoisEditores("iniciar", async (c) => {
    const ctx = ctxDe(c);
    let ligacoes = 0;
    if (c.versao === 5) {
      const inst = c.ed.versao === 5 ? (c.ed.instancia() as Qualquer) : null;
      const mui: Qualquer = {
        _mentionsConfigurations: new Map([["@", { feedCallback: () => [], dropdownLimit: 10 }]]),
        _setupTextWatcher: () => {
          ligacoes += 1;
        },
        _mentionsView: { on() {} },
      };
      inst.plugins = { has: () => true, get: () => mui };
    }
    escrita.iniciar?.(ctx);
    escrita.iniciar?.(ctx);
    await tique(30);
    igual("CK5 liga o Mention uma so vez; CK4 nao toca em nada", ligacoes, c.versao === 5 ? 1 : 0);
  });
  {
    // CK5 sem plugin Mention: avisa e nao lanca
    const avisos: string[] = [];
    const original = console.warn;
    console.warn = (...a: unknown[]) => {
      avisos.push(a.map(String).join(" "));
    };
    try {
      escrita.iniciar?.(ctxDe(criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>t</p>", principal: true }] })));
      await tique(30);
    } finally {
      console.warn = original;
    }
    checar(
      "CK5 sem plugin Mention: aviso 'CK5 sem plugin Mention'",
      avisos.some((a) => a.includes("CK5 sem plugin Mention")),
      avisos,
    );
  }

  // ============================================================ independencia entre contextos
  secao("recurso escrita-interativa: estado por contexto");
  {
    const a = montarCk4();
    const b = montarCk4();
    instalarPagina(a.win);
    instalarPagina(b.win);
    const apiA = criarEscritaInterativa(a.ctx).api;
    const apiB = criarEscritaInterativa(b.ctx).api;
    checar("cada contexto tem a sua instancia", apiA !== apiB);
    escrever(a, "#");
    apiA.ck4AoDigitar(a.inst);
    await tique();
    checar("a lista de um nao aparece no documento do outro", lista(a) !== null && lista(b) === null);
    igual("ck4Tecla de um nao age no outro", apiB.ck4Tecla(a.inst, 40), false);
  }
}
