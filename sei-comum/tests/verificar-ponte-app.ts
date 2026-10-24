import { avisoComAcoesNaPagina, emissorDeAvisoPelaPagina } from "../src/painel/aviso";
import { ligarPortaDoPainel, montarPainelEmbutido, tratadoresDoPainel } from "../src/painel/embutido";
import { esperarConexaoDaAba } from "../src/ponte/conexaoDaAba";
import { parDePortas } from "../src/ponte/parDePortas";
import { criarRpc, type PortaRpc, type Rpc } from "../src/ponte/rpc";
import { mostrarAviso } from "../src/ui/aviso";
import { icone } from "../src/ui/dom";
import { botao, checar, disparar, instalarDom, secao, tique } from "./util";

type Ouvinte = (p: PortaRpc & { name: string; sender: unknown }) => void;

/** O `chrome` do app (página da extensão): só o que a conexão com a aba usa. */
function fingirChrome(aba: number): { conectar(p: PortaRpc, tabId: number, frameId?: number): void; restaurar(): void } {
  const g = globalThis as { chrome?: unknown };
  const antes = g.chrome;
  const ouvintes: Ouvinte[] = [];
  g.chrome = {
    tabs: { getCurrent: async () => ({ id: aba }) },
    runtime: { onConnect: { addListener: (cb: Ouvinte) => void ouvintes.push(cb) } },
  };
  return {
    conectar(p, tabId, frameId = 0) {
      for (const o of ouvintes) o({ ...p, name: "seipro-teste", sender: { tab: { id: tabId }, frameId } });
    },
    restaurar() {
      g.chrome = antes;
    },
  };
}

export async function verificarPonteApp(): Promise<void> {
  secao("ponte do app: a aba tambem chama o app");
  instalarDom();
  const cr = fingirChrome(7);
  const conexao = esperarConexaoDaAba("seipro-teste", { alerta: (a) => `recebi ${(a as { tipo?: string }).tipo}` });
  const [outraApp, outraAba] = parDePortas();
  let outraCaiu = false;
  outraAba.onDisconnect.addListener(() => {
    outraCaiu = true;
  });
  cr.conectar(outraApp, 9);
  const [app, aba] = parDePortas();
  cr.conectar(app, 7);
  const rpcApp = await conexao;
  await tique();
  checar("porta de outra aba e recusada", outraCaiu);
  const rpcAba = criarRpc(aba);
  checar("a aba chama um tratador do app", (await rpcAba.chamar<string>("alerta", { tipo: "atrasadas" })) === "recebi atrasadas");
  checar("o app continua chamando a aba", rpcApp.aberta);
  cr.restaurar();

  secao("ponte do app no Firefox: o app abre a porta com o rele do background");
  {
    const g = globalThis as { chrome?: unknown };
    const antes = g.chrome;
    const nomes: string[] = [];
    let ladoAba: PortaRpc | null = null;
    g.chrome = {
      runtime: {
        getURL: (c: string) => `moz-extension://abc/${c}`,
        connect: ({ name }: { name: string }) => {
          nomes.push(name);
          const [app, aba] = parDePortas();
          ladoAba = aba;
          return app;
        },
        onConnect: { addListener: () => undefined },
      },
    };
    const conexaoFx = esperarConexaoDaAba("seipro-teste", { eco: (x) => x });
    const rpcFx = await conexaoFx;
    checar("no Firefox o app conecta ao rele pelo nome do canal", nomes.join() === "seipro-teste");
    const rpcAbaFx = criarRpc(ladoAba!);
    checar("a aba chama o app pela porta do rele", (await rpcAbaFx.chamar<string>("eco", "ola")) === "ola" && rpcFx.aberta);
    g.chrome = antes;
  }

  secao("ponte do app: porta do painel exposta para a aba");
  const doc = instalarDom('<html><body><form id="frmProcedimentoControlar"></form></body></html>');
  const mp = montarPainelEmbutido(doc, {
    id: "projetosPro",
    titulo: "Projetos",
    icone: () => icone("calendario", 20),
    urlApp: "chrome-extension://abc/html/projetos.html",
    tituloIframe: "Projetos do SEI Pro",
    prefixo: "spro-prj",
    rotulos: { mostrar: "Mostrar projetos", recolher: "Recolher projetos" },
    recolhido: false,
    ordem: null,
    aoRecolher: () => undefined,
  })!;
  let ladoApp: Rpc | null = null;
  const porta = ligarPortaDoPainel(
    mp,
    () => {
      const [a, b] = parDePortas();
      ladoApp = criarRpc(a, { focar: (x) => `foco em ${(x as { id?: string }).id}` });
      return b;
    },
    tratadoresDoPainel({ iframe: mp.iframe }),
  );
  checar("antes da carga, sem porta", porta.rpc() === null);
  disparar(mp.iframe, "load");
  checar("depois da carga, a aba chama o app", (await porta.rpc()?.chamar<string>("focar", { id: "p1" })) === "foco em p1");
  checar("o app tambem chama a aba", (ladoApp as Rpc | null)?.aberta === true);
  porta.fechar();
  checar("icone gantt (titulo do painel, abas e dialogos do Projetos)", icone("gantt", 20).querySelectorAll("path").length === 2);

  checar(
    "icone demandas (titulo do painel, aba lateral e atalhos do Gestor de Demandas): pessoa (cabeca e ombros) com o selo de check",
    icone("demandas", 20).querySelectorAll("circle").length === 2 && icone("demandas", 20).querySelectorAll("path").length === 2,
  );

  secao("aviso com duas acoes (concluir: Informar documento e Desfazer)");
  const docA = instalarDom();
  const feitos: string[] = [];
  const el = mostrarAviso(
    docA,
    "“Relatório” concluída hoje (06/10).",
    [
      { rotulo: "Informar documento", fazer: () => feitos.push("doc") },
      { rotulo: "Desfazer", fazer: () => feitos.push("desfazer") },
    ],
    50,
  );
  checar("dois botoes no aviso do app", el.querySelectorAll("button").length === 2);
  botao(el, "Desfazer")!.click();
  checar("o segundo botao faz a segunda acao e o aviso sai", feitos.join() === "desfazer" && !el.isConnected);
  const docP = instalarDom();
  const avisar = avisoComAcoesNaPagina(docP, false, "spro-prj");
  const r1 = avisar("Concluída.", ["Informar documento", "Desfazer"], 5000);
  botao(docP.body, "Informar documento")!.click();
  checar("na pagina, devolve o indice da acao clicada", (await r1) === 0 && !docP.querySelector(".spro-prj-aviso"));
  checar("sem clique, devolve -1", (await avisar("Concluída.", ["A", "B"], 10)) === -1);
  const trat = tratadoresDoPainel({ iframe: null, avisarAcoes: async (_t, acoes) => acoes.length - 1 });
  checar("a aba atende o aviso com acoes", (await trat.aviso?.({ texto: "x", acao: "A", acoes: ["A", "B"], ms: 100 })) === 1);
  const pedidos: unknown[] = [];
  const emitir = emissorDeAvisoPelaPagina(
    {
      chamar: async <T>(op: string, args?: unknown) => {
        pedidos.push([op, args]);
        return 1 as T;
      },
    },
    docP,
  );
  emitir(
    "Concluída.",
    [
      { rotulo: "Informar documento", fazer: () => feitos.push("doc2") },
      { rotulo: "Desfazer", fazer: () => feitos.push("desfazer2") },
    ],
    7000,
  );
  await tique();
  const args = (pedidos[0] as [string, { acoes?: string[]; acao?: string }])[1];
  checar(
    "o app manda os rotulos e faz a acao do indice que voltou",
    args.acoes?.join() === "Informar documento,Desfazer" && args.acao === "Informar documento" && feitos.at(-1) === "desfazer2",
  );
}
