/**
 * Fila de carregamento das pastas: uma por vez (nunca duas em carga), intervalo, prazo, falha de uma pasta, parar e
 * continuar, teto, subpastas, aba oculta, sessão expirada, pasta que o usuário já estava abrindo, re-fechar só o que a
 * fila abriu, idempotência. A árvore é a falsa de `arvore-sei-falsa.ts` (mesmo comportamento medido no SEI SP).
 */

import { ligarFiltro } from "../src/pagina/filtro/barra";
import { criarFila, type EstadoFila, estadoDaPasta, pastaAberta, todasAsPastas } from "../src/pagina/pastas/fila";
import { type ConfigPasta, montarArvoreFalsa } from "./arvore-sei-falsa";
import { botao, checar, disparar, secao, tique } from "./util";

let proximoId = 1000;
const docs = (n: number, _prefixo = ""): ConfigPasta["docs"] =>
  Array.from({ length: n }, () => {
    proximoId += 1;
    return [`${proximoId}`, `Despacho (0${proximoId}1)`] as [string, string];
  });

async function ate(cond: () => boolean, ms = 3000): Promise<boolean> {
  const lim = Date.now() + ms;
  while (Date.now() < lim) {
    if (cond()) return true;
    await tique(5);
  }
  return cond();
}

const RAPIDA = { intervaloMs: 20, prazoPastaMs: 400 };

export async function verificarPastas(): Promise<void> {
  secao("fila de pastas: uma por vez, em ordem, com intervalo");
  {
    const a = montarArvoreFalsa({
      1: { docs: docs(2, "a") },
      2: { docs: docs(2, "b") },
      3: { docs: docs(1, "c") },
      4: { docs: docs(3, "d") },
    });
    const fila = criarFila(a.doc, RAPIDA);
    const eventos: EstadoFila[] = [];
    fila.aoMudar((e) => eventos.push(e));
    checar(
      "antes: 4 pastas pendentes, ociosa",
      fila.pendentes().join() === "PASTA1,PASTA2,PASTA3,PASTA4" && fila.estado().fase === "ociosa",
    );
    fila.iniciar();
    await tique(3);
    checar("a primeira sai logo, sem espera (o intervalo vale entre uma e outra)", a.pedidos.length === 1);
    await ate(() => fila.estado().fase === "concluida");
    checar(
      "ordem da arvore",
      a.pedidos.map((p) => p.pasta).join() === "PASTA1,PASTA2,PASTA3,PASTA4",
      a.pedidos.map((p) => p.pasta),
    );
    checar("nunca duas em carga", a.maxSimultaneos() === 1 && a.atropelos() === 0, [a.maxSimultaneos(), a.atropelos()]);
    const folgas = a.pedidos.slice(1).map((p, i) => p.inicio - (a.pedidos[i]?.fim ?? 0));
    checar(
      "intervalo minimo entre o fim de uma e o pedido da proxima",
      folgas.every((f) => f >= RAPIDA.intervaloMs - 3),
      folgas,
    );
    checar(
      "todas carregadas, nenhuma falha",
      todasAsPastas(a.doc).every((p) => estadoDaPasta(a.doc, p) === "carregada") && fila.estado().falhas.length === 0,
    );
    const meio = eventos.find((e) => e.atual === "PASTA2");
    checar("progresso: 'pasta 2 de 4' com o nome da pasta", meio?.feitas === 1 && meio.total === 4 && meio.nomeAtual === "2", meio);
    checar("a marca de carga fica so na pasta em andamento e sai no fim", a.doc.querySelectorAll("[data-spro-pasta]").length === 0);
    checar("estado final: concluida com 4 feitas", fila.estado().fase === "concluida" && fila.estado().feitas === 4);
    // Nao recarrega o que ja esta carregado.
    const antes = a.pedidos.length;
    fila.iniciar();
    await tique(60);
    checar("iniciar de novo com tudo carregado: nenhum pedido", a.pedidos.length === antes && fila.estado().fase === "concluida");
    fila.destruir();
  }

  secao("fila: a marca de 'carregando' aparece na pasta da vez");
  {
    const a = montarArvoreFalsa({ 1: { docs: docs(1, "a"), latenciaMs: 80 }, 2: { docs: docs(1, "b") } });
    const fila = criarFila(a.doc, RAPIDA);
    fila.iniciar();
    await tique(20);
    checar(
      "data-spro-pasta=carregando na pasta em carga e em nenhuma outra",
      a.doc.getElementById("anchorPASTA1")?.getAttribute("data-spro-pasta") === "carregando" &&
        !a.doc.getElementById("anchorPASTA2")?.hasAttribute("data-spro-pasta"),
    );
    await ate(() => fila.estado().fase === "concluida");
    checar("some no fim", a.doc.querySelectorAll("[data-spro-pasta]").length === 0);
    fila.destruir();
  }

  secao("fila: pasta ja carregada ou aberta pelo usuario nao e pedida");
  {
    const a = montarArvoreFalsa({ 1: { docs: docs(2, "a") }, 2: { docs: docs(2, "b"), carregada: true }, 3: { docs: docs(1, "c") } });
    const fila = criarFila(a.doc, RAPIDA);
    checar("so as fechadas sao pendentes", fila.pendentes().join() === "PASTA1,PASTA3", fila.pendentes());
    fila.iniciar();
    await ate(() => fila.estado().fase === "concluida");
    checar(
      "so duas pedidas",
      a.pedidos.map((p) => p.pasta).join() === "PASTA1,PASTA3",
      a.pedidos.map((p) => p.pasta),
    );
    checar("a que ja estava aberta continua aberta", pastaAberta(a.doc, "PASTA2"));
    fila.destruir();
  }

  secao("fila: erro, vazia, prazo e tentar de novo");
  {
    const a = montarArvoreFalsa({
      1: { docs: docs(1, "a") },
      2: { resposta: "erro" },
      3: { resposta: "vazia" },
      4: { resposta: "mudo" },
      5: { docs: docs(1, "e") },
    });
    const fila = criarFila(a.doc, { ...RAPIDA, prazoPastaMs: 120, falhasSeguidas: 9 });
    fila.iniciar();
    await ate(() => fila.estado().fase === "concluida");
    const e = fila.estado();
    checar(
      "erro do SEI conta como falha e a fila segue",
      e.falhas.includes("PASTA2") && a.pedidos.some((p) => p.pasta === "PASTA5"),
      e.falhas,
    );
    checar(
      "'Nenhum protocolo encontrado' e pasta carregada (vazia), nao falha",
      estadoDaPasta(a.doc, "PASTA3") === "carregada" && !e.falhas.includes("PASTA3"),
    );
    checar(
      "pasta que nao responde: falha pelo prazo, sem travar as demais",
      e.falhas.includes("PASTA4") && estadoDaPasta(a.doc, "PASTA5") === "carregada",
      e.falhas,
    );
    checar("falhas marcadas na arvore", a.doc.getElementById("anchorPASTA2")?.getAttribute("data-spro-pasta") === "falhou");
    checar("fim: 'concluida' com 2 falhas (nao fica pendurada)", e.fase === "concluida" && e.falhas.length === 2, e);
    checar(
      "sem pendentes automaticos: falha nao e reinsistida",
      fila.pendentes().length === 0 || fila.pendentes().every((p) => e.falhas.includes(p)) === false,
    );
    // Tentar de novo: a 4 agora responde. A pasta aberta e sem conteudo e fechada e reaberta (senao o clique so a fecharia).
    a.config.set("PASTA4", { docs: docs(1, "q") });
    a.config.set("PASTA2", { docs: docs(1, "r") });
    const antes = a.cliques.length;
    fila.tentarDeNovo();
    await ate(() => fila.estado().fase === "concluida");
    checar(
      "tentar de novo: as duas carregam",
      estadoDaPasta(a.doc, "PASTA2") === "carregada" && estadoDaPasta(a.doc, "PASTA4") === "carregada" && fila.estado().falhas.length === 0,
      fila.estado(),
    );
    checar("pasta aberta e vazia: dois cliques (fecha e abre), nao um", a.cliques.length - antes >= 4, a.cliques.slice(antes));
    checar("ainda assim uma por vez", a.atropelos() <= 1, a.atropelos()); // o atropelo e o do 'mudo', que nunca respondeu
    fila.destruir();
  }

  secao("fila: 3 falhas seguidas interrompem; sessao expirada interrompe");
  {
    const a = montarArvoreFalsa({
      1: { resposta: "erro" },
      2: { resposta: "erro" },
      3: { resposta: "erro" },
      4: { docs: docs(1, "a") },
      5: { docs: docs(1, "b") },
    });
    const fila = criarFila(a.doc, RAPIDA);
    fila.iniciar();
    await ate(() => fila.estado().fase !== "carregando");
    const e = fila.estado();
    checar(
      "interrompida por falhas em sequencia, sobraram pastas",
      e.fase === "interrompida" && e.motivo === "falhas" && e.restantes === 2,
      e,
    );
    checar("nao pediu as demais", !a.pedidos.some((p) => p.pasta === "PASTA4"));
    fila.iniciar();
    await tique(40);
    checar("iniciar nao retoma sozinho depois de interrompida", fila.estado().fase === "interrompida");
    a.config.set("PASTA1", { docs: docs(1, "x") });
    fila.continuar();
    await ate(() => fila.estado().fase !== "carregando");
    checar("continuar tenta de novo", estadoDaPasta(a.doc, "PASTA1") === "carregada");
    fila.destruir();
  }
  {
    const a = montarArvoreFalsa({ 1: { resposta: "erro" }, 2: { docs: docs(1, "a") } });
    const fila = criarFila(a.doc, { ...RAPIDA, sessaoExpirada: () => true });
    fila.iniciar();
    await ate(() => fila.estado().fase !== "carregando");
    checar(
      "sessao expirada: interrompe na hora, sem tentar as outras",
      fila.estado().fase === "interrompida" && fila.estado().motivo === "sessao" && a.pedidos.length === 1,
      fila.estado(),
    );
    fila.destruir();
  }

  secao("fila: parar no meio e continuar sem repetir");
  {
    const a = montarArvoreFalsa({
      1: { docs: docs(1, "a"), latenciaMs: 40 },
      2: { docs: docs(1, "b"), latenciaMs: 40 },
      3: { docs: docs(1, "c") },
      4: { docs: docs(1, "d") },
    });
    const fila = criarFila(a.doc, RAPIDA);
    fila.iniciar();
    await ate(() => a.pedidos.length === 2);
    fila.parar();
    checar("parar muda a fase na hora", fila.estado().fase === "parada");
    await tique(150);
    checar(
      "a pasta em carga terminou, nenhuma outra foi pedida",
      estadoDaPasta(a.doc, "PASTA2") === "carregada" && a.pedidos.length === 2,
      a.pedidos.map((p) => p.pasta),
    );
    checar("restam 2 pastas fechadas", fila.estado().restantes === 2 && fila.pendentes().join() === "PASTA3,PASTA4", fila.pendentes());
    fila.iniciar();
    await tique(40);
    checar("iniciar (digitar de novo) nao retoma a fila parada", a.pedidos.length === 2);
    fila.continuar();
    await ate(() => fila.estado().fase === "concluida");
    checar(
      "continuar pede so as que faltam",
      a.pedidos.map((p) => p.pasta).join() === "PASTA1,PASTA2,PASTA3,PASTA4",
      a.pedidos.map((p) => p.pasta),
    );
    fila.destruir();
  }

  secao("fila: teto de pastas por rodada");
  {
    const a = montarArvoreFalsa(Object.fromEntries([1, 2, 3, 4, 5].map((n) => [n, { docs: docs(1, `t${n}`) }])));
    const fila = criarFila(a.doc, { ...RAPIDA, teto: 2 });
    fila.iniciar();
    await ate(() => fila.estado().fase !== "carregando");
    checar(
      "para no teto e avisa quantas faltam",
      fila.estado().fase === "teto" && a.pedidos.length === 2 && fila.estado().restantes === 3,
      fila.estado(),
    );
    fila.continuar();
    await ate(() => fila.estado().fase !== "carregando");
    checar("continuar abre uma nova rodada de ate o teto", a.pedidos.length === 4 && fila.estado().fase === "teto");
    fila.continuar();
    await ate(() => fila.estado().fase !== "carregando");
    checar("e termina", a.pedidos.length === 5 && fila.estado().fase === "concluida");
    fila.destruir();
  }

  secao("fila: subpastas descobertas entram na posicao em que aparecem (profundidade primeiro)");
  {
    const a = montarArvoreFalsa({
      1: { docs: docs(1, "a"), subpastas: [5] },
      2: { docs: docs(1, "b") },
      3: { docs: docs(1, "c") },
      5: { docs: docs(1, "s") },
    });
    const fila = criarFila(a.doc, RAPIDA);
    const totais: number[] = [];
    fila.aoMudar((e) => totais.push(e.total));
    fila.iniciar();
    await ate(() => fila.estado().fase === "concluida");
    checar(
      "a subpasta vem logo depois da mae, antes da irma",
      a.pedidos.map((p) => p.pasta).join() === "PASTA1,PASTA5,PASTA2,PASTA3",
      a.pedidos.map((p) => p.pasta),
    );
    checar("o total cresce quando a subpasta aparece", Math.max(...totais) === 4 && totais[0] === 3, totais);
    fila.destruir();
  }

  secao("fila: aba oculta pausa e volta");
  {
    const a = montarArvoreFalsa({ 1: { docs: docs(1, "a") }, 2: { docs: docs(1, "b") } });
    let oculta = true;
    Object.defineProperty(a.doc, "hidden", { get: () => oculta, configurable: true });
    const fila = criarFila(a.doc, RAPIDA);
    fila.iniciar();
    await tique(80);
    checar("oculta: nenhuma pasta pedida, fase pausada", a.pedidos.length === 0 && fila.estado().fase === "pausada", fila.estado());
    oculta = false;
    a.doc.dispatchEvent(new (a.doc.defaultView as unknown as { Event: typeof Event }).Event("visibilitychange"));
    await ate(() => fila.estado().fase === "concluida");
    checar("visivel: retoma e termina", a.pedidos.length === 2);
    fila.destruir();
  }

  secao("fila: pasta que o usuario esta abrindo agora nao e atropelada");
  {
    const a = montarArvoreFalsa({ 1: { docs: docs(1, "a"), latenciaMs: 60 }, 2: { docs: docs(1, "b") }, 3: { docs: docs(1, "c") } });
    a.clicar("PASTA1"); // o usuario clicou no "+" e o SEI ainda nao respondeu
    const fila = criarFila(a.doc, RAPIDA);
    fila.iniciar();
    await ate(() => fila.estado().fase === "concluida");
    checar(
      "a fila espera a do usuario terminar (nenhum atropelo)",
      a.atropelos() === 0 && a.maxSimultaneos() === 1 && estadoDaPasta(a.doc, "PASTA1") === "carregada",
      [a.atropelos(), a.maxSimultaneos()],
    );
    checar("e carrega as outras", a.carregada("PASTA2") && a.carregada("PASTA3"));
    fila.destruir();
  }

  secao("fila: re-fechar so as que ela abriu, nunca as do usuario");
  {
    const a = montarArvoreFalsa({
      1: { docs: docs(1, "a") },
      2: { docs: docs(1, "b") },
      3: { docs: docs(1, "c") },
      4: { docs: docs(1, "d"), carregada: true },
    });
    const fila = criarFila(a.doc, RAPIDA);
    fila.iniciar();
    await ate(() => a.pedidos.length >= 2);
    // O usuario clica na pasta 2 no meio da fila (clique "de verdade": a fila nao o gerou).
    a.doc
      .getElementById("ancjoinPASTA2")
      ?.dispatchEvent(new (a.doc.defaultView as unknown as { Event: typeof Event }).Event("click", { bubbles: true }));
    await ate(() => fila.estado().fase === "concluida");
    const pedidosAntes = a.pedidos.length;
    fila.encerrar(true);
    checar("fechou as que a fila abriu (1 e 3)", !pastaAberta(a.doc, "PASTA1") && !pastaAberta(a.doc, "PASTA3"));
    checar("deixou como estava a que o usuario mexeu (2) e a que ja vinha aberta (4)", pastaAberta(a.doc, "PASTA4"));
    checar("o conteudo continua no DOM (nao descarrega)", estadoDaPasta(a.doc, "PASTA1") === "carregada" && a.carregada("PASTA3"));
    // Reabrir pela fila (lupa de novo): as ja carregadas nao pedem nada ao servidor.
    fila.iniciar();
    await tique(60);
    a.clicar("PASTA1");
    checar("reabrir uma pasta ja carregada nao faz pedido ao servidor", a.pedidos.length === pedidosAntes, [
      a.pedidos.length,
      pedidosAntes,
    ]);
    fila.destruir();
  }
  {
    // Encerrar com uma pasta em carga: fecha quando ela terminar.
    const a = montarArvoreFalsa({ 1: { docs: docs(1, "a"), latenciaMs: 60 }, 2: { docs: docs(1, "b") } });
    const fila = criarFila(a.doc, RAPIDA);
    fila.iniciar();
    await tique(15);
    fila.encerrar(true);
    checar("encerrar com carga em andamento: ela segue ate o fim", pastaAberta(a.doc, "PASTA1") && fila.estado().fase === "ociosa");
    await ate(() => !pastaAberta(a.doc, "PASTA1"));
    checar(
      "e e fechada quando termina; a segunda nunca e pedida",
      !pastaAberta(a.doc, "PASTA1") && !a.pedidos.some((p) => p.pasta === "PASTA2") && a.carregada("PASTA1"),
    );
    fila.destruir();
  }
  {
    // Pasta com o documento selecionado nao e fechada.
    const a = montarArvoreFalsa({ 1: { docs: docs(1, "a") } });
    const fila = criarFila(a.doc, RAPIDA);
    fila.iniciar();
    await ate(() => fila.estado().fase === "concluida");
    const sel = a.doc.createElement("span");
    sel.className = "infraArvoreNoSelecionado";
    a.doc.getElementById("divPASTA1")?.append(sel);
    fila.encerrar(true);
    checar("pasta com o documento selecionado fica aberta", pastaAberta(a.doc, "PASTA1"));
    fila.destruir();
  }

  secao("fila: idempotencia (duas chamadas, duas instancias)");
  {
    const a = montarArvoreFalsa({ 1: { docs: docs(1, "a"), latenciaMs: 40 }, 2: { docs: docs(1, "b") } });
    const f1 = criarFila(a.doc, RAPIDA);
    const f2 = criarFila(a.doc, RAPIDA);
    f1.iniciar();
    f1.iniciar();
    f1.iniciar();
    await tique(5);
    checar("iniciar varias vezes: uma so rodada", a.pedidos.length === 1, a.pedidos.length);
    f2.iniciar();
    checar(
      "outra instancia no mesmo quadro nao fura a vez",
      f2.estado().fase === "interrompida" && f2.estado().motivo === "ocupada" && a.pedidos.length === 1,
      f2.estado(),
    );
    await ate(() => f1.estado().fase === "concluida");
    checar("uma so por vez do inicio ao fim", a.atropelos() === 0 && a.maxSimultaneos() === 1);
    checar("a marca de fila ativa sai no fim", !a.doc.documentElement.hasAttribute("data-spro-pastas-fila"));
    f1.destruir();
    f2.destruir();
  }

  secao("fila: o clique do SEI rola a pagina ate a pasta; a fila devolve a rolagem (a barra do filtro fica a vista)");
  {
    const a = montarArvoreFalsa({ 1: { docs: docs(1, "a") }, 2: { docs: docs(1, "b") } });
    const win = a.doc.defaultView as unknown as { scrollX: number; scrollY: number; scrollTo: (x: number, y: number) => void };
    win.scrollX = 0;
    win.scrollY = 40;
    win.scrollTo = (x, y) => {
      win.scrollX = x;
      win.scrollY = y;
    };
    a.doc.addEventListener("click", (ev) => {
      if ((ev.target as Element).closest?.('a[id^="ancjoinPASTA"]')) win.scrollY = 900; // o SEI da foco ao no e o navegador rola
    });
    const fila = criarFila(a.doc, RAPIDA);
    fila.iniciar();
    await ate(() => fila.estado().fase === "concluida");
    checar("a rolagem do usuario volta ao lugar depois de cada clique", win.scrollY === 40 && a.carregada("PASTA2"), win.scrollY);
    fila.destruir();
  }

  secao("fila: arvore refeita no meio nao vira falha; abrir injetado");
  {
    const a = montarArvoreFalsa({ 1: { docs: docs(1, "a"), latenciaMs: 80 }, 2: { docs: docs(1, "b") } });
    const fila = criarFila(a.doc, { ...RAPIDA, prazoPastaMs: 500 });
    fila.iniciar();
    await tique(10);
    const raiz = a.doc.getElementById("divArvore") as HTMLElement;
    const filhos = [...raiz.childNodes];
    raiz.replaceChildren(); // a arvore some (recarga do quadro)
    await tique(40);
    checar("sem a pasta na tela: nao conta como falha", fila.estado().falhas.length === 0);
    raiz.replaceChildren(...filhos);
    fila.destruir();
  }
  {
    const a = montarArvoreFalsa({ 1: { docs: docs(1, "a") } });
    const vistas: string[] = [];
    const fila = criarFila(a.doc, {
      ...RAPIDA,
      abrir: (doc, id) => {
        vistas.push(id);
        doc.getElementById(`ancjoin${id}`)?.click();
      },
    });
    fila.iniciar();
    await ate(() => fila.estado().fase === "concluida");
    checar("o mecanismo de abrir pode ser trocado (e a espera continua pelo DOM)", vistas.join() === "PASTA1" && a.carregada("PASTA1"));
    fila.destruir();
  }

  await verificarBarraComFila();
}

const doc3 = (_prefixo: string, externos: number, internos: number): ConfigPasta["docs"] => [
  ...Array.from({ length: externos }, () => {
    proximoId += 1;
    return [`${proximoId}`, `Anexo (0${proximoId}1)`, "svg/documento_pdf.svg"] as [string, string, string];
  }),
  ...Array.from({ length: internos }, () => {
    proximoId += 1;
    return [`${proximoId}`, `Despacho (0${proximoId}1)`] as [string, string];
  }),
];

async function verificarBarraComFila(): Promise<void> {
  secao("barra + fila: usar o filtro carrega as pastas, uma por vez, com progresso");
  const montar = (pastas: Record<number, ConfigPasta>, opcoes: Partial<Parameters<typeof criarFila>[1]> = {}) => {
    const a = montarArvoreFalsa(pastas, { latenciaMs: 25 });
    (globalThis as { document?: Document }).document = a.doc; // `h()` cria os nos da barra no document global
    const ctl = ligarFiltro(
      { doc: a.doc, idProcedimento: "900", unidade: { sigla: "TESTE" }, documentos: { todos: () => [] } },
      { opcoesFila: { intervaloMs: 15, prazoPastaMs: 400, ...opcoes }, esperaConcluidaMs: 80 },
    )!;
    const q = <T extends Element>(sel: string): T => ctl.barra().querySelector(sel) as T;
    return { a, ctl, q, texto: () => q(".spro-f-fila-texto").textContent ?? "", filaVisivel: () => !q<HTMLElement>(".spro-f-fila").hidden };
  };
  {
    const { a, ctl, q, texto, filaVisivel } = montar({
      1: { docs: doc3("a", 2, 1), nome: "I" },
      2: { docs: doc3("b", 1, 2), nome: "II" },
      3: { docs: doc3("c", 3, 0), nome: "III" },
    });
    ctl.abrir();
    await tique(40);
    checar("abrir a lupa vazia nao pede pasta nenhuma", a.pedidos.length === 0 && !filaVisivel());
    const busca = q<HTMLInputElement>(".spro-f-busca");
    disparar(q('button[data-chip="externos"]'), "click");
    await tique(10);
    checar("ligar um chip comeca a carregar", a.pedidos.length >= 1 && filaVisivel());
    const vistos: string[] = [];
    const prog: string[] = [];
    const lim = Date.now() + 3000;
    while (Date.now() < lim && a.pedidos.length < 3 + 0 && !/Todas/.test(texto())) {
      vistos.push(texto());
      prog.push(q(".spro-f-prog").getAttribute("aria-valuenow") ?? "");
      await tique(8);
    }
    await ate(() => /Todas as pastas carregadas/.test(texto()));
    checar(
      "texto 'Carregando pastas n de m: nome'",
      vistos.some((t) => /^Carregando pastas 1 de 3: I$/.test(t)) && vistos.some((t) => /^Carregando pastas 2 de 3: II$/.test(t)),
      vistos,
    );
    checar(
      "barra de progresso com valor e rotulo",
      prog.some((v) => Number(v) > 0) && q(".spro-f-prog").getAttribute("aria-label") === "Progresso do carregamento das pastas",
    );
    checar("estado final 'Todas as pastas carregadas'", /Todas as pastas carregadas/.test(texto()));
    checar(
      "contagem real: 6 externos de 9 documentos",
      (q(".spro-f-status-texto").textContent ?? "") === "6 de 9 documentos",
      q(".spro-f-status-texto").textContent,
    );
    checar("uma por vez no servidor", a.maxSimultaneos() === 1 && a.atropelos() === 0 && a.pedidos.length === 3);
    await ate(() => !filaVisivel());
    checar("a mensagem final some depois de alguns segundos", !filaVisivel());
    checar("a busca e o mesmo campo (o foco nao se perde ao renderizar)", q(".spro-f-busca") === busca && busca.isConnected);
    checar(
      "aria-live na linha de status e botoes com aria-label",
      q(".spro-f-status").getAttribute("aria-live") === "polite" && !!q(".spro-f-chip").getAttribute("aria-label"),
    );
    // limpar: re-fecha o que a fila abriu
    ctl.limpar();
    checar(
      "limpar re-fecha as pastas que o filtro abriu",
      ["PASTA1", "PASTA2", "PASTA3"].every((p) => !pastaAberta(a.doc, p)),
    );
    const pedidos = a.pedidos.length;
    disparar(q('button[data-chip="externos"]'), "click");
    await tique(120);
    checar(
      "ligar de novo: reabre as pastas sem pedir nada ao servidor",
      a.pedidos.length === pedidos && ["PASTA1", "PASTA2", "PASTA3"].every((p) => pastaAberta(a.doc, p)),
      [a.pedidos.length, pedidos],
    );
    checar("sem rodada nova de carga: nada de 'Carregando' na tela", !/Carregando/.test(texto()));
    // so texto
    ctl.limpar();
    busca.value = "Despacho";
    disparar(busca, "input");
    await tique(150);
    checar(
      "so busca por texto tambem abre as pastas",
      ["PASTA1", "PASTA2", "PASTA3"].every((p) => pastaAberta(a.doc, p)),
    );
    // fechar a barra
    ctl.fechar();
    checar(
      "fechar a barra re-fecha tudo",
      ["PASTA1", "PASTA2", "PASTA3"].every((p) => !pastaAberta(a.doc, p)),
    );
    ctl.destruir();
  }
  {
    // Parar e continuar pela barra.
    const { a, ctl, q, texto } = montar({
      1: { docs: doc3("a", 1, 0), nome: "I", latenciaMs: 40 },
      2: { docs: doc3("b", 1, 0), nome: "II" },
      3: { docs: doc3("c", 1, 0), nome: "III" },
    });
    ctl.abrir();
    disparar(q('button[data-chip="externos"]'), "click");
    await ate(() => a.pedidos.length === 1);
    const parar = botao(ctl.barra(), "Parar de carregar as pastas")!;
    checar("botao Parar com aria-label", !!parar && parar.textContent === "Parar");
    parar.click();
    await tique(100);
    checar(
      "parou: 'Parou: 2 pastas ainda fechadas.' com Continuar",
      /^Parou: 2 pastas ainda fechadas\.$/.test(texto()) && !!botao(ctl.barra(), "Continuar a carregar as pastas fechadas"),
      texto(),
    );
    checar("so a pasta em carga terminou", a.pedidos.length === 1 && a.carregada("PASTA1"));
    // digitar nao retoma sozinho
    const busca = q<HTMLInputElement>(".spro-f-busca");
    busca.value = "Anexo";
    disparar(busca, "input");
    await tique(120);
    checar("digitar depois de parar nao retoma", a.pedidos.length === 1);
    botao(ctl.barra(), "Continuar a carregar as pastas fechadas")!.click();
    await ate(() => /Todas/.test(texto()));
    checar("Continuar termina as demais", a.pedidos.length === 3 && /Todas as pastas carregadas/.test(texto()));
    ctl.destruir();
  }
  {
    // Falha de uma pasta e Tentar de novo; fechar a barra no meio.
    const { a, ctl, q, texto } = montar({
      1: { docs: doc3("a", 1, 0), nome: "I" },
      2: { resposta: "erro", nome: "II" },
      3: { docs: doc3("c", 1, 0), nome: "III" },
    });
    ctl.abrir();
    disparar(q('button[data-chip="externos"]'), "click");
    await ate(() => /nao carregou|n\u00E3o carregou/.test(texto()));
    checar(
      "'1 pasta nao carregou.' + Tentar de novo; as demais carregaram",
      /^1 pasta n\u00E3o carregou\.$/.test(texto()) &&
        a.carregada("PASTA3") &&
        !!botao(ctl.barra(), "Tentar de novo carregar as pastas que falharam"),
      texto(),
    );
    a.config.set("PASTA2", { docs: doc3("d", 1, 0) });
    botao(ctl.barra(), "Tentar de novo carregar as pastas que falharam")!.click();
    await ate(() => a.carregada("PASTA2"));
    checar("Tentar de novo recarrega so a que falhou", a.carregada("PASTA2") && a.pedidos.filter((p) => p.pasta === "PASTA1").length === 1);
    ctl.destruir();
  }
  {
    const { a, ctl, q } = montar({
      1: { docs: doc3("a", 1, 0), latenciaMs: 60 },
      2: { docs: doc3("b", 1, 0) },
      3: { docs: doc3("c", 1, 0) },
    });
    ctl.abrir();
    disparar(q('button[data-chip="externos"]'), "click");
    await ate(() => a.pedidos.length === 1);
    ctl.fechar();
    await tique(250);
    checar("fechar a barra no meio: cancela a fila (nenhuma outra pasta e pedida)", a.pedidos.length === 1);
    checar("a pasta que estava em carga e re-fechada quando termina", a.carregada("PASTA1") && !pastaAberta(a.doc, "PASTA1"));
    ctl.destruir();
  }
  secao("barra + fila: pastas ja carregadas mas fechadas entram abertas e voltam fechadas; as do usuario nao");
  {
    const { a, ctl, q } = montar({
      1: { docs: doc3("a", 1, 0), carregada: true },
      2: { docs: doc3("b", 1, 0) },
      3: { docs: doc3("c", 1, 0), carregada: true },
    });
    a.clicar("PASTA1"); // o usuario fecha a 1 (ja carregada)
    ctl.abrir();
    disparar(q('button[data-chip="externos"]'), "click");
    await ate(() => a.carregada("PASTA2") && pastaAberta(a.doc, "PASTA1"));
    checar(
      "a 1 (carregada e fechada pelo usuario antes) abre sem pedido; so a 2 vai ao servidor",
      pastaAberta(a.doc, "PASTA1") && a.pedidos.length === 1 && a.pedidos[0]?.pasta === "PASTA2",
      a.pedidos.map((p) => p.pasta),
    );
    ctl.limpar();
    checar(
      "limpar: a 1 e a 2 voltam fechadas; a 3 (aberta desde o inicio) continua aberta",
      !pastaAberta(a.doc, "PASTA1") && !pastaAberta(a.doc, "PASTA2") && pastaAberta(a.doc, "PASTA3"),
    );
    ctl.destruir();
  }
}
