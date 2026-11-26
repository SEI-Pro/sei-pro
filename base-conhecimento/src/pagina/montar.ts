/**
 * Montagem da Base de Conhecimento em pastas na tela nativa.
 *
 * Lê os itens, sobe a árvore, liga a sincronia (Texto Padrão da unidade) e
 * monta o painel em Shadow DOM, a coluna "Pasta" e o botão "Pastas". As
 * operações de escrita pedem o "Entendi" na primeira vez e nunca tocam nos itens
 * do SEI: só em pastas e vínculos.
 *
 * As perguntas de UI (nome, confirmação, escolha de pasta, aviso) são injetadas
 * — o main usa prompt/confirm e o aviso do SEI Pro; os testes usam fakes.
 */

import type { Area } from "@comum/armazenamento/area";
import type { ArmazemTexto } from "@comum/sincronia/controlePagina";
import type { StatusSync } from "@comum/sincronia/motor";
import type { Travar, TravarEsperando } from "@comum/sincronia/trava";
import { caminhoDaPasta, type Exibicao, montarExibicao, type PastaExibida, vinculosDesatualizados } from "../arvore/mesclar";
import type { EntidadesArvore, IdentidadeArvore } from "../arvore/modelo";
import { RepositorioArvore } from "../arvore/repositorio";
import { agrupadorDoTr } from "../nucleo/itens";
import type { ItemBase } from "../nucleo/tipos";
import { CHAVE_NUMERAR } from "../preferencias";
import { chaveStatus } from "../sincronia/envelope";
import type { PayloadArrasto } from "../ui/arrasto";
import type { AcaoAviso } from "../ui/aviso";
import { garantirBotaoPastas, ID_BOTAO, type Modo } from "../ui/botao";
import {
  atualizarCaption,
  contarLinhasVisiveis,
  filtrarPorPasta,
  ligarAoSortDaTabela,
  pintarPastas,
  prepararTabela,
  removerTabela,
} from "../ui/colunaPasta";
import { type AcoesPainel, montarPainel } from "../ui/painel";
import { armazemNaTela } from "./armazem";
import { consentimentoBase, type Perguntar, perguntarEntendi } from "./consentir";
import { gravarIntencao, lerIntencao, limparIntencao, sinalDeCriacao } from "./novaEmContexto";
import { ligarSincronia, type SincroniaBase } from "./sincronia";

export function telaAtual(url = globalThis.location?.href ?? ""): "listar" | "pesquisar" | "cadastrar" | null {
  let acao: string | null = null;
  try {
    acao = new URL(url).searchParams.get("acao");
  } catch {
    return null;
  }
  if (acao === "base_conhecimento_listar") return "listar";
  if (acao === "base_conhecimento_pesquisar") return "pesquisar";
  if (acao === "base_conhecimento_cadastrar") return "cadastrar";
  return null;
}

/** Roda `fn` quando o DOM estiver pronto (o content script nasce em document_start). */
export function quandoDomPronto(doc: Pick<Document, "readyState" | "addEventListener">, fn: () => void): void {
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", fn, { once: true });
  else fn();
}

export interface DepsMontar {
  doc: Document;
  url: string;
  area: Area;
  sync: Area;
  ident: IdentidadeArvore;
  contexto: { login: string; nome?: string; unidade: { id: string; sigla: string } };
  lerItens: () => Promise<ItemBase[]>;
  armazem: () => ArmazemTexto;
  perguntar: Perguntar;
  pedirTexto: (rotulo: string, valorInicial?: string) => Promise<string | null>;
  confirmar: (texto: string) => Promise<boolean>;
  escolherPasta: (pastas: PastaExibida[], atual: string | null, numerar?: boolean) => Promise<{ pasta: string | null } | null>;
  avisar: (texto: string, acao?: AcaoAviso) => void;
  idDispositivo: string;
  cssPainel: string;
  /** Numeração de ordem na exibição (preferência por navegador); nunca vai ao Texto Padrão. */
  numerar: boolean;
  /** Área da intenção de "Nova em contexto" (sessionStorage da aba no main; padrão: `area`). */
  intencao?: Area;
  janela: Pick<EventTarget, "addEventListener">;
  docEventos: Pick<EventTarget, "addEventListener"> & { readonly visibilityState: DocumentVisibilityState };
  agora?: () => number;
  travar?: Travar;
  travarEsperando?: TravarEsperando;
}

const AVISO_SO_LEITURA = "Indisponível nesta unidade: o SEI não deixa gravar o Texto Padrão com o seu perfil.";

/** Monta tudo e devolve o desfazer. Nunca rejeita: falha de leitura devolve a tela nativa. */
export async function montar(d: DepsMontar): Promise<() => void> {
  const doc = d.doc;
  const agora = d.agora ?? (() => Date.now());
  const intencaoArea = d.intencao ?? d.area;

  let itens: ItemBase[];
  try {
    itens = await d.lerItens();
  } catch (e) {
    console.warn("[SEI Pro] base-conhecimento: nao foi possivel ler a lista:", e);
    return () => undefined;
  }

  const repo = new RepositorioArvore({
    area: d.area,
    ident: d.ident,
    carimbo: () => ({ agora: agora(), dispositivo: d.idDispositivo }),
  });

  // Atualiza o título em cache dos vínculos (o real manda). Vínculo para pasta
  // que não existe mais volta para "Sem pasta" em vez de derrubar a montagem.
  const inicial = await repo.listar();
  const vivas = new Set(inicial.p.filter((p) => p.removidoEm === undefined).map((p) => p.id));
  for (const v of vinculosDesatualizados(inicial, itens)) {
    const item = itens.find((i) => i.agrupador === v.id);
    if (!item) continue;
    const destino = v.pasta !== null && vivas.has(v.pasta) ? v.pasta : null;
    try {
      await repo.moverVinculo(v.id, destino, item.titulo);
    } catch (e) {
      console.warn("[SEI Pro] base-conhecimento: nao foi possivel atualizar o titulo do vinculo:", e);
    }
  }

  let ent: EntidadesArvore = await repo.listar();
  let exibicao: Exibicao = montarExibicao(ent, itens);
  let selecionada: string | null | undefined;
  const recolhidas = new Set<string>(idsDasPastas(exibicao.pastas));
  let busca = "";
  let modo: Modo = "arvore";
  let status: StatusSync | null = null;

  let sync: SincroniaBase | null = null;
  try {
    sync = ligarSincronia({
      ctx: { host: d.ident.host, login: d.contexto.login, nome: d.contexto.nome },
      unidade: d.contexto.unidade,
      area: d.area,
      sync: d.sync,
      repo,
      armazem: d.armazem,
      travar: d.travar ?? (async (_nome, fn) => fn()),
      travarEsperando: d.travarEsperando ?? (async (_nome, fn) => fn()),
      janela: d.janela,
      doc: d.docEventos,
      temArmazem: () => armazemNaTela(doc, d.url),
    });
  } catch (e) {
    console.warn("[SEI Pro] base-conhecimento: sincronia nao ligada:", e);
  }

  const acoes: AcoesPainel = {
    aoSelecionar: (id) => {
      selecionada = id;
      render();
      focarPasta(id, "selecionar");
    },
    aoAlternarPasta: (id) => {
      if (recolhidas.has(id)) recolhidas.delete(id);
      else recolhidas.add(id);
      render();
      focarPasta(id, "chevron");
    },
    aoNovaPasta: (pai) => void novaPasta(pai),
    aoRenomear: (id) => void renomear(id),
    aoExcluir: (id) => void excluir(id),
    aoMoverItem: (agrupador) => void moverItem(agrupador),
    aoRemoverItem: (agrupador) => void esquecer(agrupador),
    aoBuscar: (texto) => {
      busca = texto;
      render();
    },
    aoSoltar: (payload, destino) => void soltar(payload, destino),
    aoMoverPasta: (id) => void moverPastaPorMenu(id),
    aoNumerar: (ligado) => {
      void d.area.gravar({ [CHAVE_NUMERAR]: ligado ? "sim" : "nao" });
    },
  };

  const painel = montarPainel(acoes, { doc, css: d.cssPainel });
  const areaTabela = doc.querySelector("#divInfraAreaTabela");
  let wrapper: HTMLElement | null = null;
  if (areaTabela?.parentNode) {
    wrapper = doc.createElement("div");
    wrapper.className = "d-flex align-items-start";
    areaTabela.parentNode.insertBefore(wrapper, areaTabela);
    wrapper.append(painel.host, areaTabela);
  }
  prepararTabela(doc, agrupadorDoTr);
  garantirBotaoPastas(doc, d.area, (m) => {
    modo = m;
    painel.host.style.display = m === "arvore" ? "" : "none";
    aplicarFiltro();
  });
  const desligarSort = ligarAoSortDaTabela(doc, () => aplicarFiltro());

  let vivo = true;

  // "Nova em contexto": com uma pasta selecionada, o clique em Nova registra a
  // intenção de uso único; o retorno do cadastro (sinal na URL) a consome.
  const btnNova = doc.querySelector("#btnNova");
  const aoClicarNova = (): void => {
    // Sem pasta visível selecionada (ou na lista plana): nada de contexto às cegas.
    if (modo !== "arvore" || selecionada === null || selecionada === undefined) return;
    const caminho = caminhoDaPasta(exibicao.pastas, selecionada, d.numerar);
    if (caminho === "") return; // a pasta selecionada não está mais na árvore viva
    void gravarIntencao(intencaoArea, d.ident, selecionada, caminho, agora());
  };
  btnNova?.addEventListener("click", aoClicarNova);

  async function lerStatus(): Promise<void> {
    status = ((await d.area.obter(chaveStatus))[chaveStatus] as StatusSync | undefined) ?? null;
  }
  await lerStatus();
  const desligarStatus = d.area.aoMudar((m) => {
    if (!(chaveStatus in m) || !vivo) return;
    void lerStatus().then(() => {
      if (vivo) render();
    });
  });

  let refreshPendente = false;
  const desligarMudancas = repo.aoMudar(() => {
    if (!vivo || refreshPendente) return;
    refreshPendente = true;
    queueMicrotask(() => {
      refreshPendente = false;
      if (vivo) void refrescar().catch((e) => console.warn("[SEI Pro] base-conhecimento: atualizacao", e));
    });
  });

  const somenteLeitura = (): boolean => status?.estado === "indisponivel";

  async function garantirEscrita(): Promise<boolean> {
    if (somenteLeitura()) {
      d.avisar(status?.mensagem ?? AVISO_SO_LEITURA);
      return false;
    }
    return garantirConsentimento();
  }

  async function garantirConsentimento(): Promise<boolean> {
    const porta = consentimentoBase(d.sync, d.ident.host, d.contexto.login, d.contexto.unidade.id);
    if ((await porta.estado()) === "ligado") return true;
    const aceitou = await perguntarEntendi(d.perguntar, d.contexto.unidade.sigla);
    if (!aceitou) {
      d.avisar('Sem o "Entendi", a organizacao nao e gravada no SEI.');
      return false;
    }
    await porta.definir("ligado");
    return true;
  }

  async function refrescar(): Promise<void> {
    ent = await repo.listar();
    exibicao = montarExibicao(ent, itens);
    render();
  }

  async function novaPasta(pai: string | null): Promise<void> {
    const nome = await d.pedirTexto("Nome da pasta", "");
    if (nome === null) return;
    if (!(await garantirEscrita())) return;
    try {
      const nova = await repo.criarPasta(nome, pai);
      if (pai !== null) recolhidas.delete(pai);
      selecionada = nova.id;
      await refrescar();
      d.avisar("Pasta criada.");
    } catch (e) {
      d.avisar(e instanceof Error ? e.message : String(e));
    }
  }

  async function renomear(id: string): Promise<void> {
    const atual = nomesDasPastas().get(id) ?? "";
    const nome = await d.pedirTexto("Renomear pasta", atual);
    if (nome === null) return;
    if (!(await garantirEscrita())) return;
    try {
      await repo.renomearPasta(id, nome);
      await refrescar();
    } catch (e) {
      d.avisar(e instanceof Error ? e.message : String(e));
    }
  }

  async function excluir(id: string): Promise<void> {
    const nome = nomesDasPastas().get(id) ?? "esta pasta";
    if (!(await d.confirmar(`Excluir a pasta "${nome}" e as subpastas? Os itens continuam no SEI e voltam para "Sem pasta".`))) return;
    if (!(await garantirEscrita())) return;
    try {
      await repo.excluirPasta(id);
      if (selecionada === id) selecionada = undefined;
      await refrescar();
    } catch (e) {
      d.avisar(e instanceof Error ? e.message : String(e));
    }
  }

  async function moverItem(agrupador: string): Promise<void> {
    const vinculo = ent.v.find((v) => v.id === agrupador && v.removidoEm === undefined);
    const escolha = await d.escolherPasta(exibicao.pastas, vinculo?.pasta ?? null, d.numerar);
    if (!escolha) return;
    if (!(await garantirEscrita())) return;
    const item = itens.find((i) => i.agrupador === agrupador);
    try {
      await repo.moverVinculo(agrupador, escolha.pasta, item?.titulo ?? vinculo?.titulo ?? "");
      await refrescar();
    } catch (e) {
      d.avisar(e instanceof Error ? e.message : String(e));
    }
  }

  async function esquecer(agrupador: string): Promise<void> {
    if (!(await d.confirmar("Esquecer este vinculo? O item continua no SEI."))) return;
    if (!(await garantirEscrita())) return;
    try {
      await repo.removerVinculo(agrupador);
      await refrescar();
    } catch (e) {
      d.avisar(e instanceof Error ? e.message : String(e));
    }
  }

  function subarvoreContem(lista: PastaExibida[], raizId: string, alvoId: string): boolean {
    const achar = (l: PastaExibida[]): PastaExibida | undefined => {
      for (const p of l) {
        if (p.id === raizId) return p;
        const f = achar(p.filhas);
        if (f) return f;
      }
      return undefined;
    };
    const raiz = achar(lista);
    if (!raiz) return false;
    const andar = (l: PastaExibida[]): boolean => l.some((p) => p.id === alvoId || andar(p.filhas));
    return raiz.id === alvoId || andar(raiz.filhas);
  }

  async function soltar(payload: PayloadArrasto, destino: string | null): Promise<void> {
    if (payload.tipo === "pasta") {
      await moverPastaPara(payload.id, destino);
      return;
    }

    const vinculo = ent.v.find((v) => v.id === payload.agrupador && v.removidoEm === undefined);
    const item = itens.find((i) => i.agrupador === payload.agrupador);
    const titulo = item?.titulo ?? vinculo?.titulo ?? "";
    const caminho = destino === null ? "Sem pasta" : caminhoDaPasta(exibicao.pastas, destino, d.numerar) || "Sem pasta";
    if (!(await d.confirmar(`Mover "${titulo}" para "${caminho}"?`))) return;
    if (!(await garantirEscrita())) return;
    try {
      await repo.moverVinculo(payload.agrupador, destino, titulo);
      if (destino !== null) recolhidas.delete(destino);
      await refrescar();
    } catch (e) {
      d.avisar(e instanceof Error ? e.message : String(e));
    }
  }

  async function moverPastaPara(id: string, destino: string | null): Promise<void> {
    if (destino === id) {
      d.avisar("Uma pasta não pode ir para dentro dela mesma.");
      return;
    }
    if (destino !== null && subarvoreContem(exibicao.pastas, id, destino)) {
      d.avisar("Uma pasta não pode ir para dentro de uma subpasta dela.");
      return;
    }
    const nome = nomesDasPastas().get(id) ?? "pasta";
    const caminho = destino === null ? "a raiz" : caminhoDaPasta(exibicao.pastas, destino, d.numerar) || "a raiz";
    if (!(await d.confirmar(`Você está movendo a PASTA "${nome}" (com subpastas e itens) para "${caminho}". Confirmar?`))) return;
    if (!(await garantirEscrita())) return;
    try {
      await repo.moverPasta(id, destino);
      if (destino !== null) recolhidas.delete(destino);
      await refrescar();
    } catch (e) {
      d.avisar(e instanceof Error ? e.message : String(e));
    }
  }

  async function moverPastaPorMenu(id: string): Promise<void> {
    const escolha = await d.escolherPasta(exibicao.pastas, paiDaPasta(id), d.numerar);
    if (!escolha) return;
    await moverPastaPara(id, escolha.pasta);
  }

  function paiDaPasta(id: string): string | null {
    const achar = (lista: PastaExibida[]): PastaExibida | undefined => {
      for (const p of lista) {
        if (p.id === id) return p;
        const f = achar(p.filhas);
        if (f) return f;
      }
      return undefined;
    };
    return achar(exibicao.pastas)?.pai ?? null;
  }

  function focarPasta(id: string | null, tipo: "chevron" | "selecionar"): void {
    const raizShadow = painel.host.shadowRoot;
    if (!raizShadow) return;
    const seletor = id === null ? ".sem-pasta" : tipo === "chevron" ? `[data-pasta-id="${id}"].chevron` : `[data-pasta-id="${id}"].pasta`;
    (raizShadow.querySelector(seletor) as HTMLElement | null)?.focus();
  }

  function nomesDasPastas(): Map<string, string> {
    const mapa = new Map<string, string>();
    const indexar = (lista: PastaExibida[]): void => {
      for (const p of lista) {
        mapa.set(p.id, p.nome);
        indexar(p.filhas);
      }
    };
    indexar(exibicao.pastas);
    return mapa;
  }

  function agrupadoresDaPasta(id: string | null | undefined): Set<string> | null {
    if (id === undefined) return null; // nenhuma pasta selecionada: a tabela inteira
    if (id === null) return new Set(exibicao.semPasta.map((i) => i.agrupador));
    return new Set(ent.v.filter((v) => v.removidoEm === undefined && v.pasta === id).map((v) => v.id));
  }

  function itensPorPasta(): Record<string, ItemBase[]> {
    const porAgrupador = new Map(itens.map((i) => [i.agrupador, i]));
    const mapa: Record<string, ItemBase[]> = {};
    for (const v of ent.v) {
      if (v.removidoEm !== undefined || v.pasta === null) continue;
      const item = porAgrupador.get(v.id);
      if (!item) continue;
      const lista = mapa[v.pasta];
      if (lista) lista.push(item);
      else mapa[v.pasta] = [item];
    }
    return mapa;
  }

  function idsDasPastas(pastas: PastaExibida[]): string[] {
    const ids: string[] = [];
    const andar = (lista: PastaExibida[]): void => {
      for (const p of lista) {
        ids.push(p.id);
        andar(p.filhas);
      }
    };
    andar(pastas);
    return ids;
  }

  function rotuloDe(agrupador: string): string {
    const vinculo = ent.v.find((v) => v.id === agrupador && v.removidoEm === undefined);
    if (!vinculo || vinculo.pasta === null) return "Sem pasta";
    return caminhoDaPasta(exibicao.pastas, vinculo.pasta, d.numerar) || "Sem pasta";
  }

  function aplicarFiltro(): void {
    pintarPastas(doc, rotuloDe);
    if (modo === "lista" || busca.trim() !== "") {
      const filtro =
        busca.trim() === ""
          ? null
          : new Set(itens.filter((i) => i.titulo.toLowerCase().includes(busca.trim().toLowerCase())).map((i) => i.agrupador));
      filtrarPorPasta(doc, filtro);
      atualizarCaption(doc, contarLinhasVisiveis(doc));
      return;
    }
    filtrarPorPasta(doc, agrupadoresDaPasta(selecionada));
    atualizarCaption(doc, contarLinhasVisiveis(doc));
  }

  function render(): void {
    painel.render({
      pastas: exibicao.pastas,
      semPasta: exibicao.semPasta,
      orfaos: exibicao.orfaos,
      selecionada,
      busca,
      aviso: somenteLeitura() ? (status?.mensagem ?? AVISO_SO_LEITURA) : undefined,
      itensPorPasta: itensPorPasta(),
      recolhidas,
      numerar: d.numerar,
    });
    aplicarFiltro();
  }

  async function aplicarIntencao(): Promise<void> {
    const sinal = sinalDeCriacao(d.url);
    const intencao = await lerIntencao(intencaoArea, d.ident, agora());
    if (!sinal) {
      // Lista comum (cancelou ou voltou sem criar): a intenção não vale mais.
      if (intencao) await limparIntencao(intencaoArea);
      return;
    }
    if (!intencao) return;

    const item = itens.find((i) => i.id === sinal.id);
    if (!item) {
      await limparIntencao(intencaoArea);
      d.avisar("O documento criado não foi localizado na lista; organize-o manualmente.");
      return;
    }

    const agrupador = item.agrupador;
    const vivo = ent.v.find((v) => v.id === agrupador && v.removidoEm === undefined);
    if (vivo && vivo.pasta !== null) {
      // Já organizado (por um colega ou por outra aba): não sobrescreve.
      await limparIntencao(intencaoArea);
      return;
    }

    if (!nomesDasPastas().has(intencao.pastaId)) {
      await limparIntencao(intencaoArea);
      d.avisar("A pasta escolhida não existe mais; o documento ficou em Sem pasta.");
      return;
    }

    const mover = async (): Promise<void> => {
      // Relê antes de gravar: o aviso com ação pode ter esperado um colega
      // organizar o item nesse meio-tempo (regra 6).
      const atual = await repo.listar();
      const existente = atual.v.find((v) => v.id === agrupador && v.removidoEm === undefined);
      if (existente && existente.pasta !== null) {
        await limparIntencao(intencaoArea);
        return;
      }
      await repo.moverVinculo(agrupador, intencao.pastaId, item.titulo);
      const criado = (await repo.listar()).v.find((v) => v.id === agrupador && v.removidoEm === undefined);
      const carimbo = criado ? { atualizadoEm: criado.atualizadoEm, dispositivo: criado.dispositivo } : null;
      await limparIntencao(intencaoArea);
      recolhidas.delete(intencao.pastaId);
      await refrescar();
      d.avisar(`Documento criado em "${intencao.caminho}".`, {
        rotulo: "Desfazer",
        fazer: () => {
          void (async () => {
            const agoraEnt = await repo.listar();
            const atualLink = agoraEnt.v.find((v) => v.id === agrupador && v.removidoEm === undefined);
            const aindaNosso =
              atualLink !== undefined &&
              atualLink.pasta === intencao.pastaId &&
              carimbo !== null &&
              atualLink.atualizadoEm === carimbo.atualizadoEm &&
              atualLink.dispositivo === carimbo.dispositivo;
            if (!aindaNosso) {
              d.avisar("A organização deste documento mudou; nada foi desfeito.");
              return;
            }
            await repo.removerVinculo(agrupador);
            await refrescar();
          })().catch((e) => d.avisar(e instanceof Error ? e.message : String(e)));
        },
      });
    };

    if (somenteLeitura()) {
      await limparIntencao(intencaoArea);
      d.avisar("Documento criado em Sem pasta.");
      return;
    }

    const porta = consentimentoBase(d.sync, d.ident.host, d.contexto.login, d.contexto.unidade.id);
    if ((await porta.estado()) !== "ligado") {
      d.avisar(`Documento criado em Sem pasta. Aceite o "Entendi" para organizá-lo em "${intencao.caminho}".`, {
        rotulo: "Entendi e organizar",
        fazer: () => {
          void (async () => {
            const aceitou = await perguntarEntendi(d.perguntar, d.contexto.unidade.sigla);
            if (!aceitou) {
              await limparIntencao(intencaoArea);
              return;
            }
            await porta.definir("ligado");
            await mover();
          })().catch((e) => d.avisar(e instanceof Error ? e.message : String(e)));
        },
      });
      return;
    }

    try {
      await mover();
    } catch (e) {
      d.avisar(e instanceof Error ? e.message : String(e));
    }
  }

  render();
  // A intenção é acessório: falha de storage não derruba a tela já montada.
  await aplicarIntencao().catch((e) => console.warn("[SEI Pro] base-conhecimento: intencao:", e));

  return () => {
    vivo = false;
    btnNova?.removeEventListener("click", aoClicarNova);
    desligarMudancas();
    desligarStatus();
    desligarSort();
    sync?.parar();
    painel.destruir();
    if (wrapper?.parentNode && areaTabela) wrapper.parentNode.insertBefore(areaTabela, wrapper);
    wrapper?.remove();
    doc.querySelector(`#${ID_BOTAO}`)?.remove();
    removerTabela(doc);
    atualizarCaption(doc, contarLinhasVisiveis(doc));
  };
}
