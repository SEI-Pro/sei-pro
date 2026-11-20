/** Configuração do modal do Comparador; a mecânica vive em `@comum/ui/modalIframe`. */

import { EVENTO_ABRIR } from "@cd/modelo/constantes";
import type { ConfigModal } from "@comum/ui/modalIframe";

export const CONFIG_MODAL: ConfigModal = {
  evento: EVENTO_ABRIR,
  titulo: "Comparar Documentos",
  atributoIframe: "data-spro-comparador-modal",
  seletorItemMenu: "#iconCompareDocs",
  classeAviso: "spro-comparador-aviso",
  textoSemModal: "Não foi possível abrir o Comparador de Documentos nesta tela. Recarregue a página (F5) e tente de novo.",
};

/**
 * Liga o modal só com a opção `comparardocumentos` do legado ligada. Desligada, o botão normalmente nem existe, mas o
 * legado lê a opção por outro caminho: se as duas leituras divergirem e o botão aparecer, o clique não pode sumir em
 * silêncio, então `semOpcao` liga o aviso de "não foi possível abrir".
 */
export async function armarSeLigado(opcaoLigada: () => Promise<boolean>, armar: () => void, semOpcao?: () => void): Promise<boolean> {
  if (!(await opcaoLigada())) {
    semOpcao?.();
    return false;
  }
  armar();
  return true;
}
