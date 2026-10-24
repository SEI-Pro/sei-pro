/**
 * O conteúdo do modal “Histórico de tramitação”: progresso e cancelamento da coleta, abas Gantt e Tempo por unidade,
 * exportar CSV e imprimir. É separado do `<dialog>` (ver `modal.ts`) para os testes o exercitarem sem `showModal`.
 *
 * Estados: sigiloso (nada é coletado), coletando (com ou sem dado anterior), erro, cancelado, vazio e pronto. Dado
 * vencido (mais de 30 min) aparece como “desatualizado” enquanto a coleta incremental o atualiza.
 */
import { h, icone } from "@comum/ui/dom";
import type { Andamento } from "@nucleo/dominio/historico";
import { calcularPassagens, type DocumentoDaPassagem, type Passagem, relogioDe } from "@nucleo/dominio/passagens";
import { VALIDADE_HISTORICO_MS } from "../modelo/dados";
import { avisarNoTopo, mensagemDeErro } from "../pagina/comum";
import { type ColetorHistorico, type ContextoColeta, historicoGuardado, obterHistorico, ProcessoSigilosoErro } from "./coleta";
import { resumoDoTempo, rotuloDoComparativo, tempoPorUnidade } from "./comparativo";
import { criarDica } from "./dica";
import { baixarArquivo, gerarCsvPassagens, imprimirHistorico, nomeDoCsv } from "./exportar";
import { ESCALAS, type Escala, escalaPadrao, formatarDataHora, formatarDuracao, numeroBR } from "./modelo";
import { fixarEixos, montarGantt } from "./svg";

export type AbaGantt = "gantt" | "tempo";

export interface DadosDoHistorico {
  andamentos: Andamento[];
  coletadoEm: number;
  passagens: Passagem[];
}

export type EstadoGantt =
  | { tipo: "sigiloso" }
  | { tipo: "coletando"; feito: number; total: number; cancelando: boolean; anterior?: DadosDoHistorico }
  | { tipo: "erro"; mensagem: string; anterior?: DadosDoHistorico }
  | { tipo: "cancelado"; anterior?: DadosDoHistorico }
  | { tipo: "pronto"; dados: DadosDoHistorico };

export interface DepsVisao {
  ctx: ContextoColeta & { protocolo: string; topo: Document; doc: Document };
  /** Clique num losango. Padrão do módulo: `abrirVisualizacaoRapida`. */
  abrirDocumento(d: DocumentoDaPassagem, p: Passagem): void;
  /** Escala inicial (padrão: a menor que cabe na largura). */
  escala?: Escala;
  aba?: AbaGantt;
}

export interface VisaoGantt {
  el: HTMLElement;
  estado(): EstadoGantt;
  /** Para a coleta em curso e solta o que estiver escutando (o modal fechou). */
  destruir(): void;
  /** Resolve quando a coleta inicial termina (ou já estava no cache). */
  pronta: Promise<void>;
}

const haQuanto = (ms: number): string => (ms < 60_000 ? "agora há pouco" : `há ${formatarDuracao(ms)}`);

const dadosDe = (andamentos: Andamento[], coletadoEm: number, agora: Date): DadosDoHistorico => ({
  andamentos,
  coletadoEm,
  passagens: calcularPassagens(andamentos, agora),
});

const ehCancelado = (e: unknown): boolean => !!e && typeof e === "object" && (e as { codigo?: unknown }).codigo === "CANCELADO";

export function montarVisao(deps: DepsVisao): VisaoGantt {
  const { ctx } = deps;
  let estado: EstadoGantt = ctx.sigiloso ? { tipo: "sigiloso" } : { tipo: "coletando", feito: 0, total: 0, cancelando: false };
  let aba: AbaGantt = deps.aba ?? "gantt";
  let escala: Escala | null = deps.escala ?? null;
  let controle: AbortController | null = null;
  let destruida = false;
  let desligarEixos: (() => void) | null = null;
  const idBase = `spro-g-visao-${Math.floor(Math.random() * 1e6)}`;

  const raiz = h("div", { class: "spro-g-visao" });

  const dadosAtuais = (): DadosDoHistorico | undefined => {
    if (estado.tipo === "pronto") return estado.dados;
    if (estado.tipo === "coletando" || estado.tipo === "erro" || estado.tipo === "cancelado") return estado.anterior;
    return undefined;
  };

  // --- Coleta ---------------------------------------------------------------------------------------------------
  async function coletar(forcar: boolean): Promise<void> {
    if (destruida || ctx.sigiloso) return;
    const anterior = dadosAtuais();
    controle?.abort();
    const meu = new AbortController();
    controle = meu;
    estado = { tipo: "coletando", feito: 0, total: 0, cancelando: false, ...(anterior ? { anterior } : {}) };
    desenhar();
    try {
      const r = await obterHistorico(ctx, {
        sinal: meu.signal,
        forcar,
        aoProgresso: (feito, total) => {
          if (destruida || controle !== meu || estado.tipo !== "coletando") return;
          estado = { ...estado, feito, total };
          atualizarProgresso();
        },
      });
      if (destruida || controle !== meu) return;
      estado = { tipo: "pronto", dados: dadosDe(r.andamentos, r.coletadoEm, ctx.agora()) };
    } catch (e) {
      if (destruida || controle !== meu) return;
      if (e instanceof ProcessoSigilosoErro) estado = { tipo: "sigiloso" };
      else if (ehCancelado(e) || meu.signal.aborted) estado = { tipo: "cancelado", ...(anterior ? { anterior } : {}) };
      else estado = { tipo: "erro", mensagem: mensagemDeErro(e), ...(anterior ? { anterior } : {}) };
    } finally {
      if (controle === meu) controle = null;
    }
    desenhar();
  }

  function cancelarColeta(): void {
    if (estado.tipo !== "coletando" || !controle) return;
    estado = { ...estado, cancelando: true };
    desenhar();
    controle.abort();
  }

  // --- Peças fixas ----------------------------------------------------------------------------------------------
  const abaGantt = h("button", { type: "button", role: "tab", id: `${idBase}-aba-gantt`, "aria-controls": `${idBase}-painel` }, "Gantt");
  const abaTempo = h(
    "button",
    { type: "button", role: "tab", id: `${idBase}-aba-tempo`, "aria-controls": `${idBase}-painel` },
    "Tempo por unidade",
  );
  const abas = h("div", { class: "spro-segmentado spro-g-abas", role: "tablist", "aria-label": "Visões do histórico" }, abaGantt, abaTempo);
  const situacao = h("span", { class: "spro-g-situacao", role: "status", "aria-live": "polite" });
  const progresso = h("div", { class: "spro-g-progresso" });
  const aviso = h("div", { class: "spro-g-aviso", role: "status" });
  const painel = h("div", { class: "spro-g-painel", role: "tabpanel", id: `${idBase}-painel` });
  const botaoAtualizar = h("button", { type: "button", class: "spro-botao" }, icone("atualizar", 15), "Atualizar");
  const botaoCsv = h("button", { type: "button", class: "spro-botao" }, icone("planilha", 15), "Exportar CSV");
  const botaoImprimir = h("button", { type: "button", class: "spro-botao" }, icone("imprimir", 15), "Imprimir");
  const rodape = h("div", { class: "spro-g-rodape" }, h("span", { class: "spro-g-frescor" }), botaoAtualizar, botaoCsv, botaoImprimir);
  raiz.append(h("div", { class: "spro-g-topo" }, abas, situacao), progresso, aviso, painel, rodape);

  const selecionarAba = (nova: AbaGantt, foco = false) => {
    aba = nova;
    desenhar();
    if (foco) (nova === "gantt" ? abaGantt : abaTempo).focus();
  };
  abaGantt.addEventListener("click", () => selecionarAba("gantt"));
  abaTempo.addEventListener("click", () => selecionarAba("tempo"));
  abas.addEventListener("keydown", (ev) => {
    const k = (ev as KeyboardEvent).key;
    if (k === "ArrowRight" || k === "ArrowLeft" || k === "Home" || k === "End") {
      ev.preventDefault();
      selecionarAba(k === "Home" ? "gantt" : k === "End" ? "tempo" : aba === "gantt" ? "tempo" : "gantt", true);
    }
  });

  botaoAtualizar.addEventListener("click", () => void coletar(true));
  botaoCsv.addEventListener("click", () => {
    const d = dadosAtuais();
    if (!d?.passagens.length) return;
    baixarArquivo(ctx.topo, nomeDoCsv(ctx.protocolo), gerarCsvPassagens(d.passagens));
    avisarNoTopo(ctx, "CSV do histórico gerado.", 2500);
  });
  botaoImprimir.addEventListener("click", () => {
    const d = dadosAtuais();
    if (!d?.passagens.length) return;
    imprimirHistorico(ctx.topo, {
      protocolo: ctx.protocolo,
      passagens: d.passagens,
      agora: relogioDe(ctx.agora()),
      coletadoEm: relogioDe(new Date(d.coletadoEm)),
    });
  });

  // --- Desenho --------------------------------------------------------------------------------------------------
  function atualizarProgresso(): void {
    if (estado.tipo !== "coletando") return;
    const { feito, total, cancelando } = estado;
    const texto = cancelando
      ? "Cancelando a coleta…"
      : total > 0
        ? `Coletando o histórico: página ${feito} de ${total}`
        : "Coletando o histórico…";
    const barra = progresso.querySelector<HTMLElement>(".spro-g-prog-barra");
    const rotulo = progresso.querySelector<HTMLElement>(".spro-g-prog-texto");
    if (rotulo) rotulo.textContent = texto;
    if (barra) {
      const pct = total > 0 ? Math.round((feito / total) * 100) : 0;
      barra.setAttribute("aria-valuenow", String(pct));
      const preenchimento = barra.firstElementChild as HTMLElement | null;
      if (preenchimento) preenchimento.style.width = total > 0 ? `${pct}%` : "";
      barra.classList.toggle("indeterminado", total <= 0);
    }
  }

  function desenharProgresso(): void {
    if (estado.tipo !== "coletando") {
      progresso.hidden = true;
      progresso.replaceChildren();
      return;
    }
    progresso.hidden = false;
    const cancelar = h(
      "button",
      { type: "button", class: "spro-botao pequeno", ...(estado.cancelando ? { disabled: true } : {}) },
      icone("cancelar", 14),
      "Cancelar coleta",
    );
    cancelar.addEventListener("click", cancelarColeta);
    progresso.replaceChildren(
      h("div", { class: "spro-g-prog-texto", "aria-live": "polite" }),
      h(
        "div",
        {
          class: "spro-g-prog-barra",
          role: "progressbar",
          "aria-label": "Andamento da coleta do histórico",
          "aria-valuemin": "0",
          "aria-valuemax": "100",
        },
        h("span", {}),
      ),
      cancelar,
    );
    atualizarProgresso();
  }

  function desenharAviso(): void {
    const e = estado;
    const botao = (texto: string, aoClicar: () => void) => {
      const b = h("button", { type: "button", class: "spro-botao pequeno" }, texto);
      b.addEventListener("click", aoClicar);
      return b;
    };
    aviso.className = "spro-g-aviso";
    aviso.replaceChildren();
    aviso.hidden = true;
    const mostrar = (classe: string, texto: string, ...extras: Node[]) => {
      aviso.hidden = false;
      aviso.className = `spro-g-aviso ${classe}`;
      aviso.replaceChildren(icone("alerta", 15), h("span", { class: "spro-g-aviso-texto" }, texto), ...extras);
    };
    const agora = ctx.agora().getTime();
    if (e.tipo === "sigiloso") mostrar("sigiloso", "Processo sigiloso: o histórico completo não é coletado nem guardado pelo SEI Pro.");
    else if (e.tipo === "erro")
      mostrar(
        "erro",
        `Não foi possível coletar o histórico. ${e.mensagem}`,
        botao("Tentar de novo", () => void coletar(false)),
      );
    else if (e.tipo === "cancelado")
      mostrar(
        "cancelado",
        "Coleta cancelada.",
        botao("Coletar de novo", () => void coletar(false)),
      );
    else if (e.tipo === "coletando" && e.anterior && !e.cancelando)
      mostrar("desatualizado", `Mostrando o histórico coletado ${haQuanto(agora - e.anterior.coletadoEm)} enquanto ele é atualizado.`);
    else if (e.tipo === "pronto" && agora - e.dados.coletadoEm >= VALIDADE_HISTORICO_MS)
      mostrar(
        "desatualizado",
        `Este histórico foi coletado ${haQuanto(agora - e.dados.coletadoEm)}.`,
        botao("Atualizar agora", () => void coletar(true)),
      );
    if ((e.tipo === "erro" || e.tipo === "cancelado") && e.anterior)
      mostrar(
        e.tipo === "erro" ? "erro" : "cancelado",
        `${e.tipo === "erro" ? `Não foi possível atualizar o histórico. ${e.mensagem}` : "Atualização cancelada."} Mostrando o que foi coletado ${haQuanto(agora - e.anterior.coletadoEm)} (desatualizado).`,
        botao("Tentar de novo", () => void coletar(false)),
      );
  }

  function desenharPainel(): void {
    desligarEixos?.();
    desligarEixos = null;
    painel.replaceChildren();
    const d = dadosAtuais();
    if (estado.tipo === "sigiloso") {
      painel.append(h("p", { class: "spro-g-vazio" }, "Nenhum dado de tramitação é lido de processo sigiloso."));
      return;
    }
    if (!d) {
      painel.append(
        h(
          "p",
          { class: "spro-g-vazio" },
          estado.tipo === "coletando"
            ? "Coletando o histórico do processo. Isto pode levar alguns segundos em processos grandes."
            : "O histórico ainda não foi coletado.",
        ),
      );
      return;
    }
    if (!d.passagens.length) {
      painel.append(h("p", { class: "spro-g-vazio" }, "Este processo não tem tramitação registrada no histórico."));
      return;
    }
    painel.setAttribute("aria-labelledby", `${idBase}-aba-${aba}`);
    painel.append(aba === "gantt" ? painelGantt(d) : painelTempo(d));
  }

  function painelGantt(d: DadosDoHistorico): HTMLElement {
    const agoraRelogio = relogioDe(ctx.agora());
    escala ??= escalaPadrao(d.passagens, 980);
    const atual = escala;
    const quadro = h("div", { class: "spro-g-quadro" });
    const dica = criarDica(quadro, `${idBase}-dica`);
    const rolagem = h("div", { class: "spro-g-rolagem", tabindex: "0", "aria-label": "Linha do tempo. Role para os lados e para baixo." });
    const svg = montarGantt(d.passagens, atual, { agora: agoraRelogio, dica, aoAbrirDocumento: (doc, p) => deps.abrirDocumento(doc, p) });
    rolagem.append(svg);
    quadro.prepend(rolagem);
    desligarEixos = fixarEixos(svg, rolagem);
    rolagem.addEventListener("scroll", () => dica.ocultar());

    const grupo = h("div", { class: "spro-segmentado", role: "group", "aria-label": "Escala de tempo" });
    for (const e of ESCALAS) {
      const b = h("button", { type: "button", "aria-pressed": String(e.id === atual), "data-escala": e.id }, e.rotulo);
      b.addEventListener("click", () => {
        if (escala === e.id) return;
        const razao = rolagem.scrollWidth > 0 ? rolagem.scrollLeft / rolagem.scrollWidth : 0;
        escala = e.id;
        desenhar();
        const nova = painel.querySelector<HTMLElement>(".spro-g-rolagem");
        if (nova) nova.scrollLeft = razao * nova.scrollWidth;
      });
      grupo.append(b);
    }
    const fim = h("button", { type: "button", class: "spro-botao pequeno" }, "Ir para o mais recente");
    fim.addEventListener("click", () => {
      rolagem.scrollLeft = rolagem.scrollWidth;
    });
    const legenda = h(
      "ul",
      { class: "spro-g-legenda", "aria-label": "Legenda" },
      ...(
        [
          ["concluida", "Passagem concluída"],
          ["em-curso", "Em curso"],
          ["pendente", "Aguardando recebimento"],
          ["mantido-aberto", "Remetido, mantido aberto"],
        ] as const
      ).map(([c, t]) => h("li", {}, h("span", { class: `spro-g-amostra ${c}`, "aria-hidden": "true" }), t)),
      h("li", {}, h("span", { class: "spro-g-amostra losango", "aria-hidden": "true" }), "Documento gerado"),
    );
    return h("div", { class: "spro-g-gantt" }, h("div", { class: "spro-g-ferramentas" }, grupo, fim, legenda), quadro);
  }

  function painelTempo(d: DadosDoHistorico): HTMLElement {
    const linhas = tempoPorUnidade(d.passagens);
    const resumo = resumoDoTempo(d.passagens);
    const maior = Math.max(1, ...linhas.map((l) => l.percentual));
    return h(
      "div",
      { class: "spro-g-tempo" },
      h(
        "p",
        { class: "spro-g-resumo" },
        `${resumo.passagens} passagem(ns) por ${resumo.unidades} unidade(s). Tempo corrido do processo: ${formatarDuracao(resumo.corridoMs)}.`,
      ),
      h(
        "table",
        { class: "spro-g-tabela" },
        h("caption", { class: "spro-g-legenda-tabela" }, "Tempo que o processo ficou em cada unidade, do maior para o menor"),
        h(
          "thead",
          {},
          h(
            "tr",
            {},
            h("th", { scope: "col" }, "Unidade"),
            h("th", { scope: "col" }, "Dias"),
            h("th", { scope: "col" }, "% do total"),
            h("th", { scope: "col" }, "Passagens"),
            h("th", { scope: "col", "aria-hidden": "true" }, ""),
          ),
        ),
        h(
          "tbody",
          {},
          ...linhas.map((l) => {
            const barra = h("span", { class: `spro-g-barra-pct${l.emCurso ? " em-curso" : ""}` });
            barra.style.width = `${Math.max(1, Math.round((l.percentual / maior) * 100))}%`;
            return h(
              "tr",
              {},
              h("th", { scope: "row" }, rotuloDoComparativo(l), l.emCurso ? h("span", { class: "spro-g-selo-curso" }, "em curso") : null),
              h("td", { class: "num" }, numeroBR(l.dias)),
              h("td", { class: "num" }, `${numeroBR(l.percentual)}%`),
              h("td", { class: "num" }, String(l.passagens)),
              h("td", { class: "barra", "aria-hidden": "true" }, barra),
            );
          }),
        ),
      ),
      h(
        "p",
        { class: "spro-g-nota" },
        "Passagem em curso conta até agora. Passagens simultâneas (remessa para várias unidades) contam cada uma na sua unidade; o percentual é sobre a soma do tempo de todas as passagens.",
      ),
    );
  }

  function desenharRodape(): void {
    const d = dadosAtuais();
    const ocupado = estado.tipo === "coletando";
    const semDados = !d?.passagens.length;
    botaoAtualizar.disabled = ocupado || estado.tipo === "sigiloso";
    botaoCsv.disabled = semDados;
    botaoImprimir.disabled = semDados;
    const f = rodape.querySelector<HTMLElement>(".spro-g-frescor");
    if (f)
      f.textContent = d
        ? `Coletado em ${formatarDataHora(relogioDe(new Date(d.coletadoEm)))} (${haQuanto(ctx.agora().getTime() - d.coletadoEm)})`
        : "";
  }

  function desenhar(): void {
    abaGantt.setAttribute("aria-selected", String(aba === "gantt"));
    abaTempo.setAttribute("aria-selected", String(aba === "tempo"));
    abaGantt.setAttribute("tabindex", aba === "gantt" ? "0" : "-1");
    abaTempo.setAttribute("tabindex", aba === "tempo" ? "0" : "-1");
    const d = dadosAtuais();
    situacao.textContent = d?.passagens.length ? `${d.passagens.length} passagem(ns)` : "";
    desenharProgresso();
    desenharAviso();
    desenharPainel();
    desenharRodape();
  }

  desenhar();
  // O “há quanto tempo” do rodapé não pode ficar parado no “agora há pouco”.
  const relogioDoRodape = setInterval(() => {
    if (!destruida) desenharRodape();
  }, 30_000);
  (relogioDoRodape as unknown as { unref?: () => void }).unref?.();
  const pronta = (async () => {
    if (ctx.sigiloso) return;
    // Dentro de 30 minutos: do cache, sem rede. Vencido: mostra o que há, desatualizado, e atualiza.
    const g = await historicoGuardado(ctx);
    if (destruida) return;
    if (g && !g.vale) {
      const anterior = dadosDe(g.historico.andamentos, g.historico.coletadoEm, ctx.agora());
      estado = { tipo: "coletando", feito: 0, total: 0, cancelando: false, anterior };
      desenhar();
    }
    await coletar(false);
  })();

  return {
    el: raiz,
    estado: () => estado,
    destruir() {
      destruida = true;
      clearInterval(relogioDoRodape);
      controle?.abort();
      desligarEixos?.();
    },
    pronta,
  };
}

export type { ColetorHistorico };
