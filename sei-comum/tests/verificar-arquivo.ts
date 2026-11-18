import { areaMemoria } from "../src/armazenamento/area";
import {
  type ArquivoSync,
  ControleArquivo,
  escolherArquivoSync,
  type HandleArquivo,
  handlesNoIndexedDB,
  permissao,
  SincroniaArquivo,
  temSeletorDeArquivo,
} from "../src/sincronia/arquivo";
import { escolherPelaJanelaDaExtensao, escolhaNoIndexedDB, MSG_ESCOLHA_FEITA, seletorBarradoNoIframe, type DepsEscolhaPorJanela } from "../src/sincronia/escolhaPorJanela";
import { adaptadorArquivoTeste, repoTeste } from "./adaptadorTeste";
import { idbFalso } from "./idbFalso";
import { checar, lanca, secao, tique } from "./util";

const dono = { host: "sei.exemplo.gov.br", login: "pedro" };
const CHAVE = "teste/sync/arquivo/sei.exemplo.gov.br|pedro";

function arquivoEmMemoria(inicial = "") {
  const a = { conteudo: inicial, escritas: 0 };
  const arquivo: ArquivoSync = {
    ler: async () => a.conteudo,
    gravar: async (s) => {
      a.escritas++;
      a.conteudo = s;
    },
  };
  return { a, arquivo };
}

export async function verificarArquivo(): Promise<void> {
  secao("arquivo sincronizado (pasta da nuvem)");
  const area = areaMemoria();
  const repoA = repoTeste();
  repoA.por("a1", "um", 1);
  const { a, arquivo } = arquivoEmMemoria();
  const sA = new SincroniaArquivo({ area, chaveStatus: CHAVE, arquivo, adaptador: adaptadorArquivoTeste(repoA, "pedro") });
  const r1 = await sA.sincronizar();
  checar("arquivo vazio: grava tudo do dono", r1.estado === "ok" && a.escritas === 1 && a.conteudo.includes('"a1"'));
  checar("status na chave do modulo", ((await area.obter(CHAVE))[CHAVE] as { estado?: string } | undefined)?.estado === "ok");
  const repoB = repoTeste();
  repoB.por("b1", "dois", 2, "B");
  const sB = new SincroniaArquivo({ area: areaMemoria(), chaveStatus: CHAVE, arquivo, adaptador: adaptadorArquivoTeste(repoB, "pedro") });
  await sB.sincronizar();
  checar("outro computador le e mescla", repoB.itens.has("a1"));
  checar("e grava o que so ele tinha", a.escritas === 2 && a.conteudo.includes('"b1"'));
  await sB.sincronizar();
  checar("sem mudanca: nao regrava", a.escritas === 2);
  a.conteudo = `${String.fromCharCode(0xfeff)}${a.conteudo}`;
  await sB.sincronizar();
  checar("arquivo com BOM (Bloco de Notas) e lido como sempre", a.escritas === 2);
  a.conteudo = "{ isto nao e json";
  const r3 = await sB.sincronizar();
  checar(
    "arquivo estragado: nao apaga nada e regrava",
    r3.estado === "ok" && a.escritas === 3 && repoB.itens.has("b1") && /regrav/.test(r3.mensagem ?? ""),
    r3,
  );

  secao("arquivo: compartilhado e de versao mais nova");
  const compartilhado = arquivoEmMemoria(
    JSON.stringify({
      formato: "teste",
      versao: 1,
      donos: [{ dono: "maria", itens: [{ id: "m1", valor: "x", atualizadoEm: 1, dispositivo: "Z" }] }],
    }),
  );
  const rC = await new SincroniaArquivo({
    area: areaMemoria(),
    chaveStatus: CHAVE,
    arquivo: compartilhado.arquivo,
    adaptador: adaptadorArquivoTeste(repoA, "pedro"),
  }).sincronizar();
  checar(
    "mantem os dados do outro usuario e grava os meus",
    compartilhado.a.conteudo.includes('"m1"') && compartilhado.a.conteudo.includes('"a1"'),
  );
  checar("e avisa que o arquivo tem dados de outro", /outro usu/.test(rC.mensagem ?? ""), rC);
  checar("e nao importa os dados do outro", !repoA.itens.has("m1"));
  const novo = arquivoEmMemoria(JSON.stringify({ formato: "teste", versao: 2, donos: [] }));
  const rN = await new SincroniaArquivo({
    area: areaMemoria(),
    chaveStatus: CHAVE,
    arquivo: novo.arquivo,
    adaptador: adaptadorArquivoTeste(repoA, "pedro"),
  }).sincronizar();
  checar("versao mais nova: nao sobrescreve", novo.a.escritas === 0 && rN.estado === "erro" && /mais nova/.test(rN.mensagem ?? ""), rN);
  const negado: ArquivoSync = {
    ler: async () => "",
    gravar: async () => {
      throw Object.assign(new Error("negado"), { name: "NotAllowedError" });
    },
  };
  const rP = await new SincroniaArquivo({
    area: areaMemoria(),
    chaveStatus: CHAVE,
    arquivo: negado,
    adaptador: adaptadorArquivoTeste(repoA, "pedro"),
  }).sincronizar();
  checar("permissao negada no meio: pede reconectar", rP.estado === "permissao");

  secao("arquivo: controle no app");
  const areaC = areaMemoria();
  const repoC = repoTeste();
  repoC.por("c1", "um", 1);
  let conteudo = "";
  let perm: PermissionState = "granted";
  const handle = {
    name: "projetos-seipro.json",
    getFile: async () => ({ text: async () => conteudo }),
    createWritable: async () => ({
      write: async (s: string) => {
        conteudo = s;
      },
      close: async () => undefined,
    }),
    queryPermission: async () => perm,
    requestPermission: async () => {
      perm = "granted";
      return perm;
    },
  } as unknown as HandleArquivo;
  const guardados = new Map<string, HandleArquivo>();
  const c = new ControleArquivo({
    area: areaC,
    dono,
    chaveStatus: CHAVE,
    handles: {
      ler: async () => guardados.get("h"),
      guardar: async (_d, h) => guardados.set("h", h),
      esquecer: async () => guardados.delete("h"),
    },
    escolher: async () => handle,
    adaptador: adaptadorArquivoTeste(repoC, "pedro"),
    atraso: 10,
  });
  checar("sem arquivo escolhido: nada a fazer", (await c.sincronizar()) === null && !(await c.configurado()));
  await c.escolher();
  checar(
    "escolher grava no arquivo",
    conteudo.includes('"c1"') && (await c.status())?.estado === "ok" && (await c.status())?.nome === "projetos-seipro.json",
  );
  perm = "prompt";
  const s = await c.sincronizar();
  checar("permissao expirada: pede reconectar (sem gesto nao pergunta)", s?.estado === "permissao", s);
  await c.reconectar();
  checar("reconectar pede a permissao e sincroniza", (perm as PermissionState) === "granted" && (await c.status())?.estado === "ok");
  repoC.por("c2", "dois", 2);
  c.agendar();
  c.agendar();
  await tique(60);
  checar("mudanca local vai para o arquivo depois do intervalo", conteudo.includes('"c2"'));
  await c.esquecer();
  checar("parar de usar o arquivo", !(await c.configurado()) && (await c.status()) === null);

  secao("arquivo: handle no banco do modulo e seletor");
  const idb = idbFalso();
  const handles = handlesNoIndexedDB("seipro-projetos", idb.fabrica);
  await handles.guardar(dono, { name: "x.json" } as unknown as HandleArquivo);
  checar(
    "guarda pelo dono (login sem caixa) no banco do modulo",
    (await handles.ler({ host: dono.host, login: "PEDRO" }))?.name === "x.json" &&
      idb.bancos.get("seipro-projetos")?.depositos.has("arquivos") === true,
  );
  await handles.esquecer(dono);
  checar("esquecer", (await handles.ler(dono)) === undefined);
  checar("tem seletor so com showSaveFilePicker", temSeletorDeArquivo({ showSaveFilePicker() {} }) && !temSeletorDeArquivo({}));
  checar("handle sem queryPermission: concedido", (await permissao({} as HandleArquivo, false)) === "granted");
  let opcoes: { suggestedName?: string; types?: Array<{ description?: string }> } = {};
  const janela = {
    showSaveFilePicker: async (o: typeof opcoes) => {
      opcoes = o;
      return handle;
    },
    showOpenFilePicker: async () => [] as HandleArquivo[],
  };
  checar(
    "novo: Salvar como com o nome e a descricao do modulo",
    (await escolherArquivoSync("novo", "projetos-seipro.json", "Projetos do SEI Pro", janela)) === handle &&
      opcoes.suggestedName === "projetos-seipro.json" &&
      opcoes.types?.[0]?.description === "Projetos do SEI Pro",
  );
  checar("existente sem escolha: null", (await escolherArquivoSync("existente", "x", "y", janela)) === null);
  const cancelado = {
    showSaveFilePicker: async () => {
      throw Object.assign(new Error("cancelou"), { name: "AbortError" });
    },
  };
  checar("cancelar nao e erro", (await escolherArquivoSync("novo", "x", "y", cancelado)) === null);
  const quebrado = {
    showSaveFilePicker: async () => {
      throw Object.assign(new Error("sem permissao de seletor"), { name: "SecurityError" });
    },
  };
  checar("outro erro sobe", (await lanca(() => escolherArquivoSync("novo", "x", "y", quebrado)))?.message === "sem permissao de seletor");

  // Issue #186: em iframe de outra origem o Chrome barra o seletor; a escolha vai para a janela da extensao.
  const barrado = Object.assign(new Error("Failed to execute 'showOpenFilePicker' on 'Window': Third party iframes are not allowed to show a file picker."), {
    name: "NotAllowedError",
  });
  checar("reconhece o erro do iframe", seletorBarradoNoIframe(barrado) && !seletorBarradoNoIframe(new Error("x")));
  const emIframe = {
    showSaveFilePicker: async () => {
      throw barrado;
    },
  };
  const chamadas: string[] = [];
  const viaJanela = (async (modo: string, nome: string, desc: string) => {
    chamadas.push(`${modo}|${nome}|${desc}`);
    return handle;
  }) as unknown as typeof escolherPelaJanelaDaExtensao;
  checar("iframe barrado: usa a janela da extensao", (await escolherArquivoSync("novo", "a.json", "Demandas", emIframe, viaJanela)) === handle && chamadas[0] === "novo|a.json|Demandas");
  checar(
    "janela desligada: o erro sobe",
    (await lanca(() => escolherArquivoSync("novo", "a.json", "Demandas", emIframe, null))) !== undefined,
  );

  const armazem = escolhaNoIndexedDB(idbFalso().fabrica);
  let ouvinte: ((m: unknown) => void) | undefined;
  const pedidos: Array<{ id: string; modo: string; nome: string; descricao: string }> = [];
  const mk = (aoPedir: (id: string) => Promise<void> | void, prazoMs = 5000): DepsEscolhaPorJanela => ({
    pedirJanela: async (p) => {
      pedidos.push(p);
      await aoPedir(p.id);
    },
    ouvir: (cb) => {
      ouvinte = cb;
      return () => {
        ouvinte = undefined;
      };
    },
    armazem,
    novoId: () => "pedido-1",
    prazoMs,
  });
  const escolhido = await escolherPelaJanelaDaExtensao(
    "existente",
    "b.json",
    "Projetos",
    mk(async (id) => {
      await armazem.guardar(id, { name: "escolhido.json" } as unknown as HandleArquivo);
      ouvinte?.({ tipo: MSG_ESCOLHA_FEITA, id, ok: true });
    }),
  );
  checar("janela: devolve o handle gravado", escolhido?.name === "escolhido.json" && pedidos[0]?.modo === "existente" && pedidos[0]?.descricao === "Projetos");
  checar("janela: o handle de passagem e apagado", (await armazem.ler("pedido-1")) === undefined && ouvinte === undefined);
  const fechada = await escolherPelaJanelaDaExtensao("novo", "c.json", "X", mk((id) => void ouvinte?.({ tipo: MSG_ESCOLHA_FEITA, id, ok: false })));
  checar("janela fechada sem escolher: null", fechada === null);
  const outro = await escolherPelaJanelaDaExtensao("novo", "d.json", "X", mk((id) => void ouvinte?.({ tipo: MSG_ESCOLHA_FEITA, id: "outro", ok: true }), 30));
  checar("resposta de outro pedido e ignorada (vence o prazo)", outro === null);
}
