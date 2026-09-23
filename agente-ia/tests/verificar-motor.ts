/**
 * Motor com provedor roteirizado: cada rodada do "modelo" é uma função que
 * olha o histórico e devolve texto ou chamadas de tool. Assim o teste cobre o
 * laço inteiro sem rede e sem aleatoriedade.
 */

import { Pseudonimos } from "@nucleo/privacidade/anonimizar";
import { s, validar } from "../src/motor/esquema";
import { Motor, resolverReferencias } from "../src/motor/motor";
import { Acumulador } from "../src/motor/provedor";
import { RegistroTools } from "../src/motor/tools";
import type { DecisaoPlano, InterfaceMotor, Mensagem, PlanoPrevisto, Provedor, RespostaLLM } from "../src/motor/tipos";
import { TOOLS_MOTOR } from "../src/tools/motor";
import { TOOLS_SEI } from "../src/tools/sei";
import { checar, secao } from "./util";

type Rodada = (historico: Mensagem[]) => RespostaLLM;

function provedor(rodadas: Rodada[], vistos: Mensagem[][]): Provedor {
  let i = 0;
  return {
    modelo: "teste",
    async conversar(p) {
      vistos.push(p.mensagens);
      const f = rodadas[i++];
      if (!f) return { texto: "fim", chamadas: [], fim: "stop" };
      return f(p.mensagens);
    },
  };
}

const chamada = (nome: string, args: unknown, id = nome) => ({ id, type: "function" as const, function: { name: nome, arguments: JSON.stringify(args) } });

function ui(decisao: Partial<DecisaoPlano> = { aprovado: true }): InterfaceMotor & { planos: PlanoPrevisto[]; avisos: string[] } {
  const planos: PlanoPrevisto[] = [];
  const avisos: string[] = [];
  return {
    planos,
    avisos,
    texto: () => undefined,
    fimDaResposta: () => undefined,
    toolIniciada: () => undefined,
    toolTerminada: () => undefined,
    aprovarPlano: async (p) => (planos.push(p), { aprovado: false, ...decisao }),
    progressoPlano: () => undefined,
    consentir: async () => true,
    perguntar: async () => "sim",
    tarefas: () => undefined,
    uso: () => undefined,
    aviso: (t) => avisos.push(t),
  };
}

/** Uma aba do SEI de mentira: guarda o que foi pedido. */
function seiFalso(log: Array<{ op: string; args: Record<string, unknown> }>) {
  return async (op: string, args: Record<string, unknown>) => {
    log.push({ op, args });
    if (op === "processo.consultar") return { protocolo: args.processo, tipo: "Contrato", interessados: ["Maria Aparecida Souza"], especificacao: "Contrato de Maria Aparecida Souza, CPF 529.982.247-25" };
    if (op === "processo.anotacao") return { alvo: args.processo, mudancas: [{ campo: "Anotação", antes: "", depois: args.texto }], resumo: "ok", aplicado: args.aplicar };
    if (op === "documento.criar") return { alvo: args.processo, mudancas: [], resumo: "criado", aplicado: args.aplicar, dados: { numero: "0200001" } };
    if (op === "documento.assinar") return { alvo: args.numero, mudancas: [{ campo: "Assinatura", antes: "", depois: "assinado" }], resumo: "assinado", aplicado: args.aplicar, dados: { cargos: "Analista|Chefe" } };
    if (op === "documento.editar") return { alvo: args.numero, mudancas: [], resumo: "editado", aplicado: true };
    return {};
  };
}

export async function verificarMotor(): Promise<void> {
  secao("esquema");
  const esq = s.objeto({ n: s.inteiro({ min: 1 }), "t?": s.texto({ enum: ["a", "b"] }), l: s.lista(s.texto()) });
  checar("coage numero e lista de um", JSON.stringify(validar(esq, { n: "3", l: "x" }).valor) === JSON.stringify({ n: 3, l: ["x"] }));
  checar("enum invalido e campo desconhecido", validar(esq, { n: 1, l: [], t: "z", w: 1 }).erros.length === 2, validar(esq, { n: 1, l: [], t: "z", w: 1 }).erros);
  checar("obrigatorio", validar(esq, { l: [] }).erros.some((e) => e.includes("args.n")));

  secao("sse");
  const acc = new Acumulador();
  acc.somar({ choices: [{ delta: { content: "Ol" } }] });
  acc.somar({ choices: [{ delta: { content: "á", tool_calls: [{ index: 0, id: "c1", function: { name: "processo_", arguments: '{"proc' } }] } }] });
  acc.somar({ choices: [{ delta: { tool_calls: [{ index: 0, function: { name: "consultar", arguments: 'esso":"1"}' } }] }, finish_reason: "tool_calls" }], usage: { prompt_tokens: 10, completion_tokens: 5, cost: 0.001 } });
  const r = acc.resposta();
  checar("junta texto e tool call fragmentados", r.texto === "Olá" && r.chamadas[0].function.name === "processo_consultar" && r.chamadas[0].function.arguments === '{"processo":"1"}');
  checar("uso e custo", r.uso?.custo === 0.001);

  secao("referencias");
  const res = [{ itens: [{ numero: "0200001" }] }];
  checar("valor inteiro", resolverReferencias<unknown>("$1.itens.0.numero", res) === "0200001");
  checar("interpolacao", resolverReferencias({ t: "Ver {$1.itens.0.numero}." }, res).t === "Ver 0200001.");

  const tools = new RegistroTools([...TOOLS_SEI, ...TOOLS_MOTOR]);

  secao("motor: leitura e anonimizacao na fronteira");
  {
    const vistos: Mensagem[][] = [];
    const log: Array<{ op: string; args: Record<string, unknown> }> = [];
    const priv = new Pseudonimos();
    const m = new Motor({
      provedor: provedor([() => ({ texto: "", chamadas: [chamada("processo_consultar", { processo: "50300.018905/2018-67" })], fim: "tool_calls" })], vistos),
      tools,
      ui: ui(),
      privacidade: priv,
      sei: seiFalso(log),
      sistema: () => "sistema",
    });
    await m.enviar("Veja o processo do CPF 111.444.777-35 e me diga.");
    const tudo = JSON.stringify(vistos);
    checar("mensagem do usuario anonimizada", !tudo.includes("111.444.777-35") && tudo.includes("[CPF_1]"));
    checar("resultado da tool anonimizado (cpf e interessado)", !tudo.includes("529.982.247-25") && !tudo.includes("Maria Aparecida Souza"), tudo.slice(-400));
    checar("protocolo preservado", tudo.includes("50300.018905/2018-67"));
  }

  secao("motor: escrita vira plano; recusa volta ao modelo");
  {
    const vistos: Mensagem[][] = [];
    const log: Array<{ op: string; args: Record<string, unknown> }> = [];
    const u = ui({ aprovado: false, motivo: "use outro texto" });
    const m = new Motor({
      provedor: provedor([() => ({ texto: "", chamadas: [chamada("processo_anotacao", { processos: ["1", "2"], texto: "revisar" })], fim: "tool_calls" })], vistos),
      tools,
      ui: u,
      privacidade: new Pseudonimos(),
      sei: seiFalso(log),
      sistema: () => "s",
    });
    await m.enviar("anote");
    checar("um plano com previa dos dois processos", u.planos.length === 1 && u.planos[0].passos[0].previa.length === 2);
    checar("previa nao grava", log.every((l) => l.args.aplicar === false));
    checar("motivo da recusa chega ao modelo", JSON.stringify(vistos[1]).includes("use outro texto"));
  }

  secao("motor: plano com referencia e reidratacao");
  {
    const log: Array<{ op: string; args: Record<string, unknown> }> = [];
    const priv = new Pseudonimos();
    priv.registrarPessoas(["Maria Aparecida Souza"]);
    priv.anonimizar("Maria Aparecida Souza"); // cria [PESSOA_1]
    const m = new Motor({
      provedor: provedor(
        [
          () => ({
            texto: "",
            chamadas: [
              chamada("plano_propor", {
                objetivo: "criar e anotar",
                passos: [
                  { tool: "documento_criar", args: { itens: [{ processo: "1", tipo: "Despacho", conteudo_html: "<p>Notifique [PESSOA_1].</p>" }] } },
                  { tool: "processo_anotacao", args: { processos: ["1"], texto: "Despacho {$1.itens.0.numero} criado" } },
                ],
              }),
            ],
            fim: "tool_calls",
          }),
        ],
        [],
      ),
      tools,
      ui: ui({ aprovado: true }),
      privacidade: priv,
      sei: seiFalso(log),
      sistema: () => "s",
    });
    await m.enviar("faça");
    const editar = log.find((l) => l.op === "documento.editar");
    checar("conteudo reidratado ao gravar", String(editar?.args.html).includes("Maria Aparecida Souza"), editar?.args);
    const anot = log.find((l) => l.op === "processo.anotacao" && l.args.aplicar === true);
    checar("referencia ao passo anterior resolvida", anot?.args.texto === "Despacho 0200001 criado", anot?.args);
  }

  secao("motor: argumentos invalidos e sigilo");
  {
    const vistos: Mensagem[][] = [];
    const m = new Motor({
      provedor: provedor([() => ({ texto: "", chamadas: [chamada("processo_anotacao", { texto: "x" })], fim: "tool_calls" })], vistos),
      tools,
      ui: ui(),
      privacidade: new Pseudonimos(),
      sei: seiFalso([]),
      sistema: () => "s",
    });
    await m.enviar("anote");
    checar("erro de argumento volta ao modelo", JSON.stringify(vistos[1]).includes("processos: obrigat"));
    const u = ui();
    let chamouModelo = false;
    const m2 = new Motor({
      provedor: { modelo: "x", conversar: async () => ((chamouModelo = true), { texto: "", chamadas: [], fim: "stop" }) },
      tools,
      ui: u,
      privacidade: new Pseudonimos(),
      sei: seiFalso([]),
      sistema: () => "s",
      tela: async () => ({ sigiloso: true }),
    });
    await m2.enviar("resuma");
    checar("processo sigiloso na tela: nada vai ao modelo", !chamouModelo && u.avisos.some((a) => a.includes("sigiloso")));
  }

  secao("motor: assinatura sem senha no modelo");
  {
    const vistos: Mensagem[][] = [];
    const log: Array<{ op: string; args: Record<string, unknown> }> = [];
    const u = ui({ aprovado: true, assinatura: { cargo: "Chefe", senha: "s3nh4-secreta" } });
    const m = new Motor({
      provedor: provedor([() => ({ texto: "", chamadas: [chamada("documento_assinar", { documentos: ["0104044"] })], fim: "tool_calls" })], vistos),
      tools,
      ui: u,
      privacidade: new Pseudonimos(),
      sei: seiFalso(log),
      sistema: () => "s",
    });
    await m.enviar("assine");
    checar("cargos do SEI chegam ao cartao", JSON.stringify(u.planos[0].passos[0].previa[0].cargos) === '["Analista","Chefe"]');
    const exec = log.find((l) => l.op === "documento.assinar" && l.args.aplicar === true);
    checar("senha chega a operacao na aba", exec?.args.senha === "s3nh4-secreta" && exec?.args.cargo === "Chefe");
    checar("senha nunca vai ao modelo", !JSON.stringify(vistos).includes("s3nh4-secreta"));
  }

  secao("motor: plano sem mudanca nao pede aprovacao");
  {
    const u = ui({ aprovado: true });
    const m = new Motor({
      provedor: provedor([() => ({ texto: "", chamadas: [chamada("processo_anotacao", { processos: ["1"], texto: "" })], fim: "tool_calls" })], []),
      tools,
      ui: u,
      privacidade: new Pseudonimos(),
      sei: async (op, args) => (op === "processo.anotacao" ? { alvo: "1", mudancas: [], resumo: "Nada a alterar", aplicado: false } : seiFalso([])(op, args)),
      sistema: () => "s",
    });
    await m.enviar("tire a anotacao");
    checar("sem cartao quando nada muda", u.planos.length === 0);
  }

  secao("delegar: agente auxiliar");
  const delegarTool = [...TOOLS_MOTOR].find((t) => t.nome === "delegar")!;
  checar("e interna: nao escreve no SEI", delegarTool.efeito === "interna");
  const pedidas: string[] = [];
  const ctxComAuxiliar = {
    sinal: new AbortController().signal,
    delegar: async (t: string) => {
      pedidas.push(t);
      return `resposta de ${t}`;
    },
  } as never;
  const r1 = (await delegarTool.executar({ tarefas: ["ler A", "ler B"] }, ctxComAuxiliar)) as { respostas: Array<{ tarefa: string; resultado?: string; erro?: string }> };
  checar("uma resposta por tarefa", r1.respostas.length === 2 && r1.respostas[1].resultado === "resposta de ler B", r1);
  checar("as tarefas vao como escritas", pedidas.join("|") === "ler A|ler B");
  const r2 = (await delegarTool.executar({ tarefas: ["a", "b", "c", "d", "e"] }, ctxComAuxiliar)) as { respostas: unknown[] };
  checar("no maximo 3 por vez", r2.respostas.length === 3);
  const semAuxiliar = (await delegarTool.executar({ tarefas: ["x"] }, { sinal: new AbortController().signal } as never)) as { erro?: string };
  checar("sem auxiliar disponivel, avisa em vez de quebrar", Boolean(semAuxiliar.erro));
  const comFalha = (await delegarTool.executar({ tarefas: ["x"] }, {
    sinal: new AbortController().signal,
    delegar: async () => {
      throw new Error("o auxiliar caiu");
    },
  } as never)) as { respostas: Array<{ erro?: string }> };
  checar("falha do auxiliar volta como erro daquela tarefa", comFalha.respostas[0].erro === "o auxiliar caiu");

  secao("tools: contrato");
  checar("toda escrita tem previa", tools.todas().every((t) => t.efeito === "leitura" || t.efeito === "interna" || typeof t.previsualizar === "function"));
  checar("todo esquema e objeto", tools.todas().every((t) => t.parametros.type === "object"));
  checar("descricoes longas o bastante", tools.todas().every((t) => t.descricao.length > 60), tools.todas().filter((t) => t.descricao.length <= 60).map((t) => t.nome));
}
