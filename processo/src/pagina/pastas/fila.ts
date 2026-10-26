/**
 * Fila de carregamento das pastas da árvore: abre as pastas ainda não carregadas UMA POR VEZ, pelo mesmo caminho do
 * usuário (o clique no "+" da pasta, `ancjoinPASTAn`), e espera cada uma terminar antes de pedir a próxima.
 *
 * Por que assim: o SEI carrega os documentos de uma pasta por um formulário que posta no `#ifrPasta` (`procedimento_paginar`).
 * Há UM `#ifrPasta` por quadro: um segundo clique antes de a primeira pasta voltar CANCELA a primeira (ela fica
 * "Aguarde..." para sempre). Por isso a fila nunca tem duas pastas em carga, e o módulo não faz requisição nenhuma:
 * quem pede ao servidor é o próprio SEI (ver `memory/project_arvore_marca_recebido.md`: nunca buscar a árvore por conta própria).
 *
 * O estado vem do DOM (a fila não guarda lista): a cada passo a próxima pasta é a primeira ainda pendente na ordem da
 * árvore. Isso torna a fila idempotente e resistente a recarga da árvore, pasta aberta pelo usuário e subpastas
 * descobertas (entram na posição em que aparecem na árvore, logo depois da mãe: profundidade primeiro).
 *
 * Fim da carga de uma pasta (sem tempo fixo): o nó "Aguarde..." (`AGUARDEn`) some (veio conteúdo) ou ganha a mensagem de
 * erro/vazio do SEI. Observa-se a árvore por `MutationObserver`; um relógio lento só serve de reserva. Prazo por pasta.
 */

import { normalizarTexto } from "@comum/texto";

export type EstadoPasta = "ausente" | "pendente" | "carregada" | "falhou";

export type Fase =
  /** Nada rodando e nada a retomar. */
  | "ociosa"
  | "carregando"
  /** Aba oculta: espera ficar visível para pedir a próxima pasta. */
  | "pausada"
  /** Acabou: todas as pastas conhecidas foram tratadas (há `falhas` se alguma não carregou). */
  | "concluida"
  /** O usuário parou (ou o filtro foi limpo): restam pastas fechadas. */
  | "parada"
  /** Atingiu o teto da rodada: restam pastas, o usuário decide continuar. */
  | "teto"
  /** Parou sozinha: sessão expirada ou falhas em sequência. */
  | "interrompida";

export interface EstadoFila {
  fase: Fase;
  /** Id da pasta em carga (`PASTA2`), ou null. */
  atual: string | null;
  /** Nome da pasta em carga ("II"). */
  nomeAtual: string;
  /** Pastas tratadas nesta rodada (carregadas ou falhas). */
  feitas: number;
  /** Tratadas + a em carga + as que faltam (cresce quando subpastas aparecem). */
  total: number;
  /** Pastas ainda por carregar (sem as que falharam). */
  restantes: number;
  /** Pastas que não carregaram (erro ou prazo). */
  falhas: string[];
  motivo?: "sessao" | "falhas" | "ocupada";
}

export interface OpcoesFila {
  /** Espera mínima entre o fim de uma pasta e o pedido da próxima. */
  intervaloMs?: number;
  /** Prazo para uma pasta terminar de carregar. */
  prazoPastaMs?: number;
  /** Máximo de pastas por rodada; acima disso a fila para e pergunta. */
  teto?: number;
  /** Falhas em sequência que interrompem a rodada. */
  falhasSeguidas?: number;
  Observador?: typeof MutationObserver;
  /** Substitui o clique no "+" (testes e quem tem outro caminho). Devolve quando o pedido foi feito. */
  abrir?: (doc: Document, idPasta: string) => unknown;
  /**
   * Abre também as pastas já carregadas mas fechadas (sem pedido ao servidor: o conteúdo está no DOM do SEI), para o que
   * casa com o filtro ficar à vista. Padrão: sim. O aviso de não assinados só verifica e desliga isto.
   */
  abrirCarregadas?: boolean;
  /** A sessão expirou? Padrão: o `#ifrPasta` trouxe a tela de login. */
  sessaoExpirada?: (doc: Document) => boolean;
}

export interface Fila {
  /** Começa a carregar as pastas pendentes. Não faz nada se já está rodando ou se não há o que carregar. */
  iniciar(): void;
  /** Para: a pasta em carga termina (não dá para cancelar o pedido do SEI), nenhuma outra é pedida. */
  parar(): void;
  /** Retoma depois de `parada`/`teto`/`interrompida`; as que falharam também voltam a ser tentadas. */
  continuar(): void;
  /** Tenta de novo só as que falharam (e as que faltam). */
  tentarDeNovo(): void;
  /**
   * Para e zera o estado (o filtro foi limpo ou fechado). Com `refechar`, fecha as pastas que A FILA abriu e que o usuário
   * não tocou (ao fim da pasta em carga, se houver).
   */
  encerrar(refechar: boolean): void;
  estado(): EstadoFila;
  /** Pastas ainda por carregar, na ordem da árvore (sem as que falharam nesta sessão). */
  pendentes(): string[];
  /** Ouve mudanças de estado. Devolve quem desfaz. */
  aoMudar(fn: (e: EstadoFila) => void): () => void;
  destruir(): void;
}

export const ATR_PASTA = "data-spro-pasta";
export const ATR_FILA_ATIVA = "data-spro-pastas-fila";

const INTERVALO_PADRAO_MS = 500;
const PRAZO_PADRAO_MS = 15_000;
export const TETO_PADRAO = 60;
const FALHAS_SEGUIDAS_PADRAO = 3;
/** Quanto tempo a marca de "fila rodando" vale sem ser renovada (outra instância não fura a vez). */
const VALIDADE_MARCA_MS = 30_000;
const RESERVA_MS = 300;

const ID_PASTA = /^anchor(PASTA\d+)$/;

/** O nó "Aguarde..." de uma pasta (`AGUARDEn`), com o texto que o SEI deixou nele. */
function textoDoAguarde(doc: Document, idPasta: string): string | null {
  const n = idPasta.replace("PASTA", "");
  const el = doc.getElementById(`spanAGUARDE${n}`);
  return el ? (el.textContent ?? "") : null;
}

/** A pasta já tem documentos (ou o SEI disse que está vazia)? Falhou? Ainda pendente? Sumiu da árvore? */
export function estadoDaPasta(doc: Document, idPasta: string): EstadoPasta {
  if (!doc.getElementById(`anchor${idPasta}`)) return "ausente";
  const div = doc.getElementById(`div${idPasta}`);
  if (!div) return "pendente";
  if (div.querySelector('a[id^="anchor"]:not([id*="AGUARDE"])')) return "carregada";
  const t = textoDoAguarde(doc, idPasta);
  if (t === null) return div.children.length > 0 ? "carregada" : "pendente";
  const n = normalizarTexto(t);
  if (n.startsWith("nenhum protocolo")) return "carregada";
  if (n.startsWith("erro") || n.startsWith("nao foi possivel")) return "falhou";
  return "pendente";
}

/** A pasta está aberta na tela? (o SEI põe `display: block` no `div` dos filhos e troca o "+" por "-"). */
export function pastaAberta(doc: Document, idPasta: string): boolean {
  const div = doc.getElementById(`div${idPasta}`);
  if (div?.style.display === "block") return true;
  if (div?.style.display === "none") return false;
  return /minus/.test(doc.getElementById(`join${idPasta}`)?.getAttribute("src") ?? "");
}

/** Todas as pastas da árvore, na ordem em que aparecem. */
export function todasAsPastas(doc: Document): string[] {
  const ids: string[] = [];
  for (const a of doc.querySelectorAll('a[id^="anchorPASTA"]')) {
    const m = ID_PASTA.exec(a.id);
    if (m) ids.push(m[1] as string);
  }
  return ids;
}

/** O nome que a árvore mostra ("II"). */
export function nomeDaPasta(doc: Document, idPasta: string): string {
  return (doc.getElementById(`span${idPasta}`)?.textContent ?? "").trim() || idPasta.replace("PASTA", "");
}

/** O `#ifrPasta` trouxe a tela de login (a sessão expirou)? */
export function sessaoExpiradaNoQuadro(doc: Document): boolean {
  try {
    const d = (doc.getElementById("ifrPasta") as HTMLIFrameElement | null)?.contentDocument;
    return !!d?.querySelector('#pwdSenha, input[name="pwdSenha"], #txtUsuario, #frmLogin');
  } catch {
    return false;
  }
}

/** Clique do usuário no "+" da pasta (o nome abre por `javascript:`, que o mundo isolado não executa). */
function clicarNaPasta(doc: Document, idPasta: string): boolean {
  const ancora = doc.getElementById(`ancjoin${idPasta}`) ?? doc.getElementById(`anchor${idPasta}`);
  if (!ancora) return false;
  // O href é `javascript:`: sem isto o clique do mundo isolado ainda tentaria executá-lo e o navegador registraria erro de CSP.
  ancora.addEventListener("click", (ev) => ev.preventDefault(), { once: true, capture: true });
  (ancora as HTMLElement).click();
  return true;
}

const dorme = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export function criarFila(doc: Document, opcoes: OpcoesFila = {}): Fila {
  const intervaloMs = opcoes.intervaloMs ?? INTERVALO_PADRAO_MS;
  const prazoMs = opcoes.prazoPastaMs ?? PRAZO_PADRAO_MS;
  const teto = opcoes.teto ?? TETO_PADRAO;
  const maxFalhasSeguidas = opcoes.falhasSeguidas ?? FALHAS_SEGUIDAS_PADRAO;
  const Observador =
    opcoes.Observador ??
    (doc.defaultView as unknown as { MutationObserver?: typeof MutationObserver } | null)?.MutationObserver ??
    globalThis.MutationObserver;
  const sessaoExpirada = opcoes.sessaoExpirada ?? sessaoExpiradaNoQuadro;
  const marca = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

  let fase: Fase = "ociosa";
  let motivo: EstadoFila["motivo"];
  let atual: string | null = null;
  let feitas = 0;
  let execucao = 0;
  let morta = false;
  /** Pastas que não carregaram nesta sessão (a fila não insiste nelas até `continuar`/`tentarDeNovo`). */
  let falhas = new Set<string>();
  /** Pastas que a fila abriu (estavam fechadas) e o usuário não tocou: as únicas que ela fecha depois. */
  const abertasPorNos = new Set<string>();
  const tocadasPeloUsuario = new Set<string>();
  let refecharAoFim = false;
  let clicandoNos = false;
  const ouvintes = new Set<(e: EstadoFila) => void>();

  /** Pastas que a fila já pediu (ou tentou): se ficam abertas e sem conteúdo, estão travadas, não carregando pelo usuário. */
  const pedidasPorNos = new Set<string>();
  /** Por carregar: sem conteúdo (ou com a mensagem de erro do SEI de uma tentativa anterior), fora as que falharam aqui. */
  const pendentes = (): string[] =>
    todasAsPastas(doc).filter((id) => {
      const e = estadoDaPasta(doc, id);
      return (e === "pendente" || e === "falhou") && !falhas.has(id);
    });

  const estado = (): EstadoFila => {
    const resta = pendentes().filter((id) => id !== atual).length;
    return {
      fase,
      atual,
      nomeAtual: atual ? nomeDaPasta(doc, atual) : "",
      feitas,
      total: feitas + (atual ? 1 : 0) + resta,
      restantes: resta + (atual ? 1 : 0),
      falhas: [...falhas],
      motivo,
    };
  };

  const marcarNaArvore = (id: string, valor: "carregando" | "falhou" | null): void => {
    const a = doc.getElementById(`anchor${id}`);
    if (!a) return;
    if (valor === null) a.removeAttribute(ATR_PASTA);
    else if (a.getAttribute(ATR_PASTA) !== valor) a.setAttribute(ATR_PASTA, valor);
  };

  const emitir = (): void => {
    const e = estado();
    for (const fn of [...ouvintes]) {
      try {
        fn(e);
      } catch {
        // um ouvinte com defeito não derruba a fila
      }
    }
  };

  const raiz = doc.documentElement;
  const renovarMarca = (): void => raiz.setAttribute(ATR_FILA_ATIVA, `${marca}:${Date.now()}`);
  const soltarMarca = (): void => {
    if ((raiz.getAttribute(ATR_FILA_ATIVA) ?? "").startsWith(`${marca}:`)) raiz.removeAttribute(ATR_FILA_ATIVA);
  };
  /** Outra instância (outro módulo no mesmo quadro) está carregando pastas? */
  const outraFilaAtiva = (): boolean => {
    const v = raiz.getAttribute(ATR_FILA_ATIVA);
    if (!v || v.startsWith(`${marca}:`)) return false;
    const t = Number(v.split(":")[1]);
    return Number.isFinite(t) && Date.now() - t < VALIDADE_MARCA_MS;
  };

  /** Clique do usuário nas pastas ou dentro delas: a fila não mexe mais nessa pasta. */
  const aoClique = (ev: Event): void => {
    // Antes de a fila começar valem os cliques de antes do filtro: a pasta que o usuário fechou então é aberta pelo filtro e devolvida.
    if (clicandoNos || fase === "ociosa") return;
    const alvo = ev.target as Element | null;
    if (!alvo?.closest) return;
    const pasta = alvo.closest('a[id^="ancjoinPASTA"], a[id^="anchorPASTA"], div[id^="divPASTA"]');
    if (!pasta) return;
    const m = /(PASTA\d+)$/.exec(pasta.id);
    if (m) tocadasPeloUsuario.add(m[1] as string);
  };
  doc.addEventListener("click", aoClique, true);

  const aguardarVisivel = async (minha: number): Promise<void> => {
    if (!doc.hidden) return;
    fase = "pausada";
    emitir();
    await new Promise<void>((resolver) => {
      const ver = (): void => {
        if (!doc.hidden || morta || minha !== execucao) {
          doc.removeEventListener("visibilitychange", ver);
          clearInterval(reserva);
          resolver();
        }
      };
      const reserva = setInterval(ver, 1000);
      doc.addEventListener("visibilitychange", ver);
    });
    if (minha === execucao && !morta) {
      fase = "carregando";
      emitir();
    }
  };

  /** Pastas com conteúdo no DOM mas fechadas na tela: abrir não faz pedido nenhum, só mostra o que o filtro achou. */
  const paraAbrir = (): string[] =>
    opcoes.abrirCarregadas === false
      ? []
      : todasAsPastas(doc).filter((id) => {
          if (tocadasPeloUsuario.has(id) || pastaAberta(doc, id)) return false;
          const div = doc.getElementById(`div${id}`);
          return estadoDaPasta(doc, id) === "carregada" && !!div?.querySelector('a[id^="anchor"]:not([id*="AGUARDE"])');
        });

  /** Alguma pasta está aberta esperando o SEI sem ter sido pedida por esta fila (a do usuário, por exemplo)? */
  const outraEmCarga = (): boolean =>
    todasAsPastas(doc).some((p) => estadoDaPasta(doc, p) === "pendente" && pastaAberta(doc, p) && !pedidasPorNos.has(p));

  const esperarLivre = async (minha: number): Promise<void> => {
    const limite = Date.now() + prazoMs;
    while (outraEmCarga() && Date.now() < limite && minha === execucao && !morta) await dorme(100);
  };

  type Resultado = "ok" | "falhou" | "tempo" | "sumiu" | "cancelada";

  const esperarPasta = (id: string): Promise<Resultado> =>
    new Promise((resolver) => {
      let acabou = false;
      let obs: MutationObserver | null = null;
      let reserva: ReturnType<typeof setInterval> | undefined;
      let limite: ReturnType<typeof setTimeout> | undefined;
      const terminar = (r: Resultado): void => {
        if (acabou) return;
        acabou = true;
        obs?.disconnect();
        clearInterval(reserva);
        clearTimeout(limite);
        resolver(r);
      };
      const conferir = (): void => {
        if (morta) terminar("cancelada");
        else {
          const e = estadoDaPasta(doc, id);
          if (e === "carregada") terminar("ok");
          else if (e === "falhou") terminar("falhou");
          else if (e === "ausente") terminar("sumiu");
        }
        // Mesmo parada ou reiniciada, a espera segue até o fim da pasta em carga (o pedido do SEI não se cancela).
      };
      if (typeof Observador === "function") {
        obs = new Observador(conferir);
        const alvo = doc.getElementById("divArvore") ?? doc.body ?? raiz;
        obs.observe(alvo, { childList: true, subtree: true, characterData: true });
      }
      reserva = setInterval(conferir, RESERVA_MS);
      limite = setTimeout(() => terminar("tempo"), prazoMs);
      conferir();
    });

  /**
   * Clique da fila no "+" da pasta, com o foco e a rolagem da página guardados e devolvidos: o SEI seleciona a pasta aberta
   * (dá foco ao nó dela) e o navegador rola até lá, o que tiraria a barra do filtro (e o andamento) da vista.
   */
  const clicarComFoco = (id: string, vezes: number): boolean => {
    const ativoAntes = doc.activeElement as HTMLElement | null;
    const janela = doc.defaultView;
    const x = janela?.scrollX ?? 0;
    const y = janela?.scrollY ?? 0;
    clicandoNos = true;
    let ok = true;
    try {
      for (let i = 0; i < vezes && ok; i += 1) ok = clicarNaPasta(doc, id);
    } finally {
      clicandoNos = false;
    }
    // O clique não deveria mexer no foco, mas se a busca o perdeu, ela o recupera.
    if (ativoAntes && doc.activeElement !== ativoAntes && ativoAntes.isConnected) {
      try {
        ativoAntes.focus({ preventScroll: true });
      } catch {
        // sem foco programático
      }
    }
    if (janela && typeof janela.scrollTo === "function" && (janela.scrollX !== x || janela.scrollY !== y)) janela.scrollTo(x, y);
    return ok;
  };

  /** Faz o pedido da pasta pelo clique do usuário. Devolve se alguma coisa foi (ou deveria ser) pedida. */
  const pedir = async (id: string): Promise<boolean> => {
    if (opcoes.abrir) {
      pedidasPorNos.add(id);
      await opcoes.abrir(doc, id);
      return true;
    }
    const estavaAberta = pastaAberta(doc, id);
    pedidasPorNos.add(id);
    // Aberta e ainda sem conteúdo (pedido anterior perdido): fecha e abre de novo, senão o clique só a fecharia.
    const ok = clicarComFoco(id, estavaAberta ? 2 : 1);
    if (!estavaAberta) abertasPorNos.add(id);
    return ok;
  };

  const refecharAsAbertas = (): void => {
    for (const id of [...abertasPorNos]) {
      abertasPorNos.delete(id);
      if (tocadasPeloUsuario.has(id)) continue;
      if (!pastaAberta(doc, id)) continue;
      const div = doc.getElementById(`div${id}`);
      // A pasta com o documento selecionado (ou em carga) fica como está.
      if (div?.querySelector(".infraArvoreNoSelecionado")) continue;
      if (estadoDaPasta(doc, id) === "pendente") continue;
      clicandoNos = true;
      try {
        clicarNaPasta(doc, id);
      } finally {
        clicandoNos = false;
      }
    }
  };

  const limparMarcas = (): void => {
    for (const a of doc.querySelectorAll(`[${ATR_PASTA}]`)) a.removeAttribute(ATR_PASTA);
  };

  const rodar = async (minha: number): Promise<void> => {
    let seguidas = 0;
    let ultimaTerminou = 0;
    fase = "carregando";
    motivo = undefined;
    emitir();
    try {
      for (;;) {
        if (minha !== execucao || morta) return;
        await aguardarVisivel(minha);
        if (minha !== execucao || morta) return;
        for (const id of paraAbrir()) {
          if (clicarComFoco(id, 1)) abertasPorNos.add(id);
        }
        const prox = pendentes()[0];
        if (!prox) {
          fase = "concluida";
          return;
        }
        if (feitas >= teto) {
          fase = "teto";
          return;
        }
        // Intervalo mínimo desde o fim da pasta anterior (e a vez de outra instância).
        const falta = ultimaTerminou ? intervaloMs - (Date.now() - ultimaTerminou) : 0;
        if (falta > 0) await dorme(falta);
        if (minha !== execucao || morta) return;
        if (outraFilaAtiva()) {
          fase = "interrompida";
          motivo = "ocupada";
          return;
        }
        await esperarLivre(minha);
        if (minha !== execucao || morta) return;
        if (!pendentes().includes(prox)) {
          await dorme(10); // alguém a carregou nesse meio-tempo
          continue;
        }
        atual = prox;
        renovarMarca();
        marcarNaArvore(prox, "carregando");
        emitir();
        const pedido = await pedir(prox).catch(() => false);
        const r: Resultado = pedido ? await esperarPasta(prox) : "falhou";
        marcarNaArvore(prox, null);
        atual = null;
        if (minha !== execucao || morta) {
          // Parada ou encerrada durante a carga: a pasta terminou, nada mais é pedido.
          if (refecharAoFim) {
            refecharAoFim = false;
            refecharAsAbertas();
          }
          emitir();
          return;
        }
        ultimaTerminou = Date.now();
        if (r === "ok") {
          seguidas = 0;
          feitas += 1;
        } else if (r === "sumiu") {
          // A árvore foi refeita por baixo: não é falha; recalcula a partir do DOM novo.
          await dorme(Math.min(intervaloMs, 200));
        } else {
          feitas += 1;
          falhas.add(prox);
          marcarNaArvore(prox, "falhou");
          seguidas += 1;
          if (sessaoExpirada(doc)) {
            fase = "interrompida";
            motivo = "sessao";
            return;
          }
          if (seguidas >= maxFalhasSeguidas) {
            fase = "interrompida";
            motivo = "falhas";
            return;
          }
        }
        emitir();
      }
    } finally {
      if (minha === execucao) {
        atual = null;
        soltarMarca();
        if ((fase as Fase) === "carregando" || (fase as Fase) === "pausada") fase = "concluida";
        if (refecharAoFim) {
          refecharAoFim = false;
          refecharAsAbertas();
        }
        emitir();
      }
    }
  };

  const comecar = (): void => {
    if (morta) return;
    if (fase === "carregando" || fase === "pausada") return;
    if (!pendentes().length && !paraAbrir().length) return;
    if (outraFilaAtiva()) {
      fase = "interrompida";
      motivo = "ocupada";
      emitir();
      return;
    }
    execucao += 1;
    feitas = 0;
    renovarMarca(); // reserva a vez já: outra instância não fura enquanto esta espera a primeira pasta
    void rodar(execucao);
  };

  return {
    iniciar() {
      // Só retoma sozinha de "ociosa"/"concluida": parada, teto e interrompida pedem uma ação do usuário.
      if (fase === "parada" || fase === "teto" || fase === "interrompida") return;
      comecar();
    },
    parar() {
      if (fase !== "carregando" && fase !== "pausada") return;
      execucao += 1; // o laço em andamento sai assim que a pasta em carga terminar
      fase = "parada";
      soltarMarca();
      emitir();
    },
    continuar() {
      falhas = new Set();
      limparMarcasDeFalha();
      fase = "ociosa";
      comecar();
    },
    tentarDeNovo() {
      falhas = new Set();
      limparMarcasDeFalha();
      fase = "ociosa";
      comecar();
    },
    encerrar(refechar) {
      execucao += 1;
      const emCarga = atual !== null;
      fase = "ociosa";
      motivo = undefined;
      feitas = 0;
      falhas = new Set();
      limparMarcas();
      if (refechar) {
        if (emCarga) refecharAoFim = true;
        else refecharAsAbertas();
      } else {
        abertasPorNos.clear();
      }
      tocadasPeloUsuario.clear();
      soltarMarca();
      emitir();
    },
    estado,
    pendentes,
    aoMudar(fn) {
      ouvintes.add(fn);
      return () => ouvintes.delete(fn);
    },
    destruir() {
      morta = true;
      execucao += 1;
      doc.removeEventListener("click", aoClique, true);
      limparMarcas();
      soltarMarca();
      ouvintes.clear();
    },
  };

  function limparMarcasDeFalha(): void {
    for (const a of doc.querySelectorAll(`[${ATR_PASTA}="falhou"]`)) a.removeAttribute(ATR_PASTA);
  }
}
