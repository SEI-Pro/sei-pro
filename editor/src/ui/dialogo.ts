import { criarAbrirModal } from "@comum/ui/dialogo";

export interface OpcoesDialogo {
  titulo: string;
  conteudo: HTMLElement;
  aoFechar?: () => void;
}

export type AbrirDialogo = (doc: Document, o: OpcoesDialogo) => { fechar(): void };

/**
 * Cria `abrirDialogo` com o CSS base do `sei-comum` injetado UMA vez por documento
 * (`<style data-seipro-editor="base">`). O CSS entra por parametro para os testes nao carregarem `.css`.
 *
 * Usa o `<dialog>` modal do `sei-comum`: X e Esc fecham, nao ha botao "Cancelar". O dialogo abre no
 * `document` global (a pagina do editor); `doc` e o mesmo documento e serve para o estilo.
 */
export function criarAbridorDeDialogo(css: string): AbrirDialogo {
  const abrirModal = criarAbrirModal();
  return (doc, o) => {
    injetarEstiloBase(doc, css);
    return abrirModal(o);
  };
}

/** Poe o `<style data-seipro-editor="base">` no documento, uma unica vez. */
export function injetarEstiloBase(doc: Document, css: string): void {
  if (doc.querySelector('style[data-seipro-editor="base"]')) return;
  const estilo = doc.createElement("style");
  estilo.setAttribute("data-seipro-editor", "base");
  estilo.textContent = css;
  (doc.head ?? doc.documentElement).append(estilo);
}
