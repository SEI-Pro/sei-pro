/**
 * O app das Ações em Lote (a janela dentro do iframe): estado compartilhado entre as telas e a troca delas.
 * Não toca o navegador direto (aba do SEI e fechar chegam por `DepsApp`), e por isso roda inteiro nos testes
 * com linkedom. Ao abrir, um lote parado neste processo é oferecido para retomar (retomada.ts); a execução e o
 * resultado moram em execucao.ts e resultado.ts. Minimizado, o app vira a pastilha de progresso.
 */

import { areaMemoria } from "@comum/armazenamento/area";
import type { Rpc } from "@comum/ponte/rpc";
import { baixar } from "@comum/ui/dialogo";
import { h, icone } from "@comum/ui/dom";
import type { AcaoId } from "../modelo/acoes";
import type { LinhaDoc } from "../modelo/documentos";
import type { LoteAcoes, ParamsEtapa, PlanoDoc } from "../modelo/fila";
import type { Filtro } from "../modelo/filtros";
import type { ContextoAcoes } from "../pagina/contexto";
import { RepositorioAcoes } from "../repositorio";
import { montarConfiguracao } from "./configuracao";
import { type ControleExecucao, type DepsExecucao, executarLote } from "./execucao";
import { montarPrevia } from "./previa";
import { type DepsResultado, montarResultado } from "./resultado";
import { loteParado, montarRetomada } from "./retomada";
import { montarSelecao } from "./selecao";
import { TelaExecucao } from "./telaExecucao";

export type Tela = "selecao" | "configuracao" | "previa" | "retomada" | "execucao" | "resultado";

/** O que o tratador `contexto` devolve: o da aba sem a base e o link da árvore (levam o infra_hash). */
export type ContextoApp = Omit<ContextoAcoes, "base" | "linkArvore">;

export interface EstadoApp {
  ctx: ContextoApp;
  protocolo: string;
  sigiloso: boolean;
  linhas: LinhaDoc[];
  /** Ids dos documentos marcados (inclui os que o filtro esconde agora). */
  selecionados: Set<string>;
  filtro: Filtro;
  etapas: ParamsEtapa[];
  planos: PlanoDoc[];
  /** A árvore não trouxe as datas: o filtro por período fica desligado. */
  datasIndisponiveis?: boolean;
  /** Último documento clicado, âncora da faixa por Shift. */
  ancora?: string | null;
}

export interface RespostaArvore {
  protocolo: string;
  sigiloso: boolean;
  linhas: LinhaDoc[];
  datasIndisponiveis?: boolean;
}

export function criarEstado(ctx: ContextoApp, a: RespostaArvore, anterior?: EstadoApp): EstadoApp {
  const e: EstadoApp = {
    ctx,
    protocolo: a.protocolo,
    sigiloso: a.sigiloso,
    linhas: a.linhas,
    selecionados: new Set(),
    filtro: anterior?.filtro ?? {},
    etapas: anterior?.etapas ?? [],
    planos: [],
  };
  if (a.datasIndisponiveis) e.datasIndisponiveis = true;
  // A seleção sobrevive à atualização, mas só com os documentos que ainda existem.
  if (anterior) for (const id of anterior.selecionados) if (a.linhas.some((l) => l.id === id)) e.selecionados.add(id);
  return e;
}

/** A etapa que uma ação nova ganha ao abrir a configuração: valores vazios, que a Task 8 pede ao usuário. */
export function etapaInicial(acao: AcaoId): ParamsEtapa {
  switch (acao) {
    case "baixar":
      return { acao, modo: "arquivos" };
    case "alterar-nivel":
      return { acao, nivel: "restrito" };
    case "assinar":
      return { acao, cargo: "" };
    case "cancelar-documento":
      return { acao, motivo: "" };
    case "incluir-bloco":
      return { acao, bloco: { novo: "" } };
    case "alterar-dados":
      return { acao };
    case "mover":
      return { acao, destino: { protocolo: "", idProcedimento: "", tipo: "" }, motivo: "" };
    case "ciencia":
    case "excluir":
    case "cancelar-assinatura":
    case "duplicar":
    case "pdf":
      return { acao };
  }
}

export interface DepsApp {
  /** `arvore`, mais as operações das telas seguintes. */
  rpc: Pick<Rpc, "chamar">;
  ctx: ContextoApp;
  fechar(): void;
  /**
   * Confirmação de ação destrutiva (modal com Confirmar). Sem ela, a execução nunca é confirmada. O botão de
   * desistir é sempre "Voltar": "Cancelar" seria ambíguo com "Cancelar a assinatura/o documento".
   */
  confirmar?(texto: string, rotuloOk?: string, rotuloDesistir?: string): Promise<boolean>;
  /** Lote em andamento (chrome.storage.local). Sem ele, um repositório em memória (nada sobrevive ao fechar). */
  repo?: RepositorioAcoes;
  /** Id da aba do SEI (para o aviso de outra aba); sem ele, o do contexto; sem os dois, um por instância. */
  aba?: string;
  /** A ponte caiu (modal fechado, aba navegada): o lote para de disparar. */
  aoFechar?(cb: () => void): void;
  agora?(): number;
  esperar?(ms: number): Promise<void>;
  /** Copiar e CSV do resultado; trocáveis nas provas. */
  baixar?(nome: string, conteudo: string, tipo: string): void;
  clip?: DepsResultado["clip"];
  ItemClip?: typeof ClipboardItem;
  avisar?(texto: string): void;
}

const novaAba = (): string => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

/** Prazo da leitura da árvore do processo (a árvore completa e o histórico); as demais chamadas usam o padrão de 15 s. */
const PRAZO_ARVORE_MS = 120_000;
const mensagem = (e: unknown): string => (e instanceof Error ? e.message : String(e));

export class AppAcoesLote {
  tela: Tela = "selecao";
  estado: EstadoApp | null = null;
  /** Só na memória: vai da configuração à execução e nunca entra em EstadoApp, no lote nem em storage. */
  private senha: string | undefined;
  private readonly conteudo: HTMLElement;
  private readonly subtitulo: HTMLElement;
  private readonly cabecalho: HTMLElement;
  private readonly atualizar: HTMLButtonElement;
  private readonly pastilha: HTMLElement;
  private readonly repo: RepositorioAcoes;
  /** Id da aba do SEI (vem do contexto): o mesmo ao reabrir o modal na mesma página. */
  private readonly aba: string;
  private controle: ControleExecucao | null = null;
  private telaExecucao: TelaExecucao | null = null;
  private minimizado = false;
  private destruido = false;
  private perguntando = false;
  private pararTeclado: () => void = () => undefined;

  constructor(
    private readonly raiz: HTMLElement,
    private readonly d: DepsApp,
  ) {
    this.conteudo = h("div", { class: "al-conteudo" });
    this.subtitulo = h("span", { class: "spro-lista-total" });
    this.repo = d.repo ?? new RepositorioAcoes(areaMemoria(), d.ctx.host, d.ctx.login);
    this.aba = d.aba ?? d.ctx.aba ?? novaAba();
    this.pastilha = h("div", { class: "al-pastilha", hidden: true });
    const atualizar = h(
      "button",
      {
        type: "button",
        class: "spro-botao-icone",
        "aria-label": "Atualizar",
        title: "Reler a árvore do processo",
        // No resultado, reler é começar outra seleção: a anterior não pode ficar marcada sem o usuário perceber.
        onclick: () => void (this.tela === "resultado" ? this.novaSelecao() : this.carregar(true)),
      },
      icone("atualizar", 18),
    );
    const fechar = h(
      "button",
      { type: "button", class: "spro-botao-icone", "aria-label": "Fechar", title: "Fechar (Esc)", onclick: () => this.fechar() },
      icone("fechar", 18),
    );
    this.atualizar = atualizar;
    const cabecalho = h(
      "header",
      { class: "spro-lista-topo" },
      h("div", { class: "spro-lista-titulo" }, icone("documento", 18), h("h1", {}, "Ações em Lote"), this.subtitulo),
      h("div", { class: "spro-lista-topo-acoes" }, atualizar, fechar),
    );
    this.cabecalho = cabecalho;
    raiz.replaceChildren(cabecalho, this.conteudo, this.pastilha);
    this.conteudo.replaceChildren(h("p", { class: "al-nota" }, "Carregando…"));
    d.aoFechar?.(() => this.destruir());

    // Esc fecha (na execução, pausa e pergunta; minimizado, nada: a página é do usuário); Ctrl/Cmd+Enter avança
    // (configuração: Ver prévia; prévia: Executar). Um diálogo aberto por cima (confirmar) cuida do próprio teclado.
    const teclado = (ev: KeyboardEvent) => {
      if (ev.defaultPrevented || this.destruido) return;
      const dialogo = (ev.target as HTMLElement | null)?.closest?.("dialog");
      if (dialogo && !dialogo.contains(this.raiz)) return;
      if (ev.key === "Escape") {
        if (this.minimizado) return;
        ev.preventDefault();
        void this.aoEsc();
      } else if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey) && !this.minimizado) {
        if (this.tela !== "configuracao" && this.tela !== "previa") return;
        ev.preventDefault();
        this.conteudo.querySelector<HTMLButtonElement>(".al-rodape .spro-botao.primario:not(:disabled)")?.click();
      }
    };
    const doc = raiz.ownerDocument;
    doc.addEventListener("keydown", teclado);
    this.pararTeclado = () => doc.removeEventListener("keydown", teclado);
  }

  /** Toda saída passa por aqui: o teclado para junto. */
  private fechar(): void {
    this.pararTeclado();
    this.d.fechar();
  }

  /** Esc: em qualquer tela fecha; na execução pausa o lote e pergunta (o lote fica salvo e retomável). */
  private async aoEsc(): Promise<void> {
    if (this.tela !== "execucao" || !this.controle || !this.d.confirmar) {
      this.fechar();
      return;
    }
    if (this.perguntando) return;
    this.perguntando = true;
    this.controle.pausar();
    try {
      if (await this.d.confirmar("O lote foi pausado. Fechar as Ações em Lote?", "Fechar", "Voltar")) this.fechar();
    } finally {
      this.perguntando = false;
    }
  }

  /** Primeira leitura da árvore; com lote parado neste processo, a retomada; senão, a seleção. */
  async iniciar(): Promise<void> {
    await this.carregar(false);
    if (!this.estado || this.destruido) return;
    let lote: LoteAcoes | null = null;
    try {
      lote = await this.repo.doProcesso(this.d.ctx.idProcedimento);
    } catch (e) {
      console.warn("[SEI Pro] ações em lote: registro ilegível", e);
    }
    if (!lote || this.destruido) return;
    // Nada a executar (o app saiu antes de apagar o registro): não há o que retomar.
    if (!loteParado(lote)) {
      await this.repo.descartar(lote.id).catch(() => undefined);
      return;
    }
    this.retomada(lote);
  }

  /** Modal fechado: nada novo é disparado; o lote fica salvo para a retomada. */
  destruir(): void {
    if (this.destruido) return;
    this.destruido = true;
    this.pararTeclado();
    this.controle?.encerrar();
  }

  private retomada(lote: LoteAcoes): void {
    this.tela = "retomada";
    this.atualizar.hidden = true;
    this.conteudo.replaceChildren(
      montarRetomada(
        lote,
        { aba: this.aba, agora: (this.d.agora ?? Date.now)() },
        {
          continuar: (senha) => {
            if (!this.estado || this.destruido) return;
            this.rodar(executarLote(this.estado, senha, this.depsExecucao(lote)));
          },
          descartar: () => {
            void this.repo
              .descartar(lote.id)
              .catch((e) => console.warn("[SEI Pro] ações em lote: falha ao descartar", e))
              .then(() => {
                if (!this.destruido) this.mostrar("selecao");
              });
          },
        },
      ),
    );
  }

  private depsExecucao(lote?: LoteAcoes): DepsExecucao {
    const d: DepsExecucao = {
      rpc: this.d.rpc,
      repo: this.repo,
      aba: this.aba,
      aoMudar: () => this.aoMudar(),
      aoTerminar: () => {
        if (!this.destruido) this.mostrar("resultado");
      },
    };
    if (lote) d.lote = lote;
    if (this.d.agora) d.agora = this.d.agora;
    if (this.d.esperar) d.esperar = this.d.esperar;
    return d;
  }

  private rodar(c: ControleExecucao): void {
    this.controle = c;
    this.mostrar("execucao");
  }

  private aoMudar(): void {
    if (this.destruido) return;
    this.telaExecucao?.atualizar();
    this.desenharPastilha();
  }

  /** Depois do resultado: árvore relida (o lote mudou o processo), seleção, filtros e etapas do zero. */
  private novaSelecao(): Promise<void> {
    return this.carregar(true, true);
  }

  private async carregar(forcar: boolean, limpar = false): Promise<void> {
    try {
      // Processo grande em servidor lento: a árvore (com as pastas abertas) e o histórico levam bem mais que os 15 s das demais chamadas.
      const a = await this.d.rpc.chamar<RespostaArvore>("arvore", forcar ? { forcar: true } : undefined, PRAZO_ARVORE_MS);
      this.estado = criarEstado(this.d.ctx, a, limpar ? undefined : (this.estado ?? undefined));
      this.subtitulo.textContent = this.estado.protocolo;
      this.mostrar("selecao");
    } catch (e) {
      this.conteudo.replaceChildren(h("p", { class: "spro-lista-erro" }, `Não foi possível ler os documentos do processo: ${mensagem(e)}`));
    }
  }

  private mostrar(tela: Tela): void {
    this.tela = tela;
    // Reler a árvore no meio da execução trocaria a tela e perderia o controle do lote.
    this.atualizar.hidden = tela === "execucao" || tela === "retomada";
    if (tela !== "execucao") this.telaExecucao = null;
    const e = this.estado;
    if (!e) return;
    if (tela === "selecao") {
      this.conteudo.replaceChildren(
        montarSelecao(this.raiz.ownerDocument, e, {
          aoMudar: () => undefined,
          configurar: (acao) => this.configurar(acao),
        }),
      );
    } else if (tela === "configuracao") {
      this.conteudo.replaceChildren(
        montarConfiguracao(this.raiz.ownerDocument, e, {
          rpc: this.d.rpc,
          voltar: () => this.mostrar("selecao"),
          previa: (senha) => this.abrirPrevia(senha),
        }),
      );
    } else if (tela === "previa") {
      this.conteudo.replaceChildren(
        montarPrevia(
          this.raiz.ownerDocument,
          e,
          {
            voltar: () => {
              this.senha = undefined;
              this.mostrar("configuracao");
            },
            executar: () => this.executar(),
          },
          { rpc: this.d.rpc, senha: this.senha, confirmar: (t, r, v) => this.d.confirmar?.(t, r, v) ?? Promise.resolve(false) },
        ),
      );
    } else if (tela === "execucao" && this.controle) {
      this.telaExecucao = new TelaExecucao(this.controle, { minimizar: () => void this.minimizar(true) });
      this.conteudo.replaceChildren(this.telaExecucao.el);
    } else if (tela === "resultado" && this.controle) {
      const c = this.controle;
      this.conteudo.replaceChildren(
        montarResultado(this.raiz.ownerDocument, e, {
          repetirFalhas: () => {
            void c.repetirFalhas();
            this.mostrar("execucao");
          },
          novaSelecao: () => void this.novaSelecao(),
          baixar: this.d.baixar ?? baixar,
          interrompido: c.estado === "cancelado",
          ...(this.d.clip ? { clip: this.d.clip } : {}),
          ...(this.d.ItemClip ? { ItemClip: this.d.ItemClip } : {}),
          ...(this.d.avisar ? { avisar: this.d.avisar } : {}),
        }),
      );
    }
    this.desenharPastilha();
  }

  /* ------------------------------------------------------------ pastilha */

  private async minimizar(m: boolean): Promise<void> {
    if (this.destruido || m === this.minimizado) return;
    try {
      // Primeiro a aba: se ela não encolher o iframe, o app não pode virar pastilha numa tela cheia.
      await this.d.rpc.chamar("minimizar", { minimizado: m });
    } catch (e) {
      console.warn("[SEI Pro] ações em lote: não foi possível minimizar", e);
      return;
    }
    if (!this.destruido) this.marcarMinimizado(m);
  }

  /** A aba já restaurou a janela (clique no item do menu): só volta a desenhar a tela cheia. */
  restaurado(): void {
    if (!this.destruido && this.minimizado) this.marcarMinimizado(false);
  }

  private marcarMinimizado(m: boolean): void {
    this.minimizado = m;
    const html = this.raiz.ownerDocument.documentElement;
    if (m) html.setAttribute("data-minimizado", "1");
    else html.removeAttribute("data-minimizado");
    this.cabecalho.hidden = m;
    this.conteudo.hidden = m;
    this.desenharPastilha();
  }

  private desenharPastilha(): void {
    this.pastilha.hidden = !this.minimizado;
    if (!this.minimizado) return;
    const c = this.controle;
    const p = c?.progresso() ?? { feitos: 0, total: 0, falhas: 0 };
    const estado =
      this.tela === "resultado"
        ? "Concluído"
        : c?.motivo
          ? `Parado: ${c.motivo}`
          : c?.estado === "pausado" && !c.rodando
            ? "Pausado"
            : "Executando";
    this.pastilha.replaceChildren(
      h(
        "div",
        { class: "al-pastilha-texto" },
        h("strong", {}, "Ações em Lote"),
        h(
          "span",
          { class: "al-pastilha-conta", role: "status" },
          `${p.feitos}/${p.total} · ${estado}`,
          p.falhas ? ` (${p.falhas} com erro)` : "",
        ),
      ),
      h(
        "button",
        {
          type: "button",
          class: "spro-botao",
          "aria-label": "Restaurar",
          title: "Restaurar a janela",
          onclick: () => void this.minimizar(false),
        },
        icone("expandir", 14),
        "Restaurar",
      ),
    );
  }

  /** A senha da assinatura digitada na configuração, para a execução (Task 10). */
  get senhaAssinatura(): string | undefined {
    return this.senha;
  }

  /** Configuração pronta: guarda a senha e mostra a prévia. */
  abrirPrevia(senha?: string): void {
    this.senha = senha;
    this.mostrar("previa");
  }

  /** Prévia confirmada: o lote nasce dos planos da prévia e começa a rodar. A senha passa ao controle e sai daqui. */
  executar(): void {
    if (!this.estado || this.destruido || this.controle?.rodando) return;
    const senha = this.senha;
    this.senha = undefined;
    this.rodar(executarLote(this.estado, senha, this.depsExecucao()));
  }

  private configurar(acao?: AcaoId): void {
    if (!this.estado) return;
    this.estado.etapas = acao ? [etapaInicial(acao)] : [];
    this.mostrar("configuracao");
  }
}
