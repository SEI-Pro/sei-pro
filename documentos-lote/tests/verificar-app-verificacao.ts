/**
 * Provas da etapa Verificação (só no destino "processo da coluna"): a tela direta (estado montado à mão, RPC falso
 * com respostas por processo, que podem ser seguradas) e, no fim, o app inteiro (a etapa só entra no destino coluna).
 */

import { ErroRpc } from "@comum/ponte/rpc";
import { ETAPAS, proximaEtapa } from "@dl/app/app";
import { ROTULO_COLUNA_NOME, ROTULO_COLUNA_PROCESSO } from "@dl/app/cruzamento";
import type { EstadoApp } from "@dl/app/estado";
import { ROTULO_STATUS, situacoesIniciais, TelaVerificacao } from "@dl/app/verificacao";
import type { ConfigLote } from "@dl/modelo/lote";
import type { Modelo } from "@dl/sei/modelo";
import { botao, checar, combo, disparar, escolherCombo, igual, instalarDom, secao, tique } from "./util";
import { ate, montar, naPlanilha, utf8 } from "./verificar-app-modelo";

const MODELO: Modelo = {
  origem: "documento",
  numero: "0000123",
  titulo: "Ofício 12",
  tipoId: "6",
  tipoNome: "Ofício",
  campos: ["nome"],
};

const P1 = "12345.000001/2026-01";
const P2 = "12345.000002/2026-02";
const P3 = "12345.000003/2026-03";

/** 5 linhas para 3 processos: P1 (2 linhas), P2 (2 linhas), P3 (1 linha). */
const REGISTROS = [
  { nome: "Ana", proc: P1 },
  { nome: "Bia", proc: P2 },
  { nome: "Caio", proc: P1 },
  { nome: "Davi", proc: P3 },
  { nome: "Eva", proc: P2 },
];

const config = (parcial: Partial<ConfigLote> = {}): ConfigLote => ({
  camposCruzados: { nome: "nome" },
  colunaNome: "nome",
  modeloDescricao: "",
  destino: { tipo: "coluna", coluna: "proc" },
  pausa: 500,
  modelo: MODELO,
  ...parcial,
});

type Resposta = Record<string, unknown> | null | Error;
type Status = "ok" | "nao-encontrado" | "sigiloso" | "nao-aberto" | "tipo-indisponivel" | "erro-rede";

const resposta = (numero: string, status: Status, extra: Record<string, unknown> = {}): Resposta => ({
  numero,
  status,
  ...(status === "nao-encontrado" ? {} : { idProcedimento: `id-${numero.slice(6, 12)}` }),
  ...(status === "ok" ? {} : { mensagem: `mensagem de ${status}` }),
  ...extra,
});

interface OpcoesTela {
  registros?: Record<string, string>[];
  cfg?: ConfigLote;
  /** Status de cada processo (padrão: ok); trocável no meio da prova. */
  status?: Record<string, Status>;
  /** Resposta à mão (ganha do `status`). */
  verificar?: (a: { numero: string; tipoId: string; deNovo?: boolean }) => Resposta | Promise<Resposta>;
  abrir?: (a: unknown) => unknown;
  estado?: EstadoApp;
}

function tela(o: OpcoesTela = {}) {
  const doc = instalarDom('<html><body><div id="app"></div></body></html>');
  const estado: EstadoApp = o.estado ?? {
    modelo: MODELO,
    colunas: ["nome", "proc"],
    registros: o.registros ?? REGISTROS,
    config: o.cfg ?? config(),
  };
  const status: Record<string, Status> = { ...(o.status ?? {}) };
  const chamadas: Array<{ op: string; args: Record<string, unknown> }> = [];
  const t = { mudou: 0 };
  const rpc = {
    chamar: (async (op: string, args?: unknown) => {
      const a = (args ?? {}) as Record<string, unknown>;
      chamadas.push({ op, args: a });
      await tique(1);
      if (op === "verificar") {
        const r = o.verificar
          ? await o.verificar(a as { numero: string; tipoId: string })
          : resposta(String(a.numero), status[String(a.numero)] ?? "ok");
        if (r instanceof Error) throw r;
        return r;
      }
      if (op === "abrirAba") return o.abrir ? o.abrir(a) : { aberto: true };
      return null;
    }) as never,
  };
  const criar = () => new TelaVerificacao({ rpc, estado, aoMudar: () => t.mudou++ }, { esperar: () => tique(0) });
  const tl = criar();
  doc.getElementById("app")!.append(tl.el);
  const raiz = tl.el;
  const verificacoes = () => chamadas.filter((c) => c.op === "verificar");
  const linha = (numero: string) => raiz.querySelector<HTMLTableRowElement>(`tr[data-numero="${numero}"]`);
  const botaoDe = (numero: string, texto: string) =>
    [...(linha(numero)?.querySelectorAll("button") ?? [])].find((b) => (b.textContent ?? "").trim() === texto);
  const resumo = () => raiz.querySelector(".dl-resumo-verificacao")?.textContent ?? "";
  const pronto = () => ate(() => !raiz.querySelector(".dl-carregando:not([hidden])"), 3000);
  return { doc, estado, status, chamadas, t, tl, raiz, rpc, criar, verificacoes, linha, botaoDe, resumo, pronto };
}

export async function verificarAppVerificacao(): Promise<void> {
  secao("verificação: um processo distinto, uma consulta");
  {
    const m = tela({ status: { [P2]: "nao-aberto" } });
    checar("antes de iniciar, não completa", m.tl.completa() === false);
    void m.tl.iniciar?.();
    await tique(1);
    checar("enquanto verifica, não completa", m.tl.completa() === false);
    await m.pronto();
    igual("5 linhas, 3 processos: 3 chamadas", m.verificacoes().length, 3);
    igual(
      "cada processo uma vez, na ordem",
      m.verificacoes().map((c) => c.args.numero),
      [P1, P2, P3],
    );
    igual("tipo do modelo e sem deNovo", m.verificacoes()[0]?.args, { numero: P1, tipoId: "6" });
    checar("resumo", m.resumo().includes("3 linhas prontas, 2 ficam de fora"), m.resumo());
    checar("completa com linha pronta", m.tl.completa() === true);
    igual("rótulo do Continuar", m.tl.rotuloAvancar?.(), "Gravar 3 linhas (2 ficam de fora)");
    igual("estado: linhas prontas", m.estado.prontas, [0, 2, 3]);
    igual("estado: 5 linhas preparadas", m.estado.linhas?.length, 5);
    igual("estado: verificações por número", Object.keys(m.estado.verificacoes ?? {}).sort(), [P1, P2, P3]);
    igual("estado: status guardado", m.estado.verificacoes?.[P2]?.status, "nao-aberto");
    igual("situações do lote: fora para as de fora", situacoesIniciais(m.estado), ["pendente", "fora", "pendente", "pendente", "fora"]);
    checar("avisou o app", m.t.mudou > 0);

    const celulas = (n: string) => [...(m.linha(n)?.querySelectorAll("td") ?? [])].map((td) => (td.textContent ?? "").trim());
    checar("linha do P1: processo, 2 linhas, Ok", celulas(P1)[0] === P1 && celulas(P1)[1] === "2" && celulas(P1)[2] === "Ok", celulas(P1));
    checar("status em texto: Não aberto na unidade", (celulas(P2)[2] ?? "").includes(ROTULO_STATUS["nao-aberto"]), celulas(P2));
    igual("rótulo de não aberto", ROTULO_STATUS["nao-aberto"], "Não aberto na unidade");
    checar("mensagem da aba aparece", (celulas(P2)[2] ?? "").includes("mensagem de nao-aberto"));
    // A mensagem cabe nas duas linhas reservadas (mais longa, corta): o texto inteiro no title.
    igual("mensagem inteira no title", m.linha(P2)?.querySelector("small.dl-dica")?.getAttribute("title"), "mensagem de nao-aberto");
    checar("não aberto: Abrir em nova aba", !!m.botaoDe(P2, "Abrir em nova aba"));
    checar("não aberto: Verificar de novo", !!m.botaoDe(P2, "Verificar de novo"));
    checar("ok: sem botões", !m.linha(P1)?.querySelector("button"));
    // D5: a célula de ações continua célula de tabela; os botões ficam num contêiner por dentro (o flex é dele).
    const tdAcoes = m.linha(P2)?.querySelector("td.dl-acoes-linha");
    checar(
      "ações: botões dentro do contêiner, não filhos diretos da célula",
      !!tdAcoes &&
        tdAcoes.children.length === 1 &&
        tdAcoes.firstElementChild?.classList.contains("dl-acoes-linha-botoes") === true &&
        tdAcoes.firstElementChild.querySelectorAll("button").length === 2,
      tdAcoes?.outerHTML,
    );
    checar("ok: a célula de ações existe vazia (as divisórias seguem as outras)", !!m.linha(P1)?.querySelector("td.dl-acoes-linha"));
    checar("Verificar de novo os com problema no topo", !!botao(m.raiz, "Verificar de novo os com problema"));
    // Layout estável: o número do processo não quebra (célula própria, com o número inteiro no title).
    const tdProc = m.linha(P1)?.querySelector("td.dl-processo");
    checar(
      "número do processo na célula que não quebra",
      tdProc?.textContent === P1 && tdProc.getAttribute("title") === P1,
      tdProc?.outerHTML,
    );

    disparar(m.botaoDe(P2, "Abrir em nova aba")!, "click");
    await ate(() => m.chamadas.some((c) => c.op === "abrirAba"));
    igual("Abrir em nova aba chama abrirAba com o número", m.chamadas.find((c) => c.op === "abrirAba")?.args, { numero: P2 });

    // O usuário recebeu o processo: verificar de novo só ele.
    m.status[P2] = "ok";
    disparar(m.botaoDe(P2, "Verificar de novo")!, "click");
    checar("reverificando, não completa", m.tl.completa() === false);
    checar("reverificando: a linha mostra Verificando", m.linha(P2)?.textContent?.includes("Verificando") === true);
    await ate(() => m.linha(P2)?.textContent?.includes("Ok") === true && m.tl.completa());
    igual("Verificar de novo: uma chamada a mais, só do P2", m.verificacoes().length, 4);
    igual("Verificar de novo manda deNovo", m.verificacoes()[3]?.args, { numero: P2, tipoId: "6", deNovo: true });
    checar("contagem atualizada", m.resumo().includes("5 linhas prontas, nenhuma fica de fora"), m.resumo());
    igual("rótulo sem linhas de fora", m.tl.rotuloAvancar?.(), "Gravar 5 linhas");
    igual("estado: todas prontas", m.estado.prontas, [0, 1, 2, 3, 4]);
    checar("ok de novo: sem botões", !m.linha(P2)?.querySelector("button"));
    m.tl.destruir?.();
  }

  secao("verificação: todos problemáticos");
  {
    const m = tela({ status: { [P1]: "sigiloso", [P2]: "nao-encontrado", [P3]: "tipo-indisponivel" } });
    await m.tl.iniciar?.();
    await m.pronto();
    checar("todos problemáticos: não completa", m.tl.completa() === false);
    checar("estado: sem prontas", m.estado.prontas === undefined);
    igual("rótulo sem linha pronta", m.tl.rotuloAvancar?.(), "Nenhuma linha para gravar");
    checar("resumo: nenhuma pronta", m.resumo().includes("Nenhuma linha pronta, 5 ficam de fora"), m.resumo());
    checar("sigiloso em texto", m.linha(P1)?.textContent?.includes("Sigiloso") === true);
    checar("não encontrado em texto", m.linha(P2)?.textContent?.includes("Não encontrado ou sem acesso") === true);
    checar("tipo indisponível em texto", m.linha(P3)?.textContent?.includes("Tipo indisponível") === true);
    checar("não encontrado (sem id): sem Abrir em nova aba", !m.botaoDe(P2, "Abrir em nova aba"));
    checar("não encontrado: Verificar de novo", !!m.botaoDe(P2, "Verificar de novo"));
    checar("tipo indisponível: Abrir em nova aba", !!m.botaoDe(P3, "Abrir em nova aba"));
    m.tl.destruir?.();
  }

  secao("verificação: Verificar de novo os com problema só refaz os não-ok");
  {
    const m = tela({ status: { [P2]: "nao-aberto", [P3]: "erro-rede" } });
    await m.tl.iniciar?.();
    await m.pronto();
    m.status[P2] = "ok";
    m.status[P3] = "ok";
    disparar(botao(m.raiz, "Verificar de novo os com problema")!, "click");
    await tique(1);
    await m.pronto();
    const novas = m.verificacoes().slice(3);
    igual(
      "só P2 e P3, com deNovo",
      novas.map((c) => c.args),
      [
        { numero: P2, tipoId: "6", deNovo: true },
        { numero: P3, tipoId: "6", deNovo: true },
      ],
    );
    checar("todas prontas", m.resumo().includes("5 linhas prontas"), m.resumo());
    checar("sem problemáticos, botão do topo desabilitado", botao(m.raiz, "Verificar de novo os com problema")?.disabled === true);
    m.tl.destruir?.();
  }

  secao("verificação: erro de RPC vira erro de rede e as demais seguem");
  {
    const m = tela({
      verificar: (a) =>
        a.numero === P1 ? new ErroRpc("PRAZO", "A aba do SEI não respondeu a tempo.") : a.numero === P3 ? null : resposta(a.numero, "ok"),
    });
    await m.tl.iniciar?.();
    await m.pronto();
    igual("as 3 consultas foram feitas", m.verificacoes().length, 3);
    igual("P1: erro-rede", m.estado.verificacoes?.[P1]?.status, "erro-rede");
    checar("P1: mensagem do erro", m.linha(P1)?.textContent?.includes("A aba do SEI não respondeu a tempo.") === true);
    checar("P1: Erro de rede em texto", m.linha(P1)?.textContent?.includes("Erro de rede") === true);
    checar("P1 sem id: só Verificar de novo", !!m.botaoDe(P1, "Verificar de novo") && !m.botaoDe(P1, "Abrir em nova aba"));
    igual("resposta inválida vira erro-rede", m.estado.verificacoes?.[P3]?.status, "erro-rede");
    igual("P2 ok", m.estado.verificacoes?.[P2]?.status, "ok");
    checar("2 prontas (P2)", m.resumo().includes("2 linhas prontas, 3 ficam de fora"), m.resumo());
    m.tl.destruir?.();
  }

  secao("verificação: linkArvore nunca entra no estado");
  {
    const m = tela({ verificar: (a) => resposta(a.numero, "ok", { linkArvore: "https://x/controlador.php?infra_hash=abc" }) });
    await m.tl.iniciar?.();
    await m.pronto();
    checar("sem linkArvore", !JSON.stringify(m.estado.verificacoes).includes("infra_hash"));
    igual("guarda número, status e id", Object.keys(m.estado.verificacoes?.[P1] ?? {}).sort(), ["idProcedimento", "numero", "status"]);
    m.tl.destruir?.();
  }

  secao("verificação: linhas com problema na planilha");
  {
    const registros = [
      { nome: "Ana", proc: P1 },
      { nome: "Bia", proc: "" },
      { nome: "", proc: P1 },
      { nome: "Davi", proc: "não sei" },
    ];
    const m = tela({ registros });
    await m.tl.iniciar?.();
    await m.pronto();
    igual("só o processo válido é consultado", m.verificacoes().length, 1);
    const sec = m.raiz.querySelector(".dl-linhas-problema");
    checar(
      "seção própria aparece",
      !!sec && !(sec as HTMLElement).hidden && sec.textContent?.includes("Linhas com problema na planilha") === true,
    );
    checar("motivo: processo inválido", sec?.textContent?.includes("Processo inválido ou vazio") === true);
    checar("motivo: nome vazio", sec?.textContent?.includes("Nome na árvore vazio") === true);
    igual("três linhas listadas", sec?.querySelectorAll("tbody tr").length, 3);
    checar("número da linha na planilha (cabeçalho é a 1)", sec?.querySelector("tbody tr td")?.textContent === "3");
    checar("contam como fora", m.resumo().includes("1 linha pronta, 3 ficam de fora"), m.resumo());
    igual("rótulo no singular", m.tl.rotuloAvancar?.(), "Gravar 1 linha (3 ficam de fora)");
    igual("P1: 1 linha depende dele (a do nome vazio não conta)", m.linha(P1)?.querySelectorAll("td")[1]?.textContent, "1");
    igual("situações", situacoesIniciais(m.estado), ["pendente", "fora", "fora", "fora"]);
    m.tl.destruir?.();
  }
  {
    const m = tela();
    await m.tl.iniciar?.();
    await m.pronto();
    checar("sem problema na planilha, a seção fica escondida", m.raiz.querySelector<HTMLElement>(".dl-linhas-problema")?.hidden === true);
    m.tl.destruir?.();
  }
  {
    const m = tela({ registros: [{ nome: "", proc: "x" }] });
    await m.tl.iniciar?.();
    await m.pronto();
    igual("só linhas com problema: nenhuma consulta", m.verificacoes().length, 0);
    checar("e não completa", m.tl.completa() === false);
    m.tl.destruir?.();
  }

  secao("verificação: fechar no meio cancela o resto");
  {
    let soltar: (() => void) | undefined;
    const m = tela({
      verificar: (a) =>
        new Promise((r) => {
          soltar = () => r(resposta(a.numero, "ok"));
        }),
    });
    void m.tl.iniciar?.();
    await ate(() => !!soltar);
    m.tl.destruir?.();
    const mudouAntes = m.t.mudou;
    soltar?.();
    await tique(30);
    igual("só a consulta em voo foi feita", m.verificacoes().length, 1);
    checar("a resposta atrasada não entra no estado", m.estado.verificacoes?.[P1] === undefined);
    checar("nem avisa o app", m.t.mudou === mudouAntes);
  }

  secao("verificação: resposta atrasada de uma reverificação antiga não vale");
  {
    const soltos: Array<() => void> = [];
    let n = 0;
    const m = tela({
      registros: [{ nome: "Ana", proc: P1 }],
      verificar: (a) => {
        n += 1;
        if (n === 1) return resposta(a.numero, "nao-aberto");
        const status: Status = n === 2 ? "sigiloso" : "ok";
        return new Promise((r) => soltos.push(() => r(resposta(a.numero, status))));
      },
    });
    await m.tl.iniciar?.();
    await m.pronto();
    disparar(botao(m.raiz, "Verificar de novo os com problema")!, "click");
    await ate(() => soltos.length === 1);
    checar(
      "durante a reverificação o botão da linha some ou fica desabilitado",
      !m.botaoDe(P1, "Verificar de novo") || m.botaoDe(P1, "Verificar de novo")?.disabled === true,
    );
    checar("durante a reverificação o topo fica desabilitado", botao(m.raiz, "Verificar de novo os com problema")?.disabled === true);
    soltos[0]?.();
    await m.pronto();
    igual("resultado da reverificação", m.estado.verificacoes?.[P1]?.status, "sigiloso");
    m.tl.destruir?.();
  }

  secao("verificação: voltar à etapa não consulta de novo; outra config consulta");
  {
    const m = tela({ status: { [P2]: "nao-aberto" } });
    await m.tl.iniciar?.();
    await m.pronto();
    m.tl.destruir?.();
    const de = m.verificacoes().length;
    // O cruzamento refaz o objeto da config a cada mudança, mesmo sem mudar nada que importe.
    m.estado.config = { ...m.estado.config!, pausa: 900 };
    const volta = m.criar();
    m.doc.getElementById("app")!.replaceChildren(volta.el);
    await volta.iniciar?.();
    await tique(10);
    igual("mesma planilha e mesma coluna: nenhuma chamada nova", m.verificacoes().length, de);
    checar("mostra o que já foi verificado", volta.el.textContent?.includes("Não aberto na unidade") === true);
    checar("e completa", volta.completa() === true);
    volta.destruir?.();

    m.estado.config = { ...m.estado.config!, destino: { tipo: "coluna", coluna: "outra" } };
    m.estado.registros = REGISTROS.map((r) => ({ ...r, outra: P3 }));
    const outra = m.criar();
    await outra.iniciar?.();
    await ate(() => outra.completa(), 3000);
    igual("outra coluna: consulta de novo (1 processo)", m.verificacoes().length - de, 1);
    igual("estado refeito", Object.keys(m.estado.verificacoes ?? {}), [P3]);
    outra.destruir?.();
  }

  secao("verificação: Texto Padrão usa o tipo escolhido; abrir que falha avisa");
  {
    const tp: Modelo = { origem: "texto-padrao", id: "9", nome: "Notificação", tipoId: "44", tipoNome: "Notificação", campos: [] };
    const m = tela({
      cfg: config({ modelo: tp }),
      status: { [P1]: "nao-aberto" },
      abrir: () => ({ aberto: false, erro: "Endereço não permitido ou processo não verificado." }),
    });
    await m.tl.iniciar?.();
    await m.pronto();
    igual("tipoId do Texto Padrão", m.verificacoes()[0]?.args.tipoId, "44");
    disparar(m.botaoDe(P1, "Abrir em nova aba")!, "click");
    await ate(() => m.linha(P1)?.textContent?.includes("Endereço não permitido") === true);
    checar("falha do abrir aparece na linha", true);
    m.tl.destruir?.();
  }

  secao("app: etapa Verificação só no destino coluna");
  {
    checar(
      "verificação registrada depois do cruzamento",
      ETAPAS.map((e) => e.id)
        .join(",")
        .startsWith("modelo,planilha,cruzamento,verificacao"),
    );
    const iCruz = ETAPAS.findIndex((e) => e.id === "cruzamento");
    const iVer = ETAPAS.findIndex((e) => e.id === "verificacao");
    igual("proximaEtapa: coluna vai à verificação", proximaEtapa({ config: config() }, iCruz), iVer);
    const depoisTela = proximaEtapa({ config: config({ destino: { tipo: "tela" } }) }, iCruz);
    checar("proximaEtapa: destino tela pula a verificação", depoisTela === null || ETAPAS[depoisTela]?.id !== "verificacao", depoisTela);

    const m = montar();
    const chamar = m.deps.rpc.chamar;
    const verifs: unknown[] = [];
    m.deps.rpc.chamar = (async (op: string, args?: unknown, prazo?: number) => {
      if (op === "verificar") {
        verifs.push(args);
        await tique(1);
        return resposta(String((args as { numero: string }).numero), "ok");
      }
      return chamar(op, args, prazo);
    }) as typeof chamar;
    await naPlanilha(m);
    await m.escolherArquivo("a.csv", utf8(`nome;alvo;outro\nAna;${P1};${P2}\nBia;${P1};${P2}\n`));
    await ate(() => m.avancar()?.disabled === false);
    disparar(m.avancar()!, "click");
    await ate(() => !!combo(m.raiz, ROTULO_COLUNA_NOME));
    const rodape = () => m.raiz.querySelector<HTMLButtonElement>(".dl-rodape-etapa .primario");
    const etapas = () => [...m.raiz.querySelectorAll(".dl-etapas li")].map((li) => li.textContent ?? "");
    escolherCombo(m.raiz, ROTULO_COLUNA_NOME, "nome");
    checar("destino tela: indicador sem Verificação", !etapas().some((e) => e.includes("Verificação")), etapas());
    const r = m.raiz.querySelector<HTMLInputElement>('input[value="coluna"]')!;
    r.checked = true;
    disparar(r, "change");
    escolherCombo(m.raiz, ROTULO_COLUNA_PROCESSO, "alvo");
    checar(
      "destino coluna: indicador com Verificação",
      etapas().some((e) => e.includes("Verificação")),
      etapas(),
    );
    disparar(rodape()!, "click");
    await ate(() => !!m.raiz.querySelector(".dl-verificacao"));
    checar(
      "Verificação é a etapa atual",
      m.raiz.querySelector('.dl-etapas li[aria-current="step"]')?.textContent?.includes("Verificação") === true,
    );
    checar("Verificação: janela larga", m.raiz.classList.contains("dl-largo"));
    await ate(() => rodape()?.disabled === false, 3000);
    igual("2 linhas, 1 processo: 1 consulta", verifs.length, 1);
    igual("rodapé: Gravar 2 linhas", rodape()?.textContent, "Gravar 2 linhas");
    disparar(botao(m.raiz, "Voltar")!, "click");
    await ate(() => !!combo(m.raiz, ROTULO_COLUNA_NOME));
    checar("Voltar leva ao Cruzamento", true);
    checar("Cruzamento: janela na largura normal", !m.raiz.classList.contains("dl-largo"));

    // Mudar só a pausa não invalida a verificação.
    const pausa = m.raiz.querySelector<HTMLInputElement>('input[type="number"]')!;
    pausa.value = "900";
    disparar(pausa, "input");
    disparar(pausa, "change");
    checar("mudar a pausa mantém a verificação", m.app.estado.prontas !== undefined && m.app.estado.verificacoes !== undefined);
    disparar(rodape()!, "click");
    await ate(() => !!m.raiz.querySelector(".dl-verificacao"));
    await ate(() => rodape()?.disabled === false, 3000);
    igual("mudar a pausa: nenhuma consulta nova", verifs.length, 1);
    igual("e as situações valem", situacoesIniciais(m.app.estado), ["pendente", "pendente"]);

    // Voltar e mudar para o destino tela: o resultado da verificação some.
    disparar(botao(m.raiz, "Voltar")!, "click");
    await ate(() => !!combo(m.raiz, ROTULO_COLUNA_NOME));
    const tela = m.raiz.querySelector<HTMLInputElement>('input[value="tela"]')!;
    tela.checked = true;
    disparar(tela, "change");
    checar(
      "destino tela: linhas, verificações, prontas e base limpas",
      !m.app.estado.linhas && !m.app.estado.verificacoes && !m.app.estado.prontas && !m.app.estado.baseVerificacao,
    );
    igual("destino tela: situacoesIniciais vazio", situacoesIniciais(m.app.estado), []);

    // De volta ao destino coluna, com outra coluna do processo: tudo consultado de novo.
    const col = m.raiz.querySelector<HTMLInputElement>('input[value="coluna"]')!;
    col.checked = true;
    disparar(col, "change");
    escolherCombo(m.raiz, ROTULO_COLUNA_PROCESSO, "outro");
    disparar(rodape()!, "click");
    await ate(() => !!m.raiz.querySelector(".dl-verificacao"));
    await ate(() => rodape()?.disabled === false, 3000);
    igual("outra coluna do processo: consultou de novo", verifs.slice(1), [{ numero: P2, tipoId: "6" }]);
    m.app.destruir();
  }

  secao("verificação: o resultado só vale para a config e a planilha verificadas");
  {
    const m = tela({ status: { [P2]: "nao-aberto" } });
    await m.tl.iniciar?.();
    await m.pronto();
    m.tl.destruir?.();
    igual("válido", situacoesIniciais(m.estado).length, 5);
    const cfg = m.estado.config!;
    m.estado.config = { ...cfg, pausa: 9000 };
    igual("só a pausa mudou: continua válido", situacoesIniciais(m.estado).length, 5);
    m.estado.config = { ...cfg, destino: { tipo: "tela" } };
    igual("destino tela (sem limpar): vazio", situacoesIniciais(m.estado), []);
    m.estado.config = { ...cfg, destino: { tipo: "coluna", coluna: "nome" } };
    igual("outra coluna (sem limpar): vazio", situacoesIniciais(m.estado), []);
    m.estado.config = cfg;
    m.estado.registros = [...REGISTROS];
    igual("outra planilha (sem limpar): vazio", situacoesIniciais(m.estado), []);
  }

  secao("verificação: Verificar de novo por linha espera a rodada em curso");
  {
    let soltar: (() => void) | undefined;
    const m = tela({
      verificar: (a) =>
        a.numero === P2
          ? new Promise((r) => {
              soltar = () => r(resposta(a.numero, "ok"));
            })
          : resposta(a.numero, "nao-aberto"),
    });
    void m.tl.iniciar?.();
    await ate(() => !!soltar);
    const b = m.botaoDe(P1, "Verificar de novo");
    checar("durante a rodada o botão da linha existe e está desabilitado", !!b && b.disabled === true);
    disparar(b!, "click");
    await tique(5);
    igual("clicar não dispara consulta concorrente", m.verificacoes().length, 2);
    soltar?.();
    await m.pronto();
    checar("terminada a rodada, o botão habilita", m.botaoDe(P1, "Verificar de novo")?.disabled === false);
    m.tl.destruir?.();
  }
}
