/**
 * Provas do ciclo de vida do lote (Tarefa 14b): resultado (tabela, CSV, copiar), repetir as que falharam (nunca as
 * incertas sem confirmação explícita), gravar as que ficaram de fora (reverificação), links permanentes, retomada
 * ao abrir (sem duplicar o que já foi criado), a guarda do Iniciar contra outro lote em andamento, o apagar do lote
 * e a pastilha restaurada pela aba. App inteiro com linkedom, RPC falso por roteiro e repositório em memória.
 */

import { type Area, areaMemoria } from "@comum/armazenamento/area";
import { OP_RESTAURADO } from "@comum/ui/modalIframe";
import { resultadoComoCsv, resultadoComoTexto } from "@comum/ui/tabelaResultado";
import { fecharJanela, tratadoresDoApp } from "@dl/app/app";
import { ROTULO_COLUNA_NOME } from "@dl/app/cruzamento";
import { ExecucaoDocumentos, MENSAGEM_EM_VOO, resumoDoLote, TelaExecucao } from "@dl/app/execucao";
import { montarLote } from "@dl/app/lote";
import { COLUNAS_GERADAS, colunasDoResultado, contagemDoLote, linhasDoResultado, numerosParaLink, ROTULO_INCERTO } from "@dl/app/resultado";
import { CHAVE_ENTRADA_LINK, JANELA_OUTRA_ABA_MS } from "@dl/modelo/constantes";
import { prepararLinhas } from "@dl/modelo/destinos";
import type { ConfigLote } from "@dl/modelo/lote";
import type { Modelo } from "@dl/sei/modelo";
import { CHAVE_ENTRADA } from "../../link-permanente/src/modelo/constantes";
import { type ItemLote, type LoteDocumentos, RepositorioLote } from "../src/repositorio";
import { botao, checar, disparar, escolherCombo, igual, secao, tique } from "./util";
import { ate, montar, naPlanilha, utf8 } from "./verificar-app-modelo";

const CHAVE = "docslote/lote";
const HOST = "sei.x.gov.br";
const PROTOCOLO = "00001.000001/2026-11";
const P1 = "12345.000001/2026-01";
const P2 = "12345.000002/2026-02";
const P3 = "12345.000003/2026-03";

const MODELO: Modelo = {
  origem: "documento",
  numero: "0000123",
  titulo: "Ofício 12",
  tipoId: "6",
  tipoNome: "Ofício",
  campos: ["nome", "cargo"],
};

const config = (parcial: Partial<ConfigLote> = {}): ConfigLote => ({
  camposCruzados: { nome: "nome", cargo: "cargo" },
  colunaNome: "nome",
  modeloDescricao: "Ofício para ##nome##",
  destino: { tipo: "tela" },
  pausa: 500,
  modelo: MODELO,
  ...parcial,
});

const registros = (n: number) => Array.from({ length: n }, (_, k) => ({ nome: `Pessoa ${k + 1}`, cargo: `Cargo ${k + 1}` }));

const criada = (n: number): ItemLote => ({
  situacao: "criada",
  criado: {
    numero: `000${n}`,
    idDocumento: `90${n}`,
    link: `https://${HOST}/sei/controlador.php?acao=procedimento_trabalhar&id_documento=90${n}`,
  },
});

function lote(cfg: ConfigLote, regs: Record<string, string>[], itens: ItemLote[], parcial: Partial<LoteDocumentos> = {}): LoteDocumentos {
  return {
    id: "lote-1",
    host: HOST,
    login: "ana",
    iniciadoEm: 1000,
    atualizadoEm: 1000,
    config: cfg,
    linhas: prepararLinhas(regs, cfg),
    itens,
    verificacoes: {},
    protocoloTela: PROTOCOLO,
    ...parcial,
  };
}

const okCriar = (n: number) => ({
  situacao: "ok",
  criado: {
    numero: `000${n}`,
    idDocumento: `90${n}`,
    link: `https://${HOST}/sei/controlador.php?acao=procedimento_trabalhar&id_documento=90${n}`,
  },
});

type Roteiro = (op: string, args: Record<string, unknown>, n: number) => unknown;

interface OpcoesAbrir {
  roteiro?: Roteiro;
  area?: Area;
  /** Relógio do repositório (atualizadoEm das escritas). */
  relogioRepo?: number;
  /** Relógio do app (decide o "pode estar rodando em outra aba"); padrão: bem depois da janela. */
  agoraApp?: number;
  /** Não chama `iniciar` (a prova faz antes outra coisa). */
  semIniciar?: boolean;
}

/** O app com um lote já guardado (ou nenhum), aberto como o usuário abriria. */
async function abrirCom(guardado: LoteDocumentos | null, o: OpcoesAbrir = {}) {
  const m = montar();
  const area = o.area ?? areaMemoria();
  const relogio = { repo: o.relogioRepo ?? 100_000, app: o.agoraApp };
  m.deps.repo = new RepositorioLote(area, () => relogio.repo);
  if (guardado) await m.deps.repo.gravar(guardado);
  m.deps.agora = () => relogio.app ?? relogio.repo + JANELA_OUTRA_ABA_MS + 1000;
  m.deps.esperar = () => tique(0);
  const original = m.deps.rpc.chamar;
  const chamadas: Array<{ op: string; args: Record<string, unknown> }> = [];
  const conta: Record<string, number> = {};
  const roteiro: Roteiro =
    o.roteiro ??
    ((op, a, n) =>
      op === "criar"
        ? okCriar(n)
        : op === "verificar"
          ? { numero: a.numero, status: "ok", idProcedimento: "1" }
          : op === "abrirLinkPermanente"
            ? true
            : undefined);
  m.deps.rpc.chamar = (async (op: string, args?: unknown, prazo?: number) => {
    const a = (args ?? {}) as Record<string, unknown>;
    chamadas.push({ op, args: a });
    conta[op] = (conta[op] ?? 0) + 1;
    await tique(1);
    const r = await roteiro(op, a, conta[op] as number);
    if (r instanceof Error) throw r;
    if (r === undefined) return original(op, args, prazo);
    return r;
  }) as typeof original;
  if (!o.semIniciar) {
    await m.app.iniciar();
    await tique(5);
  }
  const daOp = (op: string) => chamadas.filter((c) => c.op === op);
  const nomesCriados = () => daOp("criar").map((c) => (c.args.linha as Record<string, string>).nome);
  const lido = async () => (await area.obter(CHAVE))[CHAVE] as LoteDocumentos | undefined;
  const clicar = (texto: string) => {
    const b = botao(m.raiz, texto) ?? botao(m.doc, texto);
    if (!b) throw new Error(`botão "${texto}" não encontrado`);
    disparar(b, "click");
  };
  const texto = (sel: string) => m.raiz.querySelector(sel)?.textContent ?? "";
  return { ...m, area, relogio, chamadas, daOp, nomesCriados, lido, clicar, texto };
}

const naTela = (m: { raiz: HTMLElement }, sel: string) => !!m.raiz.querySelector(sel);

export async function verificarAppResultado(): Promise<void> {
  secao("resultado: linhas da planilha + o gerado, situação em texto");
  {
    const regs = [
      { nome: "Ana", cargo: "=cmd()" },
      { nome: "Bia", cargo: "X" },
      { nome: "Caio", cargo: "Y" },
      { nome: "", cargo: "Z" },
      { nome: "Duda", cargo: "W" },
    ];
    const l = lote(config(), regs, [
      criada(1),
      { situacao: "erro", erro: "Processo não está aberto na unidade" },
      { situacao: "erro", erro: MENSAGEM_EM_VOO, incerto: true, numero: "0009", idDocumento: "909" },
      { situacao: "fora", erro: "Nome na árvore vazio" },
      { situacao: "pendente" },
    ]);
    const linhas = linhasDoResultado(l);
    igual(
      "situação em texto",
      linhas.map((x) => x.rotulo),
      ["Criada", "Erro", ROTULO_INCERTO, "Fora", "Pendente"],
    );
    igual("rótulo do incerto", ROTULO_INCERTO, "Incerto (confira no SEI)");
    const titulos = colunasDoResultado(l).map((c) => c.titulo);
    igual("colunas: planilha + as quatro geradas + observação", titulos, ["nome", "cargo", ...COLUNAS_GERADAS, "observacao"]);
    igual("nomes das colunas geradas", COLUNAS_GERADAS, [
      "processo_destino",
      "nome_documento_gerado",
      "numero_sei_gerado",
      "link_documento_gerado",
    ]);
    const c = (k: number, titulo: string) => {
      const col = colunasDoResultado(l).find((x) => x.titulo === titulo);
      return col ? (linhas[k]?.campos[col.chave] ?? "") : "?";
    };
    igual(
      "processo de destino (tela) na criada, na com erro e na incerta",
      [0, 1, 2].map((k) => c(k, "processo_destino")),
      [PROTOCOLO, PROTOCOLO, PROTOCOLO],
    );
    // A ajuda: processo_destino é "o processo em que o documento foi criado". Fora e pendente não criaram nada.
    igual(
      "processo de destino vazio na de fora e na pendente",
      [3, 4].map((k) => c(k, "processo_destino")),
      ["", ""],
    );
    igual("nome do documento gerado (tipo + nome na árvore, como o legado)", c(0, "nome_documento_gerado"), "Ofício Ana");
    igual("número SEI gerado", c(0, "numero_sei_gerado"), "0001");
    checar("link da criada", c(0, "link_documento_gerado").includes("id_documento=901") && !!linhas[0]?.link);
    igual("sem documento: nome vazio", c(1, "nome_documento_gerado"), "");
    igual("erro com a mensagem", c(1, "observacao"), "Processo não está aberto na unidade");
    checar(
      "incerto: o que se sabe e a dica",
      c(2, "numero_sei_gerado") === "0009" && c(2, "observacao").includes("confira"),
      c(2, "observacao"),
    );
    igual("fora com o motivo", c(3, "observacao"), "Nome na árvore vazio");
    igual("contagem", contagemDoLote(l), { total: 5, criadas: 1, erros: 1, incertas: 1, fora: 1, pendentes: 1 });
    igual("links permanentes: só as criadas", numerosParaLink(l), ["0001"]);
    const csv = resultadoComoCsv(linhas, colunasDoResultado(l));
    const [cab, primeira] = csv.replace(/^﻿/, "").split("\r\n");
    igual(
      "CSV: cabeçalho",
      cab,
      "Situação;nome;cargo;processo_destino;nome_documento_gerado;numero_sei_gerado;link_documento_gerado;observacao",
    );
    checar("CSV: =cmd() neutralizado", (primeira ?? "").includes(";'=cmd();") && !(primeira ?? "").includes(";=cmd()"), primeira);
  }

  secao("resultado: processo de destino nos destinos coluna e novo processo");
  {
    const cc = config({ destino: { tipo: "coluna", coluna: "proc" } });
    const l = lote(cc, [{ nome: "Ana", cargo: "", proc: P1 }], [criada(1)]);
    const col = colunasDoResultado(l).find((x) => x.titulo === "processo_destino")?.chave ?? "";
    igual("coluna: o número da linha", linhasDoResultado(l)[0]?.campos[col], P1);
    const lf = lote(
      cc,
      [
        { nome: "Ana", cargo: "", proc: P1 },
        { nome: "Bia", cargo: "", proc: P2 },
        { nome: "Caio", cargo: "", proc: P3 },
        { nome: "Duda", cargo: "", proc: P3 },
      ],
      [criada(1), { situacao: "fora", erro: "Não aberto na unidade" }, { situacao: "pendente" }, { situacao: "erro", erro: "Falha" }],
    );
    const linhasF = linhasDoResultado(lf);
    igual(
      "coluna: de fora e pendente sem processo_destino; criada e erro com",
      linhasF.map((x) => x.campos[col]),
      [P1, "", "", P3],
    );
    const csvF = resultadoComoCsv(linhasF, colunasDoResultado(lf));
    const linhaFora = csvF.split("\r\n")[2] ?? "";
    checar("CSV: a de fora não leva o processo em processo_destino", linhaFora.startsWith(`Fora;Bia;;${P2};;`), linhaFora);
    const tsvF = resultadoComoTexto(linhasF, colunasDoResultado(lf)).split("\n")[2] ?? "";
    igual("cópia: a de fora sem processo_destino (a coluna da planilha fica)", tsvF.split("\t").slice(0, 5), ["Fora", "Bia", "", P2, ""]);
    const cn = config({ destino: { tipo: "novo-processo", idTipoProcesso: "100", especificacao: "x" } });
    const n = lote(cn, registros(3), [
      { ...criada(1), processo: "PN1" },
      { situacao: "erro", erro: "Falha", processo: "PN2" },
      { situacao: "pendente", processo: "PN3" },
    ]);
    const coln = colunasDoResultado(n).find((x) => x.titulo === "processo_destino")?.chave ?? "";
    igual(
      "novo processo: o criado pela linha (mesmo com o documento falho); pendente vazia",
      linhasDoResultado(n).map((x) => x.campos[coln]),
      ["PN1", "PN2", ""],
    );
  }

  secao("execução: linha de novo processo que já tem o processo pula o criarProcesso");
  {
    const cn = config({ destino: { tipo: "novo-processo", idTipoProcesso: "100", especificacao: "x" } });
    const l = lote(cn, registros(1), [{ situacao: "pendente", processo: "PN5", linkProcesso: `https://${HOST}/sei/p5` }]);
    const area = areaMemoria();
    const repo = new RepositorioLote(area, () => 5000);
    await repo.gravar(l);
    const ops: Array<{ op: string; args: Record<string, unknown> }> = [];
    let primeiroGravado: ItemLote | undefined;
    const rpc = {
      chamar: (async (op: string, args?: unknown) => {
        ops.push({ op, args: (args ?? {}) as Record<string, unknown> });
        primeiroGravado ??= ((await area.obter(CHAVE))[CHAVE] as LoteDocumentos).itens[0];
        await tique(1);
        return op === "criar" ? okCriar(1) : { situacao: "ok", criado: { numero: "OUTRO" } };
      }) as never,
    };
    const ex = new ExecucaoDocumentos(l, { rpc, repo, aoMudar: () => {}, esperar: () => tique(0) });
    await ex.rodar();
    igual(
      "só criar",
      ops.map((o) => o.op),
      ["criar"],
    );
    igual("alvo: o processo da linha", ops[0]?.args.alvo, { tipo: "novo-processo", numero: "PN5" });
    checar("em voo já lembra do processo", primeiroGravado?.processo === "PN5" && primeiroGravado.incerto === true, primeiroGravado);
    const g = ((await area.obter(CHAVE))[CHAVE] as LoteDocumentos).itens[0];
    igual("criada com o processo", [g?.situacao, g?.processo], ["criada", "PN5"]);
  }

  secao("app: lote concluído abre direto no resultado; Baixar CSV e Copiar");
  {
    const regs = [
      { nome: "Ana", cargo: "=cmd()" },
      { nome: "Bia", cargo: "X" },
    ];
    const m = await abrirCom(lote(config(), regs, [criada(1), { situacao: "erro", erro: "Falha X" }]));
    checar("resultado na tela", naTela(m, ".dl-resultado"));
    checar("sem etapas nem rodapé", !m.visivel(m.raiz.querySelector(".dl-etapas")) && !m.visivel(m.raiz.querySelector(".dl-rodape-etapa")));
    igual("nenhuma chamada à aba para abrir o resultado", m.chamadas.length, 0);
    checar(
      "resumo",
      m.texto(".dl-resultado-resumo").includes("1 criada") && m.texto(".dl-resultado-resumo").includes("1 com erro"),
      m.texto(".dl-resultado-resumo"),
    );
    const tds = [...m.raiz.querySelectorAll(".dl-resultado tbody tr td:first-child")].map((td) => td.textContent);
    igual("situação em texto na tabela", tds, ["Criada", "Erro"]);
    checar("link clicável na tabela", !!m.raiz.querySelector('.dl-resultado a[href*="id_documento=901"]'));
    // Tabela compacta: o link do documento mostra o número SEI (o endereço inteiro no title); CSV e cópia levam o link.
    const linkDoc = m.raiz.querySelector<HTMLAnchorElement>('.dl-resultado table a[href*="id_documento=901"]');
    igual("link do documento: o texto é o número SEI", linkDoc?.textContent, "0001");
    checar(
      "link do documento: o endereço inteiro no title",
      (linkDoc?.getAttribute("title") ?? "").includes("id_documento=901"),
      linkDoc?.outerHTML,
    );
    const primeira = [...(m.raiz.querySelector(".dl-resultado tbody tr")?.children ?? [])];
    const semQuebra = (titulo: string) => {
      const k = [...m.raiz.querySelectorAll(".dl-resultado thead th")].findIndex((x) => x.textContent === titulo);
      return primeira[k]?.classList.contains("dl-sem-quebra") === true;
    };
    checar(
      "processo, número SEI e link curto não quebram linha",
      semQuebra("processo_destino") && semQuebra("numero_sei_gerado") && semQuebra("link_documento_gerado"),
      m.raiz.querySelector(".dl-resultado tbody tr")?.outerHTML,
    );
    checar("valor curto sem espaço da planilha (=cmd()) também não quebra", semQuebra("cargo"));
    checar("texto livre (nome_documento_gerado, com espaço) quebra", !semQuebra("nome_documento_gerado"));
    checar("janela larga no resultado", m.raiz.classList.contains("dl-largo"));
    // O título longo (nome_documento_gerado) pode quebrar depois do "_" (<wbr>), sem mudar o texto.
    const th = [...m.raiz.querySelectorAll(".dl-resultado thead th")].find((x) => x.textContent === "nome_documento_gerado");
    checar("cabeçalho com ponto de quebra depois do _", (th?.querySelectorAll("wbr").length ?? 0) === 2, th?.outerHTML);
    m.clicar("Baixar CSV");
    const b = m.t.baixados[0];
    igual("arquivo", [b?.nome, b?.tipo], ["documentos-em-lote.csv", "text/csv;charset=utf-8"]);
    checar(
      "CSV com as colunas e o =cmd() neutralizado",
      (b?.conteudo ?? "").includes("nome;cargo;processo_destino;nome_documento_gerado;numero_sei_gerado;link_documento_gerado") &&
        (b?.conteudo ?? "").includes("'=cmd()"),
      b?.conteudo,
    );
    checar(
      "CSV com o link inteiro do documento",
      (b?.conteudo ?? "").includes(`https://${HOST}/sei/controlador.php?acao=procedimento_trabalhar&id_documento=901`),
      b?.conteudo,
    );
    // Cópia rica (com links) quando o navegador deixa.
    const ricos: string[] = [];
    class ItemFalso {
      constructor(readonly partes: Record<string, Blob>) {}
    }
    m.deps.clip = {
      write: async (itens) => {
        for (const i of itens as unknown as ItemFalso[]) ricos.push(await (i.partes["text/html"] as Blob).text());
      },
      writeText: async (t) => void m.t.copiados.push(t),
    };
    m.deps.ItemClip = ItemFalso as unknown as typeof ClipboardItem;
    m.clicar("Copiar");
    await ate(() => m.t.avisos.length > 0);
    checar(
      "copiado com links clicáveis",
      (ricos[0] ?? "").includes('<a href="https://') && m.t.avisos[0] === "Copiado com links clicáveis",
      m.t.avisos,
    );
    checar("cópia com o link inteiro como texto", (ricos[0] ?? "").includes("&amp;id_documento=901</a>"), ricos[0]);
    checar("sem botão Cancelar", !botao(m.doc, "Cancelar"));
    m.app.destruir();
  }

  secao("app: Repetir só as que falharam (as incertas, só com confirmação explícita)");
  {
    const m = await abrirCom(
      lote(config(), registros(4), [
        criada(1),
        { situacao: "erro", erro: "Processo não está aberto na unidade" },
        { situacao: "erro", erro: MENSAGEM_EM_VOO, incerto: true },
        { situacao: "erro", erro: "Falha comum" },
      ]),
    );
    checar("resultado", naTela(m, ".dl-resultado"));
    checar(
      "incertas à parte, com o aviso",
      m.texto(".dl-resultado-incertas").includes("confira no SEI antes de repetir"),
      m.texto(".dl-resultado-incertas"),
    );
    m.clicar("Repetir só as que falharam");
    await ate(() => m.daOp("criar").length === 2 && naTela(m, ".dl-resultado"), 3000);
    igual("criar só nas linhas com erro não incertas", m.nomesCriados(), ["Pessoa 2", "Pessoa 4"]);
    const g = await m.lido();
    igual(
      "guardado",
      g?.itens.map((i) => i.situacao),
      ["criada", "criada", "erro", "criada"],
    );
    checar("a incerta continua incerta", g?.itens[2]?.incerto === true);
    checar("resumo acumulado do lote (3 criadas)", m.texto(".dl-resultado-resumo").includes("3 criadas"), m.texto(".dl-resultado-resumo"));
    checar("sem mais o que repetir: botão some", !botao(m.raiz, "Repetir só as que falharam"));
    // Repetir mesmo assim: confirmação explícita; recusada, nada sai.
    m.t.responder = false;
    m.clicar("Repetir mesmo assim");
    await ate(() => m.t.confirmacoes.length === 1);
    await tique(10);
    igual("recusada: nenhum criar", m.daOp("criar").length, 2);
    checar("a confirmação diz para conferir", (m.t.confirmacoes[0] ?? "").includes("confira"), m.t.confirmacoes[0]);
    m.t.responder = true;
    m.clicar("Repetir mesmo assim");
    await ate(() => m.daOp("criar").length === 3 && naTela(m, ".dl-resultado"), 3000);
    igual("confirmada: só a incerta", m.nomesCriados()[2], "Pessoa 3");
    igual(
      "tudo criado",
      (await m.lido())?.itens.map((i) => i.situacao),
      ["criada", "criada", "criada", "criada"],
    );
    m.app.destruir();
  }

  secao("app: repetir linha de novo processo que já tem o processo chama só criar");
  {
    const cn = config({ destino: { tipo: "novo-processo", idTipoProcesso: "100", especificacao: "x" } });
    const m = await abrirCom(
      lote(cn, registros(2), [
        { situacao: "erro", erro: "Falha", processo: "PN1" },
        { ...criada(2), processo: "PN2" },
      ]),
    );
    m.clicar("Repetir só as que falharam");
    await ate(() => m.daOp("criar").length === 1 && naTela(m, ".dl-resultado"), 3000);
    igual("nenhum criarProcesso", m.daOp("criarProcesso").length, 0);
    igual("alvo: o processo já criado", m.daOp("criar")[0]?.args.alvo, { tipo: "novo-processo", numero: "PN1" });
    const i = (await m.lido())?.itens[0];
    igual("criada no mesmo processo", [i?.situacao, i?.processo], ["criada", "PN1"]);
    m.app.destruir();
  }

  secao("app: Gravar as que ficaram de fora (reverifica; as com erro na planilha não)");
  {
    const cc = config({ destino: { tipo: "coluna", coluna: "proc" } });
    const regs = [
      { nome: "Ana", cargo: "", proc: P1 },
      { nome: "Bia", cargo: "", proc: P2 },
      { nome: "Caio", cargo: "", proc: P3 },
      { nome: "Duda", cargo: "", proc: "" },
    ];
    const l = lote(cc, regs, [
      criada(1),
      { situacao: "fora", erro: "Não aberto na unidade" },
      { situacao: "fora", erro: "Não aberto na unidade" },
      { situacao: "fora", erro: "Processo inválido ou vazio" },
    ]);
    const m = await abrirCom(l, {
      roteiro: (op, a, n) =>
        op === "verificar"
          ? a.numero === P2
            ? { numero: P2, status: "ok", idProcedimento: "2" }
            : { numero: a.numero, status: "nao-aberto", idProcedimento: "3", mensagem: "Enviado para outra unidade" }
          : op === "criar"
            ? okCriar(n + 1)
            : undefined,
    });
    checar("resultado", naTela(m, ".dl-resultado"));
    m.clicar("Gravar as que ficaram de fora");
    await ate(() => naTela(m, ".dl-gravar-fora") && m.daOp("verificar").length === 2);
    await tique(10);
    igual(
      "reverifica só os processos das de fora sem erro na planilha",
      m.daOp("verificar").map((c) => c.args.numero),
      [P2, P3],
    );
    checar(
      "com deNovo",
      m.daOp("verificar").every((c) => c.args.deNovo === true),
    );
    checar(
      "a linha com erro na planilha mostra o motivo",
      m.texto(".dl-gravar-fora .dl-linhas-problema").includes("Processo inválido ou vazio"),
    );
    const gravar = m.raiz.querySelector<HTMLButtonElement>(".dl-gravar-fora-ok");
    checar(
      "botão Gravar 1 linha",
      (gravar?.textContent ?? "").startsWith("Gravar 1 linha") && gravar?.disabled === false,
      gravar?.textContent,
    );
    disparar(gravar!, "click");
    await ate(() => m.daOp("criar").length === 1 && naTela(m, ".dl-resultado"), 3000);
    igual("criar só a que passou", m.nomesCriados(), ["Bia"]);
    igual("no processo dela", m.daOp("criar")[0]?.args.alvo, { tipo: "coluna", numero: P2 });
    const g = await m.lido();
    igual(
      "a com problema continua de fora",
      g?.itens.map((i) => i.situacao),
      ["criada", "criada", "fora", "fora"],
    );
    checar("motivo novo da que ficou de fora", (g?.itens[2]?.erro ?? "").includes("Enviado para outra unidade"), g?.itens[2]);
    checar("ainda pode gravar a de fora restante", !!botao(m.raiz, "Gravar as que ficaram de fora"));
    m.app.destruir();

    // Sem linha de fora por verificação (só erro de planilha, destino tela): o botão não aparece.
    const m2 = await abrirCom(
      lote(
        config(),
        [
          { nome: "", cargo: "" },
          { nome: "Ana", cargo: "" },
        ],
        [{ situacao: "fora", erro: "Nome na árvore vazio" }, criada(1)],
      ),
    );
    checar("sem o botão", naTela(m2, ".dl-resultado") && !botao(m2.raiz, "Gravar as que ficaram de fora"));
    m2.app.destruir();
  }

  secao("retomada: Continuar de onde parou não recria as criadas");
  {
    const m = await abrirCom(lote(config(), registros(4), [criada(1), { situacao: "pendente" }, criada(3), { situacao: "pendente" }]));
    checar("tela de retomada", naTela(m, ".dl-retomar"));
    checar("conta o feito", m.texto(".dl-retomar").includes("2 de 4"), m.texto(".dl-retomar"));
    checar("sem aviso de outra aba", !naTela(m, ".dl-outra-aba"));
    m.clicar("Continuar de onde parou");
    await ate(() => naTela(m, ".dl-resultado"), 3000);
    igual("criar só nas pendentes", m.nomesCriados(), ["Pessoa 2", "Pessoa 4"]);
    const g = await m.lido();
    checar("assumido com id novo", !!g && g.id !== "lote-1", g?.id);
    igual(
      "tudo criado",
      g?.itens.map((i) => i.situacao),
      ["criada", "criada", "criada", "criada"],
    );
    m.app.destruir();
  }

  secao("retomada: sessão expirada na 3ª pausa com 2 gravadas; ao retomar só a 3ª em diante");
  {
    const area = areaMemoria();
    const m = await abrirCom(
      lote(
        config(),
        registros(4),
        registros(4).map(() => ({ situacao: "pendente" as const })),
      ),
      {
        area,
        roteiro: (op, _a, n) =>
          op === "criar" ? (n === 3 ? { situacao: "erro", erro: "Sessão expirada.", sessao: true } : okCriar(n)) : undefined,
      },
    );
    m.clicar("Continuar de onde parou");
    await ate(() => m.daOp("criar").length === 3);
    await ate(() => !!botao(m.raiz, "Continuar") && m.visivel(botao(m.raiz, "Continuar")));
    igual(
      "pausado com 2 criadas e a 3ª pendente",
      (await m.lido())?.itens.map((i) => i.situacao),
      ["criada", "criada", "pendente", "pendente"],
    );
    m.app.destruir();
    const m2 = await abrirCom(null, { area });
    checar("retomada de novo", naTela(m2, ".dl-retomar"));
    m2.clicar("Continuar de onde parou");
    await ate(() => naTela(m2, ".dl-resultado"), 3000);
    igual("só a 3ª e a 4ª", m2.nomesCriados(), ["Pessoa 3", "Pessoa 4"]);
    m2.app.destruir();
  }

  secao("retomada: a linha em voo (Ruling 18) aparece como incerta, nunca pendente");
  {
    const m = await abrirCom(
      lote(config(), registros(3), [criada(1), { situacao: "erro", erro: MENSAGEM_EM_VOO, incerto: true }, { situacao: "pendente" }]),
    );
    checar("aviso das incertas", m.texto(".dl-retomar").includes("1 linha ficou incerta"), m.texto(".dl-retomar"));
    m.clicar("Continuar de onde parou");
    await ate(() => naTela(m, ".dl-resultado"), 3000);
    igual("só a pendente", m.nomesCriados(), ["Pessoa 3"]);
    const tds = [...m.raiz.querySelectorAll(".dl-resultado tbody tr td:first-child")].map((td) => td.textContent);
    igual("a em voo como incerta", tds, ["Criada", ROTULO_INCERTO, "Criada"]);
    m.app.destruir();
  }

  secao("retomada: lote atualizado há pouco pode estar rodando em outra aba");
  {
    const m = await abrirCom(lote(config(), registros(2), [{ situacao: "pendente" }, { situacao: "pendente" }]), {
      relogioRepo: 50_000,
      agoraApp: 55_000,
    });
    checar("aviso de outra aba", m.texto(".dl-outra-aba").includes("outra aba"), m.texto(".dl-outra-aba"));
    m.clicar("Continuar de onde parou");
    await tique(10);
    igual("o primeiro clique não envia nada", m.daOp("criar").length, 0);
    checar("pede a confirmação explícita", m.visivel(botao(m.raiz, "Continuar mesmo assim")));
    m.clicar("Continuar mesmo assim");
    await ate(() => naTela(m, ".dl-resultado"), 3000);
    igual("confirmado: roda", m.daOp("criar").length, 2);
    m.app.destruir();
  }

  secao("retomada: lote de outro login não é oferecido");
  {
    const m = await abrirCom(lote(config(), registros(1), [{ situacao: "pendente" }], { login: "bia" }));
    checar("sem tela de retomada", !naTela(m, ".dl-retomar"));
    await ate(() => m.chamadas.some((c) => c.op === "listarModelos"));
    checar("abre a etapa Modelo", m.visivel(m.raiz.querySelector(".dl-etapas")));
    checar("o lote da bia fica", (await m.lido())?.login === "bia");
    m.app.destruir();
  }

  secao("retomada: Descartar pede confirmação e apaga");
  {
    const m = await abrirCom(lote(config(), registros(2), [criada(1), { situacao: "pendente" }]));
    m.t.responder = false;
    m.clicar("Descartar");
    await ate(() => m.t.confirmacoes.length === 1);
    await tique(5);
    checar("recusado: o lote fica e a tela também", !!(await m.lido()) && naTela(m, ".dl-retomar"));
    m.t.responder = true;
    m.clicar("Descartar");
    await ate(() => m.chamadas.some((c) => c.op === "listarModelos"));
    checar("apagou a chave docslote/lote", !(CHAVE in (await m.area.obter())));
    checar("etapas de novo", m.visivel(m.raiz.querySelector(".dl-etapas")) && m.visivel(m.raiz.querySelector(".dl-rodape-etapa")));
    igual("nenhum criar", m.daOp("criar").length, 0);
    m.app.destruir();
  }

  secao("retomada: destino 'processo da tela' só continua no mesmo processo");
  {
    const m = await abrirCom(lote(config(), registros(2), [criada(1), { situacao: "pendente" }], { idProcedimentoTela: "55" }));
    checar("aviso do outro processo", m.texto(".dl-retomar").includes(PROTOCOLO), m.texto(".dl-retomar"));
    checar("sem Continuar", !m.visivel(botao(m.raiz, "Continuar de onde parou")));
    igual("nenhum criar", m.daOp("criar").length, 0);
    m.app.destruir();
    const m2 = await abrirCom(lote(config(), registros(2), [criada(1), { situacao: "pendente" }], { idProcedimentoTela: "77" }));
    checar("mesmo processo da tela (77): Continuar", m2.visivel(botao(m2.raiz, "Continuar de onde parou")));
    m2.app.destruir();
  }

  secao("resultado: Concluir apaga o lote; fechar com o resultado apaga só sem pendência");
  {
    const m = await abrirCom(lote(config(), registros(2), [criada(1), criada(2)]));
    m.clicar("Concluir");
    await ate(() => m.t.fechou === 1);
    igual("sem pendência: sem confirmação", m.t.confirmacoes.length, 0);
    checar("apagou a chave docslote/lote", !(CHAVE in (await m.area.obter())));
    m.app.destruir();

    const m2 = await abrirCom(lote(config(), registros(2), [criada(1), { situacao: "erro", erro: "Falha" }]));
    m2.t.responder = false;
    m2.clicar("Concluir");
    await ate(() => m2.t.confirmacoes.length === 1);
    await tique(5);
    checar("com erro: confirmação recusada mantém", !!(await m2.lido()) && m2.t.fechou === 0);
    m2.t.responder = true;
    m2.clicar("Concluir");
    await ate(() => m2.t.fechou === 1);
    checar("confirmada: apaga", !(CHAVE in (await m2.area.obter())));
    m2.app.destruir();

    // Fechar (X, Esc, véu): a aba tira o iframe assim que recebe o `fechar`; depois disso o app não grava mais nada.
    // A remoção do lote limpo tem de terminar ANTES do pedido (Area com `remover` lento).
    for (const caso of ["limpo", "pendente"] as const) {
      const base = areaMemoria();
      let morto = false;
      const lenta: Area = {
        ...base,
        obter: async (c) => {
          await tique(15);
          return morto ? {} : base.obter(c);
        },
        remover: async (c) => {
          await tique(30);
          if (!morto) await base.remover(c);
        },
      };
      const itens: ItemLote[] = caso === "limpo" ? [criada(1)] : [criada(1), { situacao: "erro", erro: "Falha" }];
      const m3 = await abrirCom(lote(config(), registros(itens.length), itens), { area: lenta });
      await fecharJanela(m3.app, () => {
        morto = true;
      });
      morto = false;
      if (caso === "limpo") checar("X/Esc no resultado sem pendência: apagado antes do fechar", !(CHAVE in (await base.obter())));
      else checar("X/Esc no resultado com erro repetível: fica (até 7 dias)", CHAVE in (await base.obter()));
    }
    {
      // O teto não prende o fechamento: armazenamento travado, o fechar sai mesmo assim.
      const base = areaMemoria();
      const travada: Area = { ...base, remover: () => new Promise(() => {}) };
      const m5 = await abrirCom(lote(config(), registros(1), [criada(1)]), { area: travada });
      let fechou = 0;
      const t0 = Date.now();
      await fecharJanela(m5.app, () => void fechou++, 50);
      checar("armazenamento travado: fecha no teto", fechou === 1 && Date.now() - t0 < 1000);
    }
  }

  secao("resultado: depois de assumir, a tela segue com o lote novo (falha ao marcar)");
  {
    const m = await abrirCom(lote(config(), registros(2), [criada(1), { situacao: "erro", erro: "Falha" }]));
    m.deps.repo.marcar = async () => false;
    m.clicar("Repetir só as que falharam");
    await ate(() => (m.raiz.querySelector(".dl-resultado .dl-erro:not([hidden])")?.textContent ?? "") !== "");
    igual("nada enviado", m.daOp("criar").length, 0);
    const novo = (await m.lido())?.id;
    checar("o guardado foi assumido (id novo)", !!novo && novo !== "lote-1", novo);
    m.clicar("Concluir");
    await ate(() => m.t.fechou === 1);
    checar("Concluir apaga o lote de id novo", !(CHAVE in (await m.area.obter())));
    m.app.destruir();

    const cc = config({ destino: { tipo: "coluna", coluna: "proc" } });
    const regs = [
      { nome: "Ana", cargo: "", proc: P1 },
      { nome: "Bia", cargo: "", proc: P2 },
    ];
    const m2 = await abrirCom(lote(cc, regs, [criada(1), { situacao: "fora", erro: "Não aberto na unidade" }]));
    m2.deps.repo.marcar = async () => false;
    m2.clicar("Gravar as que ficaram de fora");
    await ate(() => m2.raiz.querySelector<HTMLButtonElement>(".dl-gravar-fora-ok")?.disabled === false);
    disparar(m2.raiz.querySelector(".dl-gravar-fora-ok")!, "click");
    await ate(() => (m2.raiz.querySelector(".dl-gravar-fora > .dl-erro:not([hidden])")?.textContent ?? "") !== "");
    m2.clicar("Voltar ao resultado");
    m2.clicar("Concluir");
    await ate(() => m2.t.fechou === 1);
    checar("gravar as de fora: Concluir apaga o lote de id novo", !(CHAVE in (await m2.area.obter())));
    m2.app.destruir();
  }

  secao("resultado: coluna da planilha com o nome de uma gerada não duplica o cabeçalho");
  {
    const regs = [{ nome: "Ana", cargo: "", numero_sei_gerado: "velho", processo_destino: "p" }];
    const l = lote(config(), regs, [criada(1)]);
    const titulos = colunasDoResultado(l).map((c) => c.titulo);
    igual("títulos", titulos, [
      "nome",
      "cargo",
      "numero_sei_gerado (planilha)",
      "processo_destino (planilha)",
      ...COLUNAS_GERADAS,
      "observacao",
    ]);
    const cab =
      resultadoComoCsv(linhasDoResultado(l), colunasDoResultado(l))
        .replace(/^\uFEFF/, "")
        .split("\r\n")[0] ?? "";
    igual("sem cabeçalho repetido", new Set(cab.split(";")).size, cab.split(";").length);
    const linha = linhasDoResultado(l)[0];
    const col = (t: string) => colunasDoResultado(l).find((c) => c.titulo === t)?.chave ?? "";
    igual(
      "valores separados",
      [linha?.campos[col("numero_sei_gerado (planilha)")], linha?.campos[col("numero_sei_gerado")]],
      ["velho", "0001"],
    );
  }

  secao("contagem: execução, pastilha e resultado contam as incertas do mesmo jeito");
  {
    const l = lote(config(), registros(3), [
      criada(1),
      { situacao: "erro", erro: MENSAGEM_EM_VOO, incerto: true },
      { situacao: "erro", erro: "x" },
    ]);
    const ex = new ExecucaoDocumentos(l, {
      rpc: { chamar: (async () => null) as never },
      repo: new RepositorioLote(areaMemoria()),
      aoMudar: () => {},
    });
    const p = ex.progresso;
    const c = contagemDoLote(l);
    igual("mesmos números", [p.criadas, p.erros, p.incertas, p.fora], [c.criadas, c.erros, c.incertas, c.fora]);
    igual("incerta à parte do erro", [p.erros, p.incertas], [1, 1]);
    checar("resumo da execução fala da incerta", resumoDoLote(p).includes("1 incerta"), resumoDoLote(p));
    const tela = new TelaExecucao(ex, { pausar: () => {}, continuar: () => {}, minimizar: () => {} });
    checar(
      "contagem da tela",
      (tela.el.querySelector(".dl-falhas")?.textContent ?? "").includes("1 incerta"),
      tela.el.querySelector(".dl-falhas")?.textContent,
    );
  }

  secao("repetição de novo processo com processo: sessão expirada volta a pendente com o processo");
  {
    const cn = config({ destino: { tipo: "novo-processo", idTipoProcesso: "100", especificacao: "x" } });
    const l = lote(cn, registros(1), [{ situacao: "pendente", processo: "PN5" }]);
    const area = areaMemoria();
    const repo = new RepositorioLote(area, () => 5000);
    await repo.gravar(l);
    const rpc = {
      chamar: (async (op: string) => {
        await tique(1);
        return op === "criar" ? { situacao: "erro", erro: "Sessão expirada.", sessao: true } : null;
      }) as never,
    };
    const ex = new ExecucaoDocumentos(l, { rpc, repo, aoMudar: () => {}, esperar: () => tique(0) });
    await ex.rodar();
    igual("pausado", ex.estado, "pausado");
    const g = ((await area.obter(CHAVE))[CHAVE] as LoteDocumentos).itens[0];
    igual("pendente com o processo", [g?.situacao, g?.processo, g?.incerto], ["pendente", "PN5", undefined]);
  }

  secao("Repetir mesmo assim: a incerteza só do processo novo fala do processo");
  {
    const cn = config({ destino: { tipo: "novo-processo", idTipoProcesso: "100", especificacao: "x" } });
    const m = await abrirCom(lote(cn, registros(1), [{ situacao: "erro", erro: "O processo pode ter sido criado.", incerto: true }]));
    m.t.responder = false;
    m.clicar("Repetir mesmo assim");
    await ate(() => m.t.confirmacoes.length === 1);
    const t = m.t.confirmacoes[0] ?? "";
    checar("fala do processo, não do documento", t.includes("processo novo") && !t.includes("o documento pode"), t);
    m.app.destruir();
  }

  secao("resultado: processo criado sem o número lido mostra e exporta o link do processo");
  {
    const cn = config({ destino: { tipo: "novo-processo", idTipoProcesso: "100", especificacao: "x" } });
    const LINK = `https://${HOST}/sei/controlador.php?acao=procedimento_trabalhar&id_procedimento=7`;
    const LINK2 = `https://${HOST}/sei/controlador.php?acao=procedimento_trabalhar&id_procedimento=8`;
    const itens: ItemLote[] = [
      { situacao: "erro", erro: "O processo foi criado, mas o número não pôde ser lido.", incerto: true, linkProcesso: LINK },
      { situacao: "erro", erro: "Falhou o documento.", processo: "PN8", linkProcesso: LINK2 },
      { situacao: "erro", erro: "x", incerto: true, linkProcesso: "javascript:alert(1)" },
      { situacao: "erro", erro: "x", incerto: true, linkProcesso: `https://${HOST}/sei/controlador.php?id_procedimento=9&infra_hash=abc` },
      { situacao: "erro", erro: "x", incerto: true, linkProcesso: "ftp://x/y" },
    ];
    const l = lote(cn, registros(5), itens);
    const linhas = linhasDoResultado(l);
    igual("processo_destino: o link quando o número é desconhecido", linhas[0]?.campos.processo_destino, LINK);
    igual("processo_destino: o número quando conhecido", linhas[1]?.campos.processo_destino, "PN8");
    igual(
      "processo_destino: link inseguro nunca exportado",
      linhas.slice(2).map((x) => x.campos.processo_destino),
      ["", "", ""],
    );
    const csv = resultadoComoCsv(linhas, colunasDoResultado(l));
    checar("CSV leva o link do processo", csv.includes(LINK), csv);
    checar("CSV sem javascript:, infra_hash nem ftp:", !/javascript:|infra_hash|ftp:/i.test(csv), csv);

    const m = await abrirCom(l);
    const hrefs = [...m.raiz.querySelectorAll<HTMLAnchorElement>(".dl-resultado a")].map((a) => a.getAttribute("href") ?? "");
    const abrir = [...m.raiz.querySelectorAll<HTMLAnchorElement>(".dl-resultado a")].filter(
      (a) => a.getAttribute("href") === LINK && (a.textContent ?? "").includes("Abrir o processo criado"),
    );
    checar("incerta sem número: link clicável Abrir o processo criado", abrir.length >= 1, hrefs);
    checar(
      "abre em outra aba sem opener",
      abrir.every((a) => a.getAttribute("target") === "_blank" && a.getAttribute("rel") === "noopener"),
    );
    checar("erro com processo conhecido: link do processo", hrefs.includes(LINK2), hrefs);
    checar(
      "só links http(s) sem infra_hash na tela",
      hrefs.every((h) => /^https?:\/\//i.test(h) && !/infra_hash/i.test(h)),
      hrefs,
    );
    const celula = m.raiz.querySelector(".dl-tabela tbody tr td a[href]");
    checar(
      "a tabela não mostra o endereço cru como texto",
      !!celula && !(celula.textContent ?? "").startsWith("https:"),
      celula?.textContent,
    );

    // Repetir mesmo assim: a confirmação diz que o processo JÁ foi criado e dá o link.
    m.t.responder = false;
    const repetir = [...m.raiz.querySelectorAll("button")].filter((b) => (b.textContent ?? "").includes("Repetir mesmo assim"));
    disparar(repetir[0]!, "click");
    await ate(() => m.t.confirmacoes.length === 1);
    const t = m.t.confirmacoes[0] ?? "";
    checar("confirmação: um processo já foi criado para a linha", t.includes("já foi criado"), t);
    checar("confirmação: dá o link do processo", t.includes(LINK), t);
    checar("confirmação: repetir cria outro processo", t.includes("outro processo"), t);
    igual("recusada: nada enviado", m.chamadas.filter((c) => c.op === "criar" || c.op === "criarProcesso").length, 0);
    // Link inseguro: a confirmação não o repete.
    disparar(repetir[1]!, "click");
    await ate(() => m.t.confirmacoes.length === 2);
    const t2 = m.t.confirmacoes[1] ?? "";
    checar("confirmação: link inseguro não aparece", !t2.includes("javascript:") && !t2.includes("já foi criado"), t2);
    m.app.destruir();
  }

  secao("resultado: Gerar links permanentes destes documentos");
  {
    igual(
      "chave da entrada igual à do Link Permanente",
      [CHAVE_ENTRADA_LINK, CHAVE_ENTRADA],
      ["link-permanente/entrada", "link-permanente/entrada"],
    );
    const m = await abrirCom(
      lote(config(), registros(3), [
        criada(1),
        { situacao: "erro", erro: MENSAGEM_EM_VOO, incerto: true, numero: "0009", idDocumento: "909" },
        criada(3),
      ]),
    );
    m.clicar("Gerar links permanentes destes documentos");
    await ate(() => m.t.fechou === 1);
    igual("entrada: os números das criadas (sem a incerta)", m.t.entradaLink, ["0001\n0003"]);
    igual("dispara o Link Permanente pela aba", m.daOp("abrirLinkPermanente").length, 1);
    m.app.destruir();

    const m2 = await abrirCom(lote(config(), registros(1), [{ situacao: "erro", erro: "x" }]));
    checar("sem criada: sem o botão", !botao(m2.raiz, "Gerar links permanentes destes documentos"));
    m2.app.destruir();
  }

  secao("Iniciar: guarda contra outro lote não concluído (outra aba)");
  for (const caso of ["recente", "antigo"] as const) {
    const m = await abrirCom(null, {
      semIniciar: true,
      relogioRepo: 50_000,
      agoraApp: caso === "recente" ? 51_000 : 50_000 + JANELA_OUTRA_ABA_MS + 1,
    });
    await naPlanilha(m);
    await m.escolherArquivo("a.csv", utf8("nome;cargo\nAna;Chefe\nBia;Diretora\n"));
    await ate(() => m.avancar()?.disabled === false);
    disparar(m.avancar()!, "click");
    await ate(() => !!m.raiz.querySelector(`button[role="combobox"][aria-label="${ROTULO_COLUNA_NOME}"]`));
    escolherCombo(m.raiz, ROTULO_COLUNA_NOME, "nome");
    const rodape = () => m.raiz.querySelector<HTMLButtonElement>(".dl-rodape-etapa .primario");
    disparar(rodape()!, "click");
    await ate(() => !!m.raiz.querySelector(".dl-previa"));
    // Outra aba grava o seu lote depois que esta janela abriu.
    await m.deps.repo.gravar({ ...lote(config(), registros(2), [criada(1), { situacao: "pendente" }]), id: "outro" });
    m.t.responder = false;
    disparar(rodape()!, "click");
    await ate(() => (m.raiz.querySelector(".dl-previa .dl-erro")?.textContent ?? "") !== "" || m.t.confirmacoes.length > 0);
    await tique(10);
    igual(`${caso}: nada enviado`, m.daOp("criar").length, 0);
    igual(`${caso}: o lote da outra aba fica`, (await m.lido())?.id, "outro");
    if (caso === "recente") {
      igual("recente: recusa sem perguntar", m.t.confirmacoes.length, 0);
      checar(
        "recente: diz que pode estar em outra aba",
        (m.raiz.querySelector(".dl-previa .dl-erro")?.textContent ?? "").includes("outra aba"),
      );
    } else {
      igual("antigo: pergunta", m.t.confirmacoes.length, 1);
      m.t.responder = true;
      await ate(() => rodape()?.disabled === false);
      disparar(rodape()!, "click");
      await ate(() => m.daOp("criar").length === 2 && naTela(m, ".dl-resultado"), 3000);
      checar("confirmado: o lote novo substitui", (await m.lido())?.id !== "outro");
    }
    m.app.destruir();
  }

  secao("pastilha: OP_RESTAURADO tira o app do modo pastilha sem pedir nada à aba");
  {
    let soltar!: (v: unknown) => void;
    const segurado = new Promise((r) => {
      soltar = r;
    });
    const m = await abrirCom(lote(config(), registros(1), [{ situacao: "pendente" }]), {
      roteiro: (op) => (op === "criar" ? segurado : undefined),
    });
    m.clicar("Continuar de onde parou");
    await ate(() => m.daOp("criar").length === 1);
    m.clicar("Minimizar");
    await ate(() => m.doc.documentElement.hasAttribute("data-minimizado"));
    const t = tratadoresDoApp(m.app);
    checar("tratador restaurado", (await t[OP_RESTAURADO]!(undefined)) === true);
    checar("sem data-minimizado", !m.doc.documentElement.hasAttribute("data-minimizado"));
    checar(
      "pastilha escondida, conteúdo visível",
      !m.visivel(m.raiz.querySelector(".dl-pastilha")) && m.visivel(m.raiz.querySelector(".dl-execucao")),
    );
    igual("só o pedido de minimizar foi à aba", m.t.minimizou, [true]);
    soltar(okCriar(1));
    await ate(() => naTela(m, ".dl-resultado"), 3000);
    m.app.destruir();
  }

  secao("resultado: a ordem das colunas da planilha sobrevive ao armazenamento (D4)");
  {
    // O chrome.storage devolve as chaves dos objetos em ordem alfabética: o falso faz o mesmo na leitura.
    const ordenar = (v: unknown): unknown =>
      Array.isArray(v)
        ? v.map(ordenar)
        : v && typeof v === "object"
          ? Object.fromEntries(
              Object.keys(v)
                .sort()
                .map((k) => [k, ordenar((v as Record<string, unknown>)[k])]),
            )
          : v;
    const base = areaMemoria();
    const alfabetica: Area = { ...base, obter: async (c) => ordenar(await base.obter(c)) as Record<string, unknown> };
    const repo = new RepositorioLote(alfabetica, () => 5000);
    const regs = [{ nome: "Ana", municipio: "Santos", data: "01/10/2026", processo: P1 }];
    const e = {
      config: config({ destino: { tipo: "tela" } }),
      colunas: ["nome", "municipio", "data", "processo"],
      registros: regs,
      protocolo: PROTOCOLO,
    };
    const montado = montarLote(e, { host: HOST, login: "ana" }, { id: "ord" });
    igual("o lote leva a lista de colunas da planilha", montado.colunas, ["nome", "municipio", "data", "processo"]);
    await repo.gravar({ ...montado, itens: [criada(1)] });
    const lido = (await repo.carregar(HOST, "ana")) as LoteDocumentos;
    igual("as chaves da linha voltam em ordem alfabética (como o chrome.storage)", Object.keys(lido.linhas[0]?.dados ?? {}), [
      "data",
      "municipio",
      "nome",
      "processo",
    ]);
    const titulos = colunasDoResultado(lido).map((c) => c.titulo);
    igual("resultado na ordem da planilha", titulos.slice(0, 4), ["nome", "municipio", "data", "processo"]);
    const cab =
      resultadoComoCsv(linhasDoResultado(lido), colunasDoResultado(lido))
        .replace(/^\uFEFF/, "")
        .split("\r\n")[0] ?? "";
    checar("CSV na ordem da planilha", cab.startsWith("Situação;nome;municipio;data;processo;processo_destino"), cab);
    const linha = linhasDoResultado(lido)[0];
    const col = (t: string) => colunasDoResultado(lido).find((c) => c.titulo === t)?.chave ?? "";
    igual("valores na coluna certa", linha?.campos[col("municipio")], "Santos");

    // Lote antigo, sem a lista: a ordem das chaves da primeira linha (o comportamento de antes).
    const { colunas: _sem, ...antigo } = lido;
    igual(
      "lote sem colunas: ordem das chaves",
      colunasDoResultado(antigo as LoteDocumentos)
        .map((c) => c.titulo)
        .slice(0, 4),
      ["data", "municipio", "nome", "processo"],
    );
    // Coluna que só aparece nas linhas (lista mais curta) não some.
    const curta = { ...lido, colunas: ["nome"] };
    checar(
      "coluna fora da lista ainda aparece, depois das da lista",
      colunasDoResultado(curta)
        .map((c) => c.titulo)
        .slice(0, 4)
        .join(",") === "nome,data,municipio,processo",
    );
  }

  secao("árvore: recarregada ao fim da rodada e ao fechar, só se gravou no processo da tela (D2)");
  {
    const recargas = (m: { daOp(op: string): unknown[] }) => m.daOp("recarregarArvore").length;
    // Destino tela: ao terminar a rodada e de novo ao fechar o resultado.
    const m = await abrirCom(lote(config(), registros(2), [criada(1), { situacao: "pendente" }]));
    m.clicar("Continuar de onde parou");
    await ate(() => naTela(m, ".dl-resultado"), 3000);
    await tique(5);
    igual("tela: recarregou ao terminar", recargas(m), 1);
    await fecharJanela(m.app, () => {});
    igual("tela: recarregou ao fechar o resultado", recargas(m), 2);

    // Falha da recarga (RPC rejeita ou responde erro) não mexe no lote nem na tela.
    for (const falha of [new Error("aba fechada"), { situacao: "erro", erro: "sem árvore" }]) {
      const f = await abrirCom(lote(config(), registros(2), [criada(1), { situacao: "pendente" }]), {
        roteiro: (op, _a, n) => (op === "criar" ? okCriar(n) : op === "recarregarArvore" ? falha : undefined),
      });
      f.clicar("Continuar de onde parou");
      await ate(() => naTela(f, ".dl-resultado"), 3000);
      await tique(5);
      checar("falha da recarga: resultado na tela, sem erro", !naTela(f, ".dl-resultado .dl-erro:not([hidden])"));
      igual(
        "falha da recarga: lote intacto",
        (await f.lido())?.itens.map((i) => i.situacao),
        ["criada", "criada"],
      );
      await fecharJanela(f.app, () => {});
      checar("falha da recarga: fechar segue (lote limpo apagado)", !(await f.lido()));
    }

    // Novo processo: os documentos vão para outros processos; a árvore da tela não muda.
    const cn = config({ destino: { tipo: "novo-processo", idTipoProcesso: "100", especificacao: "x" } });
    const n = await abrirCom(lote(cn, registros(1), [{ situacao: "pendente", processo: "PN1" }]));
    n.clicar("Continuar de onde parou");
    await ate(() => naTela(n, ".dl-resultado"), 3000);
    await fecharJanela(n.app, () => {});
    igual("novo processo: nenhuma recarga", recargas(n), 0);

    // Coluna: só quando alguma linha foi para o processo da tela.
    const cc = config({ destino: { tipo: "coluna", coluna: "proc" } });
    const regsOutro = [
      { nome: "Ana", cargo: "", proc: P1 },
      { nome: "Bia", cargo: "", proc: P2 },
    ];
    const c1 = await abrirCom(lote(cc, regsOutro, [{ situacao: "pendente" }, { situacao: "pendente" }]));
    c1.clicar("Continuar de onde parou");
    await ate(() => naTela(c1, ".dl-resultado"), 3000);
    await fecharJanela(c1.app, () => {});
    igual("coluna só com outros processos: nenhuma recarga", recargas(c1), 0);
    const regsTela = [
      { nome: "Ana", cargo: "", proc: P1 },
      { nome: "Bia", cargo: "", proc: PROTOCOLO },
    ];
    const c2 = await abrirCom(lote(cc, regsTela, [{ situacao: "pendente" }, { situacao: "pendente" }]));
    c2.clicar("Continuar de onde parou");
    await ate(() => naTela(c2, ".dl-resultado"), 3000);
    await tique(5);
    igual("coluna com linha no processo da tela: recarregou ao terminar", recargas(c2), 1);
    c2.app.destruir();
    // A linha do processo da tela falhou (nada criado lá): sem recarga.
    const c3 = await abrirCom(lote(cc, regsTela, [{ situacao: "pendente" }, { situacao: "pendente" }]), {
      roteiro: (op, _a, k) => (op === "criar" ? (k === 2 ? { situacao: "erro", erro: "Falha" } : okCriar(k)) : undefined),
    });
    c3.clicar("Continuar de onde parou");
    await ate(() => naTela(c3, ".dl-resultado"), 3000);
    await tique(5);
    igual("coluna: a linha da tela falhou, nenhuma recarga", recargas(c3), 0);
    c3.app.destruir();

    // Lote guardado reaberto direto no resultado (nada gravado nesta janela): fechar não recarrega.
    const r = await abrirCom(lote(config(), registros(1), [criada(1)]));
    await fecharJanela(r.app, () => {});
    igual("lote reaberto: nenhuma recarga", recargas(r), 0);

    // Concluir também fecha o resultado.
    const k = await abrirCom(lote(config(), registros(2), [criada(1), { situacao: "pendente" }]));
    k.clicar("Continuar de onde parou");
    await ate(() => naTela(k, ".dl-resultado"), 3000);
    await tique(5);
    k.clicar("Concluir");
    await ate(() => k.t.fechou === 1);
    igual("Concluir: recarregou ao terminar e ao fechar", recargas(k), 2);
    k.app.destruir();
  }
}
