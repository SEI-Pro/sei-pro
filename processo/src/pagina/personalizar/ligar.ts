/**
 * Como a tela "Personalizar menu rápido" abre:
 *  - pelo item "Personalizar menu" do menu da árvore (`menuDoc/ligar.ts`), direto;
 *  - pelo legado (`configFlashMenuPro`, janela de topo, mundo da página): dispara `spro-processo-personalizar-abrir` no documento
 *    do quadro da árvore, onde este content script (mundo isolado) escuta; a confirmação volta num atributo do <html> (ver
 *    `ATRIBUTO_PERSONALIZAR_ACK`), e sem ela o legado abre a janela dele.
 * O modal abre na janela de topo (o quadro da árvore é estreito). Ele não depende do processo: a personalização vale para todos.
 */
import { opcaoLegadaLigada } from "@comum/opcoes/legadas";
import { ATRIBUTO_PERSONALIZAR_ACK, EVENTO_ABRIR_PERSONALIZAR } from "../../modelo/constantes";
import type { IdAba } from "./catalogo";
import { abrirPersonalizar, type DepsPersonalizar, type PersonalizarAberto } from "./modal";
import type { Arm } from "./modelo";

/** Quando a opção geral do SEI Pro está desligada, as escolhas da aba só valem depois de ligá-la: a tela avisa. */
export function avisosDasOpcoes(dataValues: unknown): Partial<Record<IdAba, string>> {
  const avisos: Partial<Record<IdAba, string>> = {};
  if (!opcaoLegadaLigada(dataValues, "menurapido")) {
    const t = "O menu rápido está desligado nas Opções do SEI Pro. Estas escolhas ficam salvas e passam a valer quando você o ligar.";
    avisos.processo = t;
    avisos.documentos = t;
    avisos.arvore = t;
  }
  if (!opcaoLegadaLigada(dataValues, "infoarvore")) {
    avisos.painel =
      "Os painéis da árvore estão desligados nas Opções do SEI Pro. Estas escolhas ficam salvas e passam a valer quando você os ligar.";
  }
  return avisos;
}

export interface DepsAbertura {
  /** O quadro da árvore. */
  doc: Document;
  topo: () => Document;
  armazenamento: Arm;
  /** `chrome.storage.sync.dataValues` (só para os avisos). */
  dataValues: () => Promise<unknown>;
  /** Para os testes. */
  abrir?: (d: DepsPersonalizar) => PersonalizarAberto;
}

/** A função que abre a tela (na aba pedida), com os avisos das opções gerais. */
export function criarAbertura(d: DepsAbertura): (aba?: IdAba) => void {
  return (aba) => {
    void d
      .dataValues()
      .catch(() => undefined)
      .then((dv) =>
        (d.abrir ?? abrirPersonalizar)({
          topo: d.topo(),
          doc: d.doc,
          armazenamento: d.armazenamento,
          ...(aba ? { aba } : {}),
          avisos: avisosDasOpcoes(dv),
        }),
      )
      .catch((e) => console.warn("[SEI Pro] personalizar menu:", e));
  };
}

/** Escuta o pedido do legado. Devolve o desligador. */
export function ligarPersonalizar(doc: Document, abrir: (aba?: IdAba) => void): () => void {
  const aoPedir = () => {
    // Síncrono: o legado confere o atributo logo depois de disparar o evento.
    doc.documentElement?.setAttribute(ATRIBUTO_PERSONALIZAR_ACK, "1");
    abrir();
  };
  doc.addEventListener(EVENTO_ABRIR_PERSONALIZAR, aoPedir);
  return () => doc.removeEventListener(EVENTO_ABRIR_PERSONALIZAR, aoPedir);
}
