/**
 * Contagem de documentos com pastas fechadas: o tamanho da pasta (aprendido, do legado ou o padrão), a estimativa (sem
 * pasta fechada, uma, várias, a última fechada), os subtextos, os outros cards "nas pastas abertas", o "Contar tudo" (pedido
 * ao quadro da árvore, progresso, fim, parar, erro) e a persistência. A árvore é a falsa de `arvore-sei-falsa.ts`.
 */
import { lerArvore } from "@nucleo/dominio/arvore";
import { definirAnalisador } from "@nucleo/sessao/dom";
import { paginaDe } from "@nucleo/sessao/pagina";
import { DOMParser } from "linkedom";
import { cardsDaArvore } from "../src/capa/cards";
import { type DepsCapa, type FonteDeCache, montarCapa, type PonteDaArvore } from "../src/capa/controle";
import { estimarDocumentos, textoDaEstimativa } from "../src/capa/estimativa";
import { lerDaTela } from "../src/capa/pastas";
import { lerContagem, textoDaContagem } from "../src/capa/ponte";
import { resumoDoProcesso } from "../src/capa/resumo";
import { montarVista } from "../src/capa/vista";
import { ATRIBUTO_CONTAGEM, chaveTamanhoPasta, EVENTO_CAPA_CONTAR, EVENTO_CAPA_PARAR_CONTAGEM } from "../src/modelo/constantes";
import {
  gravarTamanho,
  lerTamanhoAprendido,
  lerTamanhoDoLegado,
  resolverTamanho,
  TAMANHO_PADRAO,
  tamanhoDasPastas,
} from "../src/modelo/tamanhoPasta";
import { contagemDaFila, ligarPonteDaCapa } from "../src/pagina/ponteCapa";
import { type ConfigPasta, montarArvoreFalsa } from "./arvore-sei-falsa";
import { checar, instalarDom, secao, tique } from "./util";

definirAnalisador((html) => new DOMParser().parseFromString(html, "text/html") as unknown as Document);

const HOST = "treinamento.sei.sp.gov.br";
const RAPIDA = { intervaloMs: 15, prazoPastaMs: 400 };
const AGORA = new Date(2026, 9, 25, 10, 0);

let proximo = 5000;
const docs = (n: number, icone?: string): ConfigPasta["docs"] =>
  Array.from({ length: n }, () => {
    proximo += 1;
    return [`${proximo}`, `Despacho (0${proximo}1)`, icone] as [string, string, string | undefined];
  }) as ConfigPasta["docs"];

async function ate(cond: () => boolean, ms = 3000): Promise<boolean> {
  const lim = Date.now() + ms;
  while (Date.now() < lim) {
    if (cond()) return true;
    await tique(5);
  }
  return cond();
}

/** Armazenamento falso (localStorage). */
function loja(inicial: Record<string, string> = {}): Pick<Storage, "getItem" | "setItem"> & { m: Map<string, string> } {
  const m = new Map(Object.entries(inicial));
  return { m, getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, String(v)) };
}

/** A árvore falsa com o nó do processo (para o `lerArvore`) e o nó selecionado. */
function arvoreDoProcesso(pastas: Record<number, ConfigPasta>) {
  const a = montarArvoreFalsa(pastas);
  const s = a.doc.createElement("script");
  s.textContent =
    'Nos[0] = new infraArvoreNo("PROCESSO","900",null,"controlador.php?acao=arvore_visualizar&id_procedimento=900&infra_hash=0","ifrVisualizacao","50300.000001/2026-01","Processo","svg/processo.svg","svg/processo.svg","svg/processo.svg",true,true,null,null,null,"50300.000001/2026-01");\nNos[0].acoes = \'\';';
  a.doc.body.append(s);
  const span = a.doc.createElement("span");
  span.id = "span900";
  span.className = "infraArvoreNoSelecionado";
  a.doc.getElementById("frmArvore")?.append(span);
  const arv = () => lerArvore(paginaDe(a.doc, `https://${HOST}/sei/controlador.php?acao=procedimento_visualizar&id_procedimento=900`));
  return { ...a, arv };
}

const cheia = (n: number): ConfigPasta => ({ docs: docs(n) });

export async function verificarContagem(): Promise<void> {
  // ===== O tamanho da pasta =====
  secao("tamanho da pasta: aprender das pastas carregadas que nao sao a ultima");
  {
    const p = (nos: number, ultima = false, carregada = true) => ({ carregada, nos, ultima });
    checar("sem pastas: nada a aprender", tamanhoDasPastas([]) === null);
    checar("so a ultima carregada: nada a aprender", tamanhoDasPastas([p(7, true)]) === null);
    checar("uma pasta cheia (nao-ultima): o tamanho dela", tamanhoDasPastas([p(20), p(7, true)]) === 20);
    checar("pasta nao carregada nao ensina", tamanhoDasPastas([p(0, false, false), p(7, true)]) === null);
    checar("pasta carregada vazia ('Nenhum protocolo') nao ensina", tamanhoDasPastas([p(0), p(7, true)]) === null);
    checar("o valor mais frequente vence (20, 20, 19)", tamanhoDasPastas([p(20), p(19), p(20), p(5, true)]) === 20);
    checar("empate: o maior (19 e 20)", tamanhoDasPastas([p(19), p(20), p(5, true)]) === 20);
    checar("tamanho fora do razoavel (1) e ignorado", tamanhoDasPastas([p(1), p(1, true)]) === null);

    const a = loja();
    const r0 = resolverTamanho([], a, HOST);
    checar("nada aprendido: 20, origem 'padrao', e nada gravado", r0.valor === 20 && r0.origem === "padrao" && a.m.size === 0, r0);
    const r1 = resolverTamanho([p(25), p(3, true)], a, HOST);
    checar(
      "pasta aberta nao-ultima: 25 medido e gravado em processo/pasta-tamanho/<host>",
      r1.valor === 25 &&
        r1.origem === "medido" &&
        a.m.get(`processo/pasta-tamanho/${HOST}`) === "25" &&
        chaveTamanhoPasta(HOST) === `processo/pasta-tamanho/${HOST}`,
      r1,
    );
    const r2 = resolverTamanho([], a, HOST);
    checar("sem pastas na tela, vale o aprendido (persistente)", r2.valor === 25 && r2.origem === "aprendido", r2);
    const r3 = resolverTamanho([p(30), p(30), p(1, true)], a, HOST);
    checar("uma contagem nova corrige o aprendido", r3.valor === 30 && lerTamanhoAprendido(a, HOST) === 30, r3);
    checar("gravar o mesmo valor nao grava de novo", gravarTamanho(a, HOST, 30) === false);

    const leg = loja({ optionsPro: JSON.stringify({ sumDocsPasta: 25, outra: 1 }) });
    checar("le o que o legado guarda (optionsPro.sumDocsPasta)", lerTamanhoDoLegado(leg) === 25);
    const r4 = resolverTamanho([], leg, HOST);
    checar("sem aprendizado proprio, vale o do legado e nada e gravado", r4.valor === 25 && r4.origem === "legado" && leg.m.size === 1, r4);
    const r5 = resolverTamanho([p(20), p(4, true)], leg, HOST);
    checar(
      "a medida da tela vence o legado e nao mexe no formato dele",
      r5.valor === 20 && leg.m.get("optionsPro") === JSON.stringify({ sumDocsPasta: 25, outra: 1 }),
      r5,
    );
    const lixo = loja({ [chaveTamanhoPasta(HOST)]: "abc", optionsPro: "{nao e json" });
    checar("valores invalidos guardados: cai no padrao, sem erro", resolverTamanho([], lixo, HOST).origem === "padrao");
    const soLeitura = { getItem: () => null } as Pick<Storage, "getItem">;
    checar("sem setItem: so le, nao quebra", resolverTamanho([p(20), p(2, true)], soLeitura, HOST).valor === 20);
    const quebrado = {
      getItem: () => null,
      setItem: () => {
        throw new Error("cota");
      },
    };
    checar("setItem que falha nao derruba", resolverTamanho([p(20), p(2, true)], quebrado, HOST).valor === 20);
    checar("padrao exportado e 20", TAMANHO_PADRAO === 20);
  }

  // ===== A conta =====
  secao("estimativa: 0, 1 e varias pastas fechadas, ultima fechada, exatidao");
  {
    const t20 = { valor: 20, origem: "aprendido" as const };
    const pa = (id: string, carregada: boolean, topo = true) => ({ id, carregada, nos: carregada ? 1 : 0, topo });
    const e0 = estimarDocumentos([pa("PASTA1", true), pa("PASTA2", true)], 33, t20);
    checar("todas carregadas: exato", e0.exato && e0.minimo === 33 && e0.maximo === 33 && e0.porCarregar === 0, e0);
    checar("exato: valor puro e sem subtexto", textoDaEstimativa(e0).valor === "33" && textoDaEstimativa(e0).detalhe === undefined);
    const sem = estimarDocumentos([], 12, t20);
    checar("sem pastas: exato", sem.exato && sem.minimo === 12);

    const e1 = estimarDocumentos([pa("PASTA1", false), pa("PASTA2", true)], 10, t20);
    checar("1 fechada (nao-ultima) + ultima aberta: 20 + 10", !e1.exato && e1.minimo === 30 && e1.maximo === 30 && e1.cheias === 1, e1);
    const t1 = textoDaEstimativa(e1);
    checar(
      "subtexto: 'estimado: 1 pasta x 20 + 10 abertos'",
      t1.valor === "≈ 30" && t1.detalhe === "estimado: 1 pasta × 20 + 10 abertos",
      t1,
    );

    const e5 = estimarDocumentos([...[1, 2, 3, 4, 5].map((n) => pa(`PASTA${n}`, false)), pa("PASTA6", true)], 10, t20);
    const t5 = textoDaEstimativa(e5);
    checar(
      "5 fechadas + 10 abertos = 110",
      e5.minimo === 110 && t5.valor === "≈ 110" && t5.detalhe === "estimado: 5 pastas × 20 + 10 abertos",
      t5,
    );

    const eu = estimarDocumentos([pa("PASTA1", false), pa("PASTA2", false), pa("PASTA3", false)], 0, t20);
    const tu = textoDaEstimativa(eu);
    checar(
      "a ultima fechada e parcial: faixa (2 x 20 + 1) a (2 x 20 + 20)",
      eu.ultimaFechada && eu.cheias === 2 && eu.minimo === 41 && eu.maximo === 60 && tu.valor === "≈ 41 a 60",
      [eu, tu],
    );
    checar(
      "faixa: o subtexto explica a ultima",
      /2 pastas × 20/.test(tu.detalhe ?? "") && /a última pasta \(de 1 a 20\)/.test(tu.detalhe ?? ""),
      tu.detalhe,
    );
    const ep = estimarDocumentos([pa("PASTA1", true), pa("PASTA2", false)], 20, t20);
    checar("so a ultima fechada: 20 + (1 a 20)", ep.minimo === 21 && ep.maximo === 40 && ep.cheias === 0, ep);
    checar("sem 'pastas x' quando nao ha pasta cheia", !/pastas? ×/.test(textoDaEstimativa(ep).detalhe ?? ""));

    const tp = textoDaEstimativa(estimarDocumentos([pa("PASTA1", false), pa("PASTA2", true)], 5, { valor: 20, origem: "padrao" }));
    checar("tamanho nao aprendido: estimado, 20 'padrao do SEI'", /padrão do SEI/.test(tp.detalhe ?? "") && tp.valor.startsWith("≈"), tp);
    const subpasta = estimarDocumentos([pa("PASTA1", true), pa("PASTA2", false, false), pa("PASTA3", true)], 7, t20);
    checar(
      "subpasta fechada conta como pasta cheia e a ultima e a de cima",
      subpasta.cheias === 1 && !subpasta.ultimaFechada && subpasta.minimo === 27,
      subpasta,
    );
    const um = estimarDocumentos([pa("PASTA1", false), pa("PASTA2", true)], 1, { valor: 25, origem: "legado" });
    checar("usa o tamanho do legado", um.minimo === 26);
  }

  // ===== A leitura da tela =====
  secao("leitura da tela: pastas, documentos de pastas abertas, cancelados e movidos");
  {
    const a = arvoreDoProcesso({
      1: { docs: [...(docs(18) ?? []), ...(docs(1, "svg/documento_movido.svg") ?? []), ...(docs(1, "svg/documento_cancelado.svg") ?? [])] },
      2: cheia(20),
      3: { docs: docs(4), carregada: true },
    });
    const antes = lerDaTela(a.doc, a.arv());
    checar(
      "fonte DOM, 3 pastas, so a ultima carregada",
      antes.fonte === "dom" && antes.pastas.length === 3 && antes.pastas.map((p) => p.carregada).join() === "false,false,true",
      antes.pastas,
    );
    checar("antes de abrir: 4 documentos (os da pasta aberta)", antes.documentos.length === 4);
    a.clicar("PASTA1");
    await ate(() => a.carregada("PASTA1"));
    const depois = lerDaTela(a.doc, a.arv());
    const p1 = depois.pastas.find((p) => p.id === "PASTA1");
    checar("pasta aberta pelo usuario: 20 nos (movido e cancelado contam)", p1?.carregada === true && p1.nos === 20, p1);
    checar("e os documentos dela entram na lista (24)", depois.documentos.length === 24, depois.documentos.length);
    checar("o cancelado e o movido sao lidos como documentos", depois.documentos.filter((d) => d.cancelado).length === 1);
    a.clicar("PASTA1"); // fechar: o conteudo fica no DOM
    const fechada = lerDaTela(a.doc, a.arv());
    checar(
      "pasta carregada e depois fechada na tela continua contada",
      fechada.pastas.find((p) => p.id === "PASTA1")?.carregada === true && fechada.documentos.length === 24,
    );
  }

  // ===== Os cards =====
  secao("cards: Documentos estimado; os demais so 'nas pastas abertas'; exatos com tudo carregado");
  {
    const a = arvoreDoProcesso({
      1: cheia(20),
      2: cheia(20),
      3: cheia(20),
      4: cheia(20),
      5: cheia(20),
      6: { docs: docs(10), carregada: true },
    });
    const arv = a.arv();
    const tela = lerDaTela(a.doc, arv);
    const cartoes = cardsDaArvore(arv, { tela, tamanho: { valor: 20, origem: "aprendido" }, podeContar: true });
    const por = (id: string) => cartoes.find((c) => c.id === id);
    checar("Documentos: 'a 110' = 5 x 20 + 10", por("documentos")?.valor === "≈ 110", por("documentos"));
    checar(
      "Documentos: subtexto da conta",
      por("documentos")?.detalhe === "estimado: 5 pastas × 20 + 10 abertos",
      por("documentos")?.detalhe,
    );
    checar(
      "Documentos: botao 'Contar tudo'",
      por("documentos")?.acao?.tipo === "contar" && por("documentos")?.acao?.rotulo === "Contar tudo",
    );
    checar(
      "Internos e externos: so as abertas, dito",
      por("internosExternos")?.valor === "10 / 0" && por("internosExternos")?.detalhe === "nas pastas abertas",
    );
    checar(
      "Assinados: 0 de 10 nas pastas abertas e SEM percentual do processo",
      por("assinados")?.valor === "0 de 10" && por("assinados")?.detalhe === "nas pastas abertas",
      por("assinados"),
    );
    checar(
      "Cancelados e Sigilosos: 'nas pastas abertas'",
      por("cancelados")?.detalhe === "nas pastas abertas" && por("sigilosos")?.detalhe === "nas pastas abertas",
    );
    checar("Pastas: 6, '5 por carregar'", por("pastas")?.valor === "6" && por("pastas")?.detalhe === "5 por carregar", por("pastas"));
    checar("so o card Documentos tem botao", cartoes.filter((c) => c.acao).length === 1);

    const sem = cardsDaArvore(arv, { tela, tamanho: { valor: 20, origem: "aprendido" } });
    checar("a ponte sem 'contar': sem botao", !sem.find((c) => c.id === "documentos")?.acao);

    const contando = cardsDaArvore(arv, {
      tela,
      tamanho: { valor: 20, origem: "aprendido" },
      podeContar: true,
      contagem: { fase: "contando", feito: 2, total: 5 },
    });
    const cc = contando.find((c) => c.id === "documentos");
    checar(
      "contando: 'contando as pastas: 2 de 5', botao Parar e progresso",
      cc?.detalhe === "contando as pastas: 2 de 5" && cc.acao?.tipo === "parar" && cc.progresso?.feito === 2 && cc.progresso.total === 5,
      cc,
    );
    const parou = cardsDaArvore(arv, { tela, podeContar: true, contagem: { fase: "parou", restantes: 3 } }).find(
      (c) => c.id === "documentos",
    );
    checar(
      "parou: informa as restantes e oferece Continuar",
      /parou: 3 pastas sem contar/.test(parou?.detalhe ?? "") && parou?.acao?.tipo === "continuar",
      parou,
    );
    const erro = cardsDaArvore(arv, { tela, podeContar: true, contagem: { fase: "erro", mensagem: "A sessao do SEI expirou." } }).find(
      (c) => c.id === "documentos",
    );
    checar(
      "erro: mostra a mensagem e 'Tentar de novo'",
      /sessao do SEI expirou/.test(erro?.detalhe ?? "") && erro?.acao?.rotulo === "Tentar de novo",
      erro,
    );

    // Tudo carregado: exato, sem aviso, com percentual.
    const b = arvoreDoProcesso({ 1: { docs: docs(20), carregada: true }, 2: { docs: docs(6), carregada: true } });
    const exatos = cardsDaArvore(b.arv(), { tela: lerDaTela(b.doc, b.arv()), podeContar: true });
    const pe = (id: string) => exatos.find((c) => c.id === id);
    checar(
      "tudo carregado: Documentos exato (26), sem 'a', sem subtexto e sem botao",
      pe("documentos")?.valor === "26" && pe("documentos")?.detalhe === undefined && !pe("documentos")?.acao,
      pe("documentos"),
    );
    checar(
      "tudo carregado: Assinados com percentual do processo",
      pe("assinados")?.valor === "0 de 26" && pe("assinados")?.detalhe === "0% do processo",
      pe("assinados"),
    );
    checar(
      "tudo carregado: Internos e externos como antes",
      pe("internosExternos")?.detalhe === "gerados no SEI / anexados" && pe("pastas")?.detalhe === undefined,
    );

    // Copiar resumo: estimado e dito.
    const v = montarVista({
      arv,
      fatias: {},
      passagens: null,
      unidade: "TESTE",
      agora: AGORA,
      limite: 15,
      recebidoEm: null,
      coleta: { fase: "parada" },
      espera: "aguardando",
      linkPermanente: "x",
      tela,
      tamanho: { valor: 20, origem: "aprendido" },
    });
    const txt = resumoDoProcesso(v.resumo);
    checar("copiar resumo: '≈ 110 (nas pastas abertas: 10; ...)'", /Documentos: ≈ 110 \(nas pastas abertas: 10;/.test(txt), txt);
  }

  // ===== O "Contar tudo" no quadro da arvore =====
  secao("Contar tudo: pedido a arvore, progresso, fim, re-fechar, parar, erro");
  {
    const a = arvoreDoProcesso({
      1: { docs: docs(20) },
      2: { docs: docs(20) },
      3: { docs: docs(20) },
      4: { docs: docs(6), carregada: true },
    });
    const Ev = (a.doc.defaultView as unknown as { Event: typeof Event }).Event;
    const disparo = (n: string) => a.doc.dispatchEvent(new Ev(n));
    const attr = () => a.doc.documentElement.getAttribute(ATRIBUTO_CONTAGEM);
    const sair = ligarPonteDaCapa(a.doc, async () => null, RAPIDA);
    const vistos = new Set<string>();
    const olho = setInterval(() => void vistos.add(attr() ?? ""), 2);
    disparo(EVENTO_CAPA_CONTAR);
    await ate(() => attr() === "pronto", 4000);
    clearInterval(olho);
    checar("termina com o atributo 'pronto'", attr() === "pronto", attr());
    checar(
      "passou por 'contando:N/3'",
      [...vistos].some((v) => /^contando:\d\/3$/.test(v)),
      [...vistos],
    );
    checar(
      "as 3 pastas foram pedidas, uma por vez, em ordem",
      a.pedidos.map((p) => p.pasta).join() === "PASTA1,PASTA2,PASTA3" && a.maxSimultaneos() === 1,
      a.pedidos.map((p) => p.pasta),
    );
    const fechadas = [1, 2, 3].every((n) => (a.doc.getElementById(`divPASTA${n}`) as HTMLElement).style.display === "none");
    checar("as pastas que a contagem abriu voltaram a ficar fechadas", fechadas);
    const lida = lerDaTela(a.doc, a.arv());
    const exato = estimarDocumentos(lida.pastas, lida.documentos.length, { valor: 20, origem: "medido" });
    checar("depois: exato, 66 documentos (3 x 20 + 6), com as pastas fechadas na tela", exato.exato && exato.minimo === 66, exato);
    checar(
      "o tamanho medido pela contagem e 20",
      resolverTamanho(
        lida.pastas.map((p) => ({ carregada: p.carregada, nos: p.nos, ultima: p.id === "PASTA4" })),
        loja(),
        HOST,
      ).valor === 20,
    );
    disparo(EVENTO_CAPA_CONTAR);
    await tique(40);
    checar("contar de novo com tudo carregado: nenhum pedido novo, 'pronto'", a.pedidos.length === 3 && attr() === "pronto");
    sair();
    checar("ao desligar a ponte o atributo sai", attr() === null);
  }
  {
    // Parar no meio.
    const a = arvoreDoProcesso({
      1: { docs: docs(3), latenciaMs: 60 },
      2: { docs: docs(3), latenciaMs: 60 },
      3: { docs: docs(3), latenciaMs: 60 },
      4: { docs: docs(2), carregada: true },
    });
    const Ev = (a.doc.defaultView as unknown as { Event: typeof Event }).Event;
    const disparo = (n: string) => a.doc.dispatchEvent(new Ev(n));
    const attr = () => a.doc.documentElement.getAttribute(ATRIBUTO_CONTAGEM);
    const sair = ligarPonteDaCapa(a.doc, async () => null, RAPIDA);
    disparo(EVENTO_CAPA_CONTAR);
    await ate(() => a.pedidos.length >= 1);
    disparo(EVENTO_CAPA_PARAR_CONTAGEM);
    checar("Parar: o atributo diz quantas restam", /^parou:[1-3]$/.test(attr() ?? ""), attr());
    await tique(250);
    checar("depois de parar nenhuma outra pasta e pedida (so a que estava em carga)", a.pedidos.length === 1, a.pedidos.length);
    const aberta = (a.doc.getElementById("divPASTA1") as HTMLElement).style.display;
    checar("a pasta que estava em carga volta a ficar fechada (e fica contada)", aberta === "none" && a.carregada("PASTA1"), aberta);
    disparo(EVENTO_CAPA_CONTAR);
    await ate(() => attr() === "pronto", 4000);
    checar("Continuar: carrega so as que faltavam e termina", attr() === "pronto" && a.pedidos.length === 3, [attr(), a.pedidos.length]);
    sair();
  }
  {
    // Erro: pasta que falha; outra fila ativa; sessao.
    const a = arvoreDoProcesso({
      1: { docs: docs(2), resposta: "erro" },
      2: { docs: docs(2) },
      3: { docs: docs(2), carregada: true },
    });
    const Ev = (a.doc.defaultView as unknown as { Event: typeof Event }).Event;
    const disparo = (n: string) => a.doc.dispatchEvent(new Ev(n));
    const attr = () => a.doc.documentElement.getAttribute(ATRIBUTO_CONTAGEM);
    const sair = ligarPonteDaCapa(a.doc, async () => null, RAPIDA);
    disparo(EVENTO_CAPA_CONTAR);
    await ate(() => /^erro:/.test(attr() ?? ""), 4000);
    checar("pasta que nao carregou: 'erro: 1 pasta nao carregou.'", attr() === "erro:1 pasta não carregou.", attr());
    checar("a outra pasta foi contada mesmo assim", a.carregada("PASTA2"));
    sair();

    const b = arvoreDoProcesso({ 1: cheia(2), 2: { docs: docs(1), carregada: true } });
    b.doc.documentElement.setAttribute("data-spro-pastas-fila", `outra:${Date.now()}`);
    const Evb = (b.doc.defaultView as unknown as { Event: typeof Event }).Event;
    const sair2 = ligarPonteDaCapa(b.doc, async () => null, RAPIDA);
    b.doc.dispatchEvent(new Evb(EVENTO_CAPA_CONTAR));
    await tique(30);
    checar(
      "outra carga de pastas em andamento: erro claro, nenhuma pasta pedida",
      /^erro:Outra carga/.test(b.doc.documentElement.getAttribute(ATRIBUTO_CONTAGEM) ?? "") && b.pedidos.length === 0,
      b.doc.documentElement.getAttribute(ATRIBUTO_CONTAGEM),
    );
    sair2();
    checar(
      "traducao da fila: sessao expirada",
      JSON.stringify(
        contagemDaFila({
          fase: "interrompida",
          atual: null,
          nomeAtual: "",
          feitas: 1,
          total: 3,
          restantes: 2,
          falhas: ["PASTA1"],
          motivo: "sessao",
        }),
      ) === JSON.stringify({ fase: "erro", mensagem: "A sessão do SEI expirou." }),
    );
    checar(
      "traducao da fila: teto = parou",
      JSON.stringify(contagemDaFila({ fase: "teto", atual: null, nomeAtual: "", feitas: 60, total: 70, restantes: 10, falhas: [] })) ===
        JSON.stringify({ fase: "parou", restantes: 10 }),
    );
  }

  secao("Contar tudo: o texto do atributo e a leitura da capa");
  {
    checar("contando:2/5", JSON.stringify(lerContagem("contando:2/5")) === JSON.stringify({ fase: "contando", feito: 2, total: 5 }));
    checar("parou:3", JSON.stringify(lerContagem("parou:3")) === JSON.stringify({ fase: "parou", restantes: 3 }));
    checar("erro:mensagem", JSON.stringify(lerContagem("erro:Falhou.")) === JSON.stringify({ fase: "erro", mensagem: "Falhou." }));
    checar(
      "pronto, vazio e lixo = parada",
      ["pronto", null, "", "xyz"].every((v) => lerContagem(v).fase === "parada"),
    );
    checar("ida e volta", textoDaContagem(lerContagem("contando:1/9")) === "contando:1/9" && textoDaContagem({ fase: "parada" }) === null);
  }

  // ===== A capa inteira =====
  secao("capa: botao Contar tudo, progresso, exato ao fim, aprendizado persistente");
  {
    const a = arvoreDoProcesso({
      1: { docs: docs(20) },
      2: { docs: docs(20) },
      3: { docs: docs(8), carregada: true },
    });
    const capaDoc = instalarDom('<html><body><div id="divArvoreHtml"></div></body></html>');
    const pedidos: string[] = [];
    const Ev = (a.doc.defaultView as unknown as { Event: typeof Event }).Event;
    const sairPonte = ligarPonteDaCapa(a.doc, async () => null, RAPIDA);
    const ponte: PonteDaArvore = {
      documento: () => a.doc,
      pedirFatias: () => {},
      calcular: () => {},
      cancelar: () => {},
      abrirHistorico: () => {},
      coleta: () => ({ fase: "parada" }),
      aoMudarColeta: () => () => {},
      aoRecarregarArvore: () => () => {},
      contar: () => {
        pedidos.push("contar");
        a.doc.dispatchEvent(new Ev(EVENTO_CAPA_CONTAR));
      },
      pararContagem: () => {
        pedidos.push("parar");
        a.doc.dispatchEvent(new Ev(EVENTO_CAPA_PARAR_CONTAGEM));
      },
      contagem: () => lerContagem(a.doc.documentElement.getAttribute(ATRIBUTO_CONTAGEM)),
      aoMudarArvore: (cb) => {
        const t = setInterval(cb, 12);
        return () => clearInterval(t);
      },
    };
    const fonte: FonteDeCache = { fatias: async () => ({}), historico: async () => null, aoMudar: () => () => {} };
    const st = loja();
    const deps: DepsCapa = {
      doc: capaDoc,
      ponte,
      cache: () => fonte,
      agora: () => AGORA,
      unidade: "TESTE",
      limite: 15,
      armazenamento: st,
      host: HOST,
      linkPermanente: (id) => `https://${HOST}/sei/controlador.php?acao=procedimento_trabalhar&id_procedimento=${id}`,
      copiar: async () => true,
      avisar: () => {},
      escuro: () => false,
      aoMudarTema: () => () => {},
      prazoMs: 300,
      esperaMs: 60,
    };
    const capa = await montarCapa(deps);
    checar("monta a capa", !!capa);
    const card = () => capaDoc.querySelector('[data-id="documentos"]') as HTMLElement;
    const txt = (e: Element | null) => (e?.textContent ?? "").replace(/\s+/g, " ").trim();
    checar(
      "antes: '≈ 48' (2 x 20 + 8), estimado, com o botao Contar tudo",
      /≈ 48/.test(txt(card())) &&
        /estimado: 2 pastas × 20 \+ 8 abertos/.test(txt(card())) &&
        !!card().querySelector("button.spro-c-card-acao"),
      txt(card()),
    );
    checar("antes: 20 por pasta e o padrao do SEI (nada aprendido)", /padrão do SEI/.test(txt(card())));
    checar(
      "os outros cards dizem 'nas pastas abertas'",
      /nas pastas abertas/.test(txt(capaDoc.querySelector('[data-id="assinados"]'))) &&
        !/% do processo/.test(txt(capaDoc.querySelector('[data-id="assinados"]'))),
    );
    // O usuario abre a PASTA1 sozinho: a capa aprende o tamanho (20) e o guarda.
    a.clicar("PASTA1");
    await ate(() => a.carregada("PASTA1"));
    await ate(() => st.m.has(`processo/pasta-tamanho/${HOST}`), 1500);
    checar(
      "a pasta aberta pelo usuario ensina: 20 guardado em processo/pasta-tamanho/<host>",
      st.m.get(`processo/pasta-tamanho/${HOST}`) === "20",
      [...st.m],
    );
    await ate(() => /estimado: 1 pasta × 20 \+ 28 abertos/.test(txt(card())), 1500);
    checar(
      "e o card se refaz: 1 x 20 + 28 abertos = 48, sem 'padrao'",
      /estimado: 1 pasta × 20 \+ 28 abertos/.test(txt(card())) && !/padrão do SEI/.test(txt(card())),
      txt(card()),
    );
    // Clique no botao.
    (card().querySelector("button.spro-c-card-acao") as HTMLElement).click();
    checar("o clique pede a contagem ao quadro da arvore", pedidos.join() === "contar", pedidos);
    await ate(() => /contando|≈ 48/.test(txt(card())) === false || a.carregada("PASTA2"), 3000);
    const valorDe = () => txt(card().querySelector(".spro-c-valor"));
    await ate(() => valorDe() === "48", 3000);
    checar(
      "ao fim: 48 exato, sem botao nem subtexto",
      valorDe() === "48" && !card().querySelector("button") && !card().querySelector(".spro-c-detalhe"),
      txt(card()),
    );
    const ass = txt(capaDoc.querySelector('[data-id="assinados"]'));
    checar("ao fim: Assinados volta a '0 de 48' com percentual do processo", /0 de 48/.test(ass) && /0% do processo/.test(ass), ass);
    checar("ao fim: Pastas sem 'por carregar'", !/por carregar/.test(txt(capaDoc.querySelector('[data-id="pastas"]'))));
    capa?.destruir();
    sairPonte();
    // Reabrir noutro processo: o tamanho aprendido vale ja na primeira leitura.
    const b = arvoreDoProcesso({ 1: cheia(5), 2: cheia(5), 3: { docs: docs(2), carregada: true } });
    const capaDoc2 = instalarDom('<html><body><div id="divArvoreHtml"></div></body></html>');
    const capa2 = await montarCapa({ ...deps, doc: capaDoc2, ponte: { ...ponte, documento: () => b.doc } });
    const c2 = txt(capaDoc2.querySelector('[data-id="documentos"]'));
    checar(
      "outro processo, mesma origem: usa os 20 aprendidos (2 x 20 + 2 = 42) sem 'padrao'",
      /≈ 42/.test(c2) && !/padrão do SEI/.test(c2) && /2 pastas × 20/.test(c2),
      c2,
    );
    capa2?.destruir();
  }
  {
    // Sem nada aprendido e sem setItem: o padrao 20 vale como estimado; o legado vence o padrao.
    const a = arvoreDoProcesso({ 1: cheia(5), 2: { docs: docs(3), carregada: true } });
    const arv = a.arv();
    const tela = lerDaTela(a.doc, arv);
    const r = resolverTamanho(
      tela.pastas.filter((p) => p.topo).map((p, i, todas) => ({ carregada: p.carregada, nos: p.nos, ultima: i === todas.length - 1 })),
      loja({ optionsPro: JSON.stringify({ sumDocsPasta: 30 }) }),
      HOST,
    );
    const c = cardsDaArvore(arv, { tela, tamanho: r }).find((x) => x.id === "documentos");
    checar("legado 30: '≈ 33' = 1 x 30 + 3", r.origem === "legado" && c?.valor === "≈ 33", [r, c]);
  }
}
