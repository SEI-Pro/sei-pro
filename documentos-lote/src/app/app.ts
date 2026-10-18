/**
 * O app dos Documentos em Lote: a janela em etapas (Modelo → Planilha → ...), com o indicador de etapas no topo e
 * o rodapé Voltar / Avançar. Não toca o navegador direto (aba do SEI, armazenamento, fechar e minimizar chegam por
 * `DepsApp`), e por isso roda inteiro nos testes com linkedom.
 *
 * Padrão das etapas (as tarefas seguintes acrescentam as suas em `ETAPAS`): cada uma é uma `TelaEtapa`
 * (./estado.ts) criada ao entrar e destruída ao sair, lendo e escrevendo o mesmo `EstadoApp`. O Avançar só
 * habilita com `completa()`; a tela chama `aoMudar()` quando isso pode ter mudado. Sem botão Cancelar: o X e o Esc
 * fecham (regra dos modais do SEI Pro).
 */

import { novoId } from "@comum/id";
import type { Rpc, Tratador } from "@comum/ponte/rpc";
import { avisar } from "@comum/ui/aviso";
import { h, icone } from "@comum/ui/dom";
import { OP_RESTAURADO } from "@comum/ui/modalIframe";
import { copiarResultado, resultadoComoCsv } from "@comum/ui/tabelaResultado";
import { JANELA_OUTRA_ABA_MS } from "../modelo/constantes";
import type { ContextoDocumentos } from "../pagina/contexto";
import type { ItemLote, LoteDocumentos, RepositorioLote } from "../repositorio";
import { TelaCruzamento } from "./cruzamento";
import { chaveVerificacao, conferirVerificacao, type DefinicaoEtapa, type EstadoApp, mensagemDe, type TelaEtapa } from "./estado";
import { ExecucaoDocumentos, MENSAGEM_ASSUMIDO, resumoDoLote, TelaExecucao } from "./execucao";
import { montarLote, motivoDaVerificacao } from "./lote";
import { TelaModelo } from "./modelo";
import { TelaPlanilha } from "./planilha";
import { TelaPrevia } from "./previa";
import {
  colunasDoResultado,
  contagemDoLote,
  foraRegravaveis,
  gravouNoProcessoDaTela,
  linhasDoResultado,
  linkDoProcesso,
  numerosParaLink,
  repetiveis,
  TelaResultado,
  temPendencia,
} from "./resultado";
import { TelaVerificacao } from "./verificacao";

/** O que o tratador `contexto` devolve: o da aba sem a base nem o link da árvore (levam o infra_hash). */
export type ContextoApp = Omit<ContextoDocumentos, "base" | "linkArvore">;

export interface DepsApp {
  /** `listarModelos`, `lerModelo`, ..., `abrirLinkPermanente` e `fechar`/`minimizar` (pelo main), atendidos pela aba. */
  rpc: Pick<Rpc, "chamar">;
  ctx: ContextoApp;
  /** O lote em andamento: gravado ao Iniciar e a cada linha; lido ao abrir (retomada). */
  repo: RepositorioLote;
  fechar(): void;
  /** Pastilha (true) ou tela cheia (false), pedido à aba durante a execução. */
  minimizar(minimizado: boolean): Promise<void>;
  /** Confirmação num diálogo do app, sem Cancelar (o X e o Esc respondem "não"). */
  confirmar(texto: string, rotuloOk?: string): Promise<boolean>;
  baixar(nome: string, conteudo: string, tipo: string): void;
  clip: { write?: (itens: ClipboardItem[]) => Promise<void>; writeText(texto: string): Promise<void> };
  ItemClip?: typeof ClipboardItem;
  /** Deixa os números para o Link Permanente ler ao abrir (chrome.storage.local, CHAVE_ENTRADA_LINK). */
  gravarEntradaLink(texto: string): Promise<void>;
  /** Injetáveis para as provas (pausa entre documentos, relógio do lote e o aviso flutuante). */
  esperar?(ms: number): Promise<void>;
  agora?(): number;
  avisar?(texto: string): void;
}

/**
 * O que a aba pede ao app (lido a cada pedido pelo main): `restaurado` quando a aba devolve a janela minimizada
 * sozinha (clique no item do menu com a pastilha, OP_RESTAURADO do modalIframe).
 */
export function tratadoresDoApp(app: { restaurado(): void }): Record<string, Tratador> {
  return {
    [OP_RESTAURADO]: () => {
      app.restaurado();
      return true;
    },
  };
}

/** Prazo do pedido de recarga da árvore (a resposta é ignorada; só para a promessa não ficar pendurada). */
const PRAZO_RECARREGAR_MS = 5000;

/** O nome do modelo do lote, para a tela de retomada. */
function nomeDoModelo(l: LoteDocumentos): string {
  const m = l.config.modelo;
  return (m.origem === "documento" ? m.titulo : m.nome) || m.tipoNome || "";
}

/** O que o corpo mostra fora das etapas. */
type Corpo = "etapa" | "retomar" | "execucao" | "resultado" | "fora" | "concluido";

/** As etapas, na ordem. */
export const ETAPAS: readonly DefinicaoEtapa[] = [
  { id: "modelo", rotulo: "Modelo", criar: (d) => new TelaModelo(d) },
  { id: "planilha", rotulo: "Planilha", criar: (d) => new TelaPlanilha(d) },
  { id: "cruzamento", rotulo: "Cruzamento", criar: (d) => new TelaCruzamento(d) },
  {
    id: "verificacao",
    rotulo: "Verificação",
    criar: (d) => new TelaVerificacao(d),
    aplicavel: (e) => e.config?.destino.tipo === "coluna",
  },
  // Do Cruzamento, os destinos tela e novo processo pulam a Verificação e caem aqui. O Iniciar da Prévia não
  // avança para outra etapa: chama `iniciarExecucao` (a execução e o resultado não são etapas).
  { id: "previa", rotulo: "Prévia", criar: (d) => new TelaPrevia(d) },
];

const aplicavel = (i: number, estado: EstadoApp): boolean => {
  const def = ETAPAS[i];
  return !!def && (def.aplicavel?.(estado) ?? true);
};

/**
 * A etapa depois de `atual` que vale para o estado (null: não há). É o ponto de extensão da navegação: uma etapa
 * nova entra em `ETAPAS` (com `aplicavel`, se for condicional) e o Avançar a encontra por aqui.
 */
export function proximaEtapa(estado: EstadoApp, atual: number): number | null {
  for (let i = atual + 1; i < ETAPAS.length; i += 1) if (aplicavel(i, estado)) return i;
  return null;
}

/** A etapa antes de `atual` que vale para o estado (null: é a primeira). */
export function etapaAnterior(estado: EstadoApp, atual: number): number | null {
  for (let i = atual - 1; i >= 0; i -= 1) if (aplicavel(i, estado)) return i;
  return null;
}

export class AppDocumentosLote {
  /** O estado das etapas (as provas o leem; as telas o recebem por `DepsEtapa`). */
  readonly estado: EstadoApp = {};
  private indice = 0;
  private tela: TelaEtapa | null = null;
  private destruido = false;
  private readonly parar: Array<() => void> = [];
  private readonly cabecalho: HTMLElement;
  private readonly etapas: HTMLElement;
  private readonly conteudo: HTMLElement;
  private readonly rodape: HTMLElement;
  private readonly pastilha: HTMLElement;
  private readonly botaoVoltar: HTMLButtonElement;
  private readonly botaoAvancar: HTMLButtonElement;
  /** A execução em curso (ou a última): o lote, o executor e a tela de progresso. */
  private execucao: ExecucaoDocumentos | null = null;
  private telaExecucao: TelaExecucao | null = null;
  private minimizado = false;
  private corpo: Corpo = "etapa";
  private arrumacao: Promise<void> | null = null;
  /** O lote do resultado na tela (o que fechar o resultado apaga, se não houver pendência). */
  private loteResultado: LoteDocumentos | null = null;
  /** A tela de resultado mostrada (a de `loteResultado`). */
  private resultado: TelaResultado | null = null;
  /** A reverificação do "Gravar as que ficaram de fora". */
  private telaFora: TelaVerificacao | null = null;

  constructor(
    private readonly raiz: HTMLElement,
    private readonly d: DepsApp,
  ) {
    this.cabecalho = h(
      "header",
      { class: "spro-lista-topo" },
      h("div", { class: "spro-lista-titulo" }, icone("documento", 18), h("h1", {}, "Documentos em Lote")),
      h(
        "div",
        { class: "spro-lista-topo-acoes" },
        h(
          "button",
          { type: "button", class: "spro-botao-icone", "aria-label": "Fechar", title: "Fechar (Esc)", onclick: () => this.d.fechar() },
          icone("fechar", 18),
        ),
      ),
    );
    this.etapas = h("ol", { class: "dl-etapas", "aria-label": "Etapas" });
    this.conteudo = h("div", { class: "dl-conteudo" });
    this.botaoVoltar = h("button", { type: "button", class: "spro-botao", hidden: true, onclick: () => this.voltar() }, "Voltar");
    this.botaoAvancar = h(
      "button",
      { type: "button", class: "spro-botao primario", disabled: true, onclick: () => this.avancar() },
      "Avançar",
    );
    this.rodape = h("div", { class: "dl-acoes dl-rodape-etapa" }, this.botaoVoltar, h("span", { class: "dl-espaco" }), this.botaoAvancar);
    this.pastilha = h("div", { class: "dl-pastilha", hidden: true });
    raiz.replaceChildren(this.cabecalho, this.etapas, this.conteudo, this.rodape, this.pastilha);

    // Esc fecha (minimizado, não: a página é do usuário). Um diálogo aberto por cima (que não é o do app) cuida do
    // próprio teclado.
    const teclado = (ev: KeyboardEvent) => {
      if (ev.defaultPrevented || ev.key !== "Escape" || this.minimizado) return;
      const dialogo = (ev.target as HTMLElement | null)?.closest?.("dialog");
      if (dialogo && !dialogo.contains(this.raiz)) return;
      ev.preventDefault();
      this.d.fechar();
    };
    raiz.ownerDocument.addEventListener("keydown", teclado);
    this.parar.push(() => raiz.ownerDocument.removeEventListener("keydown", teclado));
  }

  /**
   * Abre o lote guardado deste host/login, se houver (com linha pendente: Continuar ou Descartar; sem: direto no
   * resultado); senão, a primeira etapa.
   */
  async iniciar(): Promise<void> {
    let guardado: LoteDocumentos | null = null;
    try {
      guardado = await this.d.repo.carregar(this.d.ctx.host, this.d.ctx.login);
    } catch (e) {
      console.warn("[SEI Pro] documentos em lote: lote guardado ilegível", e);
    }
    if (this.destruido) return;
    if (guardado) {
      if (guardado.itens.some((i) => i.situacao === "pendente")) this.telaRetomar(guardado);
      else this.mostrarResultado(guardado);
      return;
    }
    await this.irPara(0);
  }

  /**
   * Fechar o modal: a tela atual para o que estiver pendente; a execução pausa (o lote fica, retomável). O apagar
   * do lote concluído é do `antesDeFechar`, que roda antes do pedido de fechar à aba.
   */
  destruir(): void {
    this.destruido = true;
    this.execucao?.parar();
    this.tela?.destruir?.();
    this.tela = null;
    this.telaFora?.destruir();
    this.telaFora = null;
    for (const p of this.parar.splice(0)) p();
  }

  /**
   * Antes de a aba tirar o iframe (ver `fecharJanela`): com o resultado na tela e nada a repetir, conferir ou
   * gravar, o lote é apagado (não sobra planilha guardada à toa); com pendência, ele fica até 7 dias do último uso.
   * A execução já pausa aqui, para não despachar outra linha durante a arrumação. Chamar de novo não refaz.
   */
  antesDeFechar(): Promise<void> {
    this.arrumacao ??= (async () => {
      this.execucao?.parar();
      // A árvore da tela, antes do fechar: o pedido sai antes de a aba tirar o iframe (D2).
      const naTela = this.corpo === "resultado" ? this.loteResultado : this.corpo === "execucao" ? (this.execucao?.lote ?? null) : null;
      if (naTela) this.recarregarArvoreSeGravou(naTela);
      const resultado = this.corpo === "resultado" ? this.loteResultado : null;
      if (resultado && !temPendencia(resultado)) await this.apagarLote(resultado);
    })();
    return this.arrumacao;
  }

  /**
   * D2: a árvore do processo da tela passa a mostrar os documentos novos. Só para um lote executado NESTA janela
   * (um lote reaberto do armazenamento não gravou nada desde que a tela carregou) e que gravou, ou pode ter gravado,
   * no processo da tela. Melhor esforço: nem a falha da ponte nem a resposta de erro mexem no lote.
   */
  private recarregarArvoreSeGravou(lote: LoteDocumentos): void {
    if (this.execucao?.lote !== lote || !gravouNoProcessoDaTela(lote, this.estado.protocolo)) return;
    try {
      void this.d.rpc
        .chamar("recarregarArvore", undefined, PRAZO_RECARREGAR_MS)
        .catch((e) => console.warn("[SEI Pro] documentos em lote: árvore não recarregada", e));
    } catch (e) {
      console.warn("[SEI Pro] documentos em lote: árvore não recarregada", e);
    }
  }

  private async apagarLote(lote: LoteDocumentos): Promise<void> {
    await this.d.repo.apagar(lote.id).catch((e) => console.warn("[SEI Pro] documentos em lote: falha ao apagar o lote", e));
  }

  /**
   * A aba já restaurou a janela (clique no item do menu com a pastilha, `OP_RESTAURADO`): o app só volta a desenhar
   * a tela cheia, sem pedir nada à aba.
   */
  restaurado(): void {
    if (this.destruido || !this.minimizado) return;
    this.marcarMinimizado(false);
  }

  /* ------------------------------------------------------------ etapas */

  private async irPara(i: number): Promise<void> {
    const def = ETAPAS[i];
    if (!def || this.destruido) return;
    this.tela?.destruir?.();
    this.sairDoCorpo();
    this.corpo = "etapa";
    this.etapas.hidden = false;
    this.rodape.hidden = false;
    this.indice = i;
    const tela = def.criar({
      rpc: this.d.rpc,
      estado: this.estado,
      aoMudar: () => this.atualizarRodape(),
      iniciarExecucao: () => this.iniciarExecucao(),
      ctx: this.d.ctx,
    });
    this.tela = tela;
    this.largura(def.id === "verificacao");
    this.conteudo.replaceChildren(tela.el);
    this.atualizarRodape();
    await tela.iniciar?.();
  }

  private avancar(): void {
    if (!this.tela?.completa()) return;
    if (this.tela.avancar) {
      this.tela.avancar();
      return;
    }
    // Pular a Verificação (destino que não é a coluna) não pode deixar o resultado de uma verificação antiga.
    conferirVerificacao(this.estado);
    const i = proximaEtapa(this.estado, this.indice);
    if (i !== null) void this.irPara(i);
  }

  private voltar(): void {
    const i = etapaAnterior(this.estado, this.indice);
    if (i !== null) void this.irPara(i);
  }

  /** Só as etapas que valem para o estado atual (a Verificação aparece quando o destino é a coluna). */
  private desenharEtapas(): void {
    const visiveis = ETAPAS.map((e, i) => ({ e, i })).filter(({ i }) => i === this.indice || aplicavel(i, this.estado));
    this.etapas.replaceChildren(
      ...visiveis.map(({ e, i }, n) =>
        h(
          "li",
          {
            class: i < this.indice ? "feita" : i === this.indice ? "atual" : undefined,
            "aria-current": i === this.indice ? "step" : undefined,
          },
          h("span", { class: "dl-etapa-num" }, String(n + 1)),
          e.rotulo,
        ),
      ),
    );
  }

  /* ------------------------------------------------------------ execução */

  /**
   * O Iniciar da Prévia: monta o lote, grava-o ANTES da primeira linha e mostra a execução. Rejeita sem enviar nada.
   *
   * Guarda de escrita: há uma chave de lote por instalação, e gravar por cima apagaria o de outra aba. Um lote deste
   * host/login com linha pendente atualizado há menos de JANELA_OUTRA_ABA_MS pode estar rodando: recusa. Fora da
   * janela, um lote com pendência (pendente, erro, de fora) só é substituído com confirmação.
   */
  private async iniciarExecucao(): Promise<void> {
    const lote = montarLote(this.estado, this.d.ctx, { agora: this.d.agora });
    const existente = await this.d.repo.carregar(this.d.ctx.host, this.d.ctx.login);
    if (this.destruido) return;
    if (existente) {
      const naoConcluido = existente.itens.some((i) => i.situacao === "pendente");
      const desde = this.agora() - existente.atualizadoEm;
      if (naoConcluido && desde < JANELA_OUTRA_ABA_MS) {
        throw new Error(
          `Há outro lote em andamento, atualizado há ${Math.max(0, Math.round(desde / 1000))} segundos, que pode estar rodando em outra aba do SEI. Espere ele terminar, ou feche esta janela e abra de novo para continuar ou descartar aquele lote.`,
        );
      }
      if (temPendencia(existente)) {
        const c = contagemDoLote(existente);
        const sim = await this.d.confirmar(
          `Há um lote anterior ${naoConcluido ? "não concluído" : "com pendências"} (${c.criadas} de ${c.total} criadas). Iniciar este lote apaga o registro daquele neste navegador (os documentos já criados continuam no SEI). Iniciar mesmo assim?`,
          "Iniciar mesmo assim",
        );
        if (this.destruido) return;
        if (!sim) throw new Error("O lote anterior foi mantido.");
      }
    }
    await this.d.repo.gravar(lote);
    if (this.destruido) return;
    this.executarLote(lote);
  }

  private agora(): number {
    return (this.d.agora ?? Date.now)();
  }

  /* ------------------------------------------------------------ corpo fora das etapas */

  /** Troca o corpo por uma tela que não é etapa (retomada, execução, resultado, gravar as de fora). */
  private mostrarCorpo(corpo: Corpo, el: HTMLElement): void {
    this.tela?.destruir?.();
    this.tela = null;
    this.sairDoCorpo();
    this.corpo = corpo;
    this.largura(corpo === "resultado" || corpo === "fora");
    this.etapas.hidden = true;
    this.rodape.hidden = true;
    this.conteudo.replaceChildren(el);
    this.desenharPastilha();
  }

  /**
   * Janela larga nas telas de tabela (Verificação, Resultado e a reverificação das de fora): a classe na raiz faz o
   * <dialog> em volta crescer (documentos-lote.css, `dialog.dl-modal:has(> .dl-largo)`).
   */
  private largura(larga: boolean): void {
    this.raiz.classList.toggle("dl-largo", larga);
  }

  /** Saindo do corpo atual: a reverificação em curso para e o resultado deixa de ser o da tela. */
  private sairDoCorpo(): void {
    this.telaFora?.destruir();
    this.telaFora = null;
    this.loteResultado = null;
    this.resultado = null;
    this.telaExecucao = null;
  }

  /**
   * O destino "processo da tela" grava no processo da tela ATUAL da aba: retomar ou repetir em outra tela gravaria
   * no processo errado. Devolve o motivo do bloqueio (ou null).
   */
  private bloqueioDaTela(lote: LoteDocumentos): string | null {
    if (lote.config.destino.tipo !== "tela" || !lote.idProcedimentoTela) return null;
    if (lote.idProcedimentoTela === this.d.ctx.idProcedimento) return null;
    return `Este lote grava no processo ${lote.protocoloTela ?? "da tela em que ele começou"}, o da tela em que começou. Abra esse processo no SEI e abra o Documentos em Lote de novo para continuar.`;
  }

  /**
   * Assume o lote guardado antes de executar de novo nele (retomada, repetir, gravar as de fora): troca o id a partir
   * do registro FRESCO, e outra aba que ainda o execute perde o `marcar` e para antes do próximo pedido. O lote da
   * execução desta janela já é nosso. Devolve o lote a usar ou o motivo da recusa.
   */
  private async assumir(lote: LoteDocumentos): Promise<LoteDocumentos | string> {
    if (this.execucao?.lote === lote) return lote;
    let assumido: LoteDocumentos | null = null;
    try {
      assumido = await this.d.repo.assumir(lote.id, novoId());
    } catch (e) {
      return `Não foi possível gravar neste navegador; nada foi enviado ao SEI. ${mensagemDe(e)}`;
    }
    return assumido ?? "O lote mudou desde que esta janela abriu (outra aba o descartou ou assumiu). Feche e abra de novo.";
  }

  /** Grava cada item (lote assumido) antes de executar; o que falhar devolve o motivo, sem nada enviado ao SEI. */
  private async marcarItens(lote: LoteDocumentos, mudancas: Array<[number, ItemLote]>): Promise<string | null> {
    for (const [k, item] of mudancas) {
      let ok = false;
      try {
        ok = await this.d.repo.marcar(lote.id, k, item);
      } catch (e) {
        return `Não foi possível gravar neste navegador; nada foi enviado ao SEI. ${mensagemDe(e)}`;
      }
      if (!ok) return MENSAGEM_ASSUMIDO;
      lote.itens[k] = item;
    }
    return null;
  }

  /** A linha volta a `pendente`, com o processo que ela já criou (destino novo processo: não cria outro). */
  private pendenteDe(item: ItemLote | undefined): ItemLote {
    const p: ItemLote = { situacao: "pendente" };
    if (item?.processo) p.processo = item.processo;
    if (item?.linkProcesso) p.linkProcesso = item.linkProcesso;
    return p;
  }

  /* ------------------------------------------------------------ retomada */

  private telaRetomar(lote: LoteDocumentos): void {
    // Escrita recente: o lote pode estar rodando em outra aba (minimizado, por exemplo). Continuar aqui duplicaria.
    const desde = this.agora() - lote.atualizadoEm;
    const recente = desde < JANELA_OUTRA_ABA_MS;
    const c = contagemDoLote(lote);
    const bloqueio = this.bloqueioDaTela(lote);
    const quando = new Date(lote.iniciadoEm);
    const data = Number.isFinite(quando.getTime()) ? quando.toLocaleString("pt-BR") : "";
    const erro = h("p", { class: "dl-erro", role: "alert", hidden: true });
    const mesmoAssim = h(
      "button",
      { type: "button", class: "spro-botao perigo", hidden: true, onclick: () => void this.retomar(lote, mesmoAssim, erro) },
      icone("atualizar", 15),
      "Continuar mesmo assim",
    );
    const continuar = h(
      "button",
      {
        type: "button",
        class: "spro-botao primario",
        hidden: !!bloqueio,
        onclick: () => {
          // Lote recente: o primeiro clique só arma o segundo, explícito.
          if (recente) {
            continuar.hidden = true;
            mesmoAssim.hidden = false;
            mesmoAssim.focus?.({ preventScroll: true });
            return;
          }
          void this.retomar(lote, continuar, erro);
        },
      },
      icone("atualizar", 15),
      "Continuar de onde parou",
    );
    const descartar = h(
      "button",
      {
        type: "button",
        class: "spro-botao perigo",
        onclick: async () => {
          const sim = await this.d.confirmar(
            "Descartar o lote guardado? Os documentos já criados continuam no SEI; só o registro do que falta é apagado.",
            "Descartar",
          );
          if (!sim || this.destruido) return;
          await this.d.repo.apagar(lote.id).catch((e) => console.warn("[SEI Pro] documentos em lote: falha ao descartar", e));
          if (this.destruido) return;
          await this.irPara(0);
        },
      },
      icone("lixeira", 15),
      "Descartar",
    );
    const plural = (n: number, um: string, varios: string) => (n === 1 ? um : varios.replace("#", String(n)));
    this.mostrarCorpo(
      "retomar",
      h(
        "section",
        { class: "dl-retomar", "aria-label": "Lote guardado" },
        h("h2", {}, "Há um lote em andamento"),
        h(
          "p",
          {},
          `Modelo: ${nomeDoModelo(lote)}${data ? `, iniciado em ${data}` : ""}. `,
          h("strong", {}, `${c.criadas} de ${c.total}`),
          ` ${c.total === 1 ? "documento criado" : "documentos criados"}; ${plural(c.pendentes, "1 a gravar", "# a gravar")}.`,
        ),
        c.incertas
          ? h(
              "p",
              { class: "dl-motivo" },
              icone("alerta", 16),
              `${plural(c.incertas, "1 linha ficou incerta", "# linhas ficaram incertas")} (o SEI não confirmou ou a janela fechou no meio do pedido). Elas não são repetidas: confira no SEI e decida no resultado.`,
            )
          : null,
        recente
          ? h(
              "p",
              { class: "dl-motivo dl-outra-aba", role: "alert" },
              icone("alerta", 16),
              `Este lote foi atualizado há ${Math.max(0, Math.round(desde / 1000))} segundos e pode estar rodando em outra aba do SEI. Só continue se tiver certeza de que a outra execução parou.`,
            )
          : null,
        bloqueio ? h("p", { class: "dl-erro", role: "alert" }, icone("alerta", 16), h("span", {}, bloqueio)) : null,
        erro,
        h("div", { class: "dl-acoes" }, descartar, h("span", { class: "dl-espaco" }), continuar, mesmoAssim),
      ),
    );
  }

  /** Continuar: assume o lote e roda só as `pendente` (as criadas nunca são recriadas; as incertas ficam). */
  private async retomar(lote: LoteDocumentos, botao: HTMLButtonElement, erro: HTMLElement): Promise<void> {
    botao.disabled = true;
    erro.hidden = true;
    const l = await this.assumir(lote);
    if (this.destruido) return;
    if (typeof l === "string") {
      botao.disabled = false;
      erro.replaceChildren(icone("alerta", 16), h("span", {}, l));
      erro.hidden = false;
      return;
    }
    this.executarLote(l);
  }

  /* ------------------------------------------------------------ resultado */

  private mostrarResultado(lote: LoteDocumentos): void {
    const tela: TelaResultado = new TelaResultado(lote, {
      baixarCsv: () => this.baixarCsv(lote),
      copiar: () => void this.copiar(lote),
      repetirFalhas: () => void this.repetir(tela, lote, repetiveis(lote)),
      repetirIncerta: (k) => void this.repetirIncerta(tela, lote, k),
      gravarFora: () => this.telaGravarFora(lote),
      gerarLinks: () => void this.gerarLinks(tela, lote),
      concluir: () => void this.concluir(lote),
    });
    this.mostrarCorpo("resultado", tela.el);
    this.loteResultado = lote;
    this.resultado = tela;
  }

  /** Nova rodada sobre `indices` (linhas `erro`), que voltam a `pendente` antes; nada sai se a gravação falhar. */
  private async repetir(tela: TelaResultado, lote: LoteDocumentos, indices: number[]): Promise<void> {
    if (!indices.length) return;
    const bloqueio = this.bloqueioDaTela(lote);
    if (bloqueio) {
      tela.mostrarErro(bloqueio);
      return;
    }
    tela.ocupado(true);
    tela.mostrarErro("");
    const l = await this.assumir(lote);
    if (this.destruido) return;
    if (typeof l === "string") {
      tela.ocupado(false);
      tela.mostrarErro(l);
      return;
    }
    const falha = await this.marcarItens(
      l,
      indices.map((k) => [k, this.pendenteDe(l.itens[k])]),
    );
    if (this.destruido) return;
    if (falha !== null) {
      // O guardado já tem o id novo: a tela segue com ele (Concluir, repetir de novo).
      this.mostrarResultado(l);
      this.resultado?.mostrarErro(falha);
      return;
    }
    this.executarLote(l, indices);
  }

  /** Incerta (Ruling 16): só com a confirmação explícita, e só esta linha. */
  private async repetirIncerta(tela: TelaResultado, lote: LoteDocumentos, k: number): Promise<void> {
    const item = lote.itens[k];
    // Novo processo sem o número: a incerteza é do processo (repetir cria outro processo, e o documento nele).
    const soDoProcesso = lote.config.destino.tipo === "novo-processo" && !item?.processo;
    // O processo que a linha criou (só http(s) sem infra_hash): com ele, não há dúvida de que existe.
    const link = linkDoProcesso(item);
    const destino = item?.processo ? `o processo ${item.processo}${link ? ` (${link})` : ""}` : "o processo de destino";
    let texto: string;
    if (soDoProcesso && link)
      texto = `A linha ${k + 2} ficou incerta: um processo novo já foi criado para ela no SEI, mas o número dele não pôde ser lido. Abra-o antes de repetir (${link}). Repetir cria outro processo, e o documento nele. Repetir mesmo assim?`;
    else if (soDoProcesso)
      texto = `A linha ${k + 2} ficou incerta: o processo novo desta linha pode já ter sido criado no SEI. Antes de repetir, confira no Controle de Processos; se ele existir, repetir cria outro processo. Repetir mesmo assim?`;
    else
      texto = `A linha ${k + 2} ficou incerta: o documento pode já ter sido criado no SEI. Antes de repetir, confira ${destino}; se o documento existir, repetir cria outro igual. Repetir mesmo assim?`;
    const sim = await this.d.confirmar(texto, "Repetir mesmo assim");
    if (!sim || this.destruido) return;
    await this.repetir(tela, lote, [k]);
  }

  /**
   * "Gravar as que ficaram de fora" (destino coluna): reverifica (com `deNovo`) os processos das linhas `fora` sem
   * erro na planilha, na mesma tela/regras da Verificação, e grava as que passaram. As com erro na planilha aparecem
   * com o motivo e não podem ser gravadas (precisam de correção no arquivo).
   */
  private telaGravarFora(inicial: LoteDocumentos): void {
    if (!foraRegravaveis(inicial).length) return;
    // Depois de um `assumir` bem-sucedido o lote é outro objeto (id novo): Voltar e tentar de novo usam o novo.
    let lote = inicial;
    // A verificação lê o estado de uma etapa: um estado só desta reverificação, com as linhas de fora do lote.
    const registros: Record<string, string>[] = [];
    const estado: EstadoApp = {
      config: lote.config,
      registros,
      linhas: lote.linhas.filter((_, k) => lote.itens[k]?.situacao === "fora"),
      verificacoes: {},
      baseVerificacao: { registros, chave: chaveVerificacao(lote.config) },
    };
    let ocupado = false;
    const erro = h("p", { class: "dl-erro", role: "alert", hidden: true });
    const gravar = h(
      "button",
      { type: "button", class: "spro-botao primario dl-gravar-fora-ok", disabled: true, onclick: () => void fazer() },
      "Gravar",
    );
    const atualizar = () => {
      gravar.disabled = ocupado || !tela.completa();
      gravar.textContent = tela.rotuloAvancar();
    };
    const tela = new TelaVerificacao({ rpc: this.d.rpc, estado, aoMudar: atualizar }, { deNovo: true, esperar: this.d.esperar });
    const fazer = async () => {
      const prontas = estado.prontas ?? [];
      if (ocupado || !tela.completa() || !prontas.length) return;
      ocupado = true;
      atualizar();
      erro.hidden = true;
      const l = await this.assumir(lote);
      if (this.destruido || this.telaFora !== tela) return;
      let falha = typeof l === "string" ? l : null;
      if (typeof l !== "string") {
        lote = l;
        const v = estado.verificacoes ?? {};
        const aprovadas = new Set(prontas);
        const mudancas: Array<[number, ItemLote]> = [];
        for (const k of foraRegravaveis(l)) {
          if (aprovadas.has(k)) {
            mudancas.push([k, { situacao: "pendente" }]);
            continue;
          }
          // A que continua de fora fica com o motivo da verificação nova.
          const r = v[l.linhas[k]?.destino ?? ""];
          if (r) mudancas.push([k, { situacao: "fora", erro: motivoDaVerificacao(r) }]);
        }
        for (const [n, r] of Object.entries(v)) l.verificacoes[n] = r;
        falha = await this.marcarItens(l, mudancas);
        if (this.destruido) return;
        if (falha === null) {
          this.executarLote(l, prontas);
          return;
        }
      }
      ocupado = false;
      atualizar();
      erro.replaceChildren(icone("alerta", 16), h("span", {}, falha ?? ""));
      erro.hidden = false;
    };
    const voltar = h("button", { type: "button", class: "spro-botao", onclick: () => this.mostrarResultado(lote) }, "Voltar ao resultado");
    this.mostrarCorpo(
      "fora",
      h(
        "section",
        { class: "dl-gravar-fora", "aria-label": "Gravar as que ficaram de fora" },
        h("h2", {}, "Gravar as que ficaram de fora"),
        tela.el,
        erro,
        h("div", { class: "dl-acoes" }, voltar, h("span", { class: "dl-espaco" }), gravar),
      ),
    );
    this.telaFora = tela;
    atualizar();
    void tela.iniciar();
  }

  private baixarCsv(lote: LoteDocumentos): void {
    this.d.baixar("documentos-em-lote.csv", resultadoComoCsv(linhasDoResultado(lote), colunasDoResultado(lote)), "text/csv;charset=utf-8");
  }

  private async copiar(lote: LoteDocumentos): Promise<void> {
    const linhas = linhasDoResultado(lote);
    const colunas = colunasDoResultado(lote);
    const aviso = this.d.avisar ?? ((t: string) => avisar(t));
    try {
      const modo = await copiarResultado(linhas, colunas, this.d.clip, this.d.ItemClip);
      aviso(modo === "rico" ? "Copiado com links clicáveis" : "Copiado como texto");
    } catch (e) {
      aviso(`Não foi possível copiar: ${mensagemDe(e)}`);
    }
  }

  /** Os números das criadas (sem as incertas) vão para o Link Permanente, que abre já com eles; esta janela fecha. */
  private async gerarLinks(tela: TelaResultado, lote: LoteDocumentos): Promise<void> {
    const numeros = numerosParaLink(lote);
    if (!numeros.length) return;
    try {
      await this.d.gravarEntradaLink(numeros.join("\n"));
      const aberto = await this.d.rpc.chamar<unknown>("abrirLinkPermanente");
      if (aberto === false) throw new Error("o Link Permanente não está disponível nesta aba.");
    } catch (e) {
      if (!this.destruido) tela.mostrarErro(`Não foi possível abrir o Pesquisar Link Permanente: ${mensagemDe(e)}`);
      return;
    }
    if (this.destruido) return;
    this.recarregarArvoreSeGravou(lote);
    // Como o Concluir: o apagar termina antes de a aba tirar o iframe.
    if (!temPendencia(lote)) await this.apagarLote(lote);
    if (this.destruido) return;
    this.sairDoCorpo();
    this.corpo = "concluido";
    this.d.fechar();
  }

  /** Concluir: apaga o lote (com pendência, só depois de confirmar) e fecha a janela. */
  private async concluir(lote: LoteDocumentos): Promise<void> {
    if (temPendencia(lote)) {
      const sim = await this.d.confirmar(
        "Concluir apaga o registro deste lote neste navegador: as linhas com erro, incertas ou de fora não poderão mais ser repetidas por aqui (os documentos criados continuam no SEI). Concluir mesmo assim?",
        "Concluir",
      );
      if (!sim || this.destruido) return;
    }
    this.recarregarArvoreSeGravou(lote);
    await this.apagarLote(lote);
    if (this.destruido) return;
    this.sairDoCorpo();
    this.corpo = "concluido";
    this.d.fechar();
  }

  /* ------------------------------------------------------------ execução */

  /**
   * Mostra a execução no lugar do corpo e roda uma rodada sobre `indices` (padrão: as linhas `pendente`). Ponto de
   * extensão da Tarefa 14b: a retomada ("Continuar de onde parou"), "Repetir só as que falharam" e "Gravar as que
   * ficaram de fora" chamam isto com o lote guardado e a lista fixa de linhas.
   */
  executarLote(lote: LoteDocumentos, indices?: number[]): void {
    if (this.destruido) return;
    if (this.execucao?.rodando) return;
    const ex =
      this.execucao && this.execucao.lote.id === lote.id
        ? this.execucao
        : new ExecucaoDocumentos(lote, {
            rpc: this.d.rpc,
            repo: this.d.repo,
            aoMudar: () => this.aoMudarExecucao(),
            esperar: this.d.esperar,
            agora: this.d.agora,
          });
    this.execucao = ex;
    const tela = new TelaExecucao(ex, {
      pausar: () => ex.pausar(),
      continuar: () => {
        if (!ex.rodando) void this.acompanhar(ex, ex.continuar());
      },
      minimizar: () => void this.minimizar(true),
    });
    this.mostrarCorpo("execucao", tela.el);
    this.telaExecucao = tela;
    void this.acompanhar(ex, ex.rodar(indices));
  }

  private async acompanhar(ex: ExecucaoDocumentos, rodada: Promise<void>): Promise<void> {
    this.aoMudarExecucao();
    await rodada;
    if (this.destruido || this.execucao !== ex) return;
    if (ex.estado === "concluido") {
      this.recarregarArvoreSeGravou(ex.lote);
      this.telaExecucao?.concluida();
      this.aoConcluir(ex.lote);
    }
    this.aoMudarExecucao();
  }

  /** Todas as linhas da rodada processadas: o resultado (o lote fica até o usuário fechar o resultado ou concluir). */
  protected aoConcluir(lote: LoteDocumentos): void {
    this.mostrarResultado(lote);
  }

  private aoMudarExecucao(): void {
    if (this.destruido) return;
    this.telaExecucao?.atualizar();
    this.desenharPastilha();
  }

  /* ------------------------------------------------------------ pastilha */

  private async minimizar(m: boolean): Promise<void> {
    if (this.destruido || m === this.minimizado) return;
    try {
      // Primeiro a aba: se ela não encolher o iframe, o app não pode virar pastilha numa tela cheia.
      await this.d.minimizar(m);
    } catch (e) {
      console.warn("[SEI Pro] documentos em lote: não foi possível minimizar", e);
      return;
    }
    if (this.destruido) return;
    this.marcarMinimizado(m);
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
    const ex = this.execucao;
    const p = ex?.progresso ?? { feitos: 0, total: 0, criadas: 0, erros: 0, incertas: 0, fora: 0 };
    const estado =
      ex?.estado === "concluido" ? "Concluído" : ex?.motivo ? "Parado" : ex?.estado === "pausado" && !ex.rodando ? "Pausado" : "Gravando";
    this.pastilha.replaceChildren(
      h(
        "div",
        { class: "dl-pastilha-texto" },
        h("strong", {}, "Documentos em Lote"),
        h(
          "span",
          { class: "dl-pastilha-conta", role: "status", title: ex?.estado === "concluido" ? resumoDoLote(p) : (ex?.motivo ?? "") },
          `${p.feitos}/${p.total} · ${estado}`,
          p.erros || p.incertas
            ? ` (${[p.erros ? `${p.erros} com erro` : "", p.incertas ? `${p.incertas} ${p.incertas === 1 ? "incerta" : "incertas"}` : ""].filter(Boolean).join(", ")})`
            : "",
        ),
      ),
      h(
        "button",
        {
          type: "button",
          class: "spro-botao pequeno",
          "aria-label": "Restaurar",
          title: "Restaurar a janela",
          onclick: () => void this.minimizar(false),
        },
        icone("expandir", 14),
        "Restaurar",
      ),
    );
  }

  private atualizarRodape(): void {
    if (this.destruido) return;
    this.desenharEtapas();
    this.botaoVoltar.hidden = etapaAnterior(this.estado, this.indice) === null;
    this.botaoAvancar.disabled = !this.tela?.completa();
    this.botaoAvancar.textContent = this.tela?.rotuloAvancar?.() ?? "Avançar";
  }
}

/** Teto da arrumação antes do fechar: o armazenamento lento não pode prender a tela do SEI sob o iframe. */
export const TETO_ANTES_DE_FECHAR_MS = 1500;

/**
 * A ordem do fechamento (X, Esc, véu, Concluir, Gerar links): primeiro o app arruma o armazenamento (apaga o lote
 * concluído sem pendência), com teto; só então pede à aba que tire o iframe (`pedirFechar`), porque a aba o remove
 * na hora e o que o app ainda fosse gravar se perderia; por fim desmonta o app.
 */
export async function fecharJanela(app: AppDocumentosLote, pedirFechar: () => void, teto = TETO_ANTES_DE_FECHAR_MS): Promise<void> {
  let prazo: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      app.antesDeFechar(),
      new Promise<void>((r) => {
        prazo = setTimeout(r, teto);
      }),
    ]);
  } catch (e) {
    console.warn("[SEI Pro] documentos em lote: falha ao arrumar antes de fechar", e);
  } finally {
    clearTimeout(prazo);
  }
  pedirFechar();
  try {
    app.destruir();
  } catch (e) {
    console.warn("[SEI Pro] documentos em lote: falha ao desmontar o app", e);
  }
}
