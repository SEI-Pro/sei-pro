/**
 * Lista de documentos escolhidos.
 *
 * ACESSIBILIDADE: os botoes de seta sao o caminho PRINCIPAL de reordenacao, nao
 * um plano B. Arrastar e soltar e um atalho opcional por cima. Cada movimento e
 * anunciado por regiao `aria-live` -- quem nao ve a lista precisa saber para
 * onde o item foi.
 *
 * DESEMPENHO: `sincronizar` atualiza o que mudou em vez de reconstruir a lista.
 * Com duzentas paginas no Organizar, refazer a arvore inteira a cada mudanca
 * seria visivel -- e derrubaria o foco do teclado a cada clique de seta.
 */

import { formatarBytes } from "@/lib/ferramentas/formatarBytes";
import type { ArquivoEntrada } from "@/types/ferramentas";
import { el, icone, repor } from "@/ui/dom";

export interface AcoesLista {
  aoMover(de: number, para: number): void;
  aoRemover(id: string): void;
  aoSenha(id: string, senha: string): void;
}

export interface Lista {
  raiz: HTMLElement;
  sincronizar(itens: ArquivoEntrada[], desabilitado: boolean): void;
}

/** Mensagem curta por codigo de erro, para exibir na linha do arquivo. */
async function textoDoErro(codigo: string, nome: string): Promise<string> {
  const { mensagemDeErro } = await import("@/lib/ferramentas/erros");
  return mensagemDeErro(codigo as never, { nome });
}

export function criarListaArquivos(acoes: AcoesLista): Lista {
  const raiz = el("ul", { class: "fpdf-lista" });

  function linha(item: ArquivoEntrada, indice: number, total: number, desabilitado: boolean) {
    const precisaSenha = item.erro === "PDF_PROTEGIDO" || item.diagnostico?.precisaSenha;

    const subir = el(
      "button",
      {
        type: "button",
        class: "fpdf-lista__seta",
        title: "Mover para cima",
        "aria-label": `Mover ${item.nome} para cima`,
        disabled: desabilitado || indice === 0,
        dataset: { acao: "subir", id: item.id },
        onclick: () => acoes.aoMover(indice, indice - 1),
      },
      icone("fas fa-arrow-up"),
    );

    const descer = el(
      "button",
      {
        type: "button",
        class: "fpdf-lista__seta",
        title: "Mover para baixo",
        "aria-label": `Mover ${item.nome} para baixo`,
        disabled: desabilitado || indice === total - 1,
        dataset: { acao: "descer", id: item.id },
        onclick: () => acoes.aoMover(indice, indice + 1),
      },
      icone("fas fa-arrow-down"),
    );

    const remover = el(
      "button",
      {
        type: "button",
        class: "fpdf-lista__remover",
        title: "Remover da lista",
        "aria-label": `Remover ${item.nome}`,
        disabled: desabilitado,
        dataset: { acao: "remover", id: item.id },
        onclick: () => acoes.aoRemover(item.id),
      },
      icone("fas fa-trash-alt"),
    );

    const detalhe = el("span", { class: "fpdf-lista__detalhe" }, formatarBytes(item.tamanho));
    if (item.diagnostico?.paginas) {
      detalhe.append(
        ` · ${item.diagnostico.paginas} ${item.diagnostico.paginas === 1 ? "página" : "páginas"}`,
      );
    }

    const corpo = el(
      "div",
      { class: "fpdf-lista__corpo" },
      el("span", { class: "fpdf-lista__nome", title: item.nome }, item.nome),
      detalhe,
    );

    if (item.erro && !precisaSenha) {
      const aviso = el("p", { class: "fpdf-lista__erro" });
      void textoDoErro(item.erro, item.nome).then((t) => repor(aviso, t));
      corpo.append(aviso);
    }

    if (precisaSenha) {
      const campo = el("input", {
        type: "password",
        class: "fpdf-lista__senha",
        placeholder: "Senha do documento",
        "aria-label": `Senha de ${item.nome}`,
        disabled: desabilitado,
      });
      const enviar = () => {
        const senha = campo.value;
        if (senha) acoes.aoSenha(item.id, senha);
      };
      campo.addEventListener("keydown", (ev: KeyboardEvent) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          enviar();
        }
      });
      corpo.append(
        el(
          "div",
          { class: "fpdf-lista__senha-caixa" },
          el("p", { class: "fpdf-lista__aviso" }, "Este documento pede senha para abrir."),
          campo,
          el(
            "button",
            { type: "button", class: "fpdf-botao fpdf-botao--secundario", disabled: desabilitado, onclick: enviar },
            "Desbloquear",
          ),
        ),
      );
    }

    const assinado = item.diagnostico?.temAssinatura
      ? el(
          "span",
          { class: "fpdf-etiqueta fpdf-etiqueta--atencao", title: "Alterar o arquivo invalida a assinatura" },
          icone("fas fa-signature"),
          " assinado",
        )
      : null;

    return el(
      "li",
      {
        class: `fpdf-lista__item${item.erro ? " fpdf-lista__item--erro" : ""}`,
        dataset: { id: item.id },
      },
      el("span", { class: "fpdf-lista__ordem", "aria-hidden": "true" }, String(indice + 1)),
      corpo,
      assinado,
      el("div", { class: "fpdf-lista__acoes" }, subir, descer, remover),
    );
  }

  return {
    raiz,
    sincronizar(itens: ArquivoEntrada[], desabilitado: boolean) {
      raiz.hidden = itens.length === 0;
      // Preserva o foco: sem isto, clicar numa seta joga o foco no <body> e a
      // navegacao por teclado fica inutilizavel depois do primeiro movimento.
      const ativo = document.activeElement as HTMLElement | null;
      const focoAcao = ativo?.dataset?.acao;
      const focoId = ativo?.dataset?.id;

      repor(raiz, ...itens.map((item, i) => linha(item, i, itens.length, desabilitado)));

      if (focoAcao && focoId) {
        const alvo = raiz.querySelector<HTMLElement>(
          `[data-acao="${focoAcao}"][data-id="${focoId}"]`,
        );
        // Se o botao ficou desabilitado (item chegou ao topo), o foco vai para o
        // par oposto em vez de sumir.
        if (alvo && !(alvo as HTMLButtonElement).disabled) alvo.focus();
        else {
          const oposto = focoAcao === "subir" ? "descer" : "subir";
          raiz
            .querySelector<HTMLElement>(`[data-acao="${oposto}"][data-id="${focoId}"]`)
            ?.focus();
        }
      }
    },
  };
}
