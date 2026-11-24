import { criarAdaptador } from "../../src/adaptador";
import {
  CkWebSpeech,
  recurso as ditado,
  type EventoFala,
  IDIOMAS,
  type Reconhecimento,
  traduzirTranscricao,
} from "../../src/recursos/ditado";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, usarDocumento } from "../dialogo";
import { type CasoEditor, criarCk4, criarCk5, type FalsoCk4, type FalsoCk5, nosDoisEditores } from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;
type Opcoes = Record<string, boolean>;

const ctxDe = (c: { win: Window; doc: Document }, opcoes: Opcoes = {}): Contexto => ({
  adaptador: criarAdaptador(c.win),
  doc: c.doc,
  win: c.win,
  base: "chrome-extension://abc/",
  checkOpcao: (n) => opcoes[n] ?? true,
  verifyOpcao: () => false,
});

const evento = (el: Element, tipo: string, extra: Record<string, unknown> = {}) => {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  const ev = new Ev(tipo, { bubbles: true, cancelable: true });
  Object.assign(ev, extra);
  el.dispatchEvent(ev);
  return ev;
};

/** SpeechRecognition falso: registra start/stop/lang e deixa o teste disparar os eventos. */
class FalsoFala implements Reconhecimento {
  static ultimo: FalsoFala | null = null;
  continuous = false;
  interimResults = true;
  lang = "";
  onstart: (() => void) | null = null;
  onerror: ((e: EventoFala) => void) | null = null;
  onend: (() => void) | null = null;
  onresult: ((e: EventoFala) => void) | null = null;
  onspeechstart: (() => void) | null = null;
  onspeechend: (() => void) | null = null;
  starts = 0;
  stops = 0;
  lancar = false;
  constructor() {
    FalsoFala.ultimo = this;
  }
  start() {
    if (this.lancar) throw new Error("InvalidStateError");
    this.starts += 1;
  }
  stop() {
    this.stops += 1;
  }
}

/** Resultado do reconhecimento: cada item e [texto, final]. */
const fala = (...itens: Array<[string, boolean]>) => ({
  resultIndex: 0,
  results: itens.map(([transcript, isFinal]) => Object.assign([{ transcript }], { isFinal })),
});

const textos = (c: CasoEditor): string[] =>
  c.versao === 4
    ? (c.ed as FalsoCk4).instancia("txaEditor_1").textos
    : (c.ed as FalsoCk5).instancia().insercoes.map((i) => i.html.replace(/^texto:/, ""));
const comandos = (c: CasoEditor): string[] =>
  (c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").comandos : (c.ed as FalsoCk5).instancia().executados).map(([n]) => n);

function instalarFala(c: { win: Window }): void {
  (c.win as unknown as Record<string, unknown>).webkitSpeechRecognition = FalsoFala;
}

export async function verificarDitado(): Promise<void> {
  secao("recurso ditado: logica pura");
  igual("traduzirTranscricao: texto comum ganha espaco na frente", traduzirTranscricao(" ola mundo "), " ola mundo");
  igual("traduzirTranscricao: virgula e ponto colam no texto anterior", traduzirTranscricao(" , depois "), ", depois");
  igual("traduzirTranscricao: 'virgula' falada vira , com espaco depois", traduzirTranscricao(" a v\u00EDrgula b "), " a, b");
  igual(
    "traduzirTranscricao: 'ponto' vira . e 'dois pontos' vira :",
    traduzirTranscricao(" fim ponto outro dois pontos x "),
    " fim. outro: x",
  );
  igual("traduzirTranscricao: parenteses", traduzirTranscricao(" veja abre parênteses nota fecha parênteses fim "), " veja(nota)fim");
  igual(
    "traduzirTranscricao: colchetes (inclusive 'abre colchete')",
    traduzirTranscricao(" a abre colchete b fecha colchete c "),
    " a[b]c",
  );
  igual("traduzirTranscricao: aspas", traduzirTranscricao(" disse abre aspas oi fecha aspas fim "), ' disse"oi"fim');
  igual("traduzirTranscricao: travessao e traco", traduzirTranscricao(" a travessão b "), " a – b");
  igual("traduzirTranscricao: ponto e virgula", traduzirTranscricao(" a ponto e vírgula b "), " a; b");
  igual(
    "traduzirTranscricao: so a primeira ocorrencia de cada sinal",
    traduzirTranscricao(" a v\u00EDrgula b v\u00EDrgula c "),
    " a, b v\u00EDrgula c",
  );
  igual("traduzirTranscricao: vazio", traduzirTranscricao("  "), " ");
  igual(
    "traduzirTranscricao: texto hostil nao e interpretado",
    traduzirTranscricao(" <img src=x onerror=alert(1)> "),
    " <img src=x onerror=alert(1)>",
  );

  secao("recurso ditado: idiomas e culturas");
  checar(
    "IDIOMAS: 32 idiomas, portugues no indice 19 com pt-BR primeiro",
    IDIOMAS.length === 32 && IDIOMAS[19]?.[0] === "Português" && IDIOMAS[19]?.[1]?.[0] === "pt-BR",
  );
  checar(
    "IDIOMAS: sem texto nao-ASCII fora de escapes no fonte nao se verifica aqui, mas os nomes existem",
    IDIOMAS.every((i) => i[0].length > 0 && i.length > 1),
  );

  await nosDoisEditores("ditado", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    instalarFala(c);
    const A = criarAdaptador(c.win);
    const g = ditado.globais(ctxDe(c)) as Record<string, Fn>;
    igual(
      `ditado ${v}: id do recurso e globais do contrato`,
      [ditado.id, Object.keys(g).sort()],
      ["ditado", ["getBoxCtrDitado", "getBoxDitado", "getDialogDitado", "initDitadoPro", "instanceDitadoPro"]],
    );

    // instanceDitadoPro: cria uma vez por editor
    const ed = A.getInstance() as object & { ckWebSpeech?: CkWebSpeech };
    g.instanceDitadoPro(ed);
    const ws = ed.ckWebSpeech as CkWebSpeech;
    checar(`ditado ${v}: instanceDitadoPro cria ckWebSpeech no editor`, ws instanceof CkWebSpeech);
    g.instanceDitadoPro(ed);
    checar(`ditado ${v}: instanceDitadoPro e idempotente`, ed.ckWebSpeech === ws);
    g.instanceDitadoPro();
    checar(`ditado ${v}: sem argumento usa o editor ativo`, ed.ckWebSpeech === ws);
    g.instanceDitadoPro(null);
    igual(`ditado ${v}: cultura inicial pt-BR, indice 19`, ws._currentCulture, { val: "pt-BR", langVal: 19 });
    checar(
      `ditado ${v}: o servico foi criado com continuous e sem resultados parciais`,
      !!FalsoFala.ultimo?.continuous && !FalsoFala.ultimo.interimResults,
    );
    const rec = ws._recognition as unknown as FalsoFala;

    // culturas
    igual(`ditado ${v}: setDialectByCulture ignora caixa`, ws.setDialectByCulture("EN-us"), { val: "en-US", langVal: 6 });
    igual(`ditado ${v}: cultura desconhecida mantem a atual`, ws.setDialectByCulture("xx-XX"), { val: "en-US", langVal: 6 });
    ws.setDialectByLanguage(19);
    igual(`ditado ${v}: setDialectByLanguage escolhe a primeira cultura`, ws._currentCulture, { val: "pt-BR", langVal: 19 });
    ws.setDialectByLanguage(999);
    igual(`ditado ${v}: idioma inexistente nao muda nada`, ws._currentCulture.val, "pt-BR");
    igual(`ditado ${v}: getCultures do portugues`, ws.getCultures(19), [["pt-BR"], ["pt-PT"]]);
    igual(`ditado ${v}: getCultures sem argumento usa o idioma atual`, ws.getCultures(), [["pt-BR"], ["pt-PT"]]);
    igual(`ditado ${v}: getCultures de indice invalido`, ws.getCultures(500), []);
    igual(
      `ditado ${v}: getLanguages tem 32 pares [nome, indice]`,
      [ws.getLanguages().length, ws.getLanguages()[19]],
      [32, ["Português", 19]],
    );

    // botao liga/desliga + icones
    c.doc.body.append(
      Object.assign(c.doc.createElement("a"), { className: "getDitadoButton cke_button_off" }),
      Object.assign(c.doc.createElement("span"), { className: "cke_button__ditado_icon" }),
    );
    const botao = c.doc.querySelector(".getDitadoButton") as HTMLElement;
    g.getBoxDitado(null);
    igual(`ditado ${v}: getBoxDitado liga a escuta com o idioma da cultura`, [rec.starts, rec.lang], [1, "pt-BR"]);
    checar(`ditado ${v}: o botao vira 'ligado'`, botao.classList.contains("cke_button_on") && !botao.classList.contains("cke_button_off"));
    rec.onstart?.();
    checar(
      `ditado ${v}: onstart marca escutando e poe o gif`,
      ws._recognizing && /webspeech-enable\.gif/.test(c.doc.querySelector(".cke_button__ditado_icon")?.getAttribute("style") ?? ""),
    );
    g.getBoxDitado(null);
    igual(`ditado ${v}: com a escuta ativa, o clique para o reconhecimento`, rec.stops, 1);
    rec.onend?.();
    checar(
      `ditado ${v}: onend desliga e volta o icone estatico`,
      !ws._recognizing && /webspeech\.png/.test(c.doc.querySelector(".cke_button__ditado_icon")?.getAttribute("style") ?? ""),
    );
    checar(
      `ditado ${v}: o botao volta a 'desligado'`,
      botao.classList.contains("cke_button_off") && !botao.classList.contains("cke_button_on"),
    );
    rec.onerror?.({ error: "not-allowed", resultIndex: 0 } as never);
    checar(`ditado ${v}: erro do microfone so refaz o icone (nao lanca)`, !ws._recognizing);
    rec.onspeechend?.();
    rec.onspeechstart?.();
    rec.lancar = true;
    ws.toogleSpeech();
    checar(`ditado ${v}: start que lanca (ja iniciado) nao quebra`, true);
    rec.lancar = false;
    g.getBoxDitado(c.doc.createElement("div"));
    checar(`ditado ${v}: getBoxDitado com elemento sem editor proprio usa o ativo`, rec.starts === 2);
    rec.onend?.();

    // ---- reconhecimento: texto e comandos de voz
    const ler = () => textos(c);
    const antes = ler().length;
    ws.onResult(fala(["ola mundo", true]) as never);
    igual(`ditado ${v}: resultado final entra como texto`, ler().slice(antes), [" ola mundo"]);
    ws.onResult(fala(["parcial", false]) as never);
    igual(`ditado ${v}: resultado parcial e ignorado`, ler().length, antes + 1);
    ws.onResult(fala(["um v\u00EDrgula dois", true], ["tres", true]) as never);
    igual(`ditado ${v}: varios resultados finais entram na ordem`, ler().slice(antes + 1), [" um, dois", " tres"]);
    ws.onResult({ resultIndex: 1, results: fala(["a", true], ["b", true]).results } as never);
    igual(`ditado ${v}: resultIndex pula os ja entregues`, ler().slice(-1), [" b"]);

    const n0 = ler().length;
    const cmd0 = comandos(c).length;
    ws.onResult(fala(["primeira frase nova linha segunda frase", true]) as never);
    igual(`ditado ${v}: 'nova linha' insere a primeira parte com ponto e quebra`, ler().slice(n0), [" primeira frase.", " segunda frase"]);
    igual(`ditado ${v}: 'nova linha' dispara o comando enter`, comandos(c).slice(cmd0), ["enter"]);
    const n1 = ler().length;
    ws.onResult(fala(["a novo parágrafo b", true]) as never);
    igual(`ditado ${v}: 'novo paragrafo' tambem quebra`, [ler().slice(n1), comandos(c).at(-1)], [[" a.", " b"], "enter"]);
    const n2 = ler().length;
    const cmd2 = comandos(c).length;
    ws.onResult(fala(["fim ponto final", true]) as never);
    igual(
      `ditado ${v}: 'ponto final' no fim entrega so o texto (como no legado)`,
      [ler().slice(n2), comandos(c).length - cmd2],
      [[" fim"], 0],
    );
    ws.onResult(fala(["nova linha", true]) as never);
    igual(`ditado ${v}: so o comando 'nova linha' vira um enter`, comandos(c).at(-1), "enter");
    const cmd3 = comandos(c).length;
    ws.onResult(fala(["desfazer", true]) as never);
    ws.onResult(fala(["Refazer", true]) as never);
    igual(`ditado ${v}: 'desfazer' e 'refazer' viram undo/redo`, comandos(c).slice(cmd3), ["undo", "redo"]);
    const n3 = ler().length;
    ws.onResult(fala(["desfazer tudo", true]) as never);
    igual(`ditado ${v}: 'desfazer' dentro de uma frase e texto`, ler().slice(n3), [" desfazer tudo"]);
    ws.onResult(fala(["   ", true]) as never);
    igual(`ditado ${v}: resultado vazio insere so espaco (nao lanca)`, ler().at(-1), " ");

    // results indefinido: para a escuta e solta o onend
    ws._recognizing = true;
    const paradas = rec.stops;
    ws.onResult({ resultIndex: 0 } as never);
    checar(`ditado ${v}: sem 'results' a escuta e interrompida`, !ws._recognizing && rec.stops === paradas + 1 && rec.onend === null);

    // ---- menu de contexto e atalho
    const corpo = A.getBodyContainer(ed) as HTMLElement;
    const toggle = rec.starts;
    const ev = evento(corpo, "keydown", { ctrlKey: true, shiftKey: true, code: "Space", key: " " });
    checar(`ditado ${v}: Ctrl+Shift+Espaco liga o ditado e cancela o evento`, rec.starts === toggle + 1 && ev.defaultPrevented);
    const ev2 = evento(corpo, "keydown", { ctrlKey: true, code: "Space", key: " " });
    checar(`ditado ${v}: sem Shift nada acontece`, rec.starts === toggle + 1 && !ev2.defaultPrevented);
    const ev3 = evento(corpo, "keydown", { ctrlKey: true, shiftKey: true, keyCode: 32 });
    checar(`ditado ${v}: keyCode 32 tambem vale`, rec.starts === toggle + 2 && ev3.defaultPrevented);
    g.instanceDitadoPro(ed);
    evento(corpo, "keydown", { ctrlKey: true, shiftKey: true, code: "Space" });
    checar(`ditado ${v}: um unico ouvinte de teclado (nao duplica)`, rec.starts === toggle + 3);

    if (c.versao === 4) {
      const i4 = (c.ed as FalsoCk4).instancia("txaEditor_1");
      const itens = i4.abrirMenu(c.doc.createElement("p"));
      igual(`ditado ${v}: o menu nativo oferece o item Ditado`, itens.length, 1);
      const nome = itens[0] as string;
      igual(`ditado ${v}: rotulo do item do menu`, i4.getMenuItem(nome)?.label, "Ditado");
      const k = rec.starts;
      i4.getCommand(i4.getMenuItem(nome)?.command ?? "")?.exec();
      checar(`ditado ${v}: o item do menu liga o ditado`, rec.starts === k + 1);
    } else {
      evento(corpo, "contextmenu", { clientX: 1, clientY: 1 });
      checar(`ditado ${v}: no SEI 5 o menu do navegador fica (sem item Ditado)`, !c.doc.getElementById("seiProCtxMenu"));
    }

    // ---- dialogo de configuracoes
    g.getBoxCtrDitado(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    checar(`ditado ${v}: getBoxCtrDitado abre o dialogo`, !!d);
    igual(
      `ditado ${v}: titulo do dialogo`,
      d.querySelector(".spro-dialogo-titulo, h2, header")?.textContent?.trim(),
      "Configurações do Ditado",
    );
    const selI = d.querySelector("#wslanguages") as HTMLSelectElement;
    const selC = d.querySelector("#wscultures") as HTMLSelectElement;
    checar(`ditado ${v}: ids wslanguages e wscultures existem`, !!selI && !!selC);
    igual(`ditado ${v}: 32 idiomas listados`, selI.querySelectorAll("option").length, 32);
    igual(`ditado ${v}: idioma selecionado e o atual (Portugues)`, selI.value, "19");
    igual(
      `ditado ${v}: culturas do idioma atual`,
      [...selC.querySelectorAll("option")].map((o) => o.getAttribute("value")),
      ["pt-BR", "pt-PT"],
    );
    igual(`ditado ${v}: o texto da cultura traz o nome`, selC.querySelector("option")?.textContent, "pt-BR – Brasil");
    checar(`ditado ${v}: texto do atalho`, /Atalho:\s*Ctrl \+ Shift \+ Espaço\s*liga\/desliga o ditado\./.test(d.textContent ?? ""));
    checar(`ditado ${v}: sem botao Cancelar`, ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")));
    checar(
      `ditado ${v}: rotulos ligados aos campos`,
      !!d.querySelector('label[for="wslanguages"]') && !!d.querySelector('label[for="wscultures"]'),
    );
    // trocar de idioma repovoa as culturas e marca a primeira
    selI.value = "6";
    evento(selI, "change");
    igual(
      `ditado ${v}: trocar para English lista as 7 culturas`,
      [...selC.querySelectorAll("option")].map((o) => o.getAttribute("value")),
      ["en-AU", "en-CA", "en-IN", "en-NZ", "en-ZA", "en-GB", "en-US"],
    );
    igual(`ditado ${v}: a primeira cultura fica selecionada`, selC.value, "en-AU");
    selC.value = "en-GB";
    evento(selC, "change");
    igual(`ditado ${v}: antes do OK a cultura do ditado nao muda`, ws._currentCulture.val, "pt-BR");
    clicar(d, "OK");
    igual(`ditado ${v}: OK grava a cultura escolhida`, ws._currentCulture, { val: "en-GB", langVal: 6 });
    checar(`ditado ${v}: OK fecha o dialogo`, !dialogoAberto(c.doc));
    rec.onend?.();
    g.getBoxDitado(null);
    igual(`ditado ${v}: a proxima escuta usa o novo idioma`, rec.lang, "en-GB");
    rec.onstart?.();
    g.getBoxDitado(null);

    // reabre refletindo a cultura atual, e fechar sem OK nao grava
    g.getBoxCtrDitado(null);
    const d2 = dialogoAberto(c.doc) as HTMLElement;
    igual(`ditado ${v}: reaberto, o idioma atual vem selecionado`, (d2.querySelector("#wslanguages") as HTMLSelectElement).value, "6");
    igual(`ditado ${v}: reaberto, a cultura atual vem selecionada`, (d2.querySelector("#wscultures") as HTMLSelectElement).value, "en-GB");
    const sel2 = d2.querySelector("#wslanguages") as HTMLSelectElement;
    sel2.value = "9";
    evento(sel2, "change");
    d2.dispatchEvent(new (c.doc.defaultView as unknown as { Event: typeof Event }).Event("close"));
    d2.removeAttribute("open");
    igual(`ditado ${v}: fechar pelo X/Esc sem OK nao grava`, ws._currentCulture.val, "en-GB");

    // gate de configuracao
    g.getDialogDitado();
    g.initDitadoPro();
    checar(`ditado ${v}: getDialogDitado e initDitadoPro nao lancam`, true);
  });

  secao("recurso ditado: sem suporte do navegador");
  await nosDoisEditores("ditado-sem-suporte", (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const chamadas: unknown[][] = [];
    (c.win as unknown as Record<string, unknown>).alertaBoxPro = (...a: unknown[]) => chamadas.push(a);
    const A = criarAdaptador(c.win);
    const g = ditado.globais(ctxDe(c)) as Record<string, Fn>;
    const ed = A.getInstance() as object & { ckWebSpeech?: CkWebSpeech };
    g.instanceDitadoPro(ed);
    checar(`ditado ${v}: sem a API, o objeto existe mas sem reconhecimento`, !!ed.ckWebSpeech && ed.ckWebSpeech._recognition === null);
    g.getBoxDitado(null);
    igual(`ditado ${v}: avisa pelo alertaBoxPro do monolito`, chamadas, [
      ["Ditado indisponível", "exclamation-triangle", "Seu navegador não suporta reconhecimento de voz (webkitSpeechRecognition)."],
    ]);
    delete (c.win as unknown as Record<string, unknown>).alertaBoxPro;
    g.getBoxDitado(null);
    checar(`ditado ${v}: sem alertaBoxPro o aviso aparece na tela`, /não suporta reconhecimento de voz/.test(c.doc.body.textContent ?? ""));
    // SpeechRecognition padrao (sem prefixo) tambem serve
    (c.win as unknown as Record<string, unknown>).SpeechRecognition = FalsoFala;
    const outro = new CkWebSpeech(IDIOMAS, undefined, { win: c.win, doc: c.doc, base: "", avisarIndisponivel() {} }, A, ed);
    checar(`ditado ${v}: aceita SpeechRecognition sem prefixo`, outro._recognition instanceof FalsoFala);
    igual(`ditado ${v}: sem cultura informada, fica pt-BR`, outro._currentCulture.val, "pt-BR");
  });

  secao("recurso ditado: opcoes e bordas");
  await nosDoisEditores("ditado-opcoes", (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    instalarFala(c);
    const A = criarAdaptador(c.win);
    const g = ditado.globais(ctxDe(c, { ditado: false, revisaotexto: false })) as Record<string, Fn>;
    const ed = A.getInstance() as object & { ckWebSpeech?: CkWebSpeech };
    g.instanceDitadoPro(ed);
    if (c.versao === 4) {
      igual(
        `ditado ${v}: com a opcao 'ditado' desligada o menu nao oferece o item`,
        (c.ed as FalsoCk4).instancia("txaEditor_1").abrirMenu(null),
        [],
      );
    }
    g.getDialogDitado();
    checar(`ditado ${v}: com 'revisaotexto' desligado nada acontece`, true);
    const chamadas: unknown[] = [];
    (c.win as unknown as Record<string, unknown>).setParamEditor = (el: unknown) => chamadas.push(el);
    const botao = c.doc.createElement("a");
    c.doc.body.append(botao);
    g.getBoxCtrDitado(botao);
    igual(`ditado ${v}: getBoxCtrDitado chama setParamEditor com o botao`, chamadas, [botao]);
    (c.win as unknown as Record<string, unknown>).setParamEditor = () => {
      throw new Error("falha do monolito");
    };
    g.getBoxCtrDitado(botao);
    checar(`ditado ${v}: erro no setParamEditor nao impede o dialogo`, !!dialogoAberto(c.doc));
    // sem botoes na pagina, getBoxDitado nao lanca
    g.getBoxDitado(null);
    checar(`ditado ${v}: sem botoes na barra o clique segue sem erro`, true);
    // valores hostis na cultura do dialogo: cultura inexistente nao altera
    const ws = ed.ckWebSpeech as CkWebSpeech;
    ws.setDialectByCulture('"><img src=x onerror=1>');
    igual(`ditado ${v}: cultura hostil e ignorada`, ws._currentCulture.val, "pt-BR");
  });

  secao("recurso ditado: somente leitura");
  {
    const casos: Array<[string, FalsoCk4 | FalsoCk5]> = [
      ["CK4", criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>x</p>", somenteLeitura: true }] })],
      ["CK5", criarCk5({ secoes: [{ raiz: "main", label: "Corpo", html: "<p>x</p>", principal: true, somenteLeitura: true }] })],
    ];
    for (const [v0, ed0] of casos) {
      const v = `[${v0}]`;
      usarDocumento(ed0.doc);
      instalarFala({ win: ed0.win });
      const A = criarAdaptador(ed0.win);
      let recusas = 0;
      A.aoRecusarEscrita(() => {
        recusas += 1;
      });
      const g = ditado.globais({ ...ctxDe(ed0), adaptador: A }) as Record<string, Fn>;
      const ed = A.getInstance() as object & { ckWebSpeech?: CkWebSpeech };
      g.instanceDitadoPro(ed);
      const ws = ed.ckWebSpeech as CkWebSpeech;
      ws.onResult(fala(["texto", true]) as never);
      checar(`ditado ${v}: texto em secao somente leitura e recusado (avisa)`, recusas >= 1);
      const r1 = recusas;
      ws.onResult(fala(["desfazer", true]) as never);
      checar(`ditado ${v}: desfazer em secao somente leitura e recusado`, recusas === r1 + 1);
      const exec = v0 === "CK4" ? (ed0 as FalsoCk4).instancia("txaEditor_1").comandos : (ed0 as FalsoCk5).instancia().executados;
      igual(`ditado ${v}: nenhum comando foi executado`, exec.length, 0);
      const ins = v0 === "CK4" ? (ed0 as FalsoCk4).instancia("txaEditor_1").textos : (ed0 as FalsoCk5).instancia().insercoes;
      igual(`ditado ${v}: nada foi inserido`, ins.length, 0);
    }
  }
}
