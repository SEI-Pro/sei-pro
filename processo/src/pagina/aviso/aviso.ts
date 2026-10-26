/**
 * O aviso na tela "Enviar Processo" (`acao=procedimento_enviar`, um quadro aninhado no visualizador): uma linha na barra
 * de localização, no lugar do `#checkNaoAssinados` do legado, e o diálogo "Documentos pendentes de assinatura".
 *
 * A árvore vem do quadro da árvore (`#ifrArvore` da janela de topo, mesma origem): nenhuma requisição, e o histórico só
 * entra se já estiver no cache de 30 min (spec 8.2: nenhum recurso coleta histórico sozinho). O diálogo abre sozinho
 * quando há pendentes, como no legado; um clique em "Detalhes" o abre de novo.
 *
 * Documentos de pastas fechadas não existem na tela (o SEI só os traz quando a pasta é aberta). Em vez de fingir que
 * está tudo assinado, o aviso diz quantas pastas faltam verificar e oferece "Verificar pastas": clica nas pastas
 * fechadas da árvore pela fila de pastas (`../pastas/fila.ts`): uma de cada vez, como o usuário faria (o SEI carrega cada uma
 * por conta própria).
 */
import { h, icone } from "@comum/ui/dom";
import type { Arvore, DocumentoArvore } from "@nucleo/dominio/arvore";
import { pastasFechadas } from "../../capa/cards";
import { garantirEstilo, temaEscuro } from "../estilo";
import { lerDocumentoDoDom } from "../filtro/dom";
import { DocumentosDaTela, idDoNo } from "../menuDoc/documentos";
import { abrirDialogo } from "../modais/comum";
import { criarFila, type OpcoesFila } from "../pastas/fila";
import { comDatas, type Pendente, pendentesDaUnidade } from "./modelo";

export const ID_AVISO = "spro-na-nao-assinados";

export interface DepsAviso {
  /** O quadro do Enviar Processo. */
  doc: Document;
  /** A janela de topo (onde o diálogo abre). */
  topo: Document;
  /** O documento do quadro da árvore, ou null se ele não está acessível. */
  quadroDaArvore(): Document | null;
  /** A árvore que o quadro tem na tela, ou null enquanto não vier. */
  lerArvore(quadro: Document): Arvore | null;
  /** Sigla da unidade do usuário. */
  unidade: string;
  /** Datas de geração do histórico completo SE ele já está no cache e vale; senão null (nunca coleta). */
  datas(): Promise<ReadonlyMap<string, string> | null>;
  /** Substitui o clique no "+" da pasta (a fila espera os documentos chegarem do mesmo jeito). Nos testes, um falso. */
  abrirPasta?(quadro: Document, idPasta: string): Promise<unknown>;
  /** Ajustes da fila de pastas (os testes encurtam os tempos). */
  opcoesFila?: OpcoesFila;
}

export interface Aviso {
  /** Refaz a verificação (a árvore pode ter mudado). */
  verificar(): void;
  remover(): void;
}

/** Onde a linha entra: a barra de localização do SEI (a mesma do legado); sem ela, antes do formulário. */
function lugarDoAviso(doc: Document): { pai: Element; antes: Element | null } | null {
  const barra = doc.getElementById("divInfraBarraLocalizacao");
  if (barra) return { pai: barra, antes: null };
  const form = doc.getElementById("frmAtividadeListar");
  return form?.parentElement ? { pai: form.parentElement, antes: form } : null;
}

/** Seleciona o documento na árvore (o mesmo clique do usuário). */
export function selecionarNaArvore(quadro: Document, id: string): boolean {
  const a = quadro.getElementById(`anchor${id}`);
  if (!a) return false;
  (a as HTMLElement).click();
  a.scrollIntoView?.({ block: "center" });
  return true;
}

/**
 * Os documentos que a árvore mostra agora: os do modelo (lidos da página) e os que o DOM tem a mais (pastas que o usuário
 * abriu depois, cujos nós o SEI inseriu na árvore). O DOM só entra para o que o modelo não conhece.
 */
export function documentosDaArvore(quadro: Document, arv: Pick<Arvore, "documentos">): DocumentoArvore[] {
  const tela = new DocumentosDaTela(arv.documentos);
  tela.lerDoIframe(quadro);
  for (const a of quadro.querySelectorAll("#divArvore a[id^='anchor']")) {
    const id = idDoNo(a.id, "anchor");
    if (!id || tela.obter(id)) continue;
    const d = lerDocumentoDoDom(quadro, id);
    if (d) tela.somar(d);
  }
  return tela.todos();
}

export function montarAviso(d: DepsAviso): Aviso | null {
  const lugar = lugarDoAviso(d.doc);
  if (!lugar || d.doc.getElementById(ID_AVISO)) return null;
  garantirEstilo(d.doc);
  const raiz = h("div", { id: ID_AVISO, class: "spro-na", role: "status", "aria-live": "polite" });
  if (temaEscuro(d.doc)) raiz.setAttribute("data-tema", "escuro");
  lugar.pai.insertBefore(raiz, lugar.antes);
  let aberto = false;
  let verificando = false;
  let primeira = true;

  const sigla = (): HTMLElement => h("strong", {}, d.unidade);
  const pintar = (
    estado: "pendente" | "ok" | "falha",
    icon: Parameters<typeof icone>[0],
    texto: Array<Node | string>,
    ...acoes: HTMLElement[]
  ) => {
    raiz.className = `spro-na ${estado}`;
    raiz.replaceChildren(h("span", { class: "spro-na-icone", "aria-hidden": "true" }, icone(icon, 15)), h("span", {}, ...texto), ...acoes);
  };
  const link = (rotulo: string, aoClicar: () => void): HTMLButtonElement => {
    const b = h("button", { type: "button", class: "spro-p-link" }, rotulo);
    b.addEventListener("click", aoClicar);
    return b;
  };

  /**
   * Carrega as pastas fechadas pela fila (uma de cada vez, o mesmo clique no "+" do usuário) e verifica de novo. O aviso só
   * verifica: não abre as pastas que já estavam carregadas e não fecha nenhuma.
   */
  const verificarPastas = async (quadro: Document, _ids: string[]): Promise<void> => {
    if (verificando) return;
    verificando = true;
    const fila = criarFila(quadro, {
      ...d.opcoesFila,
      abrirCarregadas: false,
      ...(d.abrirPasta ? { abrir: (q: Document, id: string) => d.abrirPasta?.(q, id) } : {}),
    });
    const parar = link("Parar", () => fila.parar());
    fila.aoMudar((e) => {
      if (e.fase !== "carregando" && e.fase !== "pausada") return;
      const nome = e.nomeAtual ? `: ${e.nomeAtual}` : "";
      pintar(
        "falha",
        "atualizar",
        [`Carregando as pastas da árvore (${Math.min(e.feitas + 1, Math.max(e.total, 1))} de ${Math.max(e.total, 1)}${nome})...`],
        parar,
      );
    });
    try {
      pintar("falha", "atualizar", ["Carregando as pastas da árvore..."], parar);
      fila.iniciar();
      await new Promise<void>((resolver) => {
        const fim = (): void => {
          const f = fila.estado().fase;
          if (f === "carregando" || f === "pausada") return;
          desfazer();
          resolver();
        };
        const desfazer = fila.aoMudar(fim);
        fim();
      });
    } finally {
      fila.destruir();
      verificando = false;
    }
    primeira = true;
    verificar();
  };

  const abrirDetalhes = (pendentes: Pendente[], quadro: Document, fechadas: string[]): void => {
    if (aberto) return;
    aberto = true;
    const lista = h("ul", { class: "spro-p-lista-modal spro-na-lista", "aria-label": "Documentos não assinados" });
    const desenhar = (itens: Pendente[]) =>
      lista.replaceChildren(
        ...itens.map((p) => {
          const botao = h(
            "button",
            { type: "button", class: "spro-p-link", "aria-label": `Selecionar na árvore: ${p.titulo} (${p.numero})` },
            icone("documento", 14),
            `${p.titulo} (${p.numero})`,
          );
          botao.addEventListener("click", () => {
            dlg.fechar();
            selecionarNaArvore(quadro, p.id);
          });
          return h("li", { class: "spro-p-linha-modal" }, botao, p.data ? h("span", { class: "spro-na-data" }, p.data) : null);
        }),
      );
    desenhar(pendentes);
    const verificarAgora = link("Verificar pastas", () => {
      dlg.fechar();
      void verificarPastas(quadro, fechadas);
    });
    const dlg = abrirDialogo(
      { topo: d.topo, doc: d.doc },
      {
        titulo: "Documentos pendentes de assinatura",
        icone: "caneta",
        largura: 700,
        conteudo: [
          h(
            "p",
            { class: "spro-p-nota" },
            pendentes.length === 1
              ? `Existe 1 documento não assinado na unidade ${d.unidade}.`
              : `Existem ${pendentes.length} documentos não assinados na unidade ${d.unidade}.`,
          ),
          lista,
          fechadas.length > 0
            ? h(
                "p",
                { class: "spro-p-nota" },
                `${fechadas.length === 1 ? "1 pasta fechada não foi verificada" : `${fechadas.length} pastas fechadas não foram verificadas`}: o SEI só traz os documentos de uma pasta quando ela é aberta. `,
                verificarAgora,
              )
            : null,
        ],
        aoFechar: () => {
          aberto = false;
        },
      },
    );
    // O histórico só vale se já estava no cache; a data chega depois, sem atrasar a lista.
    void d.datas().then((datas) => {
      if (datas && dlg.el.isConnected) desenhar(comDatas(pendentes, datas));
    });
  };

  const verificar = (): void => {
    if (verificando) return;
    const quadro = d.quadroDaArvore();
    const arv = quadro ? d.lerArvore(quadro) : null;
    if (!quadro || !arv) {
      pintar(
        "falha",
        "alerta",
        ["Não foi possível verificar os documentos não assinados na unidade ", sigla()],
        link("Tentar de novo", verificar),
      );
      return;
    }
    const documentos = documentosDaArvore(quadro, arv);
    const pendentes = pendentesDaUnidade(documentos, d.unidade);
    const fechadas = pastasFechadas({ pagina: arv.pagina, documentos });
    const rotuloPastas =
      fechadas.length === 1 ? "1 pasta fechada ainda não foi verificada" : `${fechadas.length} pastas fechadas ainda não foram verificadas`;
    const botaoPastas = fechadas.length ? link("Verificar pastas", () => void verificarPastas(quadro, fechadas)) : null;
    if (!pendentes.length) {
      if (botaoPastas) {
        pintar(
          "falha",
          "alerta",
          ["Nenhum documento não assinado na unidade ", sigla(), ` na árvore aberta; ${rotuloPastas}`],
          botaoPastas,
        );
      } else {
        pintar("ok", "check", ["Todos os documentos foram assinados na unidade ", sigla()]);
      }
      return;
    }
    pintar(
      "pendente",
      "alerta",
      ["Existem documentos não assinados na unidade ", sigla()],
      link("Detalhes", () => abrirDetalhes(pendentes, quadro, fechadas)),
      ...(botaoPastas ? [botaoPastas] : []),
    );
    if (primeira) abrirDetalhes(pendentes, quadro, fechadas);
    primeira = false;
  };
  verificar();

  return {
    verificar,
    remover: () => raiz.remove(),
  };
}
