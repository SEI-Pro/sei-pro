/**
 * Content script do Comparador de Documentos (mundo isolado, document_start). Marca o documento de forma síncrona (o
 * `initDialogCompareDocs` do legado passa a só disparar o evento) e, só na janela de topo, com a opção
 * `comparardocumentos` ligada e o login lido, liga o modal ao botão da barra do processo. Sem contexto ou com a
 * opção desligada, o clique no botão (se o legado o desenhar) mostra um aviso em vez de sumir.
 */

import { CANAL_COMPARADOR, OPCAO_LEGADA } from "@cd/modelo/constantes";
import { lerOpcaoLegada } from "@comum/opcoes/legadas";
import { corDoTemaSei, manterTemaNoContexto, seiEscuro } from "@comum/pagina/tema";
import type { PortaRpc } from "@comum/ponte/rpc";
import { criarControleModal, ligarAvisoSemModal } from "@comum/ui/modalIframe";
import { Sei } from "@nucleo/sei";
import { documentoTopo, paginaDe } from "@nucleo/sessao/pagina";
import { type ContextoComparador, contextoComparador, selecionadoNaArvore } from "./contexto";
import { tratadoresComparador } from "./executor";
import { marcarAtivo } from "./marca";
import { armarSeLigado, CONFIG_MODAL } from "./modal";

marcarAtivo(document);

let avisoLigado = false;
function semModal(): void {
  if (avisoLigado) return;
  avisoLigado = true;
  ligarAvisoSemModal(document, CONFIG_MODAL);
}

const global = window as unknown as { __seiProComparador?: boolean };
if (window === window.top && !global.__seiProComparador) {
  global.__seiProComparador = true;
  const iniciar = () =>
    void armarSeLigado(
      () => lerOpcaoLegada(OPCAO_LEGADA),
      () =>
        void principal().catch((e) => {
          console.warn("[SEI Pro] comparador:", e);
          semModal();
        }),
      semModal,
    ).catch((e) => {
      // Opção ilegível: o legado já só dispara o evento, então sem ninguém ouvindo o clique sumiria em silêncio.
      console.warn("[SEI Pro] comparador: opção ilegível", e);
      semModal();
    });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  else iniciar();
}

async function principal(): Promise<void> {
  const topo = documentoTopo();
  const ctx = contextoComparador(topo, { temaEscuro: seiEscuro(document, localStorage), corTema: corDoTemaSei(topo) }, topo.location?.href);
  if (!ctx) {
    semModal();
    return;
  }
  manterTemaNoContexto(topo, localStorage, ctx);
  ligarModal(ctx);
}

function ligarModal(ctx: ContextoComparador): void {
  const sei = new Sei(location.href, () => paginaDe(document, location.href));
  criarControleModal(document, CONFIG_MODAL, {
    // O tema vai no endereço: o app já nasce com o esquema de cores do iframe (sem fundo opaco).
    urlApp: () => chrome.runtime.getURL(`html/comparador-documentos.html#modo=modal&tema=${ctx.temaEscuro ? "escuro" : "claro"}`),
    temaEscuro: ctx.temaEscuro,
    conectar: () => chrome.runtime.connect({ name: CANAL_COMPARADOR }) as unknown as PortaRpc,
    tratadores: (fechar, minimizar) =>
      tratadoresComparador({
        sei,
        ctx,
        // A seleção muda sem recarregar a tela: lida a cada abertura (pedido `contexto`).
        selecionado: () => selecionadoNaArvore(document.querySelector<HTMLIFrameElement>("#ifrArvore")?.contentDocument ?? null),
        fechar,
        minimizar,
      }),
  });
}
