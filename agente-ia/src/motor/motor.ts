/**
 * Motor do agente: o laço modelo → tools → modelo.
 *
 * AS TRÊS FRONTEIRAS que este arquivo guarda:
 *
 * 1. Saída para o modelo. Toda mensagem do usuário e todo resultado de tool
 *    passa por `privacidade.anonimizar` antes de entrar no histórico. O
 *    histórico enviado ao provedor nunca contém dado pessoal em claro.
 * 2. Entrada do modelo. Argumentos de tool são validados contra o esquema e
 *    reidratados (`[PESSOA_1]` → nome real) só no momento de executar.
 * 3. Escrita no SEI. Nenhuma tool de escrita executa fora de um plano
 *    aprovado pelo usuário. As escritas de uma mesma rodada viram UM plano
 *    (uma aprovação para 50 documentos, não 50), e o plano aprovado executa
 *    de forma determinística, sem voltar ao modelo entre os passos — o
 *    modelo não tem como "desviar" do que o usuário aprovou.
 */

import type { Pseudonimos } from "@nucleo/privacidade/anonimizar";
import { validar } from "./esquema";
import type { ContextoTool, DefTool, EstadoConversa, RegistroTools } from "./tools";
import type {
  ChamadaTool,
  DecisaoPlano,
  InterfaceMotor,
  Mensagem,
  PassoPlano,
  PlanoPrevisto,
  PreviaItem,
  Provedor,
  Uso,
} from "./tipos";

export interface OpcoesMotor {
  provedor: Provedor;
  tools: RegistroTools;
  ui: InterfaceMotor;
  privacidade: Pseudonimos;
  /** Operação na aba do SEI (a ponte). */
  sei: (op: string, args: Record<string, unknown>, sinal: AbortSignal) => Promise<unknown>;
  /** Monta o prompt de sistema (recebe o resumo da tela atual). */
  sistema: (tela: TelaAtual | null) => string;
  /** Lê a tela atual da aba do SEI. */
  tela?: (sinal: AbortSignal) => Promise<TelaAtual | null>;
  limitePassos?: number;
  /** Tamanho máximo de um resultado de tool enviado ao modelo. */
  limiteResultado?: number;
}

export interface TelaAtual {
  /** `acao` do controlador: que tela do SEI está aberta (procedimento_controlar, protocolo_pesquisar...). */
  acao?: string;
  unidade?: string;
  usuario?: string;
  versao?: string;
  processo?: { protocolo: string; tipo?: string; nivel?: string };
  documento?: { numero: string; titulo?: string };
  selecionados?: string[];
  /** Documentos abertos em janelas do editor. */
  editores?: string[];
  sigiloso?: boolean;
}

const LIMITE_HISTORICO = 400_000; // caracteres (~100 mil tokens)

export class ErroMotor extends Error {}

export class Motor {
  private historico: Mensagem[] = [];
  private controlador: AbortController | null = null;
  private usoTotal: Uso = { entrada: 0, saida: 0, custo: 0 };
  readonly estado: EstadoConversa = { consentimentoRestrito: null, anexos: [] };

  constructor(private readonly o: OpcoesMotor) {}

  get ocupado(): boolean {
    return this.controlador !== null;
  }

  mensagens(): readonly Mensagem[] {
    return this.historico;
  }

  /** Recomeça a conversa (o mapa de pseudônimos é do painel e é trocado junto). */
  limpar(): void {
    this.historico = [];
    this.usoTotal = { entrada: 0, saida: 0, custo: 0 };
    this.estado.consentimentoRestrito = null;
    this.estado.anexos = [];
  }

  restaurar(historico: Mensagem[], uso?: Uso): void {
    this.historico = historico;
    if (uso) this.usoTotal = uso;
  }

  parar(): void {
    this.controlador?.abort();
  }

  async enviar(texto: string): Promise<void> {
    if (this.controlador) throw new ErroMotor("O agente ainda est\u00E1 trabalhando no pedido anterior.");
    const controlador = (this.controlador = new AbortController());
    const sinal = controlador.signal;
    try {
      const tela = this.o.tela ? await this.o.tela(sinal).catch(() => null) : null;
      if (tela?.sigiloso) {
        this.o.ui.aviso("Este processo \u00E9 sigiloso. O agente n\u00E3o atua em processos sigilosos.");
        return;
      }
      this.historico.push({ role: "user", content: this.o.privacidade.anonimizar(texto) });
      const limite = this.o.limitePassos ?? 40;
      for (let passo = 0; passo < limite; passo += 1) {
        const resposta = await this.o.provedor.conversar(
          { mensagens: [{ role: "system", content: this.o.sistema(tela) }, ...this.compactado()], tools: this.o.tools.paraProvedor() },
          sinal,
          (d) => this.o.ui.texto(d),
        );
        if (resposta.uso) {
          this.usoTotal = {
            entrada: this.usoTotal.entrada + resposta.uso.entrada,
            saida: this.usoTotal.saida + resposta.uso.saida,
            custo: this.usoTotal.custo + resposta.uso.custo,
          };
          this.o.ui.uso(this.usoTotal);
        }
        this.historico.push({ role: "assistant", content: resposta.texto || null, ...(resposta.chamadas.length ? { tool_calls: resposta.chamadas } : {}) });
        if (!resposta.chamadas.length) {
          if (resposta.fim === "length") this.o.ui.aviso("A resposta foi cortada pelo limite do modelo.");
          return;
        }
        const resultados = await this.executarChamadas(resposta.chamadas, sinal);
        for (const c of resposta.chamadas) this.historico.push({ role: "tool", tool_call_id: c.id, content: resultados.get(c.id) ?? "{}" });
      }
      this.o.ui.aviso(`O agente parou ap\u00F3s ${limite} rodadas de ferramentas. Pe\u00E7a para continuar, se for o caso.`);
    } catch (e) {
      if (sinal.aborted) this.o.ui.aviso("Interrompido.");
      else throw e;
    } finally {
      this.controlador = null;
      this.o.ui.fimDaResposta();
    }
  }

  /** Resultado de tool → texto seguro para o modelo. */
  private paraModelo(valor: unknown): string {
    let t = typeof valor === "string" ? valor : JSON.stringify(valor);
    t = this.o.privacidade.anonimizar(t ?? "");
    const limite = this.o.limiteResultado ?? 12_000;
    if (t.length > limite) t = `${t.slice(0, limite)}\n[... resultado cortado: ${t.length - limite} caracteres omitidos. Pe\u00E7a um trecho menor ou use os par\u00E2metros de pagina\u00E7\u00E3o da ferramenta.]`;
    return t;
  }

  private contexto(sinal: AbortSignal, extra: Partial<ContextoTool> = {}): ContextoTool {
    return {
      sinal,
      sei: <T>(op: string, args: Record<string, unknown> = {}) => this.o.sei(op, args, sinal) as Promise<T>,
      estado: this.estado,
      consentirRestrito: async (detalhe) => {
        if (this.estado.consentimentoRestrito === null) this.estado.consentimentoRestrito = await this.o.ui.consentir("restrito", detalhe);
        return this.estado.consentimentoRestrito;
      },
      pessoasVistas: (nomes) => this.o.privacidade.registrarPessoas(nomes),
      ui: this.o.ui,
      ...extra,
    };
  }

  private async executarChamadas(chamadas: ChamadaTool[], sinal: AbortSignal): Promise<Map<string, string>> {
    const saida = new Map<string, string>();
    const leituras: Array<{ c: ChamadaTool; t: DefTool; args: Record<string, unknown> }> = [];
    const escritas: Array<{ c: ChamadaTool; passos: PassoPlano[]; objetivo?: string }> = [];

    for (const c of chamadas) {
      const t = this.o.tools.obter(c.function.name);
      if (!t) {
        saida.set(c.id, this.paraModelo({ erro: `Ferramenta "${c.function.name}" n\u00E3o existe.` }));
        continue;
      }
      let bruto: unknown;
      try {
        bruto = JSON.parse(c.function.arguments || "{}");
      } catch {
        saida.set(c.id, this.paraModelo({ erro: "Argumentos n\u00E3o s\u00E3o JSON v\u00E1lido." }));
        continue;
      }
      const { valor, erros } = validar(t.parametros, bruto);
      if (erros.length) {
        saida.set(c.id, this.paraModelo({ erro: "Argumentos inv\u00E1lidos.", detalhes: erros }));
        continue;
      }
      const args = this.o.privacidade.reidratarValor(valor as Record<string, unknown>);
      if (t.nome === "plano_propor") {
        const r = this.passosDoPlano(args);
        if ("erro" in r) saida.set(c.id, this.paraModelo(r));
        else escritas.push({ c, passos: r.passos, objetivo: String(args.objetivo ?? "") });
      } else if (t.efeito === "leitura" || t.efeito === "interna") {
        leituras.push({ c, t, args });
      } else {
        escritas.push({ c, passos: [{ tool: t.nome, rotulo: t.rotulo(args), efeito: t.efeito, args, previa: [], dependente: false }] });
      }
    }

    // Leituras em paralelo; as internas (perguntar, tarefas) seguem a ordem.
    await Promise.all(
      leituras.map(async ({ c, t, args }) => {
        this.o.ui.toolIniciada(c.id, t.nome, t.rotulo(args));
        try {
          const r = await t.executar(args, this.contexto(sinal));
          saida.set(c.id, this.paraModelo(r));
          this.o.ui.toolTerminada(c.id, true, "");
        } catch (e) {
          saida.set(c.id, this.paraModelo(erroParaModelo(e)));
          this.o.ui.toolTerminada(c.id, false, erroParaModelo(e).erro);
        }
      }),
    );

    if (escritas.length) {
      const resultados = await this.executarPlano(escritas.flatMap((e) => e.passos), escritas.map((e) => e.objetivo).filter(Boolean).join("; "), sinal);
      let i = 0;
      for (const e of escritas) {
        const meus = resultados.slice(i, i + e.passos.length);
        i += e.passos.length;
        saida.set(e.c.id, this.paraModelo(e.passos.length === 1 && e.c.function.name !== "plano_propor" ? meus[0] : { passos: meus }));
      }
    }
    return saida;
  }

  /** Valida os passos de `plano_propor`. */
  private passosDoPlano(args: Record<string, unknown>): { passos: PassoPlano[] } | { erro: string; detalhes?: string[] } {
    const lista = (args.passos as Array<{ tool: string; args: Record<string, unknown> }>) ?? [];
    const passos: PassoPlano[] = [];
    const erros: string[] = [];
    lista.forEach((p, i) => {
      const t = this.o.tools.obter(p.tool);
      if (!t) return erros.push(`passo ${i + 1}: ferramenta "${p.tool}" n\u00E3o existe`);
      if (t.efeito === "leitura" || t.efeito === "interna") return erros.push(`passo ${i + 1}: "${p.tool}" n\u00E3o \u00E9 escrita; chame-a diretamente`);
      const dependente = JSON.stringify(p.args ?? {}).includes("$");
      const { valor, erros: e } = dependente ? { valor: p.args, erros: [] } : validar(t.parametros, p.args ?? {});
      if (e.length) return erros.push(...e.map((x) => `passo ${i + 1}: ${x}`));
      const a = valor as Record<string, unknown>;
      passos.push({ tool: t.nome, rotulo: dependente ? t.nome : t.rotulo(a), efeito: t.efeito, args: a, previa: [], dependente });
    });
    return erros.length ? { erro: "Plano inv\u00E1lido.", detalhes: erros } : { passos };
  }

  private async executarPlano(passos: PassoPlano[], objetivo: string, sinal: AbortSignal): Promise<unknown[]> {
    // Prévia de cada passo independente (em paralelo; é leitura).
    await Promise.all(
      passos.map(async (p) => {
        if (p.dependente) return;
        const t = this.o.tools.obter(p.tool)!;
        try {
          p.previa = (await t.previsualizar?.(p.args, this.contexto(sinal))) ?? [];
        } catch (e) {
          p.previa = [{ alvo: "", mudancas: [], resumo: "", erro: erroParaModelo(e).erro }];
        }
      }),
    );
    // Nada muda em nenhum item (ex.: documento já assinado, marcador já aplicado): não pede aprovação.
    if (passos.every((p) => !p.dependente && p.previa.length && p.previa.every((i) => !i.erro && !i.mudancas.length))) {
      return passos.map((p) => ({ executado: false, nada_a_fazer: true, itens: p.previa.map((i) => ({ alvo: i.alvo, resumo: i.resumo })) }));
    }
    const plano: PlanoPrevisto = { objetivo: objetivo || passos.map((p) => p.rotulo).join("; "), passos };
    const decisao: DecisaoPlano = await this.o.ui.aprovarPlano(plano);
    if (!decisao.aprovado) {
      return passos.map(() => ({ aprovado: false, motivo: decisao.motivo || "O usu\u00E1rio n\u00E3o aprovou o plano. Pergunte o que ajustar." }));
    }
    const ate = Math.min(decisao.ate ?? passos.length, passos.length);
    const resultados: unknown[] = [];
    for (let i = 0; i < passos.length; i += 1) {
      const p = passos[i];
      if (i >= ate) {
        resultados.push({ executado: false, motivo: "O usu\u00E1rio aprovou s\u00F3 os passos anteriores." });
        continue;
      }
      if (sinal.aborted) {
        resultados.push({ executado: false, motivo: "Interrompido pelo usu\u00E1rio." });
        continue;
      }
      const t = this.o.tools.obter(p.tool)!;
      this.o.ui.progressoPlano(i + 1, ate, p.rotulo);
      const id = `plano_${i}`;
      this.o.ui.toolIniciada(id, t.nome, p.rotulo);
      try {
        const args = resolverReferencias(p.args, resultados);
        if (p.dependente) {
          const { erros } = validar(t.parametros, args);
          if (erros.length) throw new Error(`Refer\u00EAncias n\u00E3o resolvidas: ${erros.join("; ")}`);
        }
        const r = await t.executar(args, this.contexto(sinal, p.efeito === "assinatura" ? { assinatura: decisao.assinatura } : {}));
        resultados.push(r);
        this.o.ui.toolTerminada(id, true, "");
      } catch (e) {
        const erro = erroParaModelo(e);
        resultados.push({ executado: false, ...erro });
        this.o.ui.toolTerminada(id, false, erro.erro);
        // Um passo que falha interrompe os seguintes: eles podiam depender dele.
        for (let j = i + 1; j < passos.length; j += 1) resultados.push({ executado: false, motivo: `Passo ${i + 1} falhou antes.` });
        break;
      }
    }
    return resultados;
  }

  /** Histórico enviado ao modelo, com resultados antigos resumidos quando o todo passa do limite. */
  private compactado(): Mensagem[] {
    let total = this.historico.reduce((n, m) => n + (typeof m.content === "string" ? m.content.length : 0), 0);
    if (total <= LIMITE_HISTORICO) return this.historico;
    const copia = this.historico.map((m) => ({ ...m })) as Mensagem[];
    for (let i = 0; i < copia.length - 8 && total > LIMITE_HISTORICO; i += 1) {
      const m = copia[i];
      if (m.role === "tool" && m.content.length > 400) {
        total -= m.content.length - 120;
        copia[i] = { ...m, content: `[resultado antigo omitido para caber no contexto: ${m.content.slice(0, 100)}...]` };
      }
    }
    return copia;
  }
}

/** Erro → objeto curto que o modelo entende (código + mensagem + dica). */
export function erroParaModelo(e: unknown): { erro: string; codigo?: string; detalhe?: string } {
  const x = e as { codigo?: string; message?: string; detalhe?: string };
  return { erro: x?.message ?? String(e), ...(x?.codigo ? { codigo: x.codigo } : {}), ...(x?.detalhe ? { detalhe: x.detalhe.slice(0, 800) } : {}) };
}

/** `"$2.dados.numero"` → valor; `"Despacho {$1.numero}"` → interpolação. Índices 1-based. */
export function resolverReferencias<T>(valor: T, resultados: unknown[]): T {
  const buscar = (ref: string): unknown => {
    const [idx, ...caminho] = ref.slice(1).split(".");
    let v: unknown = resultados[Number(idx) - 1];
    for (const k of caminho) v = v == null ? undefined : (v as Record<string, unknown>)[/^\d+$/.test(k) ? Number(k) : k];
    return v;
  };
  if (typeof valor === "string") {
    if (/^\$\d+(\.[\w-]+)*$/.test(valor)) return buscar(valor) as T;
    return valor.replace(/\{(\$\d+(?:\.[\w-]+)*)\}/g, (_, r: string) => String(buscar(r) ?? "")) as T;
  }
  if (Array.isArray(valor)) return valor.map((v) => resolverReferencias(v, resultados)) as T;
  if (valor && typeof valor === "object") {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, resolverReferencias(v, resultados)])) as T;
  }
  return valor;
}

export type { PreviaItem };
