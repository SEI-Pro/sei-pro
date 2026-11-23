/**
 * Diálogos das páginas da extensão (apps dos Favoritos, do Histórico e do
 * Projetos): o `<dialog>` modal com cabeçalho (ícone, título, X) e corpo; a
 * confirmação; o download; o seletor de arquivo. Tudo por `h()`: título e
 * textos entram como texto, nunca como HTML.
 */

import { h, icone, type NomeIcone } from "./dom";

export interface OpcoesModal {
  titulo: string;
  conteudo: HTMLElement;
  icone?: NomeIcone;
  /** Largura em px (a padrao do CSS e 580); em tela estreita o diálogo encolhe para caber. */
  largura?: number;
  aoFechar?: () => void;
}

export type AbrirModal = (o: OpcoesModal) => { fechar(): void };

/** O primeiro campo do corpo (e não o X do cabeçalho, o primeiro focável da árvore). */
const PRIMEIRO_CAMPO =
  ".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";

/**
 * `aoAbrir`/`aoFechar`: o painel embutido usa para pôr o iframe por cima da
 * tela enquanto há diálogo (painel/sobreposicao.ts). O mais novo fica por cima (top layer).
 */
export function criarAbrirModal(g: { aoAbrir?: () => void; aoFechar?: () => void } = {}): AbrirModal {
  return ({ titulo, conteudo, icone: nome, largura, aoFechar }) => {
    const dlg = h("dialog", { class: "spro-dialogo", "aria-label": titulo });
    if (largura) dlg.style.width = `min(${largura}px, calc(100vw - 24px))`;
    const fechar = () => {
      if (dlg.open) dlg.close();
    };
    dlg.append(
      h(
        "header",
        {},
        nome ? h("span", { class: "spro-dialogo-icone", "aria-hidden": "true" }, icone(nome, 18)) : null,
        h("h2", {}, titulo),
        h(
          "button",
          { type: "button", class: "spro-botao-icone", "aria-label": "Fechar", title: "Fechar (Esc)", onclick: fechar },
          icone("fechar", 16),
        ),
      ),
      h("div", { class: "spro-dialogo-corpo" }, conteudo),
    );
    dlg.addEventListener("close", () => {
      dlg.remove();
      g.aoFechar?.();
      aoFechar?.();
    });
    document.body.append(dlg);
    g.aoAbrir?.();
    dlg.showModal();
    dlg.querySelector<HTMLElement>(PRIMEIRO_CAMPO)?.focus({ preventScroll: true });
    return { fechar };
  };
}

/**
 * "Confirmar" ou "Cancelar" (Esc e X também cancelam). `rotuloDesistir` troca o "Cancelar" quando ele seria
 * ambíguo (ex.: "Cancelar a assinatura?" pede "Voltar").
 */
export function criarConfirmar(
  abrirModal: AbrirModal,
): (texto: string, rotuloOk?: string, rotuloDesistir?: string) => Promise<boolean> {
  return (texto, rotuloOk = "Confirmar", rotuloDesistir = "Cancelar") =>
    new Promise<boolean>((ok) => {
      let resposta = false;
      let modal: { fechar(): void } | null = null;
      const corpo = h(
        "div",
        {},
        h("p", {}, texto),
        h(
          "div",
          { class: "spro-dialogo-rodape" },
          h("button", { type: "button", class: "spro-botao", onclick: () => modal?.fechar() }, rotuloDesistir),
          h(
            "button",
            {
              type: "button",
              class: "spro-botao perigo",
              onclick: () => {
                resposta = true;
                modal?.fechar();
              },
            },
            rotuloOk,
          ),
        ),
      );
      modal = abrirModal({ titulo: "Confirmar", icone: "alerta", conteudo: corpo, aoFechar: () => ok(resposta) });
    });
}

/** Baixa um texto como arquivo; o endereço temporário é liberado `revogarEm` ms depois. */
export function baixar(nome: string, conteudo: string, tipo: string, revogarEm = 10_000): void {
  const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
  const a = h("a", { href: url, download: nome });
  document.body.append(a);
  a.click();
  a.remove();
  const t = setTimeout(() => URL.revokeObjectURL(url), revogarEm);
  // Só libera memória: não pode segurar o processo dos testes (Node) aberto.
  (t as unknown as { unref?: () => void }).unref?.();
}

/** O seletor de arquivo comum (sem File System Access): o texto do arquivo, ou null se cancelou. */
export function escolherArquivo(aceitar = ".json,application/json"): Promise<string | null> {
  return new Promise<string | null>((ok) => {
    const i = h("input", { type: "file", accept: aceitar });
    i.addEventListener("change", async () => {
      const f = i.files?.[0];
      ok(f ? await f.text() : null);
    });
    i.addEventListener("cancel", () => ok(null));
    i.click();
  });
}
