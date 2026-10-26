/**
 * Quando a capa se desenha. A capa mora no quadro do visualizador; os dados moram no quadro da árvore (único dono da
 * escrita da loja, spec 8.1). Aqui a capa:
 *  - lê a árvore direto do quadro vizinho (mesma origem, sem rede: é a que o usuário já vê);
 *  - lê o cache do processo e o do histórico (chrome.storage) e reage a `onChanged`;
 *  - pede ao quadro da árvore o que faltar, por evento (`ponte`), e nunca busca nada por conta própria;
 *  - só desenha com o nó do processo selecionado (o critério do legado) e NÃO se redesenha em loop: um desenho por
 *    mudança de dado, agrupado, e nenhum quando a vista não mudou.
 * Tudo o que toca o navegador entra por `DepsCapa`, para os testes trocarem por falsos.
 */
import type { Arvore } from "@nucleo/dominio/arvore";
import { calcularPassagens, type Passagem } from "@nucleo/dominio/passagens";
import { type HistoricoGuardado, historicoVale } from "../modelo/dados";
import { aguardarArvore, tentarLerArvore } from "../pagina/leituraArvore";
import {
  type AcoesDaCapa,
  copiarInfo,
  criarRaiz,
  desenharBarra,
  desenharCampos,
  desenharFaixa,
  desenharLado,
  ID_DA_CAPA,
  type PartesDaCapa,
} from "./capa";
import type { EstadoContagem } from "./cards";
import { lerDaTela } from "./pastas";
import { recebimentoDoLegado } from "./parado";
import { resumoDoProcesso } from "./resumo";
import { resolverTamanho } from "../modelo/tamanhoPasta";
import { assinaturaDaVista, type EstadoColeta, type FatiasLidas, montarVista, type VistaCapa } from "./vista";

/** O quadro da árvore, visto da capa. */
export interface PonteDaArvore {
  /** O documento do quadro da árvore agora (ele recarrega e troca de documento), ou null. */
  documento(): Document | null;
  pedirFatias(): void;
  calcular(): void;
  cancelar(): void;
  abrirHistorico(): void;
  /** "Contar tudo": carrega as pastas fechadas (uma por vez) no quadro da árvore. Ausente = a ponte não sabe contar. */
  contar?(): void;
  pararContagem?(): void;
  contagem?(): EstadoContagem;
  /** Avisa quando a árvore da tela muda (pasta que carrega) ou o andamento da contagem muda. */
  aoMudarArvore?(cb: () => void): () => void;
  coleta(): EstadoColeta | "pronto";
  /** Avisa mudança do estado da coleta (atributo do <html> da árvore). */
  aoMudarColeta(cb: () => void): () => void;
  /** Avisa quando o quadro da árvore recarrega (outro documento). */
  aoRecarregarArvore(cb: () => void): () => void;
}

export interface FonteDeCache {
  fatias(): Promise<FatiasLidas>;
  historico(): Promise<HistoricoGuardado | null>;
  aoMudar(cb: () => void): () => void;
}

export interface DepsCapa {
  /** O documento da capa (o quadro do visualizador). */
  doc: Document;
  ponte: PonteDaArvore;
  cache(arv: Arvore): FonteDeCache;
  agora(): Date;
  /** Sigla da unidade do usuário (cabeçalho do SEI). */
  unidade: string;
  /** Dias para o alerta de parado; 0 desliga. */
  limite: number;
  /**
   * localStorage da origem do SEI: leitura de `configDataRecebimentoPro` e de `optionsPro.sumDocsPasta` (legado); escrita só
   * do tamanho da pasta que o módulo aprende (`processo/pasta-tamanho/<host>`). Sem `setItem`, o módulo só lê.
   */
  armazenamento: Pick<Storage, "getItem"> & Partial<Pick<Storage, "setItem">>;
  /** Host do SEI (chave do tamanho da pasta). Padrão: o do documento da capa. */
  host?: string;
  linkPermanente(idProcedimento: string): string;
  copiar(texto: string): Promise<boolean>;
  avisar(texto: string, ms?: number): void;
  escuro(): boolean;
  /** Cor do tema do SEI (barra do sistema), para o destaque da capa; sem ela fica o azul padrao. */
  corTema?(): string | undefined;
  aoMudarTema(cb: () => void): () => void;
  /** Quanto esperar a árvore e a seleção (ms). */
  prazoMs?: number;
  /** Depois de quanto tempo sem resposta do quadro da árvore os campos viram "indisponível" (ms). */
  esperaMs?: number;
  /** Por que a capa não foi desenhada (só diagnóstico: `console.debug` no content script). */
  depurar?: (motivo: string) => void;
  /** Para os testes: o `MutationObserver` que vigia o quadro da capa. */
  Observador?: typeof MutationObserver;
}

export interface Capa {
  raiz: HTMLElement;
  /** Quantas vezes alguma parte foi redesenhada (para provar que não há laço). */
  desenhos(): number;
  /** Redesenha se algo mudou (a vista é comparada). */
  atualizar(): void;
  destruir(): void;
}

const PRAZO_PADRAO_MS = 15_000;
const ESPERA_PADRAO_MS = 8_000;

/** O nó do processo está selecionado na árvore? (O legado só desenhava assim.) */
export function processoSelecionado(arvoreDoc: Document, idProcedimento: string): boolean {
  return arvoreDoc.getElementById(`span${idProcedimento}`)?.classList.contains("infraArvoreNoSelecionado") ?? false;
}

/** Espera o nó do processo ficar selecionado (a árvore o marca quando o usuário clica ou a página carrega). */
function aguardarSelecao(arvoreDoc: Document, id: string, prazoMs: number): Promise<boolean> {
  return new Promise((resolver) => {
    if (processoSelecionado(arvoreDoc, id)) return resolver(true);
    const janela = arvoreDoc.defaultView;
    const Observador =
      (janela as unknown as { MutationObserver?: typeof MutationObserver } | null)?.MutationObserver ?? globalThis.MutationObserver;
    let acabou = false;
    const fim = (r: boolean) => {
      if (acabou) return;
      acabou = true;
      obs?.disconnect();
      clearTimeout(limite);
      clearInterval(reserva);
      resolver(r);
    };
    const checar = () => {
      if (processoSelecionado(arvoreDoc, id)) fim(true);
    };
    const obs = typeof Observador === "function" ? new Observador(checar) : null;
    obs?.observe(arvoreDoc.documentElement, { attributes: true, attributeFilter: ["class"], subtree: true });
    const reserva = setInterval(checar, 250);
    const limite = setTimeout(() => fim(false), prazoMs);
  });
}

/** Inicia a capa: devolve `null` se não há onde desenhar, a árvore não veio ou o processo não está selecionado. */
export async function montarCapa(d: DepsCapa): Promise<Capa | null> {
  const doc = d.doc;
  const desistir = (motivo: string): null => {
    d.depurar?.(motivo);
    return null;
  };
  const conteiner = doc.getElementById("divArvoreHtml");
  if (!conteiner) return desistir("sem #divArvoreHtml");
  const prazo = d.prazoMs ?? PRAZO_PADRAO_MS;
  let arvoreDoc = d.ponte.documento();
  if (!arvoreDoc) return desistir("sem o documento do quadro da \u00E1rvore");
  const inicial = await aguardarArvore(arvoreDoc, prazo);
  if (!inicial) return desistir("a \u00E1rvore n\u00E3o chegou no prazo");
  let arv: Arvore = inicial;
  if (!(await aguardarSelecao(arvoreDoc, arv.idProcedimento, prazo)))
    return desistir("o n\u00F3 do processo n\u00E3o est\u00E1 selecionado");

  const fonte = d.cache(arv);
  const sigiloso = arv.nivel === "sigiloso";
  // Sem nada no cache a capa ainda sai (cards da árvore, número, tipo, nível): o cache só enriquece.
  let fatias: FatiasLidas = {};
  let historico: HistoricoGuardado | null = null;
  const ler = async () => {
    try {
      [fatias, historico] = sigiloso ? [{}, null] : await Promise.all([fonte.fatias(), fonte.historico()]);
    } catch {
      /* cache indisponível: segue com o que há */
    }
  };
  await ler();

  const partes: PartesDaCapa = criarRaiz();
  let espera: "aguardando" | "desistiu" = "aguardando";
  let desenhos = 0;
  let ultimaFaixa = "";
  let ultimaCampos = "";
  let ultimaBarra = "";
  let ultimoLado = "";
  let ultimaArvore = "";
  let vista: VistaCapa | null = null;
  let destruida = false;
  let agendado: ReturnType<typeof setTimeout> | null = null;
  let validade: ReturnType<typeof setTimeout> | null = null;
  let limiteDeEspera: ReturnType<typeof setTimeout> | null = null;

  const acoes: AcoesDaCapa = {
    calcular: () => d.ponte.calcular(),
    contar: () => d.ponte.contar?.(),
    pararContagem: () => d.ponte.pararContagem?.(),
    cancelar: () => d.ponte.cancelar(),
    abrirHistorico: () => d.ponte.abrirHistorico(),
    copiarResumo: () => {
      if (!vista) return;
      void d.copiar(resumoDoProcesso(vista.resumo)).then((ok) => d.avisar(ok ? "Resumo copiado." : "Não foi possível copiar.", 2200));
    },
    copiarTexto: (t) => void d.copiar(t).then((ok) => d.avisar(ok ? "Copiado." : "Não foi possível copiar.", 1800)),
    copiarLink: () => {
      if (!vista) return;
      void d.copiar(vista.linkPermanente).then((ok) => d.avisar(ok ? "Link do processo copiado." : "Não foi possível copiar.", 2200));
    },
    tentarDeNovo: () => {
      espera = "aguardando";
      iniciarEspera();
      d.ponte.pedirFatias();
      agendar();
    },
  };

  const passagensValidas = (): Passagem[] | null => {
    if (!historico || !historicoVale(historico.coletadoEm, d.agora().getTime())) return null;
    return calcularPassagens(historico.andamentos, d.agora());
  };

  const estadoDaColeta = (): EstadoColeta => {
    const c = d.ponte.coleta();
    return c === "pronto" ? { fase: "parada" } : c;
  };

  const desenhar = () => {
    agendado = null;
    if (destruida) return;
    // O quadro da árvore pode ter recarregado: a árvore e o documento são os de agora.
    const atual = d.ponte.documento();
    if (atual && atual !== arvoreDoc) {
      arvoreDoc = atual;
      const nova = tentarLerArvore(atual);
      if (nova && nova.idProcedimento === arv.idProcedimento) arv = nova;
    }
    const passagens = sigiloso ? null : passagensValidas();
    // As pastas que a árvore mostra agora: delas se aprende o tamanho da página (persistente) e se estima o total.
    const tela = lerDaTela(arvoreDoc, arv);
    const ultimaTopo = [...tela.pastas].reverse().find((p) => p.topo);
    const tamanho = resolverTamanho(
      tela.pastas.filter((p) => p.topo).map((p) => ({ carregada: p.carregada, nos: p.nos, ultima: p === ultimaTopo })),
      d.armazenamento,
      d.host ?? doc.location?.host ?? "",
    );
    vista = montarVista({
      tela,
      tamanho,
      contagem: d.ponte.contagem?.() ?? { fase: "parada" },
      podeContar: !!d.ponte.contar,
      arv,
      fatias,
      passagens,
      unidade: d.unidade,
      agora: d.agora(),
      limite: d.limite,
      recebidoEm: sigiloso ? null : recebimentoDoLegado(d.armazenamento, arv.idProcedimento),
      coleta: estadoDaColeta(),
      espera,
      linkPermanente: d.linkPermanente(arv.idProcedimento),
    });
    const faixa = JSON.stringify([vista.cards, vista.coleta]);
    const campos = assinaturaDaVista({ ...vista, cards: [], coleta: { fase: "parada" }, resumo: { protocolo: "", sigiloso: false } });
    const barra = String(vista.sigiloso);
    const lado = vista.linkPermanente;
    if (faixa !== ultimaFaixa) {
      ultimaFaixa = faixa;
      desenharFaixa(partes, vista, acoes);
      desenhos++;
    }
    if (campos !== ultimaCampos) {
      ultimaCampos = campos;
      desenharCampos(partes, vista, acoes);
      desenhos++;
    }
    if (barra !== ultimaBarra) {
      ultimaBarra = barra;
      desenharBarra(partes, vista, acoes);
      desenhos++;
    }
    if (lado !== ultimoLado) {
      ultimoLado = lado;
      desenharLado(partes, vista, doc);
      desenhos++;
    }
    // O histórico vence em 30 minutos: um único relógio refaz a faixa (sem laço) quando ele vencer.
    if (validade) clearTimeout(validade);
    validade = null;
    if (historico && passagens) {
      const resta = historico.coletadoEm + 30 * 60 * 1000 - d.agora().getTime();
      if (resta > 0 && resta < 2 ** 31 - 1) validade = setTimeout(agendar, resta + 1000);
    }
  };

  function agendar(): void {
    if (destruida || agendado) return;
    agendado = setTimeout(desenhar, 0);
  }

  function iniciarEspera(): void {
    if (limiteDeEspera) clearTimeout(limiteDeEspera);
    limiteDeEspera = setTimeout(() => {
      if (!fatias.dadosProcesso && !sigiloso) {
        espera = "desistiu";
        agendar();
      }
    }, d.esperaMs ?? ESPERA_PADRAO_MS);
  }

  /**
   * Onde a capa fica: dentro do #divArvoreHtml, no lugar de qualquer capa antiga (a do legado, se ainda desenhou). O SEI
   * às vezes reescreve esse quadro DEPOIS de nós (medido: no processo sigiloso, depois da senha) e leva a capa junto; por
   * isso é um vigia de filhos, não um relógio: a capa só volta quando alguém a tira.
   */
  const ajustar = (): void => {
    const alvo = doc.getElementById("divArvoreHtml");
    if (!alvo) return;
    for (const antiga of alvo.querySelectorAll(`#${ID_DA_CAPA}:not([data-spro-capa])`)) antiga.remove();
    alvo.classList.remove("d-flex");
    if (partes.raiz.parentElement !== alvo) alvo.prepend(partes.raiz);
    // O aviso do SEI ("Processo aberto somente na unidade X") vai para o lado da capa; o original sai da frente.
    const info = doc.getElementById("divArvoreInformacao") ?? doc.getElementById("divInformacao");
    if (info && !info.hasAttribute("data-spro-copiado")) {
      copiarInfo(partes, info);
      info.setAttribute("data-spro-copiado", "1");
      (info as HTMLElement).style.display = "none";
    }
  };
  ajustar();
  const Observador =
    d.Observador ??
    (doc.defaultView as unknown as { MutationObserver?: typeof MutationObserver } | null)?.MutationObserver ??
    globalThis.MutationObserver;
  const vigia =
    typeof Observador === "function"
      ? new Observador((mudancas) => {
          if (destruida) return;
          // Só importa o que mexe fora da própria capa (os redesenhos dela, por dentro, não contam).
          if (!mudancas.some((m) => !partes.raiz.contains(m.target as Node))) return;
          const pai = partes.raiz.parentElement;
          if (
            pai?.id === "divArvoreHtml" &&
            doc.contains(partes.raiz) &&
            doc.getElementById("divArvoreInformacao")?.hasAttribute("data-spro-copiado") !== false
          )
            return;
          ajustar();
        })
      : null;
  vigia?.observe(doc.body ?? doc.documentElement, { childList: true, subtree: true });

  const aplicarTema = () => {
    partes.raiz.setAttribute("data-tema", d.escuro() ? "escuro" : "claro");
    const cor = d.corTema?.();
    if (cor) {
      partes.raiz.style.setProperty("--spro-cor-sei", cor);
      partes.raiz.setAttribute("data-cor-sei", "");
    } else {
      partes.raiz.style.removeProperty("--spro-cor-sei");
      partes.raiz.removeAttribute("data-cor-sei");
    }
  };
  aplicarTema();
  desenhar();

  const sair: Array<() => void> = [
    fonte.aoMudar(() => {
      void ler().then(agendar);
    }),
    d.ponte.aoMudarColeta(() => {
      if (d.ponte.coleta() === "pronto") void ler().then(agendar);
      else agendar();
    }),
    d.ponte.aoRecarregarArvore(agendar),
    // A árvore muda por motivos que não importam à capa (ícones, filtro): só redesenha quando as pastas ou a contagem mudam.
    d.ponte.aoMudarArvore?.(() => {
      const atual = d.ponte.documento() ?? arvoreDoc;
      const assinatura = `${JSON.stringify(lerDaTela(atual, arv).pastas)}|${JSON.stringify(d.ponte.contagem?.() ?? null)}`;
      if (assinatura === ultimaArvore) return;
      ultimaArvore = assinatura;
      agendar();
    }) ?? (() => {}),
    d.aoMudarTema(aplicarTema),
  ];

  if (!sigiloso && !fatias.dadosProcesso) iniciarEspera();
  if (!sigiloso) d.ponte.pedirFatias();

  return {
    raiz: partes.raiz,
    desenhos: () => desenhos,
    atualizar: agendar,
    destruir() {
      destruida = true;
      vigia?.disconnect();
      for (const s of sair) s();
      for (const t of [agendado, validade, limiteDeEspera]) if (t) clearTimeout(t);
    },
  };
}
