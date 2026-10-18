/**
 * Etapa 4, Verificação (só no destino "processo indicado em uma coluna", spec §5): antes de gravar, cada processo
 * DISTINTO da coluna é consultado uma vez na aba (RPC `verificar`: existe, não é sigiloso, está aberto na unidade e
 * aceita o tipo do modelo). A tela lista cada processo com quantas linhas dependem dele e o status em TEXTO; nos
 * problemáticos, "Abrir em nova aba" (o usuário recebe ou reabre o processo) e "Verificar de novo".
 *
 * O usuário pode gravar só as linhas prontas (decisão do autor): o Continuar diz quantas serão gravadas e quantas
 * ficam de fora. As de fora (processo com problema ou linha com erro na planilha) entram no lote como "fora" e podem
 * ser reverificadas e gravadas depois, no mesmo lote (`situacoesIniciais`).
 *
 * As consultas vão pelo `ExecutorLote` do sei-comum, uma por vez com pausa curta; fechar a tela cancela as que
 * faltam e cada número tem a sua geração (resposta atrasada não vale). Nada aqui lança: falha da ponte (prazo,
 * aba fechada) vira "erro de rede" na linha. O app nunca vê o link da árvore (traz o infra_hash).
 */

import { ExecutorLote, type ItemLote } from "@comum/lote/executor";
import { h, icone } from "@comum/ui/dom";
import { agruparPorProcesso, type LinhaDocumento, prepararLinhas } from "../modelo/destinos";
import type { SituacaoLinha, VerificacaoGuardada } from "../repositorio";
import type { StatusProcesso } from "../sei/verificar";
import { chaveVerificacao, type DepsEtapa, type EstadoApp, limparVerificacao, mensagemDe, type TelaEtapa, verificacaoVale } from "./estado";

/** Pausa entre duas consultas (curta: cada uma já lê três páginas do SEI). */
export const PAUSA_VERIFICACAO_MS = 200;
/** Prazo de uma consulta pela ponte: pesquisa, árvore e a tela de escolher o tipo. */
const PRAZO_VERIFICAR_MS = 60_000;
const PRAZO_ABRIR_MS = 15_000;

/** O status de cada processo em texto (a cor só reforça). */
export const ROTULO_STATUS: Record<StatusProcesso, string> = {
  ok: "Ok",
  "nao-encontrado": "Não encontrado ou sem acesso",
  sigiloso: "Sigiloso",
  "nao-aberto": "Não aberto na unidade",
  "tipo-indisponivel": "Tipo indisponível",
  "erro-rede": "Erro de rede",
};

const STATUS = new Set<string>(Object.keys(ROTULO_STATUS));

export interface OpcoesVerificacao {
  /** Injetável para as provas não dormirem a pausa de verdade. */
  esperar?(ms: number): Promise<void>;
  /**
   * A primeira consulta já vai com `deNovo` (a aba esquece o que guardou do processo). É o "Gravar as que ficaram
   * de fora" do resultado (Tarefa 14b), que reverifica processos consultados numa passagem anterior.
   */
  deNovo?: boolean;
}

/** A linha está pronta para gravar: sem erro na planilha e com o processo verificado "ok". */
function linhaPronta(l: LinhaDocumento, verificacoes: Record<string, VerificacaoGuardada>): boolean {
  return !l.erroLinha && l.destino !== undefined && verificacoes[l.destino]?.status === "ok";
}

/**
 * Situação inicial de cada linha no lote (na ordem de `estado.linhas`): "pendente" para as prontas, "fora" para as
 * demais. A Tarefa 14 cria o lote com isto.
 */
export function situacoesIniciais(estado: EstadoApp): SituacaoLinha[] {
  // Resultado de outra config, outro destino ou outra planilha não vale (seria gravar com "prontas" velhas).
  if (!verificacaoVale(estado)) return [];
  const prontas = new Set(estado.prontas ?? []);
  return (estado.linhas ?? []).map((l) => (prontas.has(l.indice) ? "pendente" : "fora"));
}

const plural = (n: number, um: string, varios: string) => (n === 1 ? um : varios.replace("#", String(n)));

/** Só o que o lote pode guardar: nunca `linkArvore` nem outro campo que a aba mande. */
function guardavel(numero: string, r: unknown): VerificacaoGuardada {
  const o = r && typeof r === "object" ? (r as Record<string, unknown>) : null;
  if (!o || typeof o.status !== "string" || !STATUS.has(o.status)) {
    return { numero, status: "erro-rede", mensagem: "A aba do SEI deu uma resposta inesperada. Tente de novo." };
  }
  const g: VerificacaoGuardada = { numero, status: o.status as StatusProcesso };
  if (typeof o.idProcedimento === "string" && o.idProcedimento) g.idProcedimento = o.idProcedimento;
  if (typeof o.mensagem === "string" && o.mensagem) g.mensagem = o.mensagem;
  return g;
}

export class TelaVerificacao implements TelaEtapa {
  readonly el: HTMLElement;
  private readonly resumo: HTMLElement;
  private readonly carregando: HTMLElement;
  private readonly erro: HTMLElement;
  private readonly todos: HTMLButtonElement;
  private readonly corpo: HTMLElement;
  private readonly secaoProblema: HTMLElement;
  private readonly corpoProblema: HTMLElement;
  /** Processo → índices das linhas que dependem dele (sem as com erro na planilha). */
  private grupos = new Map<string, number[]>();
  /** Processos na fila ou em consulta. */
  private readonly emCurso = new Set<string>();
  /** Geração por processo: só a resposta da consulta mais nova vale. */
  private readonly geracao = new Map<string, number>();
  /** Falha do "Abrir em nova aba", por processo. */
  private readonly avisoAbrir = new Map<string, string>();
  private executor: ExecutorLote<string, undefined> | null = null;
  private destruida = false;

  constructor(
    private readonly d: DepsEtapa,
    private readonly o: OpcoesVerificacao = {},
  ) {
    const coluna = d.estado.config?.destino.tipo === "coluna" ? d.estado.config.destino.coluna : "";
    this.resumo = h("strong", { class: "dl-resumo-verificacao", "aria-live": "polite" });
    this.todos = h(
      "button",
      { type: "button", class: "spro-botao", onclick: () => this.verificarProblematicosDeNovo() },
      icone("atualizar", 16),
      // Ruling 22: só os com problema são consultados de novo (os "Ok" a gravação relê antes de cada documento).
      "Verificar de novo os com problema",
    );
    this.carregando = h("small", { class: "dl-carregando", "aria-live": "polite", hidden: true });
    this.erro = h("p", { class: "dl-erro", role: "alert", hidden: true });
    this.corpo = h("tbody", {});
    this.corpoProblema = h("tbody", {});
    this.secaoProblema = h(
      "section",
      { class: "dl-linhas-problema", hidden: true },
      h("h3", {}, "Linhas com problema na planilha"),
      h("p", { class: "dl-nota" }, "Estas linhas não são gravadas. Corrija a planilha e leia o arquivo de novo, se precisar delas."),
      h(
        "div",
        { class: "dl-tabela" },
        h(
          "table",
          { class: "spro-resultado" },
          h("thead", {}, h("tr", {}, h("th", {}, "Linha"), h("th", {}, "Motivo"))),
          this.corpoProblema,
        ),
      ),
    );
    this.el = h(
      "section",
      { class: "dl-etapa dl-verificacao" },
      h(
        "p",
        { class: "dl-nota" },
        `Cada processo da coluna "${coluna}" é consultado uma vez antes de gravar. Para um processo que não está aberto nesta unidade, abra-o em nova aba, receba ou reabra o processo e clique em Verificar de novo.`,
      ),
      h("div", { class: "dl-acoes" }, this.resumo, h("span", { class: "dl-espaco" }), this.todos),
      this.carregando,
      this.erro,
      h(
        "div",
        { class: "dl-tabela" },
        h(
          "table",
          { class: "spro-resultado dl-tabela-verificacao" },
          h("thead", {}, h("tr", {}, h("th", {}, "Processo"), h("th", {}, "Linhas"), h("th", {}, "Situação"), h("th", {}, "Ações"))),
          this.corpo,
        ),
      ),
      this.secaoProblema,
    );
    this.preparar();
    this.desenhar();
  }

  completa(): boolean {
    return this.emCurso.size === 0 && (this.d.estado.prontas?.length ?? 0) > 0;
  }

  rotuloAvancar(): string {
    const { prontas, fora } = this.contagem();
    if (prontas === 0) return "Nenhuma linha para gravar";
    const gravar = `Gravar ${plural(prontas, "1 linha", "# linhas")}`;
    return fora === 0 ? gravar : `${gravar} (${plural(fora, "1 fica de fora", "# ficam de fora")})`;
  }

  async iniciar(): Promise<void> {
    const v = this.d.estado.verificacoes ?? {};
    const faltam = [...this.grupos.keys()].filter((n) => !v[n]);
    if (faltam.length) await this.consultar(faltam, this.o.deNovo === true);
  }

  destruir(): void {
    this.destruida = true;
    this.executor?.cancelar();
    this.executor = null;
  }

  /* ------------------------------------------------------------ estado */

  /** Prepara as linhas da config atual; reaproveita as verificações se a planilha e a coluna são as mesmas. */
  private preparar(): void {
    const e = this.d.estado;
    const cfg = e.config;
    const registros = e.registros ?? [];
    if (cfg?.destino.tipo !== "coluna") {
      this.limparEstado();
      this.mostrarErro("Escolha a coluna do processo de destino na etapa anterior.");
      return;
    }
    const chave = chaveVerificacao(cfg);
    const mesma = verificacaoVale(e);
    if (!mesma) {
      try {
        e.linhas = prepararLinhas(registros, cfg);
      } catch (erro) {
        this.limparEstado();
        this.mostrarErro(mensagemDe(erro));
        return;
      }
      e.verificacoes = {};
      e.baseVerificacao = { registros, chave };
    }
    this.grupos = agruparPorProcesso(e.linhas ?? []);
    this.recalcular();
  }

  private limparEstado(): void {
    limparVerificacao(this.d.estado);
  }

  /** Refaz `estado.prontas` (só existe terminada a verificação e com ao menos uma pronta). */
  private recalcular(): void {
    const e = this.d.estado;
    const v = e.verificacoes ?? {};
    const prontas = (e.linhas ?? []).filter((l) => linhaPronta(l, v)).map((l) => l.indice);
    e.prontas = this.emCurso.size === 0 && prontas.length > 0 ? prontas : undefined;
  }

  private contagem(): { prontas: number; fora: number; aguardando: number } {
    const e = this.d.estado;
    const v = e.verificacoes ?? {};
    let prontas = 0;
    let aguardando = 0;
    for (const l of e.linhas ?? []) {
      if (linhaPronta(l, v)) prontas += 1;
      else if (!l.erroLinha && l.destino !== undefined && (this.emCurso.has(l.destino) || !v[l.destino])) aguardando += 1;
    }
    return { prontas, fora: (e.linhas?.length ?? 0) - prontas - aguardando, aguardando };
  }

  /* ------------------------------------------------------------ consultas */

  /** Consulta os processos pelo executor (um por vez, pausa curta). Resolve ao terminar ou ao fechar a tela. */
  private async consultar(numeros: string[], deNovo: boolean): Promise<void> {
    for (const n of numeros) this.marcarEmCurso(n);
    const itens: ItemLote<string, undefined>[] = numeros.map((entrada, indice) => ({
      indice,
      entrada,
      situacao: "pendente",
      tentativas: 0,
    }));
    const executor = new ExecutorLote<string, undefined>(itens, {
      concorrencia: 1,
      pausaMs: () => PAUSA_VERIFICACAO_MS,
      esperar: this.o.esperar,
      processar: async (numero) => {
        await this.consultarUm(numero, deNovo);
        return { situacao: "ok" };
      },
    });
    this.executor = executor;
    this.atualizar();
    await executor.iniciar();
    if (this.destruida || this.executor !== executor) return;
    this.executor = null;
    this.atualizar();
  }

  private marcarEmCurso(numero: string): void {
    this.emCurso.add(numero);
    this.geracao.set(numero, (this.geracao.get(numero) ?? 0) + 1);
    this.avisoAbrir.delete(numero);
    if (this.d.estado.verificacoes) delete this.d.estado.verificacoes[numero];
  }

  /** Uma consulta; nunca lança. A resposta só vale se a tela vive e se é a consulta mais nova deste número. */
  private async consultarUm(numero: string, deNovo: boolean): Promise<void> {
    const g = this.geracao.get(numero);
    const tipoId = this.d.estado.config?.modelo.tipoId ?? "";
    const args: { numero: string; tipoId: string; deNovo?: true } = { numero, tipoId };
    if (deNovo) args.deNovo = true;
    let r: VerificacaoGuardada;
    try {
      r = guardavel(numero, await this.d.rpc.chamar<unknown>("verificar", args, PRAZO_VERIFICAR_MS));
    } catch (e) {
      r = { numero, status: "erro-rede", mensagem: mensagemDe(e) || "A aba do SEI não respondeu." };
    }
    if (this.destruida || this.geracao.get(numero) !== g) return;
    this.d.estado.verificacoes ??= {};
    this.d.estado.verificacoes[numero] = r;
    this.emCurso.delete(numero);
    this.atualizar();
  }

  private verificarProblematicosDeNovo(): void {
    if (this.executor) return;
    const v = this.d.estado.verificacoes ?? {};
    const problematicos = [...this.grupos.keys()].filter((n) => !this.emCurso.has(n) && v[n] && v[n].status !== "ok");
    if (problematicos.length) void this.consultar(problematicos, true);
  }

  private verificarDeNovo(numero: string): void {
    // Uma consulta por vez à aba: durante uma rodada do executor o botão fica desabilitado.
    if (this.executor || this.emCurso.has(numero)) return;
    this.marcarEmCurso(numero);
    this.atualizar();
    void this.consultarUm(numero, true);
  }

  private async abrir(numero: string): Promise<void> {
    let erro = "";
    try {
      const r = await this.d.rpc.chamar<{ aberto?: boolean; erro?: string } | null>("abrirAba", { numero }, PRAZO_ABRIR_MS);
      if (!r?.aberto) erro = r?.erro || "Não foi possível abrir o processo em nova aba.";
    } catch (e) {
      erro = mensagemDe(e) || "Não foi possível abrir o processo em nova aba.";
    }
    if (this.destruida) return;
    if (erro) this.avisoAbrir.set(numero, erro);
    else this.avisoAbrir.delete(numero);
    this.desenhar();
  }

  /* ------------------------------------------------------------ desenho */

  private atualizar(): void {
    if (this.destruida) return;
    this.recalcular();
    this.desenhar();
    this.d.aoMudar();
  }

  private mostrarErro(texto: string): void {
    this.erro.replaceChildren(icone("alerta", 16), h("span", {}, texto));
    this.erro.hidden = false;
  }

  private desenhar(): void {
    const e = this.d.estado;
    const v = e.verificacoes ?? {};
    const { prontas, fora, aguardando } = this.contagem();
    const partes = [
      prontas === 0 ? "Nenhuma linha pronta" : plural(prontas, "1 linha pronta", "# linhas prontas"),
      fora === 0 ? "nenhuma fica de fora" : plural(fora, "1 fica de fora", "# ficam de fora"),
    ];
    if (aguardando) partes.push(plural(aguardando, "1 aguarda a verificação", "# aguardam a verificação"));
    this.resumo.textContent = e.linhas ? `${partes.join(", ")}.` : "";

    const total = this.grupos.size;
    const feitos = [...this.grupos.keys()].filter((n) => !this.emCurso.has(n) && v[n]).length;
    this.carregando.hidden = this.emCurso.size === 0;
    this.carregando.textContent = `Verificando os processos: ${feitos} de ${total}...`;
    const temProblema = [...this.grupos.keys()].some((n) => v[n] && v[n].status !== "ok" && !this.emCurso.has(n));
    this.todos.disabled = !!this.executor || !temProblema;

    this.corpo.replaceChildren(...[...this.grupos].map(([numero, indices]) => this.linhaProcesso(numero, indices.length, v[numero])));
    if (!this.grupos.size && e.linhas) {
      this.corpo.replaceChildren(h("tr", {}, h("td", { colspan: "4", class: "dl-nota" }, "Nenhum processo válido na coluna.")));
    }

    const problemas = (e.linhas ?? []).filter((l) => l.erroLinha);
    this.secaoProblema.hidden = problemas.length === 0;
    this.corpoProblema.replaceChildren(
      ...problemas.map((l) => h("tr", {}, h("td", {}, String(l.indice + 2)), h("td", {}, l.erroLinha ?? ""))),
    );
  }

  private linhaProcesso(numero: string, linhas: number, r: VerificacaoGuardada | undefined): HTMLElement {
    const consultando = this.emCurso.has(numero) || !r;
    const status = consultando ? "verificando" : r.status;
    const situacao = h(
      "td",
      {},
      h("strong", {}, consultando ? "Verificando..." : ROTULO_STATUS[r.status]),
      // Uma linha só, com reticências (a linha da tabela não muda de altura): o texto inteiro no title.
      !consultando && r.mensagem && r.status !== "ok" ? h("small", { class: "dl-dica", title: r.mensagem }, ` ${r.mensagem}`) : null,
      this.avisoAbrir.has(numero) ? h("small", { class: "dl-erro-abrir" }, ` ${this.avisoAbrir.get(numero)}`) : null,
    );
    // D5: a célula fica célula de tabela (flex na `td` desalinhava as divisórias); o flex é do contêiner de dentro.
    const botoes = h("div", { class: "dl-acoes-linha-botoes" });
    const acoes = h("td", { class: "dl-acoes-linha" }, botoes);
    if (!consultando && r.status !== "ok") {
      if (r.idProcedimento) {
        botoes.append(
          h(
            "button",
            { type: "button", class: "spro-botao pequeno", onclick: () => void this.abrir(numero) },
            icone("saida", 14),
            "Abrir em nova aba",
          ),
        );
      }
      botoes.append(
        h(
          "button",
          {
            type: "button",
            class: "spro-botao pequeno",
            // Durante uma rodada (inicial ou "Verificar de novo os com problema") não sai consulta concorrente à aba.
            disabled: !!this.executor,
            title: this.executor ? "Aguarde terminar a verificação em curso." : undefined,
            onclick: () => this.verificarDeNovo(numero),
          },
          icone("atualizar", 14),
          "Verificar de novo",
        ),
      );
    }
    return h(
      "tr",
      { class: `dl-status-${status}`, "data-numero": numero },
      // O número não quebra (e, se não couber na coluna, o inteiro fica no title).
      h("td", { class: "dl-processo", title: numero }, numero),
      h("td", {}, String(linhas)),
      situacao,
      acoes,
    );
  }
}
